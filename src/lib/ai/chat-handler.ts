import { openai, AI_CONFIG } from './openai';
import { retrieveRelevantChunks } from '../rag/retriever';
import { SYSTEM_PROMPT, createUserPrompt, createFollowUpPrompt } from './prompt-templates';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  answer: string;
  sources: {
    content: string;
    pageNumber?: number;
    score: number;
  }[];
  model: string;
  tokensUsed?: number;
}

export async function processQuery(
  query: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    console.log(`\n💬 Processing query: "${query}"`);
    
    // Step 1: Retrieve relevant context from knowledge base
    const ragResult = await retrieveRelevantChunks(query);
    
    // If no relevant chunks found
    if (ragResult.results.length === 0) {
      return {
        answer: "I couldn't find specific information about that in the knowledge base. Could you rephrase your question or ask about a different topic related to Ghanaian law?",
        sources: [],
        model: AI_CONFIG.model,
      };
    }
    
    // Step 2: Prepare messages for OpenAI
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
    ];
    
    // Add conversation history if exists (filter out system messages)
    const userAssistantHistory = conversationHistory.filter(
      msg => msg.role !== 'system'
    );

    if (userAssistantHistory.length > 0) {
      messages.push(...userAssistantHistory);
      messages.push({
        role: 'user',
        content: createFollowUpPrompt(query, ragResult.context, userAssistantHistory),
      });
    } else {
      messages.push({
        role: 'user',
        content: createUserPrompt(query, ragResult.context),
      });
    }
    
    // Step 3: Get response from OpenAI
    console.log('🤖 Generating response from OpenAI...');
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: messages,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    });
    
    const answer = completion.choices[0].message.content || 'Sorry, I could not generate a response.';
    
    console.log('✓ Response generated successfully\n');
    
    // Step 4: Format response with sources
    return {
      answer,
      sources: ragResult.results.map(result => ({
        content: result.content,
        pageNumber: result.metadata.pageNumber,
        score: result.score,
      })),
      model: AI_CONFIG.model,
      tokensUsed: completion.usage?.total_tokens,
    };
    
  } catch (error) {
    console.error('Error processing query:', error);
    throw new Error(`Failed to process query: ${error}`);
  }
}

export async function processStreamingQuery(
  query: string,
  conversationHistory: ChatMessage[] = [],
  onChunk: (chunk: string) => void
): Promise<ChatResponse> {
  try {
    // Step 1: Retrieve context
    const ragResult = await retrieveRelevantChunks(query);
    
    if (ragResult.results.length === 0) {
      const fallbackMessage = "I couldn't find specific information about that in the knowledge base. Could you rephrase your question?";
      onChunk(fallbackMessage);
      return {
        answer: fallbackMessage,
        sources: [],
        model: AI_CONFIG.model,
      };
    }
    
    // Step 2: Prepare messages
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];
    
    const userAssistantHistory = conversationHistory.filter(
      msg => msg.role !== 'system'
    );

    if (userAssistantHistory.length > 0) {
      messages.push(...userAssistantHistory);
      messages.push({
        role: 'user',
        content: createFollowUpPrompt(query, ragResult.context, userAssistantHistory),
      });
    } else {
      messages.push({
        role: 'user',
        content: createUserPrompt(query, ragResult.context),
      });
    }
    
    // Step 3: Stream response from OpenAI
    const stream = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: messages,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      stream: true,
    });
    
    let fullAnswer = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullAnswer += content;
        onChunk(content);
      }
    }
    
    return {
      answer: fullAnswer,
      sources: ragResult.results.map(result => ({
        content: result.content,
        pageNumber: result.metadata.pageNumber,
        score: result.score,
      })),
      model: AI_CONFIG.model,
    };
    
  } catch (error) {
    console.error('Error processing streaming query:', error);
    throw new Error(`Failed to process streaming query: ${error}`);
  }
}