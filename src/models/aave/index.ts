import {
  createStore,
  createEvent,
  createEffect,
  attach,
  combine,
  forward,
} from 'effector'
import { add, multiply, divide } from 'mathjs'
import { createFetching } from '@lib/fetching'

import { $userAdress } from '@models/session'
import { changeHealRangeConfirmed } from '@models/modal'
import { $borrowField, $withdrawField, $repayField } from '@models/token-manage'
import {
  sendTransaction,
  lendingPoolContract,
  getBigIntString,
  aTokenContract,
  protectionContract,
  getUserAccountData,
  getHumanizedNumber,
  getProtectionContractInstance,
  web3,
} from '@lib/web3'
import {
  DAI_ADDRESS,
  AAVE_ADDRESS,
  RATE_MODE,
  LENDING_POOL_CORE,
  MAX_INT,
  PROTECTION_FACTORY_ADDRESS,
  ETH_ADDRESS,
  PROTECTION_CONTRACT,
  A_ETH_ADDRESS,
  ABI_ERC20_CONTRACT,
} from '@lib/constants'

export const getColor = (healthFactor) => {
  return healthFactor > 200
    ? '#f45735'
    : healthFactor > 180
    ? '#a59f37'
    : healthFactor > 160
    ? '#f4ed35'
    : '#42a135'
}

export const $manageListSectionLoading = createStore<boolean>(true)
export const $aaveCollateral = createStore<string>('')
export const $aaveHumanizedCollateral = $aaveCollateral.map((collateral) => {
  if (!collateral.length) return ''

  return getHumanizedNumber(collateral)
})
export const $aaveDebt = createStore<string>('')
export const $aaveHumanizedDebt = $aaveDebt.map((debt) => {
  if (!debt.length) return ''

  return getHumanizedNumber(debt)
})
export const $aaveRepayUnlocked = createStore<boolean>(false)
export const $aaveHealthFactor = createStore<string>(MAX_INT)
export const $userProtectionContractInstance = createStore(null)
export const $userProtectionContractIsExist = $userProtectionContractInstance.map(
  Boolean
)
export const $layersCounter = createStore<number>(0)
//  задолженность юзера через протекцию в виде строки как приходит извне
export const $userDebt = createStore<string>('')
export const $availableDebt = createStore<string>('')

export const $collaterizationLevel = combine(
  $aaveCollateral,
  $aaveDebt,
  (collateral, borrow) => {
    if (!collateral || !borrow || collateral === '0' || borrow === '0')
      return '-'

    return Number((Number(collateral) / Number(borrow)) * 100).toFixed(2)
  }
)

export const $healthFactor = combine(
  $aaveDebt,
  $availableDebt,
  (userDebt, availableDebt) => {
    const totalBorrow = Number(userDebt)
    const availableBorrow = Number(availableDebt)

    if (totalBorrow === 0 || availableBorrow === 0) return '0.00'

    const sum = add(totalBorrow, availableBorrow)

    return Number(multiply(divide(totalBorrow, sum), 100)).toFixed(2)
  }
)

export const manageListSectionMounted = createEvent<void>()
export const aaveUserDataUpdated = createEvent<{
  healthFactor: string
  totalBorrowsETH: string
  totalCollateralETH: string
}>()
export const aaveCollateralUpdated = createEvent<string>()
export const aaveBorrowUpdated = createEvent<string>()
export const aaveRepayLockStatusUpdated = createEvent<boolean>()
export const aaveRepaySuccess = createEvent<void>()
export const aaveRedeemSuccess = createEvent<void>()
export const redeemConfirmed = createEvent<void>()
export const unlockRepay = createEvent<void>()
export const startRepay = createEvent<void>()
export const getUserProtectionContract = createEvent<string>()
export const getProtectionLayer = createEvent<void>()
export const getProtectionLayerByNumber = createEvent<number>()
export const getUserDebtWithProtection = createEvent<void>()
export const makeHeal = createEvent<void>()
export const borrowConfirmed = createEvent<void>()
export const withdrawConfirmed = createEvent<void>()

const aaveUserDataFx = createEffect({
  handler: async (userAddress: string) => {
    if (!userAddress) throw new Error('User address is missing')

    return getUserAccountData(userAddress).then(
      ({
        healthFactor,
        totalBorrowsETH,
        totalCollateralETH,
        availableBorrowsETH,
      }) => ({
        healthFactor,
        totalBorrowsETH,
        totalCollateralETH,
        availableBorrowsETH,
      })
    )
  },
})

const depositFx = createEffect({
  handler: async ({
    amount,
    userAddress,
  }: {
    amount: number
    userAddress: string | null
  }): void => {
    const normalizedAmount: string = getBigIntString(amount)
    const options = {
      from: userAddress as string,
      to: AAVE_ADDRESS,
      value: normalizedAmount,
      data: lendingPoolContract.methods
        .deposit(ETH_ADDRESS, normalizedAmount, 0)
        .encodeABI(),
    }

    await sendTransaction(options, () =>
      aaveCollateralUpdated(normalizedAmount)
    )
  },
})

const borrowFx = createEffect({
  handler: async ({
    amount,
    userAddress,
  }: {
    amount: number
    userAddress: string | null
  }): Promise<any> => {
    const options = {
      from: userAddress || '',
      to: AAVE_ADDRESS,
      value: 0,
      data: lendingPoolContract.methods
        .borrow(DAI_ADDRESS, getBigIntString(amount), RATE_MODE, 0)
        .encodeABI(),
    }

    await sendTransaction(options, (_, res) => aaveBorrowUpdated(res || null))
  },
})

