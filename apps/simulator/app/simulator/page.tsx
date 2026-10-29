import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getProducts} from "@/lib/products";
import {Simulator} from "../../src/simulator";
export const metadata:Metadata={title:"Simula tu ahorro"};
export default async function Page({searchParams}:{searchParams:Promise<{product?:string}>}){
 const {product}=await searchParams;const products=await getProducts();
 const selected=product?products.find(p=>p.id===product):products[0];
 if(!selected)notFound();
 return <Simulator key={selected.id} initialProduct={selected.id} products={products}/>;
}
