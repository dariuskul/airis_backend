import express, { Request, Response } from 'express';

const app = express();

app.get('/test', (_, res: Response) => {
  res.send('Hello, its airis');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Connected to app`)
})