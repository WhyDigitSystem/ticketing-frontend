import { Card, styled } from "@mui/material";
import { convertHexToRGB } from "app/utils/utils";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register the components needed for the Pie chart
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const CardRoot = styled(Card)(({ theme }) => ({
    marginBottom: "24px",
    padding: "10px !important",
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

const PieChart = ({ data }) => {
    // Process the API data to fit the chart format
    const processData = (apiData) => {
        // Ensure apiData is an array with at least one item
        const [priorityData] = apiData.length ? apiData : [{ normal: 0, high: 0, medium: 0 }];
        const { normal = 0, high = 0, medium = 0 } = priorityData;
        return [high, medium, normal];
    };

    const chartData = {
        labels: ['High', 'Medium', 'Normal'],
        datasets: [
            {
                label: 'Priority Distribution',
                data: processData(data), // Processed data from the API
                backgroundColor: ['#e74c3c ', '#f1c40f', '#3498db'],
                borderColor: '#fff', // Border color of each slice
                borderWidth: 1,
            },
        ],
    };

    return (
        <CardRoot>
            <div><h6>Ticket Priority</h6></div>
            <StyledCard elevation={0}>
                <div style={{ width: '250px', height: '250px' }}>
                    <Pie data={chartData} />
                </div>
            </StyledCard>
        </CardRoot>
    );
};

export default PieChart;


