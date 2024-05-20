import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import Button from "@mui/material/Button";

const ImageModal = ({ open, imageUrl, onClose }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "ticket_image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Image Preview
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "inherit" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div style={{ textAlign: "center" }}>
          <img src={imageUrl} alt="Ticket Image" style={{ maxWidth: "100%" }} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
            style={{ marginTop: "10px" }}
          >
            Download Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
