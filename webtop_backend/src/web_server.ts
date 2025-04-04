
import Express from 'express';
// import cors from 'cors';

// Import controllers classes
import Desktop = require('./controllers/web_server/desktop')
import OCR = require('./controllers/web_server/ocr')
import Routes = require('./controllers/web_server/routes')
import Tapo = require('./controllers/web_server/tapo')
import IOT = require('./controllers/web_server/iot')
import StableDiffusion = require('./controllers/web_server/sd')
import Ollama = require('./controllers/web_server/Ollama')

class WebServer {
    #port: number;
    #webServer: Express.Express;

    /// Controllers
    #desktopController = new Desktop();
    #ocrController = new OCR();
    #routesController = new Routes();
    #tapoController = new Tapo();
    #iotController = new IOT();
    #sdController = new StableDiffusion();
    #ollamaController = new Ollama();

    constructor(port: number) {
        this.#port = port;
        this.#webServer = Express();
        this.#webServer.use(Express.json())
        this.#webServer.use(Express.static(__dirname + '/html'));

        var cors = require('cors')
        // this.#webServer.use(cors({
        //     origin: "http://192.168.50.10:" + port, // Adjust based on your frontend URL
        //     methods: "GET,POST,OPTIONS",
        //     allowedHeaders: "Content-Type",
        // }));

        this.#webServer.use(cors());

        this.#webServer.get('/', this.#routesController.index)

        this.#webServer.post('/ocr', this.#ocrController.postOcr)

        this.#webServer.get('/desktop/info', this.#desktopController.getDesktopInfo)
        this.#webServer.get('/desktop/cpu', this.#desktopController.getCpuInfo)
        this.#webServer.get('/desktop/cpu/temperature', this.#desktopController.getTemperatureInfo)
        this.#webServer.get('/desktop/network', this.#desktopController.getNetworkConnections)
        this.#webServer.get('/desktop/virtualbox', this.#desktopController.getVirtualBoxInfo)
        this.#webServer.get('/desktop/graphics/restart', this.#desktopController.restartWindowsGraphicsDriver)

        this.#webServer.post('/tapo', this.#tapoController.getDeviceToken)
        this.#webServer.post('/tapo/devices', this.#tapoController.getDeviceList)
        this.#webServer.post('/tapo/devices/toggle', this.#tapoController.toggleDevice)
        this.#webServer.post('/tapo/devices/on', this.#tapoController.turnOnDevice)
        this.#webServer.post('/tapo/devices/off', this.#tapoController.turnOffdevice)

        this.#webServer.get('/iot/senders', this.#iotController.getWsDataSenders)
        this.#webServer.get('/iot/dataSet', this.#iotController.getWsDataDataSetData)
        this.#webServer.get('/iot/dataSets', this.#iotController.getWsDataDataSets)

        this.#webServer.post('/stable-diffusion/process', this.#sdController.process)

        this.#webServer.get('/ollama', this.#ollamaController.index)

        this.#webServer.post('/ollama/generateRemote', this.#ollamaController.generateRemote)

        this.#webServer.listen(this.#port)

        console.log(`Created a new WebServer listening on port ${this.#port}`)
    }

}

export = WebServer