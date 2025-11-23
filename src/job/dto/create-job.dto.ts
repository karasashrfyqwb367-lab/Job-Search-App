import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsBoolean, IsIn, Min, IsInt, Max, IsNumberString } from 'class-validator';
import { Types } from 'mongoose';
import { JobLocationEnum,WorkingTimeEnum,SeniorityLevelEnum, ApplicationStatusEnum } from 'src/common/enum/enum';

export class AddJobDTO {
  @IsString()
  @IsNotEmpty()
  jobTitle: string; 

  @IsEnum(JobLocationEnum)
  jobLocation: JobLocationEnum; 

  @IsEnum(WorkingTimeEnum)
  workingTime: WorkingTimeEnum;

  @IsEnum(SeniorityLevelEnum)
  seniorityLevel: SeniorityLevelEnum;م

  @IsString()
  @IsNotEmpty()
  jobDescription: string; 

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technicalSkills?: string[]; 

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  softSkills?: string[]; 

  @IsOptional()
  closed?: boolean; 
  

  @IsNotEmpty()
  companyId: Types.ObjectId;
}


export class UpdateJobDTO {
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsString()
  jobLocation?: string;

  @IsOptional()
  @IsArray()
  technicalSkills?: string[];

  @IsOptional()
  @IsArray()
  softSkills?: string[];

  @IsOptional()
  @IsBoolean()
  closed?: boolean;
}






export class JobsListQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  companyId?: string;
}




export class JobsFilterQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  workingTime?: string;

  @IsOptional()
  @IsString()
  jobLocation?: string;

  @IsOptional()
  @IsString()
  seniorityLevel?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsArray()
  technicalSkills?: string[];
}

export class GetApplicationsDto {
  @IsOptional()
  @IsNumberString()
  page?: number = 1;

  @IsOptional()
  @IsNumberString()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort?: string = "createdAt";
}



export class UpdateApplicationStatusDTO {
  @IsEnum(ApplicationStatusEnum)
  status: ApplicationStatusEnum;
}
