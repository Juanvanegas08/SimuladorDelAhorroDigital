import type { Metadata } from "next";
import {getProducts} from "@/lib/products";
import { ProductCatalog } from "@/components/product-catalog";
export const metadata: Metadata = {title: "Productos de ahorro"};
// ISR: catálogo prerenderizado, revalidable cada hora al recibir una visita.
export const revalidate = 3600;
export default async function ProductsPage() { return <ProductCatalog products={await getProducts()}/>; }
