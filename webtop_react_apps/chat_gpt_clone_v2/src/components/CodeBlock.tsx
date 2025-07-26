import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
    language?: string;
    value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const effectiveLanguage = language?.trim().toLowerCase() || 'text';

    return (
        <div className="code-block relative group my-2 bg-[#2d2d2d] rounded-md overflow-hidden">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-label={isCopied ? 'Copied!' : 'Copy code'}
                title={isCopied ? 'Copied!' : 'Copy code'}
            >
                {isCopied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )}
            </button>

            <SyntaxHighlighter
                language={effectiveLanguage}
                style={atomDark}
                customStyle={{ margin: 0, padding: '1rem', fontSize: '0.875rem' }}
                wrapLongLines
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
