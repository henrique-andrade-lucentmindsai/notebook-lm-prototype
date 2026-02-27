import React from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';

interface AddSourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSource: () => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
    isOpen,
    onClose,
    onAddSource,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Add sources</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="source-options">
                        <div className="option-card" onClick={onAddSource}>
                            <Upload size={32} />
                            <span>Upload PDF or Text</span>
                        </div>
                        <div className="option-card">
                            <LinkIcon size={32} />
                            <span>Website Link</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
