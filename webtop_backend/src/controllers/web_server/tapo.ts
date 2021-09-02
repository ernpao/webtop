
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { cloudLogin, listDevicesByType } from 'tp-link-tapo-connect';




class Tapo {

    async getToken(req: Request, res: Response) {
        const { username, password } = req.body
        const token = await cloudLogin(username, password);
        return res.json({
            token,
            success: true,
        });
    }

    async getDeviceList(req: Request, res: Response) {
        const { username, password } = req.body
        const token = await cloudLogin(username, password);
        const devices = await listDevicesByType(token, 'SMART.TAPOPLUG');
        return res.json({
            devices,
            success: true,
        });
    }

}

export = Tapo;