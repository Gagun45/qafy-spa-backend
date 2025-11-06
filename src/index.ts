import express, { Express, Request, Response } from 'express';

// Initialize the Express application
const app: Express = express();
const port = process.env.PORT || 3000;

// Define a simple route with explicit types from the Express types
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express and TypeScript!');
});

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});