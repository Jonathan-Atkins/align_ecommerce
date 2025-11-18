"use client";
import React, { useEffect, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";

type Props = {
  children: React.ReactNode;
  waitForVideo?: boolean;
};

export default function ClientLoader({ children, waitForVideo = true }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cleanupVideo: (() => void) | null = null;
    let fallbackTimer: number | null = null;

    function hide() {
      const el = document.getElementById("site-loader");
      if (el) el.classList.add("fade-out");
      setTimeout(() => setVisible(false), 650);
    }

    if (waitForVideo) {
      const video = document.querySelector<HTMLVideoElement>("video");
      if (video) {
        const onReady = () => hide();
        video.addEventListener("canplaythrough", onReady, { once: true });
        cleanupVideo = () => video.removeEventListener("canplaythrough", onReady);
        fallbackTimer = window.setTimeout(hide, 8000);
      } else {
        if (document.readyState === "complete") hide();
        else window.addEventListener("load", hide, { once: true });
        fallbackTimer = window.setTimeout(hide, 8000);
      }
    } else {
      if (document.readyState === "complete") hide();
      else window.addEventListener("load", hide, { once: true });
      fallbackTimer = window.setTimeout(hide, 6000);
    }

    return () => {
      if (cleanupVideo) cleanupVideo();
      if (fallbackTimer) clearTimeout(fallbackTimer);
      window.removeEventListener("load", hide);
    };
  }, [waitForVideo]);

  return (
    <>
      {visible && <LoadingOverlay />}
      {children}
    </>
  );
}
"use client";
import React, { useEffect, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";

type Props = {
  children: React.ReactNode;
  waitForVideo?: boolean; // set true to wait for video canplaythrough
};

export default function ClientLoader({ children, waitForVideo = false }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let videoListener: (() => void) | null = null;
    let fallbackTimer: number | null = null;

    function hide() {
      const el = document.getElementById("site-loader");
      if (el) el.classList.add("fade-out");
      // match this timeout to CSS fade duration (600ms here)
      setTimeout(() => setVisible(false), 650);
    }

    if (waitForVideo) {
      const video = document.querySelector<HTMLVideoElement>("video");
      if (video) {
        const onReady = () => hide();
        // Use canplaythrough as a strong signal the video can play without buffering
        video.addEventListener("canplaythrough", onReady, { once: true });
        videoListener = () => video.removeEventListener("canplaythrough", onReady);
        // safety: if it never fires, hide after 8s
        fallbackTimer = window.setTimeout(hide, 8000);
      } else {
        // no video found, fallback to window load
        if (document.readyState === "complete") hide();
        else window.addEventListener("load", hide, { once: true });
        fallbackTimer = window.setTimeout(hide, 8000);
      }
    } else {
      if (document.readyState === "complete") hide();
      else window.addEventListener("load", hide, { once: true });
      // safety fallback
      fallbackTimer = window.setTimeout(hide, 6000);
    }

    return () => {
      if (videoListener) videoListener();
      if (fallbackTimer) clearTimeout(fallbackTimer);
      window.removeEventListener("load", hide);
    };
  }, [waitForVideo]);

  return (
    <>
      {visible && <LoadingOverlay />}
      {children}
    </>
  );
}