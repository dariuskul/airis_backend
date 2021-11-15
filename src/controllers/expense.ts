import { Request, Response } from "express";
import { Types } from "mongoose";
import Expense from "../models/expense";
import { isAuthorized } from "../services/auth";
import { IExpense } from "../types/expense";

export const getExpenses = async (_: Request, res: Response) => {
  try {
    const expenses: Array<IExpense> = await Expense.find().populate('category');
    res.status(200).json(expenses);
  } catch (err) {
    res.status(400).json({ message: err })
  }
};

export const getExpense = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  try {
    const expenseById = await Expense.findById({ _id });
    const isAuthorizedToUpdate = await isAuthorized(req, expenseById.userId, true);
    if (!isAuthorizedToUpdate) {
      return res.status(403).send({ error: "Forbidden" });
    }
    if (!Types.ObjectId.isValid(_id)) return res.status(400).send('No expense found with that id');

    const expense: IExpense = await Expense.findById(_id);
    return res.status(200).json(expense);
  } catch (error) {
    const err = error.length ? error : 'Expense was not found';
    return res.status(404).send({ error: err });
  }


};

export const createExpense = async (req: Request, res: Response) => {
  const expense = req.body;
  const newExpense = new Expense({ ...expense });
  if (newExpense.products.length < 1) {
    return res.status(400).send({ error: 'At least one product should be included into the expense' });
  }
  try {
    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message as string });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  try {
    const expenseById = await Expense.findById({ _id });
    const isAuthorizedToUpdate = await isAuthorized(req, expenseById.userId, false);
    if (!isAuthorizedToUpdate) {
      return res.status(403).send({ error: "Forbidden" });
    }
    const updatedExpense = req.body;

    if (!Types.ObjectId.isValid(_id)) return res.status(400).send('No expense with that id');

    const updateExpense = await Expense.findOneAndUpdate({ _id }, { ...updatedExpense, _id }, { new: true });
    res.status(200).json(updateExpense);
  } catch (error) {
    const err = error.length ? error : 'Expense was not found';
    return res.status(404).send({ error: err });
  }

};

export const removeExpense = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  try {
    const expenseById = await Expense.findById({ _id });
    const isAuthorizedToUpdate = await isAuthorized(req, expenseById.userId, true);
    console.log(isAuthorizedToUpdate);
    if (!isAuthorizedToUpdate) {
      return res.status(403).send({ error: "Forbidden" });
    }
    if (!Types.ObjectId.isValid(_id)) return res.status(400).send('No expense with that id');

    await Expense.findOneAndDelete({ _id });
    res.status(200).json({ message: 'Expense was removed' });
  } catch (error) {
    const err = error.length ? error : 'Expense was not found';
    return res.status(404).send({ error: err });
  }
};
