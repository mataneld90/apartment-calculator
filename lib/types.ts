export type BuyerType = 'investor' | 'single'
export type MasShvach = 'exempt' | '25%'
export type MortgageMode = 'simple' | 'advanced'

export interface Params {
  Av0: number
  p: number
  R0: number
  Y: number
  Ip: number
  V: number
  mortgageRate: number  // Simple-mode blended effective rate
  Ri: number
  maintenanceRate: number
  buyerType: BuyerType
  purchaseCostsRate: number
  Es: number
  masShvach: MasShvach

  scenarioDelta: number  // pp drop below the contractual rate → market rate = rate - scenarioDelta

  // Advanced mortgage: split the loan into 3 Israeli tracks. Shares are fractions of the loan
  // (normalized to sum 1 by the model); rates are annual. Prime is early-repayment-exempt by law.
  mortgageMode: MortgageMode
  trackPrimeShare: number
  trackPrimeRate: number
  trackFixedShare: number   // קבועה לא צמודה (קל"צ)
  trackFixedRate: number
  trackVarShare: number     // משתנה (לא צמודה)
  trackVarRate: number
}

export interface ChartPoint {
  month: number
  apartmentGain: number
  passiveGain: number
  gainDiff: number
  cashFlow: number
  monthlyRent: number
  monthlyMortgage: number
  prepaymentFee: number
}

export interface Results {
  points: ChartPoint[]
  crossovers: { month: number; value: number }[]
  Tp: number
  M0: number
  Ep: number
  S0: number
  lockedRate: number  // = mortgageRate; used for prepayment fee threshold
  prepayFee: number   // early repayment fee at time of purchase (full principal)
  irrApartment: (number | null)[]  // annualized IRR for apt scenario, index = exit month (1..360)
  irrPassive:   (number | null)[]  // annualized IRR for passive scenario, index = exit month (1..360)
}
