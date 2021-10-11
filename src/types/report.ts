
import { IExpense } from "./expense";
import { IUser } from "./user";

export interface IReport {
  dateCreated: Date,
  expenses: Array<IExpense>,
  status: string,
  subTotal: number,
  discount: number,
  total: number,
  user: IUser,
}