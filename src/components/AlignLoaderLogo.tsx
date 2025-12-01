"use client";
import React from "react";
import styles from "./alignLoaderLogo.module.css";

export default function AlignLoaderLogo() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw",
      height: "100vh",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 100000,
      pointerEvents: "none"
    }}>
      <img
        src="/align_vegas_logo.png"
        alt="Align ecommerce logo"
        className={styles["align-logo-pulse"]}
        style={{
          width: "320px",
          maxWidth: "80vw",
          height: "auto",
          filter: "drop-shadow(0 0 18px #95B75D) drop-shadow(0 0 32px #A6C07A)",
          opacity: 1,
          transition: "opacity 0.5s"
        }}
      />
    </div>
  );
}
