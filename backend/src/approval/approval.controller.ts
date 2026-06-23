import {
  Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';

@Controller('mocs/:mocId/approvals')
@UseGuards(AuthGuard('jwt'))
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Post()
  approve(
    @Param('mocId', ParseIntPipe) mocId: number,
    @Body() dto: CreateApprovalDto,
    @Req() req: any,
  ) {
    return this.approvalService.approve(mocId, dto, req.user.id);
  }

  @Get()
  findByMoc(@Param('mocId', ParseIntPipe) mocId: number) {
    return this.approvalService.findByMoc(mocId);
  }
}
