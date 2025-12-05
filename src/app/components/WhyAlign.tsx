
import React from "react";
import WhatAlignOffers from "./WhatAlignOffers";

export default function WhyAlign() {

  return (
    <>
      <section className="w-full flex justify-center py-10 px-2">
        <div
          className="w-full max-w-5xl flex flex-col items-center rounded-3xl shadow-lg p-4 md:p-10"
          style={{ minHeight: 280, background: 'linear-gradient(135deg, rgba(166,192,122,0.18) 0%, rgba(120,130,140,0.22) 100%)' }}
        >
          <div className="w-full flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
              Why <span className="text-[#A6C07A]">Align</span>?
            </h2>
            <p className="text-white text-base md:text-lg text-center font-extrabold" style={{ fontWeight: 900 }}>
              With Align, you&apos;re not just getting a service; you&apos;re getting a partner. Choosing Align Ecommerce means more than just selecting a payment processor—it&apos;s about customizing your payment solutions to fit the unique needs of your business. We understand that no two businesses are alike, which is why we offer tailored solutions designed to align your merchant processing seamlessly with your specific business goals.
            </p>
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .order-1 {
              order: 1 !important;
            }
            .order-2 {
              order: 2 !important;
            }
          }
        `}</style>
      </section>
      <div className="w-full flex justify-center" style={{ marginTop: 40, marginBottom: 0 }}>
        <WhatAlignOffers />
      </div>
    </>
  );
}
