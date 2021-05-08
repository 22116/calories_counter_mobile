import Vue from 'vue'
import { container } from 'tsyringe'

export default (app: typeof Vue) => {
  const ioc = container

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  app.prototype.$container = ioc
  // @ts-ignore
  app.$container = ioc
}
