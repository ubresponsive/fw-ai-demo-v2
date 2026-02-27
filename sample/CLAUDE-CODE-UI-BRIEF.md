# UI Alignment Brief: Sales Orders — Figma Design Integration

## Role

You are a senior UX specialist and frontend developer creating an excellent user experience for customers using the Frameworks ERP application. You will leverage the existing Tailwind CSS components and adapt them to better align with the approved Figma designs, while maintaining a modern, polished look and feel. The goal is not a pixel-perfect Figma replica — it is a thoughtful blend that takes the best layout and structural decisions from the Figma and applies them within our modern Tailwind component system.

## Context

- **Stack:** Next.js 15 + TypeScript + Tailwind CSS + Headless UI + Heroicons + TanStack Table
- **Figma reference:** The DMSI Agility Sales Order design (see `salesorderv2-figma.png` in project root or `/docs`)
- **Current app:** Live at `https://fw-ai-demo.vercel.app/` — Sales Orders list and Sales Order detail pages
- **Scope:** Sales Order List page (`/sales-orders`) and Sales Order Detail page (`/sales-orders/[id]`) only. Do not modify other pages, the sidebar, or the global header in this pass.

## Phase 0: Design Tokens / Theme Config

Before touching any components, create a shared theme configuration file that all components will reference. This ensures consistency and makes future theming/white-labelling straightforward.

### Create `lib/theme.ts`

```typescript
// Design tokens derived from Figma blue/grey palette
export const theme = {
  colors: {
    // Primary palette (from Figma)
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Primary blue — buttons, links, active states
      600: '#2563eb',  // Primary blue hover
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a5f',  // Dark blue — headings, header bar
    },
    // Neutrals (from Figma grey tones)
    neutral: {
      50: '#f8fafc',   // Page background
      100: '#f1f5f9',  // Card alt background, table striping
      200: '#e2e8f0',  // Borders, dividers
      300: '#cbd5e1',  // Disabled states, muted borders
      400: '#94a3b8',  // Placeholder text, icons
      500: '#64748b',  // Secondary text, labels
      600: '#475569',  // Body text
      700: '#334155',  // Strong body text
      800: '#1e293b',  // Headings
      900: '#0f172a',  // Primary text
    },
    // Semantic / status colours (keep from current app — these work well)
    success: '#16a34a',
    warning: '#eab308',
    danger: '#dc2626',
    info: '#0284c7',
    // GP% thresholds (keep — these are excellent UX)
    gp: {
      negative: '#dc2626',   // Red — below 0%
      low: '#eab308',        // Amber — 0-15%
      acceptable: '#16a34a', // Green — 15%+
      good: '#059669',       // Dark green — 30%+
    },
    // Accent (for AI features, interactive highlights)
    accent: '#0d9488',  // Teal — AI assistant, special actions
  },
  spacing: {
    page: '24px',       // Page-level padding
    card: '20px',       // Internal card padding
    section: '16px',    // Section gaps
    field: '12px',      // Between form fields
    compact: '8px',     // Tight spacing
  },
  radius: {
    card: '8px',        // Card containers
    button: '6px',      // Buttons
    badge: '4px',       // Status badges
    input: '6px',       // Form inputs
    full: '9999px',     // Pills
  },
  shadow: {
    card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    cardHover: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)',
    dropdown: '0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)',
  },
  font: {
    heading: 'font-semibold text-neutral-800',
    body: 'text-neutral-600',
    label: 'text-xs font-medium text-neutral-500 uppercase tracking-wide',
    value: 'text-sm font-medium text-neutral-800',
  },
} as const;
```

Also update `tailwind.config.ts` to extend the colour palette with these tokens so they're available as Tailwind classes (e.g. `bg-primary-500`, `text-neutral-600`).

## Phase 1: Cherry-Picked Figma Elements

### 1. Tab Design — Underline Style

**Current:** Tabs use icons + text + count badges in a horizontal row with background highlights on active tab.

**Target (from Figma):** Clean underline tabs. Text-only labels, no icons. Active tab has a 2px bottom border in `primary-500`. Inactive tabs are `neutral-500` text with hover state.

**Implementation:**
- Remove icons from tab labels on the Sales Order detail page
- Use a simple `border-b-2 border-transparent` base, with `border-primary-500 text-primary-700 font-medium` for active state
- Inactive: `text-neutral-500 hover:text-neutral-700 hover:border-neutral-300`
- Maintain the count badge on "Order Lines" tab but style it as a small `bg-neutral-100 text-neutral-600 text-xs rounded-full px-2 py-0.5` inline with the label — subtle, not prominent
- Tab bar sits on a `border-b border-neutral-200` divider line
- The Figma shows tabs like: `Sales Order | Picks & Shipments | Shipping Information | Payments | Related Transactions | Notes (0) | Messages (0) | More`
- Map to our existing tabs: `Order Lines (4) | Delivery Details | Header | Diary Notes | Messages | Tasks`

**Reference Figma pattern:**
```
[Sales Order]  Picks & Shipments  Shipping Information  Payments  ...
─────────────────────────────────────────────────────────────────────
  ^^^^ active (blue underline + blue text)
```

### 2. Card Containers with Subtle Shadows

**Current:** Sections use flat backgrounds with border separators or no containment at all.

**Target (from Figma):** Distinct card containers with white background, subtle shadow, and rounded corners. Each logical section (order header, tabs, line items table) is wrapped in its own card.

