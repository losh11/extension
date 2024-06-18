import { isValidAddress } from './bitcoin_valiidator';

export function validate(address, opts) {
  const currency = {
    name: 'LiteCoin',
    symbol: 'ltc',
    addressTypes: { prod: ['30', '05', '32'], testnet: ['6f', 'c4', '3a'] },
    bech32Hrp: { prod: ['ltc'], testnet: ['tltc'] }
  };

  if (currency) {
    return isValidAddress(address, currency, opts);
  }

  throw new Error('Missing validator for Litecoin');
}
