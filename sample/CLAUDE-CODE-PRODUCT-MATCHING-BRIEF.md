# AI Agent Brief: Product List Matching Workflow

## Role

You are a senior UX specialist and frontend developer building an AI-powered product matching workflow for the Frameworks ERP demo application. This workflow lives inside the existing AI Assistant drawer on a new Sales Order detail page. You will use the existing Tailwind component patterns, drawer component, and page layout already established in the app. The goal is a compelling, interactive demo that shows how an AI agent can take a scanned handwritten product list, match items to the catalogue, and push confirmed lines onto a sales quote — all from the side panel conversation.

## Context

- **Stack:** Next.js 15 + TypeScript + Tailwind CSS + Headless UI + Heroicons + TanStack Table
- **Existing app:** `https://fw-ai-demo.vercel.app/` — the SO detail page at `/sales-orders/436-0` already has an AI Assistant drawer. Use that drawer component and page layout as the foundation.
- **Workflow spec:** See `Mode2_Product_List_Matching_Workflow_v2.md` for the full 12-step conversational flow, data shapes, and UX decisions.
- **HTML prototype:** See `AI_Agent_Interface_v6.html` for reference on step progression logic. Ignore the visual styling — use Tailwind components instead.
- **This is a prototype.** No real API calls, no real OCR, no real ERP writes. All data is sample/scripted. But the interaction patterns must feel real and polished.

---

## What to Build

### 1. New Route: `/sales-orders/1098-0`

Create a new Sales Order detail page for quote **SO 1098/0**. This page uses the same layout as the existing SO detail page (`/sales-orders/[id]`) but represents an **empty quote** (no order lines yet).

**Page header context:**

| Field | Value |
|-------|-------|
| Order Number | SO 1098/0 |
| Type | Sales Quote |
| Status | Entry Incomplete (single badge, muted) |
| Customer | CJ Constructions Pty Ltd (29468) |
| Sales Rep | Steve the Salesman |
| Branch | 10 — Sterland Plumbing |
| Despatch Method | Delivery |
| Date Required | 15/03/2026 |

**Order Lines tab:** Starts empty with an empty state message ("No items on this quote yet"). The TanStack table structure should be present with column headers (LN, Product, Description, Qty, UOM, Sell Price, Total, GP%) but no rows. The Quick Add row should be visible above the table.

**Footer totals bar:** Shows `$0.00` for all values initially.

**AI Assistant button:** Present in the header (same position as existing page), triggers the drawer.

**Key behaviour:** As the AI workflow progresses and products are confirmed, the order lines table must update reactively — new rows appear with a brief green highlight animation, totals update, and the line count refreshes. This is the core "wow factor" — the user sees the form populate in real time as the agent works.

### 2. AI Drawer: Product Matching Conversation

The existing AI Assistant drawer component opens from the right side. For this page, the drawer runs a different conversation flow — the Product List Matching workflow.

#### Drawer Header

**Context bar** (below the drawer title, above the chat area):

```
Customer: CJ Constructions (29468) | Branch: 10 — Sterland Plumbing | Quote: SO 1098/0 | Lines: 0
```

The `Lines: 0` count must update reactively as products are added to the quote (0 → 6 → 8).

#### Conversation Flow

The conversation uses a **hybrid approach**: scripted steps with streaming text delivery and real text input between key steps. The user can type messages at steps 2-4 or click starter prompts / quick actions at decision points.

**Streaming text:** All agent messages stream word-by-word (same streaming engine as the existing demo). Typing indicator (animated dots) shows during the processing delay before each agent response.

**Step progression:** After each agent response completes streaming, interactive elements (grids, buttons, follow-ups) appear with a subtle fade-in animation.

Here is the full step-by-step flow. Implement every step.

---

#### STEP 1: Initial State (Drawer Opens)

Agent shows starter prompts as clickable cards (not chat bubbles):

| Prompt | Icon | Description |
|--------|------|-------------|
| Help me find products | Search icon | Search and match products to add to the quote |
| Reorder from history | List icon | Show this customer's previous orders for quick re-add |
| Check stock availability | Package icon | Check inventory across branches for specific products |
| Review pricing | Dollar icon | Check customer-specific pricing for products |

Layout: 2x2 grid of cards. Each card has an icon, title, and one-line description. Clicking any card except "Help me find products" shows a placeholder message ("This feature is coming soon — try 'Help me find products' for the demo"). Only "Help me find products" advances the flow.

---

