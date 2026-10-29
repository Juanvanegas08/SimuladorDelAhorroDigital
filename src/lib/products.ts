import "server-only";
import type {Product} from "@brote/contracts";
export const API_ORIGIN=process.env.API_ORIGIN??"http://127.0.0.1:4000";
export async function getProducts():Promise<Product[]>{
 const response=await fetch(`${API_ORIGIN}/v1/products`,{next:{revalidate:3600},signal:AbortSignal.timeout(5000)});
 if(!response.ok)throw new Error("El catálogo no está disponible. Comprueba que la API esté iniciada.");
 const products=await response.json() as Product[];
 if(!Array.isArray(products)||!products.length)throw new Error("El catálogo está vacío.");
 return products;
}
