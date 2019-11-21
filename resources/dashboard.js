const VTable = Vue.component('vtable', {
    props: ['columns', 'items'],
    template: '<table class="fixed_headers"><thead><tr><th v-for="col in columns">{{ col }}</th></tr></thead><tbody><tr v-for="item in items"><td v-for="col in columns">{{ item[col] }}</td></tr></tbody></table>'
})

const AnimatedNumber = Vue.component('animated-integer', {
    template: '<span>{{ tweeningValue }}</span>',
    props: {
        value: {
            type: Number,
            required: true
        }
    },
    data: function () {
        return {
            tweeningValue: 0
        }
    },
    watch: {
        value: function (newValue, oldValue) {
            this.tween(oldValue, newValue)
        }
    },
    mounted: function () {
        this.tween(0, this.value)
    },
    methods: {
        tween: function (startValue, endValue) {
            var vm = this

            function animate() {
                if (TWEEN.update()) {
                    requestAnimationFrame(animate)
                }
            }
            new TWEEN.Tween({
                tweeningValue: startValue
            })
                .to({
                    tweeningValue: endValue
                }, 1000)
                .onUpdate(function () {
                    vm.tweeningValue = this.tweeningValue.toFixed(0)
                })
                .start()
            animate()
        }
    }
})

const NumberBubble = Vue.component('bubble', {
    props: ['caption', 'value'],
    template: '<div class="bubble"><h2><animated-integer v-bind:value="value"></animated-integer></h2><p v-if="caption">{{ caption }}</p></div>'
})

const Map = Vue.component('v-map', {
    template: '<div class="main-holder"><div v-if="items" id="flight-map"></div></div>',
    data: function () {
        return {
            mymap: null,
            destinationlayer: null,
            icon: null,
            startLat: 53.86589,
            startLon: -1.66057,
            svgStart: '<?xml version="1.0" encoding="UTF-8"?><svg version="1.1" id="airport-15" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15" transform="rotate(',
            svgEnd: ')"><path id="path7712-0" d="M15,6.8182L15,8.5l-6.5-1&#xA;&#x9;l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182&#xA;&#x9;L15,6.8182z"/></svg>'
        }
    },
    props: ['items'],
    watch: {
        items(newVal, prevVal) {
            this.addDests()
        }
    },
    mounted() {
        this.mymap = L.map('flight-map').setView([this.startLat, this.startLon], 5);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoicGF0cmljay1sYWtlIiwiYSI6ImNrMnl4Z2c1eDAycmgzb3A2cHVhdTVjancifQ.K5-h5nZk-onKDRbJmIQmHg'
        }).addTo(this.mymap);
        var leeds = L.marker([this.startLat, this.startLon]).addTo(this.mymap);
        leeds.bindPopup("<b>Leeds Bradford Airport</b>").openPopup();
        this.destinationlayer = L.layerGroup().addTo(this.mymap)
    },
    methods: {
        addDests() {
            if (this.mymap) {
                if (this.destinationlayer) {
                    this.destinationlayer.clearLayers()
                }
                for (flight of this.items) {
                    var bearing = this.getBearing(flight['Lat'], flight['Lon'], this.startLat, this.startLon)
                    var iconSvg = this.getSvgUrl(bearing)
                    var icon = L.icon({
                        iconUrl: iconSvg,
                        iconSize: [28, 28],
                        iconAnchor: [14, 14],
                    })
                    var marker = L.marker([flight['Lat'], flight['Lon']], { icon: icon }).addTo(this.destinationlayer);
                    var time = flight['Time'].substring(11, 16)
                    var message = `<ul><li><h3>${flight['Airport_Name']}</h3></li><li><em>Time:</em> ${time}</li><li><em>Airline:</em> ${flight['Airline']}</li><li><em>Distance:</em> ${flight['Distance']} km</li><li><em>Emissions:</em> ${flight['Emissions']} kgCO2</li></ul>`
                    marker.bindPopup(message, { 'className': 'popup' })
                    L.polyline([[this.startLat, this.startLon], [flight['Lat'], flight['Lon']]], {
                        color: 'red',
                        weight: 1.5,
                        dashArray: "10 30"
                    }).addTo(this.destinationlayer)
                }
            }
        },
        getBearing(lat1, lon1, lat2, lon2) {
            var degrees = function (rad) {
                var pi = Math.PI;
                return rad * (180 / pi);
            }
            var radians = function (deg) {
                var pi = Math.PI;
                return deg * (pi / 180);
            }
            lat1 = radians(lat1), lon1 = radians(lon1), lat2 = radians(lat2), lon2 = radians(lon2);
            var y = Math.sin(lon2 - lon1) * Math.cos(lat2);
            var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
            var brng = Math.atan2(y, x);
            var deg = degrees(brng)
            var normalised = (deg + 360) % 360;
            normalised = Math.round(normalised * 100) / 100;
            reverse = (normalised + 180) % 360;
            return reverse;
        },
        getSvgUrl(rotationAngle) {
            var svg = this.svgStart + rotationAngle.toString() + this.svgEnd;
            return 'data:image/svg+xml;base64,' + btoa(svg);
        }
    }
})

var dashboard = new Vue({
    el: "#app",
    components: {
        VTable, NumberBubble, AnimatedNumber, Map
    },
    data: {
        date: new Date(),
        dataUrl: null,
        flights: [],
        view: 'map',
        errorMessage: null
    },
    computed: {
        totalEmissions: function () { return sumFlightsProp('Emissions') },
        numberFlights: function () { return this.flights.length; },
        distanceTravelled: function () { return sumFlightsProp('Distance') }
    },
    methods: {
        sumFlightsProp: function (prop) {
            var total = 0
            for (flight of this.flights) {
                total += flight[prop]
            }
            return total;
        }
    },
    mounted() {
        var isoDate = this.date.toISOString().substring(0, 10) // current date in YYYY-MM-DD format
        this.dataUrl = 'https://raw.githubusercontent.com/patricklake2/leeds-flight-emissions/master/flight-data/' + isoDate + '.json'
        axios.get(this.dataUrl)
            .then(response => {
                this.date = response.data['Date'];
                this.flights = response.data['Flights']
            })
            .catch(error => {
                this.errorMessage = "Retrieval of flight data failed. Try refreshing the page."
            })
    }
});

