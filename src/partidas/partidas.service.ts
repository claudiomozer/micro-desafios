import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { DesafiosService } from 'src/desafios/desafios.service';
import { Desafio } from 'src/desafios/interfaces/desafio.interface';
import { ClientRankingService } from 'src/infrastructure/services/client-ranking.service';
import { Partida } from './interfaces/partida.interface';

@Injectable()
export class PartidasService
{
    private readonly logger: Logger = new Logger(PartidasService.name);
    private readonly desafioService : DesafiosService;
    private readonly partidaModel: Model<Partida>;
    private readonly clientRankingService: ClientRankingService;

    constructor (
        @InjectModel('Partida') partidaModel: Model<Partida>,
        @InjectModel('Desafio') desafioModel: Model<Desafio>,
        desafioService: DesafiosService,
        clientRankingService: ClientRankingService
    ) {
        this.partidaModel = partidaModel;
        this.desafioService = desafioService;
        this.clientRankingService = clientRankingService;
    }

    async criarPartida(partida: Partida)
    {
        try {
            let { desafio } = partida;
            const desafioEncontrado = await this.desafioService.consultarDesafiosId(desafio);
            partida.jogadores = desafioEncontrado.jogadores.map(jogador => jogador.toString());
            partida.categoria = desafioEncontrado.categoria;
            const novaPartida = new this.partidaModel(partida);
            let result = await novaPartida.save();

            desafioEncontrado.partida = result._id;
            await this.desafioService.atualizarDesafio({ id: desafioEncontrado._id, desafio: desafioEncontrado })
            return await this.clientRankingService.client().emit('processar-partida', {idPartida: result._id, partida});
        } catch (ex) {
            this.logger.log(`error: ${JSON.stringify(ex.message)}`);
            throw new RpcException(ex.message);
        }

        return;
    }
}
