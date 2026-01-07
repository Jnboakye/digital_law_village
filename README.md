Digital Law Village - Complete Project Explanation

What This Project Does:

This is an **AI-powered law tutor** that helps students learn Ghanaian law. It has two ways to interact:
1. **Text Chat** - Type questions and get answers
2. **Voice Chat** - Speak questions and hear responses

The AI answers questions by:
- Searching through a PDF knowledge base
- Finding relevant information using AI embeddings
- Generating educational responses with citations



## High-Level Architecture

```
User (Browser)
    ↓
Frontend (React/Next.js)
    ↓
API Routes (Next.js Server)
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   OpenAI API    │   Pinecone      │   Redis         │
│   (GPT, TTS,    │   (Vector DB)   │   (Sessions)     │
│    Embeddings)  │                 │                 │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## Complete Folder Structure Explained

### **Root Level Files**

```
digital law village/
├── package.json          # Lists all dependencies
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── .env.local            # Your secret keys (API keys, etc.)
└── README.md             # Project documentation
```

**Key Files:**
- `package.json` - Lists all npm packages (OpenAI, Pinecone, Redis, etc.)
- `.env.local` - Contains your API keys

---

### ** `/src` - Main Source Code**

This is where all your application code lives.

#### **`/src/app` - Next.js App Router (Pages & API Routes)**

```
src/app/
├── layout.tsx            # Root layout (wraps all pages)
├── page.tsx              # Home page (/)
├── globals.css           # Global styles
│
├── chat/
│   └── page.tsx         # Chat page (/chat)
│
├── voice/
│   └── page.tsx         # Voice page (/voice)
│
└── api/                  # Backend API endpoints
    ├── chat/
    │   └── route.ts     # POST /api/chat - Handles chat messages
    ├── voice/
    │   ├── transcribe/  # POST /api/voice/transcribe - Speech to text
    │   └── synthesize/  # POST /api/voice/synthesize - Text to speech
    ├── session/
    │   ├── create/      # POST /api/session/create - Create new session
    │   └── [id]/        # GET /api/session/[id] - Get session by ID
    └── rag/
        ├── embeddings/  # POST /api/rag/embeddings - Generate embeddings
        └── query/       # POST /api/rag/query - Query knowledge base
```

**What Each Does:**

1. **`layout.tsx`** - The HTML wrapper for the entire app (like `<html><body>`)
2. **`page.tsx`** -  Landing page with "Start Chatting" and "Start Voice Chat" buttons
3. **`chat/page.tsx`** - Renders the chat interface component
4. **`voice/page.tsx`** - Renders the voice interface component
5. **`api/chat/route.ts`** - The **most important** API endpoint:
   - Receives user messages
   - Gets conversation history from Redis
   - Calls RAG to find relevant info
   - Sends to OpenAI for answer
   - Saves messages to Redis
   - Returns response to frontend

---

#### **`/src/components` - React UI Components**

```
src/components/
├── chat/
│   ├── ChatInterface.tsx    # Main chat UI container
│   ├── MessageList.tsx       # Displays all messages
│   ├── MessageInput.tsx     # Text input box
│   ├── Citation.tsx         # Shows source citations
│   └── TypingIndicator.tsx  # "AI is thinking..." animation
│
├── voice/
│   ├── VoiceInterface.tsx   # Main voice UI container
│   ├── RecordButton.tsx     # Big record button
│   ├── AudioPlayer.tsx      # Plays audio responses
│   └── WaveformVisualizer.tsx # Visual waveform (optional)
│
└── shared/
    ├── Header.tsx           # Shared header component
    ├── Sidebar.tsx          # Sidebar navigation
    └── LoadingSpinner.tsx   # Loading animation
```

**Component Hierarchy:**

```
ChatInterface
  ├── Header (title, back button, new chat)
  ├── MessageList
  │   ├── Message (user/assistant)
  │   └── Citation (source info)
  └── MessageInput (text box, send button)
