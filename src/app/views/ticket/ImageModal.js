import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography
} from "@mui/material";
import Comments from "app/utils/Comment";
import axios from 'axios';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

const ImageModal = ({
  open,
  imageUrl,
  onClose,
  description,
  priority,
  status,
  title,
  client,
  assignedTo,
  ticketId,
  row // Assuming row contains the required row data
}) => {
  const [buttonHide, setButtonHide] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const userId = localStorage.getItem("userId"); // Assuming you have a user context to get the userId
  const [clientEmail, setClientEmail] = useState('');
  const [employeeFromName, setEmployeeFromName] = useState('');
  const [sendEmailStatus, setSendEmailStatus] = useState(false);
  const [errors, setErrors] = useState({});
  const [messageNew, setMessageNew] = useState('');
  const userType = localStorage.getItem("userType");

  const statusOptions = ["Inprogress", "Completed", "YetToAssign", "Rejected"];

  useEffect(() => {
    if (open) {
      setSelectedStatus(status); // Set the initial status when the modal opens
    }
  }, [status, open]);

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

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    updateStatus(ticketId, newStatus, row?.original?.employeeCode); // Pass the updated status and employee code
    setClientEmail(row?.original?.email);
    console.log("TicketRow", row);
  };

  const updateStatus = (ticketId, updatedStatus, employeeCode) => {
    const errors = {};
    if (!updatedStatus) errors.status = "Status is required";

    if (Object.keys(errors).length === 0) {
      const formData = {
        status: updatedStatus,
        empCode: userId,
        id: ticketId
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}/api/ticket/ChangeTicketStatus`, formData)
        .then((response) => {
          console.log("Response:", response.data.paramObjectsMap.ticketAssign.assignedToEmp);
          setEmployeeFromName(response.data.paramObjectsMap.ticketAssign.assignedToEmp);
          toast.success("Status Updated successfully", {
            autoClose: 2000,
            theme: "colored"
          });
          setMessageNew(
            `The following Ticket is ${response.data.paramObjectsMap.ticketAssign.status}, Ticket No : ${response.data.paramObjectsMap.ticketAssign.id}`
          );
          setSendEmailStatus(true);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setErrors(errors);
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.primary" sx={{ flexGrow: 1 }}>
                  <strong>Title:</strong> {title}
                </Typography>
                {userType === "Customer" ? "" : <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    label="Status"
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>}
              </Box>
              <Typography variant="body1" paragraph color="text.primary">
                <strong>Client:</strong> {client}
              </Typography>
              <Typography variant="body1" paragraph color="text.primary">
                <strong>Description:</strong> {description}
              </Typography>
              <Typography variant="body1" paragraph color="text.primary">
                <strong>Priority:</strong> {priority}
              </Typography>
              <Typography variant="body1" paragraph color="text.primary">
                <strong>Status:</strong> {selectedStatus}
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
                  <img
                    src="https://cdn-icons-gif.flaticon.com/8121/8121318.gif"
                    onClick={handleDownload}
                    width={30}
                    height={30}
                    style={{ cursor: 'pointer' }}
                    alt="Download Icon"
                  />
                </Tooltip>
              )}
            </div>

            <br />
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
