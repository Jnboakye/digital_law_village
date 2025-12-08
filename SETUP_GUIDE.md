# Setup Guide - Digital Law Village

## Step 1: Configure Environment Variables

Create or update `.env.local` file in the root directory with your API keys:

```env
OPENAI_API_KEY=sk-proj-your-openai-key-here
PINECONE_API_KEY=pcsk_your-pinecone-key-here
PINECONE_INDEX=law-bot-index
REDIS_URL=redis://localhost:6379
```

### Getting Your API Keys:

1. **OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy and paste it into `.env.local`

2. **Pinecone API Key:**
   - Go to https://app.pinecone.io/
   - Create an account or log in
   - Go to API Keys section
   - Create a new API key
   - Copy and paste it into `.env.local`

3. **Pinecone Index:**
   - In Pinecone dashboard, create an index named `law-bot-index`
   - Set dimensions to `1536` (for text-embedding-3-small)
   - Use cosine similarity metric

## Step 2: Start Redis

Redis is required for session management:

```bash
# macOS (using Homebrew)
brew services start redis

# Or using Docker
docker run -d -p 6379:6379 redis
```

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

## Step 3: Process PDF and Create Knowledge Base

The PDF needs to be processed and uploaded to Pinecone before the bot can answer questions:

```bash
npm run setup-kb
```

This will:
1. Load the PDF from `data/pdfs/ghanaian-law-guide.pdf`
2. Split it into chunks
3. Generate embeddings using OpenAI
4. Upload to Pinecone

**Note:** This process may take several minutes depending on the PDF size.

## Step 4: Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to start using the chat!

## Troubleshooting

### Bot not answering?

1. **Check if knowledge base is set up:**
   ```bash
   npm run test-rag
   ```
   This will test if embeddings are in Pinecone.

2. **Check API keys:**
   - Make sure `.env.local` exists
   - Verify keys are correct (no extra spaces)
   - Restart the dev server after changing `.env.local`

3. **Check server logs:**
   - Look for error messages in the terminal
   - Common issues:
     - "PINECONE_API_KEY is not set" → Add to `.env.local`
     - "OPENAI_API_KEY is not set" → Add to `.env.local`
     - "No relevant chunks found" → Run `npm run setup-kb`

### Redis Connection Errors?

- Make sure Redis is running: `brew services start redis`
- Check Redis is accessible: `redis-cli ping`

### Knowledge Base Issues?

- Ensure PDF exists: `data/pdfs/ghanaian-law-guide.pdf`
- Run setup again: `npm run setup-kb`
- Check Pinecone dashboard for uploaded vectors

