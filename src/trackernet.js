import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const URL = 'https://api.tfl.gov.uk/TrackerNet/PredictionDetailed/W';

export async function fetchLiveTrains() {
  try {
    const res = await fetch(URL);
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const parsed = parser.parse(xml);
    
    const stations = parsed.root?.S || [];
    const stationArray = Array.isArray(stations) ? stations : [stations];
    const rawTrains = [];

    let fallbackCounter = 1;

    for (const station of stationArray) {
      const stationName = station['@_N'] || '';
      const stationCode = station['@_Code'] || '';
      const platforms = station.P ? (Array.isArray(station.P) ? station.P : [station.P]) : [];

      for (const p of platforms) {
        if (!p.T) continue;
        const trains = Array.isArray(p.T) ? p.T : [p.T];

        for (const t of trains) {
          const set = t['@_S'];
          const num = t['@_T'];
          const loc = t['@_L'] || '';
          const dest = t['@_D'] || '';

          // Generate an identifier even if Set/Train numbers are missing or zero
          const displayLabel = (set && set !== '0') ? set : ((num && num !== '0') ? num : `TRN${fallbackCounter++}`);

          rawTrains.push({
            id: `${stationCode}-${p['@_Code'] || '0'}-${displayLabel}-${Math.random()}`,
            setNumber: displayLabel,
            trainNumber: num || '0',
            destination: dest || 'No Destination Data',
            currentLocation: loc || `At ${stationName}`,
            stationCode: stationCode,
            platformName: p['@_N'] || '',
            locationCode: t['@_LC'] || '',
            secondsToStation: parseInt(t['@_C'], 10) || 0
          });
        }
      }
    }

    return rawTrains;
  } catch (err) {
    console.error('TrackerNet Fetch Error:', err);
    return [];
  }
}
