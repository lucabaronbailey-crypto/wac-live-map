import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchLiveTrains } from './trackernet.js';
import { mapTrainToCoords } from './trackMapper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

async function broadcastUpdates() {
  try {
    console.log(`[${new Date().toISOString()}] Fetching TrackerNet updates...`);
    const rawTrains = await fetchLiveTrains();
    console.log(`Found ${rawTrains.length} train(s).`);

    const mappedTrains = rawTrains.map(mapTrainToCoords);
    const payload = JSON.stringify(mappedTrains);

    wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(payload);
    });
  } catch (err) {
    console.error('Error during broadcast update:', err);
  }
}

// Run immediately on launch, then repeat every 10s
broadcastUpdates();
setInterval(broadcastUpdates, 10000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
