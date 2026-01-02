import { Box, Card, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';


const API_ENDPOINT = '//192.168.50.10:11434/api/tags'

type ModelInfo = {
    name: string,
    model: string,
    modified_at: Date,
    size: number
}

type ApiResponse = {
    models: [ModelInfo];
};

interface ModelSelectorProps {
    onModelChanged: (modelName: string) => void;
}

const ModelSelector = ({ onModelChanged }: ModelSelectorProps) => {

    const [model, setModel] = useState("llama3.1")
    const [isLoading, setLoading] = useState(true)
    const [modelList, setModelList] = useState<[ModelInfo]>()


    const getModelNameByIndex = (index: number): string => {
        return modelList ? modelList[index].name.replace(":latest", "") : "llama3.1"
    }

    const getModels = async () => {
        try {
            // const res = await fetch('//192.168.50.10:6767/ollama/generateRemote', {
            const res = await fetch(API_ENDPOINT, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API Error (${res.status}): ${errorText || 'Failed to fetch response'}`);
            }

            const data: ApiResponse = await res.json();

            setModelList(data.models)
            onModelChanged(getModelNameByIndex(0))

        } catch (error) {
            console.error(error)

        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {

        getModels()

    }, [])

    return (
        <Box
            sx={{
                m: 2,
            }}>
            <FormControl fullWidth>
                <InputLabel id="model-selector-label">Select Model:</InputLabel>
                <Select
                    labelId="model-selector-label"
                    id="model-selector"
                    value={model}
                    label="Age"
                    disabled={isLoading}
                    onChange={
                        (e) => {
                            const modelName = e.target.value
                            setModel(modelName)
                            onModelChanged(modelName)
                        }
                    }
                >

                    {modelList?.map((model, index) => {
                        const modelName = model.name.replace(":latest", "")
                        return (
                            < MenuItem key={index} value={modelName} > {modelName}</MenuItem>
                        )
                    })}

                </Select>
            </FormControl>
        </Box >
    )
}

export default ModelSelector