import React, { useState } from 'react';
import { X, Save, Key } from 'lucide-react';

export type LLMProvider = 'gemini' | 'openai' | 'claude';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKeys: Record<LLMProvider, string>;
    models: Record<LLMProvider, string>;
    selectedProvider: LLMProvider;
    onSave: (keys: Record<LLMProvider, string>, models: Record<LLMProvider, string>, provider: LLMProvider) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    apiKeys,
    models,
    selectedProvider,
    onSave,
}) => {
    const [tempKeys, setTempKeys] = useState(apiKeys);
    const [tempModels, setTempModels] = useState(models);
    const [tempProvider, setTempProvider] = useState(selectedProvider);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(tempKeys, tempModels, tempProvider);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content settings-modal">
                <div className="modal-header">
                    <h3>Settings</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <section className="settings-section">
                        <h4>LLM Provider</h4>
                        <div className="provider-selector" style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <label className={`provider-option ${tempProvider === 'gemini' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="provider"
                                    value="gemini"
                                    checked={tempProvider === 'gemini'}
                                    onChange={() => setTempProvider('gemini')}
                                />
                                Google Gemini
                            </label>
                            <label className={`provider-option ${tempProvider === 'openai' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="provider"
                                    value="openai"
                                    checked={tempProvider === 'openai'}
                                    onChange={() => setTempProvider('openai')}
                                />
                                OpenAI
                            </label>
                            <label className={`provider-option ${tempProvider === 'claude' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="provider"
                                    value="claude"
                                    checked={tempProvider === 'claude'}
                                    onChange={() => setTempProvider('claude')}
                                />
                                Anthropic Claude
                            </label>
                        </div>
                    </section>

                    <section className="settings-section" style={{ marginTop: '24px' }}>
                        <h4>API Keys</h4>
                        <div className="api-key-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                            <div className="input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <Key size={14} /> Gemini API Key
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter Gemini API Key"
                                    value={tempKeys.gemini}
                                    onChange={(e) => setTempKeys({ ...tempKeys, gemini: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Model (e.g. gemini-1.5-flash-latest)"
                                    value={tempModels.gemini}
                                    onChange={(e) => setTempModels({ ...tempModels, gemini: e.target.value })}
                                    style={{ marginTop: '8px' }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <Key size={14} /> OpenAI API Key
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter OpenAI API Key"
                                    value={tempKeys.openai}
                                    onChange={(e) => setTempKeys({ ...tempKeys, openai: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Model (e.g. gpt-4o)"
                                    value={tempModels.openai}
                                    onChange={(e) => setTempModels({ ...tempModels, openai: e.target.value })}
                                    style={{ marginTop: '8px' }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <Key size={14} /> Claude API Key
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter Claude API Key"
                                    value={tempKeys.claude}
                                    onChange={(e) => setTempKeys({ ...tempKeys, claude: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Model (e.g. claude-3-5-sonnet-latest)"
                                    value={tempModels.claude}
                                    onChange={(e) => setTempModels({ ...tempModels, claude: e.target.value })}
                                    style={{ marginTop: '8px' }}
                                />
                            </div>
                        </div>
                    </section>
                </div>
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="save-btn" onClick={handleSave}>
                        <Save size={18} />
                        <span>Save Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
