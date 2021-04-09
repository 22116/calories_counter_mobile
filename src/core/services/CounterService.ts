import { inject, singleton } from 'tsyringe'
import { Counter } from 'src/core/entities'
import { BinaryCounterTheme, CounterType, Score, TimeoutList } from 'src/core/entities/Counter'
import { IdGenerator } from 'src/utility/encryption'

@singleton()
class Scheduler {
  public match(timeouts: Array<TimeoutList>, list: Array<TimeoutList>): boolean {
    return timeouts.reduce<boolean>(((previousValue, currentValue) => {
      return !(!previousValue || !list.includes(currentValue))
    }), true)
  }

  public isDue(timeouts: Array<TimeoutList>, date: Date): boolean {
    for (const timeout of timeouts) {
      switch (timeout) {
        case TimeoutList.Daily: return true
        case TimeoutList.Monthly: if (date.getDate() === 1) return true; else break
        case TimeoutList.Yearly: if (date.getMonth() === 1 && date.getDate() === 1) return true; else break
        case TimeoutList.Sunday: if (date.getDay() === 0) return true; else break
        case TimeoutList.Monday: if (date.getDay() === 1) return true; else break
        case TimeoutList.Tuesday: if (date.getDay() === 2) return true; else break
        case TimeoutList.Wednesday: if (date.getDay() === 3) return true; else break
        case TimeoutList.Thursday: if (date.getDay() === 4) return true; else break
        case TimeoutList.Friday: if (date.getDay() === 5) return true; else break
        case TimeoutList.Saturday: if (date.getDay() === 6) return true; else break
      }
    }

    return false
  }
}

@singleton()
export class CounterService {
  constructor(@inject(Scheduler) private scheduler: Scheduler) { }

  create(): Counter<Score> {
    const counter = new Counter()
    counter.id = new IdGenerator().generate()
    counter.name = ''
    counter.description = ''
    counter.type = CounterType.Binary
    counter.theme = BinaryCounterTheme.Default
    counter.icon = 'label'
    counter.createdAt = new Date()
    counter.enabled = true
    counter.scores = {
      value: false,
    }

    return counter
  }

  setType(counter: Counter<Score>, type: CounterType) {
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

  isSucceed(counter: Counter<Score>): boolean {
    switch (counter.type) {
      case CounterType.Binary: return !!counter.scores.value
      case CounterType.Goal: return counter.scores.current === 0
      case CounterType.Limited: return (counter.scores.current as number) <= (counter.scores.limit as number)
      default: return true
    }
  }

  getCounterTypeDescription(type: CounterType): string {
    switch (type) {
      case CounterType.Binary: return 'Just a button. Yes/No'
      case CounterType.Limited: return 'Make a restriction which you cannot break'
      case CounterType.Goal: return 'Count how many steps left to pass your goal'
      default: return ''
    }
  }

  isDue(counter: Counter<Score>, date: Date): boolean {
    return this.scheduler.isDue(counter.timeouts, date)
  }
}
