import React from "react";

/**
 * Wraps all case-insensitive instances of the word "Align" in a string or React children with a span that applies the green-pulse effect.
 * Usage: <GlowAlignText>Some text with Align and ALIGN and align.</GlowAlignText>
 */
export function GlowAlignText({ children }: { children: React.ReactNode }) {
  // Helper to recursively process children
  function process(node: React.ReactNode): React.ReactNode {
    if (typeof node === "string") {
      // Regex: match 'Align' in any case, not as part of another word
      const regex = /\b(align)\b/gi;
      const parts = [];
      let lastIndex = 0;
      let match;
      let key = 0;
      while ((match = regex.exec(node)) !== null) {
        if (match.index > lastIndex) {
          parts.push(node.slice(lastIndex, match.index));
        }
        parts.push(
          <span className="green-pulse" key={key++}>{match[0]}</span>
        );
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < node.length) {
        parts.push(node.slice(lastIndex));
      }
      return parts.length > 0 ? parts : node;
    } else if (Array.isArray(node)) {
      return node.map(process);
    } else if (React.isValidElement(node) && node.props.children) {
      return React.cloneElement(node, {
        ...node.props,
        children: process(node.props.children),
      });
    }
    return node;
  }
  return <>{process(children)}</>;
}