```

---

#### **`/src/lib` - Core Business Logic**

This is the **brain** of the application. All the complex logic lives here.

```
src/lib/
├── ai/                      # OpenAI integration
│   ├── openai.ts           # OpenAI client setup
│   ├── chat-handler.ts     # Orchestrates RAG + OpenAI
│   └── prompt-templates.ts # System prompts for AI
│
├── rag/                     # RAG (Retrieval Augmented Generation)
│   ├── chunking.ts         # Splits PDF text into chunks
│   ├── embeddings.ts       # Converts text to vectors
│   ├── vector-store.ts     # Pinecone operations
│   └── retriever.ts        # Finds relevant chunks
│
├── pdf/                     # PDF processing
│   ├── loader.ts           # Loads PDF files
│   ├── parser.ts           # Extracts text from PDF
│   └── processor.ts        # Processes PDF content
│
├── session/                 # Session management
│   ├── redis.ts            # Redis client setup
│   └── manager.ts          # Create/get/update sessions
│
└── speech/                  # Voice features
    ├── stt.ts              # Speech-to-text (Whisper)
    └── tts.ts              # Text-to-speech (OpenAI TTS)
```

**Key Files Explained:**

1. **`ai/chat-handler.ts`** - The **orchestrator**:
   - Takes user question
   - Calls RAG to find relevant info
   - Builds prompt with context
   - Sends to OpenAI
   - Returns answer + sources

2. **`rag/retriever.ts`** - The **search engine**:
   - Converts question to embedding
   - Searches Pinecone for similar chunks
   - Returns top 3 most relevant chunks

3. **`rag/embeddings.ts`** - The **translator**:
   - Converts text → numbers (vectors)
   - Uses OpenAI's embedding model
   - These numbers represent meaning

4. **`session/manager.ts`** - The **memory**:
   - Creates new chat sessions
   - Stores messages in Redis
   - Retrieves conversation history

---

#### **`/src/hooks` - React Custom Hooks**

```
src/hooks/
├── useChat.ts          # Manages chat state & API calls
├── useVoice.ts         # Manages voice recording
├── useAudioPlayer.ts   # Manages audio playback
└── useSession.ts       # Manages session state
```

**What Hooks Do:**

Hooks are reusable pieces of logic. For example:

- **`useChat.ts`**:
  - Keeps track of messages
  - Handles sending messages to `/api/chat`
  - Manages loading/error states
  - Creates sessions automatically

- **`useVoice.ts`**:
  - Starts/stops recording
  - Sends audio to `/api/voice/transcribe`
  - Gets text back

---

#### **`/src/config` - Configuration Files**

```
src/config/
├── ai.config.ts        # OpenAI settings (model, temperature)
├── rag.config.ts      # RAG settings (chunk size, topK)
└── app.config.ts      # App-wide settings
```

**Why Separate Config?**

- Easy to change settings in one place
- No need to search through code
- Example: Change `similarityThreshold` in `rag.config.ts` to get more/fewer results

---

#### **`/src/types` - TypeScript Type Definitions**

```
src/types/
├── chat.ts            # Message, ChatResponse types
├── rag.ts             # RAG-related types
├── session.ts         # Session types
└── index.ts           # Exports all types
```

**Why Types?**

TypeScript uses types to catch errors before runtime. For example:

```typescript
// In types/chat.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Now TypeScript knows what a Message looks like
// If you try to use message.wrongProperty, it will error!
```

---

### ** `/scripts` - Setup & Testing Scripts**

```
scripts/
├── setup-knowledge-base.ts  # Processes PDF → Pinecone
├── test-rag.ts              # Tests RAG retrieval
├── test-complete-system.ts  # Tests full flow
└── test-api.ts              # Tests API endpoints
```

**Key Script:**

- **`setup-knowledge-base.ts`**:
  1. Reads PDF from `data/pdfs/`
  2. Splits into chunks
  3. Generates embeddings
  4. Uploads to Pinecone
  5. This is a **one-time setup** - run `npm run setup-kb`

---

### ** `/data` - Data Files**

```
data/
├── pdfs/
│   └── ghanaian-law-guide.pdf  # Your knowledge base
└── processed/                   # Processed chunks (optional)
```

---

##  How Data Flows Through Your System

### **Scenario: User asks "What is the constitution of Ghana?"**

#### **Step 1: User Types Question**
```
User types in MessageInput → useChat hook → POST /api/chat
```

#### **Step 2: API Receives Request**
```typescript
// src/app/api/chat/route.ts
POST /api/chat
Body: { message: "What is the constitution of Ghana?", sessionId: "abc123" }
```

#### **Step 3: Get Session History**
```typescript
// Gets previous messages from Redis
session = await getSession(sessionId);
// Returns: { messages: [...previous messages] }
```

#### **Step 4: Process Query (RAG + OpenAI)**
```typescript
// src/lib/ai/chat-handler.ts
response = await processQuery(message, conversationHistory);
```

**Inside `processQuery`:**

4a. **Retrieve Relevant Chunks**:
```typescript
// src/lib/rag/retriever.ts
ragResult = await retrieveRelevantChunks("What is the constitution of Ghana?");
```

4b. **Generate Query Embedding**:
```typescript
// src/lib/rag/embeddings.ts
queryEmbedding = await generateEmbedding("What is the constitution of Ghana?");
// Returns: [0.123, -0.456, 0.789, ...] (1536 numbers)
```

4c. **Search Pinecone**:
```typescript
// src/lib/rag/vector-store.ts
matches = await queryVectors(queryEmbedding, topK=3);
// Returns: Top 3 most similar chunks from PDF
```

4d. **Build Prompt**:
```typescript
// src/lib/ai/prompt-templates.ts
prompt = createUserPrompt(
  "What is the constitution of Ghana?",
  context  // The 3 relevant chunks combined
);
```

4e. **Call OpenAI**:
```typescript
// src/lib/ai/openai.ts
completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt }
  ]
});
// Returns: "The Constitution of Ghana is the supreme law..."
```

#### **Step 5: Save Messages**
```typescript
// Save user message and assistant response to Redis
await addMessageToSession(sessionId, userMessage);
await addMessageToSession(sessionId, assistantMessage);
```

#### **Step 6: Return Response**
```typescript
// API returns JSON
{
  message: {
    id: "xyz",
    role: "assistant",
    content: "The Constitution of Ghana is...",
    sources: [...]
  },
  sessionId: "abc123"
}
```

#### **Step 7: Frontend Updates**
```typescript
// useChat hook receives response
setMessages([...messages, assistantMessage]);
// ChatInterface re-renders with new message
```

---

##  Key Technologies & Their Roles

### **1. Next.js 14 (App Router)**
- **What**: React framework for building web apps
- **Why**: Handles routing, API routes, server-side rendering
- **Use**: Pages (`/chat`, `/voice`), API routes (`/api/chat`)

### **2. TypeScript**
- **What**: JavaScript with types
- **Why**: Catches errors early, better IDE support
- **Use**: All `.ts` and `.tsx` files

### **3. OpenAI**
- **What**: AI models (GPT, Whisper, TTS, Embeddings)
- **Why**: 
  - GPT-4o-mini: Generates answers
  - Whisper: Speech-to-text
  - TTS: Text-to-speech
  - Embeddings: Converts text to vectors
- **Use**: `src/lib/ai/openai.ts`, `src/lib/speech/stt.ts`, `src/lib/speech/tts.ts`

### **4. Pinecone**
- **What**: Vector database
- **Why**: Stores PDF chunks as vectors, enables semantic search
- **Use**: `src/lib/rag/vector-store.ts`

### **5. Redis (Upstash)**
- **What**: In-memory database
- **Why**: Stores chat sessions and message history
- **Use**: `src/lib/session/redis.ts`, `src/lib/session/manager.ts`

### **6. pdf-parse**
- **What**: PDF text extraction library
- **Why**: Extracts text from the law guide PDFs
- **Use**: `src/lib/pdf/loader.ts`

---

##  How Files Connect

### **Example: Sending a Chat Message**

```
1. User clicks "Send" in MessageInput.tsx
   ↓
