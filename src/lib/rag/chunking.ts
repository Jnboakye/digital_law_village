import { ragConfig } from '@/config/rag.config';
import { DocumentChunk } from '@/types/rag';

/**
 * Split text into chunks with overlap, breaking at sentence boundaries
 */
export function chunkText(
  text: string,
  source: string,
  chunkSize: number = ragConfig.chunkSize,
  overlap: number = ragConfig.chunkOverlap
): DocumentChunk[] {
  // Clean text: normalize whitespace and line breaks
  const cleanedText = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  const chunks: DocumentChunk[] = [];
  const sentences = splitIntoSentences(cleanedText);
  
  let currentChunk = '';
  let currentChunkIndex = 0;
  let startChar = 0;
  let charOffset = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const potentialChunk = currentChunk 
      ? `${currentChunk} ${sentence}` 
      : sentence;

    // If adding this sentence would exceed chunk size
    if (potentialChunk.length > chunkSize && currentChunk) {
      // Save current chunk
      chunks.push({
        content: currentChunk.trim(),
        metadata: {
          source,
          chunkIndex: currentChunkIndex,
          startChar: startChar,
          endChar: charOffset - 1,
        },
      });

      // Start new chunk with overlap
      const overlapText = getOverlapText(currentChunk, overlap);
      currentChunk = `${overlapText} ${sentence}`;
      startChar = charOffset - overlapText.length;
      currentChunkIndex++;
    } else {
      currentChunk = potentialChunk;
    }

    charOffset += sentence.length + 1; // +1 for space
  }

  // Add final chunk
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: {
        source,
        chunkIndex: currentChunkIndex,
        startChar: startChar,
        endChar: cleanedText.length - 1,
      },
    });
  }

  return chunks;
}

/**
 * Split text into sentences using punctuation marks
 */
function splitIntoSentences(text: string): string[] {
  // Match sentences ending with . ! ? followed by space or end of string
  const sentenceRegex = /[^.!?]*[.!?]+(?:\s+|$)/g;
  const sentences: string[] = [];
  let match;

  while ((match = sentenceRegex.exec(text)) !== null) {
    const sentence = match[0].trim();
    if (sentence.length > 0) {
      sentences.push(sentence);
    }
  }

  // If no sentences found (no punctuation), split by paragraphs or large chunks
  if (sentences.length === 0) {
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    if (paragraphs.length > 0) {
      return paragraphs;
    }
    // Last resort: split by length
    return text.match(/.{1,500}/g) || [text];
  }

  return sentences;
}

/**
 * Get overlap text from the end of a chunk
 */
function getOverlapText(chunk: string, overlapSize: number): string {
  if (chunk.length <= overlapSize) {
    return chunk;
  }

  // Try to start overlap at sentence boundary
  const endPortion = chunk.slice(-overlapSize * 1.5);
  const sentenceBoundary = endPortion.search(/[.!?]\s+/);

  if (sentenceBoundary > 0) {
    return endPortion.slice(sentenceBoundary + 1).trim();
  }

  // Otherwise, just take the last N characters
  return chunk.slice(-overlapSize);
}

