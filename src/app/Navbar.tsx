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
  "group relative font-medium tracking-wide text-neutral-700 transition-colors duration-200",
  "after:pointer-events-none after:absolute after:content-[''] after:left-1/2 after:h-[3px] after:w-3/5",
  "after:-bottom-1 md:after:-bottom-2",
  "after:-translate-x-1/2 after:rounded-full after:bg-white after:opacity-0 after:scale-x-50",
  "after:shadow-[0_2px_8px_rgba(0,0,0,0.12)] after:transition-all after:duration-300 after:ease-out",
  "group-hover:text-neutral-900 group-hover:after:opacity-100 group-hover:after:scale-x-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-align-green focus-visible:ring-offset-2",
].join(" ");

const activeLinkStyles = [
  "text-align-green",
  "after:opacity-100 after:scale-x-100",
  "group-hover:text-align-green",
].join(" ");

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10 md:py-5">
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
        {/* Desktop Navigation */}
        <div className="hidden items-center text-neutral-700 md:flex">
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
                className={`${baseLinkStyles} inline-flex items-center justify-center px-5 py-1 text-sm ${
                  index !== 0 ? "border-l border-neutral-200" : ""
                } ${isActive ? activeLinkStyles : ""}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
        {/* Mobile Toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors duration-200 hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-align-green focus-visible:ring-offset-2 md:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {isMobileMenuOpen ? (
              <path d="M6 6L18 18M18 6L6 18" />
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
        {/* CTA Button */}
        <div className="hidden items-center md:flex">
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
      <div
        id="primary-navigation"
        className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mx-4 mt-2 rounded-3xl border border-neutral-200 bg-white shadow-lg transition-opacity duration-200">
          <div className="flex flex-col divide-y divide-neutral-200">
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
                  className={`${baseLinkStyles} flex items-center justify-between px-6 py-3 text-base after:-bottom-1 ${
                    isActive ? activeLinkStyles : ""
                  }`}
                >
                  <span>{link.name}</span>
                  <span
                    aria-hidden
                    className={`text-sm transition-transform duration-200 ${
                      isMobileMenuOpen ? "translate-x-0" : "translate-x-1"
                    }`}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="px-6 py-4">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6D8C3B] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-[#5f7a31]"
            >
              Contact
              <span aria-hidden className="text-base font-normal">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
