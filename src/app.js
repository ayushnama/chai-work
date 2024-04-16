import express from "express";
import cors from "cors";
import cookiesparsers from "cookies-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extend: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookiesparsers);

export { app };
