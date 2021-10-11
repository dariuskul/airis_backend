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
    default: 0,
  }
})

const expense = model('product', ProductSchema);
export default expense;