// Define the navigation items
const navigationItems = [
  { name: "Dashboard", path: "/dashboard/default", icon: "dashboard" },
  { name: "Ticket", path: "/ticket/ticket", icon: "addbox" },
  // { name: "AllTickets", path: "/ticket/alltickets", icon: "reorder" },
  { name: "Employee", path: "/employee/employee", icon: "addbox" }
  // { name: "AllEmployees", path: "/ticket/allemployees", icon: "reorder" }
];

// Get the user type from localStorage
const userType = localStorage.getItem("userType");

// Filter the navigation items based on the user type
export const navigations = navigationItems.filter((item) => {
  if (userType === "Employee" && item.name === "Employee") {
    return false;
  } else if (userType === "Customer" && item.name === "Employee") {
    return false;
  }
  return true;
});
