import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

// Security headers middleware using helmet
export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // allow flexibility for embedded video feeds
  crossOriginEmbedderPolicy: false,
});

// CORS middleware allowing origin
export const corsMiddleware = cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

// Rate limiter middleware for OBS API routes
export const obsRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // limit each IP to 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Terlalu banyak permintaan API ke OBS. Silakan coba beberapa saat lagi.",
  },
});

// Generic request validator middleware
export const validateRequestBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        error: "Request body harus berupa JSON object.",
      });
    }

    const missingFields = requiredFields.filter(
      (field) => req.body[field] === undefined || req.body[field] === null
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Field berikut wajib diisi: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
};
