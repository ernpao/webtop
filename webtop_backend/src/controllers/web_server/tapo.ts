
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';


const _ERROR_CODES = {
    "0": "Success",
    "-1010": "Invalid Public Key Length",
    "-1012": "Invalid terminalUUID",
    "-1501": "Invalid Request or Credentials",
    "1002": "Incorrect Request",
    "-1003": "JSON formatting error "
}


const _URL = "https://eu-wap.tplinkcloud.com";

async function _getToken(email: String, password: String) {
    const payload = {
        "method": "login",
        "params": {
            "appType": "Tapo_Ios",
            "cloudUserName": email,
            "cloudPassword": password,
            "terminalUUID": "0A950402-7224-46EB-A450-7362CDB902A2"
        }

    };
    const response = await axios.post(_URL, payload);
    const result = response.data.result;
    return result.token;
}

async function _getDeviceList(email: String, password: String) {

    const token = await _getToken(email, password);
    const url = `https://eu-wap.tplinkcloud.com?token=${token}`;

    const payload = {
        "method": "getDeviceList",
    }

    const response = await axios.post(url, payload);
    const result = response.data.result;
    return result.deviceList;
}

class Tapo {

    async getToken(req: Request, res: Response) {
        const { username, password } = req.body
        const token = await _getToken(username, password);
        return res.json({
            token,
            success: true,
        });
    }

    async getDeviceList(req: Request, res: Response) {
        const { username, password } = req.body
        const deviceList = await _getDeviceList(username, password);
        return res.json({
            deviceList,
            success: true,
        });
    }

}

export = Tapo;