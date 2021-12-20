import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/user";
import Report from "../models/report";
import { IUser } from "../types/user";
import { auth, create, getUserByToken, isAuthorized, tokenRefresh } from "../services/auth";
import jwt from 'jsonwebtoken';
import { ERoles } from "../enums/roles";
import { hashSync } from "bcryptjs";

export const authenticate = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Provide username and password' });
  }
  try {
    const user = await auth(req.body);
    setTokenCookie(res, user.refreshToken);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  try {
    const { refreshToken, ...user } = await tokenRefresh({ token: token });
    setTokenCookie(res, refreshToken);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error })
  }
}


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users: Array<IUser> = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  if (!Types.ObjectId.isValid(_id))
    return res.status(400).send("No user was found with provided id");

  const user: IUser = await User.findById(_id);
  return res.status(200).json(user);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const isAuthorizedToUpdate = await isAuthorized(req, _id, true);
  if (!isAuthorizedToUpdate) {
    return res.status(403).send({ error: 'Forbidden' });
  }
  const updatedUser = req.body;
  if (updatedUser.password) {
    updatedUser.passwordHash = hashSync(updatedUser.password);
  }

  if (!Types.ObjectId.isValid(_id))
    return res.status(400).send("No user with that id");

  const updateUser = await User.findOneAndUpdate(
    { _id },
    { ...updatedUser, _id },
    { new: true }
  );
  res.status(200).json(updateUser);
};

export const removeUser = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const isAuthorizedToUpdate = await isAuthorized(req, _id, true);
  if (!isAuthorizedToUpdate) {
    return res.status(403).send({ error: 'Forbidden' });
  }
  if (!Types.ObjectId.isValid(_id))
    return res.status(400).send("No user with that id");

  await User.findOneAndDelete({ _id });
  res.status(200).json({ message: "User was removed" });
};

export const getUserProducts = async (req: Request, res: Response) => {
  const { userId, reportId } = req.params;
  const user = await User.find({ userId });
  if (!user) {
    return res.status(400).send("User not found with id");
  }
  const userReports = await Report.find({ user }).populate('expenses');

  if (!userReports) {
    return res.status(400).send("Reports not found");
  }
  const report = userReports.find((report: any) => report._id.toString() === reportId);

  if (!report) {
    return res.status(400).send("Report not found");
  }
  res.status(200).json(report.expenses);

};

const setTokenCookie = (res: Response, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
  res.cookie('refreshToken', token, cookieOptions);
}

