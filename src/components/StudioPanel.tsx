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
    StickyNote,
    ChevronRight,
    Undo2,
    Redo2,
    Bold as BoldIcon,
    Italic as ItalicIcon,
    Link2,
    List,
    ListOrdered,
    Eraser,
    Trash2
} from 'lucide-react';
import type { Source } from '../types';

interface StudioPanelProps {
    notes: Source[];
    selectedNoteId?: string;
    onSelectNote: (note: Source | null) => void;
    onAddNoteClick: () => void;
    onUpdateNoteContent: (id: string, content: string) => void;
    onUpdateNoteTitle: (id: string, name: string) => void;
    onDeleteNote: (id: string) => void;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({
    notes,
    selectedNoteId,
    onSelectNote,
    onAddNoteClick,
    onUpdateNoteContent,
    onUpdateNoteTitle,
    onDeleteNote
}) => {
    const selectedNote = notes.find(n => n.id === selectedNoteId);

    // Local state for smooth editing
    const [localTitle, setLocalTitle] = React.useState('');
    const [localContent, setLocalContent] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);

    // Sync local state when selected note changes
    React.useEffect(() => {
        if (selectedNote) {
            setLocalTitle(selectedNote.name);
            setLocalContent(selectedNote.content);
            setIsSaving(false);
        } else {
            setLocalTitle('');
            setLocalContent('');
            setIsSaving(false);
        }
    }, [selectedNoteId, selectedNote]);

    // Debounced sync to parent
    React.useEffect(() => {
        if (!selectedNote || localTitle === selectedNote.name) return;

        setIsSaving(true);
        const timeout = setTimeout(async () => {
            await onUpdateNoteTitle(selectedNote.id, localTitle);
            setIsSaving(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [localTitle]);

    React.useEffect(() => {
        if (!selectedNote || localContent === selectedNote.content) return;

        setIsSaving(true);
        const timeout = setTimeout(async () => {
            await onUpdateNoteContent(selectedNote.id, localContent);
            setIsSaving(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [localContent]);


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
            <div className="studio-panel-header" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {!selectedNote ? (
                    <h2 style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Studio</h2>
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <span onClick={() => onSelectNote(null)} style={{ cursor: 'pointer' }}>Studio</span>
                            <ChevronRight size={14} />
                            <span style={{ color: 'var(--text-primary)' }}>Note</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span>{isSaving ? 'Saving...' : 'Saved'}</span>
                            <Trash2
                                size={14}
                                cursor="pointer"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this note?')) {
                                        onDeleteNote(selectedNote.id);
                                    }
                                }}
                                style={{ transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#ff4444'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                            />
                        </div>
                    </>
                )}
            </div>

            {selectedNote ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div className="note-toolbar" style={{
                        padding: '8px 20px',
                        display: 'flex',
                        gap: '12px',
                        borderBottom: '1px solid var(--border-color)',
                        alignItems: 'center',
                        color: 'var(--text-secondary)'
                    }}>
                        <Undo2 size={16} cursor="pointer" />
                        <Redo2 size={16} cursor="pointer" />
                        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-color)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
                            <span>Normal</span>
                            <ChevronRight size={12} transform="rotate(90)" />
                        </div>
                        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-color)' }} />
                        <BoldIcon size={16} cursor="pointer" />
                        <ItalicIcon size={16} cursor="pointer" />
                        <Link2 size={16} cursor="pointer" />
                        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-color)' }} />
                        <List size={16} cursor="pointer" />
                        <ListOrdered size={16} cursor="pointer" />
                        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-color)' }} />
                        <Eraser size={16} cursor="pointer" />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px', overflowY: 'auto' }} className="scroll-hide">
                        <input
                            type="text"
                            style={{
                                fontSize: '1.4rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)',
                                marginBottom: '20px',
                                background: 'none',
                                border: 'none',
                                width: '100%',
                                outline: 'none',
                                padding: 0
                            }}
                            value={localTitle}
                            onChange={(e) => setLocalTitle(e.target.value)}
                            placeholder="New Note"
                        />
                        <textarea
                            style={{
                                flex: 1,
                                width: '100%',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                resize: 'none',
                                fontFamily: 'inherit',
                                outline: 'none',
                                padding: 0,
                                minHeight: '300px'
                            }}
                            placeholder="Start writing..."
                            value={localContent}
                            onChange={(e) => setLocalContent(e.target.value)}
                        />
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
                        <button className="btn-pill" style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={14} />
                            Convert to source
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="studio-grid scroll-hide">
                        {tools.map((tool, idx) => (
                            <div key={idx} className="studio-card">
                                {tool.icon}
                                <span>{tool.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="studio-notes-list scroll-hide" style={{ flex: 1, overflowY: 'auto' }}>
                        {notes.length > 0 && (
                            <div style={{ padding: '0 20px 10px 20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                                <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Your Notes</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {notes.map(note => (
                                        <div
                                            key={note.id}
                                            className={`studio-note-item ${selectedNoteId === note.id ? 'active' : ''}`}
                                            onClick={() => onSelectNote(note)}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '8px',
                                                background: 'var(--bg-secondary)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '12px',
                                                border: selectedNoteId === note.id ? '1px solid var(--accent-color)' : '1px solid transparent'
                                            }}
                                        >
                                            <StickyNote size={18} color="#f28b82" style={{ marginTop: '2px' }} />
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {note.name || 'Untitled Note'}
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    {note.content ? note.content.substring(0, 40) + (note.content.length > 40 ? '...' : '') : 'No content'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '20px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {notes.length === 0 && (
                            <div style={{ textAlign: 'center' }}>
                                <MapIcon size={48} color="var(--border-color)" strokeWidth={1} style={{ marginBottom: '12px' }} />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    Studio output will be saved here. After adding sources, click to generate content.
                                </p>
                            </div>
                        )}
                        <button className="add-note-btn-floating" onClick={onAddNoteClick}>
                            <Plus size={20} />
                            <span>Add note</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
