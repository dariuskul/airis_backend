import express, { Request, Response } from 'express';

const app = express();

app.get('/', (_, res: Response) => {
  res.send('Hello, its airisss');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Connected to apps`)
})