import { Counter, CounterType } from 'src/core/models/counter'

export function setType(counter: Counter, type: CounterType) {
  counter.type = type

  switch (counter.type) {
    case CounterType.Binary:
      counter.value = false
      delete counter.limit
      delete counter.current
      delete counter.start

      break
    case CounterType.Limited:
      counter.limit = 100
      counter.current = 0
      delete counter.value
      delete counter.start

      break
    case CounterType.Goal:
      counter.current = 100
      counter.start = 100
      delete counter.limit
      delete counter.value

      break
  }
}

export function isSucceed(counter: Counter): boolean {
  switch (counter.type) {
    case CounterType.Binary: return !!counter.value
    case CounterType.Goal: return counter.current === 0
    case CounterType.Limited: return (counter.current as number) <= (counter.limit as number)
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
