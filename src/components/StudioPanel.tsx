import React from 'react';
import {
    Plus,
    Mic2,
    Video,
    Map as MapIcon,
    FileText,
    HelpCircle,
    Layout,
    Database,
    StickyNote
} from 'lucide-react';

interface StudioPanelProps {
    onAddNoteClick: () => void;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({ onAddNoteClick }) => {
    const tools = [
        { icon: <Mic2 size={20} />, label: "Audio Overview" },
        { icon: <Video size={20} />, label: "Video Overview" },
        { icon: <MapIcon size={20} />, label: "Mind Map" },
        { icon: <FileText size={20} />, label: "Reports" },
        { icon: <Layout size={20} />, label: "Flashcards" },
        { icon: <HelpCircle size={20} />, label: "Quiz" },
        { icon: <Layout size={20} />, label: "Infographic" },
        { icon: <Database size={20} />, label: "Slide Deck" },
        { icon: <Layout size={20} />, label: "Data Table" },
    ];

    return (
        <div className="panel studio-panel">
            <div className="studio-panel-header">
                <h2 style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Studio</h2>
            </div>

            <div className="studio-grid scroll-hide">
                {tools.map((tool, idx) => (
                    <div key={idx} className="studio-card">
                        {tool.icon}
                        <span>{tool.label}</span>
                    </div>
                ))}
            </div>

            <div style={{ padding: '20px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                    <MapIcon size={48} color="var(--border-color)" strokeWidth={1} style={{ marginBottom: '12px' }} />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Studio output will be saved here. After adding sources, click to generate content.
                    </p>
                </div>
                <button className="add-note-btn-floating" onClick={onAddNoteClick}>
                    <Plus size={20} />
                    <span>Add note</span>
                </button>
            </div>
        </div>
    );
};
