import React, { useRef, useState } from 'react';
import Image from 'next/image';

const INFO_BOXES = [
  {
    icon: (
      <span className="bg-[#C3E86B] rounded-full flex items-center justify-center" style={{ width: 48, height: 48 }}>
        <Image src="/location.png" alt="Location" width={28} height={28} style={{ objectFit: 'contain', display: 'block' }} />
      </span>
    ),
    label: '9081 W Sahara Ave Ste 270 Las Vegas, NV 89117',
    action: <a href="https://maps.google.com/?q=9081+W+Sahara+Ave+Ste+270+Las+Vegas+NV+89117" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 underline ml-2">Show on Map</a>,
  },
  {
    icon: (
      <span className="bg-[#C3E86B] rounded-full flex items-center justify-center" style={{ width: 48, height: 48 }}>
        <Image src="/email.png" alt="Email" width={28} height={28} style={{ objectFit: 'contain', display: 'block' }} />
      </span>
    ),
    label: 'support@alignecommerce.com',
    action: <a href="mailto:support@alignecommerce.com" className="text-sm text-gray-500 underline ml-2">Send an E-mail</a>,
  },
  {
    icon: (
      <span className="bg-[#C3E86B] rounded-full flex items-center justify-center" style={{ width: 48, height: 48 }}>
        <Image src="/phone.png" alt="Phone" width={28} height={28} style={{ objectFit: 'contain', display: 'block' }} />
      </span>
    ),
    label: '(888) 421-2959',
    action: <a href="tel:8884212959" className="text-sm text-gray-500 underline ml-2">Call Us</a>,
  },
];

function ThankYouPopup({ show }: { show: boolean }) {
  return (
    <div
      className={`fixed left-1/2 bottom-8 z-50 transform -translate-x-1/2 transition-all duration-5 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} pointer-events-none`}
      style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f87171', background: 'black' }}
    >
      Thanks for submitting, we will reach out to you soon!
    </div>
  );
}

export default function ContactUs() {
  const [showPopup, setShowPopup] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
    if (formRef.current) formRef.current.reset();
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <section id="contact-us" className="w-full py-16 px-4 md:px-0 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Info Boxes */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          {INFO_BOXES.map((box, idx) => (
            <div key={idx} className="flex items-center bg-white rounded-2xl shadow p-4">
              <div className="flex-shrink-0 mr-6 flex items-center justify-center" style={{ width: 56, height: 56 }}>
                {box.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-medium text-gray-800">{box.label}</span>
                <span>{box.action}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Contact Form */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl shadow-xl border border-gray-200 p-4 md:p-8" style={{ background: 'rgba(120,130,140,0.25)' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white text-center">Send Us a Message</h2>
            <form className="space-y-4" ref={formRef} onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name *"
                  required
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  required
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                />
              </div>
              <input
                type="email"
                placeholder="Your Email Address *"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
              />
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
              />
              <button
                type="submit"
                className="w-full bg-[#C7F464] hover:bg-[#A6D43A] text-gray-900 font-bold py-3 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <ThankYouPopup show={showPopup} />
      <style jsx>{`
        @media (max-width: 700px) {
          #contact-us > div {
            flex-direction: column;
          }
          #contact-us .flex-1 {
            width: 100%;
            max-width: none;
          }
        }
      `}</style>
    </section>
  );
}
