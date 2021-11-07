import { Module } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { DesafiosController } from './desafios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafioSchema } from './interfaces/desafio.schema';
import { PartidasService } from 'src/partidas/partidas.service';
import { PartidaSchema } from 'src/partidas/interfaces/partida.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Desafio', schema: DesafioSchema}]),
    MongooseModule.forFeature([{name: 'Partida', schema: PartidaSchema}])
  ],
  providers: [DesafiosService, PartidasService],
  controllers: [DesafiosController]
})
export class DesafiosModule {}
