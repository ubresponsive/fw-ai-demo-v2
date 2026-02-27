// ── AI Message & Conversation Types ──

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: number
  components?: ComponentConfig[]
  actions?: ActionConfig[]
  followUps?: string[]
  metadata?: {
    nodeId?: string
    confidence?: number
    source: 'script' | 'fallback' | 'quick-action'
  }
}

// Discriminated union for all renderable components
export type ComponentConfig =
  | { type: 'margin-chart' }
  | { type: 'stock-table' }
  | { type: 'customer-chart' }
  | { type: 'branch-chart' }
  | { type: 'branch-table' }
  | { type: 'insight'; severity: 'error' | 'warning' | 'success' | 'info'; text: string }
  | { type: 'confirm-card'; title: string; fields: ConfirmField[] }
  | { type: 'progress-steps'; steps: string[]; currentStep: number }
  | { type: 'ocr-grid' }
  | { type: 'matching-grid' }
  | { type: 'confirmation-table'; mode: 'products' | 'cross-sell' }
  | { type: 'cross-sell-cards' }
  | { type: 'summary-table'; lines: SummaryLine[] }
  | { type: 'processing-checklist'; items: string[] }

export interface ActionConfig {
  label: string
  targetNode?: string
  style: 'primary' | 'secondary' | 'danger'
  params?: Record<string, unknown>
  _isFollowUp?: boolean
}

export interface ConfirmField {
  label: string
  current: string
  new: string | null
  highlight?: boolean
}

// Script engine types
export interface ScriptNode {
  triggers: string[]
  response: {
    text: string
    components?: ComponentConfig[]
    actions?: ActionConfig[]
    followUps?: string[]
  }
}

export type ScriptNodes = Record<string, ScriptNode>

// ── SO 1098/0 Product Matching Types ──

export interface OCRItem {
  id: string
  description: string
  qty: number
  uom: string
}

export interface MatchedProduct {
  id: string
  customerDescription: string
  matchedProduct: string
  code: string
  qty: number
  uom: string
  confidence: number
  confidenceLabel: 'High' | 'Medium' | 'Low'
  prevOrdered: boolean
  stock: number
  price: number
  selected: boolean
  alternatives?: ProductAlternative[]
  specQuery?: SpecQuery
}

export interface ProductAlternative {
  id: string
  label: string
  product: string
  code: string
  packSize: string
  price: number
}

export interface SpecQuery {
  message: string
  defaultOption: string
  options: SpecOption[]
}

export interface SpecOption {
  label: string
  thickness: string
  code: string
  price: number
}

export interface CrossSellItem {
  id: string
  product: string
  code: string
  detail: string
  coPurchasePercent: number
  prevOrdered: boolean
  price: number
  unitPrice: number
  qty: number
  uom: string
  added: boolean
}

export interface ConfirmationItem {
  product: string
  code: string
  qty: number
  uom: string
  unitPrice: number
  lineTotal: number
}

export interface SummaryLine {
  ln: number
  product: string
  qty: number
  uom: string
  price: number
  total: number
}

// Order line for the SO 1098/0 page
export interface QuoteOrderLine {
  lineNumber: number
  productCode: string
  description: string
  qty: number
  uom: string
  sellPrice: number
  lineTotal: number
  isNew: boolean
  isCrossSell: boolean
}

// SO 436/0 data types
export interface OrderLineData {
  lineNumber: number
  productCode: string
  description: string
  qty: number
  unitCost: number
  sellPrice: number
  gpPercent: number
  lineTotal: number
}

export interface StockRow {
  productCode: string
  description: string
  onHand: number
  allocated: number
  available: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
}

export interface CustomerHistoryRow {
  month: string
  orders: number
  revenue: number
}

export interface BranchRevenueRow {
  branch: string
  revenue: number
  orders: number
  gp: number
}
