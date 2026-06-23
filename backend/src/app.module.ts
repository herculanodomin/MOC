import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MocModule } from './moc/moc.module';
import { RiskAssessmentModule } from './risk-assessment/risk-assessment.module';
import { ImplementationPlanModule } from './implementation-plan/implementation-plan.module';
import { ApprovalModule } from './approval/approval.module';
import { PssrModule } from './pssr/pssr.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditModule } from './audit/audit.module';
import { PrismaModule } from './common/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MocModule,
    RiskAssessmentModule,
    ImplementationPlanModule,
    ApprovalModule,
    PssrModule,
    NotificationsModule,
    DashboardModule,
    AuditModule,
  ],
})
export class AppModule {}
