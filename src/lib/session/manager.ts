import { getRedisClient } from './redis';
import { Session, Message } from '@/types';

const SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds

/**
 * Wait for Redis connection to be ready
 */
async function ensureRedisConnected(client: ReturnType<typeof getRedisClient>): Promise<void> {
  // Check current status
  const status = client.status;
  
  if (status === 'ready') {
    return;
  }

  if (status === 'end' || status === 'close') {
    await client.connect();
  }

  // Wait for ready state if connecting or if we just initiated connection
  return new Promise<void>((resolve, reject) => {
    // Check again after potential connect() call
    if (client.status === 'ready') {
      resolve();
      return;
    }

    const timeout = setTimeout(() => {
      client.removeAllListeners('ready');
      client.removeAllListeners('error');
      reject(new Error('Redis connection timeout'));
    }, 5000);

    const onReady = () => {
      clearTimeout(timeout);
      client.removeListener('error', onError);
      resolve();
    };

    const onError = (err: Error) => {
      clearTimeout(timeout);
      client.removeListener('ready', onReady);
      reject(err);
    };

    client.once('ready', onReady);
    client.once('error', onError);
  });
}

/**
 * Create a new session
 */
export async function createSession(): Promise<string> {
  try {
    const { randomUUID } = await import('crypto');
    const sessionId = randomUUID();
    const now = new Date();

    const session: Session = {
      id: sessionId,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };

    const client = getRedisClient();
    await ensureRedisConnected(client);
    
    await client.setex(
      `session:${sessionId}`,
      SESSION_TTL,
      JSON.stringify(session)
    );

    console.log(`✓ Created session: ${sessionId}`);
    return sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connect') || errorMessage.includes('timeout')) {
      throw new Error('Redis is not running. Please start Redis first. See terminal for instructions.');
    }
    throw new Error(`Failed to create session: ${errorMessage}`);
  }
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const client = getRedisClient();
    await ensureRedisConnected(client);
    
    const data = await client.get(`session:${sessionId}`);

    if (!data) {
      return null;
    }

    const session: Session = JSON.parse(data);
    
    // Convert date strings back to Date objects
    session.createdAt = new Date(session.createdAt);
    session.updatedAt = new Date(session.updatedAt);
    session.messages = session.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connect')) {
      throw new Error('Redis is not running. Please start Redis first.');
    }
    throw new Error(`Failed to get session: ${errorMessage}`);
  }
}

/**
 * Add message to session
 */
export async function addMessageToSession(
  sessionId: string,
  message: Message
): Promise<void> {
  try {
    const session = await getSession(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.messages.push(message);
    session.updatedAt = new Date();

    const client = getRedisClient();
    await ensureRedisConnected(client);
    
    await client.setex(
      `session:${sessionId}`,
      SESSION_TTL,
      JSON.stringify(session)
    );
  } catch (error) {
    console.error('Error adding message to session:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connect')) {
      throw new Error('Redis is not running. Please start Redis first.');
    }
    throw new Error(`Failed to add message to session: ${errorMessage}`);
  }
}

/**
 * Update session messages
 */
export async function updateSessionMessages(
  sessionId: string,
  messages: Message[]
): Promise<void> {
  try {
    const session = await getSession(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.messages = messages;
    session.updatedAt = new Date();

    const client = getRedisClient();
    await ensureRedisConnected(client);
    await client.setex(
      `session:${sessionId}`,
      SESSION_TTL,
      JSON.stringify(session)
    );
  } catch (error) {
    console.error('Error updating session messages:', error);
    throw new Error(`Failed to update session messages: ${error}`);
  }
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const client = getRedisClient();
    await ensureRedisConnected(client);
    await client.del(`session:${sessionId}`);
    console.log(`✓ Deleted session: ${sessionId}`);
  } catch (error) {
    console.error('Error deleting session:', error);
    throw new Error(`Failed to delete session: ${error}`);
  }
}

