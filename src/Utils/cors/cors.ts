 import { CorsOptions } from "cors";
import { env } from "../../Config/config.service";

 const whiteList: string[] = env.WHITE_LIST.split(",");

 export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(whiteList.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    }
 }