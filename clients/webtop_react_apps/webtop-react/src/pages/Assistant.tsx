import { Textarea, addToast } from "@heroui/react";
import { Column } from "../components/Layout";
import { useState } from "react";
import useKeyPress, { useKeyCombo } from "../hooks/useKeyPress";


interface UserInputFieldProps {
    onSend: (text: string) => Promise<void>
}

function UserInputField({ onSend }: UserInputFieldProps) {

    const [userInput, setUserInput] = useState<string>('')

    const sendInput = () => {
        if (userInput) {
            onSend(userInput)
            clear()
        }
    }

    useKeyCombo({ key: 'Enter' }, (e: KeyboardEvent) => {
        console.log('Enter!')
        e.preventDefault()
        sendInput()
    })

    useKeyCombo({ key: 'Enter', alt: true }, (e: KeyboardEvent) => {
        console.log('alt+Enter!')
        e.preventDefault()
        setUserInput(`${userInput}\n`)
    })

    const clear = () => {
        setUserInput('')
    }

    return <>
        <Textarea
            fullWidth
            placeholder="What can I help you with today?"
            description='Press Enter to send. Alt+Enter creates a new line.'
            onValueChange={setUserInput}
            value={userInput}
        />
    </>
}

export default function Assistant() {

    const handleSend = async (text: string) => {

        addToast({
            title: text,
        });

    }

    return <>
        <Column>
            <UserInputField onSend={handleSend} />
        </Column>
    </>
}