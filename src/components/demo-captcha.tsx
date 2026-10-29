"use client";
import {useEffect,useRef,useState} from "react";
import {Icon} from "./icons";
export function DemoCaptcha({onVerified}:{onVerified:(value:boolean)=>void}){
 const [state,setState]=useState<"idle"|"challenge"|"checking"|"verified">("idle");
 const [error,setError]=useState("");
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 function choose(icon:string){
  if(icon!=="plant"){setError("Ese no es el brote. Intenta con otro símbolo.");return;}
  setError("");setState("checking");
  timer.current=setTimeout(()=>{setState("verified");onVerified(true);},650);
 }
 return <div className={`verification-widget ${state==="verified"?"is-verified":""}`}><div className="verification-main"><span className="verification-status-icon"><Icon name={state==="verified"?"check":"shield"} size={24}/></span><div><strong>{state==="verified"?"Verificación completada":state==="checking"?"Verificando…":"Verifica que eres una persona"}</strong><span>{state==="verified"?"Ya puedes enviar tu solicitud.":"Una comprobación sencilla antes de continuar."}</span></div>{state==="idle"&&<button type="button" onClick={()=>setState("challenge")}>Verificar <Icon name="arrow" size={14}/></button>}{state==="checking"&&<span className="verification-spinner" aria-label="Verificando"/>}</div>{state==="challenge"&&<div className="verification-challenge"><p>Selecciona el <strong>brote</strong> para continuar.</p><div className="verification-options">{[{icon:"sun",label:"Sol"},{icon:"wallet",label:"Billetera"},{icon:"plant",label:"Brote"},{icon:"flag",label:"Bandera"},{icon:"clock",label:"Reloj"},{icon:"home",label:"Casa"}].map(choice=><button key={choice.icon} type="button" aria-label={choice.label} onClick={()=>choose(choice.icon)}><Icon name={choice.icon} size={25}/></button>)}</div>{error&&<p role="alert" className="field-error">{error}</p>}</div>}<div className="verification-footer"><span className="verification-brand"><Icon name="plant" size={12}/> brote secure</span><small>Verificación simulada</small></div><span className="sr-only" role="status">{state==="verified"?"Verificación completada":state==="checking"?"Comprobando tu respuesta":""}</span></div>;
}
