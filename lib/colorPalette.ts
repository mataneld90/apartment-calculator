'use client'
import { useState, useEffect } from 'react'

export interface ChartPalette {
  apt: string
  pas: string
  diffCurve: string     // diff-view curve color; semantically = apt color
  goal: string          // goal horizontal line color
  npFill: string        // background fill when apartment leads (N > P)
  npFillOpacity: number
  pnFill: string        // background fill when passive leads (P > N)
  pnFillOpacity: number
  aptTint: string       // panel background tint for apartment panels
  pasTint: string       // panel background tint for passive panel
}

const DEFAULT_LIGHT: ChartPalette = {
  apt: '#16a34a',
  pas: '#6366f1',
  diffCurve: '#1e293b',
  goal: '#f59e0b',
  npFill: 'rgba(22,163,74,0.06)',
  npFillOpacity: 1,
  pnFill: '#eef2ff',
  pnFillOpacity: 1,
  aptTint: 'rgba(22,163,74,0.06)',
  pasTint: 'rgba(99,102,241,0.06)',
}

const DEFAULT_DARK: ChartPalette = {
  apt: '#22c55e',
  pas: '#818cf8',
  diffCurve: '#f1f5f9',
  goal: '#f59e0b',
  npFill: 'rgb(5,46,22)',
  npFillOpacity: 0.25,
  pnFill: 'rgb(30,27,75)',
  pnFillOpacity: 0.4,
  aptTint: 'rgba(34,197,94,0.08)',
  pasTint: 'rgba(129,140,248,0.08)',
}

const COLORBLIND: ChartPalette = {
  apt: '#2563eb',
  pas: '#f97316',
  diffCurve: '#1e293b',  // overridden in getChartPalette based on isDark
  goal: '#f43f5e',
  npFill: '#2563eb',
  npFillOpacity: 0.06,
  pnFill: '#f97316',
  pnFillOpacity: 0.06,
  aptTint: 'rgba(59,130,246,0.08)',
  pasTint: 'rgba(249,115,22,0.08)',
}

export function getChartPalette(colorblindMode: boolean, isDark: boolean): ChartPalette {
  const diffCurve = isDark ? '#f1f5f9' : '#1e293b'
  if (colorblindMode) return { ...COLORBLIND, diffCurve }
  return isDark ? DEFAULT_DARK : DEFAULT_LIGHT
}

export function useColorPalette(isDark: boolean) {
  const [colorblindMode, setColorblindMode] = useState(false)

  useEffect(() => {
    setColorblindMode(localStorage.getItem('colorblindMode') === 'true')
  }, [])

  const toggleColorblind = () => {
    setColorblindMode(prev => {
      const next = !prev
      localStorage.setItem('colorblindMode', String(next))
      return next
    })
  }

  return {
    palette: getChartPalette(colorblindMode, isDark),
    colorblindMode,
    toggleColorblind,
  }
}
