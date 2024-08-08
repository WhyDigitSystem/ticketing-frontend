import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Chip, FormControl, MenuItem, Select, Table, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmailConfig from "app/utils/SendMail";
import axios from "axios";
import dayjs from "dayjs";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageModal from "./ImageModal";


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

export default function AllTickets({ hideTitle, hideStatus }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [employeedata, setEmployeeData] = useState([]);
  const [statusOptions] = useState(["YetToAssign", "Inprogress", "Completed", "rejected"]);
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
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedTicket, setSelectedTicket] = useState({});
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState({});
  const [message, setMessage] = useState("");
  const [messageNew, setMessageNew] = useState("");
  const [clientName, setClientName] = useState();
  const [toEmail, setToEmail] = useState("");
  const [sendMail, setSendEmail] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [employeeFromName, setEmployeeFromName] = useState("");

  const [sendMailStatus, setSendEmailStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("userId");




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
        `${process.env.REACT_APP_API_URL}/api/ticket/getAllTicketByAssignedTo?empCode=${userType === "Customer" ? localStorage.getItem("company") : userId
        }&userType=${userType}`
      );

      if (response.status === 200) {
        console.log("Ticket Data:", response.data.paramObjectsMap.ticketVO);
        setData(response.data.paramObjectsMap.ticketVO.reverse());
        const initialStatus = {};
        const initialAssignTo = {};
        response.data.paramObjectsMap.ticketVO.forEach((ticket) => {
          initialStatus[ticket.id] = ticket.status || "";
          initialAssignTo[ticket.id] = ticket.assignedToEmp || "";
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

  const handleStatusChange = (e, ticketId, row) => {
    const newStatus = { ...selectedStatus, [ticketId]: e.target.value };
    setSelectedStatus(newStatus);
    UpdateStatus(ticketId, e.target.value, selectedEmployeeCode[ticketId]); // Pass the updated status and employee code
    setClientEmail(row.original.email)
    console.log("TicketRow", row)
  };

  const handleEmployeeChange = (e, ticketId, row) => {
    const selectedEmployee = employeedata.find((emp) => emp.employee === e.target.value);
    const newEmployee = { ...assignedTo, [ticketId]: e.target.value };
    const newEmployeeCode = { ...selectedEmployeeCode, [ticketId]: selectedEmployee.code };
    setAssignedTo(newEmployee);
    setSelectedEmployeeCode(newEmployeeCode);
    setToEmail(selectedEmployee.email);
    UpdateTicket(ticketId, selectedStatus[ticketId], e.target.value, selectedEmployee.code); // Call UpdateTicket with new employee value and code
  };

  const handleEditRow = (row) => {
    setSelectedRowId(row.original.id);
    setEdit(true);
  };

  const fetchImage = async (ticketId, row) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/ticket/${ticketId}`);

      if (response.status === 200) {
        // Assuming `imageData` is a base64-encoded string, convert it to Blob
        const imageData = response.data.paramObjectsMap.ticketVO.imageData;
        const blob = await fetchImageDataAsBlob(imageData);

        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setSelectedImageUrl(imageUrl);
          setSelectedTicket({
            description: row.original.description,
            priority: row.original.priority,
            status: row.original.status,
            title: row.original.title,
            assignedTo: row.original.assignedTo,
            ticketId: row.original.id,
            client: row.original.client
          });
          setOpenImageModal(true);
        } else {
          console.error("Failed to fetch image data or convert to Blob.");
        }
      } else {
        console.error("Failed to fetch image. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };

  const handleCloseImgModal = () => {

    setOpenImageModal(false)
    getTicketData();
  }

  const fetchImageDataAsBlob = async (imageData) => {
    try {
      // Assuming imageData is base64 encoded
      const response = await fetch(`data:image/jpeg;base64,${imageData}`);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error converting image data to Blob:", error);
      return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error"; // Red
      case "Medium":
        return "warning"; // Yellow
      case "Low":
        return "success"; // Green
      default:
        return "default";
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((ticket) => {
      // Exclude tickets with "Completed" status initially
      if (statusFilter === '' && ticket.status === 'Completed') {
        return false;
      }
      // Check if the statusFilter is empty or if it matches the ticket's status
      return statusFilter === '' || ticket.status === statusFilter;
    });
  }, [data, statusFilter]);




  const columns = useMemo(() => {
    const columnDefinitions = [
      {
        accessorKey: "actions",
        header: "Actions",
        size: 80,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
        enableSorting: false,
        enableColumnOrdering: false,
        enableEditing: false,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <img src="https://cdn-icons-png.flaticon.com/128/14614/14614615.png" style={{ cursor: "pointer" }} width={40} height={40} onClick={() => fetchImage(row.original.id, row)}></img>
          </div>
        )
      },
      {
        accessorKey: "id",
        header: "TicketNo",
        size: 80,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" }
      },
      {
        accessorKey: "docDate",
        header: "Date",
        size: 100,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" }
      },
      {
        accessorKey: "client",
        header: "Client",
        size: 100,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" }
      },

      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" }
      },

      // {
      //   header: 'Days',
      //   accessorKey: 'docDate',
      //   size: 80,
      //   Cell: ({ cell, row }) => {
      //     const docDate = dayjs(cell.getValue());
      //     const today = dayjs();
      //     const diffInDays = today.diff(docDate, 'day');

      //     return row.original.status === "Completed" ? null : (
      //       <Chip
      //         label={diffInDays}
      //         style={{
      //           backgroundColor: diffInDays > 3 ? 'red' : 'green',
      //           color: 'white'     
      //         }}
      //       />
      //     );
      //   }
      // },

      {
        accessorKey: "priority",
        header: "Priority",
        size: 120,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ row }) => (
          <Chip
            label={row.original.priority}
            color={
              row.original.priority === "High"
                ? "error"
                : row.original.priority === "Medium"
                  ? "warning"
                  : "success"
            }
          />
        )
      }
    ];

    if (!hideTitle) {
      columnDefinitions.push({
        accessorKey: "title",
        header: "Title",
        size: 90,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" }
      });
    }
    const hasNonCompletedStatus = data.some(row => row.status !== "Completed");

    if (hasNonCompletedStatus) {
      columnDefinitions.push({
        header: 'Days',
        accessorKey: 'docDate',
        size: 80,
        Cell: ({ cell, row }) => {
          const docDate = dayjs(cell.getValue());
          const today = dayjs();
          const diffInDays = today.diff(docDate, 'day');

          return row.original.status === "Completed" ? null : (
            <Chip
              label={diffInDays}
              style={{
                backgroundColor: diffInDays > 3 ? 'red' : 'green',
                color: 'white'
              }}
            />
          );
        }
      });
    }



    // if (!hideStatus) {
    //   columnDefinitions.push({
    //     accessorKey: "status",
    //     header: "Status",
    //     size: 120,
    //     muiTableHeadCellProps: { align: "left" },
    //     muiTableBodyCellProps: { align: "left" },
    //     Cell: ({ row }) => (
    //       <Select
    //         value={selectedStatus[row.original.id] || ""}
    //         onChange={(e) => handleStatusChange(e, row.original.id, row)}
    //         sx={{ minWidth: 120 }}
    //         disabled={userType === "Employee" && selectedStatus[row.original.id] === "Completed"}
    //       >
    //         <MenuItem value="" disabled>
    //           --Status--
    //         </MenuItem>
    //         {statusOptions.map((option) => (
    //           <MenuItem key={option} value={option}>
    //             {option}
    //           </MenuItem>
    //         ))}
    //       </Select>
    //     )
    //   });
    // }

    if (userType !== "Employee" && userType !== "Customer") {
      columnDefinitions.push({
        accessorKey: "assignedTo",
        header: "Assign To",
        size: 120,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ row }) => (
          <Select
            value={assignedTo[row.original.id] || ""}
            onChange={(e) => handleEmployeeChange(e, row.original.id, row)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="" disabled>
              --Assign To--
            </MenuItem>
            {employeedata.map((employee) => (
              <MenuItem key={employee.id} value={employee.employee}>
                {employee.employee}
              </MenuItem>
            ))}
          </Select>
        )
      });
    }

    return columnDefinitions;
  }, [selectedStatus, assignedTo, employeedata, hideTitle, hideStatus, statusOptions, userType]);


  const UpdateTicket = (ticketId, updatedStatus, updatedEmployee, employeeCode) => {
    const errors = {};
    if (!updatedStatus) errors.status = "Status is required";
    if (!updatedEmployee) errors.assignedTo = "Assigned To is required";

    if (Object.keys(errors).length === 0) {
      const formData = {
        modifiedby,
        status: updatedStatus,
        assignedTo: employeeCode,
        assignedToEmployee: updatedEmployee,
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
          setEmployeeName(updatedEmployee);
          setTitle(response.data.paramObjectsMap.ticketAssign.title);
          setDescription(response.data.paramObjectsMap.ticketAssign.description);
          setPriority(response.data.paramObjectsMap.ticketAssign.priority);
          setMessage(
            `You receive a new ticket from ${response.data.paramObjectsMap.ticketAssign.client}, Ticket No : ${response.data.paramObjectsMap.ticketAssign.id}`
          );
          console.log("TicktAsign", response.data.paramObjectsMap.ticketAssign.title);

          handleSendEmail();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setErrors(errors);
    }
  };

  const handleSendEmail = () => {
    setSendEmail(true);
  };

  const UpdateStatus = (ticketId, updatedStatus, employeeCode) => {
    const errors = {};
    if (!updatedStatus) errors.status = "Status is required";

    if (Object.keys(errors).length === 0) {
      const formData = {
        status: updatedStatus,
        empCode: userId,
        id: ticketId
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}/api/ticket/ChangeTicketStatus`, formData)
        .then((response) => {
          console.log("Response:", response.data.paramObjectsMap.ticketAssign.assignedToEmp);
          setEmployeeFromName(response.data.paramObjectsMap.ticketAssign.assignedToEmp)
          toast.success("Status Updated successfully", {
            autoClose: 2000,
            theme: "colored"
          });
          setMessageNew(
            `The following Ticket is ${response.data.paramObjectsMap.ticketAssign.status}, Ticket No : ${response.data.paramObjectsMap.ticketAssign.id}`
          );
          setSendEmailStatus(true);


        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setErrors(errors);
    }
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
            data={filteredData}
            editingMode="modal"
            renderRowActions={({ row, table }) => (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end"
                }}

              >
              </Box>
            )}
            renderTopToolbar={() => (
              <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ marginRight: '8px', marginTop: '8px', width: "150px", position: 'relative' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <FilterListIcon
                      style={{
                        position: 'absolute',
                        left: '10px',
                        pointerEvents: 'none',
                        color: 'rgba(0, 0, 0, 0.54)', // Adjust the color if needed
                      }}
                    />
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      displayEmpty
                      style={{ paddingLeft: '30px', width: '200px' }}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <span style={{ color: 'rgba(0, 0, 0, 0.54)' }}>Filter</span>;
                        }
                        return selected;
                      }}
                    >
                      <MenuItem value="" disabled>
                        Filter
                      </MenuItem>
                      <MenuItem value="Inprogress">InProgress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="YetToAssign">YetToAssign</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </Box>
                </FormControl>

                {/* <FormControl variant="outlined" size="small" style={{ position: 'relative', marginRight: '8px', marginTop: "10px", width: "150px" }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    label="Priority"
                    style={{ paddingLeft: '30px' }} // Add padding to accommodate the icon
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Normal">Normal</MenuItem>
                  </Select>
                  <FilterListIcon
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '10px',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  />
                </FormControl> */}
              </Box>
            )}

          />
          <ToastContainer />
        </div>
      </div>
      <ImageModal
        open={openImageModal}
        imageUrl={selectedImageUrl}
        onClose={handleCloseImgModal}
        description={selectedTicket.description}
        priority={selectedTicket.priority}
        ticketId={selectedTicket.ticketId}
        status={selectedTicket.status}
        title={selectedTicket.title}
        client={selectedTicket.client}
        assignedTo={selectedTicket.assignedTo}
      />

      {sendMail && (
        <EmailConfig
          updatedEmployee={employeeName}
          toEmail={toEmail}
          message={message}
          title={title}
          description={description}
          priority={priority}
        />
      )}

      {sendMailStatus && <EmailConfig updatedEmployee={"Admin"} message={messageNew} toEmail={"karthikeyan@whydigit.in"} ccEmail={clientEmail} hideBox={true} templateChange={true} employeeName={employeeFromName} />}
    </div>
  );
}
