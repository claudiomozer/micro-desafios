import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService
{
    private readonly logger: Logger = new Logger(DesafiosService.name);
    private readonly desafioModel: Model<Desafio>;

    constructor (@InjectModel('Desafio') desafioModel: Model<Desafio>) {
        this.desafioModel = desafioModel;
    }

    async criarDesafio(desafio: Desafio) {
        try {
            console.log(desafio);
            const desafioNovo = new this.desafioModel(desafio);
            console.log(desafioNovo)
            return await desafioNovo.save();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }
}
