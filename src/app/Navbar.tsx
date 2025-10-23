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
  "group relative text-sm font-medium transition-colors duration-200",
  "after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full",
  "after:origin-left after:scale-x-0 after:rounded-full after:bg-align-green",
  "after:opacity-0 after:transition after:duration-300 after:ease-out",
  "group-hover:after:scale-x-100 group-hover:after:opacity-100",
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
                  ? "text-align-green after:scale-x-100 after:opacity-100"
                  : "text-white hover:text-align-green"
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
