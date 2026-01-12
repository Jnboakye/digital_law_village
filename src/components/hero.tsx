"use client";
import Link from "next/link";
import FeatureCard from "@/components/featureCard";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 text-white">
      {/* Background overlay pattern with scales of justice */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
      
      {/* GitHub Link - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <a
          href="https://github.com/Jnboakye/Digital_law_village"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
        >
          <svg
            className="w-5 h-5 fill-current group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="text-sm font-medium hidden sm:inline">View Source</span>
        </a>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-full p-4 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          Digital Law Bot
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed">
          Your intelligent legal learning companion powered by Digital Law Village
        </p>
        <p className="text-base md:text-lg text-amber-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Master law concepts, prepare for exams, and excel in your legal studies with AI-powered guidance.
        </p>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-16">
          <Link
            href="/chat"
            className="px-8 py-4 rounded-full text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            💬 Start Text Chat
          </Link>
          <Link
            href="/voice"
            className="px-8 py-4 rounded-full text-lg font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🎤 Start Voice Chat
          </Link>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 blur opacity-60 group-hover:opacity-80 transition" />
            <div className="relative rounded-xl bg-white/10 backdrop-blur-lg shadow-xl p-6 border border-white/20">
              <FeatureCard
                iconColor="from-amber-400 to-amber-500"
                title="24/7 Study Partner"
                description="Always available to assist with your law studies"
                iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 blur opacity-60 group-hover:opacity-80 transition" />
            <div className="relative rounded-xl bg-white/10 backdrop-blur-lg shadow-xl p-6 border border-white/20">
              <FeatureCard
                iconColor="from-indigo-400 to-purple-400"
                title="Natural Dialogue"
                description="Conversational learning like speaking with a professor"
                iconPath="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-slate-400 via-gray-400 to-slate-500 blur opacity-60 group-hover:opacity-80 transition" />
            <div className="relative rounded-xl bg-white/10 backdrop-blur-lg shadow-xl p-6 border border-white/20">
              <FeatureCard
                iconColor="from-slate-400 to-gray-400"
                title="Instant Legal Insight"
                description="Get immediate answers to complex legal questions"
                iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}