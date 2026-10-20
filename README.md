# API de Gestión de Citas Médicas

API REST con Node.js (Express), MySQL y Prisma, organizada por capas.

## Arquitectura por capas

```
Cliente -> Rutas -> Validación -> Controlador -> Servicio -> Repositorio -> MySQL (Prisma)
```

| Carpeta | Responsabilidad |
|---|---|
| `src/routes` | Define los endpoints y enlaza cada uno con su validador y su controlador |
| `src/validators` | Esquemas de Zod que validan los datos de entrada |
| `src/middlewares` | Validación genérica, rutas inexistentes (404) y manejo central de errores |
| `src/controllers` | Reciben la petición HTTP, llaman al servicio y devuelven la respuesta con el código HTTP |
| `src/services` | Lógica de negocio (paciente y médico existen, no hay cita doble, cambios de estado válidos) |
| `src/repositories` | Acceso a datos: único lugar donde se usa Prisma Client |
| `src/config` | Instancia de Prisma Client |
| `src/utils` | `AppError` (errores con código HTTP) y `asyncHandler` |
| `prisma/schema.prisma` | Modelos Patient, Doctor y Appointment (tablas en español en MySQL) |

## Endpoints

| Método | Ruta | Descripción | Códigos |
|---|---|---|---|
| POST | /patients | Registrar paciente | 201, 400, 409 |
| GET | /patients | Listar pacientes | 200 |
| POST | /doctors | Registrar médico | 201, 400, 409 |
| GET | /doctors | Listar médicos | 200 |
| POST | /appointments | Programar cita | 201, 400, 404, 409 |
| GET | /appointments | Listar citas (filtros: `date`, `status`, `patientId`, `doctorId`) | 200, 400 |
| GET | /appointments/:id | Consultar una cita | 200, 400, 404 |
| PATCH | /appointments/:id/status | Cambiar estado | 200, 400, 404, 409 |
| DELETE | /appointments/:id | Cancelar (cancelación lógica, conserva el historial) | 200, 404, 409 |
| GET | /health | Verificar que la API responde | 200 |

Estados: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`.
Cambios permitidos: PENDING -> CONFIRMED | CANCELLED; CONFIRMED -> COMPLETED | CANCELLED.

## Cómo ejecutarla

1. Tener MySQL corriendo (en Docker) y Node.js 18 o superior.
2. Copiar `.env.example` como `.env` y poner la contraseña real de MySQL.
3. `npm install`
4. `npx prisma migrate dev --name init` (crea la base `citas_medicas_api` y las tablas)
5. `npm run dev`
6. Probar: http://localhost:3000/health
