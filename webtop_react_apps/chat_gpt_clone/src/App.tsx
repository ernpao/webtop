import React, { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from './components/MarkdownRenderer';

type ChatMessage = {
  type: 'user' | 'ai' | 'error';
  text: string;
};

type ApiResponse = {
  response: string;
  context?: any;
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any | null>(null);

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

  const sendPrompt = async () => {
    const currentPrompt = prompt.trim();
    if (!currentPrompt || loading) return;

    setChatHistory(prev => [...prev, { type: 'user', text: currentPrompt }]);
    setPrompt('');
    setLoading(true);

    const requestBody = { prompt: currentPrompt, ...(context && { context }) };

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      sendPrompt();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [prompt]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 font-sans">
      <div className="flex flex-col w-full max-w-4xl h-[calc(100vh-2rem)] max-h-[900px] bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth text-gray-900 dark:text-gray-100"
        >
          {chatHistory.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center mt-8 text-sm">
              Start a conversation by typing below. Press Enter to send, Shift+Enter for a new line.
            </p>
          )}

          {chatHistory.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-lg shadow-sm break-words text-sm md:text-base p-3 ${message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.type === 'ai'
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                  }`}
              >
                <MarkdownRenderer content={message.text} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg max-w-[85%] md:max-w-[75%] bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm animate-pulse">
                <p className="text-sm md:text-base">
                  AI is thinking<span className="animate-ping">.</span>
                  <span className="animate-ping delay-100">.</span>
                  <span className="animate-ping delay-200">.</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-end space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
            <textarea
              ref={textareaRef}
              className="flex-grow p-2 bg-transparent border-none focus:outline-none resize-none text-sm md:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Type your message... (Enter to send, Shift+Enter for newline)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
              style={{ maxHeight: '150px', overflowY: 'auto' }}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors self-end"
              onClick={sendPrompt}
              disabled={loading || !prompt.trim()}
              title="Send message (Enter)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M3.105 3.105a.75.75 0 01.814-.138l13.25 7.5a.75.75 0 010 1.266l-13.25 7.5a.75.75 0 01-.952-.706v-13a.75.75 0 01.138-.558z" />
                <path d="M4.159 4.159L16.84 10l-12.68 5.841V4.159z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
