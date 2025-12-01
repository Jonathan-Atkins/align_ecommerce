// Utility to concatenate class names conditionally
export function cn(...args: (string | undefined | null | false)[]): string {
  return args.filter(Boolean).join(" ");
}
