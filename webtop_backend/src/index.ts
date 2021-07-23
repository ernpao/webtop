require('dotenv').config()
import WebServer from './web_server';
import WebSocketServer from './web_socket_server';

let wsPort = parseInt(process.env.PORT == undefined ? '' : process.env.PORT)
let wssPort = parseInt(process.env.WEBSOCKET_PORT == undefined ? '' : process.env.WEBSOCKET_PORT)

new WebServer(wsPort)
new WebSocketServer(wssPort)

