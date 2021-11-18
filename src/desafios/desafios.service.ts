import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio } from './interfaces/desafio.interface';
import * as momentTimezone from 'moment-timezone';

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
            desafio.status = DesafioStatus.PENDENTE;
            const desafioNovo = new this.desafioModel(desafio);
            return await desafioNovo.save();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async consultarDesafiosId(id: string) : Promise<Desafio>
    {
        try {
            return await this.desafioModel.findOne({_id: id}).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async consultarDesafiosJogador(jogador: string) : Promise<Desafio[]>
    {
        try {
            return await this.desafioModel.find().where('jogadores').in([jogador]).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async consultarTodosDesafios() : Promise<Desafio[]>
    {
        try {
            return await this.desafioModel.find({}).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async atualizarDesafio(payload: any) : Promise<void>
    {
        await this.desafioModel.findOneAndUpdate(
            {_id: payload.id}, 
            {$set: payload.desafio}
        ).exec();
    }

    async deletarDesafio(id: string) : Promise<void>
    {
        await this.desafioModel.deleteOne({ _id: id }).exec();
    }

    async consultarDesafiosRealizados(idCategoria: string): Promise<Desafio[]> {
        try {
            return await this.desafioModel.find()
            .where('categoria')
            .equals(idCategoria)
            .where('status')
            .equals(DesafioStatus.REALIZADO)
            .exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async consultarDesafiosRealizadosPelaData(idCategoria: string, dataRef:string): Promise<Desafio[]>
    {
        try {
            const dateRefNew = `${dataRef} 23:59:59.999`;
            return await this.desafioModel.find()
            .where('categoria')
            .equals(idCategoria)
            .where('status')
            .equals(DesafioStatus.REALIZADO)
            .where({ dataHoraDesafio: { $lte: momentTimezone(dateRefNew).tz('UTC').toDate() }})
            .exec(); 
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }
    
}
