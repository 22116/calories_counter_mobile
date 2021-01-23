import { Counter, CounterType as Type } from 'src/core/models/counter'
import { Vue } from 'vue-property-decorator'

export default class CounterTypeMixin extends Vue {
  isLimitedCounter(counter: Counter): boolean {
    return counter.type === Type.Limited
  }

  isBinaryCounter(counter: Counter): boolean {
    return counter.type === Type.Binary
  }

  isGoalCounter(counter: Counter): boolean {
    return counter.type === Type.Goal
  }
}
