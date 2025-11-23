import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query ,BadRequestException, UseInterceptors, UploadedFile} from '@nestjs/common';
import { JobService } from './job.service';
import { AddJobDTO, GetApplicationsDto, JobsFilterQueryDto, JobsListQueryDto, UpdateApplicationStatusDTO, UpdateJobDTO } from './dto/create-job.dto';

import { AuthGuard } from 'src/common/guards/auth.guards';
import { Roles, RolesGuard } from 'src/common/guards/Authorization.guards';
import { RoleEnum } from 'src/common/enum/enum';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/upload/multer';


interface AuthRequest extends Request {
  user: any; 
}

@Controller('job')

export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post(":companyId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleEnum.HR, RoleEnum.OWNER])
  async addJob(
    @Req() req: AuthRequest,
    @Param("companyId") companyId: string,
    @Body() dto:AddJobDTO
  ) {
    const hrId = req.user._id; 
    return this.jobService.addJob(hrId, companyId, dto);
  }



  @Patch(':jobId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleEnum.HR, RoleEnum.OWNER])
  async updateJob(
    @Param('jobId') jobId: string,
    @Body() dto: UpdateJobDTO,
    @Req() req
  ) {
    const updatedJob = await this.jobService.updateJob(jobId, req.user._id, dto);
    return {
      message: 'Job updated successfully',
      job: updatedJob,
    };
  }

  @Get("getjob")
  async getAll(@Query() query: JobsListQueryDto) {
    return this.jobService.listJobs(query);
  }

  @Get("filter")
  @UseGuards(AuthGuard, RolesGuard)
  async filterJobs(
    @Req() req: AuthRequest,
    @Body() body: JobsFilterQueryDto
  ) {
    const userId = req.user._id;
    return this.jobService.listJobsWithFilters({ ...body, userId });
  }

  @Get(":jobId")
  async getOne(@Param("jobId") jobId: string, @Query() query: JobsListQueryDto) {

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException("Invalid jobId");
    }
    return this.jobService.getOneJob(jobId, query);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleEnum.HR, RoleEnum.OWNER])
  @Get(':jobId/applications')
  async getApplications(
    @Param('jobId') jobId: string,
    @Query() query: GetApplicationsDto,
  ) {
    return this.jobService.getApplications(jobId, query);
  }



//Apply to Job (Job application) 
@Post("apply/:jobId")
@UseGuards(AuthGuard, RolesGuard)
@Roles([RoleEnum.USER])
async apply(
  @Param("jobId") jobId: string,
  @Req() req
) {
  const userId = req.user._id;
  const application = await this.jobService.applyToJob(jobId, userId);

  return {
    message: 'Application submitted successfully',
    application,
  };
}



//Accept or Reject an Applicant
@Patch("application/:applicationId/status")
@UseGuards(AuthGuard, RolesGuard)
@Roles([RoleEnum.HR, RoleEnum.OWNER])
@UseInterceptors(FileInterceptor("cv", multerOptions))
async updateApplicationStatus(
  @Param("applicationId") applicationId: string,
  @Body() dto: UpdateApplicationStatusDTO,
  @UploadedFile() file: Express.Multer.File,
  @Req() req
) {
  return this.jobService.updateStatus(applicationId, dto, file, req.user);
}



  }






