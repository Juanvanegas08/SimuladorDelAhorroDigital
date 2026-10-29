import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getProducts} from "@/lib/products";
import {OnboardingForm} from "../../src/onboarding-form";
export const metadata:Metadata={title:"Empieza tu ahorro"};
export default async function Page({searchParams}:{searchParams:Promise<{product?:string}>}){
 const {product}=await searchParams;const products=await getProducts();const selected=product?products.find(p=>p.id===product):undefined;
 if(product&&!selected)notFound();
 return <OnboardingForm productId={selected?.id} productName={selected?.name}/>;
}
