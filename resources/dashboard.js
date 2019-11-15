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
    template: '<div class="map-holder"><div v-if="items" id="flight-map"></div></div>',
    data: function() {
        return {
            mymap: null,
            destinationlayer: null,
            icon: null,
            startLat: 53.86589,
            startLon: -1.66057,
            svg: '<?xml version="1.0" encoding="UTF-8"?><svg version="1.1" id="airport-15" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15"><path id="path7712-0" d="M15,6.8182L15,8.5l-6.5-1&#xA;&#x9;l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182&#xA;&#x9;L15,6.8182z"/></svg>'
        }
    },
    props: ['items'],
    computed: {
        svgUrl: function() {
            return 'data:image/svg+xml;base64,' + btoa(this.svg);
        }
    },
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
        this.icon = L.icon({
            iconUrl: this.svgUrl,
            iconSize: [22,22],
            iconAnchor: [11,0]
        }) 
        var leeds = L.marker([this.startLat, this.startLon]).addTo(this.mymap);
        leeds.bindPopup("<b>Leeds Bradford Airport</b>").openPopup();
        this.destinationlayer = L.layerGroup().addTo(this.mymap)
    },
    methods: {
        addDests() {
            if(this.mymap) {
                if (this.destinationlayer) {
                    this.destinationlayer.clearLayers()
                }
                for(flight of this.items) {
                    var marker = L.marker([flight['Lat'], flight['Lon']], {icon: this.icon}).addTo(this.destinationlayer);
                    marker.bindPopup(flight['Destination'])
                    L.polyline([[this.startLat, this.startLon], [flight['Lat'], flight['Lon']]], {
                        color: 'red',
                        weight: 1,
                        dashArray: "10 20"
                    }).addTo(this.destinationlayer)
                }
            }
        }
    }
})

var dashboard = new Vue({
    el: "#app",
    components: {
        VTable, NumberBubble, AnimatedNumber, Map
    },
    data: {
        pages: [
            {
                text: 'home',
                link: 'index.html'
            },
            {
                text: 'about',
                link: 'pages/about.html'
            },
            {
                text: 'github',
                link: 'https://github.com'
            },
            {
                text: 'odi leeds',
                link: 'https://odileeds.org'
            }
        ],
        date: null,
        flights: []
    },
    computed: {
        totalEmissions: function () {
            var total = 0;
            for (flight of this.flights) {
                total += flight['Emissions (kgCO2)']
            }
            return total
        },
        numberFlights: function () { return this.flights.length; },
        distanceTravelled: function () {
            var dist = 0;
            for (flight of this.flights) {
                dist += flight['Distance (km)']
            }
            return dist;
        }
    },
    mounted() {
        axios.get('https://raw.githubusercontent.com/patricklake2/leeds-flight-emissions/master/flight-data/2019-11-08.json?token=AMSNISOWMV3UY2ACHE7WNC25222UA').then(response => {
            this.date = response.data['Date'];
            this.flights = response.data['Flights']
        })
    }
});

