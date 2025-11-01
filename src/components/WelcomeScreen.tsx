import React from "react";

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
      <h1 className="text-5xl font-bold text-blue-600 mb-4">Welcome to ROZ</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your intelligent AI companion for chat, vision, and more.
      </p>
      <button
        onClick={onStart}
        className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
      >
        Start Assistant
      </button>
    </div>
  );
}
