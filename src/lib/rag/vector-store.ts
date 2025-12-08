import { Pinecone } from '@pinecone-database/pinecone';
import { ragConfig } from '@/config/rag.config';
import { DocumentChunk, EmbeddingVector } from '@/types/rag';

let pineconeClient: Pinecone | null = null;

/**
 * Initialize Pinecone client
 */
function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      console.error('⚠️  PINECONE_API_KEY is not set in environment variables');
      console.error('   Please add it to your .env.local file');
      throw new Error('PINECONE_API_KEY is not set in environment variables');
    }

    pineconeClient = new Pinecone({
      apiKey,
    });
  }
  return pineconeClient;
}

/**
 * Upsert vectors to Pinecone
 */
export async function upsertVectors(
  chunks: DocumentChunk[],
  embeddings: number[][]
): Promise<void> {
  try {
    if (chunks.length !== embeddings.length) {
      throw new Error('Chunks and embeddings must have the same length');
    }

    console.log(`☁️  Uploading ${chunks.length} vectors to Pinecone...`);

    const client = getPineconeClient();
    const index = client.index(ragConfig.pineconeIndex);

    // Prepare vectors for upload
    const vectors: EmbeddingVector[] = chunks.map((chunk, i) => ({
      id: `${chunk.metadata.source}-${chunk.metadata.chunkIndex}`,
      values: embeddings[i],
      metadata: {
        content: chunk.content,
        source: chunk.metadata.source,
        pageNumber: chunk.metadata.pageNumber,
        chunkIndex: chunk.metadata.chunkIndex,
      },
    }));

    // Upsert in batches (Pinecone recommends batches of 100)
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      const namespace = index.namespace(ragConfig.pineconeNamespace);
      
      await namespace.upsert(batch);
      console.log(`  Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`);
    }

    console.log(`✓ Successfully uploaded ${vectors.length} vectors`);
  } catch (error) {
    console.error('Error upserting vectors:', error);
    throw new Error(`Failed to upsert vectors: ${error}`);
  }
}

/**
 * Query Pinecone for similar vectors
 */
export async function queryVectors(
  queryEmbedding: number[],
  topK: number = ragConfig.topK
): Promise<Array<{ score: number; metadata?: Record<string, unknown> }>> {
  try {
    const client = getPineconeClient();
    const index = client.index(ragConfig.pineconeIndex);
    const namespace = index.namespace(ragConfig.pineconeNamespace);

    const queryResponse = await namespace.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    return queryResponse.matches.map(match => ({
      score: match.score || 0,
      metadata: match.metadata,
    }));
  } catch (error) {
    console.error('Error querying vectors:', error);
    throw new Error(`Failed to query vectors: ${error}`);
  }
}

/**
 * Delete all vectors from the namespace (for reset/testing)
 */
export async function deleteAllVectors(): Promise<void> {
  try {
    const client = getPineconeClient();
    const index = client.index(ragConfig.pineconeIndex);
    const namespace = index.namespace(ragConfig.pineconeNamespace);

    await namespace.deleteAll();
    console.log('✓ Deleted all vectors from namespace');
  } catch (error) {
    console.error('Error deleting vectors:', error);
    throw new Error(`Failed to delete vectors: ${error}`);
  }
}

