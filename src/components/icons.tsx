import type { CSSProperties } from "react";
export function Icon({ name, size = 24, style }: { name: string; size?: number; style?: CSSProperties }) {
  const paths: Record<string, React.ReactNode> = {
    plane: <><path d="m22 2-7 20-4-9-9-4L22 2ZM11 13 22 2"/></>,
    home: <><path d="m3 10 9-7 9 7v11H3V10Z"/><path d="M9 21v-8h6v8"/></>,
    study: <><path d="m2 8 10-5 10 5-10 5L2 8Zm4 2v7c4 3 8 3 12 0v-7M22 8v8"/></>,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/></>,
    arrow: <><path d="M4 12h16M14 6l6 6-6 6"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    flag: <><path d="M5 21V3m0 1c5-5 9 5 15 0v10c-6 5-10-5-15 0"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>,
    plant: <><path d="M12 22V10M12 16C2 16 3 5 3 5s10 0 9 11ZM12 11C12 2 22 2 22 2s0 10-10 9Z"/></>,
    shield: <><path d="m12 2 8 3v7c0 6-8 10-8 10S4 18 4 12V5l8-3Z"/><path d="m8 12 3 3 5-6"/></>,
    wallet: <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 8V5l13-3v3m5 6h-6v5h6m-4-2.5h.01"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name] ?? paths.plant}</svg>;
}
