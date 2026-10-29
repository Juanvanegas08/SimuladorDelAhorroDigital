"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Icon } from "./icons";

const dreams = [
  { title: "Ese viaje pendiente", detail: "Un destino. Mil recuerdos.", category: "EXPLORAR EL MUNDO", icon: "plane", color: "sky", progress: 68, caption: "Cada aporte te lleva más lejos" },
  { title: "Mi propio espacio", detail: "Las llaves de un nuevo comienzo.", category: "UN LUGAR PARA MÍ", icon: "home", color: "rose", progress: 42, caption: "Tu futuro empieza a tomar forma" },
  { title: "Seguir aprendiendo", detail: "Invertir en quien quieres ser.", category: "CRECER SIEMPRE", icon: "study", color: "lilac", progress: 55, caption: "Un paso más cerca de tu próxima meta" },
  { title: "Mi gran proyecto", detail: "Esa idea que merece crecer.", category: "HACERLO POSIBLE", icon: "spark", color: "lime", progress: 36, caption: "Hoy una idea. Mañana, tu realidad" },
  { title: "Un futuro tranquilo", detail: "Más calma para lo que venga.", category: "VIVIR CON CALMA", icon: "sun", color: "sand", progress: 79, caption: "Pequeños hábitos, grandes comienzos" },
];

export function DreamHero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    function draw(time: number) {
      if (last) elapsed += Math.min(time - last, 50);
      last = time;
      const width = sceneRef.current?.clientWidth ?? 1000;
      const radius = Math.min(width * 0.34, 365);
      const mobile = width < 600;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const angle = index * (Math.PI * 2 / dreams.length) + elapsed / 15000 + 0.3;
        const depth = Math.cos(angle);
        const x = Math.sin(angle) * radius;
        const y = (mobile ? 22 : 30) * depth;
        const scale = (mobile ? 0.68 : 0.88) + depth * (mobile ? 0.12 : 0.14);
        card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) perspective(1100px) rotateY(${Math.sin(angle) * -23}deg) scale(${scale})`;
        card.style.zIndex = depth > 0.12 ? "4" : "1";
        card.style.opacity = String(0.53 + (depth + 1) * 0.235);
        card.style.filter = depth < -0.3 ? "blur(0.7px)" : "none";
      });
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <section className="dream-hero" aria-labelledby="dream-title">
    <div className="dream-intro">
      <h1 id="dream-title">Todo lo que sueñas,<br/><em>empieza con un brote.</em></h1>
      <div className="dream-actions"><a href="/simulator" className="button dream-primary">Haz cuentas con tus sueños <Icon name="arrow" size={17}/></a><a href="#catalog-title" className="dream-secondary">Encuentra tu ahorro <span>↗</span></a></div>
    </div>
    <div className="dream-scene" ref={sceneRef}>
      <div className="dream-halo" aria-hidden="true"/>
      <div className="dream-person"><Image src="/images/dreamer.png" alt="Una persona mira hacia arriba con ilusión, imaginando sus próximos sueños." fetchPriority="high" loading="eager" width={1122} height={1402} sizes="(max-width: 720px) 265px, 365px"/></div>
      <div className="dream-cards" aria-label="Sueños que puedes empezar a construir ahorrando">
        {dreams.map((dream, index) => <div className={`dream-card dream-${dream.color}`} ref={element => {cardRefs.current[index] = element;}} key={dream.title} style={{ transform: `translate(-50%, -50%) translateX(${(index-2)*110}px) scale(.8)` }}>
          <div className="dream-card-top"><span className="dream-card-category">{dream.category}</span><span className="dream-card-dot"/></div>
          <div className="dream-card-main"><span className="dream-card-icon"><Icon name={dream.icon} size={22}/></span><div><h2>{dream.title}</h2><p>{dream.detail}</p></div></div>
          <div className="dream-progress" aria-hidden="true"><span style={{width:`${dream.progress}%`}}/></div>
          <div className="dream-card-bottom"><span>{dream.caption}</span><Icon name="arrow" size={12}/></div>
        </div>)}
      </div>
      <div className="dream-fade" aria-hidden="true"/>
    </div>
  </section>;
}
