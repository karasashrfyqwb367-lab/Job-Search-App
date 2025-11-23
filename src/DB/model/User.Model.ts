import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {  HydratedDocument, Types } from "mongoose";
import { GenderEnum,  RoleEnum, providerEnum} from "src/common/enum/enum";
import bcrypt from "bcrypt"
import { Otp } from "./OtP.Model";
import CryptoJS from 'crypto-js';
 @Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true}})
export class User {

    @Prop({ type:String, required:true, minLength:2, maxLength:20, trim:true })
    firstName: string;

    @Prop({ type:String, required:true, minLength:2, maxLength:20, trim:true })
    lastName: string;

    username: string; // Virtual، نضيفها بعد الـ schema

    @Prop({ type:String, required:true, lowercase:true, unique:true })
    email: string;

    @Prop({ type:Boolean })
    isConfirmedEmail: boolean;

    @Prop({ type:String })
    confirmedEmailOtp: string;

    @Prop({
        type:String,
        required: function(){ return this.provider !== providerEnum.GOOGLE; }
    })
    password: string;

    @Prop({
        type:String,
        enum: Object.values(providerEnum),
        default: providerEnum.SYSTEM
    })
    provider: string;

    @Prop({
        type:String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.MALE
    })
    gender: string;

    @Prop({ type: Date,
         required: true })
dob: Date;

@Prop({
    type:String
})
mobileNumber:string

 @Prop({
        type:String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.USER
    })
    role: string


    @Prop({ type: Date })
   deletedAt:Date

    @Prop({ type: Date,})
         bannedAt:Date // لتسجيل تاريخ حظر  

         @Prop({ type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' })
         updatedBy: string; 

         @Prop({
            type:Date 

         })
         changeCredentialTime:Date 

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


@Prop({
  type:Types.ObjectId,ref:Otp.name
})
OTP:Types.ObjectId[]

}




export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);


UserSchema.pre('save', async function (next) {
  if (this.isModified('mobileNumber') && this.mobileNumber) {
    this.mobileNumber = CryptoJS.AES.encrypt(
      this.mobileNumber as string,
      process.env.MOBILE_SECRET_KEY!
    ).toString();
  }
 
});
next();
})




UserSchema.virtual('username').get(function() {
    return this.firstName + " " + this.lastName;
}).set(function(value: string){
    const [firstName, lastName] = value.split(' ') || [];
    this.set('firstName', firstName);
    this.set('lastName', lastName);
});

export type UserDocument = HydratedDocument<User>;

export const userModel = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
]);
