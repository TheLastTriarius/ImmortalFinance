import {
  $provider,
  $collateral,
  $debt,
  $protectionMode,
  $rebalancing,
  newPositionMounted,
  newPositionUnmounted,
  providerChanged,
  collateralChanged,
  debtChanged,
  protectionModeChanged,
  rebalancingChanged,
} from './index'

$provider
  .on(providerChanged, (_, value) => value)
  .reset(newPositionMounted, newPositionUnmounted)
$collateral
  .on(collateralChanged.map(Number), (_, value) => value)
  .reset(newPositionMounted, newPositionUnmounted)
$debt
  .on(debtChanged.map(Number), (_, value) => value)
  .reset(newPositionMounted, newPositionUnmounted)
$protectionMode
  .on(protectionModeChanged, (_, value) => value)
  .reset(newPositionMounted, newPositionUnmounted)
$rebalancing
  .on(rebalancingChanged.map(Number), (_, value: number) => value)
  .reset(newPositionMounted, newPositionUnmounted)
