import WebSocket from 'ws';
import MIDIController from './controllers/web_socket_server/midi';

import { storeWsData } from './helpers/database';

class WebSocketServer {
    constructor(port: number) {
        this.#port = port;
        this.#wss = new WebSocket.Server({ port: port })
        this.#setupWebSocketServer()
        console.log(`Created a new WebSocketServer listening on port ${this.#port}`)
    }

    #port: number;
    #wss: WebSocket.Server;

    #setupWebSocketServer() {
        this.#wss.on('connection', (socket) => {
            console.log("Connection established");
            this.#setupWebSocket(socket);
        });
    }

    #setupWebSocket(socket: WebSocket) {
        socket.on('message', (message) => {
            if (Buffer.isBuffer(message)) {
                this.#processBufferMessage(message, socket);
            } else {
                this.#processSocketMessage(message.toString(), socket);
            }
        });

        socket.on('close', () => {
            console.log("Connection closed");
        });

        socket.on('error', (e) => {
            console.error("Connection Error:");
            console.error(e);
        });
    }

    #processBufferMessage(buffer: Buffer, socket: WebSocket) {
        this.#wss.clients.forEach((client) => {
            var clientIsOpen = client.readyState === WebSocket.OPEN;
            if (client != socket && clientIsOpen) {
                const body = JSON.stringify(buffer);

                let webSocketMessage = new WebSocketMessage(
                    "Webtop Buffer Source",
                    undefined,
                    undefined,
                    undefined,
                    body
                );

                this.#sendMessageToWebSocket(webSocketMessage, client);
            }
        });
    }

    #processSocketMessage(messageFromClient: string, client: WebSocket) {

        let message = WebSocketMessage.fromJsonString(messageFromClient)

        switch (message.type) {
            case "echo":
                /// Echo the message back to the client
                console.log("Echoing message back to client:");
                console.log(message.toJson());
                this.#sendMessageToWebSocket(message, client);
                break;
            case "bus":
                /// Broadcast the message to all other clients connected to the server except this one
                this.#broadcastToClients(message, client);
                break;
            case "iot":
                switch (message.category) {
                    case "camera":
                        console.log("Camera data received from IOT client:");
                        console.log(message.body);
                        this.#broadcastToClients(message, client);
                        break;
                    case "sensor":
                        console.log("Sensor data received from IOT client:");
                        console.log(message.body);
                        this.#broadcastToClients(message, client);
                        storeWsData(message.sender, message.type, message.category, message.topic, message.body, new Date(message.created))
                        break;
                    default:
                        console.log("Data received from IOT client:");
                        console.log(message.body);
                        break;
                }
                break;
            case "midi":
                console.log("MIDI command received:");
                let midiMessage = JSON.parse(message.body);
                console.log(midiMessage);
                switch (message.category) {
                    case "cc":
                        let midi = new MIDIController(midiMessage.name);
                        midi.sendCC(midiMessage.controller, midiMessage.value, midiMessage.channel);
                        break;
                    default:
                        break;
                }
                break;
            default:
                console.log("Data received from Webtop client:");
                console.log(message.toJson());
                break;
        }
    }

    #sendMessageToWebSocket(message: WebSocketMessage, socket: WebSocket) {
        socket.send(message.stringify());
    }

    #broadcastToClients(message: WebSocketMessage, originator: WebSocket) {
        this.#wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if (client != originator) {
                    this.#sendMessageToWebSocket(message, originator)
                }
            }
        });
    }

}

class WebSocketMessage {
    sender: string;
    type?: string;
    category?: string;
    topic?: string;
    body?: any;
    created: string;

    constructor(sender: string, type?: string, category?: string, topic?: string, body?: any, created?: string) {
        this.sender = sender;
        this.type = type;
        this.category = category;
        this.topic = topic;
        this.body = body;
        this.created = created === undefined ? (new Date).toUTCString() : created;
    }

    static fromJsonString(jsonString: string) {
        return this.fromJson(JSON.parse(jsonString));
    }

    static fromJson(json: any): WebSocketMessage {
        return new WebSocketMessage(
            json._ws_sender,
            json._ws_type,
            json._ws_category,
            json._ws_topic,
            json._ws_body,
            json._ws_created,
        );
    }

    toJson(): any {
        return {
            _ws_sender: this.sender,
            _ws_type: this.type,
            _ws_category: this.category,
            _ws_topic: this.topic,
            _ws_body: this.body,
            _ws_created: this.created,
        };
    }

    stringify(): string {
        return JSON.stringify(this.toJson());
    }
}

export = WebSocketServer