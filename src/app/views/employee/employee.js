import ClearIcon from "@mui/icons-material/Clear";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { encryptPassword } from "app/utils/PasswordEnc";
import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeTable from "./allemployees";
import "./employee.css";

const Employee = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);

  const [createdby, setCreatedBy] = useState("admin");
  const [modifiedby, setModifiedBy] = useState("admin");
  const [client, setClient] = useState("Casio");
  const [employee, setEmployee] = useState("");
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [doj, setDoj] = useState(null);
  const [dob, setDob] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(true);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "client":
        setClient(value);
        break;
      case "email":
        setEmail(value);
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
      case "dob":
        setDob(value);
        break;
      case "branch":
        setBranch(value);
        break;
      case "designation":
        setDesignation(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const viewAll = useCallback(() => {
    setViewEmployee((prev) => !prev);
  }, []);

  const handleClear = useCallback(() => {
    setClient("");
    setEmployee("");
    setCode("");
    setDepartment("");
    setBranch("");
    setDesignation("");
    setDoj(null);
    setDob(null);
    setPassword("");
    setEmail("");
    setErrors({});
  }, []);

  const handleEmployee = useCallback(() => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!code) {
      errors.code = "Code is required";
    }
    if (!employee) {
      errors.employee = "Employee name is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email address";
    }
    if (!department) {
      errors.department = "Department is required";
    }
    if (!branch) {
      errors.branch = "Branch is required";
    }
    if (!designation) {
      errors.designation = "Designation is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    if (!doj) {
      errors.doj = "Date of Joining is required";
    }
    if (!dob) {
      errors.dob = "Date of Birth is required";
    }

    if (Object.keys(errors).length === 0) {
      const formData = {
        client,
        createdby,
        code,
        modifiedby,
        department,
        email,
        employee,
        branch,
        designation,
        doj,
        dob,
        password
      };

      const encryptedPassword = encryptPassword(formData.password);

      // Include the encrypted password in the form data
      const formDataWithEncryptedPassword = {
        ...formData,
        password: encryptedPassword
      };

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/employee/createemployee`,
          formDataWithEncryptedPassword
        )
        .then((response) => {
          handleClear();
          toast.success("Employee Created successfully", {
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
  }, [
    client,
    createdby,
    code,
    modifiedby,
    department,
    employee,
    branch,
    designation,
    doj,
    email,
    dob,
    password,
    handleClear
  ]);
  return (
    <div className="card w-full p-3 bg-base-100 shadow-lg customized-container">
      <div>
        <ToastContainer />
      </div>
      {viewEmployee && (
        <div>
          <h5 className="">New Employee</h5>
        </div>
      )}
      <div className="" style={{ padding: "20px" }}>
        <div className="row d-flex mt-3 ml">
          {viewEmployee && (
            <div
              className="d-flex flex-wrap justify-content-start mb-4"
              style={{ marginBottom: "20px", gap: "10px", cursor: "pointer" }}
            >
              <Tooltip title="Search" placement="top">
                <SearchIcon size="1.3rem" stroke={1.5} />
              </Tooltip>
              <Tooltip title="Clear" placement="top">
                <ClearIcon size="1.3rem" stroke={1.5} onClick={handleClear} />
              </Tooltip>
              <Tooltip title="List View" placement="top">
                <FormatListBulletedTwoToneIcon size="1.3rem" stroke={1.5} onClick={viewAll} />
              </Tooltip>
              <Tooltip title="Save" placement="top">
                <SaveIcon size="1.3rem" stroke={1.5} onClick={handleEmployee} />
              </Tooltip>
            </div>
          )}

          {viewEmployee ? (
            <div className="row">
              <div className="col-md-3 mb-3">
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
                  error={!!errors.employee}
                  helperText={errors.employee}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  onChange={handleInputChange}
                  label="Code"
                  name="code"
                  value={code}
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.code}
                  helperText={errors.code}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  onChange={handleInputChange}
                  label="Email"
                  name="email"
                  value={email}
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Department"
                  name="department"
                  value={department}
                  onChange={handleInputChange}
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.department}
                  helperText={errors.department}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Branch"
                  name="branch"
                  value={branch}
                  onChange={handleInputChange}
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.branch}
                  helperText={errors.branch}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Designation"
                  name="designation"
                  value={designation}
                  onChange={handleInputChange}
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.designation}
                  helperText={errors.designation}
                />
              </div>
              <div className="col-md-3 mb-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dob}
                    onChange={(date) => setDob(date)}
                    format="DD/MM/YYYY"
                    placeholder="DOB"
                    slotProps={{
                      textField: {
                        size: "small",
                        clearable: true,
                        error: !!errors.dob,
                        helperText: errors.dob
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="col-md-3 mb-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={doj}
                    onChange={(date) => setDoj(date)}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        clearable: true,
                        error: !!errors.doj,
                        helperText: errors.doj
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea"
                  label="Password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Placeholder"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </div>
            </div>
          ) : (
            <EmployeeTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default Employee;
