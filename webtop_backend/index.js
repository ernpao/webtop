require('dotenv').config()
const webServer = require('./web_server')
const webServerPort = process.env.PORT
webServer.createWebServer(webServerPort)

const webSocketServer = require('./web_socket_server')
const webSocketServerPort = process.env.WEBSOCKET_PORT
webSocketServer.create(webSocketServerPort)