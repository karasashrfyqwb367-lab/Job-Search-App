import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { OTPEnum } from "src/common/enum/enum";
import { emailEvent } from "src/common/utils/event/Email.event";
import { hash } from "src/common/utils/security/hash";

@Schema({
  timestamps: true,

})
export class Otp {
 
  @Prop({
    type: String,
    required:true
  })
  code: string;


    @Prop({ 
    type: Date,
    required:true
  })
  expireAT: Date;

    @Prop({ 
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
  })
  createdBy:Types.ObjectId



    @Prop({ 
    type: String,
    required:true,
    enum:OTPEnum
  })
  type:string


}

export type otpDoucment = HydratedDocument<Otp>;
export const otpSchema = SchemaFactory.createForClass(Otp);

otpSchema.index({expireAT:1},{expireAfterSeconds:0}) //ttl

otpSchema.pre("save",async function(
  this:otpDoucment&{wasNew:boolean;plainOtp:string},next){
    this.wasNew= this.isNew
    
    if(this.isModified("code")){
      this.plainOtp=this.code //save Plain text
      this.code=await hash({plaintext:this.code})
       await this.populate("createdBy")  
    }
next()    
})

otpSchema.post("save",async function(dec,next){
const that = this as otpDoucment&{wasNew:boolean;plainOtp:string}


 if (that.wasNew&&that.plainOtp) {
    await emailEvent.emit("Confirm Email",
      {to:(that.createdBy as any).email,
      otp:that.plainOtp,
      usename:(that.createdBy as any).username,
    
    })
 }
next()
})





export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: otpSchema },
]);
