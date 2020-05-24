import { Effect, Store, createStore } from 'effector'

type Status = 'initial' | 'loading' | 'done' | 'fail'

export type Fetching = {
  isLoading: Store<boolean>
  isDone: Store<boolean>
  isFailed: Store<boolean>
}

export const createFetching = <Params, Done, Fail>(
  effect: Effect<Params, Done, Fail>,
  initialStatus: Status = 'initial'
): Fetching => {
  const status: Store<Status> = createStore(initialStatus)
    .on(effect, () => 'loading')
    .on(effect.done, () => 'done')
    .on(effect.fail, () => 'fail')

  const isLoading: Store<boolean> = status.map((state) => state === 'loading')
  const isDone: Store<boolean> = status.map((state) => state === 'done')
  const isFailed: Store<boolean> = status.map((state) => state === 'fail')

  return { isLoading, isDone, isFailed }
}
