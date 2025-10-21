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
  );
}
