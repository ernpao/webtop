const WebSocket = require('ws');

// Setup WebSocket server
function create(port) {
    const wss = new WebSocket.Server({ port: port })
    wss.on('connection', (socket) => {
        console.log("Connection established");

        socket.on('message', (message) => {

            if (Buffer.isBuffer(message)) {
                var buffer = message;
                wss.clients.forEach(function each(client) {
                    var clientIsOpen = client.readyState === WebSocket.OPEN;
                    if (client != socket && clientIsOpen) {
                        const body = JSON.stringify(buffer);
                        sendMessageToWebSocket("Buffer Source", null, null, null, body, Date.now(), client);
                    }
                });
                return;
            }

            var messageFromClient = message
            if (typeof message === 'string' || message instanceof String) {
                messageFromClient = JSON.parse(message);
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
                    sendMessageToWebSocket(sender, type, category, topic, body, created, socket);
                    break;
                case "bus":
                    /// Broadcast the message to all other clients connected to the server except this one
                    broadcastToClients(sender, type, category, topic, body, created, socket);
                    break;
                case "iot":
                    switch (category) {
                        case "camera":
                            console.log("Camera data received from IOT client:")
                            console.log(body)
                            broadcastToClients(sender, type, category, topic, body, created, socket);
                            break;
                        case "sensor":
                            console.log("Sensor data received from IOT client:")
                            console.log(body)
                            broadcastToClients(sender, type, category, topic, body, created, socket);
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

        });

        socket.on('close', () => {
            console.log("Connection closed");
        });

        socket.on('error', (e) => {
            console.log("Connection Error:");
            console.log(e);
        });

    });

    function sendMessageToWebSocket(sender, type, category, topic, body, created, webSocket) {
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

    function broadcastToClients(sender, type, category, topic, body, created, fromSocket) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                if (client != fromSocket) sendMessageToWebSocket(sender, type, category, topic, body, created, client)
            }
        });
    }

    return wss;
}

module.exports = {
    create,
}