import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first, then .env as fallback
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

import { loadPDF } from '../src/lib/pdf/loader';
import { chunkText } from '../src/lib/rag/chunking';
import { generateEmbeddings } from '../src/lib/rag/embeddings';
import { upsertVectors } from '../src/lib/rag/vector-store';

async function setupKnowledgeBase() {
  try {
    console.log('🚀 Starting Knowledge Base Setup...\n');
    
    // Step 1: Load PDF
    console.log('📄 Step 1: Loading PDF...');
    const pdfPath = path.join(process.cwd(), 'data', 'pdfs', 'ghanaian-law-guide.pdf');
    const pdfContent = await loadPDF(pdfPath);
    console.log('');
    
    // Step 2: Chunk the text
    console.log('✂️  Step 2: Chunking text...');
    const chunks = chunkText(
      pdfContent.text,
      'ghanaian-law-guide.pdf'
    );
    console.log('');
    
    // Step 3: Generate embeddings
    console.log('🧮 Step 3: Generating embeddings...');
    const texts = chunks.map(chunk => chunk.content);
    const embeddings = await generateEmbeddings(texts);
    console.log('');
    
    // Step 4: Upload to Pinecone
    console.log('☁️  Step 4: Uploading to Pinecone...');
    await upsertVectors(chunks, embeddings);
    console.log('');
    
    console.log('✅ Knowledge Base Setup Complete!');
    console.log(`   Total chunks: ${chunks.length}`);
    console.log(`   Total embeddings: ${embeddings.length}`);
    console.log(`   Source: ${pdfPath}`);
    
  } catch (error) {
    console.error('❌ Error setting up knowledge base:', error);
    process.exit(1);
  }
}

// Run the setup
setupKnowledgeBase();