import { Card, Grid, styled, useTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Styled Components
const ContentBox = styled("div")(() => ({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center"
}));

const H3 = styled("h3")(() => ({
    margin: 0,
    fontWeight: "500",
    marginLeft: "12px"
}));

const H1 = styled("h1")(({ theme }) => ({
    margin: 0,
    flexGrow: 1,
    color: theme.palette.text.secondary
}));

export default function StatCards3() {
    const { palette } = useTheme();
    const [userData, setUserData] = useState({ totalEmployee: 0, totalCustomer: 0 });

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

    const data = [
        { name: "Employees", value: userData.totalEmployee },
        { name: "Customers", value: userData.totalCustomer }
    ];

    const COLORS = [palette.primary.main, palette.secondary.main];

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
                <Card elevation={3} sx={{ p: 2 }}>
                    <ContentBox>
                        <H3 color="#08ad6c">Active Employees and Customers</H3>
                    </ContentBox>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill={palette.primary.main}
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </Grid>
        </Grid>
    );
}
