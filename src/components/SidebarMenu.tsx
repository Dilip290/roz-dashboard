import React from "react";

export default function SidebarMenu() {
  const modes = ["Family Mode", "Farm Mode", "Surveillance Mode"];

  return (
    <div className="w-full md:w-64 bg-white shadow-lg flex md:flex-col justify-around md:justify-start items-center p-4 md:space-y-4 border-r border-gray-200">
      {modes.map((mode) => (
        <button
          key={mode}
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium w-full md:w-auto transition-all"
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
