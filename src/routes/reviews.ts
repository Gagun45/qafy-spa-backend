import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { GOOGLE_API_KEY, PLACE_ID } = process.env;
    if (!GOOGLE_API_KEY || !PLACE_ID) {
      return res.status(400).json({ message: "Config error" });
    }
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "displayName,rating,reviews,userRatingCount",
      },
    });
    if (!response.ok) {
      const text = await response.text();
      console.log("Google api error: ", text);
      throw new Error("Failed to fetch google reviews");
    }
    const data = await response.json();
    return res.json(data.reviews || []);
  } catch (err) {
    console.log("Error fetching reviews: ", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

export default router;
