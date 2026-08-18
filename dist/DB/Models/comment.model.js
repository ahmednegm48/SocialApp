"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.commentSchema = new mongoose_1.Schema({
    content: { type: String, minLength: 2, maxLength: 20000, required: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" },
}, { timestamps: true });
exports.commentSchema.index({ postId: -1, createdAt: -1 });
exports.CommentModel = (0, mongoose_1.model)("Comment", exports.commentSchema);
