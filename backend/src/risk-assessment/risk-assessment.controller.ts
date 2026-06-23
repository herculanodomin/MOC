import {
  Controller, Get, Post, Delete,
  Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RiskAssessmentService } from './risk-assessment.service';
import { CreateRiskDto } from './dto/create-risk.dto';

@Controller('mocs/:mocId/risks')
@UseGuards(AuthGuard('jwt'))
export class RiskAssessmentController {
  constructor(private readonly riskService: RiskAssessmentService) {}

  @Post()
  create(@Param('mocId', ParseIntPipe) mocId: number, @Body() dto: CreateRiskDto) {
    return this.riskService.create(mocId, dto);
  }

  @Get()
  findByMoc(@Param('mocId', ParseIntPipe) mocId: number) {
    return this.riskService.findByMoc(mocId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.riskService.remove(id);
  }
}
