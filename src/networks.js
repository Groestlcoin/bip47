"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainnetData = exports.testnetData = void 0;
const networks_1 = require("groestlcoinjs-lib/src/networks");
const testnetData = {
    'network': networks_1.testnet,
    'coin': '1'
};
exports.testnetData = testnetData;
const mainnetData = {
    'network': networks_1.bitcoin,
    'coin': '17'
};
exports.mainnetData = mainnetData;
