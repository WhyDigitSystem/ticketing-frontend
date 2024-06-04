import { Card, styled } from "@mui/material";
import { convertHexToRGB } from "app/utils/utils";
import Lottie from "lottie-react";
import rocketAnimation from "./rocket.json";

// STYLED COMPONENTS
const CardRoot = styled(Card)(({ theme }) => ({
  marginBottom: "24px",
  padding: "24px !important",
  [theme.breakpoints.down("sm")]: { paddingLeft: "16px !important" }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  position: "relative",
  padding: "24px !important",
  background: `rgb(${convertHexToRGB(theme.palette.primary.main)}, 0.15) !important`,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const Paragraph = styled("p")(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary
}));

export default function UpgradeCard() {
  return (
    <CardRoot>
      <StyledCard elevation={0}>
        {/* <img src="/assets/images/illustrations/upgrade.svg" alt="upgrade" /> */}
        <Lottie animationData={rocketAnimation} loop={true} />
        <Paragraph>
          Next Realese on <b>June 06 2024</b>
        </Paragraph>

        {/* <Button
          size="large"
          color="primary"
          variant="contained"
          sx={{ textTransform: "uppercase" }}>
          upgrade now
        </Button> */}
      </StyledCard>
    </CardRoot>
  );
}
