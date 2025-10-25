import React from "react";
import Navbar from "./Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Only one info bar here */}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}