import { Box, IconButton, MenuItem, Select, Table, styled } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import { MaterialReactTable } from "material-react-table";

import { ToastContainer, toast } from "react-toastify";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { date } from "yup";

import axios from "axios";

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

export default function AllTickets() {
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
  const [assignedto, setAssignedTo] = useState({});



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
        setEmployeeData(response.data.paramObjectsMap.employeeVO.reverse());

        const initialEmployee = {};
        response.data.paramObjectsMap.employeeVO.forEach((ticket) => {
          initialEmployee[ticket.id] = ticket.employee || "";
        });
        setEmployee(initialEmployee);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTicketData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/ticket/getAllTicket`);

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.ticketVO.reverse());
        const initialStatus = {};
        response.data.paramObjectsMap.ticketVO.forEach((ticket) => {
          initialStatus[ticket.id] = ticket.status || "";
        });
        setSelectedStatus(initialStatus);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusChange = (e, ticketId) => {
    const newStatus = { ...selectedStatus, [ticketId]: e.target.value };
    setSelectedStatus(e.target.value);
  };

  const handleEmployeeChange = (e, ticketId) => {
    const newEmployee = { ...employee, [ticketId]: e.target.value };
    setEmployee(e.target.value);
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
        size: 50,
        muiTableHeadCellProps: {
          align: "center"
        },
        muiTableBodyCellProps: {
          align: "center"
        },
        enableSorting: false,
        enableColumnOrdering: false,
        enableEditing: false,
        Cell: ({ row }) => (


          <div>
            <IconButton onClick={() => UpdateTicket(row)}>
              <EditIcon />
            </IconButton>
          </div>

        )
      },
      {
        accessorKey: "id",
        header: "Ticket Id",
        size: 70,
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
        size: 70,
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
        size: 70,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        },
        Cell: ({ row }) => (
          <Select
            value={selectedStatus[row.original.id] || ""}
            onChange={(e) => handleStatusChange(e)}
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
        accessorKey: "assignto",
        header: "Assign To",
        size: 70,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        },
        Cell: ({ row }) => (
          <Select
            value={employee[row.original.id] || ""}
            onChange={(e) => handleEmployeeChange(e, row.original.id)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="" disabled>
              Assign To
            </MenuItem>
            {employeedata.map((employeedata) => (
              <MenuItem key={employeedata.employee} value={employeedata.employee}>
                {employeedata.employee}
              </MenuItem>
            ))}
          </Select>
        )
      },

      {
        accessorKey: "title",
        header: "Title",
        size: 70,
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
        size: 70,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        }
      }
    ],
    [selectedStatus, employee, employeedata]
  );



  const UpdateTicket = () => {
    console.log("test");
    const errors = {};
    if (Object.keys(errors).length === 0) {
      const formData = {
        modifiedby,
        status: selectedStatus,
        assignedto: employee,


      };



      console.log("test1", formData);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/ticket/assignTicket`,
          formData
        )
        .then((response) => {
          console.log("Response:", response.data);
          toast.success("Ticket Assigned successfully", {
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
        enableColumnOrdering
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
    </div>
  );
}
