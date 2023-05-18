import { NetworkCoin, TinySecp256k1Interface } from './interfaces';
import { BIP32API, BIP32Interface } from 'bip32grs';
import { mainnetData } from './networks';
import * as bip39 from 'bip39';
import * as bitcoin from 'groestlcoinjs-lib';

const bs58grscheck = require('bs58grscheck');

export default function getUtils(ecc: TinySecp256k1Interface, bip32: BIP32API) {
  const getPublicPaymentCodeNodeFromBase58 = (
    paymentCode: string,
    network: NetworkCoin,
  ): BIP32Interface => {
    const rawPaymentCode = bs58grscheck.decode(paymentCode);

    return bip32.fromPublicKey(
      rawPaymentCode.slice(3, 36),
      rawPaymentCode.slice(36, 68),
      network.network,
    );
  };

  const getRootPaymentCodeNodeFromSeedHex = (
    seedHex: string | Buffer,
    network: NetworkCoin = mainnetData,
  ) => {
    if (typeof seedHex === 'string') seedHex = Buffer.from(seedHex, 'hex');

    const node: BIP32Interface = bip32.fromSeed(seedHex, network.network);
    return node.derivePath(`m/47'/${network.coin}'/0'`);
  };

  const getRootPaymentCodeNodeFromBIP39Seed = (
    bip39Seed: string,
    network: NetworkCoin = mainnetData,
    password?: string,
  ) => {
    const seed: Buffer = bip39.mnemonicToSeedSync(bip39Seed, password);
    return getRootPaymentCodeNodeFromSeedHex(seed);
  };

  const uintArrayToBuffer = (array: Uint8Array): Buffer => {
    const b: Buffer = Buffer.alloc(array.length);
    for (let i = 0; i < array.length; i++) b[i] = array[i];
    return b;
  };

  const getSharedSecret = (B: Buffer, a: Buffer): Buffer => {
    const S: Buffer = uintArrayToBuffer(
      (ecc.pointMultiply(B, a, true) as Buffer).slice(1, 33),
    );

    let s: Buffer = bitcoin.crypto.sha256(S);
    if (!ecc.isPrivate(s))
      throw new Error('Shared secret is not a valid private key');

    return s;
  };

  const toInternalByteOrder = (data: Buffer): Buffer => {
    let start = 0;
    let length = data.length;

    while (length - start >= 1) {
      const tmp = data[start];
      const lastIndex = length - 1;
      data[start] = data[lastIndex];
      data[lastIndex] = tmp;
      length--;
      start++;
    }
    return data;
  };
  return {
    getPublicPaymentCodeNodeFromBase58,
    getRootPaymentCodeNodeFromSeedHex,
    getRootPaymentCodeNodeFromBIP39Seed,
    uintArrayToBuffer,
    getSharedSecret,
    toInternalByteOrder,
  };
}
