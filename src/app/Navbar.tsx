"use client";

// ...existing code...
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useLayoutEffect, useCallback } from "react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Mission", href: "/our-mission" },
    { name: "Why Align", href: "/why-align" },
    { name: "Referral Program", href: "/referral-program" },
    { name: "Blog", href: "/blog" },
];

// We'll determine compact mode by measuring elements at runtime so the nav
// collapses exactly when the links no longer fit next to the logo/CTA.

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [isCompact, setIsCompact] = useState<boolean>(false);

    // Refs to measure actual element sizes
    const navRef = useRef<HTMLElement | null>(null);
    const logoRef = useRef<HTMLDivElement | null>(null);
    const linksRef = useRef<HTMLDivElement | null>(null);
    // We'll attach to a wrapper div around the Link so we can reliably measure
    const ctaRef = useRef<HTMLDivElement | null>(null);
    // Ref for the first nav link
    const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

    // ...existing code...

    // Evaluate whether the nav should be compact by measuring widths.
    // If the total width required by the links is greater than the available
    // space between logo and CTA, enable compact mode.
    const MIN_GAP = 10; // px, strict minimum gap between logo and first nav link
    const evaluateCompact = useCallback(() => {
        const nav = navRef.current;
        const logo = logoRef.current;
        const links = linksRef.current;
        const cta = ctaRef.current;
        const firstLink = firstLinkRef.current;
        // If any element is missing, optimistically revert to non-compact to allow DOM to update
        if (!nav || !logo || !links || !firstLink) {
            setIsCompact(false);
            return;
        }

        const navRect = nav.getBoundingClientRect();
        const logoRect = logo.getBoundingClientRect();
        const ctaWidth = cta ? cta.getBoundingClientRect().width : 0;
        const linksNeeded = links.scrollWidth;
        const logoRight = logoRect.right - navRect.left;
        const availableForLinks = navRect.width - logoRight - ctaWidth - 16;

    // Enforce a strict minimum gap between logo and first link
    const firstLinkRect = firstLink.getBoundingClientRect();
    const firstLinkLeft = firstLinkRect.left - navRect.left;
    const gap = firstLinkLeft - logoRight;
    const isOverlap = gap < MIN_GAP;

        // If logo or firstLink have zero width/position, optimistically revert to non-compact
        if (logoRect.width === 0 || firstLinkRect.width === 0) {
            setIsCompact(false);
            return;
        }

        const shouldCompact = isOverlap || linksNeeded > availableForLinks;
        setIsCompact((prev) => {
            if (prev === shouldCompact) return prev;
            if (!shouldCompact) setOpen(false);
            return shouldCompact;
        });
        // ...existing code...
    }, []);

    useLayoutEffect(() => {
        // initial measure after layout
        evaluateCompact();

        // watch for resizes on the nav/links and window resizes
        const ro = new ResizeObserver(() => evaluateCompact());
        if (navRef.current) ro.observe(navRef.current);
        if (logoRef.current) ro.observe(logoRef.current);
        if (linksRef.current) ro.observe(linksRef.current);
        if (ctaRef.current) ro.observe(ctaRef.current);

        let raf = 0;
        const onResize = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(evaluateCompact);
        };
        window.addEventListener("resize", onResize);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(raf);
        };
    }, [evaluateCompact]);

    // Ensure compact mode can revert: re-measure after DOM updates when isCompact changes
    React.useEffect(() => {
        // Only run if coming out of compact (links become visible)
        if (!isCompact) {
            // Wait for refs to attach, then re-measure
            const id = setTimeout(() => {
                evaluateCompact();
            }, 0);
            return () => clearTimeout(id);
        }
    }, [isCompact, evaluateCompact]);

    return (
        <>
            {/* Top Info Bar */}
            <div className="w-full bg-[#A6C07A] text-white text-sm">
                <div className="w-full flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 py-2">
                    {/* Left: Email and Phone */}
                    <div className="flex items-center gap-6">
                        <a
                            href="mailto:support@alignecommerce.com"
                            className="flex items-center gap-2 hover:underline"
                            aria-label="Email"
                        >
                            <span className="bg-white rounded-full p-1 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-[#7C8F5A]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <rect
                                        width="20"
                                        height="16"
                                        x="2"
                                        y="4"
                                        rx="2"
                                        stroke="currentColor"
                                    />
                                    <path d="M22 6 12 13 2 6" stroke="currentColor" />
                                </svg>
                            </span>
                            {/* hide text on compact */}
                            {!isCompact && <span>support@alignecommerce.com</span>}
                        </a>
                        <a
                            href="tel:+17029001030"
                            className="flex items-center gap-2 hover:underline"
                            aria-label="Phone"
                        >
                            <span className="bg-white rounded-full p-1 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-[#7C8F5A]"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M3 5a2 2 0 012-2h2.2a1 1 0 01.98.8l.44 2.73a1 1 0 01-.27.86l-1.2 1.2a15.05 15.05 0 006.59 6.59l1.2-1.2a1 1 0 01.86-.27l2.73.44a1 1 0 01.8.98V19a2 2 0 01-2 2A17 17 0 013 5z" />
                                </svg>
                            </span>
                            {/* hide phone text on compact */}
                            {!isCompact && <span>(702) 900-1030</span>}
                        </a>
                    </div>
                    {/* Right: Instagram */}
                    <a
                        href="https://www.instagram.com/alignecommerce/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        aria-label="Instagram"
                    >
                        {/* hide text on compact — show only icon */}
                        {!isCompact && <span className="text-white text-sm mr-1">Follow us for more</span>}
                        <span className="rounded-full p-1 flex items-center justify-center" style={{ background: 'transparent' }}>
                            <Image
                                src="/01 Static Glyph/01 Gradient Glyph/Instagram_Glyph_Gradient.svg"
                                alt="Instagram"
                                width={28}
                                height={28}
                                style={{ display: "block" }}
                            />
                        </span>
                    </a>
                </div>
            </div>

            {/* Navbar */}
            <nav ref={navRef} className="relative w-full bg-white border-b-4 border-[#7C8F5A] px-2 sm:px-4 md:px-8 py-4 flex items-center justify-between">
                {/* Hamburger (shown when compact) */}
                {/* (hamburger moved to right-side control container below) */}

                {/* Logo: centered when compact, in-flow (left) otherwise */}
                <div
                    ref={logoRef}
                    className={
                        isCompact
                            ? "absolute left-1/2 transform -translate-x-1/2 h-10 sm:h-14 md:h-16 lg:h-20 flex items-center z-20"
                            : "flex items-center min-w-0 h-10 sm:h-14 md:h-16 lg:h-20"
                    }
                >
                    <Link href="/" className="flex items-center min-w-0">
                        <div className="h-full flex items-center">
                            <Image
                                src="/align_logo.png"
                                alt="Align ecommerce logo"
                                width={isCompact ? 120 : 220}
                                height={isCompact ? 73 : 134}
                                priority
                                className={
                                    'h-full w-auto object-contain block ' +
                                    (isCompact
                                        ? 'max-w-[60px] sm:max-w-[80px] md:max-w-[100px]'
                                        : 'max-w-[140px] sm:max-w-[180px] md:max-w-[220px]')
                                }
                            />
                        </div>
                    </Link>
                </div>

                {/* Nav Links (hidden in compact mode) */}
                {!isCompact ? (
                    <div ref={linksRef} className="flex items-center overflow-x-auto whitespace-nowrap gap-2 md:gap-0 md:flex md:overflow-visible">
                        {navLinks.map((link, idx) => (
                            <React.Fragment key={link.name}>
                                <Link
                                    ref={idx === 0 ? firstLinkRef : undefined}
                                    href={link.href}
                                    className={`px-3 text-[14px] font-semibold transition-colors uppercase whitespace-nowrap ${
                                        link.name === "Home"
                                            ? "text-[#A6C07A]"
                                            : "text-black hover:text-[#A6C07A]"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                                {idx < navLinks.length - 1 && (
                                    <div className="h-6 w-px bg-[#E6EDD6]" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    // placeholder to keep layout spacing when compact: empty flex item to the left of hamburger
                    <div className="flex-1" />
                )}

                {/* Contact Button (visible when not compact) */}
                {/* RIGHT-anchored dropdown when compact + open */}
                <div className="relative z-30">
                    {!isCompact ? (
                        <div ref={ctaRef} className="ml-4">
                            <Link
                                href="/contact"
                                className="bg-[#A6C07A] hover:bg-[#7C8F5A] transition-colors text-white text-[15px] font-semibold px-3 py-1 rounded-full flex items-center whitespace-nowrap"
                            >
                                <span className="inline-block">LETS CONNECT</span>
                                <span className="ml-2 text-lg font-bold">&#8250;</span>
                            </Link>
                        </div>
                    ) : (
                        <button
                            onClick={() => setOpen((s) => !s)}
                            aria-expanded={open}
                            aria-label="Toggle menu"
                            className="ml-4 group"
                        >
                            <span className="sr-only">Menu</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-white p-2 hover:bg-slate-200 transition">
                                <div className="space-y-2">
                                    <span
                                        className={
                                            "block h-1 rounded-full bg-slate-500 transition-transform ease-in-out " +
                                            (open ? " translate-y-1 rotate-45 w-10" : " w-10")
                                        }
                                    />
                                    <span
                                        className={
                                            "block h-1 rounded-full bg-orange-500 transition-transform ease-in-out " +
                                            (open ? " w-10 -translate-y-1 -rotate-45" : " w-8")
                                        }
                                    />
                                </div>
                            </div>
                        </button>
                     )}
 
                     {/* RIGHT-anchored dropdown when compact + open */}
                     {isCompact && open && (
                         <div className="absolute top-full right-0 mt-2 w-64 bg-white border shadow-md z-40 rounded-md origin-top-right">
                             <nav className="flex flex-col px-2 py-3 gap-1">
                                 {navLinks.map((link) => (
                                     <Link
                                         key={link.name}
                                         href={link.href}
                                         onClick={() => setOpen(false)}
                                         className="block w-full text-left px-3 py-3 font-semibold uppercase text-black hover:text-[#A6C07A]"
                                     >
                                         {link.name}
                                     </Link>
                                 ))}
                             </nav>
                         </div>
                     )}
                 </div>
            </nav>
        </>
    );
}
