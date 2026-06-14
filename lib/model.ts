import type { Params, ChartPoint, Results } from './types'

// ─── IRR solver ───────────────────────────────────────────────────────────────
function npvCalc(cfs: number[], n: number, r: number): number {
  let sum = 0, factor = 1;
  for (let t = 0; t <= n; t++) {
    sum += cfs[t] * factor;
    factor /= (1 + r);
  }
  return sum;
}

function solveIRR(cfs: number[], n: number): number | null {
  const LO = -0.5, HI = 0.5;
  const nLo = npvCalc(cfs, n, LO);
  const nHi = npvCalc(cfs, n, HI);
  if (!isFinite(nLo) || !isFinite(nHi) || nLo * nHi > 0) return null;
  let lo = LO, hi = HI;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    const nm = npvCalc(cfs, n, mid);
    if (!isFinite(nm)) return null;
    if (nLo * nm <= 0) hi = mid;
    else lo = mid;
  }
  return Math.pow(1 + (lo + hi) / 2, 12) - 1;
}

const CGT = 0.25
// 2024–2027 single-apartment מס שבח exemption ceiling — periodically indexed by the tax authority
const MAS_SHVACH_EXEMPT_CEILING = 5_008_000

export function purchaseTaxInvestor(A: number): number {
  const b1 = 5_872_725
  if (A <= b1) return A * 0.08
  return b1 * 0.08 + (A - b1) * 0.10
}

export function purchaseTaxSingle(A: number): number {
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
    Av0, p, R0, Y, Ip, V, mortgageRate, Ri, maintenanceRate,
    buyerType, purchaseCostsRate,
    Es, masShvach, Im,
  } = params

  const S0 = (1 - p) * Av0
  const M0 = p * Av0
  const I = mortgageRate
  const v = Math.pow(1 + V, 1 / 12) - 1
  const i = Math.pow(1 + I, 1 / 12) - 1
  const ip = Math.pow(1 + Ip, 1 / 12)  // factor, not rate

  const Tp = buyerType === 'investor'
    ? purchaseTaxInvestor(Av0)
    : purchaseTaxSingle(Av0)

  const addedCosts = Tp + Av0 * purchaseCostsRate
  const Ep = S0 + addedCosts
  const taxBasis = Av0 + addedCosts
  const lockedRate = I

  const T = Y * 12
  const monthlyPayment = i > 0
    ? M0 * i / (1 - Math.pow(1 + i, -T))
    : M0 / T

  // Month 0: rem=M0, F=0, gain<0 so masShvachTax=0
  const N0 = Av0 * (1 - Es) - Ep - M0
  const fee0 = M0 * Math.max(0, I - Im) * Y
  const N0adj = N0 - fee0
  const points: ChartPoint[] = [
    { month: 0, apartmentGain: Math.round(N0adj), passiveGain: 0, gainDiff: Math.round(N0adj), cashFlow: 0, monthlyRent: Math.round(R0), monthlyMortgage: Math.round(M0 > 0 ? monthlyPayment : 0) },
  ]

  let F = 0
  let rem = M0
  let intComp = 0  // Σmax(0,-f(t))·ip^(x-t) — compounded injections (mort>rent months only)
  let intFlat = 0  // Σmax(0,-f(t)) — flat sum (cost basis of injections)

  // IRR cash-flow accumulators (index = month, 0 = initial outlay)
  const aptCFs: number[] = [-Ep]
  const pasCFs: number[] = [-Ep]
  const aptExits: number[] = [0]  // exit value at each month (apt)
  const pasExits: number[] = [0]  // exit value at each month (pas)

  let prevN = N0
  let prevP = 0
  const crossovers: Results['crossovers'] = []

  for (let x = 1; x <= 360; x++) {
    const rent = R0 * Math.pow(1 + Ri, Math.floor((x - 1) / 12))
    const effectiveRent = rent * (1 - maintenanceRate / 12)

    let mort = 0
    if (x <= T && rem > 0) {
      const interestPmt = rem * i
      const principalPmt = monthlyPayment - interestPmt
      rem = Math.max(0, rem - principalPmt)
      mort = monthlyPayment
    }

    const flow = effectiveRent - mort
    F += flow

    const injection = Math.max(0, -flow)
    intComp = intComp * ip + injection
    intFlat += injection

    const Av_x = Av0 * Math.pow(1 + v, x)

    const netProceeds = Av_x * (1 - Es)
    const gain = netProceeds - taxBasis
    let masShvachTax = 0
    if (gain > 0) {
      if (masShvach === '25%') {
        masShvachTax = gain * 0.25
      } else if (masShvach === 'exempt') {
        // Ceiling-aware: gain proportional to value above the ceiling is taxed at 25%
        const taxablePortion = Math.max(0, Av_x - MAS_SHVACH_EXEMPT_CEILING) / Av_x
        masShvachTax = gain * taxablePortion * 0.25
      }
    }
    const N_x = netProceeds + F - Ep - rem - masShvachTax

    // passive gain formula; at month 0 passiveGain is hardcoded to 0, not computed here
    const P_x = (1 - CGT) * (
      Ep * (Math.pow(ip, x) - 1) +
      (intComp - intFlat)
    )

    const yearsLeft = Math.max(0, (T - x) / 12)
    const prepaymentFee = Math.max(0, (I - Im) * rem * yearsLeft)
    const N_x_adj = N_x - prepaymentFee

    // Detect every sign change in (N - P)
    if (Math.sign(prevN - prevP) !== Math.sign(N_x_adj - P_x) && N_x_adj !== P_x) {
      crossovers.push({ month: x, value: Math.round((N_x_adj + P_x) / 2) })
    }
    prevN = N_x_adj
    prevP = P_x

    points.push({
      month: x,
      apartmentGain: Math.round(N_x_adj),
      passiveGain: Math.round(P_x),
      gainDiff: Math.round(N_x_adj - P_x),
      cashFlow: Math.round(flow),
      monthlyRent: Math.round(rent),
      monthlyMortgage: Math.round(mort),
    })

    aptCFs.push(flow)
    pasCFs.push(-Math.max(0, -flow))
    aptExits.push(netProceeds - rem - masShvachTax)
    pasExits.push(P_x + Ep + intFlat)
  }

  // Precompute IRR for all exit months 1..360 (O(1) lookup on hover)
  const irrApartment: (number | null)[] = [null]
  const irrPassive:   (number | null)[] = [null]
  for (let x = 1; x <= 360; x++) {
    aptCFs[x] += aptExits[x]
    pasCFs[x] += pasExits[x]
    irrApartment.push(solveIRR(aptCFs, x))
    irrPassive.push(solveIRR(pasCFs, x))
    aptCFs[x] -= aptExits[x]
    pasCFs[x] -= pasExits[x]
  }

  return { points, crossovers, Tp, M0, Ep, S0, lockedRate, prepayFee: Math.round(fee0), irrApartment, irrPassive }
}

export const DEFAULT_PARAMS: Params = {
  Av0: 2_500_000,
  p: 0.50,
  R0: 6_000,
  Y: 30,
  Ip: 0.09,
  V: 0.07,
  mortgageRate: 0.046,
  Ri: 0.02,
  maintenanceRate: 0.07,
  buyerType: 'investor',
  purchaseCostsRate: 0.05,
  Es: 0.03,
  masShvach: '25%',
  Im: 0.0435,
}
