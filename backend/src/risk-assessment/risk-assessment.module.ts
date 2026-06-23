import { Module } from '@nestjs/common';
import { RiskAssessmentService } from './risk-assessment.service';
import { RiskAssessmentController } from './risk-assessment.controller';

@Module({
  providers: [RiskAssessmentService],
  controllers: [RiskAssessmentController],
})
export class RiskAssessmentModule {}
