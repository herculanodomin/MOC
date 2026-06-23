# MOC - Management of Change

Sistema web para controle, aprovação, implementação e encerramento de mudanças operacionais.

## Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** NestJS + TypeScript
- **ORM:** Prisma
- **Banco:** SQLite
- **Autenticação:** JWT

## Estrutura

```
MOC/
├── backend/          # API NestJS
├── frontend/         # App React
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
# 1. Backend
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run start:dev

# 2. Frontend
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Acesse `http://localhost:5173` — login padrão: `admin@moc.com` / `123456`

## Fluxo Completo

Solicitação → Aceitação → Avaliação de Risco → Plano de Implementação → Aprovação → Implementação → PSSR → Validação → Encerramento

## Contas de Teste

| Email | Role | Senha |
|-------|------|-------|
| admin@moc.com | ADMIN | 123456 |
| acceptor@moc.com | CHANGE_ACCEPTOR | 123456 |
| requester@moc.com | REQUESTER | 123456 |
| approver@moc.com | CHANGE_APPROVER | 123456 |
| owner@moc.com | CHANGE_OWNER | 123456 |
| reviewer@moc.com | REVIEWER | 123456 |
