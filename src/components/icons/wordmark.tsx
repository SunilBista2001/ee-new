/**
 * Large gradient Elite wordmark above the footer. Same 1416 x 290 viewBox as the original
 * wordmark, so its height on the page is unchanged. Gradient and stroke colours come from theme.css.
 */
export function Wordmark({ title }: { title: string }) {
  return (
    <svg
      className="footer-wordmark"
      width="100%"
      viewBox="0 0 1416 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <path
        d="M71.25 0.25H298.799V65.49H71.7A4.5 4.5 0 0 0 67.2 69.99V112H245.061V177.24H67.2V219.25A4.5 4.5 0 0 0 71.7 223.75H298.799V288.99H71.25A71 71 0 0 1 0.25 217.99V71.25A71 71 0 0 1 71.25 0.25ZM341.957 0.25H408.907V219.25A4.5 4.5 0 0 0 413.407 223.75H603.95V288.99H412.957A71 71 0 0 1 341.957 217.99ZM647.107 0.25H714.057V288.99H647.107ZM757.215 0.25H1074.043V65.49H949.104V288.99H882.154V65.49H757.215ZM1188.201 0.25H1415.75V65.49H1188.651A4.5 4.5 0 0 0 1184.151 69.99V112H1362.011V177.24H1184.151V219.25A4.5 4.5 0 0 0 1188.651 223.75H1415.75V288.99H1188.201A71 71 0 0 1 1117.201 217.99V71.25A71 71 0 0 1 1188.201 0.25Z"
        fill="url(#paint0_linear_14259_2371)"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient
          id="paint0_linear_14259_2371"
          x1="708"
          y1="49.34"
          x2="708"
          y2="289.408"
          gradientUnits="userSpaceOnUse"
        >
          <stop style={{ stopColor: 'var(--tt-wordmark-top)' }} />
          <stop offset="0.500012" style={{ stopColor: 'var(--tt-wordmark-mid)' }} />
          <stop offset="0.870012" style={{ stopColor: 'var(--tt-wordmark-bottom)' }} />
        </linearGradient>
      </defs>
    </svg>
  );
}
