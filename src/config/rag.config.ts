export const ragConfig = {
  chunkSize: 1000,              // Characters per chunk
  chunkOverlap: 200,            // Overlap to maintain context
  embeddingModel: "text-embedding-3-small",
  embeddingDimensions: 1536,
  topK: 2,                      // Number of chunks to retrieve (reduced from 3 for faster processing)
  similarityThreshold: 0.2,     // Minimum relevance score (adjusted for cosine similarity scores)
  pineconeIndex: process.env.PINECONE_INDEX || "law-bot-index",
  pineconeNamespace: "ghanaian-law",
  batchSize: 100,               // Batch size for embedding generation
  batchDelay: 150,              // Delay between batches (ms)
};

