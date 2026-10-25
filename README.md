# DIVIA + Hospital Evelyn

Plataforma de telemedicina, seguimiento clínico y cuidado integral para pacientes, profesionales de salud y equipos de atención domiciliaria.

## Descripción del servicio

DIVIA conecta a pacientes con profesionales de la salud a través de una experiencia digital clara, segura y centrada en la persona. La plataforma permite:

- Solicitar turnos de telemedicina.
- Gestionar consultas y seguimiento clínico.
- Coordinar atención domiciliaria e internación en casa.
- Monitorear signos vitales y continuidad de cuidado.
- Brindar un asistente virtual (Divia4) para orientar a pacientes y reducir fricción en la atención.

## Stack tecnológico

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Cloudflare Workers / Wrangler
- D1 Database

## Funcionalidades principales

- Acceso para pacientes y profesionales.
- Paneles de usuario diferenciados por tipo de perfil.
- Flujo de login y registro.
- Dashboard clínico y de seguimiento.
- Telemedicina con coordinación de citas y atención en vivo.
- Seguridad y trazabilidad de procesos clínicos.

## Requisitos

- Node.js 18 o superior
- npm
- Wrangler CLI (si vas a trabajar con el backend de Cloudflare)

## Instalación

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

La aplicación queda disponible en:

- http://localhost:3000

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run wrangler:dev
npm run wrangler:deploy
```

## Variables de entorno

El proyecto incluye un ejemplo en `.env.example`. Copialo y ajustá los valores necesarios antes de correr la aplicación.

```bash
cp .env.example .env.local
```

## Estructura principal

```text
src/
├── components/
├── db/
├── lib/
├── pages/
│   ├── api/
│   ├── dashboard/
│   ├── _app.tsx
│   ├── index.tsx
│   └── login.tsx
├── styles/
├── workers/
└── workerworkers.js
```

## Misión

Acompañar a las personas con un modelo de atención más cercano, inteligente y sostenible, combinando tecnología, coordinación clínica y cuidado humano.

## Estado del proyecto

Proyecto en desarrollo activo con enfoque en telemedicina, gestión clínica y experiencia de usuario para atención integral.
