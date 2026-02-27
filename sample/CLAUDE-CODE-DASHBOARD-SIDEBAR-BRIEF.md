# Dashboard Brief: "What's Coming Up" and "My Actions" Sidebar Sections

## Role

You are a senior UX specialist and frontend developer enhancing the Frameworks ERP dashboard. You will add two new sections to the right sidebar panel (the same panel that contains "Recent Activity") to give users an at-a-glance view of their day and actionable tasks. These sections use the existing Tailwind component patterns and sidebar panel behaviour already in the app.

## Context

- **Stack:** Next.js 15 + TypeScript + Tailwind CSS + Headless UI + Heroicons
- **Current state:** The dashboard has a "Recent Activity" button (top-right) that toggles a right sidebar on wide screens (1280px+). On smaller screens, Recent Activity appears inline below Quick Links.
- **Page:** `/dashboard` only. Do not modify other pages.

---

## Layout

The right sidebar panel currently contains only "Recent Activity". Add two new sections **above** Recent Activity, so the sidebar order is:

1. **Today's Schedule** (was "What's Coming Up" — see naming below)
2. **My Actions**
3. **Recent Activity** (existing, unchanged)

Each section is collapsible — a section header with a chevron toggle. All three sections default to expanded on first load. Collapsed state can be stored in localStorage so the user's preference persists.

The sidebar should be scrollable independently when content exceeds the viewport height.

---

## Section 1: Today's Schedule

### Naming Decision

Use **"Today's Schedule"** rather than "What's Coming Up". It's more specific and implies urgency — these are things happening today that need attention, not a vague forecast.

### Section Header

```
Today's Schedule                          Thu 27 Feb
```

The date sits right-aligned in the header, styled muted (`text-neutral-500 text-xs`). This reinforces that the list is for today specifically.

### Content Structure

Each item is a compact row with an icon, a category colour indicator (left border or dot), a description, and a count or value. Items are grouped by operational area but presented as a single flat list sorted by priority/time — no sub-headers for each area.

### Sample Data

These items represent a realistic day for a branch manager or senior user at a building supplies business:

| Priority | Icon | Category Colour | Description | Detail | Action |
|----------|------|----------------|-------------|--------|--------|
| 1 | Truck | Blue | **3 purchase orders arriving** | PO 4821, 4823, 4825 — Boral, AUS-TIM | Click → navigate |
| 2 | Package | Amber | **12 orders awaiting pick** | 8 delivery, 4 counter collect | Click → navigate |
| 3 | Clock | Red | **5 deliveries due by 2pm** | Dispatches scheduled today | Click → navigate |
| 4 | FileText | Green | **2 quotes expiring today** | QU 1087/0 (CJ Constructions), QU 1092/0 (Bayside Builders) | Click → navigate |
| 5 | AlertTriangle | Red | **4 items below reorder point** | PLY-STR-17, CONC-RS-20KG, NAIL-BH-75, CEM025 | Click → navigate |
| 6 | Calendar | Purple | **Stocktake: Timber yard** | Scheduled for 3:00 PM | Click → navigate |
| 7 | TrendingDown | Amber | **3 jobs behind schedule** | Production jobs 1842, 1845, 1847 | Click → navigate |

### Row Design

Each row should be:

```
[colour dot] [icon] Description                    Detail badge/count
                    Secondary text (muted)          Time or status
```

Specifically:
- **Left indicator:** A small coloured dot (6px) or 3px left border matching the category colour
- **Icon:** Heroicon, 16px, matching the category colour
- **Primary text:** Bold/medium weight, single line, truncated if needed. This is the actionable summary.
- **Secondary text:** Below primary, muted colour (`text-neutral-500 text-xs`), providing context (PO numbers, customer names, product codes)
- **Right side:** A count badge or time indicator. Counts use a pill badge (`bg-neutral-100 text-neutral-700 text-xs font-medium px-2 py-0.5 rounded-full`). Times use plain muted text.
- **Hover:** Subtle background highlight (`hover:bg-neutral-50`) and cursor pointer — rows are clickable (navigate to relevant page in the demo, or show a "coming soon" toast for pages not yet wired up)
- **Spacing:** 12px vertical padding per row, thin divider (`border-b border-neutral-100`) between rows

### Category Colours

| Category | Colour | Tailwind Class |
|----------|--------|---------------|
| Purchasing & Receiving | `#3b82f6` (blue-500) | `text-blue-500 bg-blue-50` |
| Sales & Dispatch | `#f59e0b` (amber-500) | `text-amber-500 bg-amber-50` |
| Accounts | `#10b981` (emerald-500) | `text-emerald-500 bg-emerald-50` |
| Inventory | `#ef4444` (red-500) | `text-red-500 bg-red-50` |
| Production | `#8b5cf6` (violet-500) | `text-violet-500 bg-violet-50` |

### Empty State

If no items (not expected for the demo, but good practice):

> "Nothing scheduled for today. Enjoy the quiet."

---

## Section 2: My Actions

### Naming Decision

Use **"My Actions"** — short, personal, implies ownership. These are tasks assigned to or expected of the current user today.

### Section Header

