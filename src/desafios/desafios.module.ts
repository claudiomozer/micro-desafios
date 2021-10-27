import { Module } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { DesafiosController } from './desafios.controller';

@Module({
  providers: [DesafiosService],
  controllers: [DesafiosController]
})
export class DesafiosModule {}
