

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';


class ThumbnailSetter {

    async changeThumbnail(req: Request, res: Response) {

        const { videoPath, thumbnail } = req.body;
        // req.files
        // const thumbnailFile = req.files?.['thumbnail']?.[0]; // Access thumbnail file
        // const videoPath = req.body.videoPath; // Access the video file name sent via the form data
        console.log(videoPath)
        return res.json({
            success: true,
        });

    }
}

export = ThumbnailSetter;