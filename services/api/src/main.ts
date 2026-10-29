import "reflect-metadata";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
async function bootstrap(){const app=await NestFactory.create(AppModule);app.enableShutdownHooks();await app.listen(Number(process.env.API_PORT??4000),process.env.API_HOST??"127.0.0.1");}
bootstrap().catch(error=>{console.error("No se pudo iniciar la API:",error);process.exit(1);});
