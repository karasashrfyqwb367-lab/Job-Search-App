
import { BadRequestException } from "@nestjs/common";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";


export const sendEmail = async (data: Mail.Options): Promise<void> => {
  
  if (!data.html && !data.attachments?.length && !data.text) {
    throw new  BadRequestException("missing Email content");
  }

  const transporter = createTransport({
    service: "gmail", // غيّرها حسب الخدمة اللي هتستخدمها
    auth: {
      user: process.env.EMAIL as string,
      pass: process.env.PASSWORD as string,
    },

  });
   
  await transporter.sendMail({
    ...data,
    from: `"karas SoftWare Engneer" <${process.env.EMAIL}>`,
  });
  console.log(` Email sent successfully to ${data.to}`);
};
