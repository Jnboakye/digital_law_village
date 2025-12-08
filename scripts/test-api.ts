async function testAPI() {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing API Endpoints\n');
  console.log('='.repeat(80));
  
  try {
    // Test 1: Create Session
    console.log('\n📝 Test 1: Creating session...');
    const createResponse = await fetch(`${baseURL}/api/session/create`, {
      method: 'POST',
    });
    const sessionData = await createResponse.json();
    console.log('✓ Session created:', sessionData.sessionId);
    
    const sessionId = sessionData.sessionId;
    
    // Test 2: Send first message
    console.log('\n📝 Test 2: Sending first message...');
    const chatResponse1 = await fetch(`${baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is a contract?',
        sessionId,
      }),
    });
    const chat1 = await chatResponse1.json();
    console.log('✓ Response received');
    console.log('🤖 Answer:', chat1.message.content.substring(0, 150) + '...');
    console.log('📚 Sources:', chat1.sources.length);
    
    // Test 3: Send follow-up message
    console.log('\n📝 Test 3: Sending follow-up message...');
    const chatResponse2 = await fetch(`${baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Can you give me an example?',
        sessionId,
      }),
    });
    const chat2 = await chatResponse2.json();
    console.log('✓ Response received');
    console.log('🤖 Answer:', chat2.message.content.substring(0, 150) + '...');
    
    // Test 4: Get session history
    console.log('\n📝 Test 4: Getting session history...');
    const sessionResponse = await fetch(`${baseURL}/api/session/${sessionId}`);
    const sessionHistory = await sessionResponse.json();
    console.log('✓ Session retrieved');
    console.log('💬 Total messages:', sessionHistory.session.messages.length);
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ All API tests passed!\n');
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
}

console.log('⚠️  Make sure your Next.js dev server is running:');
console.log('   npm run dev\n');
console.log('Press Enter to start tests...');

process.stdin.once('data', () => {
  testAPI();
});