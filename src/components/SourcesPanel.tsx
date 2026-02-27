import React from 'react';
import { Plus, Search, FileText, StickyNote, Globe, File } from 'lucide-react';
import type { Source } from '../types';

interface SourcesPanelProps {
    sources: Source[];
    selectedSourceId?: string;
    onSelectSource: (source: Source | null) => void;
    onAddSourceClick: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({
    sources,
    selectedSourceId,
    onSelectSource,
    onAddSourceClick,
    searchTerm,
    onSearchChange,
}) => {
    const filteredSources = sources.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSourceIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <File size={20} color="#a8c7fa" />;
            case 'text': return <FileText size={20} color="#c4c7c5" />;
            case 'note': return <StickyNote size={20} color="#f28b82" />;
            case 'link': return <Globe size={20} color="#81c995" />;
            default: return <File size={20} />;
        }
    };

    return (
        <div className="panel sources-panel">
            <div className="sources-panel-header">
                <h2>Sources</h2>
                <button className="add-sources-big-btn" onClick={onAddSourceClick}>
                    <Plus size={20} />
                    <span>Add sources</span>
                </button>
                <div className="search-input-box">
                    <Search size={18} color="#c4c7c5" />
                    <input
                        type="text"
                        placeholder="Search in sources..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="sources-list scroll-hide">
                {filteredSources.length === 0 ? (
                    <div className="chat-empty-state" style={{ padding: '20px' }}>
                        <File size={48} strokeWidth={1} />
                        <p style={{ fontSize: '0.8rem' }}>No sources found</p>
                    </div>
                ) : (
                    filteredSources.map(source => (
                        <div
                            key={source.id}
                            className={`source-card ${selectedSourceId === source.id ? 'active' : ''}`}
                            onClick={() => onSelectSource(source)}
                        >
                            {getSourceIcon(source.type)}
                            <span>{source.name}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
