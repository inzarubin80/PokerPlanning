import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom';
import {  AppDispatch, RootState } from '../../app/store';
import { addComment, SaveCommentParams} from '../../features/comment/commentSlice';
import { useDispatch, useSelector } from 'react-redux';

interface CommentFormProps {
  pokerID: string
}

const CommentForm: React.FC<CommentFormProps> = ({pokerID}) => {
  const [text, setText] = useState('');
  const { pokerId } = useParams<{ pokerId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const taskID = useSelector((state: RootState) => state.volumeReducer.taskData.id);


    // Метод добавления комментария
    const handleAddComment = (text: string) => {
      if (!text.trim()) return;
      
      const commentData: SaveCommentParams = {
        pokerID:  pokerID, // ID покера (из пропсов)
         comment: {
          ID: -1,
          Text: text,
          UserID: -1, 
          PokerID: pokerID,
          TaskID: taskID
        },
        callback:()=>{setText('')}
      };
      dispatch(addComment(commentData));
    };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && pokerId) {
      
      handleAddComment(text.trim())
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="stretch">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Комментарий"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
          variant="outlined"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            fullWidth // Растягиваем кнопку на всю ширину
          >
            Отправить
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CommentForm;