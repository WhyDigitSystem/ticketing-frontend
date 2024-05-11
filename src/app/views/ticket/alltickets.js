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

  const [add, setAdd] = useState(false);
  const [data, setData] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [orgId, setOrgId] = useState(localStorage.getItem("orgId"));
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);



  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };



  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getTicketData();
  }, []);

  const getTicketData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ticket/getAllTicket`
      );

      if (response.status === 200) {
        setData(response.data.paramObjectsMap.ticketVO.reverse());
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
                  <TableCell align="left">Ticket Id</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Title</TableCell>
                  <TableCell align="left">Priority</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{ }</TableCell>
                      <TableCell align="left">{data.docdate}</TableCell>
                      <TableCell align="left">{data.title}</TableCell>
                      <TableCell align="left">{data.priority}</TableCell>
                      <TableCell align="left">{data.status}</TableCell>
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
              count={subscribarList.length}
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


    // <DialogContent className="mt-4">
    //   {selectedRowData && (
    //     <TableContainer component={Paper}>
    //       <Table>
    //         <TableBody>
    //           <TableRow>
    //             <TableCell>Ticket ID</TableCell>
    //             <TableCell>{ }</TableCell>
    //           </TableRow>
    //           <TableRow>
    //             <TableCell>Date</TableCell>
    //             <TableCell>{selectedRowData.docdate}</TableCell>
    //           </TableRow>
    //           <TableRow>
    //             <TableCell>Title</TableCell>
    //             <TableCell>{selectedRowData.title}</TableCell>
    //           </TableRow>
    //           <TableRow>
    //             <TableCell>Priority</TableCell>
    //             <TableCell>{selectedRowData.priority}</TableCell>
    //           </TableRow>
    //           <TableRow>
    //             <TableCell>Status</TableCell>
    //             <TableCell>
    //               {selectedRowData.status}
    //             </TableCell>
    //           </TableRow>


    //           {/* <TableRow>
    //                                     <TableCell>Status</TableCell>
    //                                     <TableCell>{selectedRowData.active}</TableCell>
    //                                 </TableRow> */}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //   )}
    // </DialogContent>

  );
}
