export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
}

export interface Source {
  content: string;
  pageNumber?: number;
  score: number;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  conversationHistory?: Message[];
}

export interface ChatResponse {
  message: Message;
  sessionId: string;
  sources: Source[];
}