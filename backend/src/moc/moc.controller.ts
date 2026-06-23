import {
  Controller, Get, Post, Patch, Body, Param, Query,
  ParseIntPipe, UseGuards, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MocService } from './moc.service';
import { CreateMocDto } from './dto/create-moc.dto';
import { UpdateMocDto } from './dto/update-moc.dto';
import { AcceptMocDto } from './dto/accept-moc.dto';
import { CloseMocDto } from './dto/close-moc.dto';
import { SubmitMocDto } from './dto/submit-moc.dto';

@Controller('mocs')
@UseGuards(AuthGuard('jwt'))
export class MocController {
  constructor(private readonly mocService: MocService) {}

  @Post()
  create(@Body() dto: CreateMocDto, @Req() req: any) {
    return this.mocService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.mocService.findAll({ status });
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.mocService.findById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMocDto) {
    return this.mocService.update(id, dto);
  }

  @Post(':id/submit')
  submitForAcceptance(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitMocDto,
    @Req() req: any,
  ) {
    return this.mocService.submitForAcceptance(id, dto, req.user.id);
  }

  @Post(':id/accept')
  accept(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AcceptMocDto,
    @Req() req: any,
  ) {
    return this.mocService.accept(id, dto, req.user.id);
  }

  @Post(':id/advance')
  advanceStatus(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.mocService.advanceStatus(id, req.user.id);
  }

  @Post(':id/risk-level')
  setRiskLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body('riskLevel') riskLevel: string,
  ) {
    return this.mocService.setRiskLevel(id, riskLevel);
  }

  @Post(':id/close')
  close(@Param('id', ParseIntPipe) id: number, @Body() dto: CloseMocDto) {
    return this.mocService.close(id, dto);
  }
}
