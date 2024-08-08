import { Box, Card, CardContent, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BarChartComponent = ({ employees }) => {
    // Prepare data in a format suitable for BarChart
    const data = employees ? employees.map(employee => ({
        name: employee.empName,
        Active: employee.inprogress,
        Completed: employee.completed
    })) : [];

    return (
        <Card sx={{ maxWidth: '1200px', mx: 'auto', mt: 2, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
            <CardContent>
                <Typography variant="h6" color="text.primary" gutterBottom>
                    Employee Ticket Overview
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" tick={{ fill: '#8884d8' }} />
                            <YAxis tick={{ fill: '#8884d8' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }} />
                            <Legend />
                            <Bar dataKey="Active" fill="#3498db" barSize={30} />
                            <Bar dataKey="Completed" fill="#4CAF50" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default BarChartComponent;
