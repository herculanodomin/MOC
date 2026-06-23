import { Module } from '@nestjs/common';
import { PssrService } from './pssr.service';
import { PssrController } from './pssr.controller';

@Module({
  providers: [PssrService],
  controllers: [PssrController],
})
export class PssrModule {}
