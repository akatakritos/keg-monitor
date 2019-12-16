pushd keg-client
npm run build
npm run copy
popd

pushd keg-server
npm run build-ts
popd
