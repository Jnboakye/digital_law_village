import { openai } from '@/lib/ai/openai';
import { ragConfig } from '@/config/rag.config';

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: ragConfig.embeddingModel,
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error}`);
  }
}

/**
 * Generate embeddings for multiple texts in batches
 */
export async function generateEmbeddings(
  texts: string[],
  batchSize: number = ragConfig.batchSize,
  delay: number = ragConfig.batchDelay
): Promise<number[][]> {
  try {
    console.log(`🧮 Generating embeddings for ${texts.length} texts...`);
    
    const embeddings: number[][] = [];
    const batches: string[][] = [];

    // Split into batches
    for (let i = 0; i < texts.length; i += batchSize) {
      batches.push(texts.slice(i, i + batchSize));
    }

    console.log(`  Processing ${batches.length} batches...`);

    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`  Batch ${i + 1}/${batches.length} (${batch.length} texts)...`);

      try {
        const response = await openai.embeddings.create({
          model: ragConfig.embeddingModel,
          input: batch,
          encoding_format: 'float',
        });

        const batchEmbeddings = response.data.map(item => item.embedding);
        embeddings.push(...batchEmbeddings);

        // Add delay between batches to avoid rate limits
        if (i < batches.length - 1 && delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Error processing batch ${i + 1}:`, error);
        // If batch fails, try individual requests
        console.log(`  Retrying batch ${i + 1} as individual requests...`);
        for (const text of batch) {
          const embedding = await generateEmbedding(text);
          embeddings.push(embedding);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.log(`✓ Generated ${embeddings.length} embeddings`);
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error(`Failed to generate embeddings: ${error}`);
  }
}

