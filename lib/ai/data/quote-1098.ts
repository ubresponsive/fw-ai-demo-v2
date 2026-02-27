import type {
  OCRItem,
  MatchedProduct,
  ProductAlternative,
  SpecOption,
  CrossSellItem,
  QuoteOrderLine,
} from '../types'

// ── Page header context ──

export const QUOTE_1098_HEADER = {
  orderNumber: '1098/0',
  type: 'Sales Quote',
  status: 'Entry Incomplete',
  customer: { name: 'CJ Constructions Pty Ltd', id: '29468' },
  salesRep: 'Steve the Salesman',
  branch: '10 — Sterland Plumbing',
  despatchMethod: 'Delivery',
  dateRequired: '15/03/2026',
}

// ── OCR results (Step 5) ──

export const OCR_ITEMS_DEFAULT: OCRItem[] = [
  { id: '1', description: 'Ply 2400x1200x17mm', qty: 12, uom: 'SHT' },
  { id: '2', description: 'Concrete mix 20kg', qty: 4, uom: 'BAG' },
  { id: '3', description: 'Pine 90x45 4.8m', qty: 10, uom: 'LM' },
  { id: '4', description: '75mm galv nails', qty: 1, uom: 'BOX' },
  { id: '5', description: 'Silicone clear', qty: 6, uom: 'EA' },
  { id: '6', description: 'Villaboard 2400x1200', qty: 2, uom: 'SHT' },
]

// ── UOM options ──

export const UOM_OPTIONS = ['EA', 'SHT', 'BAG', 'LM', 'BOX', 'MTR', 'KG', 'LTR', 'PKT', 'SET']

// ── Matched products (Step 7) ──

export const MATCHED_PRODUCTS_DEFAULT: MatchedProduct[] = [
  {
    id: '1',
    customerDescription: 'Ply 2400x1200x17mm',
    matchedProduct: 'Structural Plywood 2400x1200x17mm CD',
    code: 'PLY-STR-17-2412',
    qty: 12,
    uom: 'SHT',
    confidence: 95,
    confidenceLabel: 'High',
    prevOrdered: true,
    stock: 34,
    price: 68.40,
    selected: true,
  },
  {
    id: '2',
    customerDescription: 'Concrete mix 20kg',
    matchedProduct: 'Rapid Set Concrete 20kg',
    code: 'CONC-RS-20KG',
    qty: 4,
    uom: 'BAG',
    confidence: 90,
    confidenceLabel: 'High',
    prevOrdered: false,
    stock: 120,
    price: 9.85,
    selected: true,
  },
  {
    id: '3',
    customerDescription: 'Pine 90x45 4.8m',
    matchedProduct: 'Treated Pine 90x45mm 4.8m MGP10',
    code: 'PINE-T-9045-48',
    qty: 10,
    uom: 'LM',
    confidence: 92,
    confidenceLabel: 'High',
    prevOrdered: true,
    stock: 28,
    price: 14.20,
    selected: true,
  },
  {
    id: '4',
    customerDescription: '75mm galv nails',
    matchedProduct: '',
    code: '',
    qty: 1,
    uom: 'BOX',
    confidence: 30,
    confidenceLabel: 'Low',
    prevOrdered: false,
    stock: 0,
    price: 0,
    selected: false,
    alternatives: [
      { id: 'a', label: 'A', product: 'Gal Bullet Head Nails 75x3.75mm 5kg', code: 'NAIL-BH-75-5KG', packSize: '5kg box', price: 38.50 },
      { id: 'b', label: 'B', product: 'Gal Flat Head Nails 75x3.75mm 2kg', code: 'NAIL-FH-75-2KG', packSize: '2kg box', price: 18.20 },
      { id: 'c', label: 'C', product: 'Gal Clout Nails 75x3.75mm 5kg', code: 'NAIL-CL-75-5KG', packSize: '5kg box', price: 41.00 },
    ],
  },
  {
    id: '5',
    customerDescription: 'Silicone clear',
    matchedProduct: 'Silicone Sealant Clear 300ml',
    code: 'SEAL-SIL-CLR-300',
    qty: 6,
    uom: 'EA',
    confidence: 88,
    confidenceLabel: 'High',
    prevOrdered: false,
    stock: 45,
    price: 8.90,
    selected: true,
  },
  {
    id: '6',
    customerDescription: 'Villaboard 2400x1200',
    matchedProduct: 'Villaboard 2400x1200x6mm',
    code: 'VB-2412-6',
    qty: 2,
    uom: 'SHT',
    confidence: 72,
    confidenceLabel: 'Medium',
    prevOrdered: false,
    stock: 18,
    price: 42.50,
    selected: true,
    specQuery: {
      message: 'Thickness not specified — matched to **6mm** (CJ Constructions\' last order).',
      defaultOption: '6mm',
      options: [
        { label: '6mm', thickness: '6mm', code: 'VB-2412-6', price: 42.50 },
        { label: '9mm', thickness: '9mm', code: 'VB-2412-9', price: 51.20 },
        { label: '12mm', thickness: '12mm', code: 'VB-2412-12', price: 62.80 },
      ],
    },
  },
]