**Implementation:**
- Create a reusable `<Card>` component: `bg-white rounded-lg shadow-card p-5` (using theme shadow token)
- Order header info → wrapped in a Card
- Tab content area → wrapped in a Card (tabs sit on top of the card, content inside)
- On the Sales Order list page, the stats cards at top and the filter bar + table should each be in their own Card
- Cards should have `hover:shadow-cardHover transition-shadow` only where they're clickable (e.g. list rows)
- Gap between cards: `space-y-4` (16px)
- Do NOT over-card — the page itself should remain `bg-neutral-50` and cards provide the visual separation

### 3. Order Header — Horizontal Field Layout

**Current:** The order header shows Customer, Cust Order #, Sales Rep, Branch, Despatch Method, Date Required in a horizontal row with labels above values. This is close to the Figma but needs refinement.

**Target (from Figma):** A cleaner horizontal field grid inside a Card. Fields arranged in an evenly spaced row. Labels are smaller, muted (`text-xs font-medium text-neutral-500 uppercase tracking-wide`). Values are `text-sm font-medium text-neutral-800`. Fields separated by subtle vertical dividers or generous spacing rather than borders.

**Implementation:**
- Wrap in a Card component
- Use a CSS grid: `grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-4`
- Each field: label on top (small, muted, uppercase), value below (medium weight, dark)
- The order number + title (`SO 436/0`) remains prominent at the top of the card as a heading: `text-xl font-semibold text-neutral-900`
- Status badges remain as pills but use more muted styling: `text-xs font-medium px-2.5 py-1 rounded` with background colours at 10% opacity (e.g. `bg-green-50 text-green-700 ring-1 ring-green-200`)
- The customer name should be a link styled `text-primary-600 hover:text-primary-700 hover:underline`
- Keep the alert banner ("$15.00 still to be paid") but style it with a left border accent: `border-l-4 border-warning bg-yellow-50 px-4 py-3 rounded-r-md`

## Phase 2: Sales Order List Page

### Stats Cards Row
- Wrap each stat in a Card with subtle shadow
- Keep sparkline trends — these are a strong differentiator from the Figma and should stay
- Use the new neutral palette: labels in `text-neutral-500`, values in `text-neutral-900 font-semibold`
- Trend indicators: green for positive, red for negative, using `text-success` / `text-danger`

### Filter Bar
- Contained within a Card
- Search input: `border-neutral-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 rounded-md`
- Dropdowns: consistent with input styling
- Active filters should show as removable chips/pills

### Data Table
- Contained within the same Card as the filter bar (or a separate Card directly below with no gap)
- Table header: `bg-neutral-50 text-xs font-medium text-neutral-500 uppercase tracking-wide`
- Table rows: white background, `hover:bg-neutral-50` on hover, `border-b border-neutral-100`
- Status column: use the same muted pill badges as the order detail
- Order number column: styled as a link `text-primary-600 hover:text-primary-700 font-medium`
- Footer row: `bg-neutral-50 font-semibold border-t border-neutral-200`

## Phase 3: Sales Order Detail Page

Apply all Phase 1 elements (tabs, cards, header layout) plus:

### Order Lines Table
- Table header matches the Figma: `bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500`
- Product code column: `text-primary-600 hover:text-primary-700 font-medium` (link style)
- GP% column: keep the colour-coded values — this is better UX than the Figma (which has plain GM%). Use `text-gp-negative`, `text-gp-low`, `text-gp-acceptable`, `text-gp-good` from theme tokens
- Alternate row striping: `even:bg-neutral-50` (very subtle, matching Figma)
- Quick Add row: style inputs to match the Figma's Item Entry section — inline fields with labels above, consistent border/focus states

### Totals Footer Bar
- Keep the current bottom bar with calculated totals
- Style as a sticky footer: `bg-white border-t border-neutral-200 px-6 py-3`
- Values: `text-sm font-medium text-neutral-700`
- Negative values: `text-danger font-semibold`
- Action buttons (Save, Cancel, Close): right-aligned, matching Figma's button bar pattern
- Primary action (Save): `bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium shadow-sm`
- Secondary actions: `bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-4 py-2 rounded-md font-medium`

## Do NOT Change

- **Sidebar navigation** — keep as-is, out of scope
- **Global header/toolbar** — keep as-is
- **AI Assistant drawer** — keep the teal accent colour for AI features
- **Dark mode** — maintain dark mode compatibility (test that all new tokens work in both modes)
- **Responsive behaviour** — must remain fully responsive
- **TanStack Table functionality** — sorting, filtering, column controls must all still work
- **GP% colour coding** — keep this, it's superior to the Figma's plain text approach

## Implementation Order

1. Create `lib/theme.ts` and update `tailwind.config.ts` with new colour tokens
2. Create reusable `<Card>` wrapper component
3. Create reusable `<Tabs>` component with underline style
4. Create reusable `<FieldGrid>` component for horizontal label/value layouts
5. Refactor Sales Order Detail page — header card, tabs, order lines table
6. Refactor Sales Order List page — stats cards, filter bar, data table
7. Test responsive behaviour at mobile, tablet, desktop breakpoints
8. Verify dark mode compatibility
9. Run a visual diff — screenshot before/after for review

## Quality Checklist

- [ ] All interactive elements have visible focus states (`focus:ring-2 focus:ring-primary-500/20`)
- [ ] No hardcoded colours — everything uses theme tokens or Tailwind config
- [ ] Card shadows are consistent across all usages
- [ ] Tab underline animation is smooth (`transition-colors duration-150`)
- [ ] Table headers are consistently styled across both pages
- [ ] Status badges use the same component/styling on both pages
- [ ] No visual regression on the AI Assistant button/drawer
- [ ] Page loads feel clean — no flash of unstyled content
- [ ] Typography hierarchy is clear: page title > section heading > field label > body text
