import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first, then .env as fallback
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();
import { processQuery } from '../src/lib/ai/chat-handler';

async function testCompleteSystem() {
  console.log('🚀 Testing Complete AI Law Tutor System\n');
  console.log('='.repeat(80));
  
  // Test queries
  const testQueries = [
    "What is a contract?",
    "What makes a contract valid in Ghana?",
    "Can you explain consideration in simple terms?",
  ];
  
  for (let i = 0; i < testQueries.length; i++) {
    const query = testQueries[i];
    
    console.log(`\n📝 Student Question ${i + 1}: "${query}"\n`);
    
    try {
      const response = await processQuery(query);
      
      console.log('🤖 Tutor Response:');
      console.log('-'.repeat(80));
      console.log(response.answer);
      console.log('-'.repeat(80));
      
      console.log(`\n📚 Sources Used: ${response.sources.length}`);
      response.sources.forEach((source, idx) => {
        const page = source.pageNumber ? `Page ${source.pageNumber}` : 'Page N/A';
        console.log(`  ${idx + 1}. ${page} (Relevance: ${(source.score * 100).toFixed(1)}%)`);
      });
      
      console.log(`\n📊 Model: ${response.model}`);
      if (response.tokensUsed) {
        console.log(`   Tokens: ${response.tokensUsed}`);
      }
      
      console.log('\n' + '='.repeat(80));
      
      // Wait between queries
      if (i < testQueries.length - 1) {
        console.log('\nWaiting 2 seconds before next query...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
  }
  
  console.log('\n✅ Complete System Test Finished!');
}

// Run the test
testCompleteSystem();