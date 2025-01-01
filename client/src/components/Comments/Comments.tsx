import React, { useRef, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import { CommentItem } from '../../model';
import CommentForm from '../CommentForm/CommentForm';
import { SaveCommentParams } from '../../features/comment/commentSlice';
import { AppDispatch, RootState } from '../../app/store';

import { useDispatch, useSelector } from 'react-redux';

interface CommentsProps {
  handleAddComment: (saveCommentParams: SaveCommentParams) => void;
}

const Comments: React.FC<CommentsProps> = ({ handleAddComment }) => {
  const commentsEndRef = useRef<HTMLDivElement>(null);

    const comments = useSelector((state: RootState) => state.commentReducer.comments);
    const users = useSelector((state: RootState) => state.poker.users);


  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  return (
    <Paper elevation={3}>
      {/* Header */}
      <Box
        position="sticky"
        top={0}
        bgcolor="grey.200"
        zIndex={1}
        p={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={"4vh"}
      >
        <Typography variant="h6">Комментарии</Typography>
      </Box>

      {/* Main Content */}
      <Box display="flex" height="80vh" flexDirection="column" justifyContent="space-between">
        {/* Comments List */}
        <Box p={1} overflow="auto">
          <List>
            {comments.map((comment) => (
              <ListItem
                key={comment.ID}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  '& .MuiListItemText-primary': {
                    whiteSpace: 'pre-wrap', // Перенос строк
                    overflowWrap: 'break-word', // Перенос слов
                  },
                }}
              >
                <ListItemText
                  primary={comment.Text}
                  secondary={`Автор: ${users.get(comment.UserID)?.Name}`}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
            <div ref={commentsEndRef} />
          </List>
        </Box>

        {/* Comment Form */}
        <Box p={2}>
          <CommentForm onAddComment={handleAddComment} />
        </Box>
      </Box>
    </Paper>
  );
};

export default Comments;