const unlockRepayFx = createEffect({
  handler: async ({ userAddress }: { userAddress: string | null }): void => {
    const daiToken = new web3.eth.Contract(
      JSON.parse(ABI_ERC20_CONTRACT),
      DAI_ADDRESS
    )

    const options = {
      from: userAddress || '',
      to: DAI_ADDRESS,
      value: 0,
      data: daiToken.methods.approve(LENDING_POOL_CORE, MAX_INT).encodeABI(),
    }
    await sendTransaction(options, (_, res) => res)
  },
})

const repayFx = createEffect({
  handler: async ({
    amount,
    userAddress,
  }: {
    amount: number
    userAddress: string | null
  }): Promise<any> => {
    const options = {
      from: userAddress || '',
      to: AAVE_ADDRESS,
      value: 0,
      data: lendingPoolContract.methods
        .repay(DAI_ADDRESS, getBigIntString(amount), userAddress)
        .encodeABI(),
    }

    await sendTransaction(options, () => aaveRepaySuccess())
  },
})

const redeemFx = createEffect({
  handler: async ({
    amount,
    userAddress,
  }: {
    amount: number
    userAddress: string | null
  }): Promise<any> => {
    const options = {
      from: userAddress || '',
      to: A_ETH_ADDRESS,
      value: 0,
      data: aTokenContract.methods.redeem(getBigIntString(amount)).encodeABI(),
    }

    await sendTransaction(options, () => aaveRedeemSuccess())
  },
})

export const updateAaveUserDataFx = attach({
  effect: aaveUserDataFx,
  source: $userAdress,
  mapParams: (_: undefined, userAddress: string): string => userAddress,
})

export const makeDepositFx = attach({
  effect: depositFx,
  source: $userAdress,
  mapParams: (amount: number, userAddress) => ({ amount, userAddress }),
})

export const makeBorrowFx = attach({
  effect: borrowFx,
  source: { userAddress: $userAdress, amount: $borrowField },
  mapParams: (_, src) => src,
})

export const makeUnlockRepayStatusFx = attach({
  effect: unlockRepayFx,
  source: $userAdress,
  mapParams: (_, userAddress) => ({ userAddress }),
})

export const makeRepayFx = attach({
  effect: repayFx,
  source: { userAddress: $userAdress, amount: $repayField },
  mapParams: (_, { amount, userAddress }) => ({ amount, userAddress }),
})

export const makeRedeemFx = attach({
  effect: redeemFx,
  source: { userAddress: $userAdress, amount: $withdrawField },
  mapParams: (_, { amount, userAddress }) => ({ amount, userAddress }),
})

export const getUserProtectionAddress = async (
  userAddress: string
): Promise<void> => {
  protectionContract.methods
    .getProtectionByUser(userAddress)
    .call({ from: userAddress }, (err, res) => getUserProtectionContract(res))
}

export const createProtectionContractInstanceFx = createEffect({
  handler: getProtectionContractInstance,
})

export const protectionLayerFx = createEffect({
  handler: async ({ protectionContract, layerNumber, userAddress }) => {
    const options = {
      from: userAddress,
      to: protectionContract.options.address,
      value: 0,
      data: protectionContract.methods
        .setLayer(layerNumber, DAI_ADDRESS)
        .encodeABI(),
    }

    await sendTransaction(options, (err, res) => res)
  },
})

export const createProtectionLayerFx = attach({
  source: {
    userAddress: $userAdress,
    layerNumber: $layersCounter,
    protectionContract: $userProtectionContractInstance,
  },
  effect: protectionLayerFx,
  mapParams: (_, { userAddress, layerNumber, protectionContract }) => ({
    userAddress,
    layerNumber: layerNumber + 1,
    protectionContract,
  }),
})

export const getProtectionLayerByNumberFx = createEffect({
  handler: async ({ protectionContract, layerNumber }) =>
    protectionContract.methods
      .protectionLayers(layerNumber)
      .call({}, console.log),
})

export const getUserDebtWithProtectionFx = createEffect({
  handler: async ({ protectionContract }) =>
    protectionContract.methods.debt(DAI_ADDRESS).call({}, (err, res) => res),
})

export const rebalanceFx = createEffect({
  handler: async ({ protectionContract, userDebt, userAddress }) => {
    const options = {
      from: userAddress,
      to: protectionContract.options.address,
      value: 0,
      data: protectionContract.methods
        .rebalance(DAI_ADDRESS, userDebt)
        .encodeABI(),
    }

    await sendTransaction(options, console.log)
  },
})

export const makeRebalanceFx = attach({
  source: {
    userAddress: $userAdress,
    userDebt: $userDebt,
    protectionContract: $userProtectionContractInstance,
  },
  effect: rebalanceFx,
  mapParams: (_, { userAddress, userDebt, protectionContract }) => ({
    userAddress,
    userDebt,
    protectionContract,
  }),
})

export const healFx = createEffect({
  handler: async ({ protectionContract, userAddress }) => {
    const options = {
      from: userAddress,
      to: protectionContract.options.address,
      value: 0,
      data: protectionContract.methods.heal([DAI_ADDRESS]).encodeABI(),
    }

    await sendTransaction(options, console.log)
  },
})

export const makeHealFx = attach({
  source: {
    userAddress: $userAdress,
    protectionContract: $userProtectionContractInstance,
  },
  effect: healFx,
  mapParams: (_, { userAddress, protectionContract }) => ({
    userAddress,
    protectionContract,
  }),
})

//effect loadings

export const depositLoading = createFetching(makeDepositFx)
export const borrowLoading = createFetching(makeBorrowFx)
export const unlockRepayLoading = createFetching(makeUnlockRepayStatusFx)
export const repayLoading = createFetching(makeRepayFx)
export const redeemLoading = createFetching(makeRedeemFx)
