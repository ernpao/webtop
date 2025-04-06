import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const components: Components = {
        code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return (
                <CodeBlock
                    language={match?.[1]}
                    value={String(children).replace(/\n$/, '')}
                />
            );
        },
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={components}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
