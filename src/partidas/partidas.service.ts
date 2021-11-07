import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DesafiosService } from 'src/desafios/desafios.service';
import { Desafio } from 'src/desafios/interfaces/desafio.interface';
import { Partida } from './interfaces/partida.interface';

@Injectable()
export class PartidasService
{
    private readonly logger: Logger = new Logger(PartidasService.name);
    private readonly desafioService : DesafiosService;
    private readonly partidaModel: Model<Partida>;

    constructor (
        @InjectModel('Partida') partidaModel: Model<Partida>,
        @InjectModel('Desafio') desafioModel: Model<Desafio>,
        desafioService: DesafiosService
    ) {
        this.partidaModel = partidaModel;
        this.desafioService = desafioService;
    }

    async criarPartida(partida: Partida): Promise<Partida>
    {
        try {
            const novoDesafio = new this.partidaModel(partida);
            let result = await novoDesafio.save();
            let { desafio } = partida;

            const desafioEncontrado = await this.desafioService.consultarDesafiosId(desafio);
            desafioEncontrado.partida = result._id;
            await this.desafioService.atualizarDesafio({ id: desafioEncontrado._id, desafio: desafioEncontrado })


        } catch (ex) {
            this.logger.log(`error: ${JSON.stringify(ex.message)}`);
            throw new RpcException(ex.message);
        }

        return;
    }
}
