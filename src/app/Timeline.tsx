import React from "react";

export default function Timeline() {
  return (
    <section
      className="w-full py-16 px-4 flex flex-col items-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #0B132B 0%, #1B3A2D 100%)',
        minHeight: '60vh',
      }}
    >
      <h2 className="text-5xl font-bold text-center text-gray-900 dark:text-white font-[Montserrat]">
        What Align Offers
      </h2>
      {/* Add your timeline content here */}
    </section>
  );
}
