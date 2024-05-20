import ClearIcon from "@mui/icons-material/Clear";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, ButtonBase, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { default as TextArea, default as TextField } from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
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
  const [client, setClient] = useState("Casio");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [docdate, setDocDate] = useState(dayjs());
  const [errors, setErrors] = useState({});
  const [listView, setListView] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

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
        title
      };

      axios
        .post(`${process.env.REACT_APP_API_URL}/api/ticket/createticket`, formData)
        .then((response) => {
          console.log("Response:", response.data);
          const ticketId = response.data.paramObjectsMap.ticketVO.id;

          if (files.length > 0) {
            const uploadData = new FormData();
            uploadData.append("id", ticketId);
            Array.from(files).forEach((file, index) => {
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
      {listView ? (
        <AllTickets view={handleBack} listView={listView} />
      ) : (
        <div className="card w-full p-3 bg-base-100 shadow-lg customized-container backgroundclr">
          <div className="flex justify-between mt-3 mb-3">
            <h7 className="ticketheader">New Ticket</h7>
          </div>
          <div
            className="d-flex flex-wrap justify-content-start mb-2"
            style={{ marginBottom: "20px" }}
          >
            <Tooltip title="Search" placement="top">
              <ButtonBase sx={{ borderRadius: "12px", marginRight: "10px" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: "all .2s ease-in-out",
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.primary.dark,
                      color: theme.palette.primary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <SearchIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <Tooltip title="Clear" placement="top">
              <ButtonBase sx={{ borderRadius: "12px", marginRight: "10px" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: "all .2s ease-in-out",
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.primary.dark,
                      color: theme.palette.primary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleClear}
                >
                  <ClearIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <Tooltip title="List View" placement="top">
              <ButtonBase sx={{ borderRadius: "12px" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: "all .2s ease-in-out",
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.primary.dark,
                      color: theme.palette.primary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleListViewChange}
                >
                  <FormatListBulletedTwoToneIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <Tooltip title="Save" placement="top">
              <ButtonBase sx={{ borderRadius: "12px", marginLeft: "10px" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: "all .2s ease-in-out",
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.primary.dark,
                      color: theme.palette.primary.light
                    }
                  }}
                  ref={anchorRef}
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleTicket}
                >
                  <SaveIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <div className="d-flex flex-row">
              <Link to="/dashboard/default">
                <FaArrowCircleLeft
                  className="cursor-pointer w-8 h-8"
                  style={{
                    position: "absolute",
                    left: 800,
                    fontSize: "40px"
                  }}
                />
              </Link>
            </div>
          </div>
          <div className="row d-flex mt-3 ml">
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
                <Button variant="contained" component="span">
                  Upload file
                </Button>
              </label>
              <div>
                {selectedFiles.map((fileName, index) => (
                  <div key={index}>{fileName}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ticket;
