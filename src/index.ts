import { bootStrap } from "./app.controller";

bootStrap().catch((error:unknown)=>{
    console.log("failed to start",error);
    process.exit(1);
})