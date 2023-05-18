import { BIP32Interface } from 'bip32grs';
import { expect } from 'chai';
import ECPairFactory from 'ecpairgrs';
import BIP47Factory from '../ts-src';
const ecc = require('tiny-secp256k1');

const ECPair = ECPairFactory(ecc);

const alice = {
  seedPhrase:
    'response seminar brave tip suit recall often sound stick owner lottery motion',
  seedHex:
    '64dca76abc9c6f0cf3d212d248c380c4622c8f93b2c425ec6a5567fd5db57e10d3e6f94a2f6af4ac2edb8998072aad92098db73558c323777abf5bd1082d970a',
  paymentCode:
    'PM8TJWomLDXEx1n3vqw3ucNwCqemi2pfsiKQsXpaRh3YvLMnnyt6ifGDcLGQQkMfHna1ByvtRzhbSFpunx9BpGJ441xSGCc784ypNySAHMKURHxdVzhj',
  notificationAddress: 'FiF33hy7E5C2ee5dxicrq6oWJmNth8EigV',
  privateKeyWIF: 'Kx983SRhAZpAhj7Aac1wUXMJ6XZeyJKqCxJJ49dxEbYCT4bUU8fo', // private key of outpoint used to send notification transaction to bob
  outpoint:
    '86f411ab1c8e70ae8a0795ab7a6757aea6e4d5ae1826fc7b8f00c597d500609c01000000', // used to send the notification transaction
  blindedPaymentCode:
    '01000345c2ff71063b185e594356f4df19d81b1d88372a57865dd9fc6d0220dc0db2c91dae1884ab1c8e6ed33bc853442655a0ac661c166af65978d150a96bdb1fcea900000000000000000000000000', // blinded payment code - bob should be able to decode this
};

const bob = {
  seedPhrase:
    'reward upper indicate eight swift arch injury crystal super wrestle already dentist',
  seedHex:
    '87eaaac5a539ab028df44d9110defbef3797ddb805ca309f61a69ff96dbaa7ab5b24038cf029edec5235d933110f0aea8aeecf939ed14fc20730bba71e4b1110',
  paymentCode:
    'PM8TJJsC1EW1Fa1KquT9UDrnFfXxUjA4ZhRsoVFg72XXPUcjc5sC1Gp9D32NgpKMGa6RjQKPthBZAuCvXncSLf4v91dEwuc7n5aKB9VUyZh684NUaXVv',
  notificationAddress: 'FbDERRx7sE5pzFcENr3p43anc2DsDK4mpW',
};

const aliceToBobRawNotificationHex =
  '010000000186f411ab1c8e70ae8a0795ab7a6757aea6e4d5ae1826fc7b8f00c597d500609c010000006b483045022100ac8c6dbc482c79e86c18928a8b364923c774bfdbd852059f6b3778f2319b59a7022029d7cc5724e2f41ab1fcfc0ba5a0d4f57ca76f72f19530ba97c860c70a6bf0a801210272d83d8a1fa323feab1c085157a0791b46eba34afb8bfbfaeb3a3fcc3f2c9ad8ffffffff0210270000000000001976a9148066a8e7ee82e5c5b9b7dc1765038340dc5420a988ac1027000000000000536a4c5001000345c2ff71063b185e594356f4df19d81b1d88372a57865dd9fc6d0220dc0db2c91dae1884ab1c8e6ed33bc853442655a0ac661c166af65978d150a96bdb1fcea90000000000000000000000000000000000';

const aliceToBobAddresses = [
  'Fb2nACRwLLUQ7BzoGd5YAnZsfLZAmE4uBV',
  'Fo12pwjtaNYhkKJsav5xtomi8NZZeNYyn4',
  'FiAssVcftorvpRE4R3jPrXd739eHsQvSxP',
  'FXgD9jue8tLLS53dMtrKQCbvWK7bQgb25K',
  'FYjPj6KxsteHKhXqfeKhMgJn969Brcu1wQ',
  'FmuRU4KZLDWM5wwKHNMpPP12CTWdLkEArA',
  'FsNFq9orjrLSzsCZ8CygMKAhKa5dh41ftS',
  'Fky9CS6ty7BoYLiGLJn2nvbCAVm8gjUPA8',
  'FoVBdd3AMo6RQuNUqhQ1hhp2AgmStvjdnE',
  'FdjYC1EYNruy8vbwRaiFoRxNEVrtpmwefx',
];

