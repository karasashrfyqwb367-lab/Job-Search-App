import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Job,JobSchema } from "src/DB/model/job.ts";
import { Application, ApplicationSchema } from "src/DB/model/applicationModel";
import { JobService } from "./job.service";
import { JobController } from "./job.controller";
import { AuthGuard } from "src/common/guards/auth.guards";
import { AuthModule } from "src/auth/auth.module";
import { GatewryModule } from "src/Gateway/gatewry/gateway.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: Application.name, schema: ApplicationSchema },
    ]),

    AuthModule,

    GatewryModule,   // ← هنا المكان الصح ✓
  ],
  controllers: [JobController],
  providers: [JobService, AuthGuard],
})
export class JobModule {}

