import { Schema } from "mongoose";

export interface IRefreshToken {
  user: Schema.Types.ObjectId;
  token: string;
  expires: Date,
  created: Date,
}