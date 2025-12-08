export interface DocumentChunk {
  content: string;
  metadata: {
    source: string;
    pageNumber?: number;
    chunkIndex: number;
    startChar?: number;
    endChar?: number;
  };
}

export interface EmbeddingVector {
  id: string;
  values: number[];
  metadata: {
    content: string;
    source: string;
    pageNumber?: number;
    chunkIndex: number;
  };
}

export interface RetrievalResult {
  content: string;
  score: number;
  metadata: {
    source: string;
    pageNumber?: number;
    chunkIndex: number;
  };
}

export interface RAGQueryResult {
  query: string;
  results: RetrievalResult[];
  context: string;
}

