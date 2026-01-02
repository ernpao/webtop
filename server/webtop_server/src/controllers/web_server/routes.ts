import { Request, Response, NextFunction } from 'express';

class Routes {
    index(req: Request, res: Response) {
        res.json({
            'success': true,
            'message': 'Webtop Backend Server'
        })
    }
}

export = Routes