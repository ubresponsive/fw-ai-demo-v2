# AI Assistant — Product List Matching Workflow

**Interface Mode:** Mode 2 — In-Transaction Side Panel
**Context:** User is in Order Entry with a partially completed sales quote
**Trigger:** User clicks "AI Assistant" button in the Order Entry header
**Document Version:** 2.0 — Updated to reflect final prototype

---

## Scenario

A sales rep is at the counter or on a call. The customer has a handwritten list of products they need for a job. The rep has already created the quote header and assigned the customer. Rather than manually searching for each product one by one, they click the AI Assistant button in the order header, upload the scanned list, review what the agent has read from it, confirm the search, review and adjust the matched products, and push them onto the quote — all from a single side panel conversation.

---

## Pre-Conditions

Before the workflow begins, the following context is already established in the Frameworks Order Entry activity:

| Context Element | Value | Source |
|----------------|-------|--------|
| Order type | Sales Quote | User-selected in Order Entry |
| Order number | SO 1098/0 | Assigned by system |
| Customer | CJ Constructions Pty Ltd (29468) | Assigned by user on quote header |
| Branch | 10 — Sterland Plumbing | Inherited from user session |
| Sales Rep | Steve the Salesman | Assigned on quote header |
| User identity | Greg Thomas (greg) | JWT session — used for SET ROLE on all Gold layer queries |
| Lines on quote | 0 (header only, no products yet) | Quote is partially complete |

The AI Assistant side panel inherits all of this context when it opens. The agent knows who the customer is, which branch, the order number, and what type of document is being created — without the user needing to repeat any of it.

---

## Step-by-Step Flow

### STEP 1: User Opens AI Assistant

**User action:** Clicks the **"🤖 AI Assistant"** button in the Order Entry header bar (positioned next to the Actions button).

**Interface:** The side panel slides open, docked to the right of the Order Entry form. The Order Entry form remains visible and functional on the left. The panel header shows the inherited context and a close button (✕).

**Side panel context bar displays:**
> **Customer:** CJ Constructions (29468) | **Branch:** 10 — Sterland Plumbing | **Quote:** SO 1098/0 | **Lines:** 0

**Agent presents starter prompts:**

| Prompt | Description |
|--------|-------------|
| 🔍 Help me find products | Search and match products to add to the quote |
| 📋 Reorder from history | Show this customer's previous orders for quick re-add |
| 📦 Check stock availability | Check inventory across branches for specific products |
| 💰 Review pricing | Check customer-specific pricing for products |

**Panel behaviour:** The panel starts closed when the user first enters Order Entry. The AI Assistant button toggles the panel open and closed. Closing the panel via the ✕ button resets the conversation to the starter prompts and clears all state — the user gets a fresh session on the next open.

---

### STEP 2: User Selects "Help me find Products"

**User action:** Clicks the "Help me find products" starter prompt.

**Agent response:**

> "How can I help you find products for this quote? I can search the catalogue by description, match from a list, or look at what CJ Constructions has ordered before.
>
> What are you working with?"

**Why this response:** The agent keeps it open-ended. The user might want to type product names, describe what they need verbally, or upload a document. The agent doesn't assume the input method.

---

### STEP 3: User Describes the Task

**User message:**

> "I have a handwritten list of products from the customer that they require for a job"

**Agent response:**

> "Upload the list and I'll match each item against our catalogue. I'll show you:
>
> - **Matched products** with a confidence level
> - **Alternatives** where there's no direct match
> - **Customer history** — I'll prioritise products CJ Constructions has ordered before
>
> You can review everything before I add anything to the quote.
>
> Photo, scan, or PDF all work — go ahead and upload."

**Why this response:** The agent sets expectations before the user uploads. They know what's coming: a reviewable process, not an automatic dump of products onto the quote. The mention of customer history signals intelligence beyond simple text matching.

---

### STEP 4: User Uploads the Scanned List

**User action:** Drags or selects a scanned image/PDF of the handwritten product list into the chat input area.

**What the agent sees on the uploaded list** (example handwritten content):

```
12 sheets ply 2400 x 1200 x 17mm
4 bags concrete mix 20kg
10 lengths pine 90x45 4.8m
box of 75mm galv nails
silicone - clear x 6
2 sheets villaboard 2400 x 1200
```

**Data path:** AI vision model performs OCR and text extraction from the handwritten/scanned document.

