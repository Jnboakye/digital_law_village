import { generateEmbedding } from './embeddings';
import { queryVectors } from './vector-store';
import { ragConfig } from '@/config/rag.config';
import { RetrievalResult, RAGQueryResult } from '@/types/rag';

export async function retrieveRelevantChunks(
  query: string,
  topK: number = ragConfig.topK
): Promise<RAGQueryResult> {
  try {
    console.log(`🔍 Searching for: "${query}"`);
    
    // Step 1: Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Step 2: Query Pinecone for similar vectors
    const matches = await queryVectors(queryEmbedding, topK);
    
    // Step 3: Filter by similarity threshold and format results
    // Log all matches for debugging
    console.log(`  Found ${matches.length} matches from Pinecone`);
    if (matches.length > 0) {
      console.log(`  Score range: ${Math.min(...matches.map(m => m.score || 0)).toFixed(3)} - ${Math.max(...matches.map(m => m.score || 0)).toFixed(3)}`);
    }
    
    const results: RetrievalResult[] = matches
      .filter(match => {
        const passes = match.score >= ragConfig.similarityThreshold;
        if (!passes && matches.length > 0) {
          console.log(`  Filtered out match with score: ${match.score.toFixed(3)} (threshold: ${ragConfig.similarityThreshold})`);
        }
        return passes;
      })
      .map(match => {
        const metadata = match.metadata as Record<string, unknown> | undefined;
        return {
          content: (metadata?.content as string) || '',
          score: match.score,
          metadata: {
            source: (metadata?.source as string) || 'unknown',
            pageNumber: metadata?.pageNumber as number | undefined,
            chunkIndex: (metadata?.chunkIndex as number) || 0,
          },
        };
      });
    
    // Step 4: Combine all content into context
    const context = results
      .map((result) => {
        const pageInfo = result.metadata.pageNumber 
          ? `[Page ${result.metadata.pageNumber}]` 
          : '';
        return `${pageInfo}\n${result.content}`;
      })
      .join('\n\n---\n\n');
    
    console.log(`✓ Found ${results.length} relevant chunks`);
    results.forEach((result, i) => {
      console.log(`  ${i + 1}. Score: ${result.score.toFixed(3)} | Page: ${result.metadata.pageNumber || 'N/A'}`);
    });
    
    return {
      query,
      results,
      context,
    };
  } catch (error) {
    console.error('Error retrieving chunks:', error);
    throw new Error(`Failed to retrieve relevant chunks: ${error}`);
  }
}

export async function retrieveWithReranking(
  query: string,
  topK: number = ragConfig.topK * 2 // Get more candidates for reranking
): Promise<RAGQueryResult> {
  // First, get more candidates than needed
  const initialResults = await retrieveRelevantChunks(query, topK);
  
  // For now, just return top results
  // In the future, you could add a reranking model here
  const topResults = initialResults.results.slice(0, ragConfig.topK);
  
  return {
    query,
    results: topResults,
    context: topResults
      .map(result => {
        const pageInfo = result.metadata.pageNumber 
          ? `[Page ${result.metadata.pageNumber}]` 
          : '';
        return `${pageInfo}\n${result.content}`;
      })
      .join('\n\n---\n\n'),
  };
}