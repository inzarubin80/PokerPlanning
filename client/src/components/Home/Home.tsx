import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUser } from '../../features/user/userSlice';
import { AppDispatch } from '../../app/store';
import { 
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { EmailOutlined, Telegram } from '@mui/icons-material';


import ObjectivityImg from '../../images/Objectivity.jpg';
import SaveTimeImg from '../../images/SaveTime.jpg';
import SharedUnderstandingImg from '../../images/SharedUnderstanding.jpg';
import TeamCollaborationImg from '../../images/TeamCollaboration.jpg';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isPokerFormOpen, setIsPokerFormOpen] = useState(false);
  //const recentRooms = [{"id": 1, "status": "open", "participants":0, "name": "Команда ураган"}];
  const recentRooms: any[] = [];

    const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUser());
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
          onClick={() =>  navigate(`/new`)}
          sx={{ px: 6, py: 1.5, fontSize: '1.2rem' }}
        >
          Начать оценку
        </Button>
      </Box>

      {/* Недавние сессии */}
      {recentRooms?.length > 0 && (
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>Недавние сессии</Typography>
          <Grid container spacing={3}>
            {recentRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Card variant="outlined">
                  <CardActionArea onClick={() => window.location.href = `/poker/${room.id}`}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {room.name || `Сессия #${room.id}`}
                      </Typography>
                      <Chip 
                        label={room.status} 
                        size="small"
                        color={room.status === 'active' ? 'success' : 'default'}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Участников: {room.participants}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
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
        }}/>

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
                  }}/>
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
              }}/>
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
              href="https://t.me/pokerx_channel"
              target="_blank"
              rel="noopener"
              sx={{
                borderRadius: 4,
                py: 1.5,
                textTransform: 'none'
              }}
            >
              @pokerx_updates
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;