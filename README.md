# MOC - Management of Change

Sistema web para controle, aprovação, implementação e encerramento de mudanças operacionais.

## Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** NestJS + TypeScript
- **ORM:** Prisma
- **Banco:** PostgreSQL
- **Autenticação:** JWT

## Estrutura

```
MOC/
├── backend/          # API NestJS
├── frontend/         # App React
├── database/         # Docker Compose
└── docs/             # Documentação
```

## Módulos

1. Gestão de Usuários
2. Registro de MOC
3. Avaliação da Mudança
4. Avaliação de Riscos
5. Plano de Implementação
6. Aprovação
7. Implementação
8. PSSR (Pre-Startup Safety Review)
9. Encerramento
10. Notificações
11. Dashboard Gerencial
12. Auditoria

## Quick Start

```bash
# 1. Subir PostgreSQL
cd database && docker compose up -d

# 2. Backend
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173` — login padrão: `admin@moc.com` / `123456`

## Fluxo Completo

Solicitação → Aceitação → Avaliação de Risco → Plano de Implementação → Aprovação → Implementação → PSSR → Validação → Encerramento
