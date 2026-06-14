const { onRequest } = require('firebase-functions/v2/https')

const BOI_URL =
  'https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/IR/1.0/IR_TELBOR_ON?lastNObservations=1&format=sdmx-json'

// If this returns null, check BOI SDMX series IDs at https://edge.boi.org.il
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
    const timer = setTimeout(() => controller.abort(), 3000)
    const r = await fetch(BOI_URL, { signal: controller.signal })
    clearTimeout(timer)
    if (!r.ok) throw new Error(`BOI API ${r.status}`)

    const json = await r.json()
    const series = json?.dataSets?.[0]?.series
    const seriesKey = series ? Object.keys(series)[0] : null
    const obs = seriesKey ? series[seriesKey]?.observations : null
    const obsKey = obs ? Object.keys(obs)[0] : null
    const raw = obsKey ? obs[obsKey]?.[0] : null

    if (typeof raw !== 'number') {
      console.error('[boi-rate] Could not parse rate from response:', JSON.stringify(json))
      res.status(502).json({ error: 'parse_failed' })
      return
    }

    const rate = raw / 100
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
