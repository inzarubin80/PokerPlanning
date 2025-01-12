import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { SaveCommentParams } from '../../features/comment/commentSlice';
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
      const saveCommentParams: SaveCommentParams = {
        callback: () => setText(''),
        comment: {
          ID: -1,
          PokerID: pokerId,
          Text: text,
          UserID:-1,
        },
        pokerID: '',
      };
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