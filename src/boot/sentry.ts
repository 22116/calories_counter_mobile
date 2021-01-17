import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { boot } from 'quasar/wrappers'

export default boot((data) => {
  return Sentry.init({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Vue: data.Vue,
    dsn: process.env.SENTRY,
    autoSessionTracking: true,
    integrations: [
      new Integrations.BrowserTracing()
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
  })
})
