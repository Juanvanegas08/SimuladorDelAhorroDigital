# Brote · Simulador del Ahorro Digital

Prueba técnica frontend: Next.js + TypeScript, backend NestJS y microfrontends mediante Next.js Multi-Zones. Incluye catálogo con ISR y debounce, simulador de rentabilidad y registro de intención de apertura.

Identidad visual ficticia propia. No utiliza logos ni imágenes del Banco Caja Social. Los productos, tasas y solicitudes son de demostración. La portada incorpora un retrato generado con IA y tarjetas de sueños animadas; el recurso y el prompt están documentados en `ART_DIRECTION.md`.

## Inicio rápido

Requisitos: Node.js 24 recomendado (mínimo 20.9 para las versiones fijadas) y npm. Los puertos 3000, 3001, 3002 y 4000 deben estar disponibles.

```bash
npm ci
npm run dev
```

Abrir **http://127.0.0.1:3000/products**. Un solo comando construye los contratos e inicia API, simulador, registro y shell. `Ctrl+C` detiene los procesos que creó. El servicio NestJS se compila al arrancar; si cambias su código en desarrollo, reinicia `npm run dev`.

No se necesitan claves, base de datos ni variables de entorno para ejecutar localmente. La primera instalación necesita conexión a npm. Las fuentes de Google son opcionales y tienen respaldo del sistema.

## Compilar y ejecutar producción

```bash
npm run build
npm start
```

El build compila contratos y NestJS, inicia una API temporal si hace falta para prerenderizar el catálogo, compila las tres aplicaciones y detiene la API temporal que creó. `npm start` arranca los cuatro servicios compilados. No ejecutes dos conjuntos de servicios en los mismos puertos simultáneamente.

## Verificación

```bash
npm test
npm run typecheck
```

Con `npm start` o `npm run dev` activo en otra terminal:

```bash
npm run test:integration
```

Hay 7 pruebas de dominio y 14 comprobaciones de integración HTTP. La compilación verifica TypeScript de las tres aplicaciones y de NestJS. Los resultados de revisión manual están en `VALIDACION.md`.

## Arquitectura y microfrontends

La aplicación principal es el **shell/catálogo** en el puerto 3000. Usa rewrites para presentar las otras aplicaciones bajo el mismo origen:

- Shell, raíz del repositorio: `/products` y `/api/onboarding` en 3000.
- `apps/simulator`: `/simulator` en 3001, assets con prefijo `/simulator-static`.
- `apps/onboarding`: `/onboarding` en 3002, assets con prefijo `/onboarding-static`.
- `services/api`: NestJS con contrato HTTP `/v1` en 4000.
- `packages/contracts`: tipos y validación de registro compartidos, compilados como paquete de workspace.

Cada frontend tiene su propia compilación y proceso. Simulador y registro pueden compilarse y desplegarse separadamente desde el mismo monorepo. Comparten navegación, estilo e iconos desde `src`; cada zona mantiene su página y componente de negocio en su propia aplicación. Los prefijos de assets evitan mezclar JavaScript y CSS entre compilaciones.

Este es el enfoque Multi-Zones documentado oficialmente por Next.js: composición por rutas, con navegación completa entre zonas mediante enlaces `<a>`. No se utiliza Module Federation ni se carga un frontend dentro de un iframe. Elegí este enfoque para conservar SSR/ISR nativos y evitar incompatibilidades de federación con App Router.

### Comunicación entre zonas

El catálogo navega a `/simulator?product=metas`; el simulador pasa el mismo identificador a `/onboarding?product=metas`. El registro muestra el producto seleccionado y lo envía como `productId` a NestJS. Cada zona vuelve a resolver el producto desde la API; una referencia desconocida devuelve 404.

La URL es el contrato de navegación. No se usa un store global ni eventos de `window` porque las zonas tienen documentos y ciclos de vida separados. Los datos personales permanecen en el formulario de registro y no se colocan en la URL. Los formularios sin enviar y los montos de una simulación no persisten al cambiar de zona.

El navegador envía el registro a `/api/onboarding` en el origen visible. Este endpoint actúa como BFF: reenvía a NestJS, conserva errores/estados HTTP y devuelve 503 amigable si no puede conectar. NestJS vuelve a validar todos los datos, verifica el token y genera el UUID. La API no necesita exponer CORS abierto: la comunicación de datos se hace entre servidores.

### Despliegue independiente

Después de `npm ci` y `npm run build --workspace @brote/contracts`, cada unidad tiene comandos separados:

```bash
npm run build --workspace @brote/api
npm run build --workspace @brote/simulator
npm run build --workspace @brote/onboarding
npm run build:shell
```

Para desplegar cada zona conserva el monorepo como contexto de compilación, porque importa el diseño compartido de `src`. El catálogo requiere acceso a la API durante su build ISR. Configura `SIMULATOR_ORIGIN` y `ONBOARDING_ORIGIN` en el shell **antes de compilar**, con las URLs internas de las zonas. Configura `API_ORIGIN` en los tres frontends para consultar NestJS. El servicio acepta `API_PORT` y `API_HOST` (por ejemplo, `0.0.0.0` dentro de un contenedor). `scripts/run.mjs` está pensado para desarrollo/demostración local con los puertos anteriores; en producción usa un supervisor por aplicación.

