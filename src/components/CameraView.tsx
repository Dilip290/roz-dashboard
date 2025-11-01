import React, { useState, useRef } from "react";

export default function CameraView() {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCamera = async () => {
    if (active) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
      videoRef.current!.srcObject = null;
      setActive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setActive(true);
      }
    } catch {
      alert("Camera access denied or not available.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold text-blue-600 mb-3">Camera Access</h2>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-64 h-48 rounded-lg bg-gray-200 mb-3"
      />
      <button
        onClick={handleCamera}
        className={`px-4 py-2 rounded-lg text-white ${
          active ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {active ? "Stop Camera" : "Activate Camera"}
      </button>
    </div>
  );
}
