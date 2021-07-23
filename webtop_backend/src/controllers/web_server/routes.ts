import { Request, Response, NextFunction } from 'express';

module.exports = {
    index: (req: Request, res: Response) => {
        res.json({
            'success': true,
            'message': 'Webtop Backend Server'
        })
    },
}