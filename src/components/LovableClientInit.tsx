"use client";

import { useEffect } from "react";
// import for side-effects: the adapter wires window event listeners
import "./lovableAdapter";

export default function LovableClientInit() {
  // no-op component; importing the module runs the adapter
  useEffect(() => {
    // Intentionally empty; adapter runs on module load
  }, []);

  return null;
}
