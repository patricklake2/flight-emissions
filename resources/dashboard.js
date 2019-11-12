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

const Bubble = Vue.component('bubble', {
    props: ['description', 'content'],
    template: '<div class="bubble"><h2><animated-integer v-bind:value="content"></animated-integer></h2><p>{{ description }}</p></div>'
})



var dashboard = new Vue({
    el: "#app",
    components: {
        VTable, Bubble, AnimatedNumber
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
        flights: [],
        displayNum: 1,
        targetNum: 5000
    },
    computed: {
        totalEmissions: function() {
            var total = 0;
            for (flight of this.flights) {
                total += flight['Emissions (kgCO2)']
            }
            return total
        },
        numberFlights: function() { return this.flights.length; },
        distanceTravelled: function() {}
    },
    mounted() {
        axios.get('https://raw.githubusercontent.com/patricklake2/flight-emissions/master/flight-data/2019-11-08.json?token=AMSNISOUAKJ2UOXSF6Q3SUC52J5KI').then(response => {
            this.date = response.data['Date'];
            this.flights = response.data['Flights']
        })
    }
});

