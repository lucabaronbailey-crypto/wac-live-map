import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchLiveTrains } from './trackernet.js';
import { mapTrainToCoords } from './trackMapper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, '../public')));

async function broadcastUpdates() {
  const rawTrains = await fetchLiveTrains();
  const mappedTrains = rawTrains.map(mapTrainToCoords);
  const payload = JSON.stringify(mappedTrains);

  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(payload);
  });
}

setInterval(broadcastUpdates, 10000);

// Uses environment port provided by cloud host or defaults to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Traksy W&C running on port ${PORT}`);
});