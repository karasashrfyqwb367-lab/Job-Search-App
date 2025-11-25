import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "./User.Model"; 
import { RoleEnum } from "src/common/enum/enum";

@Schema({ timestamps: true, 
    toObject: { virtuals: true },
     toJSON: { virtuals: true } })
export class Company {

    @Prop({ type: String,
         required: true, 
        unique: true, 
        trim: true, minLength: 2 })

    companyName: string;

    @Prop({ type: String, 
        required: true,
         trim: true })
    description: string;

    @Prop({ type: String,
         required: true,
          trim: true }) // المجالات الشركة 
    industry: string;

    @Prop({ type: String })

    address: string;

    @Prop({ type: String,
         required: true }) // مثلا "11-20 employees"
    numberOfEmployees: string;

    @Prop({ type: String, required: true, unique: true, lowercase: true })
    companyEmail: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId,
         ref: User.name,
          required: true })
    createdBy: string;

   @Prop({
  type: {
    secure_url: { type: String },
    public_id: { type: String },
  },
  required: false,  
})
profilePic?: { secure_url: string; public_id: string };

@Prop({
  type: {
    secure_url: { type: String },
    public_id: { type: String },
  },
  required: false,  
})
coverPic?: { secure_url: string; public_id: string };


    @Prop({ type: [{ 
        type: mongoose.Schema.Types.ObjectId,
         ref: User.name }] })
    HRs: string[];

     @Prop({
            type:String,
            enum: Object.values(RoleEnum),
            default: RoleEnum.USER
        })
        role: string

    @Prop({ type: Date })
    bannedAt: Date;

    @Prop({ type: Date })
    deletedAt: Date;

    @Prop({
        type: {
            secure_url: { type: String },
            public_id: { type: String },
        }
    })
    legalAttachment: { secure_url: string; public_id: string };  // المسندات الشركة 

    @Prop({ type: Boolean, default: false }) // تفعيل الشركة من عند الادمين
    approvedByAdmin: boolean;


  }


export const CompanySchema = SchemaFactory.createForClass(Company);
  CompanySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "company",
});
export type CompanyDocument = HydratedDocument<Company>;

export const companyModel = MongooseModule.forFeature([
    { name: Company.name, schema: CompanySchema }
]);
