import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

/* ─────────────────────────  ŚRODKI BEZPIECZEŃSTWA  ───────────────────────── */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        connectSrc: ["'self'", "https:", "ws:", "wss:"],
      },
    },
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || "unknown",
  skip: (req) => req.path.includes("/static") || req.path === "/health",
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/loyalty/join", strictLimiter);
app.use("/api/contacts", strictLimiter);
app.use("/api", apiLimiter);

app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) =>
      res.getHeader("Content-Type")?.toString().includes("text/event-stream")
        ? false
        : compression.filter(req, res),
    chunkSize: 16 * 1024,
  }),
);

app.use(
  express.json({
    limit: "10mb",
    verify: (_req, _res, buf) => {
      if (buf.length > 10 * 1024 * 1024) throw new Error("Request too large");
    },
  }),
);
app.use(
  express.urlencoded({
    extended: false,
    limit: "10mb",
    parameterLimit: 20,
  }),
);

app.use((_req, res, next) => {
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Keep-Alive", "timeout=5, max=1000");
  next();
});

/* ─────────────────────────────  ENDPOINTY  ──────────────────────────────── */
app.get("/health", (_req, res) =>
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }),
);

app.get("/metrics", (_req, res) => {
  const m = process.memoryUsage();
  res.json({
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(m.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(m.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(m.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(m.external / 1024 / 1024)} MB`,
    },
    loadAverage: require("os").loadavg(),
    platform: process.platform,
    nodeVersion: process.version,
  });
});

/* ─────────────────────────  LOGOWANIE ŻĄDAŃ API  ────────────────────────── */
app.use((req, res, next) => {
  const start = Date.now();
  let captured: unknown;

  const origJson = res.json;
  res.json = function (body: unknown, ...args) {
    captured = body;
    return origJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const ms = Date.now() - start;
      let line = `${req.method} ${req.path} ${res.statusCode} ${ms}ms`;
      if (captured) line += ` :: ${JSON.stringify(captured)}`;
      if (line.length > 120) line = line.slice(0, 119) + "…";
      log(line);
    }
  });

  next();
});

/* ─────────────────────────────  BOOT SERVERA  ───────────────────────────── */
(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Error" });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, '0.0.0.0', () => console.log(`✅ Server running on port ${port}`));
})();
