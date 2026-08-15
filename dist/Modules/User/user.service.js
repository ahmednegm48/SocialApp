"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../../Utils/response/error.response");
const user_model_1 = require("../../DB/Models/user.model");
const friendRequest_model_1 = require("../../DB/Models/friendRequest.model");
class UserService {
    constructor() { }
    sendFriendRequest = async (req, res) => {
        const { userId } = req.params;
        const senderId = req.user._id;
        if (userId === senderId.toString())
            throw new error_response_1.BadRequestException("Are you kidding me");
        const target = await user_model_1.UserModel.findById(userId);
        if (!target)
            throw new error_response_1.NotFoundException("User Not Found");
        if (target.blockedUsers?.some((id) => id.equals(senderId)) ||
            req.user.blockedUsers?.some((id) => id.equals(target._id)))
            throw new error_response_1.ForbiddenException("cannot send request to this user");
        if (target.friends?.some((id) => id.equals(senderId)))
            throw new error_response_1.ConflictException("You Are Already Friends");
        const existing = await friendRequest_model_1.friendRequestModel.findOne({
            $or: [
                { sendBy: userId, sendTo: senderId },
                { sendBy: senderId, sendTo: userId },
            ],
        });
        if (existing)
            throw new error_response_1.ConflictException("a request is sent already");
        const friendRequest = await friendRequest_model_1.friendRequestModel.create({
            sendBy: senderId,
            sendTo: userId,
        });
        return res.status(201).json({
            message: " Freind Request Sent Successfully ",
            data: { friendRequest },
        });
    };
    listFriendRequest = async (req, res) => {
        const friendRequest = await friendRequest_model_1.friendRequestModel
            .find({
            sendTo: req.user._id,
        })
            .populate("sendBy", "firstname lastname -_id")
            .lean();
        return res.status(201).json({
            message: " Request retreived Successfully ",
            data: { friendRequest },
        });
    };
    acceptFriendRequest = async (req, res) => {
        const { requestId } = req.params;
        const friendRequest = await friendRequest_model_1.friendRequestModel.findOne({
            _id: requestId,
            sendTo: req.user._id,
        });
        if (!friendRequest)
            throw new error_response_1.NotFoundException("not found request");
        await Promise.all([
            user_model_1.UserModel.updateOne({ _id: friendRequest.sendBy }, { $addToSet: { friends: friendRequest.sendTo } }),
            user_model_1.UserModel.updateOne({ _id: friendRequest.sendTo }, { $addToSet: { friends: friendRequest.sendBy } }),
        ]);
        await friendRequest_model_1.friendRequestModel.deleteOne({ _id: requestId });
        return res.status(201).json({
            message: " Request Accepted Successfully ",
        });
    };
    rejectFriendRequest = async (req, res) => {
        const { requestId } = req.params;
        const friendRequest = await friendRequest_model_1.friendRequestModel.findOneAndDelete({
            _id: requestId,
            $or: [{ sendTo: req.user._id }, { sendBy: req.user._id }],
        });
        if (!friendRequest)
            throw new error_response_1.NotFoundException("not found request");
        return res.status(201).json({
            message: " Request Rejected Successfully ",
        });
    };
    removeFriend = async (req, res) => {
        const { userId } = req.params;
        const myId = req.user._id;
        await Promise.all([
            user_model_1.UserModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
            user_model_1.UserModel.updateOne({ _id: myId }, { $pull: { friends: userId } }),
        ]);
        return res.status(201).json({
            message: " Friend Removed Successfully ",
        });
    };
    blockUser = async (req, res) => {
        const { userId } = req.params;
        const myId = req.user._id;
        if (userId === req.user._id.toString())
            throw new error_response_1.BadRequestException("you cannot block yourself");
        const target = await user_model_1.UserModel.findById(userId);
        if (!target)
            throw new error_response_1.NotFoundException("user not found");
        await Promise.all([
            user_model_1.UserModel.updateOne({ _id: myId }, { $addToSet: { blockedUsers: userId }, $pull: { friends: userId } }),
            user_model_1.UserModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
            friendRequest_model_1.friendRequestModel.deleteMany({
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
    unblockUser = async (req, res) => {
        const { userId } = req.params;
        const myId = req.user._id;
        const updated = await user_model_1.UserModel.updateOne({ _id: myId }, { $pull: { blockedUsers: userId } });
        if (!updated)
            throw new error_response_1.NotFoundException("user not found");
        return res.status(201).json({
            message: " User Unblocked Successfully ",
        });
    };
}
exports.default = new UserService();
