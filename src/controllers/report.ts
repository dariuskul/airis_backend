
import { Request, Response } from "express";
import { Types } from "mongoose";
import Report from "../models/report";
import { IReport } from "../types/report";
import { generatePDF } from "../utilities/generatePDF";
export const getReports = async (_: Request, res: Response) => {
  try {
    const reports: Array<IReport> = await Report.find().populate({
      path: "expenses",
      populate: { path: "category", select: '-_id' }
    });
    res.status(200).json(reports);
  } catch (err) {
    res.status(404).json({ message: err })
  }
};

export const getReport = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  if (!Types.ObjectId.isValid(_id)) return res.status(404).send('No expense found with that id');

  const report: IReport = await Report.findById(_id);
  return res.status(200).json(report);
};

export const createReport = async (req: Request, res: Response) => {
  const report = req.body;
  const newReport = new Report({ ...report });
  if (newReport.expenses.length < 1) {
    return res.status(404).send({ error: 'At least one expense should be included into the report' });
  }
  try {
    await newReport.save();
    res.status(200).json(newReport);
  } catch (error) {
    res.status(404).json({ message: error.message as string });
  }
};


export const updateReport = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const updatedReport = req.body;

  if (!Types.ObjectId.isValid(_id)) return res.status(404).send('No report with that id');

  const updateExpense = await Report.findOneAndUpdate({ _id }, { ...updatedReport, _id }, { new: true });
  res.status(200).json(updateExpense);
};

export const removeReport = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  if (!Types.ObjectId.isValid(_id)) return res.status(404).send('No report with that id');

  await Report.findOneAndDelete({ _id });
  res.status(200).json({ message: 'Report was removed' });
};

export const getUserExpenes = async (req: Request, res: Response) => {
  console.log('ha');

};


export const generatePdf = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Report generation' });
};