// ── Cross-sell recommendations (Step 10) ──

export const CROSS_SELL_ITEMS_DEFAULT: CrossSellItem[] = [
  {
    id: 'cs1',
    product: 'Liquid Nails Construction Adhesive 375ml x 4',
    code: 'LN-CONST-375-4',
    detail: '82% co-purchase with villaboard.',
    coPurchasePercent: 82,
    prevOrdered: true,
    price: 31.20,
    unitPrice: 7.80,
    qty: 4,
    uom: 'EA',
    added: false,
  },
  {
    id: 'cs2',
    product: 'Villaboard Screws 25mm (Box 1000)',
    code: 'VB-SCR-25-1000',
    detail: '76% co-purchase. Needed for fixing villaboard to framing.',
    coPurchasePercent: 76,
    prevOrdered: false,
    price: 28.90,
    unitPrice: 28.90,
    qty: 1,
    uom: 'BOX',
    added: false,
  },
  {
    id: 'cs3',
    product: 'Acrylic Gap Filler White 450g x 4',
    code: 'GAP-ACR-WHT-450-4',
    detail: '64% co-purchase. Villaboard joins.',
    coPurchasePercent: 64,
    prevOrdered: false,
    price: 24.80,
    unitPrice: 6.20,
    qty: 4,
    uom: 'EA',
    added: false,
  },
]

// ── Helper to build order lines from matched products ──

export function buildOrderLinesFromProducts(products: MatchedProduct[]): QuoteOrderLine[] {
  return products.map((p, i) => ({
    lineNumber: i + 1,
    productCode: p.code,
    description: p.matchedProduct,
    qty: p.qty,
    uom: p.uom,
    sellPrice: p.price,
    lineTotal: p.qty * p.price,
    isNew: true,
    isCrossSell: false,
  }))
}

export function buildOrderLinesFromCrossSells(
  crossSells: CrossSellItem[],
  startLineNumber: number
): QuoteOrderLine[] {
  return crossSells.map((cs, i) => ({
    lineNumber: startLineNumber + i,
    productCode: cs.code,
    description: cs.product,
    qty: cs.qty,
    uom: cs.uom,
    sellPrice: cs.unitPrice,
    lineTotal: cs.price,
    isNew: true,
    isCrossSell: true,
  }))
}

// ── Processing checklist items ──

export const CATALOGUE_SEARCH_STEPS = [
  'Searching catalogue...',
  'Checking customer purchase history...',
  'Verifying stock availability...',
  'Retrieving customer pricing...',
]

// ── Agent messages ──

export const AGENT_MESSAGES = {
  step2: 'How can I help you find products for this quote? I can search the catalogue by description, match from a list, or look at what CJ Constructions has ordered before.\n\nWhat are you working with?',
  step3: "Upload the list and I'll match each item against our catalogue. I'll show you:\n\n- **Matched products** with a confidence level\n- **Alternatives** where there's no direct match\n- **Customer history** — I'll prioritise products CJ Constructions has ordered before\n\nYou can review everything before I add anything to the quote.\n\nPhoto, scan, or PDF all work — go ahead and upload.",
  step4reading: 'Reading your list...',
  step5: "I've read 6 items from your list. Review what I've captured — you can edit descriptions, quantities, or UOM before I search the catalogue.",
  step6: "Searching the catalogue and checking CJ Constructions' purchase history for all 6 items...",
  step7: 'Matched 6 items — **4 high confidence**, **1 needs selection**, **1 specification query**.',
  step8: "Here's what I'll add to the quote. You can adjust quantities before confirming:",
  step9processing: 'Adding products to quote...',
  step9success: (total: string) =>
    `All 6 products added to quote SO 1098/0. Subtotal: **${total}** (ex GST). The lines are now visible in Order Entry.`,
  step10: "Looking at this order — plywood, pine framing, villaboard, and concrete — this looks like a **framing and lining job**. A few things that typically go with this combination:",
  step11: "I'll add these items to the quote. You can adjust quantities before confirming:",
  step12processing: 'Adding items to quote...',
  step12success: (total: string, lineCount: number) =>
    `Added 2 items. Updated total: **${total}** (ex GST) — ${lineCount} line items on the quote.\n\nIs there anything else you need for this quote?`,
  redirectToUpload: "I can help with that — do you have a list to upload, or would you like to search for specific products?",
  comingSoon: 'This feature is coming soon — try "Help me find products" for the demo.',
  followUpPlaceholder: 'This feature is coming soon in the full release.',
}

// ── Keywords that advance from Step 2 to Step 3 ──

export const UPLOAD_KEYWORDS = [
  'list', 'handwritten', 'scan', 'upload', 'photo', 'image', 'document', 'customer list', 'written', 'paper', 'note',
]
