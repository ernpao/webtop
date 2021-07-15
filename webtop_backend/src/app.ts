require('dotenv').config()
import { createWs } from './web_server';
const wsPort = parseInt(process.env.PORT == undefined ? '' : process.env.PORT)
createWs(wsPort)

import { createWss } from './web_socket_server';
const wssPort = parseInt(process.env.WEBSOCKET_PORT == undefined ? '' : process.env.WEBSOCKET_PORT)
createWss(wssPort)