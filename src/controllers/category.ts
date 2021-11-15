import { Request, Response } from "express";
import { ICategory } from "../types/category";
import Category from '../models/category';
import { Types } from "mongoose";
export const getCategories = async (_: Request, res: Response) => {
  try {
    const categories: Array<ICategory> = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const category = req.body;
  const newCategory = new Category({ ...category });
  try {
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message as string });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const updatedExpense = req.body;

  if (!Types.ObjectId.isValid(_id)) return res.status(400).send('No category with that id');

  const updateExpense = await Category.findOneAndUpdate({ _id }, { ...updatedExpense, _id }, { new: true });
  res.status(200).json(updateExpense);
}


export const removeCategory = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  if (!Types.ObjectId.isValid(_id)) return res.status(400).send('No category with that id');

  await Category.findOneAndDelete({ _id });
  res.status(200).json({ message: 'Category was removed' });
};