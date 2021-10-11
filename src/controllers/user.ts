import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/user";
import Report from "../models/report";
import Product from "../models/product";
import { IUser } from "../types/user";
import { IReport } from "../types/report";
import expense from "../models/expense";
export const getUsers = async (_: Request, res: Response) => {
  try {
    const users: Array<IUser> = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  if (!Types.ObjectId.isValid(_id))
    return res.status(404).send("No user was found with provided id");

  const user: IUser = await User.findById(_id);
  return res.status(200).json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const user = req.body;
  const newUser = new User({ ...user });
  try {
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(404).json({ message: error.message as string });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const updatedUser = req.body;

  if (!Types.ObjectId.isValid(_id))
    return res.status(404).send("No user with that id");

  const updateUser = await User.findOneAndUpdate(
    { _id },
    { ...updatedUser, _id },
    { new: true }
  );
  res.status(200).json(updateUser);
};

export const removeUser = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  if (!Types.ObjectId.isValid(_id))
    return res.status(404).send("No user with that id");

  await User.findOneAndDelete({ _id });
  res.status(200).json({ message: "User was removed" });
};

export const getUserProducts = async (req: Request, res: Response) => {
  const { userId, reportId } = req.params;
  const user = await User.find({ userId });
  if (!user) {
    return res.status(404).send("User not found with id");
  }
  const userReports = await Report.find({ user }).populate('expenses');

  if (!userReports) {
    return res.status(404).send("Reports not found");
  }
  const report = userReports.find((report: any) => report._id.toString() === reportId);
  console.log(report);

  if (!report) {
    return res.status(404).send("Report not found");
  }
  res.status(200).json(report.expenses);

};

