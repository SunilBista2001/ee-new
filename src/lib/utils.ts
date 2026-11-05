import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Tailwind runs with the `tw:` prefix (see globals.css), so tailwind-merge must know about it. */
const twMerge = extendTailwindMerge({ prefix: 'tw' });

/** Joins class names and resolves conflicting Tailwind utilities (shadcn/ui convention). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
