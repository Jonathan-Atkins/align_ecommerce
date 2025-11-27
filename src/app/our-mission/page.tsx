"use client";

import React from "react";
import MissionHighlight from "../components/MissionHighlight";

export default function OurMissionPage() {
  return (
    <main
      className="w-full min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(90deg, #0B132B 0%, #1B3A2D 100%)' }}
    >
      <div className="text-center text-white p-8 py-16 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">Our Mission</h1>
      </div>
      <MissionHighlight />
    </main>
  );
}
