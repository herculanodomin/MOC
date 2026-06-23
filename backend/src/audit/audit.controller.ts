import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuditService } from './audit.service';

@Controller('audit')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Query('entityType') entityType?: string, @Query('userId') userId?: number) {
    return this.auditService.findAll({ entityType, userId });
  }

  @Get('moc/:mocId')
  findByMoc(@Param('mocId', ParseIntPipe) mocId: number) {
    return this.auditService.findByMoc(mocId);
  }
}
