import { compareSync } from 'bcryptjs'
import config from '../config.json';
import crypto from 'crypto-js'
import RefreshToken from '../models/refreshToken';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { ILogin, IRegister, IUser } from "../types/user";
import { hashSync } from 'bcryptjs'
import { Request } from 'express';
import { ERoles } from '../enums/roles';
export const auth = async ({ username, password }: ILogin) => {
  const user = await User.findOne({ username });
  if (!user || !compareSync(password, user.passwordHash)) {
    throw { error: 'Username or password is incorrect' }
  }
  const token = jwt.sign({ sub: user.id }, config.JWT_KEY, { expiresIn: '1h' })
  const refreshToken = generateRefreshToken(user);

  // save refresh token
  await refreshToken.save();
  return {
    ...userDetails(user),
    token,
    refreshToken: refreshToken.token,
  }
}

export const create = async (userObject: IRegister) => {
  if (!userObject.username || !userObject.password || !userObject.surname || !userObject.dateOfBirth) {
    throw { error: 'Fill all required fields' }
  }

  if (await User.findOne({ username: userObject.username })) {
    throw { error: `Username: ${userObject.username} is already taken` }
  }

  const user = new User(userObject);
  user.passwordHash = hashSync(userObject.password);
  await user.save();

  return user;
}

export const tokenRefresh = async ({ token }: { token: string }) => {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(user);
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = jwt.sign({ sub: user.id }, config.JWT_KEY, { expiresIn: '1h' })

  // return basic details and tokens
  return {
    ...userDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token
  };
}

const getRefreshToken = async (token: string) => {
  try {
    const refreshToken = await RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
  } catch (error) {
    throw error;
  }
}

const generateRefreshToken = (user: any) => {
  // create a refresh token that expires in 7 days
  return new RefreshToken({
    user: user.id,
    token: config.JWT_KEY,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}

const userDetails = (user: IUser) => {
  const { role, username, name, surname } = user;
  return { role, username, name, surname };
}

export const getUserByToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = jwt.decode(authHeader.split(' ')[1]);
    return token?.sub;
  }
}

export const isAuthorized = async (req: Request, _id: string, canAdmin?: boolean) => {
  const userId = getUserByToken(req);
  const userInfo = await User.findById(userId);
  console.log(_id.toString(), userId, userInfo.role);
  const isAuthorizedToUpdate = _id.toString() === userId || (canAdmin && userInfo.role === ERoles.Admin);
  return isAuthorizedToUpdate;
}
