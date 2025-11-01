import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatBox from "./components/ChatBox";
import CameraView from "./components/CameraView";
import SidebarMenu from "./components/SidebarMenu";

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800">
      {!started ? (
        <WelcomeScreen onStart={() => setStarted(true)} />
      ) : (
        <div className="flex flex-col md:flex-row h-screen">
          {/* Sidebar */}
          <SidebarMenu />

          {/* Main Section */}
          <div className="flex flex-col flex-1 items-center justify-center p-6 space-y-6 overflow-y-auto">
            <h1 className="text-3xl font-semibold text-blue-600 mb-4">
              ROZ – Your AI Companion
            </h1>

            {/* Camera View */}
            <CameraView />

            {/* Chat Box */}
            <ChatBox />
          </div>
        </div>
      )}
    </div>
  );
}
