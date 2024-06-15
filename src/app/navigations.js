// Define the navigation items
const navigationItems = [
  { name: "Dashboard", path: "/dashboard/default", icon: "dashboard" },
  { name: "Ticket", path: "/ticket/ticket", icon: "addbox" },
  // { name: "AllTickets", path: "/ticket/alltickets", icon: "reorder" },
  { name: "Employee", path: "/employee/employee", icon: "verified_user" },
  // { name: "AllEmployees", path: "/ticket/allemployees", icon: "reorder" },
  { name: "Customer", path: "/customer/allCustomer", icon: "verified_user" }
  // { name: "Invoice", path: "/po/Invoice", icon: "addbox" },
];

// Get the user type from localStorage
const userType = localStorage.getItem("userType");

// Filter the navigation items based on the user type
export const navigations = navigationItems.filter((item) => {
  if (
    (userType === "Employee" || userType === "Customer") &&
    (item.name === "Employee" || item.name === "Customer")
  ) {
    return false;
  }
  return true;
});
