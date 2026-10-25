// The Foreman "F." logo, traced from the brand artwork (1080px source, mark spans 332–747 x 194–885).
// The F takes currentColor so it works on light and dark; the dot is always brand orange.

export const BRAND_ORANGE = '#f47721';

export function ForemanMark({ height = 32, className = '' }: { height?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 415 691"
      height={height}
      width={(height * 415) / 691}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="M139 48a48 48 0 0 1 48-48H415V90a48 48 0 0 1-48 48H139Z" />
        <path d="M0 186a48 48 0 0 1 48-48H139V643a48 48 0 0 1-48 48H0Z" />
        <path d="M139 276H277V366a48 48 0 0 1-48 48H139Z" />
      </g>
      <circle cx="346" cy="622" r="69" fill={BRAND_ORANGE} />
    </svg>
  );
}
