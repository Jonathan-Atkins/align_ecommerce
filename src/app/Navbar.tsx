import Image from "next/image";
import Link from "next/link";
import React from "react";

const navLinks = [
  { name: "Home", href: "#", active: true },
  { name: "About Us", href: "#" },
  { name: "Payment Solutions", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Contact Us", href: "#" },
];

export default function Navbar() {
  return (
    <>
      {/* Top Bar */}
      <div className="w-full bg-[#7C8F5A] text-white text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
          {/* Left: Email and Phone */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:support@alignecommerce.com"
              className="flex items-center hover:underline"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16v16H4z" stroke="none" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              support@alignecommerce.com
            </a>
            <a
              href="tel:+17029001030"
              className="flex items-center hover:underline"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.29a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.06.35 2.16.59 3.29.72A2 2 0 0 1 22 16.92z" />
              </svg>
              (702) 900-1030
            </a>
          </div>
          {/* Right: Instagram */}
          <div>
            <a
              href="https://www.instagram.com/alignecommerce/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* Navbar */}
      <nav className="w-full bg-black border-b border-zinc-800 px-8 py-4 flex items-center justify-between fixed top-0 left-0 z-50">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/Align%20ecommerce%20Vector.png"
              alt="Align ecommerce logo"
              width={160}
              height={40}
              priority
            />
          </Link>
        </div>
        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={
                link.active
                  ? "text-align-green font-semibold"
                  : "text-white hover:text-align-green transition-colors font-medium"
              }
            >
              {link.name}
            </a>
          ))}
        </div>
        {/* CTA Button */}
        <div className="flex items-center">
          <button className="bg-align-green text-black font-semibold px-6 py-2 rounded-full shadow hover:bg-align-green/90 transition-colors">
            Get in Touch
          </button>
        </div>
      </nav>
    </>
  );
}
