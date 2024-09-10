import { base58 } from './crypto/base58';
import { isValidAddressSegwit } from './crypto/segwit_addr';
import { toHex, sha256Checksum } from './crypto/utils';

const DEFAULT_NETWORK_TYPE = 'prod';

function getDecoded(address: string): number[] | null {
  try {
    return base58.decode(address);
  } catch (e) {
    // if decoding fails, assume invalid address
    return null;
  }
}

function getChecksum(hashFunction: string, payload: string): string {
  // Each currency may implement different hashing algorithm
  return sha256Checksum(payload);
}

interface Currency {
  expectedLength?: number;
  regex?: RegExp;
  addressTypes?: {
    [key: string]: string[];
  };
}

function getAddressType(address: string, currency: Currency): string | null {
  currency = currency || {};
  // should be 25 bytes per btc address spec and 26 decred
  const expectedLength = currency.expectedLength || 25;
  const hashFunction = 'sha256';
  const decoded = getDecoded(address);

  if (decoded) {
    const length = decoded.length;

    if (length !== expectedLength) {
      return null;
    }

    if (currency.regex) {
      if (!currency.regex.test(address)) {
        return null;
      }
    }

    const checksum = toHex(decoded.slice(length - 4, length)),
      body = toHex(decoded.slice(0, length - 4)),
      goodChecksum = getChecksum(hashFunction, body);

    return checksum === goodChecksum ? toHex(decoded.slice(0, expectedLength - 24)) : null;
  }

  return null;
}

interface Opts {
  networkType?: string;
}

function isValidP2PKHandP2SHAddress(address: string, currency: any, opts: Opts): boolean {
  const { networkType = DEFAULT_NETWORK_TYPE } = opts;

  let correctAddressTypes: string[] | undefined;
  const addressType = getAddressType(address, currency);

  if (addressType) {
    if (networkType === 'prod' || networkType === 'testnet') {
      correctAddressTypes = currency.addressTypes ? currency.addressTypes[networkType] : [];
    } else if (currency.addressTypes) {
      correctAddressTypes = [...currency.addressTypes.prod, ...currency.addressTypes.testnet];
    } else {
      return false;
    }
    if (correctAddressTypes) {
      return correctAddressTypes.indexOf(addressType) >= 0;
    }
  }

  return false;
}

export function isValidAddress(address: string, currency: any, opts: Opts = {}): boolean {
  return isValidP2PKHandP2SHAddress(address, currency, opts) || isValidAddressSegwit(address, currency, opts);
}
