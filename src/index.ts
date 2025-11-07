import express, { Express, Request, Response } from "express";
import reviewsRouter from "./routes/reviews";
import contactRouter from "./routes/contact";
import dotenv from "dotenv";
import cors from "cors";

import nodemailer from "nodemailer";

dotenv.config();

// Initialize the Express application
const app: Express = express();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

app.use(cors());
app.use(express.json());

// app.use("/test-email", async (req: Request, res: Response) => {
//   try {
//     await transporter.sendMail({
//       from: `"Test Bot" <${process.env.GMAIL_EMAIL}>`,
//       to: process.env.TO_EMAIL,
//       subject: "✅ Test Email",
//       text: "This is a test email sent from Express backend!",
//     });
//     return res.json({ success: true });
//   } catch (err) {
//     console.log("Email error: ", err);
//     return res.status(500).json({ success: false });
//   }
// });

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
