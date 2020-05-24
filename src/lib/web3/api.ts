import {
  ABI_CONTRACT,
  ABI_ERC20_CONTRACT,
  AAVE_ADDRESS,
  ETH_ADDRESS,
  DAI_ADDRESS,
  A_ETH_ADDRESS,
  A_ETH_CONTRACT,
  LENDING_POOL_CORE,
  MAX_INT,
  PROTECTION_CONTRACT,
} from '@lib/constants'

import {
  web3,
  lendingPoolContract,
  tokenContract,
  aTokenContract,
} from './web3'

type TransactionError = object | string | null
type TransactionResult = any
type TransactionPayload = {
  from: string | number
  to: string
  value: string | number
  data?: string
}

export const createTokenContract = (tokenAdress: string) =>
  new web3.eth.Contract(JSON.parse(ABI_ERC20_CONTRACT), tokenAdress)

export const getProtectionContractInstance = (contractAddress: string) => {
  return new web3.eth.Contract(JSON.parse(PROTECTION_CONTRACT), contractAddress)
}

export const createAEthContract = () =>
  new web3.eth.Contract(JSON.parse(A_ETH_CONTRACT), A_ETH_ADDRESS)

export const connectWallet = async (): Promise<string> => {
  const [accountId]: Array<string> = await window.ethereum.enable()

  return accountId
}

type TransactionCallback = (
  err: TransactionError,
  hash?: TransactionResult
) => void

export const getUserAccountData = async (
  userAddress: string | null
): Promise<any> => {
  return lendingPoolContract.methods.getUserAccountData(userAddress).call()
}

export const getUseCollateral = async (
  userAddress: string | null,
  cb: TransactionCallback
): Promise<void> => {
  lendingPoolContract.methods
    .getUserReserveData(ETH_ADDRESS, userAddress)
    .call(
      { from: userAddress },
      (
        err: TransactionError,
        { currentATokenBalance }: TransactionResult
      ): void => cb(err, currentATokenBalance)
    )
}

export const getUserDebt = async (
  userAddress: string | null,
  cb: TransactionCallback
): Promise<void> => {
  lendingPoolContract.methods
    .getUserReserveData(DAI_ADDRESS, userAddress)
    .call(
      { from: userAddress },
      (
        err: TransactionError,
        { currentBorrowBalance }: TransactionResult
      ): void => cb(err, currentBorrowBalance)
    )
}

export const sendTransaction = async (
  options: TransactionPayload,
  cb: TransactionCallback
): Promise<any> => web3.eth.sendTransaction(options, cb)

export const getBigIntString = (value: number): string => {
  return String(Number(value) * 10 ** 18)
}

export const getHumanizedNumber = (num: string): string =>
  parseFloat(Number(Number(num) / 10 ** 18).toFixed(3)).toString()

export const updateUserBalances = async (
  userAddress: string
): Promise<{
  repayIsUnlocked: boolean
  collateral: string
  borrow: string
  originationFee: string
  daiAllowance: string
}> => {
  const daiContract = new web3.eth.Contract(
    JSON.parse(ABI_ERC20_CONTRACT),
    DAI_ADDRESS
  )

  const daiRepayAllowance = await daiContract.methods
    .allowance(userAddress, LENDING_POOL_CORE)
    .call()

  const {
    currentATokenBalance,
    originationFee,
  } = await lendingPoolContract.methods
    .getUserReserveData(ETH_ADDRESS, userAddress)
    .call()

  const {
    currentBorrowBalance,
  } = await lendingPoolContract.methods
    .getUserReserveData(DAI_ADDRESS, userAddress)
    .call()

  return {
    repayIsUnlocked: Number(daiRepayAllowance) === Number(MAX_INT),
    collateral: currentATokenBalance,
    borrow: currentBorrowBalance,
    originationFee,
    daiAllowance: daiRepayAllowance,
  }
}
