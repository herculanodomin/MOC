import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PssrService } from './pssr.service';

@Controller('mocs/:mocId/pssr')
@UseGuards(AuthGuard('jwt'))
export class PssrController {
  constructor(private readonly pssrService: PssrService) {}

  @Post()
  create(@Param('mocId', ParseIntPipe) mocId: number, @Body('description') description: string) {
    return this.pssrService.createItem(mocId, description);
  }

  @Get()
  findByMoc(@Param('mocId', ParseIntPipe) mocId: number) {
    return this.pssrService.findByMoc(mocId);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.pssrService.completeItem(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pssrService.removeItem(id);
  }

  @Get('check')
  checkComplete(@Param('mocId', ParseIntPipe) mocId: number) {
    return this.pssrService.isComplete(mocId);
  }
}
