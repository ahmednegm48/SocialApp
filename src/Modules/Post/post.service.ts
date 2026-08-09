import { Request, Response } from "express";
import { ICreatePostDTO, ITogglePostDTO } from "./post.dto";
import {
  BadRequestException,
  NotFoundException,
} from "../../Utils/response/error.response";
import { PostModel } from "../../DB/Models/post.model";

class PostService {
  constructor() {}

  createPost = async (req: Request, res: Response): Promise<Response> => {
    const { content }: ICreatePostDTO = req.body;

    const files = req.files as Express.Multer.File[] | undefined;
    if (!content && !files?.length)
      throw new BadRequestException("Post must have content or attachments");
    const post = await PostModel.create({
      ...(content && { content }),
      ...(files?.length && { attachments: files.map((file) => file.path) }),
      createdBy: req.user!._id,
    });
    return res
      .status(201)
      .json({ message: "Post created Successfully", data: { post } });
  };

  toggleLike = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: ITogglePostDTO = req.params as { postId: string };
    const userId = req.user!._id;

    const post = await PostModel.findOne({
      _id: postId,
      freezedAt: { $exists: false },
    });
    if (!post) throw new NotFoundException("Post Is Not Found");
    const alreadyLiked = post.likes?.some((id) => id.equals(userId));
    const updated = await PostModel.findByIdAndUpdate(
      postId,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
        {returnDocument: 'after'}
    );

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

export default new PostService();
