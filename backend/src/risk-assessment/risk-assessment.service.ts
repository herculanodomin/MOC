import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateRiskDto } from './dto/create-risk.dto';

@Injectable()
export class RiskAssessmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(mocId: number, dto: CreateRiskDto) {
    const riskScore = dto.probability * dto.severity;
    const riskLevel = this.calculateRiskLevel(riskScore);

    return this.prisma.riskAssessment.create({
      data: {
        ...dto,
        riskScore,
        riskLevel,
        mocId,
      },
    });
  }

  async findByMoc(mocId: number) {
    return this.prisma.riskAssessment.findMany({
      where: { mocId },
    });
  }

  async remove(id: number) {
    const risk = await this.prisma.riskAssessment.findUnique({ where: { id } });
    if (!risk) throw new NotFoundException('Risk assessment not found');
    return this.prisma.riskAssessment.delete({ where: { id } });
  }

  private calculateRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (score <= 4) return 'LOW';
    if (score <= 12) return 'MEDIUM';
    return 'HIGH';
  }
}
