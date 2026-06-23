import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PssrService {
  constructor(private readonly prisma: PrismaService) {}

  async createItem(mocId: number, description: string) {
    return this.prisma.pssrItem.create({
      data: { mocId, description },
    });
  }

  async findByMoc(mocId: number) {
    return this.prisma.pssrItem.findMany({
      where: { mocId },
    });
  }

  async completeItem(id: number) {
    const item = await this.prisma.pssrItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('PSSR item not found');

    return this.prisma.pssrItem.update({
      where: { id },
      data: { isCompleted: true, completedAt: new Date() },
    });
  }

  async removeItem(id: number) {
    const item = await this.prisma.pssrItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('PSSR item not found');
    return this.prisma.pssrItem.delete({ where: { id } });
  }

  async isComplete(mocId: number): Promise<boolean> {
    const items = await this.prisma.pssrItem.findMany({ where: { mocId } });
    return items.length > 0 && items.every((i) => i.isCompleted);
  }
}
