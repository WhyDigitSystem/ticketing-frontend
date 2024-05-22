import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";

const ImageModal = ({
  open,
  imageUrl,
  onClose,
  description,
  priority,
  status,
  title,
  assignedTo
}) => {
  const [buttonHide, setButtonHide] = useState(false);

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
                padding: "16px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "16px"
              }}
            >
              <Typography variant="subtitle1" gutterBottom style={{ color: "#555" }}>
                <strong>Title:</strong> {title}
              </Typography>
              <Typography variant="body1" paragraph style={{ color: "#555" }}>
                <strong>Description:</strong> {description}
              </Typography>
              <Typography variant="body1" paragraph style={{ color: "#555" }}>
                <strong>Priority:</strong> {priority}
              </Typography>
              <Typography variant="body1" paragraph style={{ color: "#555" }}>
                <strong>Status:</strong> {status}
              </Typography>
              {assignedTo && (
                <Typography variant="body1" paragraph style={{ color: "#555" }}>
                  <strong>Assigned To:</strong> {assignedTo}
                </Typography>
              )}
            </Box>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <img
                src={imageUrl}
                alt="Ticket Image"
                style={{ maxWidth: "100%", borderRadius: "8px" }}
                onError={(e) => {
                  e.target.style.display = "none"; // Hide the image if an error occurs
                  setButtonHide(true); // Set buttonHide state to true on error
                }}
              />
              {!buttonHide && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                  style={{ marginTop: "10px" }}
                >
                  Download Image
                </Button>
              )}
            </div>
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
