"use client";

import React from "react";

export default function AlignGlow() {
  React.useEffect(() => {
    const WALKER_FILTER = NodeFilter.SHOW_TEXT;
    const forbiddenTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "INPUT", "TEXTAREA"]);
    const regex = /\b(align)\b/gi;

    function shouldSkip(node: Node) {
      let el = node.parentElement;
      while (el) {
        if (forbiddenTags.has(el.tagName)) return true;
        if (el.classList && el.classList.contains('glow-word')) return true;
        el = el.parentElement;
      }
      return false;
    }

    function wrapMatches(root: Node) {
      const walker = document.createTreeWalker(root, WALKER_FILTER, null);
      const nodesToProcess: Node[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (!node.nodeValue) continue;
        if (shouldSkip(node)) continue;
        if (regex.test(node.nodeValue)) {
          nodesToProcess.push(node);
        }
        regex.lastIndex = 0;
      }

      nodesToProcess.forEach((textNode) => {
        const parent = textNode.parentNode;
        if (!parent) return;
        const frag = document.createDocumentFragment();
        const text = textNode.nodeValue || "";
        let lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = regex.exec(text))) {
          const idx = m.index;
          if (idx > lastIndex) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex, idx)));
          }
          const span = document.createElement('span');
          span.className = 'glow-word';
          span.textContent = text.slice(idx, idx + m[0].length);
          frag.appendChild(span);
          lastIndex = idx + m[0].length;
        }
        if (lastIndex < text.length) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        parent.replaceChild(frag, textNode);
      });
    }

    // Run on initial load
    wrapMatches(document.body);

    // Also observe mutations (e.g., client-side nav) and wrap newly added text
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length) {
          m.addedNodes.forEach((n) => {
            // only process element nodes
            if (n.nodeType === Node.ELEMENT_NODE) wrapMatches(n);
          });
        }
        if (m.type === 'characterData' && m.target) {
          const parent = (m.target as Node).parentNode;
          if (parent) wrapMatches(parent);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => mo.disconnect();
  }, []);

  return null;
}
