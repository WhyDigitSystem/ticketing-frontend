import { Box, IconButton, MenuItem, Select, Table, styled } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import { MaterialReactTable } from "material-react-table";
import { useRef } from "react";
import { Avatar, ButtonBase } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import { ToastContainer, toast } from "react-toastify";

import { useTheme } from "@mui/material/styles";

import TitleCard from "./TitleCard";

import './ticket.css';

import axios from "axios";
import dayjs from "dayjs";
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
        const initialAssignTo = {};
        response.data.paramObjectsMap.ticketVO.forEach((ticket) => {
          initialStatus[ticket.id] = ticket.status || "";
          initialAssignTo[ticket.id] = ticket.assignedTo || "";
        });
        setSelectedStatus(initialStatus);
        setAssignedTo(initialAssignTo);


      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusChange = (e, ticketId) => {
    const newStatus = { ...selectedStatus, [ticketId]: e.target.value };
    setSelectedStatus(newStatus);
  };

  const handleEmployeeChange = (e, ticketId) => {
    const newEmployee = { ...employee, [ticketId]: e.target.value };
    setEmployee(newEmployee);
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
          // <div>
          //   <IconButton onClick={() => UpdateTicket(row)}>
          //     <EditIcon />
          //   </IconButton>
          // </div>

          <div>
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
        accessorKey: "assignto",
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
            {/* <MenuItem value="" disabled>
              Assign To
            </MenuItem> */}
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
    [selectedStatus, employee, employeedata, assignedTo]
  );

  const UpdateTicket = (row) => {
    const ticketId = row.original.id;
    const updatedStatus = selectedStatus[ticketId];
    const updatedEmployee = employee[ticketId];

    const errors = {};
    if (!updatedStatus) errors.status = "Status is required";
    if (!updatedEmployee) errors.assignedto = "Assigned To is required";

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
      // If there are errors, update the state to display them
      setErrors(errors);
    }
  };

  return (


    <div className="customized-container backgroundclr">

      <h3 className="text-2xl font-semibold mt-4">Tickets</h3>
      <div className="grid lg:grid-cols-6 mt-4 md:grid-cols-3 grid-cols-1 gap-6">
        <div className="mt-4">

          {/* <table className="table table-hover w-full">
            <thead>
              <tr>
                <th
                  className="text-black border px-2 text-center"
                  style={{
                    paddingTop: "1%",
                    paddingBottom: "1%",
                    width: "13%",
                  }}
                >
                  DocId
                </th>
                <th className="px-2 text-black border text-center">
                  DocDate
                </th>
                <th className="px-2 text-black border text-center">
                  Allotment No
                </th>
                <th className="px-2 text-black border text-center">
                  Allotment Date
                </th>
                <th className="px-2 text-black border text-center">
                  Flow
                </th>
                <th className="px-2 text-black border text-center">
                  Kit No
                </th>
                <th className="px-2 text-black border text-center">
                  Req Qty
                </th>
                <th className="px-2 text-black border text-center">
                  Alloted QTY
                </th>
                {/* <th className="px-2 py-2 bg-blue-500 text-white">
                 Return Qty
               </th> */}
          {/* </tr> */}
          {/* </thead> */}
          {/* <tbody>
                    {paginatedData &&
                      paginatedData.map((row) => (
                        <tr key={row.id}>
                          <td className="border px-2 py-2 text-center">
                            <span
                              onClick={() => {
                                console.log("Row Data:", row);
                                handleOpenDialog(row.docid);
                              }}
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                width: "100%",
                                color: "blue",
                              }}
                            >
                            </span>
                          </td>
                          <td className="border px-2 py-2 text-center">
                          </td>

                          <td className="border px-2 py-2 text-center">
                          </td>

                          <td className="border px-2 py-2 text-center">
                          </td>
                          <td className="border px-2 py-2 text-center">
                            {row.flow}
                          </td>
                          <td className="border px-2 py-2 text-center text-center">
                            <span
                              onClick={() => {
                                console.log("Row Data:", row);
                                handleOpenDialogNew(
                                  row.kitCode,
                                  row.allotedQty
                                );
                              }}
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                width: "100%",
                                color: "blue",
                              }}
                            >
                            </span>
                          </td>
                          <td className="border px-2 py-2 text-center">
                          </td>
                          
                        </tr>
                      ))}
                  </tbody> */}
          {/* </table> */}



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
            // enableColumnOrdering
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
      {/* </div> */}
    </div>



  );
}
