
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { cloudLogin, listDevicesByType, loginDevice, loginDeviceByIp, getDeviceInfo, turnOff, turnOn } from 'tp-link-tapo-connect';


async function getDeviceToken(username: string, password: string, ipAddress: string) {
    var deviceToken = await loginDeviceByIp(username, password, ipAddress)
    return deviceToken;
}

async function turnOffSmartPlug(username: string, password: string, ipAddress: string) {
    const token = await getDeviceToken(username, password, ipAddress);
    await turnOff(token);
}

async function turnOnSmartPlug(username: string, password: string, ipAddress: string) {
    const token = await getDeviceToken(username, password, ipAddress);
    await turnOn(token);
}

async function getSmartPlugStatus(username: string, password: string, ipAddress: string) {
    const token = await getDeviceToken(username, password, ipAddress);
    return (await getDeviceInfo(token)).device_on;
}

async function toggleSmartPlug(username: string, password: string, ipAddress: string) {

    const plugIsEnabled = await getSmartPlugStatus(username, password, ipAddress);
    if (plugIsEnabled) {
        await turnOffSmartPlug(username, password, ipAddress);
    } else {
        await turnOnSmartPlug(username, password, ipAddress);
    }
}
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

    async toggleSmartPlug(req: Request, res: Response) {
        const { username, password, ip } = req.body
        await toggleSmartPlug(username, password, ip)
        return res.json({
            success: true,
        });
    }

    async turnOffSmartPlug(req: Request, res: Response) {
        const { username, password, ip } = req.body
        await turnOffSmartPlug(username, password, ip)
        return res.json({
            success: true,
        });
    }

    async turnOnSmartPlug(req: Request, res: Response) {
        const { username, password, ip } = req.body
        await turnOnSmartPlug(username, password, ip)
        return res.json({
            success: true,
        });
    }

}

export = Tapo;