"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/cuicui/utils/cn";

interface ScrambleHoverProps {
  text?: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  sequential?: boolean;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  scrambledClassName?: string;
}

const ScrambleHover = ({
  text = "Why Align?",
  scrambleSpeed = 55,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+1234567890-=[]{}|;:',.<>?/`~",
  className,
  scrambledClassName,
  sequential = false,
  ...props
}: ScrambleHoverProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices] = useState(new Set<number>());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIteration = 0;

    const getNextIndexFromCenter = () => {
      const textLength = text.length;
      const middle = Math.floor(textLength / 2);
      const offset = Math.floor(revealedIndices.size / 2);
      const nextIndex =
        revealedIndices.size % 2 === 0 ? middle + offset : middle - offset - 1;

      if (
        nextIndex >= 0 &&
        nextIndex < textLength &&
        !revealedIndices.has(nextIndex)
      ) {
        return nextIndex;
      }

      for (let i = 0; i < textLength; i++) {
        if (!revealedIndices.has(i)) {
          return i;
        }
      }
      return 0;
    };

    const shuffleText = (textToShuffle: string) => {
      if (useOriginalCharsOnly) {
        const positions = textToShuffle.split("").map((char, i) => ({
          char,
          isSpace: char === " ",
          index: i,
          isRevealed: revealedIndices.has(i),
        }));

        const nonSpaceChars = positions
          .filter((p) => !(p.isSpace || p.isRevealed))
          .map((p) => p.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [
            nonSpaceChars[j],
            nonSpaceChars[i],
          ];
        }

        let charIndex = 0;
        return positions
          .map((p) => {
            if (p.isSpace) {
              return " ";
            }
            if (p.isRevealed) {
              return textToShuffle[p.index];
            }
            return nonSpaceChars[charIndex++];
          })
          .join("");
      }

      return textToShuffle
        .split("")
        .map((char, i) => {
          if (char === " ") {
            return " ";
          }
          if (revealedIndices.has(i)) {
            return textToShuffle[i];
          }
          return availableChars[
            Math.floor(Math.random() * availableChars.length)
          ];
        })
        .join("");
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        if (sequential) {
          if (revealedIndices.size < text.length) {
            const nextIndex = getNextIndexFromCenter();
            revealedIndices.add(nextIndex);
            setDisplayText(shuffleText(text));
          } else {
            clearInterval(interval);
            setIsScrambling(false);
          }
        } else {
          setDisplayText(shuffleText(text));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
          }
        }
      }, scrambleSpeed);
    } else {
      setDisplayText(text);
      revealedIndices.clear();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    isHovering,
    revealedIndices,
    text,
    characters,
    scrambleSpeed,
    useOriginalCharsOnly,
    sequential,
    maxIterations,
  ]);

  return (
    <motion.h1
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={cn("inline-block whitespace-pre-wrap", className)}
      style={{ cursor: "default" }}
      {...props}
    >
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          // Apply glow-word class to 'A','l','i','g','n' in 'Align'
          const isAlign = displayText.slice(index, index + 5) === "Align";
          if (isAlign) {
            return (
              <span
                key={`${index}-Align`}
                className={cn("glow-word", revealedIndices.has(index) || !isScrambling || !isHovering ? className : scrambledClassName)}
              >
                {"Align"}
              </span>
            );
          }
          // Don't apply glow to other chars
          if (["A","l","i","g","n"].includes(char) && displayText.substr(index,5)!=="Align") {
            return null;
          }
          return (
            <span
              key={`${index}-${char}`}
              className={cn(
                revealedIndices.has(index) || !isScrambling || !isHovering
                  ? className
                  : scrambledClassName,
              )}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.h1>
  );
};

export default ScrambleHover;