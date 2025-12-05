"use client";
import React from "react";
import ContactUs from "../components/ContactUs";

export default function SolutionsPage() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center" style={{ background: 'none' }}>
      <div className="flex flex-col items-center justify-center text-center px-8 py-16 max-w-5xl mx-auto">
        <div className="title-wrap" style={{ marginBottom: '2.5rem' }}>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ marginLeft: '2px', color: 'white' }}>
            Value proposition statement<br />
            combined with a <span className="glow-word">soft sales pitch</span>
          </h1>
          <div className="horizontal-line" aria-hidden="true" />
        </div>
      </div>
      {/* Custom Payment Solutions Section */}
      <section className="w-full flex flex-col items-center justify-center px-4 py-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8" style={{letterSpacing: '-0.02em'}}>
          <span style={{ color: '#A6C07A' }}>Custom</span>{' '}
          <span style={{ color: 'white' }}>Payment Solutions</span>
        </h2>
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-16 justify-center items-stretch">
          {/* Retail Column */}
          <div className="flex-1 bg-black/80 rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <h3 className="text-3xl font-bold text-white mb-4">Retail</h3>
            <ul className="text-lg text-white mb-6 list-disc list-inside">
              <li>Cloud based</li>
              <li>Inventory management</li>
              <li>Pay at the table</li>
            </ul>
            {/* Placeholder for retail image */}
            <div className="w-full flex justify-center items-center" style={{height: 180}}>
              <div className="bg-gray-700 rounded-lg" style={{width: 140, height: 140, opacity: 0.3}} />
            </div>
          </div>
          {/* Online Column */}
          <div className="flex-1 bg-black/80 rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <h3 className="text-3xl font-bold text-white mb-4">Online</h3>
            <ul className="text-lg text-white mb-6 list-disc list-inside">
              <li>Invoicing</li>
              <li>Subscription management</li>
              <li>Shopping cart integrations</li>
            </ul>
            {/* Placeholder for online image */}
            <div className="w-full flex justify-center items-center" style={{height: 180}}>
              <div className="bg-gray-700 rounded-lg" style={{width: 140, height: 140, opacity: 0.3}} />
            </div>
          </div>
        </div>
      </section>
      <ContactUs />
    </main>
  );
}
