import type {
  AIMessage,
  ScriptNodes,
  OrderLineData,
  StockRow,
  CustomerHistoryRow,
  BranchRevenueRow,
} from '../types'

// ── Sample data (simulates page context) ──

export const ORDER_436_DATA = {
  orderNumber: '436/0',
  customer: { name: 'PrePaid Deliveries', id: '555555' },
  status: 'Order Complete',
  total: '$464.29',
  branch: '10 — Sydney Metro',
}

export const ORDER_436_LINES: OrderLineData[] = [
  { lineNumber: 1, productCode: '1381631', description: 'Compact Brass ¾" Pigtail', qty: 1, unitCost: 28.5, sellPrice: 32.5, gpPercent: 12.5, lineTotal: 32.5 },
  { lineNumber: 2, productCode: 'JMB3', description: 'LOCTITE 243® Thread-Lock™', qty: 5, unitCost: 6.12, sellPrice: 2.2, gpPercent: -206.1, lineTotal: 11.0 },
  { lineNumber: 3, productCode: 'TIM4520', description: 'Timber Pine DAR Dowel 12mm', qty: 12, unitCost: 10.25, sellPrice: 16.2, gpPercent: 37.1, lineTotal: 194.4 },
  { lineNumber: 4, productCode: 'CEM025', description: 'Cement GP 20kg Bag', qty: 8, unitCost: 8.5, sellPrice: 28.2, gpPercent: 34.7, lineTotal: 225.6 },
]

export const CUSTOMER_HISTORY_436: CustomerHistoryRow[] = [
  { month: 'Aug', orders: 12, revenue: 4200 },
  { month: 'Sep', orders: 15, revenue: 5100 },
  { month: 'Oct', orders: 11, revenue: 3800 },
  { month: 'Nov', orders: 18, revenue: 6200 },
  { month: 'Dec', orders: 22, revenue: 7500 },
  { month: 'Jan', orders: 16, revenue: 5800 },
]

export const STOCK_DATA_436: StockRow[] = [
  { productCode: '1381631', description: 'Compact Brass ¾" Pigtail', onHand: 45, allocated: 12, available: 33, status: 'In Stock' },
  { productCode: 'JMB3', description: 'LOCTITE 243® Thread-Lock™', onHand: 8, allocated: 5, available: 3, status: 'Low Stock' },
  { productCode: 'TIM4520', description: 'Timber Pine DAR Dowel 12mm', onHand: 120, allocated: 30, available: 90, status: 'In Stock' },
  { productCode: 'CEM025', description: 'Cement GP 20kg Bag', onHand: 0, allocated: 0, available: 0, status: 'Out of Stock' },
]

export const BRANCH_REVENUE_436: BranchRevenueRow[] = [
  { branch: 'Sydney Metro', revenue: 342188, orders: 487, gp: 34.2 },
  { branch: 'Melbourne', revenue: 298458, orders: 412, gp: 31.8 },
  { branch: 'Brisbane', revenue: 187320, orders: 298, gp: 35.1 },
  { branch: 'Adelaide', revenue: 124898, orders: 189, gp: 29.4 },
  { branch: 'Perth', revenue: 98768, orders: 156, gp: 32.7 },
]

// ── Script nodes ──

