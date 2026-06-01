export function shekel(v: number): string {
  return '₪' + Math.round(v).toLocaleString('en-US')
}

export function pct(v: number, decimals = 1): string {
  return (v * 100).toFixed(decimals) + '%'
}

export function shortShekel(v: number): string {
  const abs = Math.abs(v)
  const sign = v < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}₪${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}₪${Math.round(abs / 1_000)}K`
  return `${sign}₪${abs}`
}
