import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis() {
    const [total, open, closed, overdue] = await Promise.all([
      this.prisma.moc.count(),
      this.prisma.moc.count({
        where: { status: { in: ['DRAFT', 'PENDING_ACCEPTANCE', 'UNDER_REVIEW', 'RISK_ASSESSMENT', 'IMPLEMENTATION_PLANNING', 'PENDING_APPROVAL', 'APPROVED', 'IN_IMPLEMENTATION', 'PSSR_PENDING'] } },
      }),
      this.prisma.moc.count({
        where: { status: { in: ['IMPLEMENTED', 'CLOSED'] } },
      }),
      this.prisma.moc.count({
        where: { status: 'IN_IMPLEMENTATION' },
      }),
    ]);

    return { total, open, closed, overdue };
  }

  async getByArea() {
    return this.prisma.moc.groupBy({
      by: ['responsibleArea'],
      _count: { id: true },
    });
  }

  async getByType() {
    return this.prisma.moc.groupBy({
      by: ['changeType'],
      _count: { id: true },
    });
  }

  async getByRiskLevel() {
    return this.prisma.moc.groupBy({
      by: ['riskLevel'],
      _count: { id: true },
    });
  }

  async getByStatus() {
    return this.prisma.moc.groupBy({
      by: ['status'],
      _count: { id: true },
    });
  }
}
