import React from "react";
import type { Message } from '@prisma/client'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageBubble = ({ message }: { message: Message }) => {
    return (
        <div className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 overflow-x-auto rounded-lg max-w-[80%] md:max-w-[70%] lg:max-w-[60%] ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <p className="font-bold">{message.role === 'user' ? 'You' : 'Assistant'}</p>
                <ReactMarkdown
                    className={`${message.isFailed ? "text-red-600" : ""} break-words`}
                    components={{
                        code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                                <SyntaxHighlighter
                                    style={dracula}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                >
                    {message.content}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default MessageBubble;