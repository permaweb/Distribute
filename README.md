# Distribute RebAR to Bundlers

## About

This script is built to distribute the rewards generated from bundlr.network to the bundler ids. The script needs to be run with each nodes wallet.

- OXcT1sVRSA5eGwt2k6Yuz8-3e3g9WJi5uSE99CWqsBs
- ZE0N-8P9gXkhtK-07PQu9d8me5tGDxa_i4Mee5RzVYg

If the script breaks for any reason you can restart and it will resume where it left off.

## Env Vars

- `NODE_1_WALLET`
- `NODE_2_WALLET`

`export NODE_1_WALLET='<path>' && export NODE_2_WALLET='<path>'`

## Run

```sh
yarn
yarn start
``` 

## NOTE

Should take about 3-5 minutes.
