import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";

export const bootStrap = async (): Promise<void> => {
  const app: Express = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Welcome to Social App" });
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};
