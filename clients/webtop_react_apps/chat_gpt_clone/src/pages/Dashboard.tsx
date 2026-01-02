import { Stack, Box, Divider } from "@mui/material";
import GpuMonitor from "../components/dashboard/GpuMonitor";
import ModelList from "../components/dashboard/ModelList";

export default function Dashboard() {
    return (
        <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ p: 2, justifyContent: "center", minHeight: "100%" }}
            divider={
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", md: "block" } }}
                />
            }
        >
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                <GpuMonitor />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                <ModelList />
            </Box>
        </Stack>
    );
}
