import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { JobLocationEnum,SeniorityLevelEnum,WorkingTimeEnum } from "src/common/enum/enum";

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true,
     trim: true })
  jobTitle: string;

  @Prop({ required: true,
    enum:Object.values(JobLocationEnum),
    default:JobLocationEnum.HYBRID

})
  jobLocation: string;

  @Prop({ required: true,
    enum:Object.values(WorkingTimeEnum),
    default:WorkingTimeEnum.PART_TIME
   })
  workingTime: string;

  @Prop({
    required: true,
    enum:Object.values(SeniorityLevelEnum),
    default:SeniorityLevelEnum.FRESH
  })
  seniorityLevel: string;

  @Prop({ required: true })
  jobDescription: string;

  @Prop({ type: [String],
     default: [] })
  technicalSkills: string[];

  @Prop({ type: [String],
     default: [] })
  softSkills: string[];

  @Prop({ type: Types.ObjectId,
     ref: 'User', 
     required: true })
  addedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId,
     ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ default: false })
  closed: boolean;

  
  @Prop({ type: Types.ObjectId, 
   ref: 'Company', required: true })
  companyId: Types.ObjectId;

     @Prop({ type: Types.ObjectId, 
        ref: 'User', required: true })
  companyOwner: Types.ObjectId;


  
}

export const JobSchema = SchemaFactory.createForClass(Job);


JobSchema.virtual('applications', {
  ref: 'Application', 
  localField: '_id',
  foreignField: 'jobId', 
});

