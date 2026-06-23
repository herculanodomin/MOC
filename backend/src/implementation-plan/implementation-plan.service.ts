import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ImplementationPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async createAction(mocId: number, dto: CreateActionDto) {
    return this.prisma.action.create({
      data: { ...dto, mocId },
      include: { responsible: true },
    });
  }

  async findByMoc(mocId: number) {
    return this.prisma.action.findMany({
      where: { mocId },
      include: { responsible: true },
    });
  }

  async updateAction(id: number, dto: UpdateActionDto) {
    const action = await this.prisma.action.findUnique({ where: { id } });
    if (!action) throw new NotFoundException('Action not found');
    return this.prisma.action.update({
      where: { id },
      data: dto,
      include: { responsible: true },
    });
  }

  async removeAction(id: number) {
    const action = await this.prisma.action.findUnique({ where: { id } });
    if (!action) throw new NotFoundException('Action not found');
    return this.prisma.action.delete({ where: { id } });
  }
}
