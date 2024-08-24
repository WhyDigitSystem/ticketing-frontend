import { ExpandLess } from "@mui/icons-material";
import { Card, Fab, Grid, lighten, styled, useTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

// STYLED COMPONENTS
const ContentBox = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center"
}));

const FabIcon = styled(Fab)(() => ({
  width: "44px !important",
  height: "44px !important",
  boxShadow: "none !important"
}));

const H3 = styled("h5")(() => ({
  margin: 0,
  fontWeight: "500",
  marginLeft: "12px"
}));

const H1 = styled("h1")(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  color: theme.palette.text.secondary
}));

const Span = styled("span")(() => ({
  fontSize: "13px",
  marginLeft: "4px"
}));

const IconBox = styled("div")(() => ({
  width: 16,
  height: 16,
  color: "#fff",
  display: "flex",
  overflow: "hidden",
  borderRadius: "300px ",
  justifyContent: "center",
  "& .icon": { fontSize: "14px" }
}));

export default function StatCards2() {
  const { palette } = useTheme();
  const bgError = lighten(palette.error.main, 0.85);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/getEmployeeAndCustomerCount`
      );

      if (response.status === 200) {
        setUserData(response.data.paramObjectsMap.userCount);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            {/* <FabIcon size="medium" sx={{ background: "rgba(9, 182, 109, 0.15)" }}>
              <TrendingUp color="success" />
            </FabIcon> */}
            <img
              src={"https://cdn-icons-gif.flaticon.com/15374/15374828.gif"}
              height={45}
              width={45}
            ></img>

            <H3 color="#08ad6c">Active Tickets</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{userData.totalEmployee}</H1>

            <IconBox sx={{ backgroundColor: "success.main" }}>
              <ExpandLess className="icon" />
            </IconBox>

            <Span color="#08ad6c">(+21%)</Span>
          </ContentBox>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            {/* <FabIcon size="medium" sx={{ background: "rgba(9, 182, 109, 0.15)" }}>
              <TrendingUp color="success" />
            </FabIcon> */}

            <img
              src={"https://cdn-icons-gif.flaticon.com/12134/12134201.gif"}
              height={45}
              width={45}
            ></img>

            <H3 color="error.main">Critical Tickets</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{userData.totalCustomer}</H1>

            <IconBox sx={{ backgroundColor: "error.main" }}>
              <ExpandLess className="icon" />
            </IconBox>

            <Span color="error.main">(+21%)</Span>
          </ContentBox>
        </Card>
      </Grid>
    </Grid>
  );
}
