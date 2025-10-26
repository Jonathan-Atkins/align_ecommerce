import Image from "next/image";
import Link from "next/link";
import React from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Mission", href: "/our-mission" },
  { name: "Why Align", href: "/why-align" },
  { name: "Referral Program", href: "/referral-program" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  return (
    <>
      {/* Top Info Bar */}
      <div className="w-full bg-[#7C8F5A]/90 text-white text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
          {/* Left: Email and Phone */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:support@alignecommerce.com"
              className="flex items-center gap-2 hover:underline"
            >
              <span className="bg-white rounded-full p-1 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#7C8F5A]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <rect
                    width="20"
                    height="16"
                    x="2"
                    y="4"
                    rx="2"
                    stroke="currentColor"
                  />
                  <path d="M22 6 12 13 2 6" stroke="currentColor" />
                </svg>
              </span>
              support@alignecommerce.com
            </a>
            <a
              href="tel:+17029001030"
              className="flex items-center gap-2 hover:underline"
            >
              <span className="bg-white rounded-full p-1 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#7C8F5A]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.29a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.06.35 2.16.59 3.29.72A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              (702) 900-1030
            </a>
          </div>
          {/* Right: Instagram */}
          <a
            href="https://www.instagram.com/alignecommerce/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
            aria-label="Instagram"
          >
            <span className="rounded-full p-1 flex items-center justify-center" style={{ background: 'transparent' }}>
              <Image
                src="/01 Static Glyph/01 Gradient Glyph/Instagram_Glyph_Gradient.svg"
                alt="Instagram"
                width={28}
                height={28}
                style={{ display: "block" }}
              />
            </span>
          </a>
        </div>
      </div>
      {/* Navbar */}
      <nav className="w-full bg-white border-b-4 border-[#7C8F5A] px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/big_align_logo.png"
              alt="Align ecommerce logo"
              width={392}
              height={178}
              priority
            />
          </Link>
        </div>
        {/* Nav Links */}
        <div className="hidden md:flex items-center">
          {navLinks.map((link, idx) => (
            <React.Fragment key={link.name}>
              <Link
                href={link.href}
                className={`px-6 text-sm font-semibold transition-colors uppercase whitespace-nowrap ${
                  link.name === "Home"
                    ? "text-[#A6C07A]"
                    : "text-black hover:text-[#A6C07A]"
                }`}
              >
                {link.name}
              </Link>
              {idx < navLinks.length - 1 && (
                <div className="h-6 w-px bg-[#E6EDD6]" />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Contact Button */}
        <Link
          href="/contact"
          className="ml-8 bg-[#7C8F5A] hover:bg-[#6B7C4B] transition-colors text-white text-lg font-semibold px-12 py-2 rounded-full flex items-center"
        >
          CONTACT
          <span className="ml-3 text-2xl font-bold">&#8250;</span>
        </Link>
      </nav>
    </>
  );
}
