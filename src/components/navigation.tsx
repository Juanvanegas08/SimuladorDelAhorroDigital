"use client";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";
export function Navigation() {
  const pathname = usePathname();
  return <header className="header"><div className="header-inner"><a href="/products" className="brand" aria-label="Brote, inicio"><span className="brand-icon"><Icon name="plant" size={24}/></span>brote<span className="brand-dot">.</span></a><nav aria-label="Navegación principal"><a aria-current={pathname === "/products" ? "page" : undefined} href="/products">Productos</a><a aria-current={pathname === "/simulator" ? "page" : undefined} href="/simulator">Simulador</a></nav><a href="/onboarding" className="button button-small">Empieza a ahorrar <Icon name="arrow" size={17}/></a></div></header>;
}
