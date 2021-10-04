import { Schema, model } from "mongoose";
import { Status } from "../enums/status";
import { IReport } from "../types/report";

const ReportSchema = new Schema<IReport>({
  dateCreated: {
    type: Date,
    required: [true, 'Date field is required'],
    default: new Date(),
  },
  discount: {
    type: Number,
    required: [true, 'Cost field is required'],
    default: 0,
  },
  expenses: [{
    type: Schema.Types.ObjectId,
    ref: 'expense',
  }],
  status: {
    type: String,
    required: true,
    default: Status.Open,
  },
  subTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },

})

const report = model('report', ReportSchema);
export default report;