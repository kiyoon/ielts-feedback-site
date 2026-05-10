import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtBand(b: number): string {
  return Number.isInteger(b) ? `${b}.0` : b.toFixed(1);
}

export function bandDelta(a: number, b: number): string {
  const d = a - b;
  if (Math.abs(d) < 0.01) return "±0";
  return d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1);
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
