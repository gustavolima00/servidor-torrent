import { createServer } from "./server.mjs";
import { TorrentService } from "./services/torrentService.mjs";
import createTorrentsRouter from "./routes/torrentsRoutes.mjs";
import createFilesRouter from "./routes/filesRoutes.mjs";
import { dirname } from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__basedir = __dirname;

const DOWNLOAD_PATH = "./downloads";
const PORT = 3000;
const app = createServer(DOWNLOAD_PATH);
const torrentManager = new TorrentService(DOWNLOAD_PATH);
const torrentsRouter = createTorrentsRouter(torrentManager);
const filesRouter = createFilesRouter(DOWNLOAD_PATH);

app.use(torrentsRouter);
app.use(filesRouter);

app.listen(PORT, () => {
  console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
