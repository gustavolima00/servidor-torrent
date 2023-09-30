import express from "express";

export function createServer() {
  const app = express();
  app.set("view engine", "ejs");

  app.set("views", "./views");
  return app;
}
