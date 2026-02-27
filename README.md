# NotebookLM Prototype

A minimalist research assistant prototype inspired by Google NotebookLM, built using an AI-first development process. This application allows users to manage research sources and interact with them via an AI-powered chat interface.

## 🚀 Features

- **Source Management**: Add and organize research materials including PDFs, text files, and website links.
- **Interactive Chat**: Ask questions grounded in your selected sources. The prototype includes mock AI logic to demonstrate source-based responses.
- **Source Preview**: View the content of your research sources side-by-side with the chat interface.
- **Modern UI**: A clean, responsive desktop interface built with React and styled with vanilla CSS.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Desktop Wrapper**: [Electron](https://www.electronjs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running in Development

To start the Electron application in development mode with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Building for Production

To compile the TypeScript code, build the Vite project, and package the Electron app:
```bash
npm run build
```

## 📂 Project Structure

- `electron/`: Main and preload scripts for the Electron desktop environment.
- `src/`: Main React application source code.
    - `App.tsx`: Core application logic, UI, and mock AI interaction.
    - `index.css`: Global styling and layout.
- `public/`: Static assets for the application.
- `dist-electron/`: Compiled Electron files (generated after build).
- `dist/`: Compiled production assets (generated after build).
