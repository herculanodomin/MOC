import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateApprovalDto } from './dto/create-approval.dto';

@Injectable()
export class ApprovalService {
  constructor(private readonly prisma: PrismaService) {}

  async approve(mocId: number, dto: CreateApprovalDto, approverId: number) {
    const moc = await this.prisma.moc.findUnique({
      where: { id: mocId },
      include: { riskAssessments: true },
    });

    if (!moc) throw new BadRequestException('MOC not found');

    const approvalCount = await this.prisma.approval.count({
      where: { mocId },
    });

    return this.prisma.approval.create({
      data: {
        mocId,
        approverId,
        comments: dto.comments,
        isApproved: dto.isApproved,
        approvalOrder: approvalCount + 1,
      },
      include: { approver: true },
    });
  }

  async findByMoc(mocId: number) {
    return this.prisma.approval.findMany({
      where: { mocId },
      include: { approver: true },
      orderBy: { approvalOrder: 'asc' },
    });
  }
}
