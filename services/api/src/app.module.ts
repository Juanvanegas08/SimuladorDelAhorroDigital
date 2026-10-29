import {Module,Controller,Get,Post,Body,Param,Injectable,BadRequestException,NotFoundException,Header} from "@nestjs/common";
import {randomUUID} from "node:crypto";
import {validateOpening,type OpeningInput,type Product} from "@brote/contracts";
import seed from "./products.seed.json";
@Injectable()
export class ProductsService {
 private readonly products:Product[]=seed;
 all(){return this.products;}
 find(id:string){return this.products.find(p=>p.id===id);}
}
@Controller("v1")
export class ApiController {
 constructor(private readonly products:ProductsService){}
 @Get("health") health(){return {status:"ok",service:"brote-nest-api",version:"v1"};}
 @Get("products") @Header("Cache-Control","public, max-age=60") list(){return this.products.all();}
 @Get("products/:id") one(@Param("id") id:string){const p=this.products.find(id);if(!p)throw new NotFoundException("El producto no existe.");return p;}
 @Post("onboarding") create(@Body() payload:unknown){
  if(!payload || typeof payload!=="object" || Array.isArray(payload))throw new BadRequestException({message:"Revisa el formato del formulario."});
  const source=payload as Record<string,unknown>;
  const read=(key:string)=>typeof source[key]==="string"?(source[key] as string).trim():"";
  const input:OpeningInput={name:read("name"),document:read("document"),email:read("email"),recaptcha:typeof source.recaptcha==="string"?source.recaptcha:"",productId:read("productId")||undefined};
  const errors=validateOpening(input);
  if(input.productId && !this.products.find(input.productId))errors.productId="El producto seleccionado no existe.";
  if(Object.keys(errors).length)throw new BadRequestException({message:"Revisa los campos señalados.",errors});
  // Demostración: no persistir ni imprimir datos personales.
  return {code:randomUUID(),productId:input.productId??null,message:"Tu intención de apertura fue registrada en esta demostración."};
 }
}
@Module({controllers:[ApiController],providers:[ProductsService]})
export class AppModule{}
