import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createServer(downloadPath) {
  const app = express();
  app.use(express.static("public"));
  app.use("/downloads", express.static(path.join(__dirname, downloadPath)));
  app.set("view engine", "ejs");

  app.set("views", "./views");
  return app;
}
