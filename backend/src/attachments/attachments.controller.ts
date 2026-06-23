import {
  Controller, Get, Post, Delete, Param, ParseIntPipe,
  UseGuards, UseInterceptors, UploadedFile, Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';
import { Response } from 'express';
import * as path from 'path';

@Controller('mocs/:mocId/attachments')
@UseGuards(AuthGuard('jwt'))
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('mocId', ParseIntPipe) mocId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attachmentsService.upload(mocId, file);
  }

  @Get()
  findAll(@Param('mocId', ParseIntPipe) mocId: number) {
    return this.attachmentsService.findByMoc(mocId);
  }

  @Get(':id/download')
  async download(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { attachment, filePath } = await this.attachmentsService.getFile(id);
    res.setHeader('Content-Type', attachment.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.fileName}"`);
    res.sendFile(path.resolve(filePath));
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attachmentsService.remove(id);
  }
}