export const SO_436_SCRIPT_NODES: ScriptNodes = {
  'margin-breakdown': {
    triggers: [
      'show me the margin breakdown', 'margin analysis', 'what are the margins',
      'gp breakdown', 'show margins', 'margin breakdown for this order',
      'analyse margins', 'analyze margins',
    ],
    response: {
      text: `Here's the margin analysis for SO ${ORDER_436_DATA.orderNumber}:`,
      components: [
        { type: 'margin-chart' },
        { type: 'insight', severity: 'error', text: '**Line 2 (JMB3)** is selling at $2.20 against a unit cost of $6.12, resulting in a loss of $3.92 per unit ($19.60 total).' },
        { type: 'insight', severity: 'success', text: 'The other 3 lines average **28.1% GP**, within acceptable range.' },
      ],
      actions: [
        { label: 'Reprice JMB3 to breakeven ($6.12)', targetNode: 'reprice-breakeven', style: 'secondary' },
        { label: 'Reprice JMB3 to 15% GP ($7.20)', targetNode: 'reprice-15gp', style: 'primary' },
      ],
      followUps: ['Check stock for all items', 'Customer order history', 'Show payment status'],
    },
  },
  'reprice-15gp': {
    triggers: ['reprice jmb3 to 15', 'reprice line 2 to 15', 'reprice to 15% gp', 'set 15% margin'],
    response: {
      text: "I'll reprice line 2 (JMB3) to achieve a 15% gross profit margin.",
      components: [
        {
          type: 'confirm-card',
          title: 'Confirm Price Change',
          fields: [
            { label: 'Sell Price', current: '$2.20', new: '$7.20', highlight: true },
            { label: 'Line Total', current: '$11.00', new: '$36.00' },
            { label: 'GP%', current: '-206.1%', new: '15.0%', highlight: true },
          ],
        },
      ],
      actions: [],
      followUps: [],
    },
  },
  'reprice-breakeven': {
    triggers: ['reprice to breakeven', 'reprice jmb3 to breakeven', 'set to cost price'],
    response: {
      text: "I'll reprice line 2 (JMB3) to breakeven — matching the unit cost.",
      components: [
        {
          type: 'confirm-card',
          title: 'Confirm Price Change',
          fields: [
            { label: 'Sell Price', current: '$2.20', new: '$6.12', highlight: true },
            { label: 'Line Total', current: '$11.00', new: '$30.60' },
            { label: 'GP%', current: '-206.1%', new: '0.0%', highlight: true },
          ],
        },
      ],
      actions: [],
      followUps: [],
    },
  },
  'reprice-applied': {
    triggers: [],
    response: {
      text: 'Price change applied successfully. Line 2 (JMB3) has been updated.',
      components: [
        { type: 'insight', severity: 'success', text: '**JMB3** sell price updated to **$7.20** — GP is now **15.0%**. Order total adjusted to **$489.29** exc. GST.' },
      ],
      actions: [],
      followUps: ['Check stock for all items', 'Customer order history', 'Show updated margin breakdown'],
    },
  },
  'stock-check': {
    triggers: ['check stock', 'stock availability', 'check stock for all items', "what's in stock", 'stock levels', 'inventory check'],
    response: {
      text: `Stock availability for SO ${ORDER_436_DATA.orderNumber}:`,
      components: [{ type: 'stock-table' }],
      actions: [
        { label: 'Find alternative for CEM025', targetNode: 'find-alternative', style: 'primary' },
        { label: 'Create back order for CEM025', targetNode: 'back-order', style: 'secondary' },
      ],
      followUps: ['Show margin breakdown', 'Customer order history', 'Check delivery schedule'],
    },
  },
  'customer-history': {
    triggers: ['customer order history', 'customer history', 'customer trends', 'show me this customer', 'past orders', 'order history'],
    response: {
      text: `Order history for **${ORDER_436_DATA.customer.name}** (Cust ${ORDER_436_DATA.customer.id}) — last 6 months:`,
      components: [
        { type: 'customer-chart' },
        { type: 'insight', severity: 'info', text: 'This customer has placed **94 orders** over the last 6 months with average monthly revenue of **$5,433**. December was the peak month with 22 orders totalling $7,500.' },
      ],
      actions: [],
      followUps: ['Show margin breakdown', 'Check stock for all items', 'View outstanding invoices'],
    },
  },
  'revenue-by-branch': {
    triggers: ['revenue by branch', 'branch revenue', 'branch performance', 'show me revenue by branch', 'branch breakdown'],
    response: {
      text: "Here's the revenue breakdown by branch for January 2026:",
      components: [
        { type: 'branch-chart' },
        { type: 'branch-table' },
        { type: 'insight', severity: 'info', text: 'Total revenue across all branches: **$1,051,632** from **1,542 orders** with an average GP of **32.8%**.' },
      ],
      actions: [],
      followUps: ['Show top customers by branch', 'GP analysis by category', 'Monthly trend comparison'],
    },
  },
  'payment-status': {
    triggers: ['payment status', 'show payment status', 'is this paid', 'payment details', 'invoice status'],
    response: {
      text: `Payment status for SO ${ORDER_436_DATA.orderNumber}:`,
      components: [
        {
          type: 'confirm-card',
          title: 'Payment Summary',
          fields: [
            { label: 'Invoice Total', current: '$464.29', new: null },
            { label: 'Amount Paid', current: '$464.29', new: null },
            { label: 'Balance', current: '$0.00', new: null },
            { label: 'Status', current: 'Paid in Full', new: null, highlight: true },
          ],
        },
        { type: 'insight', severity: 'success', text: 'Payment was received on **12 Jan 2026** via EFT. Invoice #INV-2026-0891.' },
      ],
      actions: [],
      followUps: ['Customer order history', 'Show margin breakdown', 'View credit terms'],
    },
  },
}

// ── Initial message ──

export const SO_436_INITIAL_MESSAGE: AIMessage = {
  id: 'initial-436',
  role: 'assistant',
  text: `You're viewing **SO ${ORDER_436_DATA.orderNumber}** for ${ORDER_436_DATA.customer.name} (Cust ${ORDER_436_DATA.customer.id}). There are ${ORDER_436_LINES.length} order lines totalling **${ORDER_436_DATA.total}** exc. GST.`,
  components: [
    { type: 'insight', severity: 'warning', text: 'Line 2 has a negative GP of -206.1% — selling below cost.' },
  ],
  actions: [],
  followUps: ['Show margin breakdown', 'Check stock for all items', 'Customer order history', 'Payment status'],
  timestamp: Date.now(),
  metadata: { source: 'script' },
}

export const DEMO_STEPS_436 = ['Review Order', 'Analyse Margins', 'Reprice', 'Verify Stock', 'Review']
