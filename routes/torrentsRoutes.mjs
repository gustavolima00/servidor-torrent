import { Router } from "express";

export function createRouter(torrentManager) {
  const router = Router();

  router.get("/torrent/", (req, res) => {
    torrentManager
      .torrentsInfo()
      .then((torrents) => {
        res.render("listTorrents", {
          title: "Meu Site Torrent",
          torrents: torrents,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send(err.message);
      });
  });

  router.get("/torrent/download", (req, res) => {
    res.render("downloadTorrent");
  });

  router.get("/torrent/download-with-magnet", (req, res) => {
    const magnetUri = req.query.magnet;

    if (!magnetUri) {
      return res.status(400).send("Magnet URI é obrigatório");
    }

    try {
      torrentManager.addTorrent(magnetUri);
      res.send(`Torrent adicionado.`);
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  });

  router.delete("/torrent/:infoHash", async (req, res) => {
    const { infoHash } = req.params;

    try {
      await torrentManager.removeTorrent(infoHash);
      res.send(`Torrent ${infoHash} removido com sucesso.`);
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  });

  return router;
}
