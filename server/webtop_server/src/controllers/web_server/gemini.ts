require('dotenv').config()

import { Request, Response, NextFunction } from 'express';
import { GoogleGenAI } from "@google/genai";

const Tesseract = require('tesseract.js')
const fs = require('fs')
const request = require('request')

// import path from 'path';

import axios from "axios";

const ai = new GoogleGenAI({ apiKey: process.env.AISTUDIO_GOOGLE_GEMINI_API_KEY == undefined ? '' : process.env.AISTUDIO_GOOGLE_GEMINI_API_KEY });

class Gemini {


    index(req: Request, res: Response) {
        return res.json({
            success: true,
            message: "Gemini"
        })

    }

    async generateContent(req: Request, res: Response) {
        try {
            // const requestBody: GenerateRequest = req.body;
            // const prompt = req.body.prompt + ". Answer as succinct as possible.";
            const prompt = req.body.prompt;

            const model = "gemini-2.0-flash"
            // const model = "gemini-2.5-pro-preview-03-25"

            const response = await ai.models.generateContent({
                model,
                contents: prompt,
            });

            // console.log(response.text);
            res.status(200).json(response);

        } catch (error) {

            console.error("Error sending request:", error);

            // Handle Axios errors properly
            if (axios.isAxiosError(error)) {
                res.status(error.response?.status || 500).json({
                    error: error.response?.data || "Internal server error"
                });
            } else {
                res.status(500).json({ error: "Internal server error" });
            }

        }

    }
}

export = Gemini