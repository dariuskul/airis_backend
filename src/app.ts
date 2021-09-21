import express, { Request, Response } from 'express';

const app = express();

const port = process.env.PORT || 5000;

app.get('/test', (_, res: Response) => {
  res.send('Hello, its airis');
});

app.listen(process.env.PORT, () => {
  console.log(`Connected to app ${port}`)
})