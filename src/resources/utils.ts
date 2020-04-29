import { IndexEntry,  Metadata, RawFlightData } from './models';

async function getFlightData(meta: Metadata, date: string): Promise<RawFlightData>  {
    date = date.substring(0,10);
    if(!meta.dates.includes(date)) throw new Error('No data for specified date');
    const url = `${meta.directory}${date}.json`;
    const response = await fetch(url);
    const data: RawFlightData = await response.json();
    return data;
}

async function getIndex(url: string): Promise<IndexEntry[]> {
    const response = await fetch(url);
    const data: IndexEntry[] = await response.json();
    return data;
}

async function getMetadata(index: IndexEntry[], iata: string): Promise<Metadata> {
    const entry = index.find(entry => {
        return entry.IATA.toUpperCase() == iata.toUpperCase();
    });
    if(typeof entry === 'undefined') throw new Error(`Could not find entry for ${iata}`);
    const response = await fetch(entry.index);
    const data: Metadata = await response.json();
    return data;
}

export { getFlightData, getIndex, getMetadata };