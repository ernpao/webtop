
import express from 'express';
// Import controllers
const routes = require('./controllers/web_server/routes')
const desktop = require('./controllers/web_server/desktop')
const ocr = require('./controllers/web_server/ocr')

// Setup Web server
export function createWs(port: number) {
    const webServer = express()
    webServer.use(express.json())
    webServer.use(express.static(__dirname + '/'));

    webServer.get('/', routes.index)

    webServer.post('/ocr', ocr.postOcr)

    webServer.get('/desktop/info', desktop.getDesktopInfo)

    webServer.listen(port)
    return webServer;
}
