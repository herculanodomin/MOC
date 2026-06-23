import { Module } from '@nestjs/common';
import { MocService } from './moc.service';
import { MocController } from './moc.controller';

@Module({
  providers: [MocService],
  controllers: [MocController],
  exports: [MocService],
})
export class MocModule {}
