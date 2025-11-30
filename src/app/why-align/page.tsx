"use client";


import React from "react";
import Slider from "../../components/Slider";


export default function Page() {
  return (
    <main
      className="w-full min-h-screen flex flex-col items-center justify-start"
      style={{ background: 'linear-gradient(90deg, #0B132B 0%, #1B3A2D 100%)' }}
    >
      {/* NOTE: 60px margin below navbar. Adjust as needed. */}
      <div style={{ marginTop: "60px" }} />
      <Slider>
        {/* Inject your slides/content and navigation controls here */}
      </Slider>
      {/* No components below the slider as requested */}
    </main>
  );
}
