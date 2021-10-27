import { Module } from '@nestjs/common';
import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';
import { PartidaController } from './partida/partida.controller';

@Module({
  imports: [DesafiosModule, PartidasModule],
  controllers: [PartidaController],
  providers: [],
})
export class AppModule {}
