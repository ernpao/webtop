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
wss.on('connection', (connection) => {
    console.log("Connection established");

    connection.on('message', (message) => {
        dataFromClient = JSON.parse(message)
        const { websocket_message_type, websocket_message_topic } = dataFromClient
        console.log('Received: %s', dataFromClient);

        switch (websocket_message_type) {

            default:
                break;
        }

        switch (websocket_message_topic) {

            default:
                break;
        }

        // connection.send(JSON.stringify({
        //     "success": true,
        //     "data": dataFromClient
        // }))
    });

    connection.on('close', () => console.log("Connection closed"));
});