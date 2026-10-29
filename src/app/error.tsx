"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="container page-section empty-state"><h1 className="page-title">Vamos a intentarlo otra vez.</h1><p>No pudimos conectar con el catálogo. Comprueba que el servicio esté disponible.</p><button className="button" onClick={reset}>Reintentar</button></section>;}
