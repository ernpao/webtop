import { Box, Card, Typography, useTheme } from "@mui/material";
import ChatMessage from "../../types/ChatMessage";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatHistoryProps {
    messages: ChatMessage[];
    loading: boolean;
    ref: React.Ref<unknown>;
}

interface ChatBubbleProps {
    messageType: string;
    message: string;
    className?: string
}

function ChatBubble({ messageType, message, className }: ChatBubbleProps) {
    const theme = useTheme();
    // const userBubbleColor = theme.palette.primary.main
    const userBubbleColor = "#007AFF"

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: messageType === "user" ? "flex-end" : "flex-start",
            }}
        >
            <Card className={className}
                elevation={messageType === "ai" ? 3 : 3}
                sx={{
                    maxWidth: "85%",
                    px: 2,
                    py: 1,
                    backgroundColor:
                        messageType === "user"
                            ? userBubbleColor
                            : messageType === "ai"
                                ? ""
                                : theme.palette.error.main,
                    color:
                        messageType === "user"
                            ? theme.palette.getContrastText(userBubbleColor
                            )
                            : messageType === "ai"
                                ? theme.palette.text.primary
                                : theme.palette.getContrastText(theme.palette.error.main),
                }}
            >
                <MarkdownRenderer content={message} />
            </Card>

        </Box>
    );
}

export default function ChatHistory({ messages, loading, ref }: ChatHistoryProps) {
    const theme = useTheme();

    return (
        <Box
            ref={ref}
            sx={{
                display: "flex",
                flexGrow: 1,
                flexDirection: "column",
                overflowY: "auto",
                gap: 4,
                scrollBehavior: "smooth",
                p: { xs: 3, md: 4.5 },
            }}
        >
            {messages.length === 0 && (
                <Typography
                    variant="body2"
                    align="center"
                    sx={{
                        color: theme.palette.mode === "dark" ? "grey.400" : "grey.500",
                        // mt: 8,
                    }}
                >
                    Start a conversation by typing below. Press Enter to send, Shift+Enter for a new line.
                </Typography>
            )}

            {messages.map((message, index) => (
                <ChatBubble key={index} messageType={message.type} message={message.text} />
            ))}

            {loading && (
                // <ChatBubble messageType="thinking" message="AI is thinking..." />

                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Card
                        elevation={3}
                        sx={{
                            p: 2,
                            maxWidth: { xs: "85%", md: "75%" },
                            animation: "pulse 1.5s infinite ease-in-out",
                        }}
                    >
                        AI is thinking<span className="animate-ping">.</span>
                        <span className="animate-ping delay-100">.</span>
                        <span className="animate-ping delay-200">.</span>
                    </Card>
                </Box>

            )}
        </Box>
    );
}
