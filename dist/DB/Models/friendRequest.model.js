"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRequestModel = exports.friendRequestSchema = void 0;
const mongoose_1 = require("mongoose");
exports.friendRequestSchema = new mongoose_1.Schema({
    sendBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    sendTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
exports.friendRequestSchema.index({ sendBy: -1, sendTo: -1 });
exports.friendRequestModel = (0, mongoose_1.model)("FriendRequest", exports.friendRequestSchema);