#### STEP 2: User Clicks "Help me find products"

The clicked prompt appears as a user message bubble. Agent streams:

> "How can I help you find products for this quote? I can search the catalogue by description, match from a list, or look at what CJ Constructions has ordered before.
>
> What are you working with?"

**Input state:** Text input is active. The user should type something about having a handwritten list. Any input containing keywords like "list", "handwritten", "scan", "upload", "photo", "image", "document", "customer list" advances to Step 3. Non-matching input gets a gentle redirect: "I can help with that — do you have a list to upload, or would you like to search for specific products?"

---

#### STEP 3: User Describes the Task

User's message appears as a chat bubble. Agent streams:

> "Upload the list and I'll match each item against our catalogue. I'll show you:
>
> - **Matched products** with a confidence level
> - **Alternatives** where there's no direct match
> - **Customer history** — I'll prioritise products CJ Constructions has ordered before
>
> You can review everything before I add anything to the quote.
>
> Photo, scan, or PDF all work — go ahead and upload."

After streaming completes, the chat input area transforms to show a file upload zone:

- A dashed-border drop zone with an upload icon and text: "Drop file here or click to upload"
- Accepts click to trigger (simulated) file selection
- Accepts drag-and-drop gesture (visual feedback on dragover)
- When the user clicks or drops, simulate a brief upload: show filename "customer_product_list.jpg" with a progress bar that fills over ~1 second, then a thumbnail preview of the "uploaded" image

**The uploaded image:** Use a placeholder image or a simple visual representing a handwritten list. This can be a styled div that looks like a scanned note with the 6 items listed in a handwriting-style font, or just a generic document thumbnail. The point is visual feedback that a file was received.

---

#### STEP 4: File Upload Triggers OCR

After the simulated upload completes, show a processing state:

Agent streams: "Reading your list..." with a brief animated indicator.

Then the agent presents the **OCR Confirmation Grid** — this is a critical interactive component.

---

#### STEP 5: OCR Confirmation Grid

Agent message (streamed):

> "I've read 6 items from your list. Review what I've captured — you can edit descriptions, quantities, or UOM before I search the catalogue."

**Below the message, render an editable grid component:**

| # | Description (as read) | Qty | UOM |  |
|---|----------------------|-----|-----|---|
| 1 | Ply 2400x1200x17mm | 12 | SHT | x |
| 2 | Concrete mix 20kg | 4 | BAG | x |
| 3 | Pine 90x45 4.8m | 10 | LM | x |
| 4 | 75mm galv nails | 1 | BOX | x |
| 5 | Silicone clear | 6 | EA | x |
| 6 | Villaboard 2400x1200 | 2 | SHT | x |

**Grid features:**
- Description column: editable text input (full width, no border by default, border on focus)
- Qty column: editable number input (narrow, centered)
- UOM column: dropdown select with options: EA, SHT, BAG, LM, BOX, MTR, KG, LTR, PKT, SET
- Remove button (x): removes the row with a fade-out animation
- **"+ Add Row"** button below the grid: adds a blank row for manual additions
- **"Search Catalogue"** button: primary action button below the grid, full width, prominent
- Grid is styled as a card with subtle borders between rows, clean and readable

**User action:** Reviews, optionally edits, then clicks "Search Catalogue".

---

#### STEP 6: Catalogue Search Processing

After clicking "Search Catalogue", the grid becomes read-only (subtle opacity change). Agent streams:

> "Searching the catalogue and checking CJ Constructions' purchase history for all 6 items..."

Show a progress indicator — either a horizontal progress bar that steps through each item, or a checklist that ticks off items one by one:

```
✓ Searching catalogue...
✓ Checking customer purchase history...
✓ Verifying stock availability...
✓ Retrieving customer pricing...
```

Each line appears with a ~400ms delay, checkmark animates in. After all 4 complete (~2 seconds total), present the matching grid.

---

#### STEP 7: Product Matching Grid

Agent message (streamed):

> "Matched 6 items — **4 high confidence**, **1 needs selection**, **1 specification query**."

**Below the message, render the matching grid component.** This is the most complex interactive component in the workflow.

**Main matching table:**

