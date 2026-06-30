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

// Annuity factor: present value of 1 per period for n periods at per-period rate r
function annuityFactor(r: number, n: number): number {
  return r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r
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
    buyerType, occupancy, liveInRent, purchaseCostsRate,
    Es, masShvach, scenarioDelta,
    mortgageMode, trackPrimeShare, trackPrimeRate,
    trackFixedShare, trackFixedRate, trackVarShare, trackVarRate,
  } = params

  const S0 = (1 - p) * Av0
  const M0 = p * Av0
  const v = Math.pow(1 + V, 1 / 12) - 1
  const ip = Math.pow(1 + Ip, 1 / 12)  // factor, not rate

  const Tp = buyerType === 'investor'
    ? purchaseTaxInvestor(Av0)
    : purchaseTaxSingle(Av0)

  const addedCosts = Tp + Av0 * purchaseCostsRate
  const Ep = S0 + addedCosts
  const taxBasis = Av0 + addedCosts

  const T = Y * 12

  // Mortgage tracks. Simple mode = one non-exempt track at the effective rate (numerically
  // identical to the legacy single-rate model). Advanced mode splits the loan into prime
  // (early-repayment-exempt by law), fixed-unlinked (קל"צ) and variable-unlinked tracks, each
  // amortized as its own Spitzer loan over the shared term T.
  type Track = { principal: number; rate: number; exempt: boolean }
  let tracks: Track[]
  if (mortgageMode === 'advanced') {
    const shareSum = (trackPrimeShare + trackFixedShare + trackVarShare) || 1
    tracks = [
      { principal: M0 * trackPrimeShare / shareSum, rate: trackPrimeRate, exempt: true },
      { principal: M0 * trackFixedShare / shareSum, rate: trackFixedRate, exempt: false },
      { principal: M0 * trackVarShare   / shareSum, rate: trackVarRate,   exempt: false },
    ].filter(tk => tk.principal > 0)
  } else {
    tracks = [{ principal: M0, rate: mortgageRate, exempt: false }]
  }

  // Per-track monthly (compounded) rate + Spitzer payment; total payment is their sum.
  const trackCalc = tracks.map(tk => {
    const im = Math.pow(1 + tk.rate, 1 / 12) - 1
    const payment = im > 0 ? tk.principal * im / (1 - Math.pow(1 + im, -T)) : tk.principal / T
    return { ...tk, im, payment }
  })
  const monthlyPayment = trackCalc.reduce((s, tk) => s + tk.payment, 0)

  // Blended effective rate — for display and the locked-rate threshold.
  const lockedRate = M0 > 0 ? tracks.reduce((s, tk) => s + tk.rate * tk.principal, 0) / M0 : mortgageRate

  // Early-repayment (היוון) fee over the remaining n months: present value of the rate gap on each
  // non-exempt track (prime is exempt by law). Keeps the legacy mixed convention exactly — payment
  // from the compounded monthly rate, discounting at the nominal rate/12 — so simple mode is unchanged.
  const feeForRemaining = (n: number): number => {
    let fee = 0
    for (const tk of trackCalc) {
      if (tk.exempt) continue
      const rc = tk.rate / 12
      const rm = (tk.rate - scenarioDelta) / 12
      fee += Math.max(0, tk.payment * (annuityFactor(rm, n) - annuityFactor(rc, n)))
    }
    return fee
  }

  // Month 0: rem=M0, F=0, gain<0 so masShvachTax=0
  const N0 = Av0 * (1 - Es) - Ep - M0
  const fee0 = feeForRemaining(T)
  const N0adj = N0 - fee0
  const points: ChartPoint[] = [
    { month: 0, apartmentGain: Math.round(N0adj), passiveGain: 0, gainDiff: Math.round(N0adj), cashFlow: 0, monthlyRent: Math.round(occupancy === 'livein' ? liveInRent : R0), monthlyMortgage: Math.round(M0 > 0 ? monthlyPayment : 0), prepaymentFee: Math.round(fee0) },
  ]

  let F = 0
  const rems = trackCalc.map(tk => tk.principal)  // outstanding balance per track
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
    const year = Math.floor((x - 1) / 12)
    // marketRent = THIS apartment's market rent — the maintenance basis in both modes, and the
    // collected rent when renting out. Maintenance is always a fraction of it (a property cost).
    const marketRent = R0 * Math.pow(1 + Ri, year)
    const maintenance = marketRent * (maintenanceRate / 12)
    // incomeRent = the rent that offsets the mortgage in cashflow: collected rent when renting out,
    // avoided rent (what you'd pay elsewhere) when living in. Decoupled from the maintenance basis.
    const incomeRent = occupancy === 'livein'
      ? liveInRent * Math.pow(1 + Ri, year)
      : marketRent
    const effectiveRent = incomeRent - maintenance

    let mort = 0
    if (x <= T) {
      for (let k = 0; k < trackCalc.length; k++) {
        if (rems[k] <= 0) continue
        const interestPmt = rems[k] * trackCalc[k].im
        rems[k] = Math.max(0, rems[k] - (trackCalc[k].payment - interestPmt))
        mort += trackCalc[k].payment
      }
    }
    const rem = rems.reduce((a, b) => a + b, 0)  // total outstanding across tracks

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

    const n = Math.max(0, T - x)  // remaining months at exit
    const prepaymentFee = feeForRemaining(n)
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
      monthlyRent: Math.round(incomeRent),
      monthlyMortgage: Math.round(mort),
      prepaymentFee: Math.round(prepaymentFee),
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

// Bank of Israel policy rate. THE manual knob: update this one number when BOI moves
// (the live BOI fetch was abandoned). Prime = BOI + 1.5% by definition (used for the prime track).
export const BOI_RATE = 0.0375
const PRIME_RATE = BOI_RATE + 0.015   // standard Israeli prime = BOI + 1.5%

export const DEFAULT_PARAMS: Params = {
  Av0: 2_500_000,
  p: 0.50,
  R0: 6_000,
  Y: 30,
  Ip: 0.09,
  V: 0.07,
  // Single blended effective rate for the whole mortgage — a typical Israeli mortgage today.
  // Standalone value (not derived from a personal deal); edit to your bank's quote.
  mortgageRate: 0.045,
  Ri: 0.02,
  maintenanceRate: 0.07,
  buyerType: 'investor',
  occupancy: 'rentout',
  liveInRent: 6_000,   // defaults to R0 so live-in == rent-out until the user decouples it
  purchaseCostsRate: 0.05,
  Es: 0.03,
  masShvach: '25%',
  scenarioDelta: 0.005,

  mortgageMode: 'simple',
  // By-track defaults: individually realistic rates that, in equal thirds, BLEND to the single
  // rate above ((5.25 + 4.0 + 4.25) / 3 = 4.5%). So switching to By-track leaves the payment
  // ~unchanged — the only meaningful difference is the lower early-repayment fee, because the
  // prime track is exempt by law. Users then set their real per-track shares and rates.
  trackPrimeShare: 1 / 3,
  trackPrimeRate: PRIME_RATE,   // prime = BOI + 1.5% = 5.25%
  trackFixedShare: 1 / 3,
  trackFixedRate: 0.04,         // fixed-unlinked (קל"צ), typical today
  trackVarShare: 1 / 3,
  trackVarRate: 0.0425,         // variable-unlinked, typical today
}
