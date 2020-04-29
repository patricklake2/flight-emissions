# Flight Emissions Tracker
![Node.js CI](https://github.com/patricklake2/flight-emissions/workflows/Node.js%20CI/badge.svg)

This is the source code for the [ODI Leeds flight emissions tracker](https://odileeds.org/projects/flight-emissions/daily), which is powered by our [flight data index](https://github.com/odileeds/flight-data). You'll find links to all of the data in that index; it's all openly available for anyone to contribute to or use.

Please get in touch if you have any questions or want to contribute. There's a [blog on our website](https://odileeds.org/blog/2019-12-18-flight-emissions-whos-keeping-track) explaining the project a bit more.

## Development
Please feel free to improve this and open a pull request! Instructions for setting it up are below.
### Project setup
```
git clone https://github.com/patricklake2/flight-emissions.git
cd flight-emissions
npm install
```

### Build and hot-reload for development
```
npm run serve
```
### Build in production mode
```
npm run build
```
### Run tests (Although I've only written one!)
```
npm test
```
### Lint and auto fix
```
npm run lint
```
### Customize configuration
This was built with Vue CLI, see the [Configuration Reference](https://cli.vuejs.org/config/).
