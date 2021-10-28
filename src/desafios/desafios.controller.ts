import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { DesafiosService } from './desafios.service';
import { Desafio } from './interfaces/desafio.interface';

const ackErrors: string[] = ['E11000'];

@Controller('desafios')
export class DesafiosController
{
    private readonly desafiosService: DesafiosService;
    private logger: Logger = new Logger(DesafiosController.name);

    constructor (desafiosService: DesafiosService)
    {
        this.desafiosService = desafiosService;
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
}
