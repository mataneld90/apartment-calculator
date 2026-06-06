export type BuyerType = 'investor' | 'single'
export type MasShvach = 'exempt' | '25%'

export interface Params {
  Av0: number
  p: number
  R0: number
  Y: number
  Ip: number
  V: number
  Ib: number
  primeMinus: number
  Ri: number
  buyerType: BuyerType
  purchaseCostsRate: number
  Es: number
  masShvach: MasShvach
  cgt: number
  G0: number
  Im: number
}

export interface ChartPoint {
  month: number
  apartmentGain: number
  passiveGain: number
  gainDiff: number
  goal: number
}

export interface Results {
  points: ChartPoint[]
  crossovers: { month: number; value: number }[]
  goalMonth: { month: number; value: number } | null
  Tp: number
  M0: number
  monthlyPayment: number
  Ep: number
  addedCosts: number
  S0: number
  G: number
}
