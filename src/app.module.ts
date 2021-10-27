import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';

const connectionParams : object = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://' +
      `${process.env.DB_USER}:` +
      `${process.env.DB_PASS}@` +
      `${process.env.DB_HOST}/` +
      `${process.env.DB_NAME}?retryWrites=true&w=majority`
      , connectionParams),
    DesafiosModule, 
    PartidasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
