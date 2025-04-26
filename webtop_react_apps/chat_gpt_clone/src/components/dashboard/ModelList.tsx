import { Box, Button, Stack, Typography, useMediaQuery, useTheme, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react";
import { RefreshOutlined, StopCircleOutlined } from "@mui/icons-material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const API_ENDPOINT = '//192.168.50.10:11434/api/ps';
const API_ENDPOINT_GENERATE = '//192.168.50.10:11434/api/chat'

type ApiResponse = {
    models: [ModelInfo]
};

interface ModelDetails {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
}

interface ModelInfo {
    name: string;
    model: string;
    size: number;
    digest: string;
    details: ModelDetails;
    expires_at: string;
    size_vram: number;
}

export default function ModelList() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [modelInfoList, setModelInfoList] = useState<[ModelInfo]>();
    const [loading, setLoading] = useState(false);

    const getModels = async () => {
        setLoading(true);
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
            setModelInfoList(data.models);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const stopModel = async (modelName: string) => {
        setLoading(true);
        try {

            const res = await fetch(API_ENDPOINT_GENERATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "model": modelName,
                    "messages": [],
                    "keep_alive": 0
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API Error (${res.status}): ${errorText || 'Failed to fetch response'}`);
            }

            await res.json();
            await getModels(); // Refresh list after stopping

            setTimeout(getModels, 5000)

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getModels();
    }, []);

    function formatModelInfo(model: ModelInfo) {
        const name = model.name;
        const digestShort = model.digest.slice(0, 12);
        const sizeGB = (model.size / 1000000000).toFixed(1);

        const gpuRatio = model.size_vram / model.size;
        const cpuRatio = 1 - gpuRatio;
        const cpuPercent = Math.round(cpuRatio * 100);
        const gpuPercent = Math.round(gpuRatio * 100);
        const usage = `${cpuPercent}% CPU / ${gpuPercent}% GPU`;

        const expiresAt = new Date(model.expires_at);
        const now = new Date();
        const diffMs = expiresAt.getTime() - now.getTime();
        const diffMinutes = Math.round(diffMs / 1000 / 60);

        return {
            "name": name,
            "id": digestShort,
            "size": `${sizeGB} GB`,
            "processor": usage,
            "until": `${diffMinutes} minutes from now`
        };
    }

    const formattedModels = modelInfoList ? modelInfoList.map(formatModelInfo) : [];

    return (
        <>
            <Stack direction={"row"} sx={{ paddingBottom: 2 }}>
                <Typography variant={isSmallScreen ? "h5" : "h3"} sx={{ flexGrow: 1 }}>Ollama Models</Typography>
                <Button variant="text" sx={{}} onClick={getModels}>
                    Refresh
                    <RefreshOutlined sx={{ marginLeft: 1 }} />
                </Button>
            </Stack>

            <Box sx={{
                width: "100%",
                my: 2,
                mx: "auto"
            }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="model info table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Processor</TableCell>
                                <TableCell>Expires</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formattedModels.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.size}</TableCell>
                                    <TableCell>{row.processor}</TableCell>
                                    <TableCell>{row.until}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            // color="error"
                                            size="small"
                                            startIcon={<StopCircleOutlined />}
                                            onClick={() => stopModel(row.name)}
                                            disabled={loading}
                                        >
                                            Stop
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </>
    );
}
