import { useState, useEffect } from 'react'
import './index.css'
import type { Source, Message, Notebook } from './types'
import { TopBar } from './components/TopBar'
import { SourcesPanel } from './components/SourcesPanel'
import { ChatContainer } from './components/ChatContainer'
import { StudioPanel } from './components/StudioPanel'
import { NotebooksHome } from './components/NotebooksHome'
import { SourceDetailView } from './components/SourceDetailView'
import { AddSourceModal } from './components/AddSourceModal'
import { SettingsModal } from './components/SettingsModal'
import { CreateNotebookModal } from './components/CreateNotebookModal'
import type { LLMProvider } from './components/SettingsModal'
import { generateAIResponse } from './services/llm'
import { dbService } from './services/db'
import { MoreVertical, Sparkles } from 'lucide-react'

const DEFAULT_NOTEBOOK: Notebook = {
  id: 'default',
  name: 'Untitled notebook',
  sources: [],
  messages: []
}

type ViewMode = 'home' | 'notebook';

function App() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([DEFAULT_NOTEBOOK])
  const [currentNotebookId, setCurrentNotebookId] = useState('default')
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [isLoading, setIsLoading] = useState(true)

  const currentNotebook = notebooks.find(n => n.id === currentNotebookId) || notebooks[0]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNewNotebookModalOpen, setIsNewNotebookModalOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notebookSearch, setNotebookSearch] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // LLM settings state
  const [apiKeys, setApiKeys] = useState<Record<LLMProvider, string>>({ gemini: '', openai: '', claude: '' })
  const [selectedModels, setSelectedModels] = useState<Record<LLMProvider, string>>({ gemini: 'gemini-1.5-flash-latest', openai: 'gpt-4o', claude: 'claude-3-5-sonnet-latest' })
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider>('gemini')

  // Initial Load and Migration
  useEffect(() => {
    const initData = async () => {
      try {
        const hasMigrated = localStorage.getItem('sqlite_migrated')
        if (!hasMigrated) {
          const oldNotebooksJson = localStorage.getItem('notebooks')
          if (oldNotebooksJson) {
            const oldNotebooks = JSON.parse(oldNotebooksJson)
            for (const nb of oldNotebooks) {
              await dbService.createNotebook(nb.id, nb.name)
              if (nb.sources) {
                for (const s of nb.sources) await dbService.saveSource(s, nb.id)
              }
              if (nb.messages) {
                for (const m of nb.messages) await dbService.saveMessage(nb.id, m.role, m.content)
              }
            }
          }

          const oldApiKeys = localStorage.getItem('apiKeys')
          const oldModels = localStorage.getItem('selectedModels')
          const oldProvider = localStorage.getItem('selectedProvider')

          if (oldApiKeys || oldModels || oldProvider) {
            await dbService.saveSettings(
              oldApiKeys ? JSON.parse(oldApiKeys) : { gemini: '', openai: '', claude: '' },
              oldModels ? JSON.parse(oldModels) : { gemini: 'gemini-1.5-flash-latest', openai: 'gpt-4o', claude: 'claude-3-5-sonnet-latest' },
              (oldProvider as LLMProvider) || 'gemini'
            )
          }
          localStorage.setItem('sqlite_migrated', 'true')
        }

        const nbs = await dbService.getNotebooks()
        const settings = await dbService.getSettings()

        if (nbs.length > 0) {
          setNotebooks(nbs)
          setCurrentNotebookId(nbs[0].id)
        } else {
          await dbService.createNotebook('default', 'Untitled notebook')
          setNotebooks([DEFAULT_NOTEBOOK])
        }

        setApiKeys(settings.apiKeys)
        setSelectedModels(settings.models)
        setSelectedProvider(settings.selectedProvider)
      } catch (err) {
        console.error('Failed to initialize data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initData()
  }, [])

  const handleSendMessage = async () => {
    const newMessage: Message = { role: 'user', content: chatInput }
    await dbService.saveMessage(currentNotebookId, newMessage.role, newMessage.content)

    // Update local state for immediate feedback
    const updatedNotebooks = notebooks.map(nb => {
      if (nb.id === currentNotebookId) {
        return { ...nb, messages: [...nb.messages, newMessage] }
      }
      return nb
    })
    setNotebooks(updatedNotebooks)
    setChatInput('')
    setIsProcessing(true)

    try {
      const response = await generateAIResponse({
        provider: selectedProvider,
        apiKey: apiKeys[selectedProvider],
        model: selectedModels[selectedProvider],
        messages: [...currentNotebook.messages, newMessage],
        sources: currentNotebook.sources,
      })

      const aiMessage: Message = { role: 'ai', content: response }
      await dbService.saveMessage(currentNotebookId, aiMessage.role, aiMessage.content)

      setNotebooks(prev => prev.map(nb => {
        if (nb.id === currentNotebookId) {
          return { ...nb, messages: [...nb.messages, aiMessage] }
        }
        return nb
      }))
    } catch (error) {
      setNotebooks(prev => prev.map(nb => {
        if (nb.id === currentNotebookId) {
          return { ...nb, messages: [...nb.messages, { role: 'ai', content: "Sorry, I encountered an error." }] }
        }
        return nb
      }))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddSource = async () => {
    try {
      // @ts-ignore
      const files = await window.ipcRenderer.invoke('select-files')
      if (files && files.length > 0) {
        const newSources: Source[] = files.map((file: any) => ({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type === 'pdf' ? 'pdf' : 'text',
          content: file.content
        }))

        for (const s of newSources) {
          await dbService.saveSource(s, currentNotebookId)
        }

        setNotebooks(prev => prev.map(nb => {
          if (nb.id === currentNotebookId) {
            return { ...nb, sources: [...nb.sources, ...newSources] }
          }
          return nb
        }))
      }
    } catch (error) {
      console.error('Failed to add source:', error)
    }
    setIsModalOpen(false)
  }

  const handleAddNote = async () => {
    const name = prompt('Enter note title:', 'New Note')
    if (name) {
      const newNote: Source = {
        id: Date.now().toString(),
        name,
        type: 'note',
        content: ''
      }
      await dbService.saveSource(newNote, currentNotebookId)
      setNotebooks(prev => prev.map(nb => {
        if (nb.id === currentNotebookId) {
          return { ...nb, sources: [...nb.sources, newNote] }
        }
        return nb
      }))
      setSelectedSource(newNote)
    }
  }

  const handleUpdateSourceContent = async (id: string, content: string) => {
    const source = currentNotebook.sources.find(s => s.id === id)
    if (source) {
      await dbService.saveSource({ ...source, content }, currentNotebookId)
    }
    setNotebooks(prev => prev.map(nb => {
      if (nb.id === currentNotebookId) {
        return {
          ...nb,
          sources: nb.sources.map(s => s.id === id ? { ...s, content } : s)
        }
      }
      return nb
    }))
  }

  const handleNewNotebook = () => {
    setIsNewNotebookModalOpen(true)
  }

  const handleCreateNotebook = async (name: string) => {
    const id = Date.now().toString()
    await dbService.createNotebook(id, name)
    const newNb: Notebook = {
      id,
      name,
      sources: [],
      messages: []
    }
    setNotebooks([...notebooks, newNb])
    setCurrentNotebookId(newNb.id)
    setViewMode('notebook')
  }

  const handleSelectNotebook = (id: string) => {
    setCurrentNotebookId(id)
    setViewMode('notebook')
    setSelectedSource(null)
  }

  const handleSaveSettings = async (keys: Record<LLMProvider, string>, models: Record<LLMProvider, string>, provider: LLMProvider) => {
    await dbService.saveSettings(keys, models, provider)
    setApiKeys(keys)
    setSelectedModels(models)
    setSelectedProvider(provider)
  }

  if (isLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your notebook...</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <TopBar
        notebookName={currentNotebook.name}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onNewNotebook={handleNewNotebook}
        onLogoClick={() => setViewMode('home')}
      />

      {viewMode === 'home' ? (
        <NotebooksHome
          notebooks={notebooks}
          onSelectNotebook={handleSelectNotebook}
          onNewNotebook={handleNewNotebook}
          searchTerm={notebookSearch}
          onSearchChange={setNotebookSearch}
        />
      ) : (
        <main className="main-layout">
          <SourcesPanel
            sources={currentNotebook.sources}
            selectedSourceId={selectedSource?.id}
            onSelectSource={setSelectedSource}
            onAddSourceClick={() => setIsModalOpen(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <div className="panel chat-panel">
            {selectedSource ? (
              <SourceDetailView
                source={selectedSource}
                onClose={() => setSelectedSource(null)}
                onUpdateContent={handleUpdateSourceContent}
              />
            ) : (
              <>
                <div className="chat-panel-header">
                  <h2 style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Chat</h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Sparkles size={18} color="var(--text-secondary)" cursor="pointer" />
                    <MoreVertical size={18} color="var(--text-secondary)" cursor="pointer" />
                  </div>
                </div>

                <ChatContainer
                  messages={currentNotebook.messages}
                  sources={currentNotebook.sources}
                  chatInput={chatInput}
                  isProcessing={isProcessing}
                  onChatInputChange={setChatInput}
                  onSendMessage={handleSendMessage}
                />
              </>
            )}
          </div>

          <StudioPanel onAddNoteClick={handleAddNote} />
        </main>
      )}

      <AddSourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSource={handleAddSource}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKeys={apiKeys}
        models={selectedModels}
        selectedProvider={selectedProvider}
        onSave={handleSaveSettings}
      />

      <CreateNotebookModal
        isOpen={isNewNotebookModalOpen}
        onClose={() => setIsNewNotebookModalOpen(false)}
        onCreate={handleCreateNotebook}
      />
    </div>
  )
}

export default App
