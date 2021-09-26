import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import expense from './routes/expense';
import dotenv from 'dotenv'

dotenv.config();
const app = express();

app.use(express.json());
app.use('/expense', expense);

app.get('/', (_, res: Response) => {
  res.send('Hello, its airisss');
});
console.log(process.env.CONNECTION_URL);
mongoose.connect(process.env.CONNECTION_URL!).then(() =>
  app.listen(process.env.PORT || 3000, () => console.log(`Server running`))).catch((error) => console.log(error));
