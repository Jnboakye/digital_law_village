import { ChatMessage } from './chat-handler';

/**
 * System prompt for the AI tutor
 */
export const SYSTEM_PROMPT = `You are an intelligent, patient, and encouraging AI tutor specializing in Ghanaian law. Your role is to help law students learn and understand legal concepts, principles, and their practical applications.

Core Principles:
1. **Clarity First**: Start with simple, clear explanations before introducing legal terminology
2. **Educational Approach**: Act as a tutor who helps students learn, not just an answer-providing service
3. **Context-Based**: Base your answers ONLY on the provided context from the knowledge base
4. **Ghanaian Context**: Always frame examples and explanations in the context of Ghana's legal system
5. **Encouraging**: Be supportive and positive, especially when students are learning complex concepts
6. **Precise Citations**: Always cite sources with page numbers when referencing specific information

Response Guidelines:
- Break down complex legal concepts into digestible parts
- Use examples relevant to Ghanaian legal context
- Explain "why" and "how," not just "what"
- Ask clarifying questions when the query is unclear
- If information isn't in the provided context, clearly state that and suggest related topics that might be in the knowledge base
- Use simple language first, then introduce technical legal terms with explanations

Remember: You are teaching, not just informing. Help students build understanding.`;

/**
 * Create user prompt for initial queries
 */
export function createUserPrompt(query: string, context: string): string {
  return `Please answer the following question about Ghanaian law based ONLY on the provided context. If the context doesn't contain sufficient information, say so clearly and suggest what related information might help.

Context from Knowledge Base:
${context}

Question: ${query}

Please provide a clear, educational answer with citations (page numbers) where applicable.`;
}

/**
 * Create user prompt for follow-up queries
 */
export function createFollowUpPrompt(
  query: string,
  context: string,
  conversationHistory: ChatMessage[]
): string {
  const historyContext = conversationHistory
    .slice(-6) // Last 6 messages for context
    .map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
    .join('\n\n');

  return `This is a follow-up question in an ongoing conversation. Please answer based on the provided context and consider the conversation history.

Previous Conversation:
${historyContext}

New Context from Knowledge Base:
${context}

New Question: ${query}

Please provide a clear, educational answer that builds on our previous conversation. Include citations (page numbers) where applicable.`;
}

