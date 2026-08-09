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
            : { $addToSet: { likes: userId } }, { returnDocument: 'after' });
        return res
            .status(201)
            .json({
            message: alreadyLiked
                ? "Like Removed Successfully"
                : " Post Liked Successfully ",
            data: updated,
        });
    };
}
exports.default = new PostService();
