import { Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
// import { AiOutlineSearch, AiOutlineWallet } from 'react-icons/ai';
// import { BsListTask } from 'react-icons/bs';
import ClearIcon from "@mui/icons-material/Clear";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./employee.css";

import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// import { FaArrowCircleLeft, FaCloudUploadAlt } from "react-icons/fa";
// import "react-tabs/style/react-tabs.css";

const Employee = () => {
  //   const buttonStyle = {
  //     fontSize: '20px' // Adjust the font size as needed save
  //   };
  const theme = useTheme();
  const anchorRef = useRef(null);

  const [createdby, setCreatedBy] = React.useState("admin");
  const [modifiedby, setModifiedBy] = React.useState("admin");
  const [client, setClient] = React.useState("Casio");
  const [employee, setEmployee] = useState("");
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState("");
  const [doj, setDoj] = useState(dayjs());
  const [active, setActive] = useState("");
  const [errors, setErrors] = useState({});

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

      case "employee":
        setEmployee(value);
        break;
      case "code":
        setCode(value);
        break;
      case "department":
        setDepartment(value);
        break;

      case "doj":
        setDoj(value);
        break;
    }
  };

  const handleClear = () => {
    setEmployee("");
    setCode("");
    setDepartment("");
  };

  const handleEmployee = () => {
    console.log("test");
    const errors = {};
    if (!code) {
      errors.code = "code is required";
    }
    if (Object.keys(errors).length === 0) {
      const formData = {
        client,
        createdby,
        code,
        modifiedby,
        department,
        employee,
        doj
      };

      console.log("test1", formData);
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/employee/createemployee`, formData)
        .then((response) => {
          console.log("Response:", response.data);
          setClient("");
          setEmployee("");
          setCode("");
          setDepartment("");
          setDoj("");
          toast.success("Employee Created successfully", {
            autoClose: 2000,
            theme: "colored"
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

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <h7 class="ticketheader">New Employee</h7>

      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: "20px" }}>
        <div className="row d-flex mt-3 ml">
          <div
            className="d-flex flex-wrap justify-content-start mb-4"
            style={{ marginBottom: "20px", gap: "10px", cursor: "pointer" }}
          >
            <Tooltip employee="Search" placement="top">
              <SearchIcon size="1.3rem" stroke={1.5} />
            </Tooltip>

            <Tooltip employee="Clear" placement="top">
              {" "}
              <ClearIcon size="1.3rem" stroke={1.5} onClick={handleClear} />
            </Tooltip>

            <Tooltip employee="List View" placement="top">
              {" "}
              <FormatListBulletedTwoToneIcon size="1.3rem" stroke={1.5} />
            </Tooltip>
            <Tooltip employee="Save" placement="top">
              {" "}
              <SaveIcon size="1.3rem" stroke={1.5} onClick={handleEmployee} />
            </Tooltip>
          </div>

          <div className="col-md-4 mb-3">
            <TextField
              id="outlined-textarea"
              onChange={handleInputChange}
              label="Employee"
              name="employee"
              value={employee}
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>

          <div className="col-md-2 mb-3">
            <TextField
              id="outlined-textarea"
              onChange={handleInputChange}
              label="Code"
              name="code"
              value={code}
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>

          <div className="col-md-2 mb-3">
            <TextField
              id="outlined-textarea"
              label="Department"
              name="department"
              value={department}
              onChange={handleInputChange}
              placeholder="Placeholder"
              multiline
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>

          <div className="col-md-3 mb-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={doj}
                onChange={(date) => setDoj(date)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: { size: "small", clearable: true }
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
      </div>
    </>
  );
};
export default Employee;
