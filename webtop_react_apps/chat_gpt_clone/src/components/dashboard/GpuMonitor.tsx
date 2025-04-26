import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { Gauge } from '@mui/x-charts/Gauge';
import { RefreshOutlined } from "@mui/icons-material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const API_ENDPOINT = "//192.168.50.10:10239/gpu-info"

interface GpuInfo {
    id: string;
    name: string;
    load: string;
    temp: number;
    memoryUsed: number;
    memoryTotal: number;
    memoryUsedGb: string;
    memoryTotalGb: string;
    memoryUsage: string;
}

type ApiResponse = [GpuInfo];

interface GpuStatCardProps {
    title: string;
    value: string;
}

function GpuStatCard({ title, value }: GpuStatCardProps) {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Card sx={{
            p: 2,
            m: 1,
            width: { xs: "100%", md: "50%" }
        }}>
            <Typography variant={isSmallScreen ? "subtitle1" : "h6"}>{title}</Typography>
            <Typography variant={isSmallScreen ? "h4" : "h3"}>{value}</Typography>
        </Card>
    )
}

export default function GpuMonitor() {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const INTERVAL = 5 * 1000 // 5 Seconds

    const [gpuInfoList, setGpuInfoList] = useState<[GpuInfo]>()


    const getGpuInfo = async () => {

        try {
            const res = await fetch(API_ENDPOINT, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API Error (${res.status}): ${errorText || 'Failed to fetch response'}`);
            }

            const data: ApiResponse = await res.json();

            setGpuInfoList(data)

        } catch (error) {
            console.error(error)

        }

    }

    useEffect(() => {
        getGpuInfo()
        const timer = setInterval(getGpuInfo, INTERVAL)
        return () => clearInterval(timer) // Cleanup function
    }, [])


    return (
        <>
            <Stack direction={"row"} sx={{ paddingBottom: 2, }}>
                <Typography variant={isSmallScreen ? "h5" : "h3"} sx={{ flexGrow: 1 }}>GPU Monitor</Typography>
                <Button variant="text" sx={{}} onClick={getGpuInfo}>
                    Refresh
                    <RefreshOutlined sx={{ marginLeft: 1 }} />
                </Button>
            </Stack>
            {
                gpuInfoList?.map((gpu, i) => {

                    return (
                        <Box key={i} sx={{
                            p: 2
                        }}>

                            <Typography variant={isSmallScreen ? "h6" : "h4"} align="center">{gpu.name}</Typography>

                            <Gauge
                                cornerRadius={"50%"}
                                value={gpu.memoryUsed}
                                valueMax={gpu.memoryTotal}
                                text={gpu.memoryUsedGb + "/" + gpu.memoryTotalGb}

                                sx={{
                                    my: 2,
                                    mx: "auto",
                                    maxWidth: { xs: "100%", md: "50%" },
                                    height: { xs: "60%", md: "70%" },
                                    aspectRatio: 1,
                                    "& .MuiGauge-valueText": {
                                        fontSize: { xs: 20, md: 40 },
                                        transform: 'translate(0px, 0px)',
                                    },
                                }}>
                            </Gauge>
                            <Typography variant={"h6"} align="center">VRAM USAGE</Typography>


                            <Box sx={{
                                p: 1,
                                display: "flex",
                                justifyContent: "space-evenly",
                                flexDirection: { xs: "column", md: "row" }
                            }}>

                                <GpuStatCard title="GPU TEMP" value={`${gpu.temp}°C`}></GpuStatCard>
                                <GpuStatCard title="GPU LOAD" value={`${gpu.load}%`}></GpuStatCard>

                            </Box>

                        </Box>
                    )
                }
                )

            }

        </>
    )
}