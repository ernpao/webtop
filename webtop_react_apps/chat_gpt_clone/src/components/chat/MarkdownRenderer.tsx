import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const components: Components = {
        code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ?
                (<CodeBlock
                    language={match?.[1]}
                    value={String(children).replace(/\n$/, '')}
                />)
                :
                (<code {...props} className={className}>
                    {children}
                </code>)
        },
        // ol({ node, className, children, ...props }) {
        //     return <Ol>{children}</Ol>
        // }
    };

    return (
        <div className="markdown">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
