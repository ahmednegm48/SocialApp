"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const user_enum_1 = require("../../Utils/enums/user.enum");
exports.UserSchema = new mongoose_1.Schema({
    firstname: { type: String, required: true, minLength: 2, maxLength: 25 },
    lastname: { type: String, required: true, minLength: 2, maxLength: 25 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    confirmEmailOTP: String,
    confirmedAt: Date,
    password: { type: String, required: true },
    resetPasswordOTP: String,
    phone: String,
    address: String,
    gender: {
        type: String,
        enum: Object.values(user_enum_1.GenderEnum),
        default: user_enum_1.GenderEnum.MALE,
    },
    role: {
        type: String,
        enum: Object.values(user_enum_1.RoleEnum),
        default: user_enum_1.RoleEnum.USER,
    },
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            delete ret.password;
            delete ret.confirmEmailOTP;
            delete ret.resetPasswordOTP;
            return ret;
        },
    },
});
exports.UserSchema.virtual("userName")
    .set(function (value) {
    const [firstName, ...rest] = value.trim().split(/\s+/);
    this.set({ firstName, lastName: rest.join(" ") });
})
    .get(function () {
    return `${this.firstname} ${this.lastname}`;
});
exports.UserModel = (0, mongoose_1.model)("User", exports.UserSchema);
