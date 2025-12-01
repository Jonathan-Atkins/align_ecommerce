"use client";
import React from "react";
import AlignLoaderLogo from "./AlignLoaderLogo";

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 99999,
  background: "rgba(255, 255, 255, 0.28)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(9.9px)",
  WebkitBackdropFilter: "blur(9.9px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function OverlayLoader({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div style={overlayStyle}>
      <AlignLoaderLogo />
    </div>
  );
}
