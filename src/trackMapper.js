// Scale coordinates to match your image dimensions
const COORDS = {
  // Bank Platforms & Approach
  'AA':  { x: 100, y: 720 }, // Bank P7
  'BA':  { x: 100, y: 760 }, // Bank P8
  'AD':  { x: 230, y: 720 },
  'AF':  { x: 420, y: 720 },
  'AG':  { x: 550, y: 720 },
  'AJ':  { x: 770, y: 720 },
  'BE':  { x: 310, y: 760 },
  'BG':  { x: 550, y: 760 },
  'BH':  { x: 670, y: 760 },

  // Waterloo Side & Mid-Tunnel
  'AL':  { x: 120, y: 240 },
  'AM':  { x: 270, y: 240 },
  'AN':  { x: 440, y: 240 },
  'AP':  { x: 580, y: 240 },
  'AQ':  { x: 670, y: 225 }, // Waterloo P26
  'BN':  { x: 670, y: 295 }, // Waterloo P25
  'BK':  { x: 120, y: 280 },
  'BL1': { x: 440, y: 280 },
  'BM':  { x: 580, y: 280 },
  'AT':  { x: 890, y: 190 }  // Sidings
};

export function mapTrainToCoords(train) {
  const loc = train.currentLocation.toUpperCase();
  let key = 'AQ'; // Default fallback

  if (loc.includes('BANK')) {
    key = loc.includes('PLATFORM 7') ? 'AA' : 'BA';
  } else if (loc.includes('WATERLOO')) {
    key = loc.includes('PLATFORM 26') ? 'AQ' : 'BN';
  } else if (loc.includes('BETWEEN WATERLOO AND BANK')) {
    key = train.secondsToStation > 150 ? 'AN' : 'AF';
  } else if (loc.includes('BETWEEN BANK AND WATERLOO')) {
    key = train.secondsToStation > 150 ? 'BG' : 'BM';
  } else if (loc.includes('SIDING') || loc.includes('DEPOT')) {
    key = 'AT';
  }

  const base = COORDS[key] || { x: 500, y: 500 };
  return { ...train, x: base.x, y: base.y };
}