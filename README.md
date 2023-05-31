# Distribute RebAR to Bundlers

## About

This script is built to distribute the rewards generated from bundlr.network to the bundler ids. The script needs to be run with each nodes wallet.

- OXcT1sVRSA5eGwt2k6Yuz8-3e3g9WJi5uSE99CWqsBs
- ZE0N-8P9gXkhtK-07PQu9d8me5tGDxa_i4Mee5RzVYg

If the script breaks for any reason you can restart and it will resume where it left off.

## Run

```sh
yarn
yarn start [keyfile]
``` 

## Example

```sh
yarn start ./OXcT1sVRSA5eGwt2k6Yuz8-3e3g9WJi5uSE99CWqsBs.json
```

```sh
yarn start ./ZE0N-8P9gXkhtK-07PQu9d8me5tGDxa_i4Mee5RzVYg.json
```

## NOTE

Each script will take a long time to complete, so you may want to run multiple instances, spliting the list.


