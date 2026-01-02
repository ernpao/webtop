

import { Request, Response, NextFunction } from 'express';

import Python = require('../../helpers/python');

class StableDiffusion {

    async process(req: Request, res: Response) {

        const python = new Python();
        await python.runScript('test.py', (data) => {
            console.log(`Result: ${data}`)
        })

        return res.json({
            success: true,
        });

    }
}

export = StableDiffusion;