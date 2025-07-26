import { useEffect, useState } from 'react';
import { Card, CardBody, Select, SelectItem } from "@heroui/react";

import ModelInfo from '../types/ModelInfo';
import useAppDataStore from '../state/AppState';


const API_ENDPOINT = '//192.168.50.10:11434/api/tags'

type ApiResponse = {
    models: [ModelInfo];
};



const ModelSelector = () => {

    const { setSelectedModel, models, setModels, selectedModel } = useAppDataStore()

    const defaultModel: ModelInfo = {
        name: "llama3.1",
        model: "llama3.1",
        modified_at: new Date("2025-04-21T06:42:19.3854665+08:00"),
        size: 4920753328,
    }

    const [isLoading, setLoading] = useState(true)


    const getModelAtIndex = (index: number): ModelInfo => {
        return models ? models[index] : defaultModel
    }

    const getSelectedModelIndex = (): number => {
        if (selectedModel == null) return 0;

        const index = models.map(m => m.name).indexOf(selectedModel.name);

        return index == -1 ? 0 : index;

    }

    const getModels = async () => {

        try {

            const res = await fetch(API_ENDPOINT, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API Error (${res.status}): ${errorText || 'Failed to fetch response'}`);
            }

            const data: ApiResponse = await res.json();

            setModels(data.models)

            const availableModels = models.map(m => m.name)

            if ((selectedModel == null) || (availableModels.indexOf(selectedModel.name) == -1)) {
                setSelectedModel(getModelAtIndex(0))
            }

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
        <Card style={{
            flexGrow: '1'
        }}>
            <CardBody>
                <Select
                    isLoading={isLoading}
                    id="model-selector"
                    label="Select Model:"
                    disabled={isLoading}
                    defaultSelectedKeys={[`${getSelectedModelIndex()}`]}
                    onChange={
                        (e) => {
                            const modelIndex = e.target.value
                            console.log()
                            setSelectedModel(models[parseInt(modelIndex)])
                        }
                    }
                >

                    {models?.map((model, i) => {
                        const modelName = model.name.replace(":latest", "")
                        return (
                            <SelectItem key={i}>{modelName}</SelectItem>
                        )
                    })}

                </Select>

            </CardBody>
        </Card>
    )
}

export default ModelSelector