import { Repository } from 'src/core/repositories/Repository'
import { Counter, Score } from 'src/core/entities/Counter'
import { singleton } from 'tsyringe'

@singleton()
export class CounterRepository extends Repository<Counter<Score>> {
  factory(): Counter<Score> {
    return new Counter<Score>()
  }
}
