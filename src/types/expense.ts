import { ICategory } from './category'
import { IProduct } from './product';
import { IUser } from './user';
export interface IExpense {
  date: Date;
  cost: number;
  merchantName: string;
  category: ICategory;
  description: string;
  products: Array<IProduct>;
  userId: IUser;
}