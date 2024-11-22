import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {SaveCommentParams} from '../../features/comment/commentSlice';
import { useParams } from 'react-router-dom';

interface CommentFormProps {
  onAddComment: (saveCommentParams: SaveCommentParams) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
  const [text, setText] = useState('');

  const { pokerId } = useParams<{ pokerId: string }>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && pokerId) {
    
      
     const saveCommentParams:SaveCommentParams = {
      callback:()=>{ setText('');},
      comment:{

        id:-1,
        poker_id:pokerId,
        text:text,
        user_id:"Бран старк"

      },
      pokerID:"" 
    }
      onAddComment(saveCommentParams);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box p={2} display="flex" flexDirection="column" alignItems="flex-start">
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
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          style={{ width: '220px'}}
        >
          Отправить
        </Button>
      </Box>
    </form>
  );
};

export default CommentForm;