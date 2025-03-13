import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors());

// Routes
app.use("/ai", aiRoutes);

export default app;
