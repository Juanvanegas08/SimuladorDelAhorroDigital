import { NextResponse } from "next/server";
import { API_ORIGIN } from "@/lib/products";
export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({message: "El formulario no tiene un formato válido."}, {status: 400}); }
  try {
    const response=await fetch(`${API_ORIGIN}/v1/onboarding`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),cache:"no-store",signal:AbortSignal.timeout(5000)});
    return NextResponse.json(await response.json(),{status:response.status,headers:{"Cache-Control":"no-store"}});
  } catch {return NextResponse.json({message:"No pudimos conectar con el servicio. Intenta de nuevo en un momento."},{status:503});}
}
