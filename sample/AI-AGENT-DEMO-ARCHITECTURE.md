# AI Agent Demo -- Architecture & Script Schema

## Overview

A scripted-but-flexible AI agent demo engine for Frameworks ERP. Supports guided walkthroughs with pre-defined conversation flows, while allowing freeform user input via fuzzy matching and optional Claude API fallback.

---

## System Architecture

```
+------------------+     +-------------------+     +------------------+
|  Script Engine   |---->|  Response Router   |---->|  Render Engine   |
|  (JSON scripts)  |     |  (fuzzy match /    |     |  (streaming text |
|                  |     |   Claude fallback) |     |   + components)  |
+------------------+     +-------------------+     +------------------+
        |                         |                        |
        v                         v                        v
+------------------+     +-------------------+     +------------------+
|  Script Store    |     |  Conversation      |     |  Chart/Table     |
|  (JSON files per |     |  History Store     |     |  Components      |
|   module/page)   |     |  (localStorage)    |     |  (Recharts, etc) |
+------------------+     +-------------------+     +------------------+
```

---

## JSON Script Schema

Each module (Sales Orders, Financial Reports, etc.) has a script file defining the conversation tree.

### Top-Level Structure

```json
{
  "scriptId": "sales-order-detail",
  "version": "1.0",
  "context": {
    "module": "sales-orders",
    "pageType": "detail",
    "dataBindings": ["order", "customer", "orderLines"]
  },
  "initialMessage": {
    "type": "context-summary",
    "template": "You're viewing SO {{order.orderNumber}} for {{customer.name}} (Cust {{customer.id}}). There are {{orderLines.length}} order lines totalling {{order.total}} exc. GST.",
    "alerts": [
      {
        "condition": "orderLines.some(l => l.gpPercent < 0)",
        "severity": "warning",
        "template": "Line {{line.lineNumber}} has a negative GP of {{line.gpPercent}}% -- selling below cost."
      }
    ],
    "quickActions": ["Check stock for all items", "Reprice line 2", "Show margin breakdown", "Customer order history"]
  },
  "nodes": {
    "margin-breakdown": { ... },
    "reprice-line": { ... },
    "stock-check": { ... }
  },
  "fallback": {
    "type": "claude-api",
    "systemPrompt": "You are an AI assistant for Frameworks ERP...",
    "contextInjection": ["order", "orderLines", "customer"]
  }
}
```

### Node Schema

Each conversation node defines a trigger, response, and follow-up options.

```json
{
  "margin-breakdown": {
    "triggers": [
      "show me the margin breakdown",
      "margin analysis",
      "what are the margins",
      "GP breakdown",
      "show margins"
    ],
    "triggerMode": "fuzzy",
    "minConfidence": 0.6,
    "response": {
      "text": "Here's the margin analysis for SO {{order.orderNumber}}:",
      "streamDelay": 30,
      "components": [
        {
          "type": "bar-chart",
          "title": "Margin Analysis -- SO {{order.orderNumber}}",
          "dataBinding": "orderLines",
          "config": {
            "xKey": "productCode",
            "yKey": "gpPercent",
            "colorThresholds": [
              { "max": 0, "color": "#cd442c" },
              { "max": 20, "color": "#eaab30" },
              { "min": 20, "color": "#6fb544" }
            ]
          }
        },
        {
          "type": "insight",
          "condition": "orderLines.some(l => l.gpPercent < 0)",
          "severity": "error",
          "template": "Line {{badLine.lineNumber}} ({{badLine.productCode}}) is selling at {{badLine.sellPrice}} against a unit cost of {{badLine.unitCost}}, resulting in a loss of {{badLine.lossPerUnit}} per unit ({{badLine.totalLoss}} total)."
        },
        {
          "type": "insight",
          "condition": "orderLines.filter(l => l.gpPercent >= 0).length > 0",
          "severity": "success",
          "template": "The other {{goodLineCount}} lines average {{avgGoodGP}}% GP, within acceptable range."
        }
      ],
      "actions": [
        {
          "label": "Reprice {{badLine.productCode}} to breakeven ({{badLine.unitCost}})",
          "icon": "refresh",
          "targetNode": "reprice-confirm",
          "params": { "targetGP": 0 }
        },
        {
          "label": "Reprice {{badLine.productCode}} to 15% GP ({{badLine.price15GP}})",
          "icon": "trending-up",
          "targetNode": "reprice-confirm",
          "params": { "targetGP": 15 }
        }
      ],
      "followUps": ["Check stock for all items", "Customer order history", "Export margin report"]
    }
  }
}
```

### Component Types

| Type | Description | Key Config |
|------|-------------|------------|
| `bar-chart` | Recharts bar chart, colour-coded by thresholds | `xKey`, `yKey`, `colorThresholds` |
| `donut-chart` | Recharts pie/donut for breakdowns | `dataKey`, `nameKey`, `colors` |
| `sparkline` | Inline trend line | `dataKey`, `height` |
| `area-chart` | Time series area chart | `xKey`, `yKey`, `gradient` |
| `data-table` | Sortable table with formatted columns | `columns[]`, `dataBinding` |
| `insight` | Coloured callout with conditional text | `severity`, `condition`, `template` |
| `confirm-card` | Before/after comparison with Apply/Cancel | `fields[]`, `onApply` |
| `progress` | Step indicator for multi-step workflows | `steps[]`, `currentStep` |
| `kpi-row` | Row of KPI metric cards | `metrics[]` |