---

### STEP 5: Agent Presents OCR Confirmation Grid

**This is a critical checkpoint.** Before searching the catalogue, the agent presents what it has read from the scanned list in an editable grid. This allows the user to correct any OCR misreads, adjust quantities, fix UOM, or add/remove items before the search runs.

**Agent response:**

> "I've read 6 items from your list. Please review what I've captured — you can edit descriptions, quantities, or UOM before I search the catalogue."

**OCR confirmation grid:**

| # | Description (as read) | Qty | UOM | |
|---|----------------------|-----|-----|---|
| 1 | 12 sheets ply 2400x1200x17mm | 12 | SHT | ✕ Remove |
| 2 | 4 bags concrete mix 20kg | 4 | BAG | ✕ Remove |
| 3 | 10 lengths pine 90x45 4.8m | 10 | LM | ✕ Remove |
| 4 | box of 75mm galv nails | 1 | BOX | ✕ Remove |
| 5 | silicone - clear x 6 | 6 | EA | ✕ Remove |
| 6 | 2 sheets villaboard 2400x1200 | 2 | SHT | ✕ Remove |

**\+ Add Row** button at the bottom of the grid.

**Grid interaction features:**

- All three columns (Description, Qty, UOM) are editable inline — the user can correct OCR errors directly
- Each row has a ✕ button to remove items the customer no longer needs
- The "+ Add Row" button allows the user to add items that were missed by OCR or that the customer mentions verbally
- A **"🔍 Search Catalogue"** button submits the confirmed list for matching

**Why this step matters:** Handwritten lists are inherently ambiguous. OCR may misread characters, quantities might be unclear, and abbreviations vary. Giving the user a chance to correct the interpreted list before the catalogue search prevents wasted effort — it's much easier to fix "ply 2400x1200x17mm" here than to deal with a wrong product match downstream. This step also lets the user add items the customer mentions verbally during the conversation ("oh, and I need some timber screws too").

**User action:** Reviews the grid, makes any corrections, then clicks **"🔍 Search Catalogue"**.

---

### STEP 6: Agent Searches and Presents Matching Grid

**Agent response (processing):**

> "Searching the catalogue and checking CJ Constructions' purchase history for all 6 items..."

**Data paths during processing:**

| Action | Data Path | Purpose |
|--------|-----------|---------|
| Product catalogue search | MCP → `stix_views.products` | Search by description, dimensions, category |
| Customer purchase history | MCP → `stix_views.sales_lines` | Find which specific SKUs CJ Constructions has previously bought for similar items |
| Stock availability | MCP → `stix_views.stock_levels` | Check availability at branch |
| Customer-specific pricing | ERP API → `getprice` | Retrieve accurate pricing for matched products |

**How the matching works:**

For each item from the confirmed OCR grid, the agent:

1. **Searches the catalogue** — queries `stix_views.products` using the description, filtering by product categories and dimensions
2. **Checks customer history** — queries `stix_views.sales_lines` for CJ Constructions to see if they've previously purchased products matching this description. If they have, those specific SKUs are prioritised (the customer likely wants the same product they ordered last time)
3. **Scores confidence** — assigns a level based on match quality: exact matches with customer history score high; right category but ambiguous specification scores medium; no clear match scores low with alternatives
4. **Retrieves pricing** — calls `getprice` for each matched product to show the customer's actual price
5. **Checks stock** — confirms availability at the current branch

**Agent response (results):**

> "Matched 6 items: **4 high-confidence**, **1 needs selection**, **1 specification query**."

**Matching grid:**

| # | Customer's List | Matched Product | Code | Qty | Confidence | Stock | Price | ☑ |
|---|----------------|----------------|------|-----|------------|-------|-------|---|
| 1 | 12 sheets ply 2400x1200x17mm | Structural Plywood 2400×1200×17mm CD | PLY-STR-17-2412 | 12 SHT | ✅ High (95%) — *Prev. ordered* | 34 ✓ | $68.40 | ☑ |
| 2 | 4 bags concrete mix 20kg | Rapid Set Concrete 20kg | CONC-RS-20KG | 4 BAG | ✅ High (90%) | 120 ✓ | $9.85 | ☑ |
| 3 | 10 lengths pine 90×45 4.8m | Treated Pine 90×45mm 4.8m MGP10 | PINE-T-9045-48 | 10 LM | ✅ High (92%) — *Prev. ordered* | 28 ✓ | $14.20 | ☑ |
| 4 | box of 75mm galv nails | ⚠️ 3 options — select below | — | 1 BOX | ⚠️ Low | — | — | ☐ |
| 5 | silicone clear × 6 | Silicone Sealant Clear 300ml | SEAL-SIL-CLR-300 | 6 EA | ✅ High (88%) | 45 ✓ | $8.90 | ☑ |
| 6 | 2 sheets villaboard 2400×1200 | Villaboard 2400×1200×6mm | VB-2412-6 | 2 SHT | 🔶 Medium (72%) — *Thickness assumed* | 18 ✓ | $42.50 | ☑ |

