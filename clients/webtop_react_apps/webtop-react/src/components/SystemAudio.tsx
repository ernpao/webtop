import { Select, SelectItem, Spinner } from "@heroui/react";
import { Key, useEffect, useState } from "react";
import { Column, Row } from "./Layout";
import TextSubtitle from "./typography/TextSubtitle";
import TextHero from "./typography/TextHero";
import TextLabel from "./typography/TextLabel";

interface AudioDevice {
    Default: boolean
    DefaultCommunication: boolean
    Device: string
    Index: number
    ID: string
    Name: string
    Type: string

}

export function useSystemAudio() {
    const [playbackDevices, setPlaybackDevices] = useState<AudioDevice[]>([])
    const [defaultPlaybackDevice, setDefaultPlaybackDevice] = useState<AudioDevice | null>(null)
    const [recordingDevices, setRecordingDevices] = useState<AudioDevice[]>([])
    const [timestamp, setTimestamp] = useState<Date>(new Date())
    const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)


    const API_ENDPOINT = "http://192.168.50.10:10239/audio-devices"

    const getAudioDevices = async () => {

        try {
            const res = await fetch(API_ENDPOINT, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const devices: AudioDevice[] = (await res.json()).devices;

            const _playbackDevices = devices.filter(d => d.Type == 'Playback')
            const _defaultPlaybackDevice = _playbackDevices.filter(d => d.Default)[0];

            setPlaybackDevices(_playbackDevices)
            setDefaultPlaybackDevice(_defaultPlaybackDevice)

            const _recordingDevices = devices.filter(d => d.Type == 'Recording')
            setRecordingDevices(_recordingDevices)

        } catch (error) {
            console.error(error)
        } finally {
            setTimeout(() => {
                setTimestamp(new Date())
            }, 10 * 1000)
        }
    }

    const setAudioDevice = async (deviceName: string, deviceType: "Playback" | "Recording") => {

        if (loading) return;

        setLoading(true)

        // const device = playbackDevices[index]

        try {

            const res = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    device: deviceName,
                    type: deviceType
                })
            });

            await getAudioDevices()

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAudioDevices()
    }, [timestamp])

    return { loading, defaultPlaybackDevice, playbackDevices, recordingDevices, setAudioDevice }
}

export function PlaybackDevices() {

    const { loading, playbackDevices, defaultPlaybackDevice, recordingDevices, setAudioDevice } = useSystemAudio()

    return <Column fullWidth>
        <TextLabel>Audio Playback Device</TextLabel>
        <Select
            fullWidth
            variant="bordered"
            // label="Audio Playback Device"
            // labelPlacement="outside"
            size="lg"
            isDisabled={loading}
            selectedKeys={[defaultPlaybackDevice?.ID]}
            onSelectionChange={(keys) => {
                const selected = (Array.from(keys as Set<Key>).map(k => k.toString()))[0]
                const selectedDevice = playbackDevices.filter(d => d.ID == selected)[0]
                setAudioDevice(selectedDevice.Name, "Playback")
            }}
        >
            {playbackDevices.sort((a, b) => { return a.Name.localeCompare(b.Name) }).map((d) => {
                return <SelectItem key={d.ID} >{d.Name}</SelectItem>
            })}
        </Select>
    </Column>
}