| # | Customer's List | Matched Product | Code | Qty | Confidence | Stock | Price | Select |
|---|----------------|----------------|------|-----|------------|-------|-------|--------|
| 1 | Ply 2400x1200x17mm | Structural Plywood 2400x1200x17mm CD | PLY-STR-17-2412 | 12 SHT | High (95%) *Prev. ordered* | 34 available | $68.40 | Checked |
| 2 | Concrete mix 20kg | Rapid Set Concrete 20kg | CONC-RS-20KG | 4 BAG | High (90%) | 120 available | $9.85 | Checked |
| 3 | Pine 90x45 4.8m | Treated Pine 90x45mm 4.8m MGP10 | PINE-T-9045-48 | 10 LM | High (92%) *Prev. ordered* | 28 available | $14.20 | Checked |
| 4 | 75mm galv nails | **3 options — select below** | — | 1 BOX | Low — needs selection | — | — | Unchecked |
| 5 | Silicone clear | Silicone Sealant Clear 300ml | SEAL-SIL-CLR-300 | 6 EA | High (88%) | 45 available | $8.90 | Checked |
| 6 | Villaboard 2400x1200 | Villaboard 2400x1200x6mm | VB-2412-6 | 2 SHT | Medium (72%) *Thickness assumed* | 18 available | $42.50 | Checked |

**Confidence badges:**
- High (85%+): green badge with checkmark icon
- Medium (60-84%): amber/orange badge
- Low (<60%): red/warning badge

**"Prev. ordered" indicator:** Small tag next to the confidence badge, styled distinctly (e.g. `bg-blue-50 text-blue-700 text-xs px-1.5 rounded`)

**Stock column:** Show number + "available" in green if in stock. Show "Out of Stock" in red if zero.

**Quantity column:** Editable inline — user can adjust.

**Checkbox column:** Pre-checked for high/medium confidence. Unchecked for low confidence (row 4) until user selects an option.

**Row 4 — Alternatives expansion:**
Below row 4, show an expandable alternatives section (expanded by default since it needs selection):

| Option | Product | Code | Pack Size | Price | Select |
|--------|---------|------|-----------|-------|--------|
| A | Gal Bullet Head Nails 75x3.75mm 5kg | NAIL-BH-75-5KG | 5kg box | $38.50 | Radio |
| B | Gal Flat Head Nails 75x3.75mm 2kg | NAIL-FH-75-2KG | 2kg box | $18.20 | Radio |
| C | Gal Clout Nails 75x3.75mm 5kg | NAIL-CL-75-5KG | 5kg box | $41.00 | Radio |

Radio button selection. When user selects an option, the main grid row 4 updates to show the selected product and the checkbox auto-ticks.

**Row 6 — Specification query:**
Below or inline with row 6, show a note:

> "Thickness not specified — matched to **6mm** (CJ Constructions' last order). Alternatives: [9mm ($51.20)] | [12mm ($62.80)]"

The alternatives are clickable links/buttons. Clicking one updates the matched product, code, and price in the row.

**Action button:** **"Add Selected to Quote"** — full width primary button below the grid. Disabled until all rows have a selection (i.e. row 4 must have a radio selected).

---

#### STEP 8: Confirmation Gate (Products)

Agent message (streamed):

> "Here's what I'll add to the quote. You can adjust quantities before confirming:"

**Confirmation table:**

| Product | Qty | Unit Price | Line Total |
|---------|-----|-----------|------------|
| Structural Plywood 17mm | [12] SHT | $68.40 | $820.80 |
| Rapid Set Concrete 20kg | [4] BAG | $9.85 | $39.40 |
| Treated Pine 90x45 4.8m | [10] LM | $14.20 | $142.00 |
| Gal Bullet Head Nails 75mm 5kg | [1] BOX | $38.50 | $38.50 |
| Silicone Sealant Clear 300ml | [6] EA | $8.90 | $53.40 |
| Villaboard 6mm 2400x1200 | [2] SHT | $42.50 | $85.00 |
| **Total (ex GST)** | | | **$1,179.10** |

- Qty column is editable (number input)
- Line totals update reactively when qty changes
- Grand total updates reactively

**Action buttons:**
- **"Confirm — Add to Quote"** (primary, green/teal accent)
- **"Go Back & Edit"** (secondary, goes back to matching grid)

---

#### STEP 9: Adding to Quote (Processing + Success)

After clicking Confirm, show a processing sequence inside the drawer:

Each line item shows as it's being added, with a brief tick animation:

```
Adding products to quote...
✓ PLY-STR-17-2412 — Structural Plywood 17mm (12 SHT)
✓ CONC-RS-20KG — Rapid Set Concrete 20kg (4 BAG)
✓ PINE-T-9045-48 — Treated Pine 90x45 4.8m (10 LM)
✓ NAIL-BH-75-5KG — Gal Bullet Head Nails 75mm (1 BOX)
✓ SEAL-SIL-CLR-300 — Silicone Sealant Clear (6 EA)
✓ VB-2412-6 — Villaboard 6mm (2 SHT)
```

