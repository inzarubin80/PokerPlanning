import React, { useRef, useEffect } from 'react';
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
  handleAddComment: (message: string) => void
}

const Comments: React.FC<CommentsProps> = ({ comments, handleAddComment }) => {
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  return (

    <Paper elevation={3} >

<Box position="sticky" top={0}  bgcolor="grey.200" zIndex={1} p={2} display="flex" justifyContent="center" height={"4vh"}>
        <Typography variant="h6">Комментарии</Typography>
      </Box>

      <Box display="flex" height="80vh" flexDirection={"column"} justifyContent={"space-between"}>

        <Box  p={1} overflow="auto">

          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id}>
                <ListItemText primary={comment.text} secondary={`Автор: ${comment.author}`} />
              </ListItem>
            ))}
            <div ref={commentsEndRef} />
          </List>

        </Box>

  
            <CommentForm onAddComment={handleAddComment} />
      
        
      </Box>

    </Paper>

  );
}


export default Comments