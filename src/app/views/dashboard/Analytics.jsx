import { Card, Grid, styled, useTheme } from "@mui/material";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import AllTickets from "../ticket/alltickets";
import DoughnutChart from "./shared/Doughnut";
import BarChartComponent from "./shared/EmpAvail";
import PieChart from "./shared/PieChart";
import StatCards from "./shared/StatCards";
import StatCards2 from "./shared/StatCards2";
import UpgradeCard from "./shared/UpgradeCard";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginRight: ".5rem",
  textTransform: "capitalize"
}));

const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "16px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

const priorityData = [10, 20, 30];

export default function Analytics() {
  const { palette } = useTheme();
  const [userData, setUserData] = useState([]);
  const [ticketStatusDetails, setTicketStatusDetails] = useState(null);
  const [employeeTicketDetail, setEmployeeTicketDetail] = useState("");
  const company = localStorage.getItem("company");
  const userType = localStorage.getItem("userType");
  const [priorityStatusCount, setPriorityStatusCount] = useState("");

  // const employees = [
  //   { name: "Guhan", activeTickets: 10, completedTickets: 5 },
  //   { name: "Vasanth", activeTickets: 20, completedTickets: 10 },
  //   { name: "Mani", activeTickets: 5, completedTickets: 15 },
  //   { name: "karupu", activeTickets: 12, completedTickets: 16 },
  //   { name: "Karthi", activeTickets: 5, completedTickets: 15 },
  //   { name: "Kumar", activeTickets: 15, completedTickets: 15 }
  // ];

  useEffect(() => {
    getUserData();
    getEmployeeTicketData();
    getPriorityStatusCount();
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ticket/getTicketStatusByClient?customer=${company}`
      );

      if (response.status === 200) {
        setUserData(response.data.paramObjectsMap.ticketVO);
        setTicketStatusDetails(response.data.paramObjectsMap.ticketStatusDetails[0]);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const getPriorityStatusCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ticket/getTicketPriorityStatusCount`
      );

      if (response.status === 200) {
        setPriorityStatusCount(response.data.paramObjectsMap.ticketPriorityStatusDetails);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const getEmployeeTicketData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ticket/getEmployeeTicketStatusCounts`
      );

      if (response.status === 200) {
        setEmployeeTicketDetail(response.data.paramObjectsMap.ticketStatusDetails);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards />
            {userType === "Admin" && <StatCards2 />}
            {userType === "Admin" && employeeTicketDetail.length > 0 && (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <BarChartComponent employees={employeeTicketDetail} />
              </div>
            )}
            {/* <AllTickets hideStatus={true} />
            <br></br> */}
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            {ticketStatusDetails && (
              <Card sx={{ px: 1, py: 1, mb: 1 }}>
                <Title sx={{ px: 2 }}>Ticket Status</Title>
                <SubTitle>Last 30 days</SubTitle>
                <DoughnutChart
                  height="300px"
                  color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
                  data={ticketStatusDetails}
                />
              </Card>
            )}
            <UpgradeCard />
            {/* <RowCards /> */}
            {userType === "Admin" && <PieChart data={priorityStatusCount} />}
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <AllTickets hideStatus={true} />
            <br></br>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