Each line appears with a ~300ms stagger. Checkmarks animate in.

**Simultaneously:** The Order Entry table on the left/behind the drawer populates with the 6 lines. Each row appears with a green highlight animation (background flash from `bg-green-50` to transparent over 2 seconds). The footer totals update. The drawer context bar updates `Lines: 0` to `Lines: 6`.

Agent success message (streamed after all lines are added):

> "All 6 products added to quote SO 1098/0. Subtotal: **$1,179.10** (ex GST). The lines are now visible in Order Entry."

**Summary table** (read-only, compact):

| Ln | Product | Qty | Price | Total |
|----|---------|-----|-------|-------|
| 1 | Structural Plywood 17mm | 12 SHT | $68.40 | $820.80 |
| 2 | Rapid Set Concrete 20kg | 4 BAG | $9.85 | $39.40 |
| 3 | Treated Pine 90x45 4.8m | 10 LM | $14.20 | $142.00 |
| 4 | Gal Bullet Head Nails 75mm 5kg | 1 BOX | $38.50 | $38.50 |
| 5 | Silicone Sealant Clear 300ml | 6 EA | $8.90 | $53.40 |
| 6 | Villaboard 6mm 2400x1200 | 2 SHT | $42.50 | $85.00 |

---

#### STEP 10: Cross-Sell Recommendations

Immediately after the success message (with a brief ~800ms delay), the agent analyses the order and streams:

> "Looking at this order — plywood, pine framing, villaboard, and concrete — this looks like a **framing and lining job**. A few things that typically go with this combination:"

**Recommendation cards** (rendered below the message):

Three cards, each containing:

| Card | Product | Detail | Price | Button |
|------|---------|--------|-------|--------|
| 1 | Liquid Nails Construction Adhesive 375ml x 4 | 82% co-purchase with villaboard. *CJ Constructions ordered this last time* | $31.20 | [+ Add] |
| 2 | Villaboard Screws 25mm (Box 1000) | 76% co-purchase. Needed for fixing villaboard to framing | $28.90 | [+ Add] |
| 3 | Acrylic Gap Filler White 450g x 4 | 64% co-purchase. Villaboard joins | $24.80 | [+ Add] |

**Card styling:** Each card is a horizontal row with product info on the left, price in the middle, and the toggle button on the right. Cards have a subtle border, rounded corners, and hover effect.

**Toggle button behaviour:**
- Default: `[+ Add]` — green/teal background, white text
- Clicked: `[✓ Added]` — grey background, indicating selected
- Click again: toggles back to `[+ Add]`

**"Customer ordered this last time" badge:** Small tag on the first card, styled like the "Prev. ordered" badge from the matching grid.

**Action buttons below the cards:**
- **"Add Selected to Quote"** (primary) — only enabled if at least one card is toggled to "Added"
- **"No thanks"** (text link/secondary) — skips recommendations entirely

---

#### STEP 11: Confirmation Gate (Cross-Sell)

Same pattern as Step 8. Agent streams:

> "I'll add these items to the quote. You can adjust quantities before confirming:"

**Confirmation table** (only the selected recommendations):

| Product | Qty | Unit Price | Line Total |
|---------|-----|-----------|------------|
| Liquid Nails Construction 375ml | [4] EA | $7.80 | $31.20 |
| Villaboard Screws 25mm Box 1000 | [1] BOX | $28.90 | $28.90 |
| **Additional Total** | | | **$60.10** |

> New quote total will be **$1,239.20** (ex GST) — 8 line items

**Actions:** "Confirm — Add to Quote" | "Skip"

---

#### STEP 12: Cross-Sell Added + Workflow Complete

Same processing animation as Step 9 but for the 2 cross-sell items only. New rows appear in the Order Entry table with green highlight. Lines count updates to 8. Totals update.

Agent streams:

> "Added 2 items. Updated total: **$1,239.20** (ex GST) — 8 line items on the quote.
>
> Is there anything else you need for this quote?"

**Follow-up suggestions** (pill buttons):
- "Check stock at other branches"
- "Apply a bulk discount"
- "Email quote to customer"
- "Review order summary"

Clicking any of these shows a placeholder: "This feature is coming soon in the full release."

---

## State Management

