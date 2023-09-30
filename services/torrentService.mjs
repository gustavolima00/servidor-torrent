import WebTorrent from "webtorrent";

export class TorrentService {
  constructor(downloadPath) {
    this.client = new WebTorrent();
    this.downloadPath = downloadPath;
  }

  addTorrent(magnetUri) {
    return this.client.add(magnetUri, {
      path: this.downloadPath,
    });
  }

  async removeTorrent(infoHash) {
    const torrent = await this.client.get(infoHash);

    console.log("torrent", torrent);

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
