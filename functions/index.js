const { onRequest } = require('firebase-functions/v2/https')

// Bank of Israel "nominal interest rate" — the headline policy rate (ריבית בנק ישראל).
// New SDMX REST endpoint on the edge.boi.gov.il domain: dataflow BR, series MNT_RIB_BOI_D.
// (The old edge.boi.org.il /sdmx/v2 IR_TELBOR_ON endpoint was retired — it now 404s / returns
// an HTML error page. The dataflow catalog lives at
// .../ws/public/sdmxapi/rest/dataflow/BOI.STATISTICS if the series IDs change again.)
const BOI_URL =
  'https://edge.boi.gov.il/FusionEdgeServer/ws/public/sdmxapi/rest/data/BOI.STATISTICS,BR,1.0/MNT_RIB_BOI_D.D.RIB_BOI?lastNObservations=1&format=sdmx-json'

const MIN_RATE = 0.001
const MAX_RATE = 0.15
const CACHE_MS = 24 * 60 * 60 * 1000

let cache = null
let cacheTime = 0

exports.boiRate = onRequest({ cors: true, region: 'europe-west1' }, async (req, res) => {
  if (cache && Date.now() - cacheTime < CACHE_MS) {
    res.json(cache)
    return
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const r = await fetch(BOI_URL, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    })
    clearTimeout(timer)
    if (!r.ok) throw new Error(`BOI API ${r.status}`)

    const json = await r.json()
    // SDMX-JSON shape: { data: { dataSets: [ { series: { "<key>": { observations: { "<i>": [value] } } } } ] } }
    const series = json?.data?.dataSets?.[0]?.series
    const seriesKey = series ? Object.keys(series)[0] : null
    const obs = seriesKey ? series[seriesKey]?.observations : null
    const obsKey = obs ? Object.keys(obs).pop() : null  // most recent observation
    const raw = obsKey ? obs[obsKey]?.[0] : null
    const pctVal = raw == null ? NaN : parseFloat(raw)  // BOI returns the rate as a string, e.g. "3.75"

    if (!Number.isFinite(pctVal)) {
      console.error('[boi-rate] Could not parse rate from response:', JSON.stringify(json).slice(0, 500))
      res.status(502).json({ error: 'parse_failed' })
      return
    }

    const rate = pctVal / 100
    if (rate < MIN_RATE || rate > MAX_RATE) {
      console.error(`[boi-rate] Rate ${rate} out of range`)
      res.status(502).json({ error: 'out_of_range' })
      return
    }

    cache = { rate, fetchedAt: new Date().toISOString() }
    cacheTime = Date.now()
    res.json(cache)
  } catch (err) {
    console.error('[boi-rate] Fetch failed:', err)
    res.status(502).json({ error: 'fetch_failed' })
  }
})
