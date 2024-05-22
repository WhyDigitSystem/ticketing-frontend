import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, MenuItem, Select, Table, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
            <SaveIcon
              size="1.3rem"
              stroke={1}
              onClick={() =>
                UpdateTicket(
                  row.original.id,
                  selectedStatus[row.original.id],
                  assignedTo[row.original.id]
                )
              }
              style={{ cursor: "pointer" }}
            />
            <VisibilityIcon
              size="1.3rem"
              style={{ cursor: "pointer" }}
              stroke={1}
              onClick={() => fetchImage(row.original.id, row)}
            />
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
            onChange={(e) => handleStatusChange(e, row.original.id, row)}
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
            onChange={(e) => handleEmployeeChange(e, row.original.id, row)}
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
    // <div className="customized-container backgroundclr">
    <div className="shadow-lg customized-container backgroundclr">
      <div className="flex justify-between mt-1 mb-1">
        {/* <h6 class="ticketheader mt-1">
          <center>Tickets</center>
        </h6> */}
      </div>
      {/* <h3 className="text-2xl font-semibold mt-4">Tickets</h3> */}
      {/* <div className="justify-content-end mt-4"> */}

      {listView ? (
        <>
          {/* <div
            className="d-flex flex-wrap content-end"
            style={{
              position: "absolute",
              left: 900
            }}
          >
            <button>
              <IoMdClose
                // style={{ }}
                onClick={() => {
                  view(false);
                }}
              />
            </button>
          </div> */}
        </>
      ) : (
        <div className="d-flex flex-row">
          {/* <Link to="/dashboard/default">
            <FaArrowCircleLeft
              className="cursor-pointer w-8 h-8"
              style={{
                position: "absolute",
                left: 900,
                fontSize: "30px"
              }}
            />
          </Link> */}
        </div>
      )}
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
  );
}
