import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";

const Comments = ({ ticketId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState("");

    useEffect(() => {
        const getCommentsByTicketId = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/ticket/getCommentsByTicketId?ticketId=${ticketId}`
                );
                if (response.status === 200) {
                    const fetchedComments = response.data.map(comment => ({
                        id: comment.id,
                        comment: comment.comment,
                        commentsTime: comment.commentsTime,
                        commentName: comment.commentName,
                        commonDate: comment.commondate,
                        author: {
                            name: comment.commentName,
                            avatar: "",
                        },
                    }));
                    setComments(fetchedComments);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        getCommentsByTicketId();
    }, [ticketId]);

    const handleAddComment = () => {
        const errors = {};
        if (!newComment) {
            errors.newComment = "Comment text is required";
        }

        if (Object.keys(errors).length === 0) {
            const formData = {
                comment: newComment,
                commentName: localStorage.getItem("userName"), // Replace with actual user name if available
                commentsTime: new Date().toISOString(),
                ticketId: ticketId,
                id: 0,
            };

            axios
                .post(
                    `${process.env.REACT_APP_API_URL}/api/ticket/createComments?ticketId=${ticketId}`,
                    formData
                )
                .then((response) => {
                    const newCommentData = {
                        id: response.data.id, // Assuming the API returns the new comment's ID
                        comment: newComment,
                        commentsTime: response.data.commentsTime, // Assuming the API returns the created comment's time
                        commentName: localStorage.getItem("userName"),
                        commonDate: response.data.commondate,
                        author: {
                            name: localStorage.getItem("userName"),
                            avatar: "",
                        },
                    };
                    setComments([...comments, newCommentData]);
                    setNewComment("");
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            console.error("Validation Error:", errors);
        }
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditedCommentText(comment.comment);
    };

    const handleSaveEdit = (commentId) => {
        const commentToUpdate = comments.find((comment) => comment.id === commentId);

        if (commentToUpdate) {
            const formData = {
                comment: editedCommentText,
                commentName: commentToUpdate.commentName,
                commentsTime: commentToUpdate.commentsTime,
                commonDate: {
                    createdon: commentToUpdate.commonDate.createdon,
                    modifiedon: new Date().toISOString(),
                },
                id: commentId,
                ticketId: ticketId,
            };

            axios
                .put(`${process.env.REACT_APP_API_URL}/api/ticket/updateComments?id=${commentId}&ticketId=${ticketId}`, formData)
                .then(() => {
                    const updatedComments = comments.map((comment) =>
                        comment.id === commentId ? { ...comment, comment: editedCommentText } : comment
                    );
                    setComments(updatedComments);
                    setEditingCommentId(null);
                    setEditedCommentText("");
                })
                .catch((error) => {
                    console.error("Error updating comment:", error);
                });
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditedCommentText("");
    };

    const handleDeleteComment = (commentId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/api/ticket/deleteCommentsById/${commentId}`)
            .then(() => {
                const updatedComments = comments.filter((comment) => comment.id !== commentId);
                setComments(updatedComments);
            })
            .catch((error) => {
                console.error("Error deleting comment:", error);
            });
    };

    // Function to generate background color based on name
    const getAvatarColor = (name) => {
        const colors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#ff5722'];
        // Generate a hash based on name to select a color
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = hash % colors.length;
        return colors[index];
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Comments
            </Typography>
            {comments.length === 0 ? (
                <Typography variant="body1">No comments available</Typography>
            ) : (
                <List>
                    {comments.map((comment) => (
                        <ListItem key={comment.id} alignItems="flex-start">
                            <Card style={{ width: '100%', marginBottom: '5px', backgroundColor: '#ffffff', boxShadow: '0 3px 6px rgba(0,0,0,0.1)' }}>
                                <CardContent>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid item xs={12} sm={editingCommentId === comment.id ? 9 : 10}>
                                            <Grid container alignItems="center">
                                                <Grid item>
                                                    <ListItemAvatar>
                                                        <Avatar alt={comment.author.name} className={`avatar-${comment.author.name.charAt(0).toLowerCase()}`} style={{ backgroundColor: getAvatarColor(comment.author.name) }}>
                                                            {comment.author.name.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1" component="span">
                                                        {comment.author.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" component="span" style={{ marginLeft: '10px' }}>
                                                        {formatDistanceToNow(new Date(comment.commonDate.createdon))} ago
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            {editingCommentId === comment.id ? (
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={editedCommentText}
                                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                                    style={{ marginTop: '10px' }}
                                                />
                                            ) : (
                                                <Typography variant="body1" component="p" style={{ marginTop: '10px' }}>
                                                    {comment.comment}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={editingCommentId === comment.id ? 3 : 2} style={{ textAlign: 'right' }}>
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
                                </CardContent>
                            </Card>
                        </ListItem>
                    ))}
                </List>
            )}
            <Box mt={2} display="flex" alignItems="center">
                <TextField
                    fullWidth
                    size="small"
                    label="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    variant="outlined"
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
