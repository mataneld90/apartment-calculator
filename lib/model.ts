import type { Params, ChartPoint, Results } from './types'

function purchaseTaxInvestor(A: number): number {
  const b1 = 5_872_725
  if (A <= b1) return A * 0.08
  return b1 * 0.08 + (A - b1) * 0.10
}

function purchaseTaxSingle(A: number): number {
  const b1 = 1_978_745
  const b2 = 2_347_040
  const b3 = 6_055_070
  const b4 = 20_183_565
  let tax = 0
  if (A <= b1) return 0
  tax += Math.min(A - b1, b2 - b1) * 0.035
  if (A > b2) tax += Math.min(A - b2, b3 - b2) * 0.05
  if (A > b3) tax += Math.min(A - b3, b4 - b3) * 0.08
  if (A > b4) tax += (A - b4) * 0.10
  return tax
}

export function compute(params: Params): Results {
  const {
    Av0, p, R0, Y, Ip, V, Ib, primeMinus, Ri,
    buyerType, purchaseCostsRate,
    Es, masShvach, cgt, G0, Im,
  } = params

  const S0 = (1 - p) * Av0
  const M0 = p * Av0
  const I = Ib + 0.015 - primeMinus
  const v = Math.pow(1 + V, 1 / 12) - 1
  const i = Math.pow(1 + I, 1 / 12) - 1
  const ip = Math.pow(1 + Ip, 1 / 12)  // factor, not rate

  const Tp = buyerType === 'investor'
    ? purchaseTaxInvestor(Av0)
    : purchaseTaxSingle(Av0)

  const addedCosts = Tp + Av0 * purchaseCostsRate
  const Ep = S0 + addedCosts
  const G = G0 * Ep
  const taxBasis = Av0 + addedCosts

  const T = Y * 12
  const monthlyPayment = i > 0
    ? M0 * i / (1 - Math.pow(1 + i, -T))
    : M0 / T

  // Month 0: rem=M0, F=0, gain<0 so masShvachTax=0
  const N0 = Av0 * (1 - Es) - Ep - M0
  const fee0 = M0 * Math.max(0, I - Im) * Y
  const N0adj = N0 - fee0
  const points: ChartPoint[] = [
    { month: 0, apartmentGain: Math.round(N0adj), passiveGain: 0, gainDiff: Math.round(N0adj), goal: Math.round(G) },
  ]

  let F = 0
  let rem = M0
  let intComp = 0  // Σ|f(t)|·ip^(x-t) — compounded injections
  let intFlat = 0  // Σ|f(t)| — flat sum (cost basis of injections)

  let prevN = N0
  let prevP = 0
  const crossovers: Results['crossovers'] = []
  let goalMonth: Results['goalMonth'] = null

  for (let x = 1; x <= 360; x++) {
    const rent = R0 * Math.pow(1 + Ri, Math.floor((x - 1) / 12))

    let mort = 0
    if (x <= T && rem > 0) {
      const interestPmt = rem * i
      const principalPmt = monthlyPayment - interestPmt
      rem = Math.max(0, rem - principalPmt)
      mort = monthlyPayment
    }

    const flow = rent - mort
    F += flow

    const afl = Math.abs(flow)
    intComp = intComp * ip + afl
    intFlat += afl

    const Av_x = Av0 * Math.pow(1 + v, x)

    const netProceeds = Av_x * (1 - Es)
    const gain = netProceeds - taxBasis
    const masShvachTax = (masShvach === '25%' && gain > 0) ? gain * 0.25 : 0
    const N_x = netProceeds + F - Ep - rem - masShvachTax

    // ip^0=1 so P(0)=0; ip is a factor so Ep*(ip^x - 1) = compounded gain on Ep
    const P_x = (1 - cgt) * (
      Ep * (Math.pow(ip, x) - 1) +
      (intComp - intFlat)
    )

    const yearsLeft = Math.max(0, (T - x) / 12)
    const prepaymentFee = rem * Math.max(0, I - Im) * yearsLeft
    const N_x_adj = N_x - prepaymentFee

    // Detect every sign change in (N - P)
    if (Math.sign(prevN - prevP) !== Math.sign(N_x_adj - P_x) && N_x_adj !== P_x) {
      crossovers.push({ month: x, value: Math.round((N_x_adj + P_x) / 2) })
    }
    if (!goalMonth && prevN < G && N_x_adj >= G) {
      goalMonth = { month: x, value: Math.round(N_x_adj) }
    }
    prevN = N_x_adj
    prevP = P_x

    points.push({
      month: x,
      apartmentGain: Math.round(N_x_adj),
      passiveGain: Math.round(P_x),
      gainDiff: Math.round(N_x_adj - P_x),
      goal: Math.round(G),
    })
  }

  return { points, crossovers, goalMonth, Tp, M0, monthlyPayment, Ep, addedCosts, S0, G }
}

export const DEFAULT_PARAMS: Params = {
  Av0: 3_000_000,
  p: 0.50,
  R0: 6_000,
  Y: 30,
  Ip: 0.078,
  V: 0.06,
  Ib: 0.04,
  primeMinus: 0.009,
  Ri: 0.035,
  buyerType: 'investor',
  purchaseCostsRate: 0.05,
  Es: 0.03,
  masShvach: '25%',
  cgt: 0.25,
  G0: 0.5,
  Im: 0.045,
  primeFrac: 0.15,
}
