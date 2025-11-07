import express, { Express, Request, Response } from "express";
import reviewsRouter from "./routes/reviews";
import contactRouter from "./routes/contact";
import dotenv from "dotenv";
import cors from "cors";

import nodemailer from "nodemailer";

dotenv.config();

const app: Express = express();

const transporter = nodemailer.createTransport({
    // 1. Explicitly set the host
    host: "smtp.gmail.com", 
    
    // 2. Explicitly set the port to 587 (StartTLS is generally safer and more common than 465)
    port: 587,              
    
    // 3. MUST be false for port 587 (StartTLS)
    secure: false,          
    
    // 4. Authentication (confirmed to be loaded)
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS, 
    },
    
    // 5. CRITICAL: Increase timeout to handle Render's potential network latency
    // Increase to 20-30 seconds (20000ms is a good start)
    connectionTimeout: 20000, 
    
});

app.use(cors());
app.use(express.json());


app.use("/api/reviews", reviewsRouter);
app.use("/api/contact", contactRouter);

const port = process.env.PORT || 3000;

// Define a simple route with explicit types from the Express types
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express and TypeScript!");
});

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
