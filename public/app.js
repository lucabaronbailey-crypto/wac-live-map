const canvas = document.getElementById('trackCanvas');
const ctx = canvas.getContext('2d');

const bgImage = new Image();
bgImage.src = '/assets/W&C.jpg';

let currentTrains = [];

bgImage.onload = () => {
  canvas.width = bgImage.naturalWidth || 1200;
  canvas.height = bgImage.naturalHeight || 675;
  render();
};

// Automatically uses wss:// on secure web links
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}`);

ws.onmessage = (event) => {
  currentTrains = JSON.parse(event.data);
  render();
};

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0);

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