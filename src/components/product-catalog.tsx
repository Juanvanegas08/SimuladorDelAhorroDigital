"use client";
import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { DreamHero } from "./dream-hero";
type Product = { id: string; name: string; type: string; rate: number; minimum: number; description: string; tag: string; icon: string; color: string; features: string[] };
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function ProductCatalog({ products }: {products: Product[]}) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [type, setType] = useState("Todos");
  useEffect(() => { const timer = setTimeout(() => setDebounced(query), 300); return () => clearTimeout(timer); }, [query]);
  const filtered = products.filter(p => (type === "Todos" || p.type === type) && normalize(`${p.name} ${p.type}`).includes(normalize(debounced.trim())));
  return <>
    <DreamHero/>
    <section className="catalog container" aria-labelledby="catalog-title"><div className="section-top"><div><span className="eyebrow">AHORRO A TU MEDIDA</span><h2 id="catalog-title">Una cuenta para cada plan.</h2><p>Elige cómo quieres empezar a construir tu mañana.</p></div><span className="catalog-count">{products.length} formas de crecer</span></div>
    <div className="filter-bar"><div className="tabs" role="group" aria-label="Filtrar por tipo">{["Todos", ...new Set(products.map(p => p.type))].map(t => <button key={t} className={type === t ? "tab active" : "tab"} aria-pressed={type === t} onClick={() => setType(t)}>{t === "Todos" ? "Todos los productos" : t}</button>)}</div><label className="search"><Icon name="search" size={18}/><input aria-label="Buscar productos por nombre o tipo" placeholder="Buscar un producto…" value={query} onChange={e => setQuery(e.target.value)}/></label></div>
    <p className="sr-only" aria-live="polite">{filtered.length} productos encontrados</p><div className="product-grid">{filtered.map(p => <article className={`product-card ${p.color}`} key={p.id}><div className="card-heading"><span className="product-icon"><Icon name={p.icon} size={27}/></span><span className="product-tag">{p.tag}</span></div><span className="product-type">{p.type}</span><h3>{p.name}</h3><p className="product-description">{p.description}</p><div className="rate"><strong>{p.rate.toLocaleString("es-CO", {minimumFractionDigits:1})}<span>%</span></strong><div>Efectiva anual<span>Tasa de ejemplo</span></div></div><ul className="feature-list">{p.features.map(f => <li key={f}><Icon name="check" size={15}/>{f}</li>)}</ul><a className="card-link" href={`/simulator?product=${p.id}`}>Simular mi ahorro <Icon name="arrow" size={20}/></a></article>)}</div>
    {filtered.length === 0 && <div className="empty-state"><Icon name="search" size={36}/><h3>No encontramos ese producto</h3><p>Prueba con otro nombre o cambia el tipo de ahorro.</p><button className="button" onClick={() => {setQuery("");setDebounced("");setType("Todos");}}>Limpiar filtros</button></div>}
    <div className="help-banner"><div className="help-icon"><Icon name="plant" size={30}/></div><div><h3>Tu meta puede estar más cerca de lo que crees.</h3><p>Haz números con nuestro simulador y encuentra tu punto de partida.</p></div><a href="/simulator" className="button button-outline">Hagamos cuentas <Icon name="arrow" size={18}/></a></div></section>
  </>;
}
