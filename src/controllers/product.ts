import { Request, Response } from "express";
import { Types } from "mongoose";
import Product from "../models/product";
import { isAuthorized } from "../services/auth";
import { IProduct } from "../types/product";
export const getProducts = async (_: Request, res: Response) => {
  try {
    const products: Array<IProduct> = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  if (!Types.ObjectId.isValid(_id))
    return res.status(400).send("No product was found with provided id");

  const product: IProduct = await Product.findById(_id);
  return res.status(200).json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const product = req.body;
  const newProduct = new Product({ ...product });
  try {
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message as string });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  try {
    const productById = await Product.findById({ _id });
    const isAuthorizedToUpdate = await isAuthorized(req, productById.userId, false);
    if (!isAuthorizedToUpdate) {
      return res.status(403).send({ error: "Forbidden" });
    }
  } catch (error) {
    const err = error.length ? error : 'Product was not found';
    return res.status(404).send({ error: err });
  }
  const updatedProduct = req.body;
  if (!Types.ObjectId.isValid(_id))
    return res.status(400).send("No product with that id");

  const updateProduct = await Product.findOneAndUpdate(
    { _id },
    { ...updatedProduct, _id },
    { new: true }
  );
  res.status(200).json(updateProduct);
};

export const removeProduct = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  try {
    const productById = await Product.findById({ _id });
    const isAuthorizedToUpdate = await isAuthorized(req, productById.userId, true);
    if (!isAuthorizedToUpdate) {
      return res.status(403).send({ error: "Forbidden" });
    }
  } catch (error) {
    const err = error.length ? error : 'Product was not found';
    return res.status(404).send({ error: err });
  }
  if (!Types.ObjectId.isValid(_id))
    return res.status(400).send("No product with that id");

  await Product.findOneAndDelete({ _id });
  res.status(200).json({ message: "Product was removed" });
};