### Action Schema

Actions appear as clickable buttons that advance the conversation.

```json
{
  "label": "Reprice to 15% GP ($7.20)",
  "icon": "trending-up",
  "style": "primary | secondary | danger",
  "targetNode": "reprice-confirm",
  "params": { "targetGP": 15, "lineNumber": 2 },
  "mutation": {
    "type": "update-line",
    "field": "sellPrice",
    "value": "{{calculated.price15GP}}"
  }
}
```

---

## Conversation Engine

### Flow

1. User lands on page -> engine loads script for that page context
2. `initialMessage` renders with context summary + quick actions
3. User types or clicks a quick action
4. Engine runs fuzzy match against all node triggers
5. If confidence >= `minConfidence` -> render that node's response
6. If no match -> fall back to Claude API with page context injected
7. Response streams character-by-character with configurable delay
8. Follow-up suggestions appear after response completes

### Fuzzy Matching

Use a lightweight similarity scorer (e.g. trigram or Levenshtein ratio). No NLP library needed for scripted demos.

```typescript
function findBestMatch(input: string, nodes: ScriptNode[]): { node: ScriptNode; confidence: number } | null {
  const normalised = input.toLowerCase().trim();

  // 1. Exact match on quick action labels
  for (const node of nodes) {
    if (node.triggers.some(t => t.toLowerCase() === normalised)) {
      return { node, confidence: 1.0 };
    }
  }

  // 2. Fuzzy match using trigram similarity
  let best = { node: null, confidence: 0 };
  for (const node of nodes) {
    for (const trigger of node.triggers) {
      const score = trigramSimilarity(normalised, trigger.toLowerCase());
      if (score > best.confidence) {
        best = { node, confidence: score };
      }
    }
  }

  return best.confidence >= 0.6 ? best : null;
}
```

### Streaming Text

```typescript
function streamText(text: string, delay: number = 30): AsyncGenerator<string> {
  // Yields one character at a time with delay
  // Components render after text completes
  // Typing indicator shows during delay
}
```

---

## Persistence (localStorage)

### Storage Keys

| Key | Type | Purpose |
|-----|------|---------|
| `fw-demo-conversations` | `Record<pageId, Message[]>` | Chat history per page |
| `fw-demo-favourites` | `string[]` | Pinned quick actions |
| `fw-demo-progress` | `Record<scriptId, StepState>` | Demo walkthrough progress |
| `fw-demo-mutations` | `Record<orderId, Mutation[]>` | Applied data changes (reprices, etc.) |
| `fw-demo-preferences` | `{ theme, collapsed, density }` | User UI preferences |

### Message Shape

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  components?: ComponentConfig[];
  actions?: ActionConfig[];
  followUps?: string[];
  metadata?: {
    nodeId?: string;
    confidence?: number;
    source: 'script' | 'claude-api' | 'quick-action';
  };
}
```

---

## Demo Script: Sales Order Walkthrough

### Scene Flow

```
[Page Load]
  |
  v
Initial Context Summary
  "You're viewing SO 436/0 for PrePaid Deliveries..."
  "Line 2 has negative GP of -206%"
  Quick Actions: [Check stock] [Reprice line 2] [Margin breakdown] [Customer history]
  |
  v
User: "Show me the margin breakdown"
  |
  v
Margin Analysis (bar chart + insights + reprice actions)
  |
  v
User clicks: "Reprice JMB3 to 15% GP ($7.20)"
  |
  v
Confirm Card (before/after comparison)
  User clicks "Apply Change"
  |
  v
Success message + updated summary
  Follow-ups: [Check stock] [Customer trends] [Export order]
  |
  v
User: "Check stock for all items"
  |
  v
Stock Availability (table with status badges)
  |
  v
User: "Show me this customer's order history"
  |
  v
Customer Trends (area chart + summary table)
```

---

## File Structure

```
src/
  components/
    ai-assistant/
      AIAssistantDrawer.tsx      # Main drawer container
      ConversationEngine.tsx     # Script matching + routing
      MessageBubble.tsx          # Individual message with streaming
      StreamingText.tsx          # Character-by-character renderer
      TypingIndicator.tsx        # Animated dots
      components/
        BarChartComponent.tsx    # Recharts bar chart
        DonutChartComponent.tsx  # Recharts donut
        DataTableComponent.tsx   # Sortable table
        InsightCallout.tsx       # Coloured alert box
        ConfirmCard.tsx          # Before/after with Apply
        KPIRow.tsx               # Metric cards
        ProgressSteps.tsx        # Step indicator
      QuickActions.tsx           # Pinnable action buttons
      FavouritesBar.tsx          # Saved favourites strip
  scripts/
    sales-order-detail.json     # Script for SO detail page
    sales-order-list.json       # Script for SO list page
    financial-reports.json      # Script for reports page
  hooks/
    useConversation.ts          # localStorage persistence
    useStreaming.ts             # Text streaming hook
    useFuzzyMatch.ts            # Trigger matching
  types/
    script.ts                   # TypeScript interfaces
    message.ts                  # Message types
```

---

## Implementation Priority

1. Streaming text engine + typing indicators
2. Bar chart and data table inline components
3. Conversation persistence in localStorage
4. Quick actions with favourites pinning
5. Confirm card with mutation tracking
6. Claude API fallback for unscripted questions
