import { createStore, createEvent, createEffect, attach } from 'effector'

import {
  DEFAULT_HEAL_FROM,
  DEFAULT_HEAL_TO,
  PROTECTION_FACTORY_ADDRESS,
  EMPTY_PROTECTION_ADRESS,
  MAX_INT,
  A_ETH_ADDRESS,
  DAI_ADDRESS,
  ABI_ERC20_CONTRACT,
  LENDING_POOL_CORE,
} from '@lib/constants'
import { data as tokensList } from '@lib/mocks'
import {
  sendTransaction,
  protectionFactoryContract,
  getProtectionContractInstance,
  createTokenContract,
  createAEthContract,
  getHumanizedNumber,
  web3,
} from '@lib/web3'
import { $userAdress, $daiIsGreater } from '@models/session'
import { createFetching } from '@lib/fetching'
import { $userDebt } from '@models/aave'

type ProtectionContractPayload = {
  userAddress: string
  healFrom: string
  healTo: string
  protectionFactory: string
}

export const $healFrom = createStore<string>(DEFAULT_HEAL_FROM)
export const $healTo = createStore<string>(DEFAULT_HEAL_TO)
export const $userProtectionContractInstance = createStore(null)
export const $protectionUnlockIsLoading = createStore<boolean>(false)
export const $protectionLayersAmount = createStore<number>(0)
export const $protectionAddress = createStore<string>('')
export const $protectionSectionIsLock = $protectionAddress.map(
  (address) => !Boolean(address)
)
export const $isHealty = createStore<boolean>(true)
export const $layers = createStore([])
export const $healFromField = createStore<string>('')
export const $healToField = createStore<string>('')

export const $ethCollateralEnabled = createStore<boolean>(false)

export const enableProtectionButtonClicked = createEvent<void>()
export const updateProtectionLayers = createEvent<void>()
export const healFromChanged = createEvent<string>()
export const healToChanged = createEvent<string>()
export const changeHealRangeConfirmed = createEvent<void>()
export const resetHealFields = createEvent<void>()
export const ethCollateralStatusPressed = createEvent<void>()
export const startHealtyCheck = createEvent<void>()
export const startHealing = createEvent<void>()
export const getProtectionAdress = createEvent<void>()
export const startCheckAethAllowance = createEvent<void>()

const protectionContractInstanceFx = createEffect({
  handler: async ({
    userAddress,
    healFrom,
    healTo,
  }: ProtectionContractPayload): Promise<void> => {
    const options = {
      from: userAddress,
      to: PROTECTION_FACTORY_ADDRESS,
      value: 0,
      data: protectionFactoryContract.methods
        .newProtection(healFrom, healTo)
        .encodeABI(),
    }

    return await sendTransaction(options, (err, res) => res)
  },
})

export const createProtectionContractInstanceFx = attach({
  source: {
    userAddress: $userAdress,
    healFrom: $healFrom,
    healTo: $healTo,
  },
  effect: protectionContractInstanceFx,
  mapParams: (
    _,
    { userAddress, healFrom, healTo }
  ): ProtectionContractPayload => ({
    userAddress,
    healFrom,
    healTo,
  }),
})

const protectionAddressFx = createEffect({
  handler: ({ userAddress }) => {
    return protectionFactoryContract.methods
      .getProtectionByUser(userAddress)
      .call({ from: userAddress }, (err, res) => res)
  },
})

export const getProtectionaddressFx = attach({
  source: {
    userAddress: $userAdress,
  },
  effect: protectionAddressFx,
  mapParams: (_, source) => source,
})

export const checkProtectionAddressFx = attach({
  source: {
    userAddress: $userAdress,
  },
  effect: protectionAddressFx,
  mapParams: (_, source) => source,
})

export const protectionLayerFx = createEffect({
  handler: async ({ layerNumber, userAddress, protectionAddress, token }) => {
    const protectionContract = getProtectionContractInstance(protectionAddress)

    const options = {
      from: userAddress,
      to: protectionAddress,
      value: 0,
      data: protectionContract.methods
        .setLayer(layerNumber, token.address)
        .encodeABI(),
    }

    const result = await sendTransaction(options, (err, res) => res)

    await setTimeout(() => {}, 1000)

    return result
  },
})