**Line 4 — Alternatives (radio button selection):**

| Option | Product | Code | Pack Size | Price | |
|--------|---------|------|-----------|-------|---|
| A | Gal Bullet Head Nails 75×3.75mm 5kg | NAIL-BH-75-5KG | 5kg box | $38.50 | ○ Select |
| B | Gal Flat Head Nails 75×3.75mm 2kg | NAIL-FH-75-2KG | 2kg box | $18.20 | ○ Select |
| C | Gal Clout Nails 75×3.75mm 5kg | NAIL-CL-75-5KG | 5kg box | $41.00 | ○ Select |

**Line 6 — Specification query:**

> "Thickness not specified — matched to **6mm** (CJ Constructions' last order). Alternatives: 9mm ($51.20) | 12mm ($62.80)"

**Grid interaction features:**

- Each row has a checkbox — pre-ticked for high-confidence matches, unticked for items needing user input
- Quantity is editable inline — the user can adjust without leaving the grid
- The alternatives for Line 4 are radio buttons — the user picks one
- The specification query for Line 6 has clickable text links to switch thickness
- An **"Add Selected to Quote"** button at the bottom — leads to the confirmation step

**User actions:**

- Selects **Option A** (Bullet Head Nails 5kg) for Line 4
- Keeps the 6mm Villaboard for Line 6
- All 6 items now have a checkbox ticked
- Clicks **"Add Selected to Quote"**

---

### STEP 7: Confirmation Gate — Products

**This is a mandatory confirmation before any write to the ERP.** The agent presents a clean summary of exactly what will be added, with editable quantities for last-minute adjustments.

**Agent response:**

> "Here's what I'll add to the quote. You can adjust quantities before confirming:"

**Confirmation grid (quantities editable):**

| Product | Qty | Unit Price | Line Total |
|---------|-----|-----------|------------|
| Structural Plywood 17mm | [ 12 ] SHT | $68.40 | $820.80 |
| Rapid Set Concrete 20kg | [ 4 ] BAG | $9.85 | $39.40 |
| Treated Pine 90×45 4.8m | [ 10 ] LM | $14.20 | $142.00 |
| Gal Bullet Head Nails 75mm 5kg | [ 1 ] BOX | $38.50 | $38.50 |
| Silicone Sealant Clear 300ml | [ 6 ] EA | $8.90 | $53.40 |
| Villaboard 6mm 2400×1200 | [ 2 ] SHT | $42.50 | $85.00 |
| **Total (ex GST)** | | | **$1,179.10** |

**Actions:** **"✓ Confirm — Add to Quote"** | **"✎ Go Back & Edit"**

**Why editable quantities here:** The user may have received a last-minute update from the customer ("actually make it 15 sheets not 12") and this is the last opportunity to adjust before the lines hit the ERP. Changing a quantity here is faster than editing the order line after it's been created.

**Note on pricing:** If a quantity change crosses a volume break threshold, the agent would need to re-call `getprice` and update the unit price and line total before confirming. The confirmation grid should reflect the correct price for the final quantity.

**User action:** Reviews, optionally adjusts quantities, clicks **"✓ Confirm — Add to Quote"**.

---

### STEP 8: Agent Adds Products to Quote

**Processing:** The agent calls the Fluid SDK for each confirmed line:

