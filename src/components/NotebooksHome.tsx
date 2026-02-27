import React from 'react';
import { Plus, BookOpen, Search, Clock, FileText } from 'lucide-react';
import type { Notebook } from '../types';

interface NotebooksHomeProps {
    notebooks: Notebook[];
    onSelectNotebook: (id: string) => void;
    onNewNotebook: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const NotebooksHome: React.FC<NotebooksHomeProps> = ({
    notebooks,
    onSelectNotebook,
    onNewNotebook,
    searchTerm,
    onSearchChange,
}) => {
    const filtered = notebooks.filter(nb =>
        nb.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="notebooks-home" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', height: '100%', overflowY: 'auto' }}>
            <div className="home-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '400' }}>My Notebooks</h1>
                <div className="search-input-box" style={{ width: '300px' }}>
                    <Search size={18} color="#c4c7c5" />
                    <input
                        type="text"
                        placeholder="Search notebooks..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="notebooks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                <div
                    className="notebook-card create-new"
                    onClick={onNewNotebook}
                    style={{
                        backgroundColor: 'var(--bg-panel)',
                        borderRadius: '24px',
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        cursor: 'pointer',
                        border: '1px dashed var(--border-color)',
                        minHeight: '200px'
                    }}
                >
                    <div style={{ backgroundColor: 'var(--bg-dark)', padding: '16px', borderRadius: '50%' }}>
                        <Plus size={32} color="var(--accent-color)" />
                    </div>
                    <span style={{ fontWeight: '500' }}>Create new</span>
                </div>

                {filtered.map(nb => (
                    <div
                        key={nb.id}
                        className="notebook-card"
                        onClick={() => onSelectNotebook(nb.id)}
                        style={{
                            backgroundColor: 'var(--bg-panel)',
                            borderRadius: '24px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            cursor: 'pointer',
                            border: '1px solid var(--border-color)',
                            transition: 'transform 0.2s, border-color 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <BookOpen size={24} color="var(--accent-color)" />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} />
                                <span>Just now</span>
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginTop: '12px', fontWeight: '500' }}>{nb.name}</h3>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            <FileText size={14} />
                            <span>{nb.sources.length} sources</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
