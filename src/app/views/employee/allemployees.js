import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Icon,
    Table,
    styled,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    IconButton,
    TablePagination, TableContainer, Paper
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
    }
}));



export default function AllEmloyees() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [add, setAdd] = useState(false);
    const [data, setData] = useState([]);
    const [openView, setOpenView] = useState(false);
    const [orgId, setOrgId] = useState(localStorage.getItem("orgId"));
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [edit, setEdit] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);



    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };



    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        getEmployeeData();
    }, []);

    const getEmployeeData = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/employee/getAllEmployee`
            );

            if (response.status === 200) {
                setData(response.data.paramObjectsMap.employeeVO.reverse());
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleViewRow = (row) => {
        setSelectedRowData(row.original);
        console.log("setSelectedRowData", row.original);
        setOpenView(true);
    };



    return (

        <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: "20px" }}>
            <div className="row d-flex mt-3 ml">
                <div
                    className="d-flex flex-wrap justify-content-start mb-4"
                    style={{ marginBottom: "20px" }}
                >
                    <Box width="100%" overflow="auto">
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Employee</TableCell>
                                    <TableCell align="left">Code</TableCell>
                                    <TableCell align="left">Department</TableCell>
                                    <TableCell align="left">DOJ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data
                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="left">{data.employee}</TableCell>
                                            <TableCell align="left">{data.code}</TableCell>
                                            <TableCell align="left">{data.department}</TableCell>
                                            <TableCell align="left">{data.doj}</TableCell>
                                            <TableCell align="right">
                                                <IconButton>
                                                    <Icon color="error">close</Icon>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </StyledTable>

                        <TablePagination
                            sx={{ px: 2 }}
                            page={page}
                            component="div"
                            rowsPerPage={rowsPerPage}
                            count={data.length}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            nextIconButtonProps={{ "aria-label": "Next Page" }}
                            backIconButtonProps={{ "aria-label": "Previous Page" }}
                        />
                    </Box>
                </div>
            </div>
        </div>



    );
}
