import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from "@heroui/react";
import { Column, Row } from "../components/Layout";
import { useEffect, useState } from "react";
import { GpuMemoryMonitor } from "../components/SystemMonitoring";
import { PlaybackDevices } from "../components/SystemAudio";
import Reallusion from "./Reallusion";

export default function Dashboard() {

    useEffect(() => {
    }, [])

    const [stateValue, setStateValue] = useState<string>('')

    // return <GpuMemoryMonitor />

    // return <PlaybackDevices />

    return <Reallusion />

    // return <Row crossAxisCenter height={'100%'}>
    //     <Column fullWidth mainAxisCenter>
    //         <Row mainAxisCenter>
    //             <Button color="primary" >This is a test</Button>
    //             <Button color="primary" >This is a test</Button>
    //             <Button color="primary" >This is a test</Button>
    //         </Row>
    //     </Column>
    //     <Column fullWidth mainAxisCenter>
    //         <Row mainAxisCenter>
    //             <Card>
    //                 <CardHeader>Testing</CardHeader>
    //                 <CardBody>
    //                     This is just a test. I really like typing on this keyboard.
    //                 </CardBody>
    //             </Card>
    //             <Card>
    //                 <CardHeader>Testing</CardHeader>
    //                 <CardBody>
    //                     This is just a test. I really like typing on this keyboard.
    //                     <Select className="dark">
    //                         <SelectItem className="dark">Test</SelectItem>
    //                         <SelectItem className="dark">Test</SelectItem>
    //                         <SelectItem className="dark">Test</SelectItem>
    //                         <SelectItem className="dark">Test</SelectItem>
    //                     </Select>
    //                 </CardBody>
    //             </Card>
    //         </Row>
    //         <Input size='lg' ></Input>
    //     </Column>
    // </Row>
} 