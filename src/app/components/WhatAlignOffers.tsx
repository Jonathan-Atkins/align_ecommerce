import React from "react";
import AlignSlideshow from "./AlignSlideshow";

export default function WhatAlignOffers() {
  return (
    <section className="w-full flex justify-center py-12 px-2">
      <div className="w-full max-w-5xl bg-black rounded-3xl shadow-lg p-6 md:p-12 flex flex-col items-center" style={{ minHeight: 320 }}>
        <div className="title-wrap mb-1 w-full flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white">What Align Offers</h1>
          <div className="horizontal-line" aria-hidden="true" />
        </div>
        <div className="w-full flex justify-center mt-12">
          <AlignSlideshow />
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 700px) {
          .max-w-5xl {
            max-width: 98vw !important;
          }
          .title-wrap h1 {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
