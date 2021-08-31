
import Express from 'express';

// Import controllers classes
import Desktop = require('./controllers/web_server/desktop')
import OCR = require('./controllers/web_server/ocr')
import Routes = require('./controllers/web_server/routes')
import Tapo = require('./controllers/web_server/tapo')

class WebServer {
    #port: number;
    #webServer: Express.Express;

    /// Controllers
    #desktopController = new Desktop();
    #ocrController = new OCR();
    #routesController = new Routes();
    #tapoController = new Tapo();

    constructor(port: number) {
        this.#port = port;
        this.#webServer = Express();
        this.#webServer.use(Express.json())
        this.#webServer.use(Express.static(__dirname + '/html'));

        this.#webServer.get('/', this.#routesController.index)

        this.#webServer.post('/ocr', this.#ocrController.postOcr)

        this.#webServer.get('/desktop/info', this.#desktopController.getDesktopInfo)

        this.#webServer.post('/tapo', this.#tapoController.getToken)
        this.#webServer.post('/tapo/devices', this.#tapoController.getDeviceList)

        this.#webServer.listen(this.#port)

        console.log(`Created a new WebServer listening on port ${this.#port}`)
    }

}

export = WebServer