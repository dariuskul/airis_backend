import { Schema } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  quantity: number;
  userId: Schema.Types.ObjectId;
}