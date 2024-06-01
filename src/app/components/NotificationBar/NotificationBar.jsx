import { Clear } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Card,
  Chip,
  Drawer,
  Icon,
  IconButton,
  ThemeProvider,
  styled
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useSettings from "app/hooks/useSettings";
import { sideNavWidth, topBarHeight } from "app/utils/constant";
import axios from "axios";
import { themeShadows } from "../MatxTheme/themeColors";
import { Paragraph, Small } from "../Typography";

const Notification = styled("div")(() => ({
  padding: "16px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  height: topBarHeight,
  boxShadow: themeShadows[6],
  "& h5": {
    marginLeft: "8px",
    marginTop: 0,
    marginBottom: 0,
    fontWeight: "500"
  }
}));

const NotificationCard = styled(Box)(({ theme }) => ({
  position: "relative",
  "&:hover": {
    "& .messageTime": {
      display: "none"
    },
    "& .deleteButton": {
      opacity: "1"
    }
  },
  "& .messageTime": {
    color: theme.palette.text.secondary
  },
  "& .icon": { fontSize: "1.25rem" }
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  opacity: "0",
  position: "absolute",
  right: 5,
  marginTop: 9,
  marginRight: "24px",
  background: "rgba(0, 0, 0, 0.01)"
}));

const CardLeftContent = styled("div")(({ theme }) => ({
  padding: "12px 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "rgba(0, 0, 0, 0.01)",
  "& small": {
    fontWeight: "500",
    marginLeft: "16px",
    color: theme.palette.text.secondary
  }
}));

const Heading = styled("span")(({ theme }) => ({
  fontWeight: "500",
  marginLeft: "16px",
  color: theme.palette.text.secondary
}));

export default function NotificationBar({ container }) {
  const { settings } = useSettings();
  const [panelOpen, setPanelOpen] = useState(false);
  const [empCode, setEmpCode] = useState(localStorage.getItem("userId"));
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ticket/getAllTicketNotification?empCode=${empCode}`
      );
      console.log("API Response:", response);

      if (response.status === 200) {
        setNotification(response.data.paramObjectsMap.ticketVO);

        console.log("Notification", response.data.paramObjectsMap.ticketVO);
      } else {
        // Handle error
        console.error("API Error:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/ticket/changeMflag?id=${id}`
      );
      if (response.status === 200) {
        getNotification();
      } else {
      }
    } catch (error) {
      console.error("Error updating country:", error);
    }
  };

  const deleteAllNotification = async (empCode) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/ticket/changeMflagforAllTicket?empCode=${empCode}`
      );
      if (response.status === 200) {
        getNotification();
      } else {
      }
    } catch (error) {
      console.error("Error updating country:", error);
    }
  };

  const handleDrawerToggle = () => setPanelOpen(!panelOpen);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Normal":
        return "success";
      case "Medium":
        return "warning";
      case "High":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Fragment>
      <IconButton onClick={handleDrawerToggle}>
        <Badge color="secondary" badgeContent={notification?.length}>
          <img
            src="https://cdn-icons-gif.flaticon.com/11919/11919418.gif"
            width={35}
            height={35}
            alt="Notification Gif"
          />
        </Badge>
      </IconButton>

      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Drawer
          width={"100px"}
          container={container}
          variant="temporary"
          anchor={"right"}
          open={panelOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          <Box sx={{ width: sideNavWidth }}>
            <Notification>
              {/* <Notifications color="primary" /> */}
              <img
                src="https://cdn-icons-gif.flaticon.com/11919/11919418.gif"
                width={40}
                height={40}
                alt="Notification Gif"
              />
              <h5>Notifications</h5>
            </Notification>
            {notification?.map((notification) => (
              <NotificationCard key={notification.id}>
                <DeleteButton
                  size="small"
                  className="deleteButton"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <Clear className="icon" />
                </DeleteButton>

                <Link onClick={handleDrawerToggle} style={{ textDecoration: "none" }}>
                  <Card sx={{ mx: 2, mb: 3 }} elevation={3}>
                    <CardLeftContent>
                      <Box display="flex">
                        <Icon className="icon" color={"primary"}>
                          {"chat"}
                        </Icon>
                        <Heading>New Ticket</Heading>
                      </Box>
                    </CardLeftContent>

                    <Box px={2} pt={1} pb={2}>
                      <Paragraph m={0}>You got a new ticket No {notification.id}</Paragraph>
                      <Small color="text.secondary">{notification.title}</Small>
                      <br />
                      <Small color="text.secondary">Priority : </Small>
                      <Chip
                        label={`${notification.priority}`}
                        color={getPriorityColor(notification.priority)}
                        size="small"
                      />
                    </Box>
                  </Card>
                </Link>
              </NotificationCard>
            ))}

            {notification?.length > 0 && (
              <Box color="text.secondary">
                <Button onClick={() => deleteAllNotification(empCode)}>Clear Notifications</Button>
              </Box>
            )}
          </Box>
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
}
