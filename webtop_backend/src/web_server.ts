
import express from 'express';
// Import controllers
import Desktop = require('./controllers/web_server/desktop')
import OCR = require('./controllers/web_server/ocr')
import Routes = require('./controllers/web_server/routes')

// Setup Web server
const desktop = new Desktop();
const ocr = new OCR();
const routes = new Routes();

export function createWs(port: number) {
    const webServer = express()
    webServer.use(express.json())
    webServer.use(express.static(__dirname + '/html'));

    webServer.get('/', routes.index)

    webServer.post('/ocr', ocr.postOcr)

    webServer.get('/desktop/info', desktop.getDesktopInfo)

    webServer.listen(port)
}