| Line | Product | Qty | Action |
|------|---------|-----|--------|
| 1 | PLY-STR-17-2412 | 12 SHT | `add_product_to_order` → ✅ Added |
| 2 | CONC-RS-20KG | 4 BAG | `add_product_to_order` → ✅ Added |
| 3 | PINE-T-9045-48 | 10 LM | `add_product_to_order` → ✅ Added |
| 4 | NAIL-BH-75-5KG | 1 BOX | `add_product_to_order` → ✅ Added |
| 5 | SEAL-SIL-CLR-300 | 6 EA | `add_product_to_order` → ✅ Added |
| 6 | VB-2412-6 | 2 SHT | `add_product_to_order` → ✅ Added |

**Data path:** Fluid SDK → OpenEdge PASOE (transactional write). The ERP validates each line item — applying the same business rules as manual entry (pricing validation, UOM checks, product status). The ERP's pricing is authoritative; if any price differs from what the agent presented, the user is notified.

**Agent response (success):**

> "✅ All 6 products added to the quote.
>
> **Quote SO 1098/0 — CJ Constructions**
>
> | Ln | Product | Qty | Price | Total |
> |----|---------|-----|-------|-------|
> | 1 | Structural Plywood 17mm | 12 SHT | $68.40 | $820.80 |
> | 2 | Rapid Set Concrete 20kg | 4 BAG | $9.85 | $39.40 |
> | 3 | Treated Pine 90×45 4.8m | 10 LM | $14.20 | $142.00 |
> | 4 | Gal Bullet Head Nails 75mm 5kg | 1 BOX | $38.50 | $38.50 |
> | 5 | Silicone Sealant Clear 300ml | 6 EA | $8.90 | $53.40 |
> | 6 | Villaboard 6mm 2400×1200 | 2 SHT | $42.50 | $85.00 |
>
> **Subtotal: $1,179.10 (ex GST) — 6 line items now in Order Entry**"

**Interface behaviour:** The Order Entry form (left side of the screen) refreshes to show the 6 new line items populated in the order lines grid with a brief green highlight animation. The bottom totals bar updates. The line count in the side panel context bar updates to 6. The user can see both the agent's summary and the actual Frameworks form updated simultaneously.

---

### STEP 9: Agent Recommends Cross-Sell Opportunities

Immediately after confirming the added products, the agent analyses the order composition against co-purchase data and surfaces relevant recommendations.

**Data paths:**

| Action | Data Path | Purpose |
|--------|-----------|---------|
| Co-purchase analysis | MCP → `stix_views.sales_lines` (aggregated) | Products frequently bought alongside plywood, concrete, pine, and villaboard by construction customers |
| Customer-specific history | MCP → `stix_views.sales_lines` (filtered to customer 29468) | What CJ Constructions specifically adds to similar orders |
| Pricing for recommendations | ERP API → `getprice` | Customer-specific pricing for each suggestion |

**Agent response:**

> "Looking at this order — plywood, pine framing, villaboard, and concrete — this looks like a **framing and lining job**. A few things that typically go with this combination:"

**Recommendation cards with toggle buttons:**

| Product | Detail | Price | Action |
|---------|--------|-------|--------|
| Liquid Nails Construction Adhesive 375ml × 4 | 82% co-purchase with villaboard. *CJ Constructions ordered this last time* | $31.20 | **[ + Add ]** |
| Villaboard Screws 25mm (Box 1000) | 76% co-purchase. Needed for fixing villaboard to framing | $28.90 | **[ + Add ]** |
| Acrylic Gap Filler White 450g × 4 | 64% co-purchase. Villaboard joins | $24.80 | **[ + Add ]** |

**Actions:** **"Add Selected to Quote →"** | **"No thanks"**

**Button behaviour:** When the user clicks **"+ Add"** on a recommendation, the button immediately changes to **"✓ Added"** with a grey background — providing instant visual confirmation that the item has been selected. Clicking again toggles back to "+ Add" (deselects). This toggle pattern lets the user build their selection visually before committing.

**Agent behaviour:**

- Recommendations are contextual to the whole order composition, not just individual products — the agent recognises this is a framing/lining job and suggests accordingly
- Customer-specific history is called out where relevant ("CJ Constructions ordered this last time")
- Pricing is from `getprice`, not list price
- The user selects items via the toggle buttons, then clicks "Add Selected to Quote" to proceed to confirmation
- "No thanks" skips the recommendations entirely and closes the workflow

---

### STEP 10: Confirmation Gate — Cross-Sell

**Same confirmation pattern as Step 7.** Before writing to the ERP, the agent presents a clean summary of the selected cross-sell items with editable quantities.

**Agent response:**

