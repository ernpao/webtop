import { Box } from "@mui/material";
import ChatMessage from "../types/ChatMessage";
import MarkdownRenderer from "./MarkdownRenderer";
import { Card, CardBody } from "@heroui/react";

interface ChatHistoryProps {
    messages: ChatMessage[];
    loading: boolean;
    ref: React.Ref<unknown>;
}

interface ChatBubbleProps {
    messageType: string;
    message?: string;
    children?: React.ReactNode
}

function ChatBubble({ messageType, message, children }: ChatBubbleProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: messageType === "user" ? "flex-end" : "flex-start",
            }}
        >
            <Card
                style={{
                    padding: 2,
                    maxWidth: "60%"
                }}
            >
                <CardBody>
                    {message && <MarkdownRenderer content={message} />}
                    {children}
                </CardBody>
            </Card>

        </Box>
    );
}

export default function ChatHistory({ messages, loading, ref }: ChatHistoryProps) {

    return (
        <Box
            ref={ref}
            sx={{
                display: "flex",
                // flexGrow: 1,
                height: '85%',
                flexDirection: "column",
                overflowY: "auto",
                gap: 3,
                scrollBehavior: "smooth",
                p: { xs: 3, md: 4.5 },
            }}
        >
            {messages.length === 0 && (

                <h3 className="text-center">
                    Start a conversation by typing below. Press Enter to send, Shift+Enter for a new line.
                </h3>
            )}

            {messages.map((message, index) => (
                <ChatBubble key={index} messageType={message.type} message={message.text} />
            ))}

            {loading && (

                <ChatBubble messageType="ai">
                    <Box style={{
                        padding: 2,
                        animation: "pulse 1.5s infinite ease-in-out",
                    }}>
                        AI is thinking
                        <span className="animate-ping">.</span>
                        <span className="animate-ping delay-100">.</span>
                        <span className="animate-ping delay-200">.</span>
                    </Box>

                </ChatBubble>

            )}
        </Box>
    );
}
