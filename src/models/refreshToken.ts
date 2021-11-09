import { Schema, model } from "mongoose";
import { IRefreshToken } from "../types/refreshToken";
const RefreshTokenSchema = new Schema<IRefreshToken>({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  token: String,
  expires: Date,
  created: { type: Date, default: new Date() },
}, {
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true, versionKey: false },
});

RefreshTokenSchema.virtual('isExpired').get(function (this: { expires: Date }) {
  return Date.now() >= this.expires.getTime();
})

RefreshTokenSchema.virtual('isActive').get(function (this: { isExpired: boolean }) {
  return !this.isExpired;
});


const refreshToken = model("RefreshToken", RefreshTokenSchema);

export default refreshToken;
