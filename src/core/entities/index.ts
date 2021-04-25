import {Counter} from 'src/core/entities/Counter'
import {Setting} from 'src/core/entities/Setting'
import {History} from 'src/core/entities/History'

export {
  Counter,
  Setting,
  History
}

export const Serializable = [
  Counter,
  History,
  Setting
]
