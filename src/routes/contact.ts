import express, { type Request, type Response } from "express";
import multer from "multer";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, // 10MB max per file, 5 files total
});

router.post("/", upload.array("files"), async (req: Request, res: Response) => {
  try {
    const { name, message, contact } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    // Convert uploaded files into Resend-compatible attachments
    const attachments =
      files?.map((file) => ({
        filename: file.originalname,
        content: file.buffer.toString("base64"), // Base64 is required for Resend
      })) ?? [];

    await resend.emails.send({
      from: "Qafy Mobile <onboarding@resend.dev>", // Must be a verified domain/sender in Resend
      to: process.env.TO_EMAIL!,
      subject: "New contact message",
      text: `
Name: ${name}
Contact: ${contact}
Message: ${message}
`,
      attachments,
    });

    return res.json({ success: true, message: "Email sent successfully." });
  } catch (error: any) {
    console.error("Post contact request:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

export default router;
