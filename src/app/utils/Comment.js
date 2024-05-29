import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";

const staticComments = [
  {
    id: 1,
    text: "This is the first comment.",
    createdAt: "2024-05-28T12:34:56Z",
    author: {
      name: "Samantha",
      avatar: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    id: 2,
    text: "This is the second comment.",
    createdAt: "2024-05-28T14:56:23Z",
    author: {
      name: "karthikn",
      avatar: "https://i.pravatar.cc/150?img=2"
    }
  }
];

const Comments = ({ ticketId }) => {
  const [comments, setComments] = useState(staticComments); // Using static comments for now
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  const handleAddComment = () => {
    const newCommentData = {
      id: comments.length + 1,
      text: newComment,
      createdAt: new Date().toISOString(),
      author: {
        name: "Current User",
        avatar: "https://i.pravatar.cc/150?img=3"
      }
    };
    setComments([...comments, newCommentData]);
    setNewComment("");
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.text);
  };

  const handleSaveEdit = (commentId) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, text: editedCommentText } : comment
    );
    setComments(updatedComments);
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    setComments(updatedComments);
  };

  return (
    <Box>
      <div>
        <h5>Comments</h5>
      </div>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={comment.author.name} src={comment.author.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1" component="span">
                  {comment.author.name}
                </Typography>
              }
              secondary={
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item xs={editingCommentId === comment.id ? 9 : 10}>
                    {editingCommentId === comment.id ? (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" color="textSecondary" component="span">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" component="p">
                          {comment.text}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={editingCommentId === comment.id ? 3 : 2}>
                    {editingCommentId === comment.id ? (
                      <>
                        <IconButton onClick={() => handleSaveEdit(comment.id)}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleCancelEdit}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEditComment(comment)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteComment(comment.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Grid>
                </Grid>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box mt={2} display="flex" alignItems="center">
        <TextField
          fullWidth
          size="small"
          label="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          style={{ marginLeft: "10px" }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;
