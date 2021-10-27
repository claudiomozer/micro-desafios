import { Module } from '@nestjs/common';
import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';

@Module({
  imports: [DesafiosModule, PartidasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
