import { Module } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { DesafiosController } from './desafios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafioSchema } from './interfaces/desafio.schema';
import { PartidasService } from 'src/partidas/partidas.service';
import { PartidaSchema } from 'src/partidas/interfaces/partida.schema';
import { ConfigModule } from '@nestjs/config';
import { ClientRankingService } from 'src/infrastructure/services/client-ranking.service';
import { ClientNotificacoesService } from 'src/infrastructure/services/client-notificacoes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Desafio', schema: DesafioSchema}]),
    MongooseModule.forFeature([{name: 'Partida', schema: PartidaSchema}]),
    ConfigModule.forRoot()
  ],
  providers: [DesafiosService, PartidasService, ClientRankingService, ClientNotificacoesService],
  controllers: [DesafiosController]
})
export class DesafiosModule {}