export const createProtectionLayerFx = attach({
  source: {
    userAddress: $userAdress,
    layersAmount: $layers,
    protectionAddress: $protectionAddress,
  },
  effect: protectionLayerFx,
  mapParams: (token, { userAddress, layersAmount, protectionAddress }) => ({
    userAddress,
    layerNumber: layersAmount.length,
    protectionAddress,
    token,
  }),
})

export const protectionLayerByNumberFx = createEffect({
  handler: async ({ protectionContract, layerNumber }) =>
    protectionContract.methods.protectionLayers(layerNumber).call(),
})

export const getProtectionLayerByNumberFx = attach({
  source: $userProtectionContractInstance,
  effect: protectionLayerByNumberFx,
  mapParams: (layerNumber, protectionContract) => ({
    layerNumber,
    protectionContract,
  }),
})

const layersListFx = createEffect({
  handler: async ({ userAddress, protectionAddress }) => {
    const protectionContract = getProtectionContractInstance(protectionAddress)

    const tokensAddresses = await protectionContract.methods
      .getAllLayers()
      .call()
    const layers = tokensAddresses
      .map((address, idx) => {
        if (address === EMPTY_PROTECTION_ADRESS) return address

        return {
          address,
          level: idx + 1,
          name: null,
          amount: null,
          symbol: null,
        }
      })
      .filter((el) => el !== EMPTY_PROTECTION_ADRESS)

    layers.sort((a, b) => a.level - b.level)

    for await (let layer of layers) {
      const tokenContract = createTokenContract(layer.address)
      const allowance = await tokenContract.methods
        .allowance(userAddress, protectionAddress)
        .call()
      const balance = await tokenContract.methods.balanceOf(userAddress).call()
      const amount = allowance < balance ? allowance : balance
      const targetIndex = layers.findIndex(
        (el) =>
          String(el.address).toLowerCase() ===
          String(layer.address).toLowerCase()
      )

      const tokenFromBase =
        tokensList.find(
          (el) =>
            String(layer.address).toLowerCase() ===
            String(el.address).toLowerCase()
        ) || {}

      layers[targetIndex].amount = amount
        ? parseFloat(Number(web3.utils.fromWei(amount)).toFixed(4))
        : ''
      layers[targetIndex].name = tokenFromBase.name
      layers[targetIndex].symbol = amount ? tokenFromBase.symbol : ''
    }

    return layers
  },
})

export const getLayersListFx = attach({
  source: { userAddress: $userAdress, protectionAddress: $protectionAddress },
  effect: layersListFx,
  mapParams: (_, src) => src,
})

export const healRangeFx = createEffect({
  handler: async ({ from, to, protectionAddress, userAddress }) => {
    const protectionContract = getProtectionContractInstance(protectionAddress)

    const options = {
      from: userAddress,
      to: protectionAddress,
      value: 0,
      data: protectionContract.methods.setParams(from, to).encodeABI(),
    }

    return sendTransaction(options, (err, res) => res)
  },
})

export const changeHealRangeFx = attach({
  source: {
    from: $healFromField,
    to: $healToField,
    protectionAddress: $protectionAddress,
    userAddress: $userAdress,
  },
  effect: healRangeFx,
  mapParams: (_, src) => src,
})

export const ethCollateralFx = createEffect({
  handler: async ({ protectionAddress, userAddress }) => {
    const aEthContract = createAEthContract()

    const options = {
      from: userAddress,
      to: A_ETH_ADDRESS,
      value: 0,
      data: aEthContract.methods
        .approve(protectionAddress, MAX_INT)
        .encodeABI(),
    }

    return sendTransaction(options, (err, res) => res)
  },
})

export const ethCollateralCheckFx = createEffect({
  handler: async ({ protectionAddress, userAddress }) => {
    const aEthContract = createAEthContract()

    const allowance = await aEthContract.methods
      .allowance(userAddress, protectionAddress)
      .call()

    return allowance === MAX_INT
  },
})

