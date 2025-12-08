import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            ⚖️ AI Digital Law Bot
          </h1>
          <p className="text-xl text-gray-700">
            Your intelligent tutor for Ghanaian law
          </p>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Text Chat</h3>
            <p className="text-gray-600 mb-4">
              Ask questions and get detailed explanations about Ghanaian law concepts, principles, and applications.
            </p>
            <Link
              href="/chat"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Chatting
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold mb-2">Voice Chat</h3>
            <p className="text-gray-600 mb-4">
              Have natural voice conversations with your AI law tutor. Perfect for hands-free learning.
            </p>
            <Link
              href="/voice"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Voice Chat
            </Link>
          </div>
        </div>

        {/* About */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <p>
                <strong>Ask Your Question:</strong> Type or speak your question about Ghanaian law
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <p>
                <strong>AI Retrieves Context:</strong> The system searches through legal documents to find relevant information
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <p>
                <strong>Get Clear Explanations:</strong> Receive educational responses with citations and examples
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <p>
                <strong>Continue Learning:</strong> Ask follow-up questions to deepen your understanding
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}