import easymidi, { Channel, ControlChange } from 'easymidi';


class MIDIController {

    #output: easymidi.Output;
    name: string;

    constructor(name: string) {
        this.name = name;
        this.#output = new easymidi.Output(this.name)
        console.log(`Created a MIDI controller with name "${this.name}"`)
    }

    sendCC(controller: number, value: number, channel: number) {
        let _channel = this.#numberToChannel(channel)
        let parameter: ControlChange = { controller, value, channel: _channel }
        this.#output.send("cc", parameter)
    }

    #numberToChannel(channel: number): Channel {
        switch (channel) {
            case 1: return 1;
            case 2: return 2;
            case 3: return 3;
            case 4: return 4;
            case 5: return 5;
            case 6: return 6;
            case 7: return 7;
            case 8: return 8;
            case 9: return 9;
            case 10: return 10;
            case 11: return 11;
            case 12: return 12;
            case 13: return 13;
            case 14: return 14;
            case 15: return 15;
            default: return 0;
        }
    }

}

export = MIDIController