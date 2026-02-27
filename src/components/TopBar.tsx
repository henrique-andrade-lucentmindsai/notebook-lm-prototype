import React from 'react';
import { Share2, Settings, MessageSquare, BookOpen, BarChart2, User, Plus } from 'lucide-react';

interface TopBarProps {
    notebookName: string;
    onSettingsClick: () => void;
    onNewNotebook: () => void;
    onLogoClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
    notebookName,
    onSettingsClick,
    onNewNotebook,
    onLogoClick,
}) => {
    return (
        <header className="top-bar">
            <div className="top-bar-left" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
                <div className="logo-icon" style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '4px' }}>
                    <BookOpen size={20} color="#131314" />
                </div>
                <div className="notebook-title-edit">
                    <span>{notebookName}</span>
                </div>
            </div>

            <div className="top-bar-right">
                <button className="btn-pill" onClick={onNewNotebook}>
                    <Plus size={18} />
                    <span>Create notebook</span>
                </button>
                <button className="btn-pill">
                    <BarChart2 size={18} />
                    <span>Analytics</span>
                </button>
                <button className="btn-pill">
                    <Share2 size={18} />
                    <span>Share</span>
                </button>
                <button className="btn-pill" onClick={onSettingsClick}>
                    <Settings size={18} />
                    <span>Settings</span>
                </button>
                <div className="pro-badge" style={{ backgroundColor: '#444746', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>PRO</div>
                <div className="user-profile" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#5f6368', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1rem', color: '#fff' }}>H</div>
            </div>
        </header>
    );
};
