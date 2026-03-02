import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ShipTypeService } from './ship-type/ship-type.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // await app.get(ShipTypeService).displayData();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
