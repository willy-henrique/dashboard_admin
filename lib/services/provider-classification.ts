import type { FirebaseProvider } from '@/lib/services/firebase-providers'

export const UNCATEGORIZED_LABEL = 'Sem categoria'

/** Chave interna para prestadores sem nenhuma especialidade (não confundir com categoria homônima). */
const UNCATEGORIZED_KEY = '__sem_especialidade__'

/** Agrupa rótulos equivalentes (acentos, caixa, espaços) para totais mais fiéis ao negócio. */
export function canonicalCategoryKey(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

function pickDisplayName(votes: Map<string, number>): string {
  let best = ''
  let bestCount = -1
  for (const [name, count] of votes) {
    if (count > bestCount || (count === bestCount && name.length > best.length)) {
      best = name
      bestCount = count
    }
  }
  return best || '—'
}

export interface ClassificationRow {
  /** Chave estável para React (canonical ou especial para "sem categoria") */
  rowKey: string
  /** Nome exibido (variação mais frequente entre prestadores) */
  category: string
  count: number
  /** % dos prestadores do conjunto filtrado que possuem esta categoria */
  percentOfProviders: number
}

function categoriesForProvider(provider: FirebaseProvider): string[] {
  const raw = provider.especialidades || []
  return [...new Set(raw.map((c) => String(c).trim()).filter(Boolean))]
}

/**
 * Conta prestadores por categoria (um prestador com 3 categorias incrementa 3 linhas).
 * Unifica rótulos pela chave canônica para evitar duplicar "Eletricista" / "eletricista".
 */
export function aggregateByCategory(providers: FirebaseProvider[]): {
  rows: ClassificationRow[]
  totalProviders: number
} {
  if (providers.length === 0) {
    return { rows: [], totalProviders: 0 }
  }

  const totalProviders = providers.length

  // canonical -> { count, displayVotes }
  const bucket = new Map<
    string,
    { count: number; displayVotes: Map<string, number> }
  >()

  const bump = (canonical: string, display: string, delta: number) => {
    let entry = bucket.get(canonical)
    if (!entry) {
      entry = { count: 0, displayVotes: new Map() }
      bucket.set(canonical, entry)
    }
    entry.count += delta
    const prev = entry.displayVotes.get(display) ?? 0
    entry.displayVotes.set(display, prev + delta)
  }

  for (const p of providers) {
    const cats = categoriesForProvider(p)
    if (cats.length === 0) {
      bump(UNCATEGORIZED_KEY, UNCATEGORIZED_LABEL, 1)
    } else {
      const seen = new Set<string>()
      for (const c of cats) {
        const key = canonicalCategoryKey(c)
        if (seen.has(key)) continue
        seen.add(key)
        bump(key, c.trim(), 1)
      }
    }
  }

  const rows: ClassificationRow[] = [...bucket.entries()].map(([canonical, data]) => {
    const category =
      canonical === UNCATEGORIZED_KEY
        ? UNCATEGORIZED_LABEL
        : pickDisplayName(data.displayVotes)
    const percentOfProviders =
      Math.round((data.count / totalProviders) * 1000) / 10
    return {
      rowKey: canonical === UNCATEGORIZED_KEY ? UNCATEGORIZED_KEY : canonical,
      category,
      count: data.count,
      percentOfProviders,
    }
  })

  rows.sort((a, b) => {
    if (a.category === UNCATEGORIZED_LABEL) return 1
    if (b.category === UNCATEGORIZED_LABEL) return -1
    return b.count - a.count || a.category.localeCompare(b.category, 'pt-BR')
  })

  return { rows, totalProviders }
}