> "I'll add these items to the quote. You can adjust quantities before confirming:"

**Confirmation grid (quantities editable):**

| Product | Qty | Unit Price | Line Total |
|---------|-----|-----------|------------|
| Liquid Nails Construction 375ml | [ 4 ] EA | $7.80 | $31.20 |
| Villaboard Screws 25mm Box 1000 | [ 1 ] BOX | $28.90 | $28.90 |
| **Additional Total** | | | **$60.10** |

> New quote total will be **$1,239.20** (ex GST) — 8 line items

**Actions:** **"✓ Confirm — Add to Quote"** | **"Skip"**

**User action:** Reviews, optionally adjusts quantities, clicks **"✓ Confirm — Add to Quote"**.

---

### STEP 11: Agent Adds Cross-Sell Items and Completes

**Processing:** Fluid SDK `add_product_to_order` for the 2 confirmed items.

**Agent response:**

> "✅ Added 2 items:
> - 4 × Liquid Nails Construction Adhesive — $31.20
> - 1 × Villaboard Screws 25mm — $28.90
>
> **Updated total: $1,239.20 (ex GST) — 8 line items**
>
> Is there anything else you need for this quote?"

**Interface behaviour:** The 2 new lines appear in the Order Entry grid with a green highlight animation (distinguishable from the original 6 lines). The totals bar updates. The line count in the context bar updates to 8.

---

### STEP 12: Workflow Complete

The user now has a fully populated quote built from a handwritten list in a single conversation. The Order Entry form shows all 8 line items. The user can:

- Continue working on the quote in Frameworks — adjusting quantities, adding notes, applying discounts
- Ask the AI Assistant another question (e.g., "Check stock at other branches for the plywood")
- Close the AI panel via the ✕ button — this resets the conversation for a fresh session next time

**Final state:**

| Element | Status |
|---------|--------|
| Quote SO 1098/0 | 8 line items populated |
| Customer | CJ Constructions (29468) |
| Handwritten list items | 6/6 matched and added |
| Cross-sell items accepted | 2/3 added |
| All pricing | Customer-specific via `getprice` |
| All stock | Confirmed available at branch |
| Order Entry form | Reflects all 8 lines with updated totals |
| AI Assistant panel | Ready for further requests or can be closed and reset |

---

## Conversation Summary — As It Appears in the Panel

| Turn | Speaker | Message |
|------|---------|---------|
| 1 | **Agent** | *(Starter prompts: Help me find products, Reorder from history, Check stock, Review pricing)* |
| 2 | **User** | *(Clicks "Help me find products")* |
| 3 | **Agent** | How can I help you find products for this quote? I can search the catalogue by description, match from a list, or look at what CJ Constructions has ordered before. |
| 4 | **User** | I have a handwritten list of products from the customer that they require for a job |
| 5 | **Agent** | Upload the list and I'll match each item against our catalogue. I'll show matched products with confidence levels, alternatives where needed, and prioritise items CJ Constructions has ordered before. |
| 6 | **User** | *(Uploads scanned list — customer_product_list.jpg)* |
| 7 | **Agent** | I've read 6 items from your list. *(Presents editable OCR grid — description, qty, UOM per row, with add/remove row capability)* |
| 8 | **User** | *(Reviews OCR grid, makes any corrections, clicks "Search Catalogue")* |
| 9 | **Agent** | Searching the catalogue and checking CJ Constructions' purchase history... |
| 10 | **Agent** | Matched 6 items. *(Presents matching grid: 4 high-confidence, 1 alternatives selection, 1 specification query)* |
| 11 | **User** | *(Selects Bullet Head Nails for Line 4, keeps 6mm Villaboard, clicks "Add Selected to Quote")* |
| 12 | **Agent** | Here's what I'll add. *(Presents confirmation grid with editable quantities — 6 items, $1,179.10 total)* |
| 13 | **User** | *(Reviews, clicks "Confirm — Add to Quote")* |
| 14 | **Agent** | ✅ All 6 products added. Subtotal: $1,179.10 ex GST. Lines now visible in Order Entry. |
| 15 | **Agent** | This looks like a framing and lining job. *(Presents 3 recommendation cards with +Add toggle buttons)* |
| 16 | **User** | *(Clicks "+ Add" on Liquid Nails → button changes to "✓ Added". Clicks "+ Add" on Villaboard Screws → "✓ Added". Clicks "Add Selected to Quote")* |
| 17 | **Agent** | I'll add these 2 items. *(Presents confirmation grid with editable quantities — $60.10 additional, $1,239.20 new total)* |
| 18 | **User** | *(Reviews, clicks "Confirm — Add to Quote")* |
| 19 | **Agent** | ✅ Added 2 items. Updated total: $1,239.20 ex GST, 8 line items. Anything else? |

