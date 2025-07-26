import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import ModelInfo from '../types/ModelInfo';


interface AppDataStore {
    selectedModel?: ModelInfo
    setSelectedModel: (model: ModelInfo) => Promise<void>
    models?: ModelInfo[]
    setModels: (models: ModelInfo[]) => Promise<void>
}

const useAppDataStore = create<AppDataStore>()(
    persist(
        (set) => ({
            selectedModel: null,
            models: null,
            setSelectedModel: async function (model) {
                console.log("Setting active model: ", model);
                set({ selectedModel: model })
            },
            setModels: async function (models) {
                set({ models: models })
            },
        }),
        {
            name: 'chat-gpt-clone-v2-data', // key in localStorage
            // partialize: (state) => ({ selectedModel: state.selectedModel }), // only persist activeProject
        }
    )
)

export default useAppDataStore;