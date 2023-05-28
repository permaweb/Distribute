import fs from 'fs'
import { WarpFactory, LoggerFactory } from 'warp-contracts'

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet()
const ids = fs.readFileSync('./ids.txt', 'utf-8').split('\n')

const TOTAL = 1657263496
const SHARE = Math.floor(TOTAL / ids.length)
const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

async function main() {
  const contract = await warp
    .contract('CGaAQAw1mtKiIAGIwh4bmmZOsgcEGCo6hzWgV6Ua42c')
    .connect(jwk)
    .setEvaluationOptions({
      allowBigInt: true,
      internalWrites: true,
      remoteStateSyncEnabled: true,
      unsafeClient: 'skip'
    })

  const addrs = ids
  const balances = await contract.readState()
    .then(payload => {
      return payload.cachedValue.state.balances
    })

  for (var i = 0; i < addrs.length; i++) {
    if ((balances[addrs[i]] || 0) < SHARE) {
      await transfer(contract, addrs[i], SHARE)
    }
  }
}

main()

async function transfer(contract, target, qty) {
  if (target === '') { return }

  await new Promise(r => setTimeout(r, 25))

  console.log('target: ', target)
  return contract.writeInteraction({
    function: 'transfer',
    target,
    qty
  }, {
    strict: true
  })
}