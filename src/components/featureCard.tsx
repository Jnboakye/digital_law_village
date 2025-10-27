import React from "react";

interface FeatureCardProps {
  iconColor: string;      // Tailwind gradient colors, e.g. "from-blue-500 to-cyan-500"
  title: string;          // Card title
  description: string;    // Card description
  iconPath: string;       // SVG path for the icon
}

export default function FeatureCard({
  iconColor,
  title,
  description,
  iconPath,
}: FeatureCardProps) {
  return (
    <div className="text-center">
      <div
        className={`w-12 h-12 bg-gradient-to-r ${iconColor} rounded-xl flex items-center justify-center mx-auto mb-4`}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  );
}
