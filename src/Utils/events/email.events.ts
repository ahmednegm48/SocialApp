import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer";
import { emailTemplate } from "../email/email.template";
import { sendEmail } from "../email/send.email";

export const emailEvents = new EventEmitter();

interface IEmail extends Mail.Options {
    otp:string;
}
emailEvents.on("confirmEmail", async (data:IEmail)=>{
    try{
        data.html = emailTemplate(data.otp);
        await sendEmail(data)
    }catch(err){
        console.error("Failed to send Email",err)
    }
})