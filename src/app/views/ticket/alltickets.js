import {
  Box,
  MenuItem,
  Select,
  Table,
  styled,
  Avatar,
  ButtonBase
} from "@mui/material";
import { useEffect, useMemo, useState, useRef } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { MaterialReactTable } from "material-react-table";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import dayjs from "dayjs";
import "react-toastify/dist/ReactToastify.css";
import { IoMdClose } from "react-icons/io";
import Ticket from "./ticket";
import { Link } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";

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

export default function AllTickets({ view, listView }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [employeedata, setEmployeeData] = useState([]);
  const [statusOptions] = useState(["Assigned", "Rejected"]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [edit, setEdit] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [employee, setEmployee] = useState({});
  const [createdby, setCreatedBy] = useState("admin");
  const [modifiedby, setModifiedBy] = useState("admin");
  const [client, setClient] = useState("Casio");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [docdate, setDocDate] = useState(dayjs());
  const [errors, setErrors] = useState({});
  const [assignedTo, setAssignedTo] = useState({});
  const theme = useTheme();
  const anchorRef = useRef(null);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getTicketData();
    getEmployeeData();
  }, []);

  const getEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/employee/getAllEmployee`
      );

      if (response.status === 200) {
        console.log("Employee Data:", response.data.paramObjectsMap.employeeVO);
        setEmployeeData(response.data.paramObjectsMap.employeeVO.reverse());

        const initialEmployee = {};
        response.data.paramObjectsMap.employeeVO.forEach((ticket) => {
          initialEmployee[ticket.id] = ticket.employee || "";
        });
        setEmployee(initialEmployee);
        console.log("Initial Employee State:", initialEmployee);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const getTicketData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ticket/getAllTicket`
      );

      if (response.status === 200) {
        console.log("Ticket Data:", response.data.paramObjectsMap.ticketVO);
        setData(response.data.paramObjectsMap.ticketVO.reverse());
        const initialStatus = {};
        const initialAssignTo = {};
        response.data.paramObjectsMap.ticketVO.forEach((ticket) => {
          initialStatus[ticket.id] = ticket.status || "";
          initialAssignTo[ticket.id] = ticket.assignedTo || "";
        });
        setSelectedStatus(initialStatus);
        setAssignedTo(initialAssignTo);
        console.log("Initial Status State:", initialStatus);
        console.log("Initial AssignedTo State:", initialAssignTo);
      }
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  const handleStatusChange = (e, ticketId) => {
    const newStatus = { ...selectedStatus, [ticketId]: e.target.value };
    setSelectedStatus(newStatus);
  };

  const handleEmployeeChange = (e, ticketId) => {
    const newEmployee = { ...assignedTo, [ticketId]: e.target.value };
    setAssignedTo(newEmployee);
    console.log("Updated AssignedTo State:", newEmployee);
  };

  const handleEditRow = (row) => {
    setSelectedRowId(row.original.id);
    setEdit(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "actions",
        header: "Actions",
        size: 80,
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
          <div>
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
                onClick={() => UpdateTicket(row)}
              >
                <SaveIcon size="1.3rem" stroke={1.5} />
              </Avatar>
            </ButtonBase>
          </div>
        )
      },
      {
        accessorKey: "id",
        header: "TicketNo",
        size: 120,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        }
      },
      {
        accessorKey: "docDate",
        header: "Date",
        size: 90,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        },
        Cell: ({ row }) => (
          <Select
            value={selectedStatus[row.original.id] || ""}
            onChange={(e) => handleStatusChange(e, row.original.id)}
            sx={{ minWidth: 120 }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        )
      },
      {
        accessorKey: "assignedTo",
        header: "Assign To",
        size: 120,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        },
        Cell: ({ row }) => (
          <Select
            value={assignedTo[row.original.id] || ""}
            onChange={(e) => handleEmployeeChange(e, row.original.id)}
            sx={{ minWidth: 120 }}
          >
            {employeedata.map((employee) => (
              <MenuItem key={employee.id} value={employee.employee}>
                {employee.employee}
              </MenuItem>
            ))}
          </Select>
        )
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 90,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        }
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 120,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        }
      }
    ],
    [selectedStatus, assignedTo, employeedata]
  );

  const UpdateTicket = (row) => {
    const ticketId = row.original.id;
    const updatedStatus = selectedStatus[ticketId];
    const updatedEmployee = assignedTo[ticketId];

    const errors = {};
    if (!updatedStatus) errors.status = "Status is required";
    if (!updatedEmployee) errors.assignedTo = "Assigned To is required";

    if (Object.keys(errors).length === 0) {
      const formData = {
        modifiedby,
        status: updatedStatus,
        assignedTo: updatedEmployee,
        id: ticketId
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}/api/ticket/assignTicket`, formData)
        .then((response) => {
          console.log("Response:", response.data);
          toast.success("Ticket Assigned successfully", {
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

  return (
    // <div className="customized-container backgroundclr">
    <div className="card shadow-lg customized-container backgroundclr">
      <div className="flex justify-between mt-1 mb-1">

        <h7 class="ticketheader">Tickets</h7>
      </div>
      {/* <h3 className="text-2xl font-semibold mt-4">Tickets</h3> */}
      {/* <div className="justify-content-end mt-4"> */}

      {listView ? (
        <>
          <div className="d-flex flex-wrap content-end mb-4" style={{
            position: 'absolute',
            left: 900,
            top: 30
          }}>

            <button >
              <IoMdClose
                // style={{ }}
                onClick={() => { view(false) }}
              />
            </button>
          </div>
        </>
      ) : (<div className="d-flex flex-row"  >
        <Link to="/dashboard/default">

          <FaArrowCircleLeft className="cursor-pointer w-8 h-8" style={{
            position: 'absolute',
            left: 900,
            fontSize: "30px"
          }} />
        </Link>
      </div>)
      }
      < div className="grid lg:grid-cols-6 mt-4 md:grid-cols-3 grid-cols-1 gap-6">
        <div className="mt-4">
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
            data={data}
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
    </div >
  );
}
