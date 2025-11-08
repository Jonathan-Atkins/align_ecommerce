"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";

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
    // Animate border gradient for 'Lets Connect' button (wall clock time-based, never resets)
    useEffect(() => {
        let frameId: number;
        const speed = 0.12; // degrees per ms (360deg/3000ms = 0.12deg/ms for a 3s loop)
        function animate() {
            const element = document.querySelector('.border-gradient') as HTMLElement | null;
            if (element) {
                const now = performance.now();
                const angle = (now * speed) % 360;
                element.style.setProperty('--gradient-angle', angle + 'deg');
            }
            frameId = requestAnimationFrame(animate);
        }
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, []);
    const [open, setOpen] = useState(false);
    const [isCompact, setIsCompact] = useState<boolean>(false);
    const [logoAnimated, setLogoAnimated] = useState(false);

    // Refs to measure actual element sizes
    const navRef = useRef<HTMLElement | null>(null);
    const logoRef = useRef<HTMLDivElement | null>(null);
    const linksRef = useRef<HTMLDivElement | null>(null);
    // We'll attach to a wrapper div around the Link so we can reliably measure
    const ctaRef = useRef<HTMLDivElement | null>(null);
    // Ref for the first nav link
    const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
    const redBoxRef = useRef<HTMLDivElement | null>(null);

    // Track failed logo/firstLink measurements
    const failedMeasureCount = useRef(0);
    const MAX_FAILED_MEASURES = 10;

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
        if (!nav || !logo || !links || !firstLink) {
            setIsCompact(false);
            failedMeasureCount.current = 0;
            return;
        }
        const navRect = nav.getBoundingClientRect();
        const logoRect = logo.getBoundingClientRect();
        const ctaWidth = cta ? cta.getBoundingClientRect().width : 0;
        const linksNeeded = links.scrollWidth;
        const logoRight = logoRect.right - navRect.left;
        const availableForLinks = navRect.width - logoRight - ctaWidth - 16;
        const firstLinkRect = firstLink.getBoundingClientRect();
        const firstLinkLeft = firstLinkRect.left - navRect.left;
        const gap = firstLinkLeft - logoRight;
        const isOverlap = gap < MIN_GAP;
        // If logo or firstLink have zero width/position, retry measurement after a short delay
        if (logoRect.width === 0 || firstLinkRect.width === 0) {
            failedMeasureCount.current += 1;
            setIsCompact(failedMeasureCount.current >= MAX_FAILED_MEASURES);
            setTimeout(evaluateCompact, 50);
            return;
        } else {
            failedMeasureCount.current = 0;
        }
        const shouldCompact = isOverlap || linksNeeded > availableForLinks;
        setIsCompact((prev) => {
            if (prev === shouldCompact) return prev;
            if (!shouldCompact) setOpen(false);
            return shouldCompact;
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

    useEffect(() => {
        setLogoAnimated(true);
    }, []);

    const [redBoxDims, setRedBoxDims] = useState({ width: 0, height: 0 });
    useLayoutEffect(() => {
        if (redBoxRef.current) {
            const rect = redBoxRef.current.getBoundingClientRect();
            setRedBoxDims({ width: rect.width, height: rect.height });
        }
    }, [isCompact]);

    return (
                <>
                        <style>{`
                                @keyframes navbar-fadein-left {
                                    from { opacity: 0; transform: translateX(-40px); }
                                    to { opacity: 1; transform: translateX(0); }
                                }
                                                                @keyframes lights {
                                                                    0% {
                                                                        color: hsl(230, 40%, 80%);
                                                                        text-shadow:
                                                                            0 0 1em hsla(320, 100%, 50%, 0.2),
                                                                            0 0 0.125em hsla(320, 100%, 60%, 0.3),
                                                                            -1em -0.125em 0.5em hsla(40, 100%, 60%, 0),
                                                                            1em 0.125em 0.5em hsla(200, 100%, 60%, 0);
                                                                    }
                                                                    50% { 
                                                                        color: hsl(230, 100%, 95%);
                                                                        text-shadow:
                                                                            0 0 1em hsla(320, 100%, 50%, 0.5),
                                                                            0 0 0.125em hsla(320, 100%, 90%, 0.5),
                                                                            -0.25em -0.125em 0.125em hsla(40, 100%, 60%, 0.2),
                                                                            0.25em 0.125em 0.125em hsla(200, 100%, 60%, 0.4);
                                                                    }
                                                                    100% {
                                                                        color: hsl(230, 40%, 80%);
                                                                        text-shadow:
                                                                            0 0 1em hsla(320, 100%, 50%, 0.2),
                                                                            0 0 0.125em hsla(320, 100%, 60%, 0.3),
                                                                            1em -0.125em 0.5em hsla(40, 100%, 60%, 0),
                                                                            -1em 0.125em 0.5em hsla(200, 100%, 60%, 0);
                                                                    }
                                                                }
                                                                .navbar-logo-anim {
                                                                        opacity: 0;
                                                                        animation: navbar-fadein-left 1.8s cubic-bezier(0.4,0,0.2,1) 0.2s both;
                                                                }
                                                                .shine-text {
                                                                        color: #fff;
                                                                        font-weight: 400;
                                                                        animation: lights 5s linear infinite;
                                                                }
                                .border-gradient {
                                    --c: #A6C07A;
                                    --p: 10%;
                                    background: linear-gradient(var(--c), var(--c)) padding-box,
                                        conic-gradient(
                                                from var(--gradient-angle, 0deg),
                                                transparent,
                                                #3b82f6 var(--p),
                                                transparent calc(var(--p) * 2)
                                        ) border-box;
                                    border: 2px solid transparent;
                                    border-radius: 2rem;
                                    position: relative;
                                }
                        `}</style>
                                    {/* Gradient animation handled by useEffect above */}
            {/* Top Info Bar */}
            <div className="w-full bg-[#A6C07A] text-white text-sm">
                <div className="w-full flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 py-2">
                    {/* Left: Email and Phone */}
                    <div className="flex items-center gap-6">
                        <a
                            href="mailto:support@alignecommerce.com"
                            className="flex items-center gap-2 hover:underline"
                            aria-label="Email"
                            target="_blank"
                            rel="noopener noreferrer"
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
                    <div className="flex items-center">
                        <a
                            href="https://www.instagram.com/alignecommerce/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                            aria-label="Instagram"
                        >
                            {/* hide text on compact — show only icon */}
                            {!isCompact && <span className="text-sm mr-1 shine-text">Follow us for more</span>}
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
            </div>

            {/* Navbar */}
            <nav ref={navRef} className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-md border-b-4 border-[#7C8F5A] px-2 sm:px-4 md:px-8 py-4 flex items-center justify-between">
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
                                width={220}
                                height={134}
                                priority
                                className={
                                    (logoAnimated ? 'navbar-logo-anim ' : '') +
                                    'w-auto object-contain block ' +
                                    (isCompact
                                        ? 'max-w-[140px] sm:max-w-[180px] md:max-w-[220px]'
                                        : 'max-w-[140px] sm:max-w-[180px] md:max-w-[220px]')
                                }
                                style={{ width: 'auto', height: 'auto' }}
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
                                className="bg-[#A6C07A] hover:bg-[#7C8F5A] border-gradient transition-colors text-white text-[15px] font-semibold px-3 py-1 rounded-full flex items-center whitespace-nowrap"
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
                                            "block h-1 rounded-full transition-transform ease-in-out " +
                                            (open ? " translate-y-1 rotate-45 w-10" : " w-10")
                                        }
                                        style={{ backgroundColor: '#A6C07A' }}
                                    />
                                    <span
                                        className={
                                            "block h-1 rounded-full transition-transform ease-in-out " +
                                            (open ? " w-10 -translate-y-1 -rotate-45" : " w-8")
                                        }
                                        style={{ backgroundColor: '#111' }}
                                    />
                                </div>
                            </div>
                        </button>
                     )}
 
                                                             {/* Animated floating dropdown under hamburger, using navLinks, with fade/slide and floating over navbar */}
                                                             {isCompact && (
                                                                 <div
                                                                     className={`absolute top-full right-0 mt-2 z-50 pointer-events-none`}
                                                                     style={{ minWidth: '16rem' }}
                                                                 >
                                                                     <ul
                                                                         className={`bg-white shadow-md rounded-lg p-1 space-y-0.5 transition-all duration-300 ease-out transform ${open ? 'opacity-100 translate-y-2 pointer-events-auto' : 'opacity-0 -translate-y-2'} drop-shadow-xl`}
                                                                         role="menu"
                                                                         aria-orientation="vertical"
                                                                     >
                                                                         {navLinks.map((link) => (
                                                                             <li key={link.name}>
                                                                                 <Link
                                                                                     href={link.href}
                                                                                     onClick={() => setOpen(false)}
                                                                                     className="dropdown-item flex items-center gap-x-3.5 py-3 px-6 rounded-lg text-lg font-bold text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors"
                                                                                 >
                                                                                     {link.name}
                                                                                 </Link>
                                                                             </li>
                                                                         ))}
                                                                     </ul>
                                                                 </div>
                                                             )}
                 </div>
            </nav>
        </>
    );
}
