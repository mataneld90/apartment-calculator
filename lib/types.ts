export type BuyerType = 'investor' | 'single'
export type MasShvach = 'exempt' | '25%'

export interface Params {
  Av0: number
  p: number
  R0: number
  Y: number
  Ip: number
  V: number
  mortgageRate: number
  Ri: number
  maintenanceRate: number
  buyerType: BuyerType
  purchaseCostsRate: number
  Es: number
  masShvach: MasShvach

  Im: number
}

export interface ChartPoint {
  month: number
  apartmentGain: number
  passiveGain: number
  gainDiff: number
  cashFlow: number
  monthlyRent: number
  monthlyMortgage: number
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
}
