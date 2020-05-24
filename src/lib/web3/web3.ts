import Web3 from 'web3'

import {
  ABI_CONTRACT,
  ABI_ERC20_CONTRACT,
  AAVE_ADDRESS,
  A_ETH_ADDRESS,
  A_ETH_CONTRACT,
  PROTECTION_FACTORY_CONTRACT,
  PROTECTION_FACTORY_ADDRESS,
} from '@lib/constants'

export const web3 = new Web3(window.ethereum)

export const lendingPoolContract = new web3.eth.Contract(
  JSON.parse(ABI_CONTRACT),
  AAVE_ADDRESS
)
export const tokenContract = new web3.eth.Contract(
  JSON.parse(ABI_ERC20_CONTRACT),
  AAVE_ADDRESS
)

export const aTokenContract = new web3.eth.Contract(
  JSON.parse(A_ETH_CONTRACT),
  A_ETH_ADDRESS
)

export const protectionContract = new web3.eth.Contract(
  JSON.parse(PROTECTION_FACTORY_CONTRACT),
  PROTECTION_FACTORY_ADDRESS
)

export const protectionFactoryContract = new web3.eth.Contract(
  JSON.parse(PROTECTION_FACTORY_CONTRACT),
  PROTECTION_FACTORY_ADDRESS
)
