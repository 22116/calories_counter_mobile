export interface Trigger {
  type?: 'fix'|'timespan'|'repeat'|'match'|'location'
  at?: Date,
  in?: number,
  unit?: 'second'|'minute'|'hour'|'day'|'week'|'month'|'quarter'|'year',
  count?: number,
  every?: 'minute'|'hour'|'day'|'week'|'month'|'quarter'|'year'|{
    'minute'?: number,
    'hour'?: number,
    'day'?: number,
    'week'?: number,
    'month'?: number,
    'quarter'?: number,
    'year'?: number,
  },
  before?: Date,
  after?: Date,
  center?: [number, number], // [lat, long]
  radius?: number,
  notifyOnEntry?: boolean,
  notifyOnExit?: boolean,
  single?: true,
}

export interface Action {
  id?: string|number,
  title?: string,
  type?: 'input'|'button',
  emptyText?: '',
  icon?: string,
  choices?: any,
  editable?: boolean,
  callback?: (message: Message, data: any) => void
}

export interface Message {
  id?: number,
  text?: string,
  title?: string,
  sound?: string,
  iconType?: string,
  data?: any,
  icon?: string,
  silent?: boolean,
  trigger?: Trigger,
  timeoutAfter?: number,
  attachments?: Array<any>,
  progressBar?: any,
  group?: string,
  summary?: string,
  smallIcon?: string,
  sticky?: boolean,
  autoClear?: boolean,
  led?: boolean,
  color?: string,
  vibrate?: boolean,
  lockscreen?: any,
  clock?: any,
  defaults?: any,
  priority?: any,
  number?: any,
  channel?: string,
  launch?: any,
  mediaSession?: any,
  badge?: string,
  actions?: Array<Action>,
  groupSummary?: any,
  foreground?: boolean,
  wakeup?: boolean,
}

export class Notification {
  public static send(message: Message) {
    if (message.actions) {
      for (const action of message.actions) {
        if (action.callback) {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
          cordova.plugins.notification.local.on(action.id, action.callback)
        }
      }
    }

    if (!message.smallIcon) {
      message.smallIcon = 'res://logo.png'
    }

    if (!message.icon) {
      message.icon = 'res://logo.png'
    }

    if (!message.foreground) {
      message.foreground = true
    }

    if (!message.vibrate) {
      message.vibrate = true
    }

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    cordova.plugins.notification.local.schedule(message)
  }
}
