import { ArrowRightAlt, AttachMoney } from "@mui/icons-material";
import { Box, Card, Grid, IconButton, Tooltip, styled } from "@mui/material";
import { Link } from "react-router-dom";
// import "./statcard.css";
// import "./statcard1.css";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": { opacity: 0.6, fontSize: "44px", color: theme.palette.primary.main }
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main
}));

// const TicketNew = Loadable(lazy(() => import("app/views/ticket/ticket")));

export default function StatCards() {
  const cardList = [
    // { name: "New Ticket" , path: "app/views/ticket/ticket" , Icon: AttachMoney   },
    { name: "Ticket", amount: "/ticket/ticket", Icon: "addbox" },
    { name: "All Tickets", amount: "/ticket/alltickets", Icon: AttachMoney }
    // { name: "Pending", amount: "8.5% Stock Surplus", Icon: Store },
    // { name: "Orders to deliver", amount: "305 Orders", Icon: ShoppingCart }
  ];

  return (
    <>
      <Grid container spacing={3} sx={{ mb: "24px" }}>
        {cardList.map(({ amount, Icon, name }) => (
          <Grid item xs={12} md={6} key={name}>
            <StyledCard elevation={8}>
              <ContentBox>
                <Icon className="icon" />

                <Box ml="12px" style={{ fontSize: "20px" }}>
                  {/* <Small>{name}</Small> */}
                  <Link to={amount}> {name}</Link>
                </Box>
              </ContentBox>

              <Tooltip title="Go" placement="top">
                <IconButton>
                  <Link to={amount}>
                    {" "}
                    <ArrowRightAlt />
                  </Link>
                </IconButton>
              </Tooltip>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* <div id="container">
  <div id="success-box">
    <div class="dot"></div>
    <div class="dot two"></div>
    <div class="face">
      <div class="eye"></div>
      <div class="eye right"></div>
      <div class="mouth happy"></div>
    </div>
    <div class="shadow scale"></div>
    <div class="message"><h1 class="alert">Success!</h1><p>yay, everything is working.</p></div>
    <button class="button-box"><h1 class="green">continue</h1></button>
  </div>
  <div id="error-box">
    <div class="dot"></div>
    <div class="dot two"></div>
    <div class="face2">
      <div class="eye"></div>
      <div class="eye right"></div>
      <div class="mouth sad"></div>
    </div>
    <div class="shadow move"></div>
    <div class="message"><h1 class="alert">Error!</h1>oh no, something went wrong.</div>
    <button class="button-box"><h1 class="red">try again</h1></button>
  </div>
</div> */}

      {/* <link href="https://fonts.googleapis.com/css? family=Lato"rel="stylesheet"type="text/css"/>

    
	<input type="checkbox" class="toggle"id="toggle" unchecked="unchecked"/>

<label class="toggle"for="toggle">Toggle tilt</label>
	<div class="menu">
	<div class="top">
		<span class="search">
			{/* <input type="text"> 
		</span>

		<a class="exit"href="#"tabindex="0"></a>

	</div>

	<ul class="middle">
		<li tabindex="0"> <i class="fa fa-calendar"></i>Calendar</li>

		<li tabindex="0"><i class="fa fa-camera"> </i>Photos </li>

		<li tabindex="0"> <i class="fa fa-check"></i>Tasks</li>

		<li tabindex="0"><i class="fa fa-map-maker"> </i>Places </li>

		<li tabindex="0"> <i class="fa fa-codepen"></i>Codepen</li>

		<li tabindex="0"><i class="fa fa-dribble"> </i>Dribble</li>

		<li tabindex="0"> <i class="fa fa-user"></i>User Account</li>

		<li tabindex="0"><i class="fa fa-cogs"> </i>Settings </li>
	</ul>

	<div class="bottom"></div>

	<div class="menu-back"></div>

	<div class="glass-reflection"></div>

</div>
 */}

      {/* 
    <div className="col-lg-6 card bg-base-100 shadow-xl mb-4 mt-2">
            <>
                  <Link to="/ticket/ticket">
                    <div className="card bg-base-100 shadow-lg p-3">
                      {/* <div className="d-flex flex-row"> 
                        <h4 className="text-sm font-semibold">New Ticket</h4>
                      </div>
              
                  </Link>
              
            </>
          </div>                 */}
    </>
  );
}
