"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvents = void 0;
const node_events_1 = require("node:events");
const email_template_1 = require("../email/email.template");
const send_email_1 = require("../email/send.email");
exports.emailEvents = new node_events_1.EventEmitter();
exports.emailEvents.on("confirmEmail", async (data) => {
    try {
        data.html = (0, email_template_1.emailTemplate)(data.otp);
        await (0, send_email_1.sendEmail)(data);
    }
    catch (err) {
        console.error("Failed to send Email", err);
    }
});
exports.emailEvents.on("forgetPassword", async (data) => {
    try {
        data.html = (0, email_template_1.emailTemplate)(data.otp);
        await (0, send_email_1.sendEmail)(data);
    }
    catch (err) {
        console.error("Failed to send Email", err);
    }
});
