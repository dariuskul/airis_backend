import express, { Request, Response } from 'express';

const app = express();

const port: number = 5000;

app.get('/', (_, res: Response) => {
  res.send('Hello, its airis');
});

app.listen(port, () => {
  console.log(`Connected to port ${port}`)
})