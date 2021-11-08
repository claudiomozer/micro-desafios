import { Module } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { PartidasController } from './partidas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PartidaSchema } from './interfaces/partida.schema';
import { DesafiosService } from 'src/desafios/desafios.service';
import { DesafioSchema } from 'src/desafios/interfaces/desafio.schema';
import { ClientRankingService } from 'src/infrastructure/services/client-ranking.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Partida', schema: PartidaSchema}]),
    MongooseModule.forFeature([{name: 'Desafio', schema: DesafioSchema}]),
    ConfigModule.forRoot()
  ],
  providers: [PartidasService, DesafiosService, ClientRankingService],
  controllers: [PartidasController],
  exports: [ PartidasService ]
})
export class PartidasModule {}
