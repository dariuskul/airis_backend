import { AnyARecord } from "dns";
import { Request, Response } from "express";
import { Types } from "mongoose";
import Report from "../models/report";
import { sendEmail } from "../services/email";
import { IReport } from "../types/report";
import { buildPDF } from "../utilities/generatePDF";
export const getReports = async (_: Request, res: Response) => {
  try {
    const reports: Array<IReport> = await Report.find().populate({
      path: "expenses",
      populate: { path: "category", select: "-_id" },
    });
    res.status(200).json(reports);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const getReport = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  if (!Types.ObjectId.isValid(_id))
    return res.status(400).send("No expense found with that id");

  const report: IReport = await Report.findById(_id);
  return res.status(200).json(report);
};

export const createReport = async (req: Request, res: Response) => {
  const report = req.body;
  const newReport = new Report({ ...report });
  if (newReport.expenses.length < 1) {
    return res
      .status(400)
      .send({
        error: "At least one expense should be included into the report",
      });
  }
  try {
    await newReport.save();
    res.status(200).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message as string });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const updatedReport = req.body;

  if (!Types.ObjectId.isValid(_id))
    return res.status(400).send("No report with that id");

  const updateExpense = await Report.findOneAndUpdate(
    { _id },
    { ...updatedReport, _id },
    { new: true }
  );
  res.status(200).json(updateExpense);
};

export const removeReport = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  if (!Types.ObjectId.isValid(_id))
    return res.status(400).send("No report with that id");

  await Report.findOneAndDelete({ _id });
  res.status(200).json({ message: "Report was removed" });
};

export const generatePdf = async (req: Request, res: Response) => {
  const { id, send } = req.params;
  const emailInfo = req.body;
  if (send && !emailInfo.from || !emailInfo.to) {
    return res.status(400).json({ error: 'Bad request' });
  }

  const reports = await Report.find().populate({
    path: "expenses",
    populate: [{ path: "category", select: "-_id" }, { path: "products" }],
  });
  const userReports = reports?.filter(
    (report: any) => report.user._id.toString() === id
  );
  const buffers: any = [];
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment;filename=summary.pdf",
  });
  buildPDF(
    (chunk: any) => {
      stream.write(chunk);
    },
    () => {
      stream.end();
    },
    userReports
  );
  console.log(send);
  if (send) {
    buildPDF(
      buffers.push.bind(buffers),
      () => {
        let pdfData = Buffer.concat(buffers);
        sendEmail(req, res, pdfData, emailInfo);
      },
      userReports
    );
  }
};

