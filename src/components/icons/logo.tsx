/**
 * Elite wordmark used in the navbar. Drawn in the same style and bounding box as the
 * original nav logo (116 x 24, no viewBox), so the nav layout is unchanged.
 * Colour comes from `currentColor` (set by --tt-logo in theme.css).
 */
export function Logo({ title }: { title: string }) {
  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title}>
      <path
        d="M5.9 0.779H24.5V6.164H5.895A0.37 0.37 0 0 0 5.525 6.534V9.934H20.09V15.319H5.525V18.719A0.37 0.37 0 0 0 5.895 19.089H24.5V24.474H5.9A5.9 5.9 0 0 1 0 18.574V6.679A5.9 5.9 0 0 1 5.9 0.779Z"
        fill="currentColor"
      />
      <path
        d="M27.994 0.779H33.519V18.719A0.37 0.37 0 0 0 33.889 19.089H49.494V24.474H33.894A5.9 5.9 0 0 1 27.994 18.574Z"
        fill="currentColor"
      />
      <path d="M52.987 0.779H58.512V24.474H52.987Z" fill="currentColor" />
      <path d="M62.006 0.779H88.006V6.164H77.769V24.474H72.244V6.164H62.006Z" fill="currentColor" />
      <path
        d="M97.4 0.779H116V6.164H97.395A0.37 0.37 0 0 0 97.025 6.534V9.934H111.59V15.319H97.025V18.719A0.37 0.37 0 0 0 97.395 19.089H116V24.474H97.4A5.9 5.9 0 0 1 91.5 18.574V6.679A5.9 5.9 0 0 1 97.4 0.779Z"
        fill="currentColor"
      />
    </svg>
  );
}
