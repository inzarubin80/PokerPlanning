import React, { useRef, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import CommentForm from '../CommentForm/CommentForm';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';

interface CommentsProps {
  pokerID: string;
}

const Comments: React.FC<CommentsProps> = ({ pokerID }) => {
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const { comments } = useSelector((state: RootState) => state.commentReducer);
  const { users } = useSelector((state: RootState) => state.pokerReducer);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      height="100%" // Занимаем всю доступную высоту
      sx={{
        overflow: 'hidden', // Скрываем переполнение основного контейнера
      }}
    >
      {/* Контейнер для списка комментариев с возможностью прокрутки */}
      <Box
        ref={listContainerRef}
        flex={1} // Занимает все доступное пространство
        overflow="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          }
        }}
      >
        <List disablePadding sx={{ p: 2 }}>
          {comments.map((comment) => (
            <ListItem
              key={comment.ID}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                boxShadow: 1,
                alignItems: 'flex-start',
              }}
            >
              <ListItemText
                primary={comment.Text}
                secondary={`Автор: ${users.find(user => user.ID === comment.UserID)?.Name || 'Неизвестный'}`}
                primaryTypographyProps={{ 
                  variant: 'body1',
                  sx: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' }
                }}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  color: 'text.secondary'
                }}
              />
            </ListItem>
          ))}
          <div ref={commentsEndRef} />
        </List>
      </Box>

      {/* Форма комментария, прижатая к низу */}
      <Box 
        p={2} 
        borderTop={1} 
        borderColor="divider"
        flexShrink={0} // Запрещаем сжатие
        sx={{
          backgroundColor: 'background.paper', // Фон для формы
          position: 'sticky',
          bottom: 0,
        }}
      >
        <CommentForm pokerID={pokerID}/>
      </Box>
    </Box>
  );
};

export default Comments;