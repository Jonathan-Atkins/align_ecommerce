"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Mission", href: "/mission" },
  { name: "Why Align", href: "/why-align" },
  { name: "Referral Program", href: "/referral" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-[color:var(--bg)] px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.name}>
              <Link
                href={link.href}
                className={`text-base px-4 ${
                  link.name === "Home"
                    ? "text-[#95B75D]"
                    : "text-black dark:text-[color:var(--text)] hover:text-[#95B75D] dark:hover:text-[#95B75D] transition-colors"
                }`}
              >
                {link.name}
              </Link>
              {index < navLinks.length - 1 && (
                <div className="h-4 w-[1px] bg-gray-300 dark:bg-[color:var(--nav-divider)]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block py-2 px-4 text-base hover:bg-gray-100 dark:hover:bg-[color:var(--card)] dark:text-[color:var(--text)]"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
