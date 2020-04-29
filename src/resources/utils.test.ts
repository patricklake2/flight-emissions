import { getFlightData, getIndex, getMetadata } from './utils';
import { IndexEntry, Metadata, RawFlightData } from './models';

import fetch from 'node-fetch';

describe('Retrieving index, metadata & flights should work correctly', () => {
    let index: IndexEntry[];
    let meta: Metadata;
    let flightData: RawFlightData;

    beforeAll(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).fetch = fetch;
        index = await getIndex('https://raw.githubusercontent.com/odileeds/flight-data/master/index.json');
    });

    test('Index should be be an array containing some known entries', () => {
        expect(index).toBeInstanceOf(Array);
        expect(index.length).toBeGreaterThan(0);
        expect(index).toEqual(expect.arrayContaining([
            expect.objectContaining({ IATA: 'BHX' }),
            expect.objectContaining({ IATA: 'LBA' }),
        ]));
    });

    test('Retrieving metadata for LBA should work', async () => {
        meta = await getMetadata(index, 'LBA');
        expect(meta).toBeInstanceOf(Object);
        expect(meta).toHaveProperty('directory', 'https://raw.githubusercontent.com/patricklake2/flight-data/master/LBA/');
        expect(meta).toHaveProperty('flights');
        expect(meta).toHaveProperty('emissions');
        expect(meta).toHaveProperty('dates');
        expect(meta).toHaveProperty('lastupdate');
    });

    test('Retrieving flight data should work', async () => {
        flightData = await getFlightData(meta, meta.lastupdate);
        expect(flightData).toHaveProperty('from');
        expect(flightData).toHaveProperty('flights');
    });

    test('Returned location data should match known values', () => {
        const location = flightData.from;
        expect(location).toHaveProperty('IATA', 'LBA');
        expect(location).toHaveProperty('geo', [-1.66057,53.8659]);
    });
});