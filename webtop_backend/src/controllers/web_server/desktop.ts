

import { Request, Response, NextFunction } from 'express';

import Robotjs = require('robotjs')
class Desktop {
    getDesktopInfo(req: Request, res: Response) {
        return res.json({
            success: true,
        });
    }
}

export = Desktop