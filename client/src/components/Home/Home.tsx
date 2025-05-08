import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLastSessionPoker, loadMoreSessions, deletePokerWithAllRelations } from '../../features/poker/pokerSlice';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { AppDispatch, RootState } from '../../app/store';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import { LastSessionPoker } from '../../model/model';
import { useNavigate } from 'react-router-dom';
import { EmailOutlined, Telegram } from '@mui/icons-material';
import ObjectivityImg from '../../images/Objectivity.svg';
import SaveTimeImg from '../../images/SaveTime.svg';
import SharedUnderstandingImg from '../../images/SharedUnderstanding.svg';
import TeamCollaborationImg from '../../images/TeamCollaboration.svg';



const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    sessions,
    loading,
    hasMore,
    page
  } = useSelector((state: RootState) => state.pokerReducer.session);

  const navigate = useNavigate();

  const handleCardClick = useCallback((pokerId: string) => {
    navigate(`/poker/${pokerId}`);
  }, [navigate]);


  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<LastSessionPoker | null>(null);


  const handleOpenDeleteModal = (room: LastSessionPoker) => {
    setSessionToDelete(room);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSessionToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      dispatch(deletePokerWithAllRelations(sessionToDelete.PokerID));
      handleCloseDeleteModal();
    }
  };

  // Обработчик кнопки "Загрузить еще"
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      dispatch(loadMoreSessions());
    }
  }, [hasMore, loading, dispatch]);



  // Загрузка первых данных
  useEffect(() => {
    dispatch(getLastSessionPoker());
  }, [dispatch]);


  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{
        textAlign: 'center',
        py: 8,
        background: 'linear-gradient(45deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 3,
        width: '100%',
        my: 4
      }}>
        <Typography variant="h2" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
          Покер планирования
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
          Совместная оценка задач для Agile команд
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(`/new`)}
          sx={{ px: 6, py: 1.5, fontSize: '1.2rem' }}
        >
          Начать оценку
        </Button>
      </Box>

      {/* Недавние сессии */}
      {sessions?.length > 0 && (
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>Недавние сессии</Typography>
          <Grid container spacing={3}>
            {sessions.map((room) => {
              const sessionUrl = `${window.location.origin}/poker/${room.PokerID}`;

              return (
                <Grid item xs={12} sm={6} md={4} key={room.PokerID}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          minHeight: '3em', // Высота двух строк (1.5em на строку)
                          lineHeight: '1.5em',
                        }}
                      >
                        {room.Name || `Сессия #${room.PokerID}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {room.IsAdmin ? "Администратор" : "Участник"}
                      </Typography>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleCardClick(room.PokerID)}
                          sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            pr: 1, // небольшой отступ справа
                          }}
                          endIcon={<KeyboardArrowRightIcon />}
                        >
                          Перейти
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(sessionUrl);
                          }}
                          sx={{ minWidth: 40 }}
                        >
                          <FileCopyIcon fontSize="small" />
                        </Button>

                        {/* Кнопка удаления */}
                        {room.IsAdmin && <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenDeleteModal(room)}
                          sx={{ minWidth: 40 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>}

                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Кнопка "Загрузить еще" и индикатор загрузки */}
          <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
            {loading ? (
              <CircularProgress />
            ) : hasMore ? (
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Загрузить еще
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Все сессии загружены
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Что такое Planning Poker? */}
      <Box sx={{
        my: 8,
        p: 6,
        backgroundColor: '#f8f9fa',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="h4" sx={{
          mb: 6,
          textAlign: 'center',
          fontWeight: 600
        }}>
          Что такое Planning Poker?
        </Typography>

        <Box sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 3,
          height: 400,
          maxWidth: 800,
          margin: '0 auto 40px',
          backgroundImage: `url(${TeamCollaborationImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
          <Typography variant="body1" paragraph sx={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            mb: 3,
            textAlign: 'justify'
          }}>
            Planning Poker® - это консенсус-ориентированная методика оценки задач,
            разработанная для Agile команд. Основные принципы:
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              'Анонимное голосование для исключения группового влияния',
              'Использование последовательности Фибоначчи для оценки сложности',
              'Итеративное обсуждение расхождений в оценках',
              'Фокус на относительной сложности задач'
            ].map((text, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'rgba(25, 118, 210, 0.05)',
                  borderRadius: 2
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    mr: 2
                  }} />
                  <Typography variant="body1">{text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.open('https://ru.wikipedia.org/wiki/Покер_планирования', '_blank')}
              sx={{
                px: 6,
                borderRadius: 4,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              Узнать больше о методике
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Преимущества методики */}
      <Box sx={{
        my: 8,
        p: 6,
        backgroundColor: '#f8f9fa',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="h4" sx={{ mb: 6, textAlign: 'center' }}>
          Преимущества методики
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: 'Объективность оценок',
              text: 'Анонимность исключает давление мнения большинства',
              img: ObjectivityImg
            },
            {
              title: 'Экономия времени',
              text: 'Структурированный процесс вместо бесконечных споров',
              img: SaveTimeImg
            },
            {
              title: 'Совместное понимание',
              text: 'Обсуждение расхождений выявляет нюансы задач',
              img: SharedUnderstandingImg
            }
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{
                height: 200,
                backgroundImage: `url(${item.img})`,
                backgroundSize: 'cover',
                mb: 2,
                borderRadius: 3
              }} />
              <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>{item.title}</Typography>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>{item.text}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Как это работает */}
      <Box sx={{
        my: 8,
        p: 6,
        backgroundColor: '#f8f9fa',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="h4" sx={{ mb: 6, textAlign: 'center' }}>
          Как это работает?
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: 'Создайте сессию',
              text: 'Начните новую сессию оценки, выбрав стратегию и параметры планирования'
            },
            {
              title: 'Пригласите команду',
              text: 'Отправьте ссылку на сессию участникам для совместной работы'
            },
            {
              title: 'Проведите оценку',
              text: 'Обсуждайте задачи и голосуйте анонимно для объективных результатов'
            }
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{
                height: 200,
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                p: 3
              }}>
                <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                  {index + 1}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>{item.text}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Секция с контактами */}
      <Box sx={{
        my: 6,
        p: 4,
        bgcolor: 'grey.100',
        borderRadius: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
          Свяжитесь с нами
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<EmailOutlined />}
              href="mailto:inzarubin80@yandex.ru"
              sx={{
                borderRadius: 4,
                py: 1.5,
                textTransform: 'none'
              }}
            >
              inzarubin80@yandex.ru
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Telegram />}
              href="https://t.me/poker_planning"
              target="_blank"
              rel="noopener"
              sx={{
                borderRadius: 4,
                py: 1.5,
                textTransform: 'none'
              }}
            >
              @poker_planning
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить сессию "{sessionToDelete?.Name || `Сессия #${sessionToDelete?.PokerID}`}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Отмена</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default Home;