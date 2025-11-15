"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function VideoBackground() {
  const pathname = usePathname();

  // Do not render the promo video on the josh-success page so it appears black.
  if (pathname && pathname.startsWith("/auth/josh-success")) return null;

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
      <video
        src="/promo2.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        style={{ position: "absolute", inset: 0 }}
      />
    </div>
  );
}
