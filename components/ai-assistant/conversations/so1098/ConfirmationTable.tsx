'use client'

interface ConfirmationItem {
  product: string
  code: string
  qty: number
  uom: string
  unitPrice: number
  lineTotal: number
}

interface ConfirmationTableProps {
  items: ConfirmationItem[]
  onQtyChange: (index: number, qty: number) => void
  onConfirm: () => void
  onGoBack: () => void
  mode: 'products' | 'cross-sell'
}

export function ConfirmationTable({
  items,
  onQtyChange,
  onConfirm,
  onGoBack,
  mode,
}: ConfirmationTableProps) {
  const grandTotal = items.reduce((sum, i) => sum + i.lineTotal, 0)

  return (
    <div className="my-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_50px_45px_65px_70px] gap-1 px-3 py-2 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600 text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
        <div>Product</div>
        <div className="text-center">Qty</div>
        <div className="text-center">UOM</div>
        <div className="text-right">Unit $</div>
        <div className="text-right">Line $</div>
      </div>

      {/* Rows */}
      {items.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_50px_45px_65px_70px] gap-1 px-3 py-1.5 border-b border-gray-100 dark:border-slate-700 items-center"
        >
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-gray-800 dark:text-slate-200 truncate">
              {item.product}
            </div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">
              {item.code}
            </div>
          </div>
          <input
            type="number"
            value={item.qty}
            min={1}
            onChange={(e) => onQtyChange(i, Math.max(1, Number(e.target.value)))}
            className="w-full text-[12px] px-1.5 py-1 rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 text-center focus:outline-none focus:border-tertiary-400"
          />
          <div className="text-center text-[11px] text-gray-500 dark:text-slate-400">
            {item.uom}
          </div>
          <div className="text-right text-[12px] text-gray-600 dark:text-slate-300">
            ${item.unitPrice.toFixed(2)}
          </div>
          <div className="text-right text-[12px] font-medium text-gray-800 dark:text-slate-200">
            ${item.lineTotal.toFixed(2)}
          </div>
        </div>
      ))}

      {/* Totals */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600">
        <div className="text-[12px] font-semibold text-gray-600 dark:text-slate-300">
          Subtotal ({items.length} items)
        </div>
        <div className="text-[14px] font-bold text-gray-900 dark:text-slate-100">
          ${grandTotal.toFixed(2)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <button
          onClick={onGoBack}
          className="px-3 py-1.5 rounded-lg text-[13px] font-medium border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          {mode === 'products' ? 'Go Back & Edit' : 'Cancel'}
        </button>
        <button
          onClick={onConfirm}
          className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-tertiary-600 text-white hover:bg-tertiary-700 transition-colors"
        >
          Confirm & Add to Quote
        </button>
      </div>
    </div>
  )
}
