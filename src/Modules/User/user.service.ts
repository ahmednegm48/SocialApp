import { Request, Response } from "express";
import { IRequestIdParamsDTO, IUserIdParamsDTO } from "./user.dto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../../Utils/response/error.response";
import { UserModel } from "../../DB/Models/user.model";
import { friendRequestModel } from "../../DB/Models/friendRequest.model";

class UserService {
  constructor() {}

  sendFriendRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as { userId: string };
    const senderId = req.user!._id;

    if (userId === senderId.toString())
      throw new BadRequestException("Are you kidding me");

    const target = await UserModel.findById(userId);
    if (!target) throw new NotFoundException("User Not Found");
    if (
      target.blockedUsers?.some((id) => id.equals(senderId)) ||
      req.user!.blockedUsers?.some((id) => id.equals(target._id))
    )
      throw new ForbiddenException("cannot send request to this user");

    if (target.friends?.some((id) => id.equals(senderId)))
      throw new ConflictException("You Are Already Friends");

    const existing = await friendRequestModel.findOne({
      $or: [
        { sendBy: userId, sendTo: senderId },
        { sendBy: senderId, sendTo: userId },
      ],
    });
    if (existing) throw new ConflictException("a request is sent already");

    const friendRequest = await friendRequestModel.create({
      sendBy: senderId,
      sendTo: userId,
    });

    return res.status(201).json({
      message: " Freind Request Sent Successfully ",
      data: { friendRequest },
    });
  };

  listFriendRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const friendRequest = await friendRequestModel
      .find({
        sendTo: req.user!._id,
      })
      .populate("sendBy", "firstname lastname -_id")
      .lean();

    return res.status(201).json({
      message: " Request retreived Successfully ",
      data: { friendRequest },
    });
  };

  acceptFriendRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { requestId }: IRequestIdParamsDTO = req.params as {
      requestId: string;
    };

    const friendRequest = await friendRequestModel.findOne({
      _id: requestId,
      sendTo: req.user!._id,
    });
    if (!friendRequest) throw new NotFoundException("not found request");

    await Promise.all([
      UserModel.updateOne(
        { _id: friendRequest.sendBy },
        { $addToSet: { friends: friendRequest.sendTo } },
      ),
      UserModel.updateOne(
        { _id: friendRequest.sendTo },
        { $addToSet: { friends: friendRequest.sendBy } },
      ),
    ]);

    await friendRequestModel.deleteOne({ _id: requestId });

    return res.status(201).json({
      message: " Request Accepted Successfully ",
    });
  };

  rejectFriendRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { requestId }: IRequestIdParamsDTO = req.params as {
      requestId: string;
    };

    const friendRequest = await friendRequestModel.findOneAndDelete({
      _id: requestId,
      $or: [{ sendTo: req.user!._id }, { sendBy: req.user!._id }],
    });
    if (!friendRequest) throw new NotFoundException("not found request");

    return res.status(201).json({
      message: " Request Rejected Successfully ",
    });
  };

  removeFriend = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as {
      userId: string;
    };
    const myId = req.user!._id;

    await Promise.all([
      UserModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
      UserModel.updateOne({ _id: myId }, { $pull: { friends: userId } }),
    ]);

    return res.status(201).json({
      message: " Friend Removed Successfully ",
    });
  };

  blockUser = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as {
      userId: string;
    };
    const myId = req.user!._id;

    if (userId === req.user!._id.toString())
      throw new BadRequestException("you cannot block yourself");

    const target = await UserModel.findById(userId);
    if (!target) throw new NotFoundException("user not found");
    await Promise.all([
      UserModel.updateOne(
        { _id: myId },
        { $addToSet: { blockedUsers: userId }, $pull: { friends: userId } },
      ),
      UserModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
      friendRequestModel.deleteMany({
        $or: [
          { sendBy: myId, sendTo: userId },
          { sendBy: userId, sendTo: myId },
        ],
      }),
    ]);

    return res.status(201).json({
      message: " User Blocked Successfully ",
    });
  };

  unblockUser = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as {
      userId: string;
    };
    const myId = req.user!._id;

    const updated = await UserModel.updateOne(
      { _id: myId },
      { $pull: { blockedUsers: userId } },
    );
    if (!updated) throw new NotFoundException("user not found");

    return res.status(201).json({
      message: " User Unblocked Successfully ",
    });
  };
}

export default new UserService();
