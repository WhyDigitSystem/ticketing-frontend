import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Modal, Table, TextField, styled } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useTheme } from "@mui/material/styles";
import { encryptPassword } from "app/utils/PasswordEnc";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": {
      "& th": { paddingLeft: 0, paddingRight: 0 }
    }
  },
  "& tbody": {
    "& tr": {
      "& td": { paddingLeft: 0, textTransform: "capitalize" }
    }
  }
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // boxShadow: 24,
  p: 4
};

export default function EmployeeTable({ view, listView }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [employeedata, setEmployeeData] = useState([]);
  const [statusOptions] = useState(["Active", "Inactive"]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [edit, setEdit] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [errors, setErrors] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const theme = useTheme();

  useEffect(() => {
    getEmployeeData();
  }, []);

  const getEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/employee/getAllEmployee`
      );

      if (response.status === 200) {
        setEmployeeData(response.data.paramObjectsMap.employeeVO.reverse());

        const initialStatus = {};
        response.data.paramObjectsMap.employeeVO.forEach((employee) => {
          initialStatus[employee.id] = employee.status || "";
        });
        setSelectedStatus(initialStatus);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleStatusChange = (e, employeeId) => {
    const newStatus = { ...selectedStatus, [employeeId]: e.target.value };
    setSelectedStatus(newStatus);
  };

  // const handleEditClick = (employee) => {
  //   setSelectedEmployee(employee);
  //   setOpenEditModal(true);
  // };

  // const handleEditChange = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedEmployee((prevEmployee) => ({
  //     ...prevEmployee,
  //     [name]: value
  //   }));
  // };

  // const handleEditSubmit = async () => {
  //   const encryptedPassword = encryptPassword(selectedEmployee.password);
  //   const updatedEmployee = {
  //     ...selectedEmployee,
  //     password: encryptedPassword
  //   };

  //   try {
  //     const response = await axios.put(
  //       `${process.env.REACT_APP_API_URL}/api/employee/updateEmployee`,
  //       updatedEmployee
  //     );

  //     if (response.status === 200) {
  //       toast.success("Employee Updated Successfully", {
  //         autoClose: 2000,
  //         theme: "colored"
  //       });
  //       getEmployeeData(); // Refresh the employee data after successful update
  //       setOpenEditModal(false); // Close the modal
  //     } else {
  //       console.error("API Error:", response.data);
  //       toast.error("Failed to Update Employee", {
  //         autoClose: 2000,
  //         theme: "colored"
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating employee:", error);
  //     toast.error("Error Updating Employee", {
  //       autoClose: 2000,
  //       theme: "colored"
  //     });
  //   }
  // };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    const encryptedPassword = encryptPassword(selectedEmployee.password);
    const updatedEmployee = {
      ...selectedEmployee,
      password: encryptedPassword
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/employee/updateEmployee`,
        updatedEmployee
      );

      if (response.status === 200) {
        toast.success("Employee Updated Successfully", {
          autoClose: 2000,
          theme: "colored"
        });
        getEmployeeData(); // Refresh the employee data after successful update
        setOpenEditModal(false); // Close the modal
      } else {
        console.error("API Error:", response.data);
        toast.error("Failed to Update Employee", {
          autoClose: 2000,
          theme: "colored"
        });
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Error Updating Employee", {
        autoClose: 2000,
        theme: "colored"
      });
    }
  };


  const columns = useMemo(
    () => [
      {
        accessorKey: "actions",
        header: "Actions",
        size: 120,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        },
        enableSorting: false,
        enableColumnOrdering: false,
        enableEditing: false,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <EditIcon
              size="1.3rem"
              style={{ cursor: "pointer" }}
              stroke={1}
              onClick={() => handleEditClick(row.original)}

            />
          </div>
        )
      },
      {
        accessorKey: "code",
        header: "Employee ID",
        size: 120,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        }
      },
      {
        accessorKey: "employee",
        header: "Name",
        size: 120,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        }
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 120,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        }
      },
      {
        accessorKey: "department",
        header: "Department",
        size: 120,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        }
      }
    ],
    [selectedStatus]
  );

  return (
    <div className="">

      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-6">
        <div className="mt-2">

          <MaterialReactTable
            displayColumnDefOptions={{
              "mrt-row-actions": {
                muiTableHeadCellProps: {
                  align: "left"
                },
                size: 100
              }
            }}
            columns={columns}
            data={employeedata}
            editingMode="modal"
            renderRowActions={({ row, table }) => (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end"
                }}
              ></Box>
            )}
          />
          <ToastContainer />
        </div>
      </div>

      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h4 id="modal-modal-title">Edit Employee</h4>
          <TextField
            label="Employee ID"
            name="code"
            value={selectedEmployee.code || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            name="employee"
            value={selectedEmployee.employee || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Department"
            name="department"
            value={selectedEmployee.department || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <span>Active</span>
            <Switch
              checked={selectedEmployee.active || false}
              onChange={(e) =>
                setSelectedEmployee((prevEmployee) => ({
                  ...prevEmployee,
                  active: e.target.checked
                }))
              }
              name="active"
              inputProps={{ "aria-label": "controlled" }}
            />
          </Box>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={() => setOpenEditModal(false)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              color="primary"
              variant="contained"
              style={{ marginLeft: "10px" }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
