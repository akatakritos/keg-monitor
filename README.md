# Keg Maintenance Screen

This little application is made from two projects:

* `keg-server`: An express.js server that manages the state of the current beers
  and monitors temperature
* `keg-client`: A React application that displays the current beers and allows
  an admin to manage them

## Getting started

1. Clone this repo
1. run `npm install` in `keg-server`
1. run `npm install` in `keg-client`

### Developing the server

Inside of the `keg-server` folder, run `npm run watch`. This will watch the
directory for changes, recompile the typescript, and restart the express serer
when anything changes.

The routes are listed in `app.ts`.

Persistance uses `nedb` for a lightweight json-based database. Methods that
interact with the database should go in the appropriate repository inside the
`persistance` folder.

On windows, a `FakeTemperatureMonitor` is configured to emit bogus temperatures
randomly. Otherwise, a `Ds18b20TemperatureMonitor` is configured to read
temperatures from the device file. If you are developing on a Mac this may be an
issue as it will identify your machine as linux and assume it can find the
device file. A bug is in the tracker.

### Developing the client

Inside of `keg-client` run `npm start` to start the Create React App based run
time. It will monitor for file changes and reload the page.

It assumes the keg-server is running. Follow the steps above to start the server.

Currently porting to React hooks.

# Deploying

## Production Builds

In `keg-client`:

```bash
$ npm run build
$ npm run copy
```

This will compile the front end application and copy the assets to the public folder
of the server

In `keg-server`:

```bash
$ npm run build-ts
```

This will compile the application into the `dist` folder.

Copy the dist folder contents and the public folder to the pi: `~/keg`


## Starting the Pi

1. ssh to pi
2. run `~/clear-chrome-cache.sh`
2. Open screen
3. In one tab: `npm run start-prod` in `~/keg`
3. In one tab: `startx`
4. Disconnect and leave screen running
