"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white border-t-[2px] border-[#7C8F5A]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-10 py-5">
        {/* Logo and Divider */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/Align%20ecommerce%20Vector.png"
              alt="Align ecommerce logo"
              width={110}
              height={46}
              priority
            />
          </Link>
          <div className="h-12 w-px bg-[#B7C7A4] mx-6" />
        </div>
        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-0">
          {navLinks.map((link, idx) => (
            <React.Fragment key={link.name}>
              <Link
                href={link.href}
                className={`px-6 text-lg font-semibold transition-colors
                  ${
                    pathname === link.href
                      ? "text-[#A6C07A]"
                      : "text-black hover:text-[#A6C07A]"
                  }
                `}
              >
                {link.name}
              </Link>
              {/* Divider except after last link */}
              {idx < navLinks.length - 1 && (
                <div className="h-6 w-px bg-[#E6EDD6]" />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Contact Button */}
        <Link
          href="/contact"
          className="ml-8 bg-[#7C8F5A] hover:bg-[#6B7C4B] transition-colors text-white text-lg font-semibold px-12 py-4 rounded-full flex items-center"
        >
          CONTACT
          <span className="ml-3 text-2xl font-bold">&#8250;</span>
        </Link>
      </div>
    </nav>
  );
}
