import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function start() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: true,
  });
  await app.listen(port, () => console.log(`Server started on ${port}`));
}

start();
