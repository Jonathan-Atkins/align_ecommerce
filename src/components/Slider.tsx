import React from "react";

interface SliderProps {
  children: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({ children }) => {
  // Navigation controls will be provided by you
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Slides/content will be injected here */}
      {children}
    </div>
  );
};

export default Slider;
