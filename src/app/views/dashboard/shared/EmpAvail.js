import { Card, CardContent, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BarChartComponent = ({ employees }) => {
    const COLORS = ['#0088FE', '#00C49F'];

    // Prepare data in a format suitable for BarChart
    const data = employees && employees.map(employee => ({
        name: employee.empName,
        activeTickets: employee.inprogress,
        completedTickets: employee.completed
    }));

    return (
        <Card style={{ maxWidth: 1200, margin: '0 auto', marginTop: 20 }}>
            <CardContent>
                <Typography variant="h6" align="left" gutterBottom>
                    Employee Ticket Overview
                </Typography>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="activeTickets" fill={COLORS[0]} name="Active Tickets" />
                            <Bar dataKey="completedTickets" fill={COLORS[1]} name="Completed Tickets" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default BarChartComponent;
