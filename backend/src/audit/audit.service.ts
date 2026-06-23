import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(data: {
    userId: number;
    action: string;
    entityType: string;
    entityId?: number;
    mocId?: number;
    details?: string;
  }) {
    return this.prisma.auditLog.create({ data });
  }

  async findByMoc(mocId: number) {
    return this.prisma.auditLog.findMany({
      where: { mocId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(filters?: { entityType?: string; userId?: number }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(filters?.entityType && { entityType: filters.entityType }),
        ...(filters?.userId && { userId: filters.userId }),
      },
      include: { user: { select: { id: true, name: true, email: true } }, moc: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
