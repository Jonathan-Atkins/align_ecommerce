"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Mission", href: "/mission" },
  { name: "Why Align", href: "/why-align" },
  { name: "Referral Program", href: "/referral" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white px-8 py-4 flex items-center justify-between">
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
      <div className="hidden md:flex items-center">
        {navLinks.map((link, index) => (
          <React.Fragment key={link.name}>
            <Link
              href={link.href}
              className={`text-base px-4 ${
                link.name === "Home"
                  ? "text-[#95B75D]"
                  : "text-black hover:text-[#95B75D] transition-colors"
              }`}
            >
              {link.name}
            </Link>
            {index < navLinks.length - 1 && (
              <div className="h-4 w-[1px] bg-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Contact Button */}
      <Link
        href="/contact"
        className="bg-[#95B75D] text-white px-8 py-3 rounded-full font-medium hover:bg-[#85A54D] transition-colors flex items-center"
      >
        CONTACT
        <span className="ml-2">›</span>
      </Link>
    </nav>
  );
}
