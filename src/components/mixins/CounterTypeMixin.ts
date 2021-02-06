import { Vue } from 'vue-property-decorator'
import { Counter } from 'src/core/entities'
import { CounterType, Score } from 'src/core/entities/Counter'

export default class CounterTypeMixin extends Vue {
  isLimitedCounter(counter: Counter<Score>): boolean {
    return counter.type === CounterType.Limited
  }

  isBinaryCounter(counter: Counter<Score>): boolean {
    return counter.type === CounterType.Binary
  }

  isGoalCounter(counter: Counter<Score>): boolean {
    return counter.type === CounterType.Goal
  }
}
