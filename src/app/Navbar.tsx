"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Payment Solutions", href: "/payment-solutions" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
];

const baseLinkStyles = [
  "group relative text-sm font-medium text-white transition-colors duration-200",
  "before:pointer-events-none before:absolute before:content-[''] before:left-1/2 before:-translate-x-1/2",
  "before:-bottom-2 before:h-[3px] before:w-full before:max-w-[120%]",
  "before:rounded-full before:bg-white/0 before:opacity-0 before:scale-x-50",
  "before:blur-[3px] before:transform before:transition before:duration-300 before:ease-out before:origin-center",
  "group-hover:text-align-green group-hover:before:bg-white/80 group-hover:before:opacity-90",
  "group-hover:before:scale-x-100 group-hover:before:shadow-[0_0_14px_rgba(255,255,255,0.45)] group-hover:before:blur-0",
].join(" ");

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-black border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
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
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`${baseLinkStyles} ${
                isActive
                  ? [
                      "text-align-green",
                      "before:bg-white before:opacity-100 before:scale-x-100",
                      "before:shadow-[0_0_18px_rgba(255,255,255,0.45)] before:blur-[1.5px]",
                    ].join(" ")
                  : ""
              }`}
          >
              {link.name}
            </Link>
          );
        })}
      </div>
      {/* CTA Button */}
      <div className="flex items-center">
        <button className="bg-align-green text-black font-semibold px-6 py-2 rounded-full shadow transition-colors hover:bg-align-green/90">
          Get in Touch
        </button>
      </div>
    </nav>
  );
}
