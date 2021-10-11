import { Request, Response } from "express";
import { Types } from "mongoose";
import Expense from "../models/expense";
import { IExpense } from "../types/expense";

export const getExpenses = async (_: Request, res: Response) => {
  try {
    const expenses: Array<IExpense> = await Expense.find().populate('category');
    res.status(200).json(expenses);
  } catch (err) {
    res.status(404).json({ message: err })
  }
};

export const getExpense = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  if (!Types.ObjectId.isValid(_id)) return res.status(404).send('No expense found with that id');

  const expense: IExpense = await Expense.findById(_id);
  return res.status(200).json(expense);

};

export const createExpense = async (req: Request, res: Response) => {
  const expense = req.body;
  const newExpense = new Expense({ ...expense });
  console.log(newExpense.products.length);
  if (newExpense.products.length < 1) {
    return res.status(404).send({ error: 'At least one product should be included into the expense' });
  }
  try {
    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(404).json({ message: error.message as string });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const updatedExpense = req.body;

  if (!Types.ObjectId.isValid(_id)) return res.status(404).send('No expense with that id');

  const updateExpense = await Expense.findOneAndUpdate({ _id }, { ...updatedExpense, _id }, { new: true });
  res.status(200).json(updateExpense);

};

export const removeExpense = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  if (!Types.ObjectId.isValid(_id)) return res.status(404).send('No expense with that id');

  await Expense.findOneAndDelete({ _id });
  res.status(200).json({ message: 'Expense was removed' });
};
