

import { Request, Response, NextFunction } from 'express';

const robotjs = require('robotjs')

module.exports = {
    desktopIndex: (req: Request, res: Response) => { },
    getDesktopInfo: (req: Request, res: Response) => {
        return res.json({
            success: true,
        });
    }
}