export interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'text' | 'link' | 'note';
  content: string;
}

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export interface Notebook {
  id: string;
  name: string;
  sources: Source[];
  messages: Message[];
}
