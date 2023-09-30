import { Router } from "express";
import fs from "fs";
import path from "path";

export default function createTorrentsRouter(downloadPath) {
  const router = Router();

  router.get("/list", (req, res) => {
    const dir = req.query.dir ? req.query.dir : "/";
    const fullPath = path.join(downloadPath, dir);

    fs.readdir(fullPath, { withFileTypes: true }, (err, files) => {
      if (err) return res.status(500).send("Erro ao ler o diretório");

      const items = files.map((file) => {
        const url = file.isDirectory()
          ? `/list?dir=${path.join(dir, file.name)}`
          : null;
        return { name: file.name, isDirectory: file.isDirectory(), url };
      });

      res.render("listFiles", { items, currentDir: dir });
    });
  });

  router.get("/video-player", (req, res) => {
    const videoPath = req.query.path;
    res.render("videoPlayer", { videoPath });
  });

  router.get("/", (req, res) => {
    res.render("listFiles");
  });

  return router;
}
