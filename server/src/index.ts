import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { pool } from "./db";

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, service: "stefano-api" }));

app.get("/api/menu", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name, price, category, image_url, active FROM menu_items WHERE active = true ORDER BY id DESC"
  );
  res.json(rows);
});

app.post("/api/menu", async (req, res) => {
  const { name, price, category, image_url, active = true } = req.body ?? {};
  if (!name || price == null) return res.status(400).json({ error: "name and price required" });
  const { rows } = await pool.query(
    "INSERT INTO menu_items (name, price, category, image_url, active) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [name, price, category ?? null, image_url ?? null, !!active]
  );
  res.status(201).json(rows[0]);
});

app.listen(PORT, () => console.log(`API running on :${PORT}`));
