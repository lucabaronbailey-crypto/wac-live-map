import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const URL = 'http://cloud.tfl.gov.uk/TrackerNet/PredictionDetailed/W';

export async function fetchLiveTrains() {
  try {
    const res = await fetch(URL);
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const parsed = parser.parse(xml);
    
    const stations = parsed.root?.S || [];
    const stationArray = Array.isArray(stations) ? stations : [stations];
    const trainsMap = new Map();

    for (const station of stationArray) {
      const platforms = station.P ? (Array.isArray(station.P) ? station.P : [station.P]) : [];
      for (const p of platforms) {
        if (!p.T) continue;
        const trains = Array.isArray(p.T) ? p.T : [p.T];
        for (const t of trains) {
          const key = `${t['@_S']}-${t['@_T']}`;
          if (!trainsMap.has(key)) {
            trainsMap.set(key, {
              id: key,
              setNumber: t['@_S'],
              trainNumber: t['@_T'],
              destination: t['@_D'] || 'Unknown',
              currentLocation: t['@_L'] || '',
              locationCode: t['@_LC'],
              secondsToStation: parseInt(t['@_C'], 10) || 0
            });
          }
        }
      }
    }
    return Array.from(trainsMap.values());
  } catch (err) {
    console.error('TrackerNet Fetch Error:', err);
    return [];
  }
}