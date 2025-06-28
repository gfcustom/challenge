Preguntas / aclaraciones
Implementé NoSQL (MongoDB) por rapidez y flexibilidad, que cumple con índices y filtrado.
El middleware auth usa JWT con un secret simple para un mock de token. 
Paginación simple y configurable con límites max para evitar exceso de consumo.
Validaciones incluyen formato CUIT, fechas ISO y fields minimos.
Principio de Inversión de Dependencias aplicado con interfaces para repositorios.
Persistencia y consulta hacen filtrado y límite directo en base.
Se podrían optimizar queries con índices compuestos en Mongo (p.ej. fecha + empresa).
 

Para levantar:

Clonar repo
Instalar dependencias
Configurar .env
Levantar MongoDB local
node src/api/app.js
Test con npm test (jest)

WORKSPACE postman web público:
https://web.postman.co/9e9ec6ef-b068-4fa0-ba8e-9b006cf1cda3