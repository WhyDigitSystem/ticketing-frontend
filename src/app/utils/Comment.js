import AttachmentIcon from '@mui/icons-material/Attachment';
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from '@mui/icons-material/Send';
import {
    Avatar, Box, Button,
    Card,
    CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";
import NoRecordsFound from './NoRecordsFound';

const Comments = ({ ticketId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);
    const [renderFunction, setRenderFunction] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogImage, setDialogImage] = useState(null);
    const currentUserName = localStorage.getItem("userName"); // Get the current logged-in user's name

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
                        images: comment.ticketCommentImageVO.map(image => image.commentImage),
                    }));
                    setComments(fetchedComments);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        getCommentsByTicketId();
    }, [ticketId, renderFunction]);

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
                    images: comment.ticketCommentImageVO.map(image => image.commentImage),
                }));
                setComments(fetchedComments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleImageClick = (image) => {
        setDialogImage(image);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogImage(null);
    };

    const handleAddComment = () => {
        const errors = {};
        if (!newComment) {
            errors.newComment = "Comment text is required";
        }

        if (Object.keys(errors).length === 0) {
            const formData = {
                comment: newComment,
                commentName: currentUserName,
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
                        id: response.data.id,
                        comment: newComment,
                        commentsTime: response.data.commentsTime,
                        commentName: currentUserName,
                        commonDate: response.data.commondate,
                        author: {
                            name: currentUserName,
                            avatar: "",
                        },
                        images: [], // Initially no images for a new comment
                    };

                    // Update comments state with new comment
                    setComments([...comments, newCommentData]);
                    setRenderFunction(true)
                    setNewComment("");

                    // Check if there is a selected image to upload
                    if (selectedImage) {
                        const formData = new FormData();
                        formData.append("commentId", response.data.id); // Assuming the API expects commentId to associate with image
                        formData.append("file", selectedImage);

                        // Upload image to /api/ticket/uploadCommentImage
                        axios
                            .post(
                                `${process.env.REACT_APP_API_URL}/api/ticket/uploadCommentImage`,
                                formData,
                                {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                }
                            )
                            .then((uploadResponse) => {
                                console.log("Image uploaded successfully:", uploadResponse);
                                setSelectedImage(null);
                                setSelectedImagePreview(null); // Clear the preview after upload
                                getCommentsByTicketId();
                            })
                            .catch((uploadError) => {
                                console.error("Error uploading image:", uploadError);
                            });
                    }
                })
                .catch((error) => {
                    console.error("Error creating comment:", error);
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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        setSelectedImagePreview(URL.createObjectURL(file));
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Comments
            </Typography>
            {comments.length === 0 ? (
                <NoRecordsFound message="No comments Found" />
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
                                                            {comment.author.name.charAt(0)}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                </Grid>
                                                <Grid item>
                                                    <Typography component="span" variant="h6" style={{ fontSize: '1rem' }}>
                                                        {comment.author.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" component="span" style={{ marginLeft: 8 }}>
                                                        {formatDistanceToNow(new Date(comment.commentsTime), { addSuffix: true })}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Box mt={1}>
                                                {editingCommentId === comment.id ? (
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        value={editedCommentText}
                                                        onChange={(e) => setEditedCommentText(e.target.value)}
                                                        multiline
                                                    />
                                                ) : (
                                                    <Typography variant="body1">{comment.comment}</Typography>
                                                )}
                                            </Box>
                                            {comment.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={`data:image/png;base64,${image}`}
                                                    alt={`Comment ${comment.id} Image ${index + 1}`}
                                                    style={{ maxWidth: '150px', maxHeight: '150px', marginRight: '10px', marginTop: '10px', cursor: 'pointer' }}
                                                    onClick={() => handleImageClick(`data:image/png;base64,${image}`)}
                                                />
                                            ))}
                                        </Grid>
                                        <Grid item>
                                            {comment.author.name === currentUserName && (
                                                <>
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
            <Box display="flex" alignItems="center">
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <>
                                <InputAdornment position="end">
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="comment-image-upload"
                                        type="file"
                                        onChange={handleImageUpload}
                                    />
                                    <label htmlFor="comment-image-upload">
                                        <IconButton component="span">
                                            <AttachmentIcon />
                                        </IconButton>
                                    </label>
                                </InputAdornment>
                                <InputAdornment position="end">
                                    <IconButton onClick={handleAddComment}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            </>
                        ),
                    }}
                />
            </Box>
            {selectedImagePreview && (
                <Box mt={2} display="flex" alignItems="center">
                    <img
                        src={selectedImagePreview}
                        alt="Selected"
                        style={{ width: "100px", height: "auto", marginRight: "16px" }}
                    />
                    <Button variant="contained" color="secondary" onClick={() => {
                        setSelectedImage(null);
                        setSelectedImagePreview(null);
                    }}>
                        Remove
                    </Button>
                </Box>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Image Preview  <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CancelIcon />
                </IconButton></DialogTitle>
                <DialogContent>
                    <img src={dialogImage} alt="Dialog Image" style={{ width: '100%', height: 'auto' }} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Comments;
