import { Box, Typography } from "@mui/material";

export const CopyRights = () => {
    return (
        <Box
            sx={{
                textAlign: "center",
                py: 2,
                // backgroundColor: "primary.main",
                color: "black",
            }}
        >
            <Typography variant="body2">
                Copyrights &copy; 2022 - {new Date().getFullYear()} WhyDigits. All Rights Reserved.
            </Typography>
            {/* <Typography variant="body2">
                Registered in 2022
            </Typography> */}
        </Box>
    );
};
