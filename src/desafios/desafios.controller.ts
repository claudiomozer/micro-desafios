import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { PartidasService } from 'src/partidas/partidas.service';
import { DesafiosService } from './desafios.service';
import { Desafio } from './interfaces/desafio.interface';

const ackErrors: string[] = ['E11000'];

@Controller('desafios')
export class DesafiosController
{
    private readonly desafiosService: DesafiosService;
    private readonly partidasService: PartidasService;
    private logger: Logger = new Logger(DesafiosController.name);

    constructor (
        desafiosService: DesafiosService,
        partidasService: PartidasService
    )
    {
        this.desafiosService = desafiosService;
        this.partidasService = partidasService;
    }

    @EventPattern('criar-desafio')
    async criarJogador(
      @Payload() desafio: Desafio,
      @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

        try {
            await this.desafiosService.criarDesafio(desafio);
            await channel.ack(originalMessage);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            const filteredError = ackErrors.filter(async ackError => {
                return error.message.includes(ackError);
            })

            if (filteredError) {
                await channel.ack(originalMessage);
            }
        }
    }

    @MessagePattern('consultar-desafios')
    async consultarDesafios(
      @Payload() payload: any,
      @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        try {
            if (payload.id) {
                return await this.desafiosService.consultarDesafiosId(payload.id);
            } else if (payload.jogador) {
                return await this.desafiosService.consultarDesafiosJogador(payload.jogador);
            } else {
                return await this.desafiosService.consultarTodosDesafios();
            }
        } finally {
            await channel.ack(originalMessage);
        }
    }

    @EventPattern('atualizar-desafio')
    async updateDesafios(
        @Payload() payload: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        try {
            await this.desafiosService.atualizarDesafio(payload);
        } finally {
            await channel.ack(originalMessage);
        }
    }

    @EventPattern('deletar-desafio')
    async deleteDesafios(
        @Payload() id: string,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        try {
            await this.desafiosService.deletarDesafio(id);
        } finally {
            await channel.ack(originalMessage);
        }
    }

    @EventPattern('atribuir-partida-desafio')
    async atribuirPartidaDesafio(
        @Payload() payload: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        try {
            payload.partida.desafio = payload.id;
            await this.partidasService.criarPartida(payload.partida);
        } finally {
            await channel.ack(originalMessage);
        }
    }
}
