"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_controller_1 = require("./app.controller");
(0, app_controller_1.bootStrap)().catch((error) => {
    console.log("failed to start", error);
    process.exit(1);
});
