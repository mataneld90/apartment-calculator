'use client'

import { useEffect } from 'react'

// Cloudflare Web Analytics — cookie-free. Loaded client-side so it can honour a
// personal opt-out: visit ?noanalytics=1 once to stop the beacon on this browser
// (persisted in localStorage); ?noanalytics=0 re-enables it.
const FLAG = 'cf-noanalytics'
const TOKEN = 'a4bd02f04de24a038d2a18a2b01a1fc0'

export default function Analytics() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.has('noanalytics')) {
        const v = params.get('noanalytics')
        if (v === '0' || v === 'false') localStorage.removeItem(FLAG)
        else localStorage.setItem(FLAG, '1')
      }
      if (localStorage.getItem(FLAG) === '1') return // opted out on this browser
    } catch {
      /* localStorage unavailable — fall through and load the beacon */
    }

    if (document.querySelector('script[data-cf-beacon]')) return // avoid double-injection
    const s = document.createElement('script')
    s.defer = true
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN }))
    document.body.appendChild(s)
  }, [])

  return null
}
