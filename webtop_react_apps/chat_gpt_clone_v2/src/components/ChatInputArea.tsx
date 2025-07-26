import { Card, CardBody, Textarea } from "@heroui/react"
import { IconButton, Stack } from "@mui/material"

interface ChatInputAreaProps {
    ref: React.Ref<HTMLTextAreaElement>
    disabled: boolean
    value: string
    onSend: () => void
    onChange: (value: string) => void
}

const ChatInputArea = ({ value, ref, disabled, onSend, onChange }: ChatInputAreaProps) => {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault();
            onSend();
        }
    };


    return (
        <Stack flexGrow={1} justifyContent={'flex-end'} direction={'column'}>
            <Card >
                <CardBody>

                    <Stack direction={'row'}>

                        <Textarea
                            ref={ref}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter to send, Shift+Enter for newline"
                            disabled={disabled}
                            minRows={1}
                            style={{
                                flexGrow: 1,
                                padding: '0.5rem',
                                backgroundColor: 'transparent',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                fontSize: '0.875rem',
                                // height: '150px',
                                overflowY: 'auto',
                            }}
                        />

                        <IconButton
                            onClick={onSend}
                            disabled={disabled || !value.trim()}
                            title="Send message (Enter)"
                            sx={{
                                color: 'white',
                                p: 1,
                                borderRadius: 2,
                                '&:disabled': {
                                    opacity: 0.5,
                                    cursor: 'not-allowed',
                                },
                                '&:focus': {
                                    outline: 'none',
                                },
                            }}
                        >

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M3.105 3.105a.75.75 0 01.814-.138l13.25 7.5a.75.75 0 010 1.266l-13.25 7.5a.75.75 0 01-.952-.706v-13a.75.75 0 01.138-.558z" />
                                <path d="M4.159 4.159L16.84 10l-12.68 5.841V4.159z" />
                            </svg>
                        </IconButton>
                    </Stack>

                </CardBody>


            </Card>


        </Stack>
    )

}

export default ChatInputArea