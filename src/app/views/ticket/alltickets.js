import {
  Box,
  Icon,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  styled
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { MaterialReactTable } from "material-react-table";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

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

const subscribarList = [
  {
    name: "john doe",
    date: "18 january, 2019",
    amount: 1000,
    status: "close",
    company: "ABC Fintech LTD."
  },
  {
    name: "kessy bryan",
    date: "10 january, 2019",
    amount: 9000,
    status: "open",
    company: "My Fintech LTD."
  },
  {
    name: "kessy bryan",
    date: "10 january, 2019",
    amount: 9000,
    status: "open",
    company: "My Fintech LTD."
  },
  {
    name: "james cassegne",
    date: "8 january, 2019",
    amount: 5000,
    status: "close",
    company: "Collboy Tech LTD."
  },
  {
    name: "lucy brown",
    date: "1 january, 2019",
    amount: 89000,
    status: "open",
    company: "ABC Fintech LTD."
  },
  {
    name: "lucy brown",
    date: "1 january, 2019",
    amount: 89000,
    status: "open",
    company: "ABC Fintech LTD."
  },
  {
    name: "lucy brown",
    date: "1 january, 2019",
    amount: 89000,
    status: "open",
    company: "ABC Fintech LTD."
  },
  {
    name: "lucy brown",
    date: "1 january, 2019",
    amount: 89000,
    status: "open",
    company: "ABC Fintech LTD."
  },
  {
    name: "lucy brown",
    date: "1 january, 2019",
    amount: 89000,
    status: "open",
    company: "ABC Fintech LTD."
  }
];

export default function AllTickets() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);

  const [employeedatatest, setEmployeeDataTest] = useState(["ABC", "DEF"]);
  const [employeedata, setEmployeeData] = useState([]);
  const [statusOptions, setStatusOptions] = useState(["Yet to Assign", "Assigned"]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [edit, setEdit] = useState(false);
  const [assignto, setAssignTo] = useState();
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [employee, setEmployee] = useState({});

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
          initialEmployee[ticket.id] = ticket.employee || ""; // Set default status to an empty string
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
        // Initialize selectedStatus state with default values for each row
        const initialStatus = {};
        response.data.paramObjectsMap.ticketVO.forEach((ticket) => {
          initialStatus[ticket.id] = ticket.status || ""; // Set default status to an empty string
        });
        setSelectedStatus(initialStatus);
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
    console.log("setSelectedRowID", row.original.id);
    setEdit(true);
  };



  const columns = useMemo(
    () => [
      {
        accessorKey: "actions",
        header: "Actions",
        size: 50,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        enableSorting: false,
        enableColumnOrdering: false,
        enableEditing: false,
        Cell: ({ row }) => (
          <div>
            {/* <IconButton onClick={() => handleViewRow(row)}>
              <VisibilityIcon />
            </IconButton> */}
            <IconButton onClick={() => handleEditRow(row)}>
              <EditIcon />
            </IconButton>
          </div>
        ),
      },
      // {
      //   accessorKey: "id",
      //   header: "Sr No",
      //   size: 50,
      //   muiTableHeadCellProps: {
      //     align: "first",
      //   },
      //   muiTableBodyCellProps: {
      //     align: "first",
      //   },
      // },
      {
        accessorKey: "id",
        header: "Ticket Id",
        size: 70,
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "docDate",
        header: "Date",
        size: 70,
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 70,
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 70,
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 70,
        muiTableHeadCellProps: {
          align: "left",
        },
        muiTableBodyCellProps: {
          align: "left",
        },
      },


    ],
    []
  );


  return (
    // <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: "20px" }}>
    //   <div className="row d-flex mt-3 ml">
    //     <div
    //       className="d-flex flex-wrap justify-content-start mb-4"
    //       style={{ marginBottom: "20px" }}
    //     >
    //       <Box width="100%" overflow="auto">
    //         <StyledTable>
    //           <TableHead>
    //             <TableRow>
    //               <TableCell align="left">Ticket Id</TableCell>
    //               <TableCell align="left">Date</TableCell>
    //               <TableCell align="left">Title</TableCell>
    //               <TableCell align="left">Priority</TableCell>
    //               <TableCell align="left">Status</TableCell>
    //               <TableCell align="left">Assign To</TableCell>
    //               <TableCell align="right">Action</TableCell>
    //             </TableRow>
    //           </TableHead>
    //           <TableBody>
    //             {data.map((ticket, index) => (
    //               <TableRow key={index}>
    //                 <TableCell align="left">{ticket.id}</TableCell>
    //                 <TableCell align="left">{ticket.docDate}</TableCell>
    //                 <TableCell align="left">{ticket.title}</TableCell>
    //                 <TableCell align="left">{ticket.priority}</TableCell>
    //                 <TableCell align="left">
    //                   <Select
    //                     defaultValue={selectedStatus[ticket.id] || ""}
    //                     onChange={(e) => handleStatusChange(e, ticket.id)}
    //                     sx={{ minWidth: 120 }}
    //                   >
    //                     <MenuItem value="" disabled>
    //                       Status
    //                     </MenuItem>
    //                     {statusOptions.map((option) => (
    //                       <MenuItem key={option} value={option}>
    //                         {option}
    //                       </MenuItem>
    //                     ))}
    //                   </Select>
    //                 </TableCell>

    //                 <TableCell align="left">
    //                   <Select
    //                     defaultValue={employee[ticket.id] || ""}
    //                     onChange={(e) => handleEmployeeChange(e, ticket.id)}
    //                     sx={{ minWidth: 120 }}
    //                   >
    //                     <MenuItem value="" disabled>
    //                       Assign To
    //                     </MenuItem>
    //                     {employeedata.map((employeedata) => (
    //                       <MenuItem key={employeedata.employee} value={employeedata.employee}>
    //                         {employeedata.employee}
    //                       </MenuItem>
    //                     ))}
    //                   </Select>
    //                 </TableCell>

    //                 <TableCell align="right">
    //                   <IconButton>
    //                     <Icon color="error">close</Icon>
    //                   </IconButton>
    //                 </TableCell>
    //               </TableRow>
    //             ))}
    //           </TableBody>
    //         </StyledTable>

    //         <TablePagination
    //           sx={{ px: 2 }}
    //           page={page}
    //           component="div"
    //           rowsPerPage={rowsPerPage}
    //           count={subscribarList.length}
    //           onPageChange={handleChangePage}
    //           rowsPerPageOptions={[5, 10, 25]}
    //           onRowsPerPageChange={handleChangeRowsPerPage}
    //           nextIconButtonProps={{ "aria-label": "Next Page" }}
    //           backIconButtonProps={{ "aria-label": "Previous Page" }}
    //         />
    //       </Box>
    //     </div>
    //   </div>
    // </div>
    <>
      <div className="mt-4">
        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              muiTableHeadCellProps: {
                align: "left",
              },
              size: 100,
            },
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
                justifyContent: "flex-end",
              }}
            >
              {/* <Tooltip arrow placement="right" title="Edit">
            <IconButton style={{ color: "blue" }}>
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip arrow placement="right" title="View">
            <IconButton
              color="primary"
              // onClick={() => handleView(row.original)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip> */}
            </Box>
          )}
        />
      </div>

    </>
  );
}
