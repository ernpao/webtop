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

    socket.on('message', (message) => {

        if (Buffer.isBuffer(message)) {
            var buffer = message;
            wss.clients.forEach(function each(client) {
                var clientIsOpen = client.readyState === WebSocket.OPEN;
                if (client != socket && clientIsOpen) {
                    client.send(JSON.stringify(buffer));
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
            _ws_data: data,
        } = messageFromClient;

        switch (type) {
            case "ping":
                sendPingResponse(socket);
                break;
            case "bus":
                broadcastToClients(sender, type, category, topic, data);
                break;
            case "esp32":
                switch (topic) {
                    case "esp32_cam_capture":
                        console.log("Camera data received from ESP32 client:")
                        console.log(data)
                        broadcastToClients(sender, type, category, topic, data);
                        break;
                    case "esp32_sensor_data":
                        console.log("Sensor data received from ESP32 client:")
                        console.log(data)
                        broadcastToClients(sender, type, category, topic, data);
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

    socket.on('close', () => {
        console.log("Connection closed");
    });

    socket.on('error', (e) => {
        console.log("Connection Error:");
        console.log(e);
    });

});

function sendMessageToWebSocket(sender, type, category, topic, data, socket) {
    socket.send(JSON.stringify({
        "_ws_sender": sender,
        "_ws_type": type,
        "_ws_category": category,
        "_ws_topic": topic,
        "_ws_data": data
    }));
}


function sendPingResponse(socket) {
    sendMessageToWebSocket("ping_response", socket);
}

function broadcastToClients(sender, type, category, topic, data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            if (client != socket) sendMessageToWebSocket(sender, type, category, topic, data, client)
        }
    });
}