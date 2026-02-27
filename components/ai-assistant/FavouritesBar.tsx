'use client'

interface FavouritesBarProps {
  favourites: string[]
  onSelect: (label: string) => void
  onRemove: (label: string) => void
}

export function FavouritesBar({
  favourites,
  onSelect,
  onRemove,
}: FavouritesBarProps) {
  if (!favourites.length) return null

  return (
    <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700 flex gap-1.5 flex-wrap items-center">
      <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
        Favourites
      </span>
      {favourites.map((f, i) => (
        <div key={i} className="flex items-center gap-0.5">
          <button
            onClick={() => onSelect(f)}
            className="px-2.5 py-1 rounded-full text-xs border border-tertiary-500/30 bg-tertiary-500/10 text-tertiary-600 dark:text-tertiary-400 font-medium hover:bg-tertiary-500/20 transition-colors"
          >
            ★ {f}
          </button>
          <button
            onClick={() => onRemove(f)}
            className="text-gray-400 dark:text-slate-500 text-sm hover:text-gray-600 dark:hover:text-slate-300 px-0.5 leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
