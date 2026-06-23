import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateMocDto } from './dto/create-moc.dto';
import { UpdateMocDto } from './dto/update-moc.dto';
import { AcceptMocDto } from './dto/accept-moc.dto';
import { CloseMocDto } from './dto/close-moc.dto';
import { SubmitMocDto } from './dto/submit-moc.dto';

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['PENDING_ACCEPTANCE'],
  PENDING_ACCEPTANCE: ['RISK_ASSESSMENT', 'REJECTED'],
  RISK_ASSESSMENT: ['IMPLEMENTATION_PLANNING'],
  IMPLEMENTATION_PLANNING: ['PENDING_APPROVAL'],
  PENDING_APPROVAL: ['APPROVED', 'REJECTED'],
  APPROVED: ['IN_IMPLEMENTATION'],
  IN_IMPLEMENTATION: ['PSSR_PENDING'],
  PSSR_PENDING: ['IMPLEMENTED'],
  IMPLEMENTED: ['CLOSED'],
  REJECTED: [],
  CANCELLED: [],
  CLOSED: [],
};

@Injectable()
export class MocService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMocDto, requesterId: number) {
    return this.prisma.moc.create({
      data: { ...dto, requesterId, status: 'DRAFT' },
      include: { requester: true },
    });
  }

  async findAll(filters?: { status?: string; requesterId?: number }) {
    return this.prisma.moc.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.requesterId && { requesterId: filters.requesterId }),
      },
      include: {
        requester: true,
        acceptor: true,
        owner: true,
        riskAssessments: true,
        actions: true,
        approvals: true,
        pssrItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const moc = await this.prisma.moc.findUnique({
      where: { id },
      include: {
        requester: true,
        acceptor: true,
        owner: true,
        attachments: true,
        riskAssessments: true,
        actions: { include: { responsible: true } },
        approvals: { include: { approver: true } },
        pssrItems: true,
        closureInfo: true,
        auditLogs: { include: { user: true } },
        notifications: true,
      },
    });
    if (!moc) throw new NotFoundException('MOC not found');
    return moc;
  }

  async update(id: number, dto: UpdateMocDto) {
    await this.findById(id);
    return this.prisma.moc.update({ where: { id }, data: dto });
  }

  async submitForAcceptance(id: number, dto: SubmitMocDto, userId: number) {
    const moc = await this.findById(id);
    if (moc.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT MOCs can be submitted');
    }
    if (moc.requesterId !== userId) {
      throw new BadRequestException('Only the requester can submit');
    }
    return this.prisma.moc.update({
      where: { id },
      data: { status: 'PENDING_ACCEPTANCE', acceptorId: dto.acceptorId, ownerId: dto.ownerId },
    });
  }

  async accept(id: number, dto: AcceptMocDto, userId: number) {
    const moc = await this.findById(id);
    if (moc.status !== 'PENDING_ACCEPTANCE') {
      throw new BadRequestException('MOC is not pending acceptance');
    }
    if (moc.acceptorId !== userId) {
      throw new BadRequestException('Only the assigned acceptor can accept');
    }
    if (dto.accepted) {
      return this.prisma.moc.update({
        where: { id },
        data: { status: 'RISK_ASSESSMENT', acceptedAt: new Date() },
      });
    }
    return this.prisma.moc.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  async advanceStatus(id: number, userId: number) {
    const moc = await this.findById(id);
    const current = moc.status;
    const nextStatus = this.getNextStatus(current);

    if (!nextStatus) {
      throw new BadRequestException(`No valid transition from ${current}`);
    }

    const allowed = VALID_TRANSITIONS[current] || [];
    if (!allowed.includes(nextStatus)) {
      throw new BadRequestException(`Cannot transition from ${current} to ${nextStatus}`);
    }

    await this.validateTransition(moc, nextStatus);

    const updateData: any = { status: nextStatus };

    if (nextStatus === 'IN_IMPLEMENTATION') updateData.startedAt = new Date();
    if (nextStatus === 'IMPLEMENTED') updateData.completedAt = new Date();

    return this.prisma.moc.update({ where: { id }, data: updateData });
  }

  async setRiskLevel(id: number, riskLevel: string) {
    return this.prisma.moc.update({
      where: { id },
      data: { riskLevel },
    });
  }

  async close(id: number, dto: CloseMocDto) {
    const moc = await this.findById(id);
    if (moc.status !== 'IMPLEMENTED') {
      throw new BadRequestException('Only IMPLEMENTED MOCs can be closed');
    }
    await this.prisma.closureInfo.create({
      data: { mocId: id, ...dto },
    });
    return this.prisma.moc.update({
      where: { id },
      data: { status: 'CLOSED', completedAt: new Date() },
    });
  }

  private getNextStatus(current: string): string | null {
    const flow = [
      'DRAFT', 'PENDING_ACCEPTANCE', 'RISK_ASSESSMENT',
      'IMPLEMENTATION_PLANNING', 'PENDING_APPROVAL', 'APPROVED',
      'IN_IMPLEMENTATION', 'PSSR_PENDING', 'IMPLEMENTED', 'CLOSED',
    ];
    const idx = flow.indexOf(current);
    if (idx === -1 || idx >= flow.length - 1) return null;
    return flow[idx + 1];
  }

  private async validateTransition(moc: any, nextStatus: string) {
    if (nextStatus === 'PENDING_APPROVAL') {
      const risks = await this.prisma.riskAssessment.count({ where: { mocId: moc.id } });
      if (risks === 0) {
        throw new BadRequestException('Add at least one risk assessment before requesting approval');
      }
    }

    if (nextStatus === 'PSSR_PENDING') {
      const actions = await this.prisma.action.findMany({ where: { mocId: moc.id } });
      if (actions.length === 0 || !actions.every((a) => a.status === 'COMPLETED')) {
        throw new BadRequestException('All implementation actions must be completed before PSSR');
      }
      const pssrItems = await this.prisma.pssrItem.findMany({ where: { mocId: moc.id } });
      if (pssrItems.length === 0) {
        throw new BadRequestException('No PSSR items found');
      }
    }

    if (nextStatus === 'IMPLEMENTED') {
      const pssrItems = await this.prisma.pssrItem.findMany({ where: { mocId: moc.id } });
      if (pssrItems.length === 0 || !pssrItems.every((i) => i.isCompleted)) {
        throw new BadRequestException('All PSSR items must be completed before implementation');
      }
    }

    if (nextStatus === 'APPROVED') {
      const approvals = await this.prisma.approval.findMany({ where: { mocId: moc.id } });
      if (approvals.length === 0) {
        throw new BadRequestException('At least one approval is required');
      }
    }
  }
}
