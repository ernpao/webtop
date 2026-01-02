

import { Request, Response, NextFunction } from 'express';
import Robotjs = require('robotjs');
import NetworkHelper = require('../../helpers/network');


import si = require('systeminformation');
import axios from 'axios';
class Desktop {
    async getDesktopInfo(req: Request, res: Response) {
        const cpu = await si.cpu();
        const bios = await si.bios();
        const baseboard = await si.baseboard();
        const mem = await si.mem();
        const graphics = await si.graphics();
        return res.json({
            cpu,
            bios,
            motherboard: baseboard,
            mem,
            graphics,
            success: true,
        });
    }

    async getCpuInfo(req: Request, res: Response) {
        const cpu = await si.cpu();
        const cpuTemperature = await si.cpuTemperature();
        return res.json({
            cpu,
            cpuTemperature,
            success: true,
        });
    }

    async getNetworkConnections(req: Request, res: Response) {
        const networkConnections = await si.networkConnections()

        const nonZeroConnections: any[] = [];

        // const blacklist = ["Local", "0.0.0.0", "127.0.0.1", ""];
        networkConnections.forEach((connection) => {
            const { localAddress } = connection;
            if (localAddress.startsWith("192.168.100")) {
                nonZeroConnections.push(connection)
            }
        })

        // const networkInterfaces = await si.networkInterfaces();

        return res.json({
            // networkInterfaces,
            networkConnections: nonZeroConnections,
            success: true,
        });
    }

    async getVirtualBoxInfo(req: Request, res: Response) {
        const vboxInfo = await si.vboxInfo();
        return res.json({
            vboxInfo,
            success: true,
        });
    }

    async restartWindowsGraphicsDriver(req: Request, res: Response) {
        try {

            Robotjs.keyTap("b", ['command', 'shift', 'control'])
            
            return res.json({
                success: true,
            });

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                success: false,
                error: err,
            });
        }
    }

    async getTemperatureInfo(req: Request, res: Response) {
        const cpu = await si.cpu();
        const cpuTemperature = await si.cpuTemperature();
        return res.json({
            cpuTemperature,
            success: true,
        });
    }
}

export = Desktop