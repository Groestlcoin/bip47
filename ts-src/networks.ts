import { testnet, bitcoin } from 'groestlcoinjs-lib/src/networks'
import { NetworkCoin } from './interfaces'

const testnetData: NetworkCoin = {
    'network': testnet,
    'coin': '1'
}
const mainnetData: NetworkCoin = {
    'network': bitcoin,
    'coin': '17'
}

export { testnetData, mainnetData }
