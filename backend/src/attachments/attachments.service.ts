import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AttachmentsService {
  private uploadDir: string;

  constructor(private readonly prisma: PrismaService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(mocId: number, file: Express.Multer.File) {
    const moc = await this.prisma.moc.findUnique({ where: { id: mocId } });
    if (!moc) throw new NotFoundException('MOC not found');

    const fileName = `${uuid()}${path.extname(file.originalname)}`;
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    return this.prisma.attachment.create({
      data: {
        mocId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        fileUrl: fileName,
      },
    });
  }

  async findByMoc(mocId: number) {
    return this.prisma.attachment.findMany({ where: { mocId } });
  }

  async remove(id: number) {
    const attachment = await this.prisma.attachment.findUnique({ where: { id } });
    if (!attachment) throw new NotFoundException('Attachment not found');
    const filePath = path.join(this.uploadDir, attachment.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return this.prisma.attachment.delete({ where: { id } });
  }

  async getFile(id: number) {
    const attachment = await this.prisma.attachment.findUnique({ where: { id } });
    if (!attachment) throw new NotFoundException('Attachment not found');
    const filePath = path.join(this.uploadDir, attachment.fileUrl);
    if (!fs.existsSync(filePath)) throw new NotFoundException('File not found');
    return { attachment, filePath };
  }
}
