interface Flight {
    id: string;
    time: string;
    airline: string;
    aircraft: {
        code: string;
        name: string;
    };
    to: Location;
    dist: {
        km: number;
        type?: string;
    };
    emissions: {
        kg: number;
    };
}

interface IndexEntry {
    IATA: string;
    ICAO?: string;
    name: string;
    author?: string;
    url?: string;
    index: string;
}

interface Location {
    n: string;
    ICAO?: string;
    IATA: string;
    geo: [number, number];
    cc?: string;
    continent?: string;
}

interface Metadata {
    directory: string;
    lastupdate: string;
    dates: string[];
    emissions: number[];
    flights: number[];
}

interface RawFlightData { 
    from: Location;
    flights: Flight[];
}

export { Flight, IndexEntry, Location, Metadata, RawFlightData };