import { createServer } from "./server.mjs";
import { TorrentService } from "./services/torrentService.mjs";
import { createRouter } from './routes/torrentsRoutes.mjs';

const app = createServer();
const torrentManager = new TorrentService();
const port = 3000;
const router = createRouter(torrentManager);

app.use(router);

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
