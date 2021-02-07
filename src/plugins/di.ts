import _Vue from 'vue'
import { container } from 'tsyringe'

export default (Vue: typeof _Vue) => {
  const ioc = container

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$container = ioc
  // @ts-ignore
  Vue.$container = ioc
}
