type ChatMessage = {
    type: 'user' | 'ai' | 'error';
    text: string;
};

export default ChatMessage;