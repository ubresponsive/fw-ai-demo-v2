'use client'

import type { ScriptNodes } from './types'

function getTrigrams(s: string): Set<string> {
  const t = new Set<string>()
  const padded = `  ${s} `
  for (let i = 0; i < padded.length - 2; i++) t.add(padded.slice(i, i + 3))
  return t
}

export function trigramSimilarity(a: string, b: string): number {
  const ta = getTrigrams(a)
  const tb = getTrigrams(b)
  let intersection = 0
  ta.forEach((t) => {
    if (tb.has(t)) intersection++
  })
  const union = ta.size + tb.size - intersection
  return union === 0 ? 0 : intersection / union
}

export function findBestMatch(
  input: string,
  nodes: ScriptNodes
): { nodeId: string; confidence: number } | null {
  const normalised = input.toLowerCase().trim()
  let best = { nodeId: '', confidence: 0 }

  for (const [nodeId, node] of Object.entries(nodes)) {
    for (const trigger of node.triggers) {
      // Exact match
      if (trigger.toLowerCase() === normalised) return { nodeId, confidence: 1.0 }
      // Contains match
      if (
        normalised.includes(trigger.toLowerCase()) ||
        trigger.toLowerCase().includes(normalised)
      ) {
        const score = 0.85
        if (score > best.confidence) best = { nodeId, confidence: score }
      }
      // Fuzzy match
      const score = trigramSimilarity(normalised, trigger.toLowerCase())
      if (score > best.confidence) best = { nodeId, confidence: score }
    }
  }

  return best.confidence >= 0.45 ? best : null
}
