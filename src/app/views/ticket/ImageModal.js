import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from '@mui/icons-material/Download';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import Comments from "app/utils/Comment";
import { useState } from "react";

const ImageModal = ({
  open,
  imageUrl,
  onClose,
  description,
  priority,
  status,
  title,
  assignedTo, ticketId
}) => {
  const [buttonHide, setButtonHide] = useState(false);

  console.log("imageTest", ticketId)

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "ticket_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Ticket Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "inherit" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {imageUrl ? (
          <div style={{ padding: "16px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
            <Box
              sx={{
                padding: 2,
                backgroundColor: "background.paper",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                marginBottom: 2,
                boxShadow: 1
              }}
            >
              <Typography variant="h6" gutterBottom color="text.primary">
                <strong>Title:</strong> {title}
              </Typography>
              <Typography variant="body1" paragraph color="text.primary">
                <strong>Description:</strong> {description}
              </Typography>
              <Typography variant="body1" paragraph color="text.primary">
                <strong>Priority:</strong> {priority}
              </Typography>
              <Typography variant="body1" paragraph color="text.primary">
                <strong>Status:</strong> {status}
              </Typography>
              {assignedTo && (
                <Typography variant="body1" paragraph color="text.primary">
                  <strong>Assigned To:</strong> {assignedTo}
                </Typography>
              )}
            </Box>
            <div style={{ textAlign: "center", marginTop: "20px", position: "relative" }}>
              <img
                src={imageUrl}
                alt="Ticket Image"
                style={{ maxWidth: "80%", borderRadius: "8px" }}
                onError={(e) => {
                  e.target.style.display = "none"; // Hide the image if an error occurs
                  setButtonHide(true); // Set buttonHide state to true on error
                }}

              />

              {!buttonHide && (
                <Tooltip title="Download" placement="right">
                  {" "}


                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownload}
                    style={{ position: "absolute", top: 10, right: 10, cursor: "pointer" }}
                  >
                    <DownloadIcon />
                  </Button>
                </Tooltip>
              )}
            </div>

            <br></br>
            <Comments ticketId={ticketId} />
          </div>
        ) : (
          <Typography
            variant="body1"
            style={{ textAlign: "center", marginTop: "20px", color: "#555" }}
          >
            No image found.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
