import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./Config/config.service";
import { corsOptions } from "./Utils/cors/cors";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import {
  globalErrorHandler,
  NotFoundException,
} from "./Utils/response/error.response";
import connectDB from "./DB/connection";
import authController from "./Modules/Auth/auth.controller"
// import { HUserDocument, UserModel } from "./DB/Models/user.model";

const limitter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const bootStrap = async (): Promise<void> => {
  const app: Express = express();

  app.use(helmet(), cors(corsOptions), limitter);
  app.use(express.json());
  await connectDB();


  app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Welcome to Social App" });
  });
  app.use("/auth",authController);

  // const user:HUserDocument = await new UserModel({
  //   firstName:"ahmed",
  //   lastName:"negm",
  //   email:"ahmednegm@gmail.com",
  //   password:"wala"
  // });
  // user.save()

  app.use((req: Request, res: Response) => {
    throw new NotFoundException("Route not found");
  });
  app.use(globalErrorHandler);

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};
