import WebSocket from 'ws';

class WebSocketServer {
    #port: number;
    #wss: WebSocket.Server;
    constructor(port: number) {
        this.#port = port;
        this.#wss = new WebSocket.Server({ port: port })
        this.#setupWebSocketServer()
        console.log(`Created a new WebSocketServer listening on port ${this.#port}`)
    }

    #setupWebSocketServer() {
        this.#wss.on('connection', (socket) => {
            console.log("Connection established");
            this.#setupWebSocket(socket)
        });
    }

    #handleBufferMessage(buffer: Buffer, socket: WebSocket) {
        this.#wss.clients.forEach((client) => {
            var clientIsOpen = client.readyState === WebSocket.OPEN;
            if (client != socket && clientIsOpen) {
                const body = JSON.stringify(buffer);
                this.#sendMessageToWebSocket("Buffer Source", client, undefined, undefined, undefined, body, Date.now().toLocaleString());
            }
        });
    }


    #setupWebSocket(socket: WebSocket) {
        socket.on('message', (message) => {
            if (Buffer.isBuffer(message)) {
                this.#handleBufferMessage(message, socket);
                return;
            } else {

                var messageFromClient;

                if (typeof message === 'string') {
                    messageFromClient = JSON.parse(message);
                } else {
                    messageFromClient = message;
                }

                const {
                    _ws_sender: sender,
                    _ws_category: category,
                    _ws_type: type,
                    _ws_topic: topic,
                    _ws_body: body,
                    _ws_created: created,
                } = messageFromClient;

                switch (type) {
                    case "echo":
                        /// Echo the message back to the client
                        console.log("Echoing message back to client:")
                        console.log(messageFromClient)
                        this.#sendMessageToWebSocket(sender, socket, type, category, topic, body, created);
                        break;
                    case "bus":
                        /// Broadcast the message to all other clients connected to the server except this one
                        this.#broadcastToClients(sender, type, category, topic, body, created, socket);
                        break;
                    case "iot":
                        switch (category) {
                            case "camera":
                                console.log("Camera data received from IOT client:")
                                console.log(body)
                                this.#broadcastToClients(sender, type, category, topic, body, created, socket);
                                break;
                            case "sensor":
                                console.log("Sensor data received from IOT client:")
                                console.log(body)
                                this.#broadcastToClients(sender, type, category, topic, body, created, socket);
                                break;
                            default:
                                console.log("Data received from IOT client:")
                                console.log(body)
                                break;
                        }
                        break;
                    default:
                        console.log("Data received from Webtop client:")
                        console.log(messageFromClient);
                        break;
                }
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

    #sendMessageToWebSocket(
        sender: string,
        webSocket: WebSocket,
        type?: string,
        category?: string,
        topic?: string,
        body?: any,
        created?: string) {
        const data = {
            "_ws_sender": sender,
            "_ws_type": type,
            "_ws_category": category,
            "_ws_topic": topic,
            "_ws_body": body,
            "_ws_created": created,
        }
        webSocket.send(JSON.stringify(data));
    }

    #broadcastToClients(
        sender: string,
        type: string,
        category: string,
        topic: string,
        body: any,
        created: string,
        fromSocket: WebSocket) {
        this.#wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if (client != fromSocket) {
                    this.#sendMessageToWebSocket(sender, client, type, category, topic, body, created)
                }
            }
        });
    }

}

export = WebSocketServer