```
My Actions                                4 pending
```

The count sits right-aligned, styled as a small pill badge (`bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full`). This count reflects how many uncompleted actions remain. As the user checks items off, the count decrements.

### Content Structure

Each action is a checklist item with a checkbox, description, due context, and an optional shortcut link. Actions can be checked off (completed), which applies a strikethrough and muted style.

### Sample Data

| # | Checkbox | Action | Context | Shortcut |
|---|----------|--------|---------|----------|
| 1 | Unchecked | **Issue customer statements** | End of month — 142 accounts | Run Statements → |
| 2 | Unchecked | **Follow up overdue payments** | 8 accounts over 60 days, $47.2K outstanding | View Aged Debtors → |
| 3 | Unchecked | **Review low-margin orders** | 3 orders with GP below 10% flagged yesterday | View Orders → |
| 4 | Unchecked | **Approve purchase orders** | 2 POs pending approval ($12.4K total) | View POs → |
| 5 | Checked | ~~**Check morning delivery schedule**~~ | 5 deliveries dispatched at 7:30 AM | — |
| 6 | Checked | ~~**Review yesterday's sales figures**~~ | Branch 10 revenue: $18.4K | — |

### Row Design

Each row:

```
[checkbox] Action title                              [shortcut link →]
           Context text (muted)
```

Specifically:
- **Checkbox:** Standard Tailwind checkbox, `rounded` style, accent colour `accent-emerald-500` when checked. Clicking toggles completion.
- **Action title:** Medium weight when unchecked. When checked: `line-through text-neutral-400` (struck through and muted).
- **Context text:** Below the title, `text-xs text-neutral-500`. When checked, also muted further.
- **Shortcut link:** Right-aligned, `text-xs text-blue-600 hover:text-blue-700 font-medium` with a small arrow. Hidden for completed items. Clicking navigates to the relevant page (or shows "coming soon" toast).
- **Completed items sink to the bottom** of the list, below all unchecked items. When a user checks an item, it smoothly animates down to the completed section.
- **Spacing:** 12px vertical padding per row, thin divider between rows.

### Completion Behaviour

- Checking an item: checkbox ticks, title gets strikethrough + muted colour, shortcut link fades out, row animates to the bottom of the list after a brief 300ms delay. The "pending" count in the header decrements.
- Unchecking: item restores to full styling and animates back to its original position. Count increments.
- Store checked state in localStorage so it persists across page navigations within the session. Reset on logout (same as other demo state).

### Empty State (all actions completed)

> "All caught up for today."

Displayed with a small checkmark icon and a green tint.

---

## Section 3: Recent Activity (Existing)

No changes. Remains at the bottom of the sidebar. Keep its existing content and styling.

---

## Responsive Behaviour

- **1280px+ (wide desktop):** All three sections appear in the floating right sidebar panel, toggled by the "Recent Activity" button. Consider renaming this toggle button to just **"Today"** or **"Sidebar"** since it now contains more than just recent activity.
- **Below 1280px:** All three sections appear inline below Quick Links (same pattern as current Recent Activity behaviour). Stack vertically: Today's Schedule → My Actions → Recent Activity.

---

## Sidebar Toggle Button

The existing "Recent Activity" button in the top-right of the dashboard should be updated:

**Current:** `< Recent Activity`

**New:** `< Today` — shorter, encompasses all three sections. The icon could be a calendar or clock icon from Heroicons.

Alternatively, keep the button text contextual: show a small notification dot on the button if there are pending actions (i.e. unchecked items in My Actions), giving the user a reason to open the sidebar.

---

## Interaction with Existing Layout

The main dashboard content (KPIs, charts, Quick Links) should remain unchanged. The sidebar overlays or docks to the right without pushing the main content — same behaviour as the current Recent Activity panel.

If the sidebar is open, the main content area narrows slightly on very wide screens (1440px+), or the sidebar overlays the right edge of the main content on 1280-1440px screens. Match the current behaviour exactly.

---

## Do NOT Change

- KPI cards, charts, or Quick Links sections
- Sidebar navigation
- Global header/toolbar
- Any other page

---

## Quality Checklist

- [ ] Sidebar contains three sections in order: Today's Schedule, My Actions, Recent Activity
- [ ] Each section header is collapsible with a chevron toggle
- [ ] Collapsed state persists in localStorage
- [ ] Today's Schedule shows 7 sample items with correct icons, colours, and descriptions
- [ ] Each schedule item has a category colour dot/border, icon, primary text, secondary text, and right-aligned detail
- [ ] Schedule rows are clickable with hover state
- [ ] My Actions shows 6 items (4 unchecked, 2 checked)
- [ ] Checking/unchecking animates items and updates the pending count
- [ ] Completed actions show strikethrough and move to bottom of list
- [ ] Shortcut links are visible on unchecked items, hidden on checked
- [ ] Checked state persists in localStorage
- [ ] Sidebar toggle button label updated from "Recent Activity" to "Today"
- [ ] Responsive: sidebar docks right on 1280px+, inline below Quick Links on smaller screens
- [ ] Sidebar scrolls independently when content exceeds viewport
- [ ] No changes to existing dashboard sections
