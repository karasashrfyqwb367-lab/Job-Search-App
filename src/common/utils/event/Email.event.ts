import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer";
import { verifyEmail } from "../email/verfy.templete";
import { sendEmail } from "../email/send.Email";
import { OTPEnum } from "src/common/enum/enum";

export const emailEvent= new EventEmitter()

interface IEmail extends Mail.Options{
        otp: number;
    html?: string;    
    subject?: string;   
    text?: string;       
    attachments?: any[]; }

emailEvent.on("Confirm Email",async(data:IEmail)=>{

    try {
        data.subject =OTPEnum.CONFIRM_EMAIL,
        data.html=verifyEmail({
            otp:data.otp,
            title:"confirm Email"
        })
        await sendEmail(data)
    } catch (error) {
        console.log("Fail confirm Send Email",error);
        
    }

})


emailEvent.on("ResetPassword",async(data:IEmail)=>{

    try {
        data.subject="ResetPassword",
        data.html=verifyEmail({
            otp:data.otp,
            title:"Send Code"
        })
        await sendEmail(data)
    } catch (error) {
        console.log("Fail confirm Send Email",error);
        
    }


})