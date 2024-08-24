import { Card, styled } from "@mui/material";
import { convertHexToRGB } from "app/utils/utils";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';

// Register the components needed for the Doughnut chart
ChartJS.register(ArcElement, Legend, Tooltip, ChartDataLabels);

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
                backgroundColor: ['#e74c3c', '#f1c40f', '#3498db'],
                borderColor: '#fff', // Border color of each slice
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#333',
                    font: {
                        size: 13,
                        family: 'Roboto'
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const label = tooltipItem.label || '';
                        const value = tooltipItem.raw || 0;
                        const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            },
            datalabels: {
                display: true,
                color: '#fff',
                formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100);
                    return `${percentage}%`;
                },
                font: {
                    size: 14,
                    family: 'Roboto',
                }
            }
        },
        cutout: '45%', // This makes the chart a doughnut chart
        radius: '75%', // Adjust radius to control the doughnut size
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <CardRoot>
            <div><h6>Ticket Priority</h6></div>
            <StyledCard elevation={0}>
                <div style={{ width: '270px', height: '270px' }}>
                    <Doughnut data={chartData} options={chartOptions} />
                </div>
            </StyledCard>
        </CardRoot>
    );
};

export default PieChart;
