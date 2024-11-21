import React from 'react';
import {
  Grid2, 
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import { CommentItem } from '../../model';

import CommentForm from '../CommentForm'

interface CommentsProps {
   comments: CommentItem[];
   handleAddComment: (message:string) => void
}

const Comments: React.FC<CommentsProps> = ({comments, handleAddComment}) => {
    return (
      <Grid2  size={{xs:3}}>
      <Paper elevation={3}>
        <Box p={2}>
          <Typography variant="h6">Комментарии</Typography>
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id}>
                <ListItemText primary={comment.text} secondary={`Автор: ${comment.author}`} />
              </ListItem>
            ))}
          </List>
          <CommentForm onAddComment={handleAddComment} />
        </Box>
      </Paper>
    </Grid2>
    );
  }
  

export default Comments
