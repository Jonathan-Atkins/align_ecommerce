import React from "react";

// SVG logo for Align
const AlignLogo = () => (
  <div className="flex items-center space-x-2">
    <svg viewBox="0 0 40 40" width={40} height={40} className="inline-block">
      <polygon points="8,32 20,8 32,32" fill="#9BC53D" />
      <rect x="12" y="24" width="16" height="8" rx="2" fill="#fff" />
    </svg>
    <div className="flex flex-col leading-tight">
      <span className="text-2xl font-bold text-white">ALIGN</span>
      <span className="text-xs text-align-green tracking-wide">ecommerce</span>
    </div>
  </div>
);

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
        <AlignLogo />
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
