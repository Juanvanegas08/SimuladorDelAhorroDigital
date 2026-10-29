"use client";

import { useEffect, useRef, useState } from "react";
import { calculateSavings, money } from "@/lib/savings";
import { Icon } from "@/components/icons";

type Product = {id:string; name:string; rate:number; minimum:number};
type Result = ReturnType<typeof calculateSavings> & {months:number; name:string; rate:number; id:string};
const steps = ["Producto", "Monto inicial", "Aporte mensual", "Plazo"];
const digits = (value:string) => value.replace(/\D/g, "").slice(0,13);
const numberFormat = (value:string) => value ? new Intl.NumberFormat("es-CO").format(Number(value)) : "";
function ColombiaCurrency(){return <span className="currency-badge"><span className="colombia-flag" role="img" aria-label="Colombia"/>COP</span>;}

export function Simulator({initialProduct,products}:{initialProduct:string;products:Product[]}){
  const [step,setStep]=useState(0);
  const [productId,setProductId]=useState(initialProduct);
  const [initial,setInitial]=useState("1000000");
  const [monthly,setMonthly]=useState("200000");
  const [months,setMonths]=useState("12");
  const [error,setError]=useState("");
  const [result,setResult]=useState<Result|null>(null);
  const [chartMonth,setChartMonth]=useState(12);
  const titleRef=useRef<HTMLHeadingElement>(null);
  const product=products.find(p=>p.id===productId)!;

  useEffect(()=>{titleRef.current?.focus();},[step,result]);
  function go(next:number){setError("");setStep(next);}
  function advance(event:React.FormEvent){
    event.preventDefault();
    if(step===1 && (!initial || Number(initial)<product.minimum || Number(initial)>1e12))return setError(`Ingresa un monto entre ${money(product.minimum)} y ${money(1e12)} COP.`);
    if(step===2 && (!monthly || Number(monthly)>1e12))return setError("Ingresa un aporte entre $0 y $1.000.000.000.000 COP.");
    if(step===2 && Number(initial)===0 && Number(monthly)===0)return setError("El monto inicial o el aporte mensual debe ser mayor que cero.");
    if(step===3){
      if(!Number.isInteger(Number(months))||Number(months)<1||Number(months)>600)return setError("Elige un plazo entero de entre 1 y 600 meses.");
      const calculated=calculateSavings({initial:Number(initial),monthly:Number(monthly),months:Number(months),annualRate:product.rate});
      setChartMonth(Number(months));setResult({...calculated,months:Number(months),name:product.name,rate:product.rate,id:product.id});setError("");return;
    }
    go(step+1);
  }

  if(result){
    const x=(month:number)=>65+month/result.months*665;
    const y=(balance:number)=>235-balance/(result.balance||1)*205;
    const balancePoints=result.timeline.map(p=>`${x(p.month)},${y(p.balance)}`).join(" ");
    const capitalPoints=result.timeline.map(p=>`${x(p.month)},${y(p.contributed)}`).join(" ");
    const selected=result.timeline[chartMonth];
    const capitalPercent=result.balance?result.contributed/result.balance*100:100;
    return <section className="container savings-results"><div className="results-heading"><div><span className="eyebrow">UN FUTURO QUE EMPIEZA HOY</span><h1 ref={titleRef} tabIndex={-1}>Así podrían crecer <em>tus sueños.</em></h1><p>{result.name} · {result.months} meses · {result.rate.toLocaleString("es-CO")}% E.A.</p></div><button className="edit-simulation" onClick={()=>{setResult(null);go(0);}}>← Editar simulación</button></div>
    <div className="savings-total-banner"><span className="total-banner-icon"><Icon name="plant" size={36}/></span><div><span>Tu ahorro estimado al final del plazo</span><strong>{money(result.balance)} <small>COP</small></strong></div><div className="total-banner-gain"><span>Tu dinero trabajando para ti</span><strong>+ {money(result.interest)}</strong><span>en intereses estimados</span></div></div>
    <div className="results-charts"><article className="evolution-panel"><div className="chart-panel-heading"><div><span className="eyebrow">PASO A PASO, MES A MES</span><h2>Tu ahorro en el tiempo</h2></div><span className="chart-period">{result.months} meses</span></div><div className="chart-inspection" aria-live="polite"><span>{chartMonth===0?"Tu punto de partida":`Mes ${chartMonth}`}</span><strong>{money(selected.balance)} <small>COP</small></strong><span>Incluye {money(selected.balance-selected.contributed)} de intereses</span></div>
    <svg viewBox="0 0 760 275" className="savings-area-chart" role="img" aria-label={`Evolución de tus aportes y saldo total durante ${result.months} meses; saldo final ${money(result.balance)}.`}><defs><linearGradient id="savings-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6e9c55" stopOpacity=".28"/><stop offset="100%" stopColor="#6e9c55" stopOpacity=".015"/></linearGradient></defs>{[0,.25,.5,.75,1].map(f=><g key={f}><line x1="65" x2="730" y1={y(result.balance*f)} y2={y(result.balance*f)} stroke="#e6ebdf" strokeDasharray="3 6"/><text x="53" y={y(result.balance*f)+4} textAnchor="end">{new Intl.NumberFormat("es-CO",{notation:"compact",maximumFractionDigits:1}).format(result.balance*f)}</text></g>)}<polygon points={`65,235 ${balancePoints} 730,235`} fill="url(#savings-fill)"/><polyline points={capitalPoints} fill="none" stroke="#b3bfaa" strokeWidth="2" strokeDasharray="6 5"/><polyline points={balancePoints} fill="none" stroke="#456f39" strokeWidth="3" strokeLinejoin="round"/><line x1={x(chartMonth)} x2={x(chartMonth)} y1={y(selected.balance)} y2="235" stroke="#71945e" strokeDasharray="4 4"/><circle cx={x(chartMonth)} cy={y(selected.balance)} r="7" fill="#fff" stroke="#456f39" strokeWidth="3"/>{[0,.25,.5,.75,1].map((f,i)=><text key={i} x={65+f*665} y="263" textAnchor={i===0?"start":i===4?"end":"middle"}>{i===0?"Hoy":`Mes ${Math.round(f*result.months)}`}</text>)}</svg>
    <label className="chart-range-label">Explora tu ahorro mes a mes<input type="range" min="0" max={result.months} value={chartMonth} onChange={e=>setChartMonth(Number(e.target.value))} aria-label="Mes para explorar"/></label><div className="chart-legend"><span><i/>Saldo con intereses</span><span><i className="capital-dot"/>Tu dinero aportado</span></div></article>
    <article className="composition-panel"><span className="eyebrow">CADA PESO CUENTA</span><h2>¿De dónde viene tu ahorro?</h2><div className="savings-donut" role="img" aria-label={`${money(result.contributed)} de aportes y ${money(result.interest)} de intereses`} style={{background:`conic-gradient(#31583e 0% ${capitalPercent}%,#b8cf8f ${capitalPercent}% 100%)`}}><div><Icon name="wallet" size={25}/><strong>{result.months}</strong><span>meses creciendo</span></div></div><div className="composition-key"><div><span><i/>Tus aportes</span><strong>{money(result.contributed)}</strong></div><div><span><i/>Intereses estimados</span><strong>{money(result.interest)}</strong></div></div><p>Aportes constantes y tiempo: una buena combinación para acercarte a tu meta.</p></article></div>
    <div className="results-next"><div><h2>Imagina lo que viene después.</h2><p>Ya hiciste cuentas. Ahora da el primer paso.</p></div><a className="button" href={`/onboarding?product=${result.id}`}>Empezar mi ahorro <Icon name="arrow" size={18}/></a></div><p className="results-disclaimer">Simulación ilustrativa en pesos colombianos (COP), con tasa constante y aportes al final de cada mes. No incluye impuestos, comisiones ni inflación. Los rendimientos no están garantizados.</p></section>;
  }

  const headings=["¿Cómo quieres empezar a ahorrar?","¿Con cuánto quieres empezar?","¿Cuánto aportarías cada mes?","¿Por cuántos meses ahorrarás?"];
  const descriptions=["Elige la cuenta que más se parece a tus planes.","Todo gran plan tiene un punto de partida.","Un pequeño hábito puede hacer una gran diferencia.","Dale tiempo a tu dinero para crecer."];
  return <section className="wizard-shell"><div className="wizard-progress" aria-label={`Paso ${step+1} de 4: ${steps[step]}`}>{steps.map((label,index)=><div className={index===step?"wizard-step current":index<step?"wizard-step completed":"wizard-step"} aria-current={index===step?"step":undefined} key={label}><span>{index<step?<Icon name="check" size={14}/>:index+1}</span><small>{label}</small></div>)}</div><form className="wizard-content" onSubmit={advance} noValidate key={step}><span className="eyebrow">TU PUNTO DE PARTIDA · PASO {step+1} DE 4</span><h1 ref={titleRef} tabIndex={-1}>{headings[step]}</h1><p className="wizard-description">{descriptions[step]}</p>
    {step===0?<fieldset className="wizard-products"><legend className="sr-only">Selecciona un producto de ahorro</legend>{products.map((p,index)=><label key={p.id} className={productId===p.id?"wizard-product selected":"wizard-product"}><input type="radio" name="product" value={p.id} checked={productId===p.id} onChange={()=>{setProductId(p.id);setError("");}}/><span className={`wizard-product-icon product-tone-${index}`}><Icon name={index===0?"sun":index===1?"flag":"plant"} size={26}/></span><strong>{p.name}</strong><span className="wizard-product-rate">{p.rate.toLocaleString("es-CO")}% <small>E.A.</small></span><span className="wizard-product-minimum">Desde {money(p.minimum)} COP</span><span className="wizard-product-choice">{productId===p.id?"Seleccionado":"Elegir producto"}<Icon name={productId===p.id?"check":"arrow"} size={15}/></span></label>)}</fieldset>:
    step===1||step===2?<div className="wizard-money-step"><label htmlFor="wizard-amount" className="sr-only">{step===1?"Monto inicial en pesos colombianos":"Aporte mensual en pesos colombianos"}</label><div className={`wizard-money-input ${error?"has-error":""}`}><span className="peso-symbol">$</span><input id="wizard-amount" type="text" inputMode="numeric" autoComplete="off" value={numberFormat(step===1?initial:monthly)} onChange={e=>{const value=digits(e.target.value);step===1?setInitial(value):setMonthly(value);setError("");}} aria-invalid={!!error} aria-describedby="wizard-amount-help" autoFocus/><ColombiaCurrency/></div><p id="wizard-amount-help">{step===1?`Monto mínimo para ${product.name}: ${money(product.minimum)} COP.`:"También puedes elegir $0 si prefieres hacer un solo aporte inicial."}</p><div className="money-suggestions" role="group" aria-label="Montos sugeridos">{(step===1?[500000,1000000,5000000]:[0,100000,200000,500000]).map(amount=><button type="button" key={amount} onClick={()=>{step===1?setInitial(String(amount)):setMonthly(String(amount));setError("");}}>{money(amount)}</button>)}</div></div>:
    <div className="wizard-months-step"><label className="wizard-month-input"><span className="sr-only">Duración del ahorro en meses</span><input type="number" min="1" max="600" step="1" value={months} onChange={e=>{setMonths(e.target.value);setError("");}} aria-invalid={!!error} aria-describedby="months-help" autoFocus/><span>meses</span></label><p id="months-help">Elige entre 1 y 600 meses.</p><div className="money-suggestions" role="group" aria-label="Plazos sugeridos">{[6,12,24,36].map(value=><button type="button" aria-pressed={months===String(value)} key={value} onClick={()=>{setMonths(String(value));setError("");}}>{value} meses</button>)}</div><div className="wizard-summary"><span>{product.name}</span><span>Inicial: {money(Number(initial))}</span><span>Mensual: {money(Number(monthly))}</span></div></div>}
    {error&&<p role="alert" className="wizard-error">{error}</p>}<div className="wizard-actions">{step>0&&<button className="wizard-back" type="button" onClick={()=>go(step-1)}>← Volver</button>}<button type="submit" className="button">{step===3?"Calcular mi ahorro":"Continuar"}<Icon name="arrow" size={18}/></button></div><span className="wizard-bottom-note"><Icon name="shield" size={14}/> Sin compromisos. A tu ritmo.</span></form></section>;
}
