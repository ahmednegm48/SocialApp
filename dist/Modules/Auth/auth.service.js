"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../DB/Models/user.model");
const error_response_1 = require("../../Utils/response/error.response");
const generateOTP_1 = require("../../Utils/security/generateOTP");
const hash_1 = require("../../Utils/security/hash");
const email_events_1 = require("../../Utils/events/email.events");
const token_1 = require("../../Utils/security/token");
class AuthService {
    constructor() { }
    signup = async (req, res) => {
        const { firstname, lastname, username, email, password } = req.body;
        const userExist = await user_model_1.UserModel.findOne({ email }).select("email");
        if (userExist)
            throw new error_response_1.ConflictException("User already exists");
        const otp = (0, generateOTP_1.generateOTP)();
        const [user] = await user_model_1.UserModel.create([
            {
                firstname,
                lastname,
                username,
                email,
                password: await (0, hash_1.generateHash)(password),
                confirmEmailOTP: await (0, hash_1.generateHash)(otp),
            },
        ], { validateBeforeSave: true });
        email_events_1.emailEvents.emit("confirmEmail", {
            to: email,
            otp,
        });
        return res.status(201).json({ message: "Done", user });
    };
    confirmEmail = async (req, res) => {
        const { otp, email } = req.body;
        const user = await user_model_1.UserModel.findOne({
            email,
            confirmEmailOTP: { $exists: true },
            confirmedAt: { $exists: false },
        });
        if (!user || !user.confirmEmailOTP)
            throw new error_response_1.NotFoundException("Invalid Account");
        if (!(await (0, hash_1.compareHash)(otp, user.confirmEmailOTP)))
            throw new error_response_1.BadRequestException("Invalid OTP");
        await user_model_1.UserModel.updateOne({ email }, {
            confirmedAt: new Date(),
            $unset: { confirmEmailOTP: true },
            $inc: { __v: 1 },
        });
        return res.status(200).json({ message: "User confirmed Successfully" });
    };
    login = async (req, res) => {
        const { password, email } = req.body;
        const user = await user_model_1.UserModel.findOne({
            email,
            confirmedAt: { $exists: true },
        });
        if (!user)
            throw new error_response_1.NotFoundException("Invalid Credentials");
        if (!(await (0, hash_1.compareHash)(password, user.password)))
            throw new error_response_1.BadRequestException("Invalid Credentials");
        const credentials = (0, token_1.createLoginCredentials)(user);
        return res.status(200).json({ message: "Logged in Successfully", credentials });
    };
    forgetPassword = async (req, res) => {
        const { email } = req.body;
        const otp = (0, generateOTP_1.generateOTP)();
        const hashedPassword = await (0, hash_1.generateHash)(otp);
        const user = await user_model_1.UserModel.findOneAndUpdate({ email }, { resetPasswordOTP: hashedPassword });
        if (!user)
            throw new error_response_1.NotFoundException("Invalid email");
        email_events_1.emailEvents.emit("forgetPassword", {
            to: email,
            otp,
        });
        return res.status(200).json({ message: "OTP has been sent to your email" });
    };
    resetPassword = async (req, res) => {
        const { email, otp, password } = req.body;
        const user = await user_model_1.UserModel.findOne({ email, resetPasswordOTP: { $exists: true } });
        if (!user || !user.resetPasswordOTP)
            throw new error_response_1.NotFoundException("Invalid email");
        const isMatch = await (0, hash_1.compareHash)(otp, user.resetPasswordOTP);
        if (!isMatch)
            throw new error_response_1.BadRequestException("Invalid OTP");
        const hashedPassword = await (0, hash_1.generateHash)(password);
        await user_model_1.UserModel.updateOne({ email }, { password: hashedPassword, $unset: { resetPasswordOTP: true } });
        return res.status(200).json({ message: "Password Reset Successfully" });
    };
}
exports.default = new AuthService();
