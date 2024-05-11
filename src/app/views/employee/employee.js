import { TextareaAutosize, Tooltip } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import TextArea from "@mui/material/TextField"
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
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


import './employee.css';

import dayjs from "dayjs";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import Button from "@mui/material/Button";
import { date } from "yup";
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
        setDepartment("")
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
                .post(
                    `${process.env.REACT_APP_API_URL}/api/employee/createemployee`,
                    formData
                )
                .then((response) => {
                    console.log("Response:", response.data);
                    setClient("");
                    setEmployee("");
                    setCode("");
                    setDepartment("");
                    setDoj("");
                    toast.success("Employee Created successfully", {
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
                        style={{ marginBottom: "20px" }}
                    >
                        <Tooltip employee="Search" placement="top">
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

                        <Tooltip employee="Clear" placement="top">
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

                        <Tooltip employee="List View" placement="top">
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
                        <Tooltip employee="Save" placement="top">
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
                                    onClick={handleEmployee}
                                >
                                    <SaveIcon size="1.3rem" stroke={1.5} />
                                </Avatar>
                            </ButtonBase>
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
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    value={doj}
                                    onChange={(date) => setDoj(date)}
                                    format="DD/MM/YYYY"

                                    slotProps={{
                                        textField: { size: "small", clearable: true },
                                    }}

                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>




                </div>
            </div>
        </>
    );
};
export default Employee;
