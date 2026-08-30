const canvas = document.getElementById('trackCanvas');
const ctx = canvas.getContext('2d');

const bgImage = new Image();
bgImage.src = '/assets/W&C.jpg';

let currentTrains = [];
let isConnected = false;

bgImage.onload = () => {
  // Use natural image dimensions for coordinate accuracy
  canvas.width = bgImage.naturalWidth || 1920;
  canvas.height = bgImage.naturalHeight || 1080;
  render();
};

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}`);

ws.onopen = () => {
  isConnected = true;
  render();
};

ws.onmessage = (event) => {
  currentTrains = JSON.parse(event.data);
  render();
};

function render() {
  // Clear and redraw background diagram
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bgImage.complete && bgImage.naturalWidth !== 0) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }

  // Draw status text
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = isConnected ? '#00FF00' : '#FF0000';
  ctx.fillText(isConnected ? '● LIVE TRACKERNET CONNECTED' : '○ DISCONNECTED', 20, 30);

  // Fallback indicator if no active trains are detected on the line
  if (currentTrains.length === 0) {
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '14px monospace';
    ctx.fillText('No active trains currently detected on W&C line.', 20, 55);
    return;
  }

  // Draw active trains
  currentTrains.forEach(train => {
    const isPassenger = train.destination !== 'Out of Service' && train.destination !== 'Depot';

    ctx.fillStyle = isPassenger ? '#E32017' : '#FFD700';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    ctx.fillRect(train.x - 18, train.y - 10, 36, 20);
    ctx.strokeRect(train.x - 18, train.y - 10, 36, 20);

    ctx.fillStyle = isPassenger ? '#FFFFFF' : '#000000';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(train.setNumber, train.x, train.y);
  });
}
