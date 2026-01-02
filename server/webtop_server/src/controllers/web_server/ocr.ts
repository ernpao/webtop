import { Request, Response, NextFunction } from 'express';

const Tesseract = require('tesseract.js')
const fs = require('fs')
const request = require('request')

class OCR {
    postOcr(req: Request, res: Response) {
        // Image url provided by user for OCR
        const { url } = req.body

        // Write image file from URL here
        const filename = 'temp/ocr-temp.png'
        var writeFile = fs.createWriteStream(filename)

        request(url).pipe(writeFile).on('close', async () => {
            console.log(url, 'saved to', filename)
            try {
                // Process image file
                var ocrResult = await Tesseract.recognize(filename)
                const { data, jobId } = ocrResult
                const { text, confidence } = data

                // Base result json
                var result: any = { success: true, jobId, text, confidence };

                // Process user query to determine which
                // data to include in results
                const query = req.query
                Object.keys(query).forEach(key => {
                    if (key.indexOf("include_") == 0) {
                        var include = query[key]
                        if (include) {
                            const propertyName = key.replace("include_", "")
                            result[propertyName] = data[propertyName]
                        }
                    }
                });

                return res.json(result)

            } catch (err) {
                console.error(err)
                return res.status(500).json({ success: false, err })
            }

        });
    }
}

export = OCR