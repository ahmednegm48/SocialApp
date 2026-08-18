"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../../Utils/response/error.response");
const post_model_1 = require("../../DB/Models/post.model");
class PostService {
    constructor() { }
    createPost = async (req, res) => {
        const { content } = req.body;
        const files = req.files;
        if (!content && !files?.length)
            throw new error_response_1.BadRequestException("Post must have content or attachments");
        const post = await post_model_1.PostModel.create({
            ...(content && { content }),
            ...(files?.length && { attachments: files.map((file) => file.path) }),
            createdBy: req.user._id,
        });
        return res
            .status(201)
            .json({ message: "Post created Successfully", data: { post } });
    };
    toggleLike = async (req, res) => {
        const { postId } = req.params;
        const userId = req.user._id;
        const post = await post_model_1.PostModel.findOne({
            _id: postId,
            freezedAt: { $exists: false },
        });
        if (!post)
            throw new error_response_1.NotFoundException("Post Is Not Found");
        const alreadyLiked = post.likes?.some((id) => id.equals(userId));
        const updated = await post_model_1.PostModel.findByIdAndUpdate(postId, alreadyLiked
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId } }, { returnDocument: "after" });
        return res.status(201).json({
            message: alreadyLiked
                ? "Like Removed Successfully"
                : " Post Liked Successfully ",
            data: updated,
        });
    };
    updatePost = async (req, res) => {
        const { postId } = req.params;
        const { content } = req.body;
        const post = await post_model_1.PostModel.findOneAndUpdate({
            _id: postId,
            createdBy: req.user._id,
        }, {
            content,
            $inc: { __v: 1 },
        }, { returnDocument: "after" });
        if (!post)
            throw new error_response_1.NotFoundException("Post Is Not Found");
        return res.status(201).json({
            message: " Post Updated Successfully ",
            data: post,
        });
    };
    deletePost = async (req, res) => {
        const { postId } = req.params;
        const post = await post_model_1.PostModel.findOneAndDelete({
            _id: postId,
            createdBy: req.user._id,
        });
        if (!post)
            throw new error_response_1.NotFoundException("Post Is Not Found");
        return res.status(201).json({
            message: " Post Deleted Successfully ",
        });
    };
    getPost = async (req, res) => {
        const { postId } = req.params;
        const post = await post_model_1.PostModel.findOne({
            _id: postId,
            freezedAt: { $exists: false },
        }).populate("createdBy", "firstname lastname  email -_id").lean();
        if (!post)
            throw new error_response_1.NotFoundException("Post Is Not Found");
        return res.status(201).json({
            message: " Post Retreived Successfully ",
            data: post,
        });
    };
}
exports.default = new PostService();
