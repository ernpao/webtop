require('dotenv').config()
import { Request, Response, NextFunction } from 'express';

const Tesseract = require('tesseract.js')
const fs = require('fs')
const request = require('request')

// import path from 'path';

import axios from "axios";


// Define a type for the data structure you're expecting
interface GenerateResponse {
    model: string;
    created_at: string;  // ISO 8601 timestamp stored as a string
    response: string;
    done: boolean;
    context: number[];
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
}

interface GenerateRequest {
    model: string;
    prompt: string;
    stream: boolean;
    context: number[];
}

class Ollama {


    index(req: Request, res: Response) {
        return res.json({
            success: true,
            message: "Ollama"
        })

    }

    async generateRemote(req: Request, res: Response) {
        try {
            // const requestBody: GenerateRequest = req.body;
            const prompt = req.body.prompt + ". Answer as succinct as possible.";
            const context = req.body.context;
            const requestBody: GenerateRequest = { model: "llama3.1", prompt: prompt, stream: false, context: context };

            // Validate request body
            if (!requestBody.model || !requestBody.prompt) {
                res.status(400).json({ error: "Missing required fields: model and prompt" });
                return;
            }

            // Remote server URL (replace with actual API endpoint)
            const remoteApiUrl = `http://${process.env.OLLAMA_SERVER_IP}:11434/api/generate`;

            // Send the POST request to the remote server
            const response = await axios.post<GenerateResponse>(remoteApiUrl, requestBody, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Forward the response from the remote server back to the client
            res.status(200).json(response.data);
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

export = Ollama