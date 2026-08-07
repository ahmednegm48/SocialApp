"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const error_response_1 = require("../response/error.response");
const nodemailer_1 = require("nodemailer");
const config_service_1 = require("../../Config/config.service");
const sendEmail = async (data) => {
    if (!data.html && !data.attachments?.length && !data.text) {
        throw new error_response_1.BadRequestException("Missing email content");
    }
    const transporter = (0, nodemailer_1.createTransport)({
        service: "gmail",
        auth: {
            user: config_service_1.env.EMAIL,
            pass: config_service_1.env.PASSWORD,
        }
    });
    await transporter.sendMail({
        ...data,
        from: config_service_1.env.EMAIL,
    });
};
exports.sendEmail = sendEmail;
