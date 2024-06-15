import ClearIcon from "@mui/icons-material/Clear";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, Tooltip, } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { default as TextArea, default as TextField } from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import EmailConfig from "app/utils/SendMail";
import axios from "axios";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllTickets from "./alltickets";
import "./ticket.css";

const Ticket = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);

  const [createdby, setCreatedBy] = useState("admin");
  const [modifiedby, setModifiedBy] = useState("admin");
  const [client, setClient] = useState(localStorage.getItem("company"));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [docdate, setDocDate] = useState(dayjs());
  const [errors, setErrors] = useState({});
  const [listView, setListView] = useState(localStorage.getItem("userType") === "Employee" ? true : false);
  const [files, setFiles] = useState([]);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [emailFlag, setEmailFlag] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketResponse, setTicketResponse] = useState({}); // New state to hold ticket response

  const handleInputChange = (event) => {
    const { name, value, files: newFiles } = event.target;
    switch (name) {
      case "client":
        setClient(value);
        break;
      case "createdby":
        setCreatedBy(value);
        break;
      case "modifiedby":
        setModifiedBy(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "priority":
        setPriority(value);
        break;
      case "files":
        setFiles(newFiles);
        setSelectedFiles(Array.from(newFiles).map((file) => file.name));
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setFiles([]);
  };

  const handleListViewChange = () => {
    setListView(!listView);
  };

  const handleTicket = () => {
    const errors = {};
    if (!description) {
      errors.description = "Description is required";
    }
    if (Object.keys(errors).length === 0) {
      const formData = {
        client,
        createdby,
        description,
        modifiedby,
        priority,
        title,
        email: userId
      };

      axios
        .post(`${process.env.REACT_APP_API_URL}/api/ticket/createticket`, formData)
        .then((response) => {
          console.log("Response:", response.data);
          const ticketVO = response.data.paramObjectsMap.ticketVO;
          setTicketResponse(ticketVO); // Save the response data to state
          setMessage(
            `You receive a new ticket from ${response.data.paramObjectsMap.ticketVO.client}, Ticket No : ${ticketVO.id}`
          );

          if (files.length > 0) {
            const uploadData = new FormData();
            uploadData.append("id", ticketVO.id);
            Array.from(files).forEach((file) => {
              uploadData.append(`file`, file);
            });

            return axios.post(`${process.env.REACT_APP_API_URL}/api/ticket/upload`, uploadData);
          }
        })
        .then((uploadResponse) => {
          if (uploadResponse) {
            console.log("Upload Response:", uploadResponse.data);
          }

          setClient("");
          setTitle("");
          setDescription("");
          setPriority("");
          setFiles([]);
          setSelectedFiles([]);
          setEmailFlag(true); // Set email flag to true after setting all other states
          toast.success("Ticket Created successfully", {
            autoClose: 2000,
            theme: "colored"
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setErrors(errors);
    }
  };

  const handleBack = () => {
    setListView(false);
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>

      <div className="card w-full p-3 bg-base-100 shadow-lg customized-container">
        {!listView && (
          <>
            <div className="flex justify-between mb-1">
              <h5 className="">New Ticket</h5>
            </div>
            <div className="d-flex flex-row">

              <Link to="/dashboard/default">
                <Tooltip title="Back" placement="top">
                  <img src="https://cdn-icons-gif.flaticon.com/7740/7740497.gif" style={{
                    position: "absolute",
                    left: 950,
                    fontSize: "40px"
                  }} width={40} height={40}></img></Tooltip>
              </Link>
            </div></>
        )}

        {!listView && (
          <div
            className="d-flex flex-wrap justify-content-start"
            style={{ gap: "10px", cursor: "pointer", padding: "20px" }}
          >
            <Tooltip title="Search" placement="top">
              <SearchIcon size="2rem" stroke={1.5} />


            </Tooltip>
            <Tooltip title="Clear" placement="top">
              <ClearIcon size="2rem" stroke={1.5} onClick={handleClear} />
            </Tooltip>
            <Tooltip title="List View" placement="top">
              <FormatListBulletedTwoToneIcon
                size="2rem"
                stroke={1.5}
                onClick={handleListViewChange}
              />
            </Tooltip>
            <Tooltip title="Save" placement="top">
              <SaveIcon size="2rem" stroke={1.5} onClick={handleTicket} />
            </Tooltip>

          </div>
        )}

        {listView && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {userType !== "Employee" && (
                <IconButton onClick={() => setListView(false)}>
                  {/* Replace the icon with your back button icon */}
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
            <AllTickets
              view={handleBack}
              listView={listView}
              hideStatus={userType === "Customer"}
            />
          </>
        )}



        {!listView ? (
          <div className="row d-flex" style={{ padding: "20px 20px 0px 20px" }}>
            <div className="col-md-4 mb-3">
              <TextField
                id="outlined-textarea"
                onChange={handleInputChange}
                label="Title"
                name="title"
                value={title}
                placeholder=""
                multiline
                variant="outlined"
                size="small"
                fullWidth
              />
            </div>
            <div className="col-md-2 mb-3">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="priority"
                  onChange={handleInputChange}
                  value={priority}
                  placeholder=""
                  label="Priority"
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-md-12 mb-3">
              <TextArea
                rows={4}
                cols={40}
                id="Old Rate"
                name="description"
                onChange={handleInputChange}
                label="Description"
                value={description}
                placeholder=""
                multiline
                variant="outlined"
                size="small"
                fullWidth
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="file"
                id="file-input"
                name="files"
                onChange={handleInputChange}
                multiple
                style={{ display: "none" }}
              />
              <label htmlFor="file-input">
                <img
                  src="https://cdn-icons-gif.flaticon.com/8121/8121319.gif"
                  width={40}
                  height={40}
                  style={{ cursor: "pointer", marginLeft: "12px" }}
                ></img>
                <div>File Upload</div>
              </label>
              <div>
                {selectedFiles.map((fileName, index) => (
                  <div key={index}>{fileName}</div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {emailFlag && (
        <EmailConfig
          updatedEmployee={"Admin"}
          toEmail={"karthikeyan@whydigit.in"}
          message={message}
          title={ticketResponse.title}
          description={ticketResponse.description}
          priority={ticketResponse.priority}
        />
      )}
    </>
  );
};

export default Ticket;
