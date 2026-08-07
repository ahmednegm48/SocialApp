import Mail from "nodemailer/lib/mailer";
import { BadRequestException } from "../response/error.response";
import { createTransport } from "nodemailer";
import { env } from "../../Config/config.service";


export const sendEmail =  async (data:Mail.Options): Promise<void> =>{
    if(!data.html && !data.attachments?.length && !data.text){
        throw new BadRequestException("Missing email content");
    }
    const transporter = createTransport({
        service:"gmail",
        auth:{
            user:env.EMAIL,
            pass:env.PASSWORD,
        }
    });
    await transporter.sendMail({
        ...data,
        from: env.EMAIL,
    })
}