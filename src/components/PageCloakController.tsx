"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LANDING_PATH = "/";

export default function PageCloakController() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.getElementById("page-cloak");
    // If we're not on the landing path, ensure the cloak is removed so
    // pages like /auth are visible immediately. The cloak is primarily
    // for the landing/promo experience.
    if (pathname !== LANDING_PATH && root && root.classList.contains("page-loader-hidden")) {
      root.classList.remove("page-loader-hidden");
    }
  }, [pathname]);

  return null;
}
