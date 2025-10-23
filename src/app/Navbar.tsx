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

const baseLinkStyles = [
  "group relative px-5 py-1 text-sm font-medium tracking-wide text-neutral-700 transition-colors duration-200",
  "after:pointer-events-none after:absolute after:content-[''] after:-bottom-2 after:left-1/2 after:h-[3px] after:w-3/5",
  "after:-translate-x-1/2 after:rounded-full after:bg-white after:opacity-0 after:scale-x-50",
  "after:shadow-[0_2px_8px_rgba(0,0,0,0.12)] after:transition-all after:duration-300 after:ease-out",
  "group-hover:text-neutral-900 group-hover:after:opacity-100 group-hover:after:scale-x-100",
].join(" ");

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-10 py-5">
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
        <div className="hidden md:flex items-center text-neutral-700">
          {navLinks.map((link, index) => {
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
                  index !== 0 ? "border-l border-neutral-200" : ""
                } ${
                  isActive
                    ? [
                        "text-align-green",
                        "after:opacity-100 after:scale-x-100",
                        "group-hover:text-align-green",
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
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#6D8C3B] px-8 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-[#5f7a31]"
          >
            Contact
            <span aria-hidden className="text-base font-normal">
              →
            </span>
          </Link>
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
