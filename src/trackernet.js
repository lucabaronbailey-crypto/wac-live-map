import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const TFL_API_KEY = 'e8924bb596cb4425b134304c7106e5fe';
const TRACKERNET_STATIONS = ['BNK', 'WLO'];

export async function fetchLiveTrains() {
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    
    const requests = TRACKERNET_STATIONS.map(code =>
      fetch(`https://api.tfl.gov.uk/TrackerNet/PredictionDetailed/W/${code}?app_key=${TFL_API_KEY}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }).then(res => (res.ok ? res.text() : null))
    );

    const xmlResults = await Promise.all(requests);
    const rawTrains = [];
    const seenKeys = new Set();
    let fallbackCounter = 1;

    for (const xml of xmlResults) {
      if (!xml) continue;
      const parsed = parser.parse(xml);
      
      // Support uppercase <ROOT> tag returned by TrackerNet
      const rootNode = parsed.ROOT || parsed.root || {};
      const stations = rootNode.S || [];
      const stationArray = Array.isArray(stations) ? stations : [stations];

      for (const station of stationArray) {
        if (!station) continue;
        const stationName = station['@_N'] || '';
        const stationCode = station['@_Code'] || '';
        const platforms = station.P ? (Array.isArray(station.P) ? station.P : [station.P]) : [];

        for (const p of platforms) {
          if (!p || !p.T) continue;
          const trains = Array.isArray(p.T) ? p.T : [p.T];

          for (const t of trains) {
            const set = t['@_S'];
            const num = t['@_T'];
            const displayLabel = (set && set !== '0') ? set : ((num && num !== '0') ? num : `TRN${fallbackCounter++}`);
            
            const uniqueKey = `${stationCode}-${p['@_Code'] || '0'}-${displayLabel}`;
            if (seenKeys.has(uniqueKey)) continue;
            seenKeys.add(uniqueKey);

            rawTrains.push({
              id: `${uniqueKey}-${Math.random()}`,
              setNumber: displayLabel,
              trainNumber: num || '000',
              destination: t['@_D'] || 'No Destination Data',
              currentLocation: t['@_L'] || `At ${stationName}`,
              stationCode: stationCode,
              platformName: p['@_N'] || '',
              secondsToStation: parseInt(t['@_C'], 10) || 0
            });
          }
        }
      }
    }

    return rawTrains;
  } catch (err) {
    console.error('TrackerNet Fetch Error:', err);
    return [];
  }
}
