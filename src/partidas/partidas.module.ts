import { Module } from '@nestjs/common';
import { PartidasService } from './partidas.service';

@Module({
  providers: [PartidasService]
})
export class PartidasModule {}
