import { Module } from '@nestjs/common';
import { ImplementationPlanService } from './implementation-plan.service';
import { ImplementationPlanController } from './implementation-plan.controller';

@Module({
  providers: [ImplementationPlanService],
  controllers: [ImplementationPlanController],
})
export class ImplementationPlanModule {}
