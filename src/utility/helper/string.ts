export function generateMonthlyCacheKey(date: Date): string {
  return JSON.stringify({
    year: date.getFullYear(),
    month: date.getMonth(),
  })
}
