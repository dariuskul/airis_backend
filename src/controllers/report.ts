import { AnyARecord } from "dns";
import { Request, Response } from "express";
import { Types } from "mongoose";
import Report from "../models/report";
import { getUserByToken, isAuthorized } from "../services/auth";
import { sendEmail } from "../services/email";
import { IReport } from "../types/report";
import { buildPDF } from "../utilities/generatePDF";

export const getReports = async (req: Request, res: Response) => {
  const userId = (getUserByToken(req) as any);
  try {
    const reports: Array<IReport> = await Report.find({ user: userId }).populate({
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
  try {
    const report = await Report.findById({ _id });
    const isAuthorizedToUpdate = await isAuthorized(req, report.user, false);
    if (!isAuthorizedToUpdate) {
      return res.status(403).send({ error: "Forbidden" });
    }
    if (!updatedReport.expenses.length) {
      await Report.findOneAndDelete({ _id });
    }
    const updateExpense = await Report.findOneAndUpdate(
      { _id },
      { ...updatedReport, _id },
      { new: true }
    );
    res.status(200).json(updateExpense);
  } catch (error) {
    const err = error.length ? error : 'Product was not found';
    return res.status(404).send({ error: err });
  }

};

export const removeReport = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const report = await Report.findById({ _id }).populate({
    path: "expenses",
    populate: [{ path: "category", select: "-_id" }, { path: "products" }],
  });
  try {
    const isAuthorizedToUpdate = await isAuthorized(req, report.user, true);
    if (!isAuthorizedToUpdate) {
      return res.status(403).send({ error: "Forbidden" });
    }
    await Report.findOneAndDelete({ _id });
    res.status(200).json({ message: "Report was removed" });
  } catch (error) {
    const err = error.length ? error : 'Report was not found';
    return res.status(404).send({ error: err });
  }
};

export const generatePdf = async (req: Request, res: Response) => {
  const { from, to, userId, reportId, send } = req.body;
  console.log(req.body);
  if ((send && (!from || !to)) || !userId || !reportId) {
    console.log(from, to, userId, reportId, send);
    return res.status(400).json({ error: 'Bad request' });
  }
  console.log('test');
  try {
    const report = await Report.findById({ _id: reportId.toString() }).populate({
      path: "expenses",
      populate: [{ path: "category", select: "-_id" }, { path: "products" }],
    });
    const isAuthorizedToUpdate = await isAuthorized(req, report.user, true);
    console.log(isAuthorizedToUpdate);
    if (!isAuthorizedToUpdate) {
      return res.status(403).send({ error: "Forbidden" });
    }
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
      report,
    );

    if (send) {
      buildPDF(
        buffers.push.bind(buffers),
        () => {
          let pdfData = Buffer.concat(buffers);
          sendEmail(req, res, pdfData, { from: from, to: to });
        },
        report,
      );
    }

  } catch (error) {
    const err = error.length ? error : 'Product was not found';
    return res.status(404).send({ error: err });
  }
};

