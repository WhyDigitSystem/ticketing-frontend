import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Modal, Table, TextField, styled } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useTheme } from "@mui/material/styles";
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
    p: 4
};

export default function CustomerTable({ view, listView }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [data, setData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const theme = useTheme();

    useEffect(() => {
        getCustomerData();
    }, []);

    const getCustomerData = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/user/getAllCustomer`
            );

            if (response.status === 200) {
                setCustomerData(response.data.paramObjectsMap.usersVO.reverse());
            }
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
    };

    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setOpenEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value
        }));
    };

    const handleEditSubmit = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/user/updateCustomer?userId=${selectedCustomer.userId}`,
                selectedCustomer
            );

            if (response.status === 200) {
                toast.success("Customer Updated Successfully", {
                    autoClose: 2000,
                    theme: "colored"
                });
                getCustomerData(); // Refresh the customer data after successful update
                setOpenEditModal(false); // Close the modal
            } else {
                console.error("API Error:", response.data);
                toast.error("Failed to Update Customer", {
                    autoClose: 2000,
                    theme: "colored"
                });
            }
        } catch (error) {
            console.error("Error updating customer:", error);
            toast.error("Error Updating Customer", {
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
                accessorKey: "company",
                header: "Company Name",
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
                accessorKey: "firstName",
                header: "Customer Name",
                size: 120,
                muiTableHeadCellProps: {
                    align: "left"
                },
                muiTableBodyCellProps: {
                    align: "left"
                }
            }
        ],
        []
    );

    return (
        <div className="card w-full p-3 bg-base-100 shadow-lg customized-container">
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
                        data={customerData}
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
                    <h4 id="modal-modal-title">Edit Customer</h4>
                    <TextField
                        label="Company Name"
                        name="company"
                        value={selectedCustomer.company || ""}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Customer Name"
                        name="firstName"
                        value={selectedCustomer.firstName || ""}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={selectedCustomer.email || ""}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
                    <Box display="flex" alignItems="center" mt={2}>
                        <span>Active</span>
                        <Switch
                            checked={selectedCustomer.active || false}
                            onChange={(e) =>
                                setSelectedCustomer((prevCustomer) => ({
                                    ...prevCustomer,
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
