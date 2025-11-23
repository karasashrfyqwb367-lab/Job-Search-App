import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ApplicationStatusEnum } from "src/common/enum/enum";

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
   
  })
  userCV: {
    secure_url: string;
    public_id: string;
  };

  @Prop({
    required: true,
    enum: Object.values(ApplicationStatusEnum),
    default: ApplicationStatusEnum.PENDING,
  })
  status: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
