import { createServer } from "./server.mjs";
import { TorrentService } from "./services/torrentService.mjs";
import { createRouter } from "./routes/torrentsRoutes.mjs";

const DOWNLOAD_PATH = "./downloads";
const PORT = 3000;
const app = createServer();
const torrentManager = new TorrentService(DOWNLOAD_PATH);
const router = createRouter(torrentManager);

app.use(router);

app.listen(PORT, () => {
  console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
