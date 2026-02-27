import type { Notebook, Source, Message } from '../types';
import type { LLMProvider } from '../components/SettingsModal';

// @ts-ignore
const ipc = window.ipcRenderer;

export const dbService = {
    // Notebooks
    async getNotebooks(): Promise<Notebook[]> {
        const notebooks = await ipc.invoke('db:get-notebooks');
        // For each notebook, we need to fetch its sources and messages
        return Promise.all(notebooks.map(async (nb: any) => {
            const messages = await this.getMessages(nb.id);
            return {
                ...nb,
                sources: await this.getSources(nb.id),
                messages: messages.map((m: any) => ({
                    role: m.role,
                    content: m.content,
                    timestamp: m.created_at
                }))
            };
        }));
    },

    async createNotebook(id: string, name: string): Promise<void> {
        await ipc.invoke('db:create-notebook', id, name);
    },

    async updateNotebookName(id: string, name: string): Promise<void> {
        await ipc.invoke('db:update-notebook-name', id, name);
    },

    async deleteNotebook(id: string): Promise<void> {
        await ipc.invoke('db:delete-notebook', id);
    },

    // Sources
    async getSources(notebookId: string): Promise<Source[]> {
        return ipc.invoke('db:get-sources', notebookId);
    },

    async saveSource(source: Source, notebookId: string): Promise<void> {
        await ipc.invoke('db:save-source', source, notebookId);
    },

    async deleteSource(id: string): Promise<void> {
        await ipc.invoke('db:delete-source', id);
    },

    // Messages
    async getMessages(notebookId: string): Promise<Message[]> {
        return ipc.invoke('db:get-messages', notebookId);
    },

    async saveMessage(notebookId: string, role: string, content: string): Promise<void> {
        await ipc.invoke('db:save-message', notebookId, role, content);
    },

    async clearMessages(notebookId: string): Promise<void> {
        await ipc.invoke('db:clear-messages', notebookId);
    },

    // Settings
    async saveSettings(apiKeys: Record<LLMProvider, string>, models: Record<LLMProvider, string>, provider: LLMProvider): Promise<void> {
        await ipc.invoke('db:save-setting', 'apiKeys', JSON.stringify(apiKeys));
        await ipc.invoke('db:save-setting', 'selectedModels', JSON.stringify(models));
        await ipc.invoke('db:save-setting', 'selectedProvider', provider);
    },

    async getSettings(): Promise<{
        apiKeys: Record<LLMProvider, string>;
        models: Record<LLMProvider, string>;
        selectedProvider: LLMProvider;
    }> {
        const rawSettings = await ipc.invoke('db:get-settings');
        const settings: any = {};
        rawSettings.forEach((s: any) => {
            settings[s.key] = s.value;
        });

        return {
            apiKeys: settings.apiKeys ? JSON.parse(settings.apiKeys) : { gemini: '', openai: '', claude: '' },
            models: settings.selectedModels ? JSON.parse(settings.selectedModels) : { gemini: 'gemini-1.5-flash-latest', openai: 'gpt-4o', claude: 'claude-3-5-sonnet-latest' },
            selectedProvider: (settings.selectedProvider as LLMProvider) || 'gemini'
        };
    }
};
