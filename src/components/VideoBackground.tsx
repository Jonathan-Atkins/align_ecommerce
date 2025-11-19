"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function VideoBackground() {
  const pathname = usePathname();

  // Do not render the promo video on the josh-success page so it appears black.
  if (pathname && pathname.startsWith("/auth/josh-success")) return null;
  const srcUrl = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_PROMO_URL || '/promo2.mp4') : '/promo2.mp4';

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
      <video
        id="promo-video"
        src={srcUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  );
}
