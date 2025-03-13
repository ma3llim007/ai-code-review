import { Router } from "express";
import { getReview } from "../controllers/ai.controller.js";

const router = Router();

router.route("/review-code").post(getReview);

export default router;
