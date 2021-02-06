import { Repository } from 'src/core/repositories/Repository'
import { Counter, Score } from 'src/core/entities/Counter'

export class CounterRepository extends Repository<Counter<Score>> {
  factory(): Counter<Score> {
    return new Counter<Score>()
  }
}
