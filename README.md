# Building

In `keg-client`:

```bash
$ npm run build
$ npm run copy
```

In `keg-server`:

```bash
$ npm run build-ts
```


# Running

In `keg-server`:

```bash
$ npm start # developmebt
$ npm run start-prod # production
```

# Starting the Pi

1. ssh to pi
2. Open screen
3. In one tab: `npm run start-prod` in `~/keg`
3. In one tab: `startx`
4. Disconnect and leave screen running
