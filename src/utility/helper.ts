export function clone<T>(data: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(JSON.stringify(data))
}

export function dateFormat(x: Date, y: string): string {
  const z = {
    M: x.getMonth() + 1,
    d: x.getDate(),
    h: x.getHours(),
    m: x.getMinutes(),
    s: x.getSeconds()
  }
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return ((v.length > 1 ? '0' : '') + z[v.slice(-1)]).slice(-2)
  })

  return y.replace(/(y+)/g, function(v) {
    return x.getFullYear().toString().slice(-v.length)
  })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function formatEnum(e: Object): Array<string> {
  const data = Object.values(e)
  const values = data.slice(data.length / 2, data.length)
  const keys = data.slice(0, data.length / 2)

  const object: Array<string> = []

  values.forEach((value, index) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    object[values[index]] = keys[index]
  })

  return object
}
