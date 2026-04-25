import { Router } from "express";
import { analyzeController } from "../controllers/analyzeController";

export const analyzeRoutes = Router();

analyzeRoutes.post("/analyze", analyzeController);
