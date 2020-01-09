<template>
  <div class="holder">
    <div class="map-holder">
      <div v-if="items" id="flight-map"></div>
    </div>
    <p>
      <strong>Note: </strong>Currently the emissions shown are per flight, not
      per passenger, so comparisons may not be that useful. I'm working on
      adding passenger based estimates.
    </p>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
var L = require("leaflet");

// below code is to fix leaflet icon not showing

// eslint-disable-next-line
delete L.Icon.Default.prototype._getIconUrl;
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
      destinations: [],
      startLat: 53.86589,
      startLon: -1.66057,
      svgStart:
        '<?xml version="1.0" encoding="UTF-8"?><svg version="1.1" id="airport-15" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15" transform="rotate(',
      svgEnd:
        ')"><path id="path7712-0" d="M15,6.8182L15,8.5l-6.5-1&#xA;&#x9;l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182&#xA;&#x9;L15,6.8182z"/></svg>',
      temp: ""
    };
  },
  props: ["items", "limits"],
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
      var uniqueDests = [];
      for (let flight of this.items) {
        if (!uniqueDests.includes(flight["to"]["IATA"])) {
          uniqueDests.push(flight["to"]["IATA"]);
        }
      }
      var groupedByDest = [];
      for (let airport of uniqueDests) {
        groupedByDest.push(
          this.items.filter(fl => fl["to"]["IATA"] == airport)
        );
      }
      for (let group of groupedByDest) {
        var bearing = this.getBearing(
          group[0]["to"]["geo"][1],
          group[0]["to"]["geo"][0],
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
            [group[0]["to"]["geo"][1], group[0]["to"]["geo"][0]]
          ],
          {
            color: "red",
            weight: 1.5,
            dashArray: "10 30"
          }
        );
        var message = this.createPopupMsg(group);
        var marker = L.marker(
          [group[0]["to"]["geo"][1], group[0]["to"]["geo"][0]],
          { icon: icon }
        ).addTo(this.destinationlayer);
        marker.bindPopup(message, { className: "popup" });
        polyLine.addTo(this.destinationlayer);
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
    },
    createPopupMsg(flights) {
      let popup_msg = ``;
      popup_msg += `<div class="box"><h3>${flights[0]["to"]["n"]} - ${flights[0]["to"]["IATA"]}</h3>`;
      let max_width = 150;
      let max_emissions = flights[0]["emissions"]["kg"];
      for (let flight of flights) {
        if (flight["emissions"]["kg"] > max_emissions) {
          max_emissions = flight["emissions"]["kg"];
        }
      }
      for (let flight of flights) {
        let width = (flight["emissions"]["kg"] / max_emissions) * max_width;
        popup_msg += `<div class="bar" style="width: ${width}px; background-color: ${this.getColor(
          flight["emissions"]["kg"]
        )};">${Math.round(
          flight["emissions"]["kg"]
        ).toLocaleString()}kg</div><p>${flight["time"].substring(11, 16)} ${
          flight["airline"]
        }</p><br>`;
      }
      popup_msg += `</div>`;
      return popup_msg;
    },
    getColor(Emissions) {
      if (Emissions < this.limits[0]) return "green";
      else if (Emissions < this.limits[1]) return "orange";
      else return "red";
    }
  }
};
</script>

<style>
.map-holder {
  width: 100%;
  height: 90vh;
  z-index: 0;
}

#flight-map {
  height: 100%;
  width: 100%;
  z-index: 1;
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
