import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  getKpis() {
    return this.dashboardService.getKpis();
  }

  @Get('by-area')
  getByArea() {
    return this.dashboardService.getByArea();
  }

  @Get('by-type')
  getByType() {
    return this.dashboardService.getByType();
  }

  @Get('by-risk')
  getByRiskLevel() {
    return this.dashboardService.getByRiskLevel();
  }

  @Get('by-status')
  getByStatus() {
    return this.dashboardService.getByStatus();
  }
}
