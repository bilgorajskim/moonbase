export function satoshiToBitcoin (value) {
  let BigNumber = require('bignumber.js')
  return (new BigNumber(value))
    .dividedBy(new BigNumber('100000000'))
    .toFixed(8)
}
