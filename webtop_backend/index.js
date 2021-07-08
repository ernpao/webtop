require('dotenv').config()
const fs = require('fs')
const request = require('request')

const robotjs = require('robotjs')
const Tesseract = require('tesseract.js')

// Setup Express app
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
    var mouse = robotjs.getMousePos();
    console.log(mouse)
    res.json({
        'success': true,
        'message': 'Webtop Backend Server'
    })
})

app.post('/ocr', (req, res) => {

    // Image url provided by user for OCR
    const { url } = req.body

    // Write image file from URL here
    const filename = 'temp/ocr-temp.png'
    var writeFile = fs.createWriteStream(filename)

    request(url).pipe(writeFile).on('close', async () => {
        console.log(url, 'saved to', filename)
        try {
            // Process image file
            var ocrResult = await Tesseract.recognize(filename)
            const { data, jobId } = ocrResult
            const { text, confidence } = data

            // Base result json
            var result = { success: true, jobId, text, confidence };

            // Process user query to determine which
            // data to include in results
            const query = req.query
            Object.keys(query).forEach(key => {
                if (key.indexOf("include_") == 0) {
                    var include = query[key]
                    if (include) {
                        const propertyName = key.replace("include_", "")
                        result[propertyName] = data[propertyName]
                    }
                }
            });

            return res.json(result)

        } catch (err) {
            console.error(err)
            return res.status(500).json({ success: false, err })
        }

    });

})

app.listen(process.env.PORT)

// Setup Websockets
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT })
wss.on('connection', (socket) => {
    console.log("Connection established");

    const sendMessageToClient = (type, topic, data, client = socket) =>
        client.send(JSON.stringify({
            "_ws_type": type,
            "_ws_topic": topic,
            "_ws_data": data
        }));


    const sendPingResponse = (client = socket) => sendMessageToClient("ping_response", client);

    const broadcastToClients = (type, topic, data) => {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                sendMessageToClient(type, topic, data, client)
            }
        });
    }

    /**
     * When client sends a message.
     */
    socket.on('message', (message) => {
        var messageFromClient = message

        if (typeof message === 'string' || message instanceof String) {
            messageFromClient = JSON.parse(message);
        }

        const type = messageFromClient._ws_type;
        const topic = messageFromClient._ws_topic;
        const data = messageFromClient._ws_data;

        switch (type) {
            case "ping":
                sendPingResponse();
                break;
            case "bus":
                broadcastToClients(type, topic, data);
                break;
            case "esp32_webtop_client":
                switch (topic) {
                    case "esp32_cam_capture":
                        console.log("Camera data received from ESP32-CAM client:")
                        console.log(data)
                        broadcastToClients(type, topic, data);
                        break;
                    default:
                        console.log("Data received from ESP32 client:")
                        console.log(data)
                        break;
                }

                break;
            default:
                console.log("Data received from Webtop client:")
                console.log(messageFromClient);
                break;
        }

    });

    /**
     * When client closes the connection.
     */
    socket.on('close', () => {
        console.log("Connection closed");
    });

    /**
     * When an error occurs with the client connection.
     */
    socket.on('error', (e) => {
        console.log("Connection Error:");
        console.log(e);
    });

});