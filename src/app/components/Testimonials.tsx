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
              const el = document.getElementById('contact-us');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
              e.currentTarget.classList.add('clicked');
              setTimeout(() => {
                e.currentTarget.classList.remove('clicked');
              }, 350);
            }}
        >
          Get in Touch
        </button>
      </div>
        {/* ...existing code... */}
    </section>
  );
}
