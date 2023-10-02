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
    const videoPath = req.query.path;

    if (!req.query.path) {
      return res.status(400).send("Missing file path");
    }

    const realVideoPath = path.join(global.__basedir, req.query.path);
    const videoDir = path.dirname(realVideoPath);

    console.log({ realVideoPath, videoDir });

    if (!fs.existsSync(realVideoPath)) {
      return res.status(404).send("Video not found");
    }
    const fileExtension = path.extname(videoPath);
    const mimeType = getMimeType(fileExtension);
    const name = path.basename(videoPath).replace(fileExtension, "");

    const captions = [];
    fs.readdirSync(videoDir).forEach((file) => {
      const filePath = path.join(videoDir, file).replace(global.__basedir, "");
      const ext = path.extname(file);
      if (ext === ".vtt" && file.startsWith(name)) {
        const langCode = file.split("_")[1].split(".")[0];
        captions.push({
          src: filePath,
          lang: langCode,
          label: langCode.toUpperCase(),
          default: langCode === "pt",
        });
      }
    });

    console.log({
      videoPath,
      name,
      mimeType,
      captions,
    });

    res.render("videoPlayer", {
      videoPath,
      name,
      mimeType,
      captions,
    });
  });

  return router;
}
