"use client";
import { useState } from "react";
import { validateOpening, type OpeningInput } from "@/lib/onboarding";
import { Icon } from "@/components/icons";
import { DemoCaptcha } from "@/components/demo-captcha";
export function OnboardingForm({productId,productName}:{productId?:string;productName?:string}) {
  const [errors, setErrors] = useState<Partial<Record<keyof OpeningInput, string>>>({});
  const [verified, setVerified] = useState(false);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const [code, setCode] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending) return;
    const form = new FormData(event.currentTarget);
    const input = {name: String(form.get("name") ?? "").trim(), document: String(form.get("document") ?? "").trim(), email: String(form.get("email") ?? "").trim(), recaptcha: String(form.get("recaptcha") ?? "")};
    const validation = validateOpening(input); setErrors(validation); setFailure("");
    if (Object.keys(validation).length) return;
    setPending(true);
    try {
      const response = await fetch("/api/onboarding", {method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({...input,productId})});
      const data = await response.json();
      if (!response.ok) { setErrors(data.errors ?? {}); throw new Error(data.message ?? "No pudimos enviar tu solicitud."); }
      setCode(data.code);
    } catch (error) { setFailure(error instanceof Error ? error.message : "Revisa tu conexión e intenta otra vez."); }
    finally { setPending(false); }
  }
  return <section className="container page-section"><span className="eyebrow">UN NUEVO COMIENZO</span><h1 className="page-title">El primer paso <em>es tuyo.</em></h1><p className="page-intro">Déjanos tu intención de apertura. Tus planes merecen empezar.</p><div className="onboarding-layout"><aside className="onboarding-story"><span className="story-icon"><Icon name="plant" size={42}/></span><h2>Hoy una intención.<br/>Mañana, una nueva meta.</h2><p>Un proceso sencillo para dar el siguiente paso en tu camino de ahorro.</p><ul className="story-steps"><li><span>1</span><div><strong>Cuéntanos sobre ti</strong><p>Solo necesitamos unos datos básicos.</p></div></li><li><span>2</span><div><strong>Confirma tu intención</strong><p>Envía el formulario para obtener tu código.</p></div></li><li><span>3</span><div><strong>Conserva tu solicitud</strong><p>Recibirás una referencia de demostración.</p></div></li></ul><div className="demo-note"><Icon name="shield" size={22}/><p>Estás en una demostración. Usa datos ficticios: esta solicitud no abre una cuenta real y tus datos no se guardan.</p></div></aside><div className="form-panel onboarding-panel">{code ? <div className="success-state" role="status"><span className="success-icon"><Icon name="check" size={38}/></span><span className="eyebrow">¡PRIMER PASO COMPLETADO!</span><h2>Tu próximo comienzo<br/>ya tiene un código.</h2><p>Tu solicitud de demostración se procesó correctamente.</p><div className="request-code"><span>Código de solicitud</span><strong>{code}</strong></div><p className="fine-print">Guarda este código si deseas mostrar el resultado. No se envió un correo ni se creó una cuenta.</p><a className="button full-width" href="/products">Volver a los productos <Icon name="arrow" size={18}/></a></div> : <form onSubmit={submit} noValidate aria-busy={pending}><div className="panel-heading"><span className="step-badge">01</span><h2>Vamos a conocernos</h2></div><p className="form-subtitle">{productName ? `Producto elegido: ${productName}. ` : ""}Todos los campos son obligatorios.</p>{[{key:"name", label:"Nombre completo", placeholder:"Ej. Ana Torres", type:"text", autoComplete:"name"},{key:"document", label:"Número de documento", placeholder:"Ej. 1234567890", type:"text", autoComplete:"off"},{key:"email", label:"Correo electrónico", placeholder:"Ej. ana@example.com", type:"email", autoComplete:"email"}].map(field => <label className="field" key={field.key}>{field.label}<input name={field.key} type={field.type} inputMode={field.key === "document" ? "numeric" : undefined} autoComplete={field.autoComplete} placeholder={field.placeholder} required maxLength={field.key === "name" ? 100 : field.key === "document" ? 12 : 254} aria-invalid={!!errors[field.key as keyof OpeningInput]} aria-describedby={errors[field.key as keyof OpeningInput] ? `${field.key}-error` : undefined}/>{errors[field.key as keyof OpeningInput] && <span className="field-error" id={`${field.key}-error`}>{errors[field.key as keyof OpeningInput]}</span>}</label>)}<input type="hidden" name="recaptcha" value={verified ? "OK" : ""}/><DemoCaptcha onVerified={value=>{setVerified(value);setErrors(current=>({...current,recaptcha:undefined}));}}/><div id="captcha-hint">{errors.recaptcha && <p className="field-error">{errors.recaptcha}</p>}</div>{failure && <p className="error-banner" role="alert">{failure}</p>}<button className="button full-width" type="submit" disabled={pending}>{pending ? "Enviando solicitud…" : "Registrar mi intención"}<Icon name="arrow" size={18}/></button><p className="fine-print">Usa información ficticia para probar el formulario. No se almacenan datos personales.</p></form>}</div></div></section>;
}
