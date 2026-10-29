# Validación de la entrega

Verificado el 29 de octubre de 2026 en Windows, Node 24.22.1.

## Automatizado

- `npm run build`: contratos, API NestJS, simulador, registro y shell compilan correctamente, incluido el tipado de todas las aplicaciones.
- La salida de Next confirma `/products` con ISR de una hora y `/simulator` y `/onboarding` en sus aplicaciones separadas.
- `npm test`: 7 pruebas aprobadas (tasa anual, tasa cero, momento del aporte, límites y validación de registro/recaptcha).
- `npm run test:integration`: 14 comprobaciones aprobadas contra los servicios de producción activos: salud de NestJS, catálogo, producto desconocido, HTML ISR, rutas y bundles independientes de cada zona, producto inválido, recaptcha, tipos de campos, UUID y producto conservado, tanto directo a NestJS como por el BFF.

## Navegador

- Portada de sueños inspeccionada en escritorio y móvil de 390 px. Revisión posterior: frases auxiliares y control de pausa retirados; animación continua y retrato fundido con el fondo.
- Búsqueda con debounce sin coincidencias y limpieza de filtros.
- Validación de monto negativo; simulación sin aporte mensual.
- Con Multi-Zones activo: catálogo → Ahorro con Metas → simulador conserva producto y tasa del 9,2%.
- Interacción real en el microfrontend: $1.000.000 inicial, aporte cero y 12 meses muestra $1.092.000.
- Simulador → registro conserva `product=metas` y muestra el producto seleccionado.
- Envío desde el microfrontend de registro con datos ficticios → BFF → NestJS devuelve UUID y muestra confirmación.
- Simulador actualizado: cuatro pantallas centradas, una por paso, con COP y bandera de Colombia en ambos montos; validación del mínimo antes de avanzar.
- Resultados: gráfica de evolución, exploración interactiva por mes y gráfica circular de aportes/intereses verificadas.
- Verificación visual simulada: bloquea el envío sin completar, muestra error con un símbolo incorrecto y permite obtener el UUID al seleccionar el brote.

## Límites y pendientes

Los datos del catálogo se inicializan en memoria desde un seed del backend. Las solicitudes no se guardan, no se envían correos y el recaptcha es simulado. No se abren cuentas reales. No se ha realizado un despliegue público. Los extras NestJS y microfrontends están implementados.
