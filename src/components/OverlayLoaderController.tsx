"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OverlayLoader from "./OverlayLoader";

export default function OverlayLoaderController() {
  const [loading, setLoading] = useState(false);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleStart = () => {
      if (hideTimer) clearTimeout(hideTimer);
      setLoading(true);
    };
    const handleComplete = () => {
      if (hideTimer) clearTimeout(hideTimer);
      const timer = setTimeout(() => setLoading(false), 1500);
      setHideTimer(timer);
    };

    if (document.readyState !== "complete") {
      setLoading(true);
      window.addEventListener("load", handleComplete);
    }

    return () => {
      window.removeEventListener("load", handleComplete);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [hideTimer]);

  return <OverlayLoader show={loading} />;
}
