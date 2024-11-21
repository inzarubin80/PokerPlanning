import React, { useState } from 'react';
import {
  Button,
  TextField,
} from '@mui/material';

interface CommentFormProps {
    onAddComment: (text: string) => void;
  }

const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
    const [text, setText] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onAddComment(text);
      setText('');
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <TextField
          label="Комментарий"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Добавить комментарий
        </Button>
      </form>
    );
  };

  export default CommentForm