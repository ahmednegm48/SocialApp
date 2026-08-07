import { Request, Response } from "express";
import { IConfirmEmailDTO, ILoginDTO, ISignupDTO } from "./auth.dto";
import { UserModel } from "../../DB/Models/user.model";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../Utils/response/error.response";
import { generateOTP } from "../../Utils/security/generateOTP";
import { compareHash, generateHash } from "../../Utils/security/hash";
import { emailEvents } from "../../Utils/events/email.events";
import { createLoginCredentials } from "../../Utils/security/token";

class AuthService {
  constructor() {}

  signup = async (req: Request, res: Response): Promise<Response> => {
    const { firstname, lastname, username, email, password }: ISignupDTO =
      req.body;
    const userExist = await UserModel.findOne({ email }).select("email");
    if (userExist) throw new ConflictException("User already exists");
    const otp = generateOTP();
    const [user] = await UserModel.create(
      [
        {
          firstname,
          lastname,
          username,
          email,
          password: await generateHash(password),
          confirmEmailOTP: await generateHash(otp),
        },
      ],
      { validateBeforeSave: true },
    );
    emailEvents.emit("confirmEmail", {
      to: email,
      otp,
    });
    return res.status(201).json({ message: "Done", user });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { otp, email }: IConfirmEmailDTO = req.body;
    const user = await UserModel.findOne({
      email,
      confirmEmailOTP: { $exists: true },
      confirmedAt: { $exists: false },
    });
    if (!user || !user.confirmEmailOTP)
      throw new NotFoundException("Invalid Account");

    if (!(await compareHash(otp, user.confirmEmailOTP)))
      throw new BadRequestException("Invalid OTP");

    await UserModel.updateOne(
      { email },
      {
        confirmedAt: new Date(),
        $unset: { confirmEmailOTP: true },
        $inc: { __v: 1 },
      },
    );

    return res.status(200).json({ message: "User confirmed Successfully" });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { password, email }: ILoginDTO = req.body;
    const user = await UserModel.findOne({
      email,
      confirmedAt: { $exists: true },
    });
    if (!user) throw new NotFoundException("Invalid Credentials");

    if (!(await compareHash(password, user.password)))
      throw new BadRequestException("Invalid Credentials");

    const credentials = createLoginCredentials(user);

    return res.status(200).json({ message: "Logged in Successfully" , credentials});
  };
}

export default new AuthService();
