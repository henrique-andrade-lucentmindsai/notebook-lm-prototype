import React from 'react';
import { FileText, X } from 'lucide-react';
import type { Source } from '../types';

interface SourcePreviewProps {
    selectedSource: Source | null;
    onClose: () => void;
}

export const SourcePreview: React.FC<SourcePreviewProps> = ({
    selectedSource,
    onClose,
}) => {
    return (
        <div className={`preview-panel ${selectedSource ? 'open' : ''}`}>
            {selectedSource ? (
                <div className="source-viewer">
                    <div className="viewer-header">
                        <div className="source-title">
                            <FileText size={18} />
                            <span>{selectedSource.name}</span>
                        </div>
                        <button onClick={onClose}><X size={18} /></button>
                    </div>
                    <div className="viewer-content">
                        <p>{selectedSource.content}</p>
                    </div>
                </div>
            ) : (
                <div className="notes-view">
                    <div className="item-header">
                        <h3>Saved Notes</h3>
                    </div>
                    <div className="notes-placeholder">
                        <p>Select a source to view its content or ask questions to generate notes.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
