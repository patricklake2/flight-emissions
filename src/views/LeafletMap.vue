<template>
  <div class="main-holder">
    <div v-if="items" id="flight-map"></div>
  </div>
</template>

<script>
var L = require("leaflet");

// below code is to fix leaflet icon not showing

// eslint-disable-next-line
delete L.Icon.Default.prototype._getIconUrl  
// eslint-disable-next-line
L.Icon.Default.mergeOptions({  
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  name: "leaflet-map",
  data: function() {
    return {
      mymap: null,
      destinationlayer: null,
      markers: [],
      startLat: 53.86589,
      startLon: -1.66057,
      svgStart:
        '<?xml version="1.0" encoding="UTF-8"?><svg version="1.1" id="airport-15" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15" transform="rotate(',
      svgEnd:
        ')"><path id="path7712-0" d="M15,6.8182L15,8.5l-6.5-1&#xA;&#x9;l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182&#xA;&#x9;L15,6.8182z"/></svg>',
      temp: ""
    };
  },
  props: ["items"],
  watch: {
    items() {
      this.addDests();
    }
  },
  mounted() {
    this.mymap = L.map("flight-map").setView([this.startLat, this.startLon], 5);
    L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken:
          "pk.eyJ1IjoicGF0cmljay1sYWtlIiwiYSI6ImNrMnl4Z2c1eDAycmgzb3A2cHVhdTVjancifQ.K5-h5nZk-onKDRbJmIQmHg"
      }
    ).addTo(this.mymap);
    var leeds = L.marker([this.startLat, this.startLon]).addTo(this.mymap);
    leeds.bindPopup("<b>Leeds Bradford Airport</b>").openPopup();
    this.destinationlayer = L.layerGroup().addTo(this.mymap);
    this.addDests();
  },
  methods: {
    addDests() {
      if (this.mymap) {
        if (this.destinationlayer) {
          this.destinationlayer.clearLayers();
        }
        for (var flight of this.items) {
          var markerExists = false;
          var time = flight["Time"].substring(11, 16);
          var message = `<ul><li><em>Time:</em> ${time}</li><li><em>Airline:</em> ${flight["Airline"]}</li><li><em>Distance:</em> ${flight["Distance"]} km</li><li><em>Emissions:</em><span style="color:red; font-weight:bold; font-size:14px;"> ${flight["Emissions"]} kgCO2</span></li></ul>`;
          for (var item of this.markers) {
            if (item.iata == flight["IATA"]) {
              item.msg += "<hr>";
              item.msg += message;
              markerExists = true;
            }
          }
          if (!markerExists) {
            var bearing = this.getBearing(
              flight["Lat"],
              flight["Lon"],
              this.startLat,
              this.startLon
            );
            var iconSvg = this.getSvgUrl(bearing);
            var icon = L.icon({
              iconUrl: iconSvg,
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });
            var polyLine = L.polyline(
              [
                [this.startLat, this.startLon],
                [flight["Lat"], flight["Lon"]]
              ],
              {
                color: "red",
                weight: 1.5,
                dashArray: "10 30"
              }
            );
            message = `<h3>${flight["Airport_Name"]}</h3>` + message;
            this.markers.push({
              iata: flight["IATA"],
              marker: L.marker([flight["Lat"], flight["Lon"]], { icon: icon }),
              msg: message,
              line: polyLine
            });
          }
        }
        for (var mapItem of this.markers) {
          mapItem.marker.addTo(this.destinationlayer);
          mapItem.marker.bindPopup(mapItem.msg, { className: "popup" });
          mapItem.line.addTo(this.destinationlayer);
        }
      }
    },
    getBearing(lat1, lon1, lat2, lon2) {
      var degrees = function(rad) {
        var pi = Math.PI;
        return rad * (180 / pi);
      };
      var radians = function(deg) {
        var pi = Math.PI;
        return deg * (pi / 180);
      };
      (lat1 = radians(lat1)),
        (lon1 = radians(lon1)),
        (lat2 = radians(lat2)),
        (lon2 = radians(lon2));
      var y = Math.sin(lon2 - lon1) * Math.cos(lat2);
      var x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
      var brng = Math.atan2(y, x);
      var deg = degrees(brng);
      var normalised = (deg + 360) % 360;
      normalised = Math.round(normalised * 100) / 100;
      var reverse = (normalised + 180) % 360;
      return reverse;
    },
    getSvgUrl(rotationAngle) {
      var svg = this.svgStart + rotationAngle.toString() + this.svgEnd;
      return "data:image/svg+xml;base64," + btoa(svg);
    }
  }
};
</script>

<style>
.main-holder {
  width: 100%;
  height: 70vh;
}

#flight-map {
  height: 100%;
  width: 100%;
}

.popup h3 {
  font-size: 18px;
}
.popup em {
  font-weight: bold;
}
</style>
