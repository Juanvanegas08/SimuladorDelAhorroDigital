export type Product = {id:string; name:string; type:string; rate:number; minimum:number; description:string; tag:string; icon:string; color:string; features:string[]};
export type OpeningInput = {name:string; document:string; email:string; recaptcha:string; productId?:string};
export type OpeningErrors = Partial<Record<keyof OpeningInput,string>>;
export const API_VERSION = "v1";
export function validateOpening(input:OpeningInput):OpeningErrors {
 const errors:OpeningErrors = {};
 if(input.name.trim().length<3 || input.name.trim().length>100) errors.name="Escribe tu nombre completo, entre 3 y 100 caracteres.";
 if(!/^\d{6,12}$/.test(input.document)) errors.document="Ingresa un documento de entre 6 y 12 dígitos.";
 if(input.email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email="Escribe un correo electrónico válido.";
 if(input.recaptcha!=="OK") errors.recaptcha="Completa la verificación antes de continuar.";
 return errors;
}
