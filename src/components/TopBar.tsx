import React from 'react';
import { Share2, Settings, BookOpen, BarChart2, Plus, PanelLeft, PanelLeftClose, PanelRight, PanelRightClose } from 'lucide-react';

interface TopBarProps {
    notebookName: string;
    onSettingsClick: () => void;
    onNewNotebook: () => void;
    onLogoClick: () => void;
    isLeftPanelVisible: boolean;
    onToggleLeftPanel: () => void;
    isRightPanelVisible: boolean;
    onToggleRightPanel: () => void;
    viewMode: string;
}

export const TopBar: React.FC<TopBarProps> = ({
    notebookName,
    onSettingsClick,
    onNewNotebook,
    onLogoClick,
    isLeftPanelVisible,
    onToggleLeftPanel,
    isRightPanelVisible,
    onToggleRightPanel,
    viewMode,
}) => {
    return (
        <header className="top-bar">
            <div className="top-bar-left">
                {viewMode === 'notebook' && (
                    <button
                        className="panel-toggle-btn"
                        onClick={onToggleLeftPanel}
                        title={isLeftPanelVisible ? "Collapse sources" : "Expand sources"}
                        style={{ marginRight: '12px' }}
                    >
                        {isLeftPanelVisible ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
                    </button>
                )}
                <div onClick={onLogoClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="logo-icon" style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '4px' }}>
                        <BookOpen size={20} color="#131314" />
                    </div>
                    <div className="notebook-title-edit">
                        <span>{notebookName}</span>
                    </div>
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

                {viewMode === 'notebook' && (
                    <button
                        className="panel-toggle-btn"
                        onClick={onToggleRightPanel}
                        title={isRightPanelVisible ? "Collapse studio" : "Expand studio"}
                        style={{ marginLeft: '8px' }}
                    >
                        {isRightPanelVisible ? <PanelRightClose size={20} /> : <PanelRight size={20} />}
                    </button>
                )}

                <div className="user-profile" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#5f6368', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#fff', marginLeft: '8px' }}>H</div>
            </div>
        </header>
    );
};