2. Calls useChat().sendMessage()
   ↓
3. useChat.ts sends POST to /api/chat
   ↓
4. src/app/api/chat/route.ts receives request
   ↓
5. Calls getSession() from session/manager.ts
   ↓
6. manager.ts uses redis.ts to query Redis
   ↓
7. route.ts calls processQuery() from ai/chat-handler.ts
   ↓
8. chat-handler.ts calls retrieveRelevantChunks() from rag/retriever.ts
   ↓
9. retriever.ts calls generateEmbedding() from rag/embeddings.ts
   ↓
10. embeddings.ts uses openai.ts to generate embedding
   ↓
11. retriever.ts calls queryVectors() from rag/vector-store.ts
   ↓
12. vector-store.ts queries Pinecone
   ↓
13. retriever.ts returns chunks to chat-handler.ts
   ↓
14. chat-handler.ts builds prompt and calls openai.ts
   ↓
15. openai.ts returns answer to chat-handler.ts
   ↓
16. chat-handler.ts returns response to route.ts
   ↓
17. route.ts saves messages using manager.ts
   ↓
18. route.ts returns JSON to frontend
   ↓
19. useChat.ts updates messages state
   ↓
20. ChatInterface.tsx re-renders with new message
```

---

##  Key Concepts Explained

### **RAG (Retrieval Augmented Generation)**

**Problem**: AI models don't know our PDF content.

**Solution**: RAG
1. **Retrieve**: Find relevant chunks from PDF
2. **Augment**: Add chunks to the prompt
3. **Generate**: AI uses chunks to answer

**Analogy**: Like giving a student a textbook before an exam instead of asking them to recall everything.

### **Embeddings**

**What**: Numbers that represent text meaning.

**Example**:
- "constitution" → `[0.1, -0.3, 0.7, ...]`
- "supreme law" → `[0.12, -0.28, 0.68, ...]` (similar numbers = similar meaning)

**Why**: Can't search text directly, but can search by similarity of numbers.

### **Vector Database (Pinecone)**

**What**: Database optimized for storing and searching vectors.

**Why**: 
- Traditional DB: "Find documents with word 'constitution'"
- Vector DB: "Find documents similar in meaning to 'constitution'"

**Your Use**: Stores all PDF chunks as vectors, searches by similarity.

### **Sessions (Redis)**

**What**: Conversation memory.

**Why**: 
- Without sessions: Each message is independent ("What did I just ask?")
- With sessions: AI remembers context ("You asked about contracts, here's more...")

**Storage**: Redis stores `sessionId → { messages: [...] }`

---

##  How to Extend This Project

### **Add New Features**

1. **Add a new page**:
   - Create `src/app/new-page/page.tsx`
   - Add link in `src/app/page.tsx`

2. **Add a new API endpoint**:
   - Create `src/app/api/new-endpoint/route.ts`
   - Export `GET` or `POST` function

3. **Add a new component**:
   - Create `src/components/new-component.tsx`
   - Import and use in pages

4. **Modify RAG behavior**:
   - Edit `src/config/rag.config.ts` (chunk size, topK, etc.)

5. **Change AI model**:
   - Edit `src/config/ai.config.ts` (model, temperature)

---

##  Summary

**Your project structure:**

1. **Frontend** (`/src/app`, `/src/components`) - What users see
2. **Backend** (`/src/app/api`) - Handles requests
3. **Business Logic** (`/src/lib`) - Core functionality
4. **Configuration** (`/src/config`) - Settings
5. **Types** (`/src/types`) - TypeScript definitions
6. **Hooks** (`/src/hooks`) - Reusable React logic

**Data Flow:**
```
User → Frontend → API → RAG → OpenAI → Response → Frontend → User
```

**Key Technologies:**
- Next.js: Framework
- OpenAI: AI models
- Pinecone: Vector search
- Redis: Session storage
- TypeScript: Type safety
