import { Router } from "express";
import fs from "fs";
import path from "path";

function getMimeType(fileExtension) {
  const mimeTypes = {
    ".mp4": "video/mp4",
    ".mkv": "video/x-matroska",
    ".avi": "video/x-msvideo",
  };
  return mimeTypes[fileExtension];
}

export default function createTorrentsRouter(downloadPath) {
  const router = Router();

  router.get("/", (req, res) => {
    const dir = req.query.dir ? req.query.dir : "/";
    const fullPath = path.join(downloadPath, dir);

    fs.readdir(fullPath, { withFileTypes: true }, (err, files) => {
      if (err) return res.status(500).send("Erro ao ler o diretório");

      const items = files.map((file) => {
        const url = file.isDirectory()
          ? `/?dir=${path.join(dir, file.name)}`
          : null;
        return { name: file.name, isDirectory: file.isDirectory(), url };
      });

      res.render("listFiles", { items, currentDir: dir });
    });
  });

  router.get("/video-player", (req, res) => {
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).send("Missing file path");
    }
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath);
    const mimeType = getMimeType(fileExtension);
    const captionsPath = filePath.replace(fileExtension, ".vtt");

    res.render("videoPlayer", {
      filePath,
      fileName,
      fileExtension,
      mimeType,
      captionsPath,
    });
  });

  return router;
}
