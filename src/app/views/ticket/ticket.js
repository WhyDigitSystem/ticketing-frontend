import { Tooltip } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { default as TextArea, default as TextField } from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';
import ClearIcon from "@mui/icons-material/Clear";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, ButtonBase } from "@mui/material";
import { useRef, useState } from "react";

import Button from "@mui/material/Button";
// import { FaArrowCircleLeft, FaCloudUploadAlt } from "react-icons/fa";
// import "react-tabs/style/react-tabs.css";

const Ticket = () => {
  //   const buttonStyle = {
  //     fontSize: '20px' // Adjust the font size as needed save
  //   };
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (files) => {
    setUploadedFiles(files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
    }
    const fileNames = Array.from(files).map((file) => file.name);
    // Update the selectedFiles state with the array of file names
    setSelectedFiles(fileNames);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: "20px" }}>
        <div className="row d-flex mt-3 ml">
          <div
            className="d-flex flex-wrap justify-content-start mb-4"
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
                >
                  <SaveIcon size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Ticket Id"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Date"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              type="Date"
              fullWidth
            />
          </div>

          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Title"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="col-md-8 mb-3">
            <TextArea
              rows={4}
              cols={40}
              id="Old Rate"
              label="Description"
              placeholder="Placeholder"
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
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFileUpload(e.target.files)}
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
            {selectedFiles.map((fileName, index) => (
              <div style={{ font: "10px" }} key={index}>
                {fileName}
              </div>
            ))}
          </div>

          <div className="col-md-4 mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Priority</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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

          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Status"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>

          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Assigned To"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>

          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Completed On"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              type="Date"
              size="small"
              fullWidth
            />
          </div>

          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              label="Completed By"
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Ticket;
