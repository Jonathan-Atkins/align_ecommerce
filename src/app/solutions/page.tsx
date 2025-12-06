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

      {/* Skeletons for Subscription payment management & E-invoicing */}
      <section className="w-full flex flex-col gap-10 items-center justify-center px-4 py-8">
        {/* Subscription payment management */}
        <div className="w-full bg-white rounded-2xl shadow p-2 md:p-8 flex flex-col md:flex-row items-stretch gap-2 md:gap-8">
          <div className="w-full md:w-1/2 flex items-center justify-center mb-2 md:mb-0">
            {/* Actual image for Subscription payment management */}
            <div className="w-full max-w-xs h-40 md:h-84 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden mx-auto">
              <img
                src="/subscriptionManagement.png"
                alt="Subscription payment management"
                className="object-contain w-full h-full"
                style={{ maxWidth: '320px', maxHeight: '220px' }}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <div className="flex flex-col w-full items-center md:items-start">
              <h2 className="w-full text-lg md:text-4xl font-bold mb-1 md:mb-4 break-words whitespace-pre-line text-center md:text-left px-4" style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                Subscription payment management
              </h2>
              <p className="w-full text-xs md:text-lg text-gray-700 leading-tight md:leading-relaxed break-words whitespace-pre-line text-center md:text-left px-4" style={{wordBreak: 'break-word', overflowWrap: 'break-word', width: '100%'}}>
                Lorem ipsum dolor sit amet consectetur. Tortor nulla pulvinar consectetur viverra id cursus. Phasellus quam a ipsum odio facilisis eleifend vestibulum velit. Eu at porttitor sit vitae etiam aenean. Vitae egestas imperdiet tristique nam sit pharetra accumsan varius sagittis. Lorem ipsum dolor sit amet consectetur. Tortor nulla pulvinar consectetur viverra id cursus. Phasellus quam a ipsum odio facilisis eleifend vestibulum velit. Eu at porttitor sit vitae etiam aenean.
              </p>
            </div>
          </div>
        </div>
        {/* E-invoicing */}
        <div className="w-full bg-white rounded-2xl shadow p-2 md:p-8 flex flex-col md:flex-row items-stretch gap-2 md:gap-8">
          <div className="w-full md:w-1/2 flex items-center justify-center mb-2 md:mb-0">
            {/* Actual image for E-invoicing */}
            <div className="w-full max-w-xs h-40 md:h-84 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden mx-auto">
              <img
                src="/einvoicing.png"
                alt="E-invoicing"
                className="object-contain w-full h-full"
                style={{ maxWidth: '320px', maxHeight: '220px' }}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <div className="flex flex-col w-full items-center md:items-start">
              <h2 className="w-full text-lg md:text-4xl font-bold mb-1 md:mb-4 break-words whitespace-pre-line text-center md:text-left px-4" style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                E-invoicing
              </h2>
              <p className="w-full text-xs md:text-lg text-gray-700 leading-tight md:leading-relaxed break-words whitespace-pre-line text-center md:text-left px-4" style={{wordBreak: 'break-word', overflowWrap: 'break-word', width: '100%'}}>
                Lorem ipsum dolore sit amet consectetur. Tortor nulla pulvinar consectetur viverra id cursus. Phasellus quam a ipsum odio facilisis eleifend vestibulum velit. Eu at porttitor sit vitae etiam aenean. Vitae egestas imperdiet tristique nam sit pharetra accumsan varius sagittis. Lorem ipsum dolor sit amet consectetur. Tortor nulla pulvinar consectetur viverra id cursus. Phasellus quam a ipsum odio facilisis eleifend vestibulum velit. Eu at porttitor sit vitae etiam aenean.
              </p>
            </div>
          </div>
        </div>
      </section>

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
          </div>
          {/* Online Column */}
          <div className="flex-1 bg-black/80 rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <h3 className="text-3xl font-bold text-white mb-4">Online</h3>
            <ul className="text-lg text-white mb-6 list-disc list-inside">
              <li>Invoicing</li>
              <li>Subscription management</li>
              <li>Shopping cart integrations</li>
            </ul>
          </div>
        </div>
      </section>
      <ContactUs />
    </main>
  );
}
