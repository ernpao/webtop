import { useEffect, useState } from "react";
import { Column, Row, TwoHalves } from "./Layout";
import { Gauge } from '@mui/x-charts/Gauge';
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import TextSubtitle from "./typography/TextSubtitle";
import TextHero from "./typography/TextHero";
import { Spacer } from "@heroui/react";

interface GpuData {
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


export function useGpuMonitoring() {

    const [gpuData, setGpuData] = useState<GpuData[]>([])
    const [timestamp, setTimestamp] = useState<Date>(new Date())
    const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false)

    const API_ENDPOINT = "http://192.168.50.10:10239/gpu-info"


    const useGpuInfo = async () => {

        try {
            const res = await fetch(API_ENDPOINT, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API Error (${res.status}): ${errorText || 'Failed to fetch response'}`);
            }

            const gpuData: GpuData[] = await res.json();

            setGpuData(gpuData)

        } catch (error) {
            console.error(error)
        } finally {
            setTimestamp(new Date())
        }

        setInitialLoadComplete(true)

    }

    useEffect(() => {
        setTimeout(useGpuInfo, initialLoadComplete ? 2000 : 0)
    }, [timestamp])

    return { gpuData }

}

export function useCpuMonitoring() {

}

export function GpuMemoryMonitor() {
    const { gpuData } = useGpuMonitoring()

    return (
        <Row className='custom-gpu-monitor' fullHeight expand>

            {
                gpuData?.map((gpu, i) => {

                    return (
                        <Column key={i} mainAxisCenter crossAxisCenter expand>

                            <TextHero>VRAM USAGE</TextHero>
                            <Gauge
                                cornerRadius={"50%"}
                                value={gpu.memoryUsed}
                                valueMax={gpu.memoryTotal}
                                // text={gpu.memoryUsedGb + " / " + gpu.memoryTotalGb}
                                text={`${Math.round(gpu.memoryUsed * 100 / gpu.memoryTotal)}%`}
                                sx={{
                                    height: "50%",
                                    maxWidth: "50%",
                                    aspectRatio: 1,
                                    "& .MuiGauge-valueText": {
                                        fontSize: "7vw",
                                    },
                                    "& .MuiGauge-valueArc ": {
                                        fill: "#afff00"
                                    }
                                }}>
                            </Gauge>
                            <TextSubtitle>{gpu.memoryUsedGb + " / " + gpu.memoryTotalGb}</TextSubtitle>
                            {/* <Spacer y={2} /> */}

                            {/* <Row mainAxisCenter >
                                <Column crossAxisCenter >
                                    <TextSubtitle>{`GPU TEMP ${gpu.temp}°C`}</TextSubtitle>
                                    <TextSubtitle>{`GPU LOAD ${gpu.load}%`}</TextSubtitle>
                                </Column>
                            </Row> */}

                        </Column>
                    )
                }
                )

            }


        </Row>
    )
}