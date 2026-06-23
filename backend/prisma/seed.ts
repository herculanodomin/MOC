import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: { email: 'admin@moc.com', passwordHash, name: 'Administrador', role: 'ADMIN', department: 'TI' },
  });
  const acceptor = await prisma.user.create({
    data: { email: 'acceptor@moc.com', passwordHash, name: 'Maria Aceitadora', role: 'CHANGE_ACCEPTOR', department: 'Operações' },
  });
  const requester = await prisma.user.create({
    data: { email: 'requester@moc.com', passwordHash, name: 'João Solicitante', role: 'CHANGE_REQUESTER', department: 'Operações' },
  });
  const approver = await prisma.user.create({
    data: { email: 'approver@moc.com', passwordHash, name: 'Pedro Aprovador', role: 'CHANGE_APPROVER', department: 'Gerência' },
  });
  const owner = await prisma.user.create({
    data: { email: 'owner@moc.com', passwordHash, name: 'Carlos Owner', role: 'CHANGE_OWNER', department: 'Manutenção' },
  });
  const reviewer = await prisma.user.create({
    data: { email: 'reviewer@moc.com', passwordHash, name: 'Ana Revisora', role: 'CHANGE_REVIEW_TEAM', department: 'SMS' },
  });

  console.log(`Seeded 6 users`);
  console.log('--- User IDs (fixos, use estes para testes) ---');
  console.log(`ADMIN:      id=1  admin@moc.com`);
  console.log(`ACCEPTOR:   id=2  acceptor@moc.com  (Maria Aceitadora)`);
  console.log(`REQUESTER:  id=3  requester@moc.com  (João Solicitante)`);
  console.log(`APPROVER:   id=4  approver@moc.com  (Pedro Aprovador)`);
  console.log(`OWNER:      id=5  owner@moc.com     (Carlos Owner)`);
  console.log(`REVIEWER:   id=6  reviewer@moc.com   (Ana Revisora)`);
  console.log('Default password for all users: 123456');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
