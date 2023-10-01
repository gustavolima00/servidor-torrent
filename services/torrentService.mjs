import WebTorrent from "webtorrent";
import { readFileSync, writeFileSync, existsSync } from "fs";

export class TorrentService {
  constructor(downloadPath, magnetUriFile = "magnetUris.json") {
    this.client = new WebTorrent();
    this.downloadPath = downloadPath;
    this.magnetUriFile = magnetUriFile;
    this.loadTorrents();
  }

  addTorrent(magnetUri) {
    this.client.add(magnetUri, { path: this.downloadPath });

    let magnetUris = [];
    if (existsSync(this.magnetUriFile)) {
      magnetUris = JSON.parse(readFileSync(this.magnetUriFile, "utf-8"));
    }

    magnetUris.push(magnetUri);
    writeFileSync(this.magnetUriFile, JSON.stringify(magnetUris, null, 2));
  }

  loadTorrents() {
    if (existsSync(this.magnetUriFile)) {
      const magnetUris = JSON.parse(readFileSync(this.magnetUriFile, "utf-8"));
      magnetUris.forEach((magnetUri) => this.addTorrent(magnetUri));
    }
  }

  removeTorrentFromFile(magnetURI) {
    if (existsSync(this.magnetUriFile)) {
      const magnetUris = JSON.parse(readFileSync(this.magnetUriFile, "utf-8"));
      const torrentIndex = magnetUris.findIndex((uri) => magnetURI === uri);

      if (torrentIndex > -1) {
        magnetUris.splice(torrentIndex, 1);
        writeFileSync(this.magnetUriFile, JSON.stringify(magnetUris, null, 2));
      }
    }
  }

  async removeTorrent(infoHash) {
    const torrent = await this.client.get(infoHash);

    this.removeTorrentFromFile(torrent.magnetURI);

    if (!torrent) {
      throw new Error("Torrent não encontrado");
    }

    torrent.destroy((err) => {
      if (err) {
        throw err;
      }
    });
  }

  async torrentsInfo() {
    const torrentsInfo = this.client.torrents.map((torrent) => {
      return {
        name: torrent.name,
        infoHash: torrent.infoHash,
        progress: torrent.progress,
        downloadSpeed: torrent.downloadSpeed,
        uploaded: torrent.uploaded,
      };
    });

    return torrentsInfo;
  }
}
