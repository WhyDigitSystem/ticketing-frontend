import { Edit } from "@mui/icons-material";
import {
  Box,
  Card,
  Table,
  Select,
  Avatar,
  styled,
  TableRow,
  useTheme,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,Chip
} from "@mui/material";
import { Paragraph } from "app/components/Typography";

import ImageModal from "app/views/ticket/ImageModal";

import dayjs from "dayjs";



import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" }
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
}));

export default function TopSellingTable(hideStatus) {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [employeedata, setEmployeeData] = useState([]);
  const [statusOptions] = useState(["Assigned"]);
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/ticket/getAllTicket`);

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

  const handleEmployeeChange = (e, ticketId, row) => {
    const newEmployee = { ...assignedTo, [ticketId]: e.target.value };
    setAssignedTo(newEmployee);
    UpdateTicket(ticketId, selectedStatus[ticketId], e.target.value); // Call UpdateTicket with new employee value
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
            assignedTo: row.original.assignedTo
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

  const columns = useMemo(() => {
    const columnDefinitions = [
      // {
      //   accessorKey: "actions",
      //   header: "Actions",
      //   size: 80,
      //   muiTableHeadCellProps: { align: "left" },
      //   muiTableBodyCellProps: { align: "left" },
      //   enableSorting: false,
      //   enableColumnOrdering: false,
      //   enableEditing: false,
      //   Cell: ({ row }) => (
      //     <div style={{ display: "flex", gap: "10px" }}>
      //       {/* <SaveIcon
      //         size="1.3rem"
      //         stroke={1}
      //         onClick={() =>
      //           UpdateTicket(
      //             row.original.id,
      //             selectedStatus[row.original.id],
      //             assignedTo[row.original.id]
      //           )
      //         }
      //         style={{ cursor: "pointer" }}
      //       /> */}
      //       <VisibilityIcon
      //         size="1.3rem"
      //         style={{ cursor: "pointer" }}
      //         stroke={1}
      //         onClick={() => fetchImage(row.original.id, row)}
      //       />
      //     </div>
      //   )
      // },
      // {
      //   accessorKey: "id",
      //   header: "TicketNo",
      //   size: 80,
      //   muiTableHeadCellProps: { align: "left" },
      //   muiTableBodyCellProps: { align: "left" }
      // },
      {
        accessorKey: "title",
        header: "Title",
        size: 90,
        muiTableHeadCellProps: {
          align: "left"
        },
        muiTableBodyCellProps: {
          align: "left"
        },
        Cell: ({ row }) => (
            <Chip label={row.original.title} onClick={(e) => fetchImage(row.original.id, row)} />
           
          //  <div>{row.original.title}  </div>
           
        )
           
      },
      {
        accessorKey: "docDate",
        header: "Date",
        size: 100,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" }
      },
      {
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
      },
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

  

    // Conditionally add the "Status" column
    if (!hideStatus) {
      columnDefinitions.push({
        accessorKey: "status",
        header: "Status",
        size: 120,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ row }) => (
          <Select
            value={selectedStatus[row.original.id] || ""}
            onChange={(e) => handleStatusChange(e, row.original.id, row)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="" disabled>
              --Status--
            </MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        )
      });
    }

    return columnDefinitions;
  }, [selectedStatus, assignedTo, employeedata, hideStatus, statusOptions]);

  const UpdateTicket = (ticketId, updatedStatus, updatedEmployee) => {
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
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>top selling products</Title>
        <Select size="small" defaultValue="this_month">
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="last_month">Last Month</MenuItem>
        </Select>
      </CardHeader>

      <Box overflow="auto">
      <div className="">
      <div className="flex justify-between mt-1 mb-1"></div>
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
      <ImageModal
        open={openImageModal}
        imageUrl={selectedImageUrl}
        onClose={() => setOpenImageModal(false)}
        description={selectedTicket.description}
        priority={selectedTicket.priority}
        status={selectedTicket.status}
        title={selectedTicket.title}
        assignedTo={selectedTicket.assignedTo}
      />
    </div>
      </Box>
    </Card>
  );
}


