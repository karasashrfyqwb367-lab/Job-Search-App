import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // ممكن تحط هنا دومين فرونت معين
    methods: 'GET,POST,PUT,DELETE,PATCH',
  });

  // استخدام ConfigService للحصول على PORT
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 5000;

  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

bootstrap();