export const checkEthCollateralAllowanceFx = attach({
  source: {
    protectionAddress: $protectionAddress,
    userAddress: $userAdress,
  },
  effect: ethCollateralCheckFx,
  mapParams: (_, src) => src,
})

export const enableEthCollateralFx = attach({
  source: {
    protectionAddress: $protectionAddress,
    userAddress: $userAdress,
  },
  effect: ethCollateralFx,
  mapParams: (_, src) => src,
})

export const healtyFx = createEffect({
  handler: (protectionAddress) => {
    const protectionContract = getProtectionContractInstance(protectionAddress)
    return protectionContract.methods.isHealthy().call()
  },
})

export const checkHealtyFx = attach({
  source: $protectionAddress,
  effect: healtyFx,
  mapParams: (_, src) => src,
})

export const healFx = createEffect({
  handler: async ({ protectionAddress, userAddress }) => {
    const protectionContract = getProtectionContractInstance(protectionAddress)
    const options = {
      from: userAddress,
      to: protectionAddress,
      value: 0,
      gas: 4000000,
      data: protectionContract.methods
        .heal(A_ETH_ADDRESS, DAI_ADDRESS, false, 6)
        .encodeABI(),
    }

    await sendTransaction(options, (err, res) => res)
  },
})

export const makeHealFx = attach({
  source: {
    userAddress: $userAdress,
    protectionAddress: $protectionAddress,
  },
  effect: healFx,
  mapParams: (_, { userAddress, protectionAddress }) => ({
    userAddress,
    protectionAddress,
  }),
})

export const createLayerFetching = createFetching(createProtectionLayerFx)
export const getLayersFetching = createFetching(getLayersListFx)
export const changeHealRangeFetching = createFetching(changeHealRangeFx)
export const enableEthFetching = createFetching(enableEthCollateralFx)
export const healingFetching = createFetching(makeHealFx)

// rebalance

export const $rebalanceValue = createStore<string>('')

export const rebalanceValueChanged = createEvent<string>()
export const rebalanceConfirmed = createEvent<void>()

export const rebalanceFx = createEffect({
  handler: async ({ protectionAddress, amount, userAddress, daiUnlocked }) => {
    const protectionContract = getProtectionContractInstance(protectionAddress)

    if (!daiUnlocked) {
      const daiContract = new web3.eth.Contract(
        JSON.parse(ABI_ERC20_CONTRACT),
        DAI_ADDRESS
      )

      const options = {
        from: userAddress,
        to: DAI_ADDRESS,
        value: 0,
        data: daiContract.methods.approve(LENDING_POOL_CORE, MAX_INT),
      }

      await sendTransaction(options, (err, res) => res)
    }

    const options = {
      from: userAddress,
      to: protectionAddress,
      value: 0,
      gas: 4000000,
      data: protectionContract.methods
        .rebalance(A_ETH_ADDRESS, DAI_ADDRESS, web3.utils.toWei(amount))
        .encodeABI(),
    }
    return sendTransaction(options, (err, res) => res)
  },
})

export const makeRebalanceFx = attach({
  source: {
    userAddress: $userAdress,
    amount: $rebalanceValue,
    protectionAddress: $protectionAddress,
    daiUnlocked: $daiIsGreater,
  },
  effect: rebalanceFx,
  mapParams: (_, src) => src,
})

export const aEthAvalabilityEffect = createEffect({
  handler: ({ userAdress, protectionAddress }) => {
    const aEthContract = createAEthContract()

    const aEthAllowance = aEthContract.methods
      .allowance(userAdress, protectionAddress)
      .call()

    return aEthAllowance === MAX_INT
  },
})

export const getAethAllowanceStatusFx = attach({
  source: {
    userAdress: $userAdress,
    protectionAddress: $protectionAddress,
  },
  effect: aEthAvalabilityEffect,
  mapParams: (_, src) => src,
})

export const rebalanceFetching = createFetching(makeRebalanceFx)