const privateKeysAliceToBobWallets = [
  'ef164fdb2cfda77416c120d44f3980037026719ae52d67a92510d3ddc1f62796',
  '07e150ef2aa9bb0b9e56c7780146a3ef2d4c029ec5b7c21a946833c7a80257ab',
  '6d66779ff3904f1dd7c62e77d063ee20ff07ee43d6cef1b07d6d9a88d275393c',
  '1c9ecd51158d2a1210c56b2f676f3e1393d6a9cd15bbf8268e62ea8254b4e68b',
  'd2f280d99375dc1972101e3ae5ea7d200f6ed3f517f36c7313c20180e0e0eda4',
  '10bd472f960069f9cebffab6a968fb43ea37664393d4bf423e96074c7e452f00',
  '4b0cb027f5d85406075ee5d6a2521e1e78cea33e98fc23024e8de6028963892a',
  '5d4adf5138bd6daef4ffda7ba29f9e3989dd6e7f3953a10b21b2cf640b899619',
  'e0bd39407bdcc5a15ee7d031d92d5d06628ca8c635328f4cdce4cae9388e51ff',
  '02eb4251df7c6baadeb18998897bc920342241ae16f0c7bad3a01c1b5234ad66',
];

describe('Payment codes and notification addresses', () => {
  it('Should create payment code from seed phrase', () => {
    const bip47 = BIP47Factory(ecc).fromBip39Seed(alice.seedPhrase);
    expect(bip47.getSerializedPaymentCode()).to.equal(alice.paymentCode);
  });
  it('Should create payment code from seed hex', () => {
    const bip47 = BIP47Factory(ecc).fromSeedHex(alice.seedHex);
    expect(bip47.getSerializedPaymentCode()).to.equal(alice.paymentCode);
  });
  it('should create Bip47 util object from base58 payment code', () => {
    const bip47 = BIP47Factory(ecc).fromPaymentCode(bob.paymentCode);
    expect(bip47.getSerializedPaymentCode()).to.equal(bob.paymentCode);
  });
  it('should get notification address from seed phrase or seed)', () => {
    const bip47 = BIP47Factory(ecc).fromBip39Seed(alice.seedPhrase);
    expect(bip47.getNotificationAddress()).to.equal(alice.notificationAddress);
  });
  it('should get notification address from payment code', () => {
    const bip47 = BIP47Factory(ecc).fromPaymentCode(bob.paymentCode);
    expect(bip47.getNotificationAddress()).to.equal(bob.notificationAddress);
  });
});

describe('Payment Addresses and Private keys', () => {
  it("should generate alice to bob payment addresses from Alice's node", () => {
    const aliceBip47 = BIP47Factory(ecc).fromBip39Seed(alice.seedPhrase);
    const bobBip47 = BIP47Factory(ecc).fromPaymentCode(bob.paymentCode);
    const bobPaymentCodeNode: BIP32Interface = bobBip47.getPaymentCodeNode();

    for (let i = 0; i < aliceToBobAddresses.length; i++)
      expect(aliceBip47.getPaymentAddress(bobPaymentCodeNode, i)).to.equal(
        aliceToBobAddresses[i],
      );
  });
  it("Should generate alice to bob payment addresses and private keys from Bob's node", () => {
    const bobBip47 = BIP47Factory(ecc).fromBip39Seed(bob.seedPhrase);
    const aliceBip47 = BIP47Factory(ecc).fromPaymentCode(alice.paymentCode);
    const alicePaymentNode: BIP32Interface = aliceBip47.getPaymentCodeNode();

    for (let i = 0; i < privateKeysAliceToBobWallets.length; i++) {
      const wallet: BIP32Interface = bobBip47.getPaymentWallet(
        alicePaymentNode,
        i,
      );
      expect(bobBip47.getAddressFromNode(wallet, bobBip47.network)).to.equal(
        aliceToBobAddresses[i],
      );
      // check private key
      expect(wallet.privateKey?.toString('hex')).to.equal(
        privateKeysAliceToBobWallets[i],
      );
    }
  });
});

describe('Notification Transaction and blinded payment code exchange', () => {
  it("should generate Alice's blinded payment code for Bob", () => {
    const aliceBip47 = BIP47Factory(ecc).fromBip39Seed(alice.seedPhrase);
    const bobBip47 = BIP47Factory(ecc).fromPaymentCode(bob.paymentCode);
    const keyPair = ECPair.fromWIF(alice.privateKeyWIF);

    const blindedPaymentCode = aliceBip47.getBlindedPaymentCode(
      bobBip47,
      keyPair.privateKey as Buffer,
      alice.outpoint,
    );
    expect(blindedPaymentCode).to.equal(alice.blindedPaymentCode);
  });

  it("Bob should be able to retrieve Alice's payment code, from Alice's notification transaction", () => {
    const bobBip47 = BIP47Factory(ecc).fromBip39Seed(bob.seedPhrase);
    const p = bobBip47.getPaymentCodeFromRawNotificationTransaction(
      aliceToBobRawNotificationHex,
    );

    expect(p).to.equal(alice.paymentCode);
  });
});
