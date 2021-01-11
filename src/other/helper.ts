export function clone<T>(data: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(JSON.stringify(data));
}

export function dateFormat(x: Date, y: string): string {
  const z = {
    M: x.getMonth() + 1,
    d: x.getDate(),
    h: x.getHours(),
    m: x.getMinutes(),
    s: x.getSeconds()
  };
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return ((v.length > 1 ? '0' : '') + z[v.slice(-1)]).slice(-2)
  });

  return y.replace(/(y+)/g, function(v) {
    return x.getFullYear().toString().slice(-v.length)
  });
}
