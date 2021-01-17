import { Counter, CounterType } from 'src/store/persistent/counters-models'

export function setType(counter: Counter, type: CounterType) {
  counter.type = type

  if (counter.type === CounterType.Limited) {
    counter.limit = 100
    counter.current = 0
  } else {
    delete counter.limit
    delete counter.current
  }

  if (counter.type === CounterType.Goal) {
    counter.current = 100
  } else {
    delete counter.current
  }

  if (counter.type === CounterType.Binary) {
    counter.value = false
  } else {
    delete counter.value
  }
}
