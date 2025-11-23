import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
async function bootstrap() {
   //const app = await NestFactory.create(AppModule);
   const app = await NestFactory.create(AppModule);
 
const port= process.env.PORT??5000
   await app.listen(port,()=>{
console.log(`Server is Running http://localhost:${port}`);
// console.log(`Application is running on: ${ app.getUrl()}`);
  })
  
}
bootstrap();