---

## Data Path Summary

| Step | Data Path | Direction | Purpose |
|------|-----------|-----------|---------|
| Upload parsing | AI vision model | — | OCR and text extraction from handwritten/scanned list |
| OCR confirmation | User review | — | User corrects descriptions, quantities, UOM before search |
| Product matching | MCP → `stix_views.products` | Read | Catalogue search by description, dimensions, category |
| Customer history | MCP → `stix_views.sales_lines` | Read | Prioritise SKUs this customer has previously purchased |
| Stock check | MCP → `stix_views.stock_levels` | Read | Confirm availability at branch |
| Pricing | ERP API → `getprice` | Read | Customer-specific pricing for all matched and recommended products |
| Confirmation gate | User review | — | User confirms selections with editable quantities before ERP write |
| Add to quote | Fluid SDK → `add_product_to_order` | Write | Push confirmed products onto the quote in Order Entry |
| Co-purchase analysis | MCP → `stix_views.sales_lines` (aggregated) | Read | Identify cross-sell opportunities based on order composition |
| Cross-sell confirmation | User review | — | User confirms cross-sell selections with editable quantities before ERP write |

---

## Key Design Decisions

| Decision | Approach |
|----------|---------|
| **AI Assistant activation** | Dedicated "🤖 AI Assistant" button in the Order Entry header — panel starts closed, toggles open/closed |
| **OCR confirmation grid** | Editable grid presented after file upload and before catalogue search — user can correct descriptions, quantities, UOM, add rows, or remove rows |
| **Matching grid** | Interactive table with checkboxes, inline quantity editing, radio buttons for alternatives, and clickable specification options |
| **Confidence indicators** | ✅ High (85%+), 🔶 Medium (60–84%), ⚠️ Low (<60% or multiple options) — with percentage shown |
| **Customer history signal** | "Prev. ordered" badge on matches where the customer has bought that specific SKU before |
| **Alternatives UX** | Expandable section below the main grid row — radio button selection |
| **Specification queries** | Inline text with clickable alternatives (e.g., "6mm \| 9mm \| 12mm") — default pre-selected based on customer history |
| **Confirmation gates** | Mandatory confirmation with editable quantities before every ERP write — both for main products and cross-sell items |
| **Cross-sell toggle buttons** | "+ Add" button toggles to "✓ Added" (grey) on click — visual confirmation of selection before committing |
| **Cross-sell routing** | "Add Selected to Quote" leads to confirmation gate; "No thanks" skips entirely |
| **Quote form update** | Order Entry form on the left refreshes with green highlight animation after agent adds lines — visual confirmation the write succeeded |
| **Close and reset** | ✕ button on panel header closes the panel AND resets the conversation to starter prompts — fresh session on next open |
| **Error handling** | If a product fails to add (e.g., ERP validation error), the agent flags that specific line and continues with the rest — doesn't block the entire batch |

---

## Security Considerations

All data queries in this workflow execute via the MCP server with `SET ROLE` to the authenticated user's identity. The same security model applies as in all other agent interactions:

| Security Layer | Impact on This Workflow |
|---------------|------------------------|
| **Row-level** | Product catalogue search only returns products visible at the user's authorised branches. Customer purchase history only includes orders from authorised branches. Stock check only shows inventory at authorised branches. |
| **Column-level** | Cost prices in the matching grid are subject to `can_view('costs')` — if the user lacks cost visibility, cost-related columns return NULL and are not displayed. Customer-specific pricing from `getprice` is not affected (it returns sell prices, not costs). |
| **ERP-level** | Fluid SDK writes are governed by OpenEdge permissions — if the user doesn't have permission to create quote lines, the write will fail and the agent will report the error. |

---

*Workflow designed for Mode 2 — In-Transaction Side Panel. Consistent with Order Entry Agent Workflow v3.0, Agent SDK Architecture v2, and Data Authorisation Solution v1.5. Updated to reflect final prototype (v6).*
