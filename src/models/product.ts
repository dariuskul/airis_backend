import { Schema, model } from "mongoose";
import { IProduct } from "../types/product";

const ProductSchema = new Schema<IProduct>({
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  quantity: {
    type: Number,
    default: 1,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User is required'],
  }
})

const expense = model('product', ProductSchema);
export default expense;