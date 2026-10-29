import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Brote · Haz crecer tus planes", template: "%s | Brote" }, description: "Explora productos de ahorro y simula tus metas. Demostración de una experiencia de ahorro digital.", icons: { icon: [{url:"/brote-icon.svg",type:"image/svg+xml",sizes:"any"}], shortcut:"/brote-icon.svg" } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="es-CO"><body><a href="#main" className="skip-link">Saltar al contenido</a><Navigation/><main id="main">{children}</main><footer className="footer"><div><a href="/products" className="footer-brand">brote.</a><span>Pequeños pasos. Grandes comienzos.</span></div><p>Proyecto de demostración · Productos y tasas ficticios.<br/>No se abren cuentas reales ni se almacena tu información personal.</p><span className="footer-note">Hecho para crecer contigo ↗</span></footer></body></html>;
}
