import React from 'react';
import { BookOpen, Search } from 'lucide-react';

interface NotebookHeaderProps {
    title: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const NotebookHeader: React.FC<NotebookHeaderProps> = ({
    title,
    searchTerm,
    onSearchChange
}) => {
    return (
        <header className="main-header">
            <div className="notebook-title">
                <BookOpen size={20} />
                <span>{title}</span>
            </div>
            <div className="header-actions">
                <div className="search-bar">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search in notebook..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </header>
    );
};
