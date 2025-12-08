import { Message } from './chat';

export interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface CreateSessionResponse {
  sessionId: string;
  createdAt: Date;
}

export interface GetSessionResponse {
  session: Session;
}

