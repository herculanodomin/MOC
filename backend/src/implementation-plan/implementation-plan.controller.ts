import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImplementationPlanService } from './implementation-plan.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('mocs/:mocId/actions')
@UseGuards(AuthGuard('jwt'))
export class ImplementationPlanController {
  constructor(private readonly planService: ImplementationPlanService) {}

  @Post()
  create(@Param('mocId', ParseIntPipe) mocId: number, @Body() dto: CreateActionDto) {
    return this.planService.createAction(mocId, dto);
  }

  @Get()
  findByMoc(@Param('mocId', ParseIntPipe) mocId: number) {
    return this.planService.findByMoc(mocId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateActionDto) {
    return this.planService.updateAction(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planService.removeAction(id);
  }
}
