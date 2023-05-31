import fs from 'fs'
import { WarpFactory, LoggerFactory } from 'warp-contracts'
import Arweave from 'arweave'
import cliProgress from 'cli-progress'

const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })
LoggerFactory.INST.logLevel('error')
const REBAR = 'LL2_TB0RUgZnKP6QZ2M1kiUz0joKEHuGHXiXQYVhRsM'

const warp = WarpFactory.forMainnet()
const ids = fs.readFileSync('./ids.txt', 'utf-8').split('\n')
const futureBalances = JSON.parse(fs.readFileSync('./state.json', 'utf-8')).balances
const walletFile = process.argv[2]
if (!walletFile) { throw new Error('keyfile is required!') }
const jwk = JSON.parse(fs.readFileSync(walletFile, 'utf-8'))

async function main() {
  const address = await arweave.wallets.getAddress(jwk)
  const TOTAL = await fetch('https://dre-4.warp.cc/contract?id=' + REBAR)
    .then(res => res.json())
    .then(result => result.state?.balances[address] || 0)

  const SHARE = Math.floor(TOTAL / ids.length)

  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  const contract = await warp
    .contract(REBAR)
    .connect(jwk)
    .setEvaluationOptions({
      allowBigInt: true,
      internalWrites: true,
      remoteStateSyncEnabled: true,
      //remoteStateSyncSource: 'https://dre-4.warp.cc/contract',
      unsafeClient: 'skip'
    })

  const addrs = ids
  const balances = await contract.readState()
    .then(payload => {
      return payload.cachedValue.state.balances
    })

  bar1.start(addrs.length, 0);
  for (var i = 0; i < addrs.length; i++) {
    if ((balances[addrs[i]] || 0) < futureBalances[addrs[i]]) {
      await transfer(contract, addrs[i], SHARE)
    }
    bar1.update(i)
  }
  bar1.stop()
}

main()

async function transfer(contract, target, qty) {
  if (target === '') { return }

  //await new Promise(r => setTimeout(r, 25))

  return contract.writeInteraction({
    function: 'transfer',
    target,
    qty
  })
}