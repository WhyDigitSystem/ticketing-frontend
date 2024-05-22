import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Table, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const theme = useTheme();
  const anchorRef = useRef(null);

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
            {/* <SaveIcon
              size="1.3rem"
              stroke={1}
              onClick={() => updateEmployeeStatus(row.original.id, selectedStatus[row.original.id])}
              style={{ cursor: "pointer" }}
            /> */}
            <VisibilityIcon
              size="1.3rem"
              style={{ cursor: "pointer" }}
              stroke={1}
              onClick={() => viewEmployeeDetails(row.original.id)}
            />
          </div>
        )
      },
      {
        accessorKey: "id",
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
      //   {
      //     accessorKey: "status",
      //     header: "Status",
      //     size: 120,
      //     muiTableHeadCellProps: {
      //       align: "left"
      //     },
      //     muiTableBodyCellProps: {
      //       align: "left"
      //     },
      //     Cell: ({ row }) => (
      //       <Select
      //         value={selectedStatus[row.original.id] || ""}
      //         onChange={(e) => handleStatusChange(e, row.original.id)}
      //         sx={{ minWidth: 120 }}
      //       >
      //         {statusOptions.map((option) => (
      //           <MenuItem key={option} value={option}>
      //             {option}
      //           </MenuItem>
      //         ))}
      //       </Select>
      //     )
      //   },
      //   {
      //     accessorKey: "email",
      //     header: "Email",
      //     size: 120,
      //     muiTableHeadCellProps: {
      //       align: "left"
      //     },
      //     muiTableBodyCellProps: {
      //       align: "left"
      //     }
      //   },
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

  const updateEmployeeStatus = (employeeId, updatedStatus) => {
    const errors = {};
    if (!updatedStatus) errors.status = "Status is required";

    if (Object.keys(errors).length === 0) {
      const formData = {
        status: updatedStatus,
        id: employeeId
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}/api/employee/updateStatus`, formData)
        .then((response) => {
          toast.success("Employee status updated successfully", {
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

  const viewEmployeeDetails = (employeeId) => {
    // Implement view employee details logic here
  };

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
    </div>
  );
}
