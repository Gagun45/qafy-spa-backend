import express, { type Request, type Response } from "express";
import multer from "multer";
import { transporter } from "..";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
});

router.post("/", upload.array("files"), async (req: Request, res: Response) => {
  try {
    const { name, message, contact } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;
    const attachments =
      files?.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
      })) ?? [];

    await transporter.sendMail({
      from: "Qafy Mobile",
      to: process.env.TO_EMAIL,
      subject: "New contact message",
      text: `
Name: ${name}
Contact: ${contact}
Message: ${message}
`,
      attachments,
    });
    return res.json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.log("Post contact request: ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
