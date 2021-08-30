
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';


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
    console.log(result)
    const token = result.token;
    return token;
}

class Tapo {

    async getToken(req: Request, res: Response) {
        const { username, password } = req.body
        console.log(req.body)
        const token = await _getToken(username, password);
        return res.json({
            token,
            success: true,
        });
    }

}

export = Tapo;