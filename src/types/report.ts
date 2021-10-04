
import { IExpense } from "./expense";

export interface IReport {
  dateCreated: Date,
  expenses: Array<IExpense>,
  status: string,
  subTotal: number,
  discount: number,
  total: number,
}