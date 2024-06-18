import jsSHA from 'jssha';

function sha256(payload: string, format: 'HEX' | 'TEXT' | 'B64' | 'BYTES' = 'HEX'): string {
  const sha = new jsSHA('SHA-256', format);
  sha.update(payload);
  return sha.getHash(format);
}

export function sha256Checksum(payload: string): string {
  return sha256(sha256(payload)).substr(0, 8);
}

export function toHex(arrayOfBytes: number[]): string {
  let hex = '';
  for (let i = 0; i < arrayOfBytes.length; i++) {
    hex += numberToHex(arrayOfBytes[i]);
  }
  return hex;
}

function numberToHex(num: number): string {
  const hex = num.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}
