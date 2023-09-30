import { Router } from "express";
import fs from "fs";

export default function createTorrentsRouter(downloadPath) {
  const router = Router();

  router.get("/downloaded-files", (req, res) => {
    fs.readdir(downloadPath, (err, files) => {
      if (err)
        return res.status(500).send("Erro ao ler o diretório de downloads");
      res.json(files);
    });
  });
  return router;
}
