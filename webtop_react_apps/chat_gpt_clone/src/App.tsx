import React, { useState, useEffect, useRef } from 'react';
import { Box, Card } from '@mui/material';
import ChatMessage from './types/ChatMessage';
import ChatHistory from './components/ChatHistory';
import ChatInputArea from './components/ChatInputArea';
import ModelSelector from './components/ModelSelector';


type ApiResponse = {
  response: string;
  context?: any;
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any | null>(null);
  const [modelName, setModelName] = useState<any | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!loading) textareaRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [prompt]);

  const sendPrompt = async () => {
    const currentPrompt = prompt.trim();
    if (!currentPrompt || loading) return;

    setChatHistory(prev => [...prev, { type: 'user', text: currentPrompt }]);
    setPrompt('');
    setLoading(true);

    const requestBody = { model: modelName, prompt: currentPrompt, ...(context && { context }) };

    try {
      // const res = await fetch('//192.168.50.10:6767/ollama/generateRemote', {
      const res = await fetch('//192.168.50.10:10239/ollama-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error (${res.status}): ${errorText || 'Failed to fetch response'}`);
      }

      const data: ApiResponse = await res.json();
      setChatHistory(prev => [...prev, { type: 'ai', text: data.response || 'AI returned an empty response.' }]);
      setContext(data.context || null);
    } catch (error) {
      setChatHistory(prev => [
        ...prev,
        { type: 'error', text: 'Error: ' + (error instanceof Error ? error.message : String(error)) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onModelChanged = (m: string) => {
    setContext(null)
    setModelName(m)
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        p: 4,
      }}>
      <Card
        elevation={1}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden',
          width: '100%',
          borderRadius: 2, // rounded-lg ≈ theme.spacing(2)
          mx: 'auto', // optional: center horizontally if needed
        }}>

        <ModelSelector onModelChanged={onModelChanged} />

        <ChatHistory messages={chatHistory} loading={loading} ref={chatContainerRef} />

        <ChatInputArea ref={textareaRef} value={prompt} disabled={loading} onSend={sendPrompt} onChange={(value) => setPrompt(value)} />

      </Card>
    </Box>

  );
}
