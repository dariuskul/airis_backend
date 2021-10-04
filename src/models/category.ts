import { Schema, model } from "mongoose";
import { ICategory } from "../types/category";

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'category is required'],
  },
})

const category = model('category', CategorySchema);
export default category;