const COORDS = {
  // Bank Platforms & Crossovers
  'AA':  { x: 100, y: 720 }, // Bank Platform 7
  'BA':  { x: 100, y: 760 }, // Bank Platform 8
  'AD':  { x: 230, y: 720 },
  'AF':  { x: 420, y: 720 },
  'AG':  { x: 550, y: 720 },
  'AJ':  { x: 770, y: 720 },
  'BE':  { x: 310, y: 760 },
  'BG':  { x: 550, y: 760 },
  'BH':  { x: 670, y: 760 },

  // Waterloo Side & Sidings
  'AL':  { x: 120, y: 240 },
  'AM':  { x: 270, y: 240 },
  'AN':  { x: 440, y: 240 },
  'AP':  { x: 580, y: 240 },
  'AQ':  { x: 670, y: 225 }, // Waterloo Platform 26
  'BN':  { x: 670, y: 295 }, // Waterloo Platform 25
  'BK':  { x: 120, y: 280 },
  'BL1': { x: 440, y: 280 },
  'BM':  { x: 580, y: 280 },
  'AT':  { x: 890, y: 190 }  // Sidings / Depot Neck
};

export function mapTrainToCoords(train) {
  const loc = train.currentLocation.toUpperCase();
  const platform = train.platformName.toUpperCase();
  const station = train.stationCode.toUpperCase();
  let key = null;

  // 1. Match Bank Station / Platforms
  if (station === 'BNK' || loc.includes('BANK')) {
    if (loc.includes('7') || platform.includes('7')) key = 'AA';
    else key = 'BA'; // Defaults to Bank Platform 8
  } 
  // 2. Match Waterloo Station / Platforms
  else if (station === 'WLO' || loc.includes('WATERLOO')) {
    if (loc.includes('26') || platform.includes('26')) key = 'AQ';
    else key = 'BN'; // Defaults to Waterloo Platform 25
  } 
  // 3. Mid-Tunnel Running
  else if (loc.includes('BETWEEN WATERLOO AND BANK')) {
    key = train.secondsToStation > 150 ? 'AN' : 'AF';
  } 
  else if (loc.includes('BETWEEN BANK AND WATERLOO')) {
    key = train.secondsToStation > 150 ? 'BG' : 'BM';
  } 
  // 4. Sidings, Depot, or Non-Passenger Moves
  else if (loc.includes('SIDING') || loc.includes('DEPOT') || loc.includes('SHUTTLE')) {
    key = 'AT';
  }

  // Guaranteed fallback position so unmapped data still renders on the diagram
  const base = COORDS[key] || COORDS['BA'];
  return { ...train, x: base.x, y: base.y };
}
