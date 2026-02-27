import React from 'react';
import { X, FileText, StickyNote, Globe, File, Sparkles, ChevronDown, Trash2 } from 'lucide-react';
import type { Source } from '../types';

interface SourceDetailViewProps {
    source: Source;
    onClose: () => void;
    onUpdateContent: (id: string, content: string) => void;
    onUpdateTitle: (id: string, name: string) => void;
    onDelete?: () => void;
}

export const SourceDetailView: React.FC<SourceDetailViewProps> = ({
    source,
    onClose,
    onUpdateContent,
    onUpdateTitle,
    onDelete
}) => {
    const getSourceIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <File size={24} color="#a8c7fa" />;
            case 'text': return <FileText size={24} color="#c4c7c5" />;
            case 'note': return <StickyNote size={24} color="#f28b82" />;
            case 'link': return <Globe size={24} color="#81c995" />;
            default: return <File size={24} />;
        }
    };

    // Mock summary for the Source Guide based on the name
    const getSummary = () => {
        return (
            <p className="source-guide-summary" style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                This document examined how <b>{source.name}</b> and related components transform static information into
                active research material. To overcome fragmentation, it establishes a <b>standardized content structure</b>
                that allows AI applications to discover and execute deep analysis through a universal interface.
            </p>
        );
    };

    return (
        <div className="source-detail-view" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#131314' }}>
            <div className="chat-panel-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getSourceIcon(source.type)}
                    <h2 style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-secondary)' }}>{source.type === 'note' ? 'Note' : 'Sources'}</h2>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {onDelete && (
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this source?')) {
                                    onDelete();
                                }
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                            title="Delete"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="source-content-area scroll-hide" style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
                {source.type === 'note' ? (
                    <input
                        type="text"
                        className="source-content-title"
                        style={{
                            fontSize: '1.8rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '24px',
                            background: 'none',
                            border: 'none',
                            width: '100%',
                            outline: 'none',
                            padding: 0
                        }}
                        value={source.name}
                        onChange={(e) => onUpdateTitle(source.id, e.target.value)}
                        placeholder="Note title"
                    />
                ) : (
                    <h1 className="source-content-title" style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '24px' }}>{source.name}</h1>
                )}

                {source.type !== 'note' && (
                    <div className="source-guide-box" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '16px', marginBottom: '32px' }}>
                        <div className="source-guide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div className="source-guide-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                                <Sparkles size={18} fill="currentColor" />
                                <span>Source guide</span>
                            </div>
                            <ChevronDown size={20} color="var(--text-secondary)" />
                        </div>
                        {getSummary()}
                    </div>
                )}

                {source.type === 'note' ? (
                    <textarea
                        style={{
                            width: '100%',
                            minHeight: '400px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            resize: 'none',
                            fontFamily: 'inherit',
                            outline: 'none',
                            padding: 0
                        }}
                        placeholder="Type your notes here..."
                        value={source.content}
                        onChange={(e) => onUpdateContent(source.id, e.target.value)}
                    />
                ) : (
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        {source.content || "No content available."}
                    </div>
                )}
            </div>
        </div>
    );
};