### Page-Level State (React state, not localStorage for this page)

```typescript
interface QuoteState {
  orderLines: OrderLine[];         // Starts empty, populated at Step 9 & 12
  currentStep: number;             // 1-12
  ocrItems: OCRItem[];             // Editable OCR grid data
  matchedProducts: MatchedProduct[]; // Matching grid data with selections
  selectedCrossSells: string[];    // IDs of toggled cross-sell items
  drawerOpen: boolean;
}

interface OrderLine {
  lineNumber: number;
  productCode: string;
  description: string;
  qty: number;
  uom: string;
  sellPrice: number;
  lineTotal: number;
  isNew: boolean;                  // For green highlight animation
  isCrossSell: boolean;            // To distinguish cross-sell additions
}
```

### Animations

- **Row highlight:** When lines are added to the order table, apply `animate-highlight` — a keyframe that flashes `bg-green-50` and fades to transparent over 2 seconds
- **Step transitions:** New chat messages and interactive components fade in with `animate-fadeIn` (opacity 0 to 1 over 300ms)
- **Processing checkmarks:** Each line item appears with a staggered delay, checkmark scales in from 0 to 1
- **Toggle buttons:** Smooth background colour transition on the cross-sell add/remove toggle

---

## Drawer Behaviour

- **Open:** AI Assistant button click slides drawer in from right (same as existing)
- **Close (x button):** Drawer slides out AND resets all conversation state back to Step 1 starter prompts. Order lines remain on the page (they don't get removed).
- **Context bar:** Always visible at top of drawer, shows Customer / Branch / Quote / Lines count. Lines count is reactive.
- **Scroll:** Chat area scrolls independently. Auto-scroll to bottom after each new message or component renders.
- **Input area:** At the bottom of the drawer. Active for free text input at Steps 2-4. Shows the file upload zone at Step 3 (after agent prompts for upload). Disabled/hidden when interactive grids are the primary interaction (Steps 5-8).

---

## Sales Order List Page

Add SO 1098/0 to the sales order list page data so it appears in the table:

| Order | B/O | BRN | Type | Customer | Order Date | Status | Total |
|-------|-----|-----|------|----------|------------|--------|-------|
| 00001098 | 0 | 10 | Quote | CJ Constructions Pty Ltd | 27/02/2026 | New | $0.00 |

This row should be clickable and navigate to `/sales-orders/1098-0`.

---

## Do NOT Change

- Existing SO 436/0 page and its AI drawer scenario (margin analysis)
- Sidebar navigation
- Global header/toolbar
- Dashboard, Financial Reports, or Login pages
- Any shared component that would break the existing pages

---

## Sample Data Constants

All product data, pricing, stock levels, customer history, and cross-sell recommendations are hardcoded constants (same as the workflow spec). Create a data file `data/quote-1098.ts` (or similar) containing all the sample data so it's cleanly separated from components.

---

## Quality Checklist

- [ ] Empty quote page loads with correct header context and empty order lines table
- [ ] AI drawer opens with starter prompts in a 2x2 card grid
- [ ] Clicking "Help me find products" starts the conversation flow
- [ ] Free text input works at Steps 2-4 with keyword matching
- [ ] File upload simulation shows progress bar and thumbnail
- [ ] OCR grid is fully editable (description, qty, UOM, add/remove rows)
- [ ] "Search Catalogue" triggers processing animation then matching grid
- [ ] Matching grid shows confidence badges, stock, pricing, and checkboxes
- [ ] Row 4 alternatives expand with radio selection
- [ ] Row 6 shows specification query with clickable thickness options
- [ ] "Add Selected to Quote" disabled until row 4 has a selection
- [ ] Confirmation gate shows editable quantities with reactive totals
- [ ] Processing animation staggers line items with checkmark animations
- [ ] Order Entry table populates with green highlight animation
- [ ] Footer totals and drawer line count update reactively
- [ ] Cross-sell cards have working toggle buttons (+ Add / ✓ Added)
- [ ] Second confirmation gate works for cross-sell items
- [ ] Final state: 8 lines on quote, $1,239.20 total, follow-up suggestions shown
- [ ] Closing drawer resets conversation but preserves order lines
- [ ] All agent messages use streaming text (word-by-word delivery)
- [ ] Typing indicator shows before each agent response
- [ ] All interactive components fade in after message streaming completes
- [ ] SO 1098/0 appears in the Sales Order list page
- [ ] Responsive — drawer works on tablet+ widths (can collapse on mobile)
