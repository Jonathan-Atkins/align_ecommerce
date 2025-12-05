import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'David O.',
    role: 'Online Retailer',
    avatar: '/avatar1.png',
    text: `We switched to Align Ecommerce after losing thousands to chargebacks and poor support. Within weeks, their team recovered lost revenue and streamlined our entire payment system. Best decision we’ve made for our business!`,
  },
  {
    name: 'Sarah L.',
    role: 'Shop Owner',
    avatar: '/avatar2.png',
    text: `Align Ecommerce made payments easy and secure for my shop. Their support is top-notch and I’ve seen a real difference in my bottom line!`,
  },
  // Add more testimonials as needed
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 700);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function Testimonials() {
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);

  // For desktop, show two cards at a time
  const getVisibleTestimonials = () => {
    if (isMobile) {
      return [testimonials[index]];
    } else {
      // Show two cards, wrap around if needed
      const secondIndex = (index + 1) % testimonials.length;
      return [testimonials[index], testimonials[secondIndex]];
    }
  };

  const prev = () => {
    setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  };
  const next = () => {
    setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  };

  return (
    <section className={styles.testimonialsSection}>
      <h1 className={styles.header}>Testimonials</h1>
      <div className={styles.carouselWrapper}>
        <div className={styles.cardsRow}>
          {getVisibleTestimonials().map((t, idx) => (
            <div className={styles.card} key={t.name + idx}>
              <div className={styles.avatarRow}>
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={56}
                  height={56}
                  className={styles.avatar}
                />
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                </div>
              </div>
              <div className={styles.text}>{t.text}</div>
            </div>
          ))}
        </div>
        <div className={styles.navRow}>
          <button className={styles.arrow} onClick={prev} aria-label="Previous testimonial">←</button>
          <button className={styles.arrow} onClick={next} aria-label="Next testimonial">→</button>
        </div>
      </div>
      <div className={styles.ctaBox}>
        <div className={styles.ctaText}>Start your free cost savings analysis today</div>
        <div className={styles.ctaSubtext}>No commitment — Just real results.</div>
        <button
          type="button"
          className={styles.ctaButton}
          onClick={e => {
            const el = document.getElementById('get-started-today');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            // Simple click feedback animation
            e.currentTarget.classList.add('clicked');
            setTimeout(() => {
              e.currentTarget.classList.remove('clicked');
            }, 350);
          }}
        >
          Get in Touch
        </button>
      </div>
      {/* Contact Form Section */}
      <div id="get-started-today" className="flex justify-center w-full mt-16 mb-4">
        <div className="flex-1 max-w-md w-full min-w-0">
          <div className="bg-[#1a2233] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 md:p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-100 text-center">Get Started Today!</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Business Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full bg-[#F6A94A] hover:bg-[#e08a1b] text-white font-bold py-3 rounded-lg transition-colors"
              >
                Start Processing Today
              </button>
            </form>
            <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              {/* Already filled out a form? <a href="/auth" className="text-[#7C8F5A] underline">Login</a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
