import React, { useState } from 'react';
import { Plus, FileText, Settings, ArrowLeft, Save, StickyNote } from 'lucide-react';
import type { Source } from '../types';

interface SidebarProps {
    sources: Source[];
    selectedSourceId?: string;
    onSelectSource: (source: Source | null) => void;
    onAddSourceClick: () => void;
    onAddNoteClick: () => void;
    onUpdateSource: (id: string, content: string) => void;
    onSettingsClick: () => void;
    notebooks: { id: string, name: string }[];
    currentNotebookId: string;
    onSelectNotebook: (id: string) => void;
    onNewNotebook: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    sources,
    selectedSourceId,
    onSelectSource,
    onAddSourceClick,
    onAddNoteClick,
    onUpdateSource,
    onSettingsClick,
    notebooks,
    currentNotebookId,
    onSelectNotebook,
    onNewNotebook,
}) => {
    const selectedSource = sources.find(s => s.id === selectedSourceId);
    const [editingContent, setEditingContent] = useState<string>('');

    React.useEffect(() => {
        if (selectedSource) {
            setEditingContent(selectedSource.content);
        }
    }, [selectedSourceId, selectedSource]);

    const handleBack = () => {
        onSelectSource(null);
    };

    const handleSave = () => {
        if (selectedSource) {
            onUpdateSource(selectedSource.id, editingContent);
        }
    };

    if (selectedSource) {
        return (
            <aside className="sidebar detail-view">
                <div className="sidebar-header">
                    <button className="back-btn" onClick={handleBack}>
                        <ArrowLeft size={18} />
                        <span>Sources</span>
                    </button>
                    {selectedSource.type === 'note' && (
                        <button className="save-note-btn" onClick={handleSave}>
                            <Save size={18} />
                        </button>
                    )}
                </div>

                <div className="source-detail">
                    <div className="source-detail-header">
                        {selectedSource.type === 'note' ? <StickyNote size={18} /> : <FileText size={18} />}
                        <h3>{selectedSource.name}</h3>
                    </div>

                    <div className="source-detail-content">
                        {selectedSource.type === 'note' ? (
                            <textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                placeholder="Write your note here..."
                            />
                        ) : (
                            <div className="read-only-content">{selectedSource.content}</div>
                        )}
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2 className="logo">NotebookLM</h2>
                <div className="notebook-selector">
                    <select
                        value={currentNotebookId}
                        onChange={(e) => onSelectNotebook(e.target.value)}
                    >
                        {notebooks.map(nb => (
                            <option key={nb.id} value={nb.id}>{nb.name}</option>
                        ))}
                    </select>
                    <button className="new-notebook-btn" onClick={onNewNotebook} title="New Notebook">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="sidebar-actions">
                    <button className="add-source-btn" onClick={onAddSourceClick}>
                        <Plus size={18} />
                        <span>Source</span>
                    </button>
                    <button className="add-note-btn" onClick={onAddNoteClick} title="Add Note">
                        <StickyNote size={18} />
                        <span>Note</span>
                    </button>
                </div>
            </div>

            <div className="sources-list">
                <div className="section-title">SOURCES ({sources.length})</div>
                {sources.map(source => (
                    <div
                        key={source.id}
                        className={`source-item ${selectedSourceId === source.id ? 'active' : ''}`}
                        onClick={() => onSelectSource(source)}
                    >
                        {source.type === 'note' ? <StickyNote size={16} /> : <FileText size={16} />}
                        <span className="source-name">{source.name}</span>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="footer-item" onClick={onSettingsClick}>
                    <Settings size={18} />
                    <span>Settings</span>
                </div>
            </div>
        </aside>
    );
};
