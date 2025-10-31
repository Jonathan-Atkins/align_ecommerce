"use client";

// Debug overlay for live measurement display
function DebugNavOverlay({ nav, logo, links, cta, available, needed, compact, logoRight, firstLinkLeft, overlap }) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            fontSize: 13,
            padding: 8,
            borderBottomRightRadius: 8,
            pointerEvents: "none",
            maxWidth: 340,
        }}>
            <div><b>Navbar Debug</b></div>
            <div>nav: {nav?.toFixed(1)}px</div>
            <div>logo: {logo?.toFixed(1)}px</div>
            <div>links: {links?.toFixed(1)}px</div>
            <div>cta: {cta?.toFixed(1)}px</div>
            <div>available: {available?.toFixed(1)}px</div>
            <div>needed: {needed?.toFixed(1)}px</div>
            <div>logoRight: {logoRight?.toFixed(1)}px</div>
            <div>firstLinkLeft: {firstLinkLeft?.toFixed(1)}px</div>
            <div>overlap: <b style={{color: overlap ? '#f66' : '#6f6'}}>{overlap ? 'YES' : 'NO'}</b></div>
            <div>compact: <b style={{color: compact ? '#f66' : '#6f6'}}>{compact ? 'YES' : 'NO'}</b></div>
        </div>
    );
}
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

    // Debug state for overlay
    const [debug, setDebug] = useState({
        nav: 0,
        logo: 0,
        links: 0,
        cta: 0,
        available: 0,
        needed: 0,
        compact: false,
        logoRight: 0,
        firstLinkLeft: 0,
        overlap: false,
    });

    // Evaluate whether the nav should be compact by measuring widths.
    // If the total width required by the links is greater than the available
    // space between logo and CTA, enable compact mode.
    const evaluateCompact = useCallback(() => {
        const nav = navRef.current;
        const logo = logoRef.current;
        const links = linksRef.current;
        const cta = ctaRef.current;
        const firstLink = firstLinkRef.current;
        // If any element is missing, optimistically revert to non-compact to allow DOM to update
        if (!nav || !logo || !links || !firstLink) {
            setIsCompact(false);
            setDebug((d) => ({ ...d, nav: 0, logo: 0, links: 0, cta: 0, available: 0, needed: 0, logoRight: 0, firstLinkLeft: 0, overlap: false, compact: false }));
            return;
        }

        const navRect = nav.getBoundingClientRect();
        const logoRect = logo.getBoundingClientRect();
        const ctaWidth = cta ? cta.getBoundingClientRect().width : 0;
        const linksNeeded = links.scrollWidth;
        const logoRight = logoRect.right - navRect.left;
        const availableForLinks = navRect.width - logoRight - ctaWidth - 16;

        // New: check for actual overlap between logo and first link
        const firstLinkRect = firstLink.getBoundingClientRect();
        const firstLinkLeft = firstLinkRect.left - navRect.left;
    // Only trigger compact if first link actually intrudes into the logo area
    const isOverlap = firstLinkLeft < logoRight;

        // If logo or firstLink have zero width/position, optimistically revert to non-compact
        if (logoRect.width === 0 || firstLinkRect.width === 0) {
            setIsCompact(false);
            setDebug((d) => ({ ...d, nav: navRect.width, logo: logoRect.width, links: linksNeeded, cta: ctaWidth, available: availableForLinks, needed: linksNeeded, logoRight, firstLinkLeft, overlap: false, compact: false }));
            return;
        }

        const shouldCompact = isOverlap || linksNeeded > availableForLinks;
        setIsCompact((prev) => {
            if (prev === shouldCompact) return prev;
            if (!shouldCompact) setOpen(false);
            return shouldCompact;
        });
        setDebug({
            nav: navRect.width,
            logo: logoRect.width,
            links: linksNeeded,
            cta: ctaWidth,
            available: availableForLinks,
            needed: linksNeeded,
            compact: shouldCompact,
            logoRight,
            firstLinkLeft,
            overlap: isOverlap,
        });
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
            {/* <DebugNavOverlay {...debug} /> */}
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
                                width={292}
                                height={178}
                                priority
                                className="h-full w-auto object-contain block max-w-[150px] sm:max-w-[180px] md:max-w-[260px]"
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
                                    className={`px-6 text-sm font-semibold transition-colors uppercase whitespace-nowrap ${
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
                        <div ref={ctaRef} className="ml-8">
                            <Link
                                href="/contact"
                                className="bg-[#A6C07A] hover:bg-[#7C8F5A] transition-colors text-white text-base font-semibold px-4 py-1 rounded-full flex items-center whitespace-nowrap"
                            >
                                <span className="inline-block">LETS CONNECT</span>
                                <span className="ml-2 text-xl font-bold">&#8250;</span>
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
