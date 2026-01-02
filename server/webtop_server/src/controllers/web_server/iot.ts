

import { Request, Response, NextFunction } from 'express';
import Robotjs = require('robotjs');
import NetworkHelper = require('../../helpers/network');

import { getWsDataSenders, getWsDataDataSets, getWsDataDataSetData } from '../../helpers/database';

class IOT {

    async getWsDataSenders(req: Request, res: Response) {
        const senders = await getWsDataSenders();
        return res.json({
            senders,
            success: true,
        });
    }

    async getWsDataDataSets(req: Request, res: Response) {
        const { sender } = req.query;
        if (typeof sender === 'string') {
            const dataSets = await getWsDataDataSets(sender);
            return res.json({
                dataSets,
                success: true,
            });
        } else {
            return res.status(400).json({
                message: "Bad request. Please ensure that the 'sender' query parameter is a string and is not null.",
                success: false,
            });
        }
    }

    async getWsDataDataSetData(req: Request, res: Response) {
        const { sender, dataSetId } = req.query;

        if (typeof dataSetId === 'string' && typeof sender === 'string') {
            const data = await getWsDataDataSetData(sender, dataSetId);
            return res.json({
                data,
                success: true,
            });

        } else {

            return res.status(400).json({
                message: "Bad request. Please ensure that the 'sender' and 'dataSetId' query parameters are strings and not null.",
                success: false,
            });
        }


    }

}

export = IOT;