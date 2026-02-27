import React, { useRef, useEffect } from 'react';
import { Send, Upload, Plus } from 'lucide-react';
import type { Message, Source } from '../types';

interface ChatContainerProps {
    messages: Message[];
    sources: Source[];
    chatInput: string;
    isProcessing?: boolean;
    onChatInputChange: (value: string) => void;
    onSendMessage: () => void;
    onSaveAsNote: (content: string) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
    messages,
    sources,
    chatInput,
    isProcessing = false,
    onChatInputChange,
    onSendMessage,
    onSaveAsNote,
}) => {
    const [showMentions, setShowMentions] = React.useState(false);
    const [mentionFilter, setMentionFilter] = React.useState('');
    const [savedStates, setSavedStates] = React.useState<Record<number, boolean>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isProcessing]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showMentions && (e.key === 'Escape' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            // Future navigation logic
            if (e.key === 'Escape') setShowMentions(false);
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (showMentions) {
                // Future selection logic on Enter
                return;
            }
            onSendMessage();
        }
    };

    const handleInputChange = (val: string) => {
        onChatInputChange(val);

        const lastWord = val.split(/\s/).pop() || '';

        if (lastWord.startsWith('@')) {
            setShowMentions(true);
            setMentionFilter(lastWord.slice(1).toLowerCase());
        } else {
            setShowMentions(false);
        }
    };

    const insertMention = (sourceName: string) => {
        const words = chatInput.split(/\s/);
        words.pop(); // Remove the partial mention
        const newVal = [...words, `@${sourceName} `].join(' ');
        onChatInputChange(newVal);
        setShowMentions(false);
    };

    const filteredSources = sources.filter(s =>
        s.name.toLowerCase().includes(mentionFilter)
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div className="chat-content scroll-hide">
                {messages.length === 0 ? (
                    <div className="chat-empty-state">
                        <div style={{ background: 'rgba(168, 199, 250, 0.1)', padding: '24px', borderRadius: '50%', marginBottom: '12px' }}>
                            <Upload size={48} color="var(--accent-color)" strokeWidth={1} />
                        </div>
                        <h2>Add a source to get started</h2>
                        <button className="btn-pill" style={{ marginTop: '12px' }}>Upload a source</button>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const showDate = index === 0 || (
                            message.timestamp && messages[index - 1].timestamp &&
                            new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp!).toDateString()
                        );

                        const dateShort = message.timestamp ? new Date(message.timestamp).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        }) : '';

                        const timeStr = message.timestamp ? new Date(message.timestamp).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : '';

                        return (
                            <React.Fragment key={index}>
                                {showDate && dateShort && (
                                    <div style={{
                                        textAlign: 'center',
                                        margin: '24px 0 16px',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)', opacity: 0.5 }} />
                                        {dateShort}
                                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)', opacity: 0.5 }} />
                                    </div>
                                )}
                                <div
                                    className={`message-bubble ${message.role}`}
                                    style={{
                                        alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%',
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        backgroundColor: message.role === 'user' ? 'var(--bg-hover)' : 'transparent',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-wrap',
                                        border: message.role === 'ai' ? 'none' : '1px solid var(--border-color)',
                                        position: 'relative',
                                        marginBottom: '8px'
                                    }}
                                >
                                    {message.content}
                                    <div style={{
                                        fontSize: '0.65rem',
                                        color: 'var(--text-secondary)',
                                        marginTop: '6px',
                                        textAlign: message.role === 'user' ? 'right' : 'left',
                                        opacity: 0.6
                                    }}>
                                        {dateShort && `${dateShort}, `}{timeStr}
                                    </div>
                                    {message.role === 'ai' && (
                                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => {
                                                    onSaveAsNote(message.content);
                                                    setSavedStates(prev => ({ ...prev, [index]: true }));
                                                    setTimeout(() => {
                                                        setSavedStates(prev => ({ ...prev, [index]: false }));
                                                    }, 3000);
                                                }}
                                                style={{
                                                    background: savedStates[index] ? 'rgba(129, 201, 149, 0.2)' : 'var(--bg-secondary)',
                                                    border: savedStates[index] ? '1px solid #81c995' : '1px solid var(--border-color)',
                                                    color: savedStates[index] ? '#81c995' : 'var(--text-secondary)',
                                                    fontSize: '0.7rem',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                {savedStates[index] ? (
                                                    <>
                                                        <Plus size={12} style={{ transform: 'rotate(45deg)' }} />
                                                        Saved ✓
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={12} />
                                                        Save as note
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                {isProcessing && (
                    <div className="message-bubble ai" style={{
                        alignSelf: 'flex-start',
                        padding: '12px 16px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                        Processing...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                {showMentions && filteredSources.length > 0 && (
                    <div className="mentions-list" style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '20px',
                        backgroundColor: 'var(--bg-panel)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
                        zIndex: 100,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        width: '280px',
                        padding: '8px 0'
                    }}>
                        {filteredSources.map(s => (
                            <div
                                key={s.id}
                                className="mention-item"
                                onClick={() => insertMention(s.name)}
                                style={{
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <span style={{ color: 'var(--accent-color)' }}>@</span>
                                <span style={{ fontSize: '0.9rem' }}>{s.name}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div className="chat-input-container">
                    <textarea
                        placeholder={messages.length === 0 ? "Upload a source to get started" : "Ask about your notebook..."}
                        rows={1}
                        value={chatInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isProcessing}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {sources.length} source{sources.length !== 1 ? 's' : ''}
                        </span>
                        <button
                            className="send-btn"
                            onClick={onSendMessage}
                            disabled={!chatInput.trim() || isProcessing}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                    NotebookLM can be inaccurate; please check its response.
                </p>
            </div>
        </div>
    );
};
