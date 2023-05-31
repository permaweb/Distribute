import fs from 'fs';
import { WarpFactory, LoggerFactory } from 'warp-contracts';
import cliProgress from 'cli-progress';
import { toPairs } from 'ramda';

LoggerFactory.INST.logLevel('error');
const REBAR = 'vPaIJgl6bLf8V2Wy7aGbsPoUL3RkQ0srr0ChEm8wxvs';

const warp = WarpFactory.forMainnet();
const ids = toPairs(JSON.parse(fs.readFileSync('./ids.json', 'utf-8'))).map(
  (p) => p[0]
);
const futureBalances = JSON.parse(fs.readFileSync('./future.json', 'utf-8'));

const jwk1 = JSON.parse(fs.readFileSync(process.env.NODE_1_WALLET).toString());
const jwk2 = JSON.parse(fs.readFileSync(process.env.NODE_2_WALLET).toString());

async function main() {
  const TOTAL = 5077996522; // divided by 199 25517570
  const node1 = 3401435542; // 133 - 3392601373 (remainder: 7556220)
  const node1Remander = 7598732;
  const node2 = 1676560980; // 65 - 1658038265 = 5050639638 (diff/remainder: 25508313)
  const node2hotFix = 17918838;

  const SHARE = Math.floor(TOTAL / ids.length);

  const bar1 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  const contract1 = await warp
    .contract(REBAR)
    .connect(jwk1)
    .setEvaluationOptions({
      allowBigInt: true,
      internalWrites: true,
      remoteStateSyncEnabled: true,
      //remoteStateSyncSource: 'https://dre-4.warp.cc/contract',
      unsafeClient: 'skip',
    });

  const contract2 = await warp
    .contract(REBAR)
    .connect(jwk2)
    .setEvaluationOptions({
      allowBigInt: true,
      internalWrites: true,
      remoteStateSyncEnabled: true,
      //remoteStateSyncSource: 'https://dre-4.warp.cc/contract',
      unsafeClient: 'skip',
    });

  const addrs = ids;
  const balances = await contract1.readState().then((payload) => {
    return payload.cachedValue.state.balances;
  });

  bar1.start(addrs.length, 0);
  for (var i = 0; i < addrs.length; i++) {
    if ((balances[addrs[i]] || 0) < futureBalances[addrs[i]]) {
      if (i < 133) {
        await transfer(contract1, addrs[i], SHARE);
      }
      if (i === 133) {
        await transfer(contract1, addrs[i], node1Remander);
        await transfer(contract2, addrs[i], node2hotFix);
      }
      if (i > 133) {
        await transfer(contract2, addrs[i], SHARE);
      }
    }
    bar1.update(i);
  }
  bar1.stop();
}

main();

async function transfer(contract, target, qty) {
  if (target === '') {
    return;
  }

  //await new Promise(r => setTimeout(r, 25))

  return contract.writeInteraction({
    function: 'transfer',
    target,
    qty,
  });
}
