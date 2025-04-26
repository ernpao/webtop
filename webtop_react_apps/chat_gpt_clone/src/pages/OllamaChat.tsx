import React, { useState, useEffect, useRef } from 'react';
import { Box, Card } from '@mui/material';
import ChatMessage from '../types/ChatMessage';
import ChatHistory from '../components/chat/ChatHistory';
import ChatInputArea from '../components/chat/ChatInputArea';
import ModelSelector from '../components/chat/ModelSelector';

// const API_ENDPOINT = "//192.168.50.10:6767/ollama/generateRemote"
const API_ENDPOINT = "//192.168.50.10:10239/ollama-generate"


type ApiResponse = {
  response: string;
  context?: any;
};


export default function OllamaChat() {

  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any | null>(null);
  const [modelName, setModelName] = useState<any | null>(null);

  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const container = chatHistoryRef.current;
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
    if (!loading) chatInputRef.current?.focus();
  }, [loading]);

  const sendPrompt = async () => {
    const currentPrompt = prompt.trim();
    if (!currentPrompt || loading) return;

    setChatHistory(prev => [...prev, { type: 'user', text: currentPrompt }]);
    setPrompt('');
    setLoading(true);

    const requestBody = { model: modelName, prompt: currentPrompt, ...(context && { context }) };

    try {
      const res = await fetch(API_ENDPOINT, {
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
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>

      <ModelSelector onModelChanged={onModelChanged} />

      <ChatHistory messages={chatHistory} loading={loading} ref={chatHistoryRef} />

      <ChatInputArea ref={chatInputRef} value={prompt} disabled={loading} onSend={sendPrompt} onChange={(value) => setPrompt(value)} />

    </Box>

  );
}
