import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first, then .env as fallback
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();
import { retrieveRelevantChunks } from '../src/lib/rag/retriever';

async function testRAG() {
  console.log('🧪 Testing RAG Retrieval System\n');
  
  // Test queries
  const testQueries = [
    "What is a contract?",
    "What are the requirements for a valid contract in Ghana?",
    "Explain consideration in contract law",
    "What is the difference between criminal and civil law?",
  ];
  
  for (const query of testQueries) {
    console.log('='.repeat(80));
    console.log(`\n📝 Query: "${query}"\n`);
    
    try {
      const result = await retrieveRelevantChunks(query);
      
      console.log(`\n📚 Retrieved Context:\n`);
      console.log(result.context);
      console.log('\n');
      
      // Wait a bit between queries to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error);
    }
  }
  
  console.log('='.repeat(80));
  console.log('\n✅ RAG Test Complete!');
}

// Run the test
testRAG();