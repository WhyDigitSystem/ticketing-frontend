import { TextareaAutosize, Tooltip } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import TextArea from "@mui/material/TextField"
import { useTheme, styled } from "@mui/material/styles";
// import { Card, Grid, , useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';
import ClearIcon from "@mui/icons-material/Clear";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, ButtonBase } from "@mui/material";
import { useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdClose } from "react-icons/io";

import { Link } from "react-router-dom";

import './ticket.css';

import dayjs from "dayjs";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import Button from "@mui/material/Button";
import { date } from "yup";
import AllTickets from "./alltickets";
// import { FaArrowCircleLeft, FaCloudUploadAlt } from "react-icons/fa";
// import "react-tabs/style/react-tabs.css";
// const ContentBox = styled("div")(({ theme }) => ({
//   margin: "30px 100px 30px 100px",
//   [theme.breakpoints.down("sm")]: { margin: "16px" }
// }));

const Ticket = () => {
  //   const buttonStyle = {
  //     fontSize: '20px' // Adjust the font size as needed save
  //   };
  const theme = useTheme();
  const anchorRef = useRef(null);


  const [createdby, setCreatedBy] = React.useState("admin");
  const [modifiedby, setModifiedBy] = React.useState("admin");
  const [client, setClient] = React.useState("Casio");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [docdate, setDocDate] = useState(dayjs());
  const [errors, setErrors] = useState({});
  const [listView, setListView] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target;
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
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setPriority("")
  };

  const handleListViewChange = () => {
    setListView(!listView)
  }


  const handleTicket = () => {
    console.log("test");
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



      console.log("test1", formData);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/ticket/createticket`,
          formData
        )
        .then((response) => {
          console.log("Response:", response.data);
          setClient("");
          setTitle("");
          setDescription("");
          setPriority("");
          toast.success("Ticket Created successfully", {
            autoClose: 2000,
            theme: "colored",
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // If there are errors, update the state to display them
      setErrors(errors);
    }
  };

  const handleBack = () => {
    setListView(false)
  }


  const back = () => {
    <Link to="/default/dashboard" >
    </Link>
  }

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      {listView ? (
        <>
          <AllTickets view={handleBack} listView={listView} />
        </>

      ) : (
        <>
          <div className="card w-full p-3 bg-base-100 shadow-lg customized-container backgroundclr">
            {/* TITLE NAME */}
            <div className="flex justify-between mt-3 mb-3">
              <h7 class="ticketheader">New Ticket</h7>
            </div>
            {/* 

            <
              div className="d-flex flex-wrap content-end mb-4" style={{
                position: 'absolute',
                left: 1000,
                top: 30
              }}>

              <Link to="/ticket/ticket" >
                <button >
                  <IoMdClose
                  // style={{ }}
                  />
                </button>
              </Link>
            </div> */}

            {/* HEADER BUTTONS ROW */}
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
                {" "}
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
                {" "}
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
                {" "}
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

              <div className="d-flex flex-row"  >
                <Link to="/dashboard/default">

                  <FaArrowCircleLeft className="cursor-pointer w-8 h-8" style={{
                    position: 'absolute',
                    left: 800,
                    fontSize: "40px"
                  }} />
                </Link>
              </div>

            </div>
            {/* FIELDS ROW */}
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
                    // value={age}
                    label="Priority"
                  // onChange={handleChange}
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
              <div className="col-md-4 mb-3" >
                <input
                  type="file"
                  id="file-input"
                  onChange={handleInputChange}
                  multiple
                  style={{ display: "none" }}
                // onChange={(e) => handleFileUpload(e.target.files)}
                />
                <label htmlFor="file-input">
                  <Button
                    variant="contained"
                    component="span"
                  // startIcon={<FaCloudUploadAlt />}
                  >
                    Upload file
                  </Button>
                </label>
              </div>
              <div className="col-md-2 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Status"
                  name="status"
                  onChange={handleInputChange}
                  placeholder="Placeholder"
                  multiline
                  hidden
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>
              <div className="col-md-2 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Assigned To"
                  name="assignedto"
                  onChange={handleInputChange}
                  placeholder="Placeholder"
                  multiline
                  hidden
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>
              <div className="col-md-2 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Completed On"
                  name="completedon"
                  placeholder="Placeholder"
                  onChange={handleInputChange}
                  multiline
                  hidden
                  variant="outlined"
                  type="Date"
                  size="small"
                  fullWidth
                />
              </div>
              <div className="col-md-2 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Completed By"
                  name="completedby"
                  onChange={handleInputChange}
                  placeholder="Placeholder"
                  hidden
                  multiline
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>
              <div className="col-md-2 mb-2">
                <TextField
                  id="outlined-textarea"
                  onChange={handleInputChange}
                  label="Ticket Id"
                  name="docid"
                  disabled
                  hidden
                  placeholder="Placeholder"
                  multiline
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>

            </div>
          </div >
        </>
      )}
    </>
  );
};
export default Ticket;
