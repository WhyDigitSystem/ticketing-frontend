import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Chip, MenuItem, Select, Table, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmailConfig from "app/utils/SendMail";
import axios from "axios";
import dayjs from "dayjs";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Invoice from "./Invoice";


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

export default function AllPO({ view }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [data, setData] = useState([]);
    const [employeedata, setEmployeeData] = useState([]);
    const [statusOptions] = useState(["Inprogress", "Completed", "rejected"]);
    const [selectedStatus, setSelectedStatus] = useState({});
    const [edit, setEdit] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState('');
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
    const [selectedTicket, setSelectedTicket] = useState({});
    const [selectedEmployeeCode, setSelectedEmployeeCode] = useState({});
    const [message, setMessage] = useState("");
    const [clientName, setClientName] = useState();
    const [toEmail, setToEmail] = useState("");
    const [sendMail, setSendEmail] = useState(false);
    const [employeeName, setEmployeeName] = useState("");
    const [ticketData, setTicketData] = useState("");
    const [editFlow, setEditFlow] = useState(false);
    const { addInvoice, setAddInvoice } = useState("");
    const [viewInvoice, setViewInvoice] = useState("");


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
        getInvoiceData()
    }, []);



    const handleBack = () => {
        setAddInvoice(true);

    };


    const getInvoiceData = async () => {
        try {
            const response = await axios.get(
                (`${process.env.REACT_APP_API_URL}/api/invoice/getAllInvoice`)
            )

            if (response.status === 200) {
                console.log("Invoice Data:", response.data.paramObjectsMap.invoiceVO);
                setData(response.data.paramObjectsMap.invoiceVO.reverse());
            };
        }
        catch (error) {
            console.error("Error fetching Invoice data:", error);
        }
    };



    const handleEditRow = (row) => {
        console.log("THE EDIT ROW ID IS:", row.original.id);
        setEdit(true);
        setSelectedRowId(row);

        console.log("THE EDIT:", selectedRowId);
        view(row.original.id);
    };


    const handleAddInvoiceOpen = () => {
        setAddInvoice(true);
    };




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
                    <div>
                        <IconButton onClick={() => handleEditRow(row)}>
                            <EditIcon />

                        </IconButton>

                    </div>
                )
            },
            {
                accessorKey: "id",
                header: "Id",
                size: 80,
                muiTableHeadCellProps: { align: "left" },
                muiTableBodyCellProps: { align: "left" }
            },
            {
                accessorKey: "invoiceNo",
                header: "InvoiceNo",
                size: 100,
                muiTableHeadCellProps: { align: "left" },
                muiTableBodyCellProps: { align: "left" }
            },
            {
                accessorKey: "invoiceTo",
                header: "InvoiceTo",
                size: 100,
                muiTableHeadCellProps: { align: "left" },
                muiTableBodyCellProps: { align: "left" }
            },

            {
                accessorKey: "address",
                header: "Address",
                size: 100,
                muiTableHeadCellProps: { align: "left" },
                muiTableBodyCellProps: { align: "left" }
            },

        ];



        return columnDefinitions;
    }, []);




    return (

        <>
            {(addInvoice && <Invoice addInvoice={handleBack} viewId={selectedRowId} />) ||
                (viewInvoice && (
                    <Invoice addInvoice={handleBack} viewId={selectedRowId} />
                )) || (
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


                    </div>
                )}
        </>
    );
};