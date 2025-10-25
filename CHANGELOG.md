# CHANGELOG

## 2025-10-16

### Major Changes
- Initial landing page UI implemented based on Figma wireframe screenshot.
- Created a custom `Navbar` component (`src/app/Navbar.tsx`) matching the provided design:
  - SVG Align logo with green accent and "ecommerce" subtitle
  - Centered navigation links with green highlight for "Home"
  - "Get in Touch" button styled as in the wireframe
- Refactored landing page (`src/app/page.tsx`) to:
  - Use only SVG icons for all logos and illustrations (no external images)
  - Payment method logos (Mastercard, Visa, Amex, Discover, JCB, Google Pay, Apple Pay, UnionPay) as inline SVGs
  - Card illustrations replaced with SVG placeholders
- Updated Tailwind CSS configuration:
  - Added custom colors (`align-green`, `dark-card`) and font sizes in `tailwind.config.js`
  - Ensured Tailwind v4 compatibility in `globals.css`
- Fixed build and hydration issues:
  - Removed all references to missing images
  - Provided guidance for hydration mismatch caused by browser extensions (e.g., Dark Reader)
- General layout and style improvements:
  - Responsive design for navigation and cards
  - Consistent color palette and spacing
  - All UI elements match the Figma wireframe as closely as possible
