
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { cloudLogin, listDevicesByType, loginDevice, loginDeviceByIp, getDeviceInfo, turnOff, turnOn } from 'tp-link-tapo-connect';


async function getDeviceToken(username: string, password: string, ipAddress: string) {
    var deviceToken = await loginDeviceByIp(username, password, ipAddress)
    return deviceToken;
}

async function turnOffDevice(username: string, password: string, ipAddress: string) {
    const token = await getDeviceToken(username, password, ipAddress);
    await turnOff(token);
}

async function turnOnDevice(username: string, password: string, ipAddress: string) {
    const token = await getDeviceToken(username, password, ipAddress);
    await turnOn(token);
}

async function getDeviceStatus(username: string, password: string, ipAddress: string) {
    const token = await getDeviceToken(username, password, ipAddress);
    return (await getDeviceInfo(token)).device_on;
}

async function toggleDevice(username: string, password: string, ipAddress: string) {

    const deviceIsEnabled = await getDeviceStatus(username, password, ipAddress);
    if (deviceIsEnabled) {
        await turnOffDevice(username, password, ipAddress);
    } else {
        await turnOnDevice(username, password, ipAddress);
    }
}
class Tapo {

    async getDeviceToken(req: Request, res: Response) {
        try {
            const { username, password, ip } = req.body
            const deviceToken = await getDeviceToken(username, password, ip);
            return res.json({
                token: deviceToken,
                success: true,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error,
                success: false,
            });
        }
    }

    async getDeviceList(req: Request, res: Response) {
        try {
            const { username, password } = req.body
            const token = await cloudLogin(username, password);
            const devices = await listDevicesByType(token, 'SMART.TAPOPLUG');
            return res.json({
                devices,
                success: true,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error,
                success: false,
            });
        }
    }

    async toggleDevice(req: Request, res: Response) {
        try {
            const { username, password, ip } = req.body
            await toggleDevice(username, password, ip)
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error,
                success: false,
            });
        }
    }

    async turnOffdevice(req: Request, res: Response) {
        try {
            const { username, password, ip } = req.body
            await turnOffDevice(username, password, ip)
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error,
                success: false,
            });
        }
    }

    async turnOnDevice(req: Request, res: Response) {
        try {
            const { username, password, ip } = req.body
            await turnOnDevice(username, password, ip)
            return res.json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error,
                success: false,
            });
        }
    }

}

export = Tapo;