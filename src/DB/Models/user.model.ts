import { HydratedDocument, Model, model, Schema, Types } from "mongoose";
import { GenderEnum, RoleEnum } from "../../Utils/enums/user.enum";

export interface IUser {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  username?: string;
  email: string;
  confirmEmailOTP?: string;
  confirmedAt?: Date;
  password: string;
  resetPasswordOTP?: string;
  phone: string;
  address?: string;
  gender: GenderEnum;
  role: RoleEnum;
  createdAt: Date;
  updatedAt?: Date;
}

export const UserSchema = new Schema<IUser>(
  {
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
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.confirmEmailOTP;
        delete ret.resetPasswordOTP;
        return ret;
      },
    },
  },
);

UserSchema.virtual("userName")
  .set(function (value: string) {
    const [firstName, ...rest] = value.trim().split(/\s+/);
    this.set({ firstName, lastName: rest.join(" ") });
  })
  .get(function (this: IUser) {
    return `${this.firstname} ${this.lastname}`;
  });

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);

export type HUserDocument = HydratedDocument<IUser>;
