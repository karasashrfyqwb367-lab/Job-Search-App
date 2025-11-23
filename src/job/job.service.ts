import { Body, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Param, Patch, Req, UseGuards } from '@nestjs/common';
//import { UpdateJobDto } from './dto/update-job.dto';
import { AddJobDTO, GetApplicationsDto, JobsFilterQueryDto, JobsListQueryDto, UpdateApplicationStatusDTO, UpdateJobDTO } from './dto/create-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'src/DB/model/job.ts';
import { Model, Types } from 'mongoose';
import { Application } from 'src/DB/model/applicationModel';
import { emailEvent } from 'src/common/utils/event/Email.event';
import { ApplicationStatusEnum } from 'src/common/enum/enum';
import { RealtimeGateway } from 'src/Gateway/gatewry/gateway';

interface Company {
  _id: string;
  owner: string;
  name: string;
}
export interface JobDocument extends Document {
  jobTitle: string;
  applications?: any[]; 
}
@Injectable()
export class JobService {
constructor(@InjectModel(Job.name) private readonly jobModel: Model<JobDocument> ,
    @InjectModel(Application.name) private applicationModel: Model<Application>,
  private readonly realtimeGateway: RealtimeGateway

){}


async addJob(hrId: string, companyId: string, dto: AddJobDTO) {
  
  const job = await this.jobModel.create({
    ...dto,           
    addedBy: hrId,     
    companyId: new Types.ObjectId(companyId),

  });

  return job;
}




  async updateJob(jobId: string, userId: string, dto: UpdateJobDTO): Promise<JobDocument> {
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        (job as any)[key] = value; 
      }
    }

    await job.save();
    return job;
  }

 async listJobs(query: JobsListQueryDto ) {
    const {page = 1,limit = 10,sort = "createdAt",companyId,} = query;

    const skip = (page - 1) * limit; //

    // بناء الفلتر
    const filter: any = {};
    if (companyId) filter.companyId = companyId;

    const jobs = await this.jobModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sort]: -1 });

    const total = await this.jobModel.countDocuments(filter);

    return {
      total, 
      page,
      limit,
      pages: Math.ceil(total / limit),
      jobs, // البيانات نفسها
    };
    
  }


  async getOneJob(jobId: string, query: JobsListQueryDto) {
    const { companyId } = query;

    const filter: any = { _id: jobId };
    if (companyId) filter.companyId = companyId;

    const job = await this.jobModel.findOne(filter);

    if (!job) throw new NotFoundException("Job not found");

    return job;
  }



async listJobsWithFilters(query: any) {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = query;

  const skip = (page - 1) * limit;

  const filter: any = {};

  if (workingTime) filter.workingTime = workingTime;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
  if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: 'i' };
  if (technicalSkills?.length) filter.technicalSkills = { $all: technicalSkills };

  const jobs = await this.jobModel
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sort]: -1 });

  const total = await this.jobModel.countDocuments(filter);

  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    jobs,
  };
}

async getApplications(jobId: string, query: GetApplicationsDto) {
  const { page = 1, limit = 10, sort = "createdAt" } = query;
  const skip = (page - 1) * limit;

  const job = await this.jobModel
    .findById(jobId)
    .populate({
      path: 'applications', 
      populate: { path: 'user', select: '-password' },
      options: {
        skip,
        limit,
        sort: { [sort]: -1 }
      },
    });

  if (!job) throw new NotFoundException('Job not found');

  const applications = job.applications || []; // fallback لو undefined
  const total = applications.length;

  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    applications,
  };
}

 async applyToJob(jobId: string, userId: string) {
  const job = await this.jobModel.findById(jobId);
  if (!job) throw new NotFoundException('Job not found');

  const application = await this.applicationModel.create({
    jobId,
    userId,
  })
  await application.populate({ path: "userId", select: "-password" });
  
//socktio
   this.realtimeGateway.server.emit('new-application', {
    jobId,
    userId,
  });

  return application;
}



async updateStatus(
  appId: string,
  dto: UpdateApplicationStatusDTO,
  file?: Express.Multer.File,
  user?: any
) {
  const application = await this.applicationModel
    .findById(appId)
    .populate("userId")
    .populate("jobId");

  if (!application) throw new NotFoundException("Application not found");

  if (file) {
    const filePath = `uploads/${file.filename}`;
    application.userCV = {
      secure_url: filePath,
      public_id: file.filename,
    };
  }

  application.status = dto.status;
  await application.save();

  if (dto.status === ApplicationStatusEnum.ACCEPTED) {
    await emailEvent.emit("Application Accepted", {
      to: (application.userId as any).email,
      username: (application.userId as any).username,
      jobTitle: (application.jobId as any).jobTitle,
    });
  }
  if (dto.status === ApplicationStatusEnum.REJECTED) {
    await emailEvent.emit("Application Rejected", {
      to: (application.userId as any).email,
      username: (application.userId as any).username,
      jobTitle: (application.jobId as any).jobTitle,
    });
  }

  return { message: "Status updated", application };
}





}




  






































