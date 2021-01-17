import { Counter, CounterType } from 'src/core/models/counter'

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