## Backend NestJS

- `GET /v1/health`: identificación y estado del servicio.
- `GET /v1/products`: catálogo completo.
- `GET /v1/products/:id`: detalle o 404.
- `POST /v1/onboarding`: validación de campos/recaptcha; 201 con UUID y producto elegido, o 400 con errores por campo.

Ejemplo de cuerpo:

```json
{
  "name": "Ana Demo",
  "document": "123456789",
  "email": "ana@example.com",
  "recaptcha": "OK",
  "productId": "metas"
}
```

`productId` es opcional; si se proporciona debe existir. La fuente de demostración del servicio es `services/api/src/products.seed.json`, cargada en memoria. **Los frontends consumen HTTP y ya no importan JSON local.** No se implementó base de datos porque el reto no la exige. Las solicitudes se procesan sin persistencia, sin correos y sin imprimir datos personales; el UUID demuestra el flujo y no es consultable después.

## Catálogo: elección de ISR

`src/app/products/page.tsx` y la consulta HTTP al servicio usan revalidación de 3600 segundos. El catálogo cambia poco, por lo que se prerenderiza y se reutiliza entre visitas. El HTML inicial contiene los productos; los filtros en cliente tienen debounce de 300 ms e ignoran tildes y mayúsculas. La búsqueda por nombre/tipo y los botones de tipo se pueden combinar; hay estado vacío y limpieza de filtros.

Cuando NestJS actualiza su catálogo, Next puede obtener los datos renovados al revalidar bajo demanda de una visita; no es un proceso que consulte cada hora sin tráfico. SSR sería preferible para productos personalizados por usuario. El seed empaquetado de NestJS se cambia desplegando el backend; una base de datos permitiría actualizar productos sin recompilarlo.

## Fórmula y validaciones del simulador

Se elige la tasa ficticia efectiva anual del producto. La tasa efectiva mensual se calcula así:

`i = (1 + tasaEA / 100)^(1/12) - 1`

Se asume que cada aporte entra **al final del mes**:

`saldo_mes = saldo_mes_anterior * (1 + i) + aporte_mensual`

El capital aportado es `inicial + aporte * meses`; los intereses son `saldo_final - capital_aportado`. Se recorre cada mes para generar el gráfico. La precisión se conserva durante el cálculo; se redondea solo al mostrar pesos COP. El caso de tasa cero funciona sin divisiones especiales.

Plazo entero de 1 a 600 meses, montos entre cero y 1 billón COP por entrada, mínimo inicial según producto, y al menos un monto mayor que cero. El simulador muestra una pantalla centrada por paso: producto, capital inicial, aporte mensual y plazo. Los montos usan formato colombiano, distintivo COP y bandera de Colombia. El resultado separa aportes, intereses y saldo total, con una gráfica de evolución exploratoria por mes y una gráfica circular de composición. No considera impuestos, comisiones, inflación ni cambios de tasa; no garantiza rentabilidad.

## Registro y accesibilidad

Nombre de 3 a 100 caracteres, documento de 6 a 12 dígitos y correo con validación básica. Son reglas de demostración, no validación oficial de identidad. `@brote/contracts` comparte reglas entre cliente y NestJS.

Una verificación visual de demostración pide seleccionar el símbolo del brote, muestra error en una selección incorrecta y confirma la comprobación antes de llenar el campo oculto `recaptcha` con el literal `OK`. Cualquier otro token falla en NestJS. Es una simulación explícita, sin protección real contra bots. Usa datos ficticios.

Diseño adaptable, etiquetas visibles, foco visible, enlace para saltar al contenido, `aria-invalid`, errores asociados con `aria-describedby` y resultados con `aria-live`. La portada mantiene la órbita en movimiento continuo, sin controles de pausa ni interrupción al pasar el puntero, según el diseño solicitado.

## Estructura

```text
src/app/              Shell, catálogo, BFF y diseño común
src/components/       Catálogo, portada, iconos y navegación compartida
src/lib/              Consulta HTTP de servidor y cálculo de ahorro
apps/simulator/       Microfrontend del simulador
apps/onboarding/      Microfrontend del registro
services/api/         Servicio NestJS y catálogo de demostración
packages/contracts/  Tipos y reglas de validación compartidos
scripts/              Orquestación, compilación y pruebas de integración
tests/                Pruebas de dominio
```

## Entrega

Implementa el reto principal y los extras de NestJS y microfrontends. El código está preparado y verificado localmente para entregarse mediante este repositorio. No se ha realizado un despliegue público; para evaluar la aplicación utiliza las instrucciones de inicio rápido.

Referencias: [Next.js Multi-Zones](https://nextjs.org/docs/app/guides/multi-zones) y [NestJS](https://docs.nestjs.com/v11/first-steps).
