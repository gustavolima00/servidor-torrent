import WebTorrent from "webtorrent";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

class MagnetURIFileManager {
  constructor(magnetURIFile = "magnetURIs.json") {
    this.magnetURIFile = magnetURIFile;
  }

  extractInfoHash(magnetUri) {
    const match = magnetUri.match(/xt=urn:btih:([a-fA-F0-9]+)/);
    return match ? match[1].toLowerCase() : null;
  }

  magnetsAreEqual(magnetUri1, magnetUri2) {
    const infoHash1 = this.extractInfoHash(magnetUri1);
    const infoHash2 = this.extractInfoHash(magnetUri2);
    return infoHash1 === infoHash2;
  }

  getMagnetURIs() {
    let magnetURIs = [];
    if (existsSync(this.magnetURIFile)) {
      magnetURIs = JSON.parse(readFileSync(this.magnetURIFile, "utf-8"));
    }
    return magnetURIs;
  }

  setMagnetURIs(magnetURIs) {
    writeFileSync(this.magnetURIFile, JSON.stringify(magnetURIs, null, 2));
  }

  torrentExists(magnetURI, downloadPath) {
    const magnetURIs = this.getMagnetURIs();

    return magnetURIs.some(
      ({ magnetURI: currentMagnetUri, downloadPath: currentDownloadPath }) =>
        this.magnetsAreEqual(magnetURI, currentMagnetUri) &&
        currentDownloadPath === downloadPath
    );
  }

  addTorrentOnFile(magnetURI, downloadPath = "") {
    const magnetURIs = this.getMagnetURIs();

    const torrentAlredyExists = magnetURIs.some(
      ({ magnetURI: currentMagnetUri, downloadPath: currentDownloadPath }) =>
        this.magnetsAreEqual(magnetURI, currentMagnetUri) &&
        currentDownloadPath === downloadPath
    );

    if (torrentAlredyExists) {
      return;
    }

    magnetURIs.push({
      magnetURI: magnetURI,
      downloadPath: downloadPath,
    });

    this.setMagnetURIs(magnetURIs);
  }

  removeTorrentFromFile(magnetURI) {
    if (existsSync(this.magnetURIFile)) {
      const magnetURIs = JSON.parse(readFileSync(this.magnetURIFile, "utf-8"));
      const torrentIndex = magnetURIs.findIndex(
        ({ magnetURI: currentMagnetUri }) =>
          this.magnetsAreEqual(magnetURI, currentMagnetUri)
      );

      if (torrentIndex > -1) {
        magnetURIs.splice(torrentIndex, 1);
        writeFileSync(this.magnetURIFile, JSON.stringify(magnetURIs, null, 2));
      }
    }
  }
}

export class TorrentService {
  constructor(downloadsFolder, magnetURIFile = "magnetURIs.json") {
    this.client = new WebTorrent();
    this.downloadsFolder = downloadsFolder;
    this.uriFileManager = new MagnetURIFileManager(magnetURIFile);
    this.loadTorrents();
  }

  addTorrent(magnetURI, downloadPath = "") {
    const fullDownloadPath = path.join(this.downloadsFolder, downloadPath);

    if (this.uriFileManager.torrentExists(magnetURI, fullDownloadPath)) {
      throw new Error("Torrent já adicionado");
    }
    const torrent = this.client.add(magnetURI, { path: fullDownloadPath });
    console.log('Torrent name: ', torrent.name);
    console.log('Folder: ', fullDownloadPath)
    this.uriFileManager.addTorrentOnFile(magnetURI, fullDownloadPath);

    torrent.on("done", () => {
      console.log("Download concluído: " + torrent.name, torrent.infoHash);

      this.removeTorrent(torrent.infoHash);
    });
  }

  loadTorrents() {
    const magnetURIs = this.uriFileManager.getMagnetURIs();

    magnetURIs.forEach(({ magnetURI, downloadPath }) =>
      this.client.add(magnetURI, { path: downloadPath })
    );
  }

  async removeTorrent(infoHash) {
    const torrent = await this.client.get(infoHash);

    if (!torrent) {
      throw new Error("Torrent não encontrado");
    }

    this.uriFileManager.removeTorrentFromFile(torrent.magnetURI);

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
