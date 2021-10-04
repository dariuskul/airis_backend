import { ICategory } from './category'
export interface IExpense {
  date: Date;
  cost: number;
  merchantName: string;
  category: ICategory;
  description: string;
}