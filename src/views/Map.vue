<template>
  <div id="map" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Flight, Location } from '../resources/models';
import { getBearing } from '../resources/calulations';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.prototype.options = ({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

@Component
export default class FlightMap extends Vue{
    @Prop({ required: true })
    flights!: Flight[];

    @Prop({ required: true })
    origin!: Location;

    map: L.Map = {} as L.Map;
    dataLayer: L.LayerGroup = new L.LayerGroup();

    get flightsByDest(): Flight[][] {
      const allIATAS: string[] = this.flights.map((f: Flight) => f.to.IATA);
      const uniqueIATAS: string[] = allIATAS.filter((current: string, index: number, arr: string[]) => arr.indexOf(current) === index);
      const groupedFlights: Flight[][] = [];
      uniqueIATAS.forEach((iata: string) => {
        groupedFlights.push(this.flights.filter((f: Flight) => f.to.IATA === iata));
      });
      return groupedFlights;
    }

    mounted(): void {
        this.map = new L.Map('map').setView([53.86589, -1.66057], 5);
        const tileLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        });
        tileLayer.addTo(this.map);
        this.dataLayer.addTo(this.map);
        L.Icon.Default.prototype.options = ({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
    }

    @Watch('flights', { immediate: true })
    onFlightDataChange(): void { this.populateMap(); }

    populateMap(): void {
      this.dataLayer.clearLayers();

      const originMarker: L.Marker = new L.Marker([this.origin.geo[1], this.origin.geo[0]]);
      originMarker.addTo(this.dataLayer);
      originMarker.bindPopup(`<b>${this.origin.n}</b>`).openPopup();
      this.flightsByDest.forEach((group: Flight[]) => {
        const destination: Location = group[0].to;
        const icon: L.Icon = new L.Icon({
          iconUrl: this.createRotatedIconSVG(destination),
          iconSize: [28,28],
          iconAnchor: [14,14],
        });
        const marker: L.Marker = new L.Marker([destination.geo[1], destination.geo[0]], {
          icon: icon,
        });
        marker.bindPopup(this.createDestPopupMsg(destination, group), { className: 'popup' });
        marker.addTo(this.dataLayer);
        const line: L.Polyline = new L.Polyline([
          [ this.origin.geo[1], this.origin.geo[0] ],
          [ destination.geo[1], destination.geo[0] ] ],
          { color: 'red', weight: 1, dashArray: '10 20'},
        );
        line.addTo(this.dataLayer);
      });
    }

    createDestPopupMsg(destination: Location, flightsToDest: Flight[]): string {
      const maxWidth = 150;
      const maxEmissions = flightsToDest.reduce((a: number, b: Flight) => Math.max(a, b.emissions.kg), 0);
      const barColor = (flight: Flight): string => {
        if (flight.emissions.kg < 10000) return 'green';
        else if (flight.emissions.kg < 20000) return 'orange';
        else return 'red';
      };
      let popupMsg = `<h3>${destination.n} - ${destination.IATA}</h3>`;
      flightsToDest.forEach((flight: Flight) => {
        const barWidth: number = flight.emissions.kg / maxEmissions * maxWidth;
        popupMsg += `<div class="bar" style="width: ${barWidth}px; background-color: ${barColor(flight)};">${Math.round(flight.emissions.kg).toLocaleString()}kg</div><p>${flight.time.substring(11, 16)} ${flight.airline}</p><br>`;
      });
      return popupMsg;
    }

    createRotatedIconSVG(destination: Location): string {
      // This basically just rotates an SVG graphic of an aeroplane to make the map look nice
      // there's probably a better way, but this works
      const bearing = getBearing([this.origin.geo[1], this.origin.geo[0], destination.geo[1], destination.geo[0]]);
      const svg = `<?xml version="1.0" encoding="UTF-8"?><svg version="1.1" id="airport-15" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15" transform="rotate(${bearing.toString()})"><path id="path7712-0" d="M15,6.8182L15,8.5l-6.5-1&#xA;&#x9;l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182&#xA;&#x9;L15,6.8182z"/></svg>`;
      return 'data:image/svg+xml;base64,' + btoa(svg);
    }
}
</script>

<style>
#map {
  width: 90vw;
  height: 90vh;
  margin: 20px auto;
}
.popup {
  width: 300px;
}
.popup h3 {
  font-size: 18px;
}
.popup p {
  display: inline;
}
.bar {
  height: 18px;
  background-color: red;
  display: inline-block;
  margin: 4px 10px -2px 0px;
  text-align: center;
  color: white;
}
.box {
  width: 300px;
}
</style>