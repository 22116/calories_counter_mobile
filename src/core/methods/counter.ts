import { Counter, CounterType, Score } from 'src/core/entities/counter'

export function setType(counter: Counter<Score>, type: CounterType) {
  counter.type = type

  switch (counter.type) {
    case CounterType.Binary:
      counter.scores.value = false

      // @ts-ignore
      delete counter.scores.limit
      // @ts-ignore
      delete counter.scores.current
      // @ts-ignore
      delete counter.scores.start

      break
    case CounterType.Limited:
      counter.scores.limit = 100
      counter.scores.current = 0

      // @ts-ignore
      delete counter.scores.value
      // @ts-ignore
      delete counter.scores.start

      break
    case CounterType.Goal:
      counter.scores.current = 100
      counter.scores.start = 100

      // @ts-ignore
      delete counter.scores.limit
      // @ts-ignore
      delete counter.scores.value

      break
  }
}

export function isSucceed(counter: Counter<Score>): boolean {
  const history = counter.history.find((history) => history.date.toDateString() === new Date().toDateString())

  if (!history) {
    return false
  }

  switch (counter.type) {
    case CounterType.Binary: return !!history.scores.value
    case CounterType.Goal: return history.scores.current === 0
    case CounterType.Limited: return (history.scores.current as number) <= (history.scores.limit as number)
    default: return true
  }
}

export function getCounterTypeDescription(type: CounterType) {
  switch (type) {
    case CounterType.Binary:
      return 'Just a button. Yes/No'
    case CounterType.Limited:
      return 'Make a restriction which you cannot break'
    case CounterType.Goal:
      return 'Count how many steps left to pass your goal'
  }

  return ''
}
