import { io } from "socket.io-client";
import { useState, useEffect, useRef, useCallback, useMemo, ReactNode } from "react";
import { Button, Card, CardBody, ScrollShadow, Spacer } from "@heroui/react";
import { Column, Row, Screen, ScrollableList, TwoHalves } from "../components/Layout";
import TextHero from "../components/typography/TextHero";
import TextSubtitle from "../components/typography/TextSubtitle";

import NearMeIcon from '@mui/icons-material/NearMe';
import PersonIcon from '@mui/icons-material/Person';
import VideocamIcon from '@mui/icons-material/Videocam';


function usePluginBridge() {
    const url = "http://192.168.50.10:48914"
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [cameras, setCameras] = useState<string[]>([]);
    const [avatars, setAvatars] = useState<string[]>([]);

    useEffect(() => {
        const socket = io(url);
        socketRef.current = socket;

        let buffer = "";

        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

        socket.on("tcp_message", (chunk: string) => {
            buffer += chunk;

            const parts = buffer.split("\n");
            buffer = parts.pop()!; // keep incomplete JSON

            for (const part of parts) {
                if (!part.trim()) continue;

                try {
                    const msgJson = JSON.parse(part);
                    const { command, payload } = msgJson;

                    switch (command) {
                        case "get_cameras_response":
                            setCameras(payload.cameras);
                            break;
                        case "get_avatars_response":
                            setAvatars(payload.avatars);
                            break;
                    }

                    setMessages(prev => [...prev, msgJson]);

                } catch (e) {
                    console.error("Invalid JSON:", part);
                }
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [url]);

    const sendMessage = useCallback((msg) => {
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit("ws_message", JSON.stringify(msg));
        }
    }, []);

    const sendCommand = useCallback((command: string, payload?: any) => {
        sendMessage({ command, payload: payload ?? null })
    }, [])

    const getCameras = useCallback(() => {
        sendCommand('get_cameras')
    }, [])

    const setCamera = (name: string) => {
        sendCommand('set_camera', { name })
    }

    const selectCamera = (name: string) => {
        sendCommand('select_camera', { name })
    }

    const getAvatars = useCallback(() => {
        sendCommand('get_avatars')
    }, [])

    const selectAvatar = useCallback((name: string) => {
        sendCommand('select_avatar', { name })
    }, [])


    return {
        connected,
        messages,
        getCameras,
        setCamera,
        selectCamera,
        cameras,
        getAvatars,
        selectAvatar,
        avatars,
    };
}


export default function Reallusion() {


    return <Screen>
        <Row fullHeight>
            <TwoHalves
                leftContent={
                    <Column spacing={2}>
                        <Avatars />
                    </Column>
                }

                rightContent={
                    <Column spacing={2}>
                        <Cameras />
                    </Column>
                }
            />
        </Row>
    </Screen>
}

function Cameras() {

    const { connected, getCameras, setCamera, selectCamera, cameras } = usePluginBridge();

    useEffect(() => {
        if (connected) {
            getCameras()
        }
    }, [connected])

    const items = useMemo(() => {
        return cameras.map((name, i) => {
            return <Card fullWidth>
                <CardBody>
                    <Row crossAxisCenter justifyContent={"space-between"}>
                        <Row crossAxisCenter spacing={1}>
                            <VideocamIcon />
                            <TextSubtitle key={i}>{name}</TextSubtitle>
                        </Row>
                        <div>
                            <Row crossAxisCenter spacing={2}>
                                <Button size="lg" onPress={() => { selectCamera(name) }}>Select<NearMeIcon /></Button>
                                <Button size="lg" onPress={() => { setCamera(name) }}>Switch To<VideocamIcon /></Button>
                            </Row>
                        </div>
                    </Row>
                </CardBody>
            </Card>
        })
    }, [cameras])

    return <>
        <Section
            title="Cameras"
        // titleIcon={<VideocamIcon />}
        >
            <ScrollableList maxHeight="500px" fullWidth items={items} />
        </Section>
    </>


}

function Avatars() {

    const { connected, getAvatars, selectAvatar, avatars } = usePluginBridge();

    useEffect(() => {
        if (connected) {
            getAvatars()
        }
    }, [connected])

    const items = useMemo(() => {
        return avatars.map((name, i) => {
            return <Card fullWidth>
                <CardBody>
                    <Row crossAxisCenter justifyContent={"space-between"}>
                        <Row crossAxisCenter spacing={1}>
                            <PersonIcon />
                            <TextSubtitle key={i}>{name}</TextSubtitle>
                        </Row>
                        <div>
                            <Row crossAxisCenter spacing={2}>
                                <Button size="lg" onPress={() => { selectAvatar(name) }}>Select<NearMeIcon /></Button>
                            </Row>
                        </div>
                    </Row>
                </CardBody>
            </Card>
        })
    }, [avatars])

    return <>
        <Section
            title="Avatars"
        // titleIcon={<VideocamIcon />}
        >
            <ScrollableList maxHeight="500px" fullWidth items={items} />
        </Section>
    </>


}

interface SectionProps {
    title: string,
    titleIcon?: ReactNode,
    children: ReactNode,
}

const Section: React.FC<SectionProps> = (props) => {
    return <Column fullWidth spacing={1}>
        <Row crossAxisCenter>
            <Spacer x={5} />
            <TextHero fontSize="1.5rem">{props.title}</TextHero>
            {props.titleIcon ?? <></>}
        </Row>
        {props.children}
    </Column>
}