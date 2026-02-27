import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, AreaChart, Area, PieChart, Pie } from "recharts";

// ═══════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════

const COLORS = {
  primary1: "#cd442c",
  primary2: "#4d504e",
  secondary1: "#006ca7",
  secondary2: "#6fb544",
  secondary3: "#eaab30",
  tertiary1: "#42b59f",
  tertiary2: "#612b52",
  bg: "#f8f9fa",
  surface: "#ffffff",
  surfaceAlt: "#f1f5f9",
  border: "#e2e8f0",
  text: "#1e293b",
  textMuted: "#64748b",
  danger: "#dc2626",
  success: "#16a34a",
};

// ═══════════════════════════════════════════════
// SAMPLE DATA (simulates page context)
// ═══════════════════════════════════════════════

const ORDER_DATA = {
  orderNumber: "436/0",
  customer: { name: "PrePaid Deliveries", id: "555555" },
  status: "Order Complete",
  total: "$464.29",
  branch: "10 — Sydney Metro",
  orderLines: [
    { lineNumber: 1, productCode: "1381631", description: "Compact Brass ¾\" Pigtail", qty: 1, unitCost: 28.5, sellPrice: 32.5, gpPercent: 12.5, lineTotal: 32.5 },
    { lineNumber: 2, productCode: "JMB3", description: "LOCTITE 243® Thread-Lock™", qty: 5, unitCost: 6.12, sellPrice: 2.2, gpPercent: -206.1, lineTotal: 11.0 },
    { lineNumber: 3, productCode: "TIM4520", description: "Timber Pine DAR Dowel 12mm", qty: 12, unitCost: 10.25, sellPrice: 16.2, gpPercent: 37.1, lineTotal: 194.4 },
    { lineNumber: 4, productCode: "CEM025", description: "Cement GP 20kg Bag", qty: 8, unitCost: 8.5, sellPrice: 28.2, gpPercent: 34.7, lineTotal: 225.6 },
  ],
};

const CUSTOMER_HISTORY = [
  { month: "Aug", orders: 12, revenue: 4200 },
  { month: "Sep", orders: 15, revenue: 5100 },
  { month: "Oct", orders: 11, revenue: 3800 },
  { month: "Nov", orders: 18, revenue: 6200 },
  { month: "Dec", orders: 22, revenue: 7500 },
  { month: "Jan", orders: 16, revenue: 5800 },
];

const STOCK_DATA = [
  { productCode: "1381631", description: "Compact Brass ¾\" Pigtail", onHand: 45, allocated: 12, available: 33, status: "In Stock" },
  { productCode: "JMB3", description: "LOCTITE 243® Thread-Lock™", onHand: 8, allocated: 5, available: 3, status: "Low Stock" },
  { productCode: "TIM4520", description: "Timber Pine DAR Dowel 12mm", onHand: 120, allocated: 30, available: 90, status: "In Stock" },
  { productCode: "CEM025", description: "Cement GP 20kg Bag", onHand: 0, allocated: 0, available: 0, status: "Out of Stock" },
];

const BRANCH_REVENUE = [
  { branch: "Sydney Metro", revenue: 342188, orders: 487, gp: 34.2 },
  { branch: "Melbourne", revenue: 298458, orders: 412, gp: 31.8 },
  { branch: "Brisbane", revenue: 187320, orders: 298, gp: 35.1 },
  { branch: "Adelaide", revenue: 124898, orders: 189, gp: 29.4 },
  { branch: "Perth", revenue: 98768, orders: 156, gp: 32.7 },
];

// ═══════════════════════════════════════════════
// SCRIPT ENGINE — conversation nodes
// ═══════════════════════════════════════════════

const SCRIPT_NODES = {
  "margin-breakdown": {
    triggers: ["show me the margin breakdown", "margin analysis", "what are the margins", "gp breakdown", "show margins", "margin breakdown for this order", "analyse margins", "analyze margins"],
    response: {
      text: `Here's the margin analysis for SO ${ORDER_DATA.orderNumber}:`,
      components: [
        { type: "margin-chart" },
        {
          type: "insight",
          severity: "error",
          text: `**Line 2 (JMB3)** is selling at $2.20 against a unit cost of $6.12, resulting in a loss of $3.92 per unit ($19.60 total).`,
        },
        {
          type: "insight",
          severity: "success",
          text: `The other 3 lines average **28.1% GP**, within acceptable range.`,
        },
      ],
      actions: [
        { label: "Reprice JMB3 to breakeven ($6.12)", targetNode: "reprice-breakeven", style: "secondary" },
        { label: "Reprice JMB3 to 15% GP ($7.20)", targetNode: "reprice-15gp", style: "primary" },
      ],
      followUps: ["Check stock for all items", "Customer order history", "Show payment status"],
    },
  },
  "reprice-15gp": {
    triggers: ["reprice jmb3 to 15", "reprice line 2 to 15", "reprice to 15% gp", "set 15% margin"],
    response: {
      text: "I'll reprice line 2 (JMB3) to achieve a 15% gross profit margin.",
      components: [
        {
          type: "confirm-card",
          title: "Confirm Price Change",
          fields: [
            { label: "Sell Price", current: "$2.20", new: "$7.20", highlight: true },
            { label: "Line Total", current: "$11.00", new: "$36.00" },
            { label: "GP%", current: "-206.1%", new: "15.0%", highlight: true },
          ],
        },
      ],
      actions: [],
      followUps: [],
    },
  },
  "reprice-breakeven": {
    triggers: ["reprice to breakeven", "reprice jmb3 to breakeven", "set to cost price"],
    response: {
      text: "I'll reprice line 2 (JMB3) to breakeven — matching the unit cost.",
      components: [
        {
          type: "confirm-card",
          title: "Confirm Price Change",
          fields: [
            { label: "Sell Price", current: "$2.20", new: "$6.12", highlight: true },
            { label: "Line Total", current: "$11.00", new: "$30.60" },
            { label: "GP%", current: "-206.1%", new: "0.0%", highlight: true },
          ],
        },
      ],
      actions: [],
      followUps: [],
    },
  },
  "reprice-applied": {
    triggers: [],
    response: {
      text: "Price change applied successfully. Line 2 (JMB3) has been updated.",
      components: [
        { type: "insight", severity: "success", text: "**JMB3** sell price updated to **$7.20** — GP is now **15.0%**. Order total adjusted to **$489.29** exc. GST." },
      ],
      actions: [],
      followUps: ["Check stock for all items", "Customer order history", "Show updated margin breakdown"],
    },
  },
  "stock-check": {
    triggers: ["check stock", "stock availability", "check stock for all items", "what's in stock", "stock levels", "inventory check"],
    response: {
      text: `Stock availability for SO ${ORDER_DATA.orderNumber}:`,
      components: [{ type: "stock-table" }],
      actions: [
        { label: "Find alternative for CEM025", targetNode: "find-alternative", style: "primary" },
        { label: "Create back order for CEM025", targetNode: "back-order", style: "secondary" },
      ],
      followUps: ["Show margin breakdown", "Customer order history", "Check delivery schedule"],
    },
  },
  "customer-history": {
    triggers: ["customer order history", "customer history", "customer trends", "show me this customer", "past orders", "order history"],
    response: {
      text: `Order history for **${ORDER_DATA.customer.name}** (Cust ${ORDER_DATA.customer.id}) — last 6 months:`,
      components: [
        { type: "customer-chart" },
        {
          type: "insight",
          severity: "info",
          text: "This customer has placed **94 orders** over the last 6 months with average monthly revenue of **$5,433**. December was the peak month with 22 orders totalling $7,500.",
        },
      ],
      actions: [],
      followUps: ["Show margin breakdown", "Check stock for all items", "View outstanding invoices"],
    },
  },
  "revenue-by-branch": {
    triggers: ["revenue by branch", "branch revenue", "branch performance", "show me revenue by branch", "branch breakdown"],
    response: {
      text: "Here's the revenue breakdown by branch for January 2026:",
      components: [
        { type: "branch-chart" },
        { type: "branch-table" },
        { type: "insight", severity: "info", text: "Total revenue across all branches: **$1,051,632** from **1,542 orders** with an average GP of **32.8%**." },
      ],
      actions: [],
      followUps: ["Show top customers by branch", "GP analysis by category", "Monthly trend comparison"],
    },
  },
  "payment-status": {
    triggers: ["payment status", "show payment status", "is this paid", "payment details", "invoice status"],
    response: {
      text: `Payment status for SO ${ORDER_DATA.orderNumber}:`,
      components: [
        {
          type: "confirm-card",
          title: "Payment Summary",
          fields: [
            { label: "Invoice Total", current: "$464.29", new: null },
            { label: "Amount Paid", current: "$464.29", new: null },
            { label: "Balance", current: "$0.00", new: null },
            { label: "Status", current: "Paid in Full", new: null, highlight: true },
          ],
        },
        { type: "insight", severity: "success", text: "Payment was received on **12 Jan 2026** via EFT. Invoice #INV-2026-0891." },
      ],
      actions: [],
      followUps: ["Customer order history", "Show margin breakdown", "View credit terms"],
    },
  },
};

// ═══════════════════════════════════════════════
// FUZZY MATCHING
// ═══════════════════════════════════════════════

function trigramSimilarity(a, b) {
  const getTrigrams = (s) => {
    const t = new Set();
    const padded = `  ${s} `;
    for (let i = 0; i < padded.length - 2; i++) t.add(padded.slice(i, i + 3));
    return t;
  };
  const ta = getTrigrams(a);
  const tb = getTrigrams(b);
  let intersection = 0;
  ta.forEach((t) => { if (tb.has(t)) intersection++; });
  const union = ta.size + tb.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function findBestMatch(input) {
  const normalised = input.toLowerCase().trim();
  let best = { nodeId: null, confidence: 0 };

  for (const [nodeId, node] of Object.entries(SCRIPT_NODES)) {
    for (const trigger of node.triggers) {
      // Exact match
      if (trigger.toLowerCase() === normalised) return { nodeId, confidence: 1.0 };
      // Contains match
      if (normalised.includes(trigger.toLowerCase()) || trigger.toLowerCase().includes(normalised)) {
        const score = 0.85;
        if (score > best.confidence) best = { nodeId, confidence: score };
      }
      // Fuzzy match
      const score = trigramSimilarity(normalised, trigger.toLowerCase());
      if (score > best.confidence) best = { nodeId, confidence: score };
    }
  }

  return best.confidence >= 0.45 ? best : null;
}

// ═══════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

function useStreaming() {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const cancelRef = useRef(false);

  const stream = useCallback((text, delay = 18) => {
    return new Promise((resolve) => {
      cancelRef.current = false;
      setIsStreaming(true);
      setStreamedText("");
      let i = 0;
      const tick = () => {
        if (cancelRef.current) { setIsStreaming(false); resolve(); return; }
        if (i < text.length) {
          // Stream word by word for speed
          const nextSpace = text.indexOf(" ", i + 1);
          const end = nextSpace === -1 ? text.length : nextSpace + 1;
          setStreamedText(text.slice(0, end));
          i = end;
          setTimeout(tick, delay);
        } else {
          setStreamedText(text);
          setIsStreaming(false);
          resolve();
        }
      };
      tick();
    });
  }, []);

  const cancel = useCallback(() => { cancelRef.current = true; }, []);
  return { streamedText, isStreaming, stream, cancel };
}

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2 px-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7, height: 7, borderRadius: "50%", background: COLORS.tertiary1,
            animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }`}</style>
    </div>
  );
}

function RichText({ text }) {
  // Simple markdown bold parser
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

function InsightCallout({ severity, text }) {
  const styles = {
    error: { bg: "#fef2f2", border: "#fca5a5", icon: "⚠", color: "#991b1b" },
    warning: { bg: "#fffbeb", border: "#fcd34d", icon: "⚠", color: "#92400e" },
    success: { bg: "#f0fdf4", border: "#86efac", icon: "✓", color: "#166534" },
    info: { bg: "#eff6ff", border: "#93c5fd", icon: "ℹ", color: "#1e40af" },
  };
  const s = styles[severity] || styles.info;
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: "10px 14px", margin: "8px 0", fontSize: 13, color: s.color, lineHeight: 1.5 }}>
      <span style={{ marginRight: 6 }}>{s.icon}</span>
      <RichText text={text} />
    </div>
  );
}

function MarginChart() {
  const data = ORDER_DATA.orderLines.map((l) => ({
    name: l.productCode,
    gp: l.gpPercent,
    fill: l.gpPercent < 0 ? COLORS.primary1 : l.gpPercent < 20 ? COLORS.secondary3 : COLORS.secondary2,
  }));
  return (
    <div style={{ margin: "12px 0", background: "#fff", borderRadius: 8, border: `1px solid ${COLORS.border}`, padding: "16px 12px 8px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: COLORS.text }}>Margin Analysis — SO {ORDER_DATA.orderNumber}</div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ left: 60, right: 40, top: 0, bottom: 0 }}>
          <XAxis type="number" domain={[-220, 50]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={55} />
          <Tooltip formatter={(v) => [`${v.toFixed(1)}%`, "GP"]} />
          <Bar dataKey="gp" radius={[0, 4, 4, 0]} barSize={22}>
            {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StockTable() {
  const statusColors = { "In Stock": COLORS.secondary2, "Low Stock": COLORS.secondary3, "Out of Stock": COLORS.primary1 };
  return (
    <div style={{ margin: "12px 0", borderRadius: 8, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: COLORS.surfaceAlt }}>
            {["Product", "On Hand", "Allocated", "Available", "Status"].map((h) => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STOCK_DATA.map((row, i) => (
            <tr key={i} style={{ background: i % 2 ? COLORS.surfaceAlt : "#fff" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.productCode}</td>
              <td style={{ padding: "10px 12px" }}>{row.onHand}</td>
              <td style={{ padding: "10px 12px" }}>{row.allocated}</td>
              <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.available}</td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{
                  display: "inline-block", padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500,
                  background: `${statusColors[row.status]}18`, color: statusColors[row.status],
                }}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomerChart() {
  return (
    <div style={{ margin: "12px 0", background: "#fff", borderRadius: 8, border: `1px solid ${COLORS.border}`, padding: "16px 12px 8px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: COLORS.text }}>Order History — {ORDER_DATA.customer.name}</div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={CUSTOMER_HISTORY} margin={{ left: 10, right: 10, top: 5, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.tertiary1} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.tertiary1} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
          <Area type="monotone" dataKey="revenue" stroke={COLORS.tertiary1} fill="url(#revGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BranchChart() {
  return (
    <div style={{ margin: "12px 0", background: "#fff", borderRadius: 8, border: `1px solid ${COLORS.border}`, padding: "16px 12px 8px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: COLORS.text }}>Revenue by Branch — Jan 2026</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={BRANCH_REVENUE} layout="vertical" margin={{ left: 80, right: 50, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
          <YAxis type="category" dataKey="branch" tick={{ fontSize: 11 }} width={75} />
          <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20} fill={COLORS.secondary1} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function BranchTable() {
  return (
    <div style={{ margin: "12px 0", borderRadius: 8, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: COLORS.surfaceAlt }}>
            {["Branch", "Revenue", "Orders", "GP%"].map((h) => (
              <th key={h} style={{ padding: "10px 12px", textAlign: h === "Branch" ? "left" : "right", fontWeight: 600, color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BRANCH_REVENUE.map((row, i) => (
            <tr key={i} style={{ background: i % 2 ? COLORS.surfaceAlt : "#fff" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.branch}</td>
              <td style={{ padding: "10px 12px", textAlign: "right" }}>${row.revenue.toLocaleString()}</td>
              <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.orders}</td>
              <td style={{ padding: "10px 12px", textAlign: "right" }}>
                <span style={{ color: row.gp >= 32 ? COLORS.secondary2 : COLORS.secondary3, fontWeight: 600 }}>{row.gp}%</span>
              </td>
            </tr>
          ))}
          <tr style={{ background: COLORS.surfaceAlt, fontWeight: 700 }}>
            <td style={{ padding: "10px 12px" }}>Total</td>
            <td style={{ padding: "10px 12px", textAlign: "right" }}>${BRANCH_REVENUE.reduce((s, r) => s + r.revenue, 0).toLocaleString()}</td>
            <td style={{ padding: "10px 12px", textAlign: "right" }}>{BRANCH_REVENUE.reduce((s, r) => s + r.orders, 0)}</td>
            <td style={{ padding: "10px 12px", textAlign: "right" }}>32.8%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ConfirmCard({ title, fields, onApply, onCancel }) {
  return (
    <div style={{ margin: "12px 0", borderRadius: 8, border: `2px solid ${COLORS.secondary3}`, overflow: "hidden", background: "#fffbf0" }}>
      <div style={{ padding: "12px 16px", background: `${COLORS.secondary3}15`, borderBottom: `1px solid ${COLORS.secondary3}40`, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16 }}>⚠</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{title}</span>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "6px 0", color: COLORS.textMuted, fontWeight: 500 }}>Field</th>
              <th style={{ textAlign: "right", padding: "6px 0", color: COLORS.textMuted, fontWeight: 500 }}>Current</th>
              {fields.some((f) => f.new !== null) && <th style={{ textAlign: "right", padding: "6px 0", color: COLORS.textMuted, fontWeight: 500 }}>New</th>}
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={i}>
                <td style={{ padding: "6px 0", color: COLORS.text }}>{f.label}</td>
                <td style={{ padding: "6px 0", textAlign: "right", color: f.highlight ? COLORS.primary1 : COLORS.text, fontWeight: f.highlight ? 600 : 400, textDecoration: f.new !== null && f.highlight ? "line-through" : "none" }}>{f.current}</td>
                {f.new !== null && <td style={{ padding: "6px 0", textAlign: "right", color: COLORS.secondary2, fontWeight: 600 }}>{f.new}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onApply && (
        <div style={{ padding: "12px 16px", display: "flex", gap: 10, borderTop: `1px solid ${COLORS.secondary3}30` }}>
          <button onClick={onApply} style={{ flex: 1, padding: "10px 16px", borderRadius: 6, border: "none", background: COLORS.secondary2, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            ✓ Apply Change
          </button>
          <button onClick={onCancel} style={{ padding: "10px 16px", borderRadius: 6, border: `1px solid ${COLORS.border}`, background: "#fff", color: COLORS.text, fontWeight: 500, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            ✕ Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function renderComponent(comp, { onApply, onCancel }) {
  switch (comp.type) {
    case "margin-chart": return <MarginChart key="mc" />;
    case "stock-table": return <StockTable key="st" />;
    case "customer-chart": return <CustomerChart key="cc" />;
    case "branch-chart": return <BranchChart key="bc" />;
    case "branch-table": return <BranchTable key="bt" />;
    case "insight": return <InsightCallout key={comp.text.slice(0, 20)} severity={comp.severity} text={comp.text} />;
    case "confirm-card": return <ConfirmCard key="cf" title={comp.title} fields={comp.fields} onApply={onApply} onCancel={onCancel} />;
    default: return null;
  }
}

// ═══════════════════════════════════════════════
// MESSAGE BUBBLE
// ═══════════════════════════════════════════════

function MessageBubble({ message, onAction, onApply, onCancel, isLatest }) {
  const isUser = message.role === "user";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", marginBottom: 16, maxWidth: "100%" }}>
      {!isUser && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.tertiary1}, ${COLORS.secondary1})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>AI Assistant</span>
        </div>
      )}
      <div style={{
        maxWidth: isUser ? "85%" : "100%",
        padding: isUser ? "10px 16px" : "0 0 0 34px",
        borderRadius: isUser ? "16px 16px 4px 16px" : 0,
        background: isUser ? COLORS.tertiary1 : "transparent",
        color: isUser ? "#fff" : COLORS.text,
        fontSize: 14, lineHeight: 1.55,
      }}>
        <RichText text={message.text} />
      </div>

      {/* Components */}
      {message.components && (
        <div style={{ width: "100%", paddingLeft: 34 }}>
          {message.components.map((comp, i) => (
            <div key={i}>{renderComponent(comp, { onApply, onCancel })}</div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {message.actions && message.actions.length > 0 && isLatest && (
        <div style={{ paddingLeft: 34, display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {message.actions.map((action, i) => (
            <button
              key={i}
              onClick={() => onAction(action)}
              style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                border: action.style === "primary" ? "none" : `1px solid ${COLORS.border}`,
                background: action.style === "primary" ? COLORS.tertiary1 : "#fff",
                color: action.style === "primary" ? "#fff" : COLORS.text,
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}
            >
              {action.style === "primary" ? "↻" : "→"} {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Follow-up suggestions */}
      {message.followUps && message.followUps.length > 0 && isLatest && (
        <div style={{ paddingLeft: 34, display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {message.followUps.map((fu, i) => (
            <button
              key={i}
              onClick={() => onAction({ label: fu, targetNode: null, _isFollowUp: true })}
              style={{
                padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500,
                border: `1px solid ${COLORS.border}`, background: "#fff", color: COLORS.textMuted,
                cursor: "pointer", transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = COLORS.tertiary1; e.target.style.color = COLORS.tertiary1; }}
              onMouseLeave={(e) => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.textMuted; }}
            >
              {fu}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// FAVOURITES BAR
// ═══════════════════════════════════════════════

function FavouritesBar({ favourites, onSelect, onRemove }) {
  if (!favourites.length) return null;
  return (
    <div style={{ padding: "8px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Favourites</span>
      {favourites.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            onClick={() => onSelect(f)}
            style={{ padding: "4px 10px", borderRadius: 99, fontSize: 12, border: `1px solid ${COLORS.tertiary1}40`, background: `${COLORS.tertiary1}10`, color: COLORS.tertiary1, cursor: "pointer", fontWeight: 500 }}
          >
            ★ {f}
          </button>
          <button onClick={() => onRemove(f)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 14, padding: "0 2px", lineHeight: 1 }}>×</button>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// QUICK ACTIONS PANEL
// ═══════════════════════════════════════════════

function QuickActionsPanel({ onSelect, onFavourite, favourites }) {
  const actions = [
    { label: "Reprice Order", icon: "↻", category: "Actions" },
    { label: "Check Stock", icon: "📦", category: "Actions" },
    { label: "Margin Analysis", icon: "📊", category: "Analysis" },
    { label: "Customer Trends", icon: "📈", category: "Analysis" },
    { label: "Payment Status", icon: "💳", category: "Status" },
    { label: "Revenue by Branch", icon: "🏢", category: "Reports" },
  ];

  return (
    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Quick Actions</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {actions.map((a, i) => {
          const isFav = favourites.includes(a.label);
          return (
            <div key={i} style={{ position: "relative" }}>
              <button
                onClick={() => onSelect(a.label)}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  border: `1px solid ${COLORS.border}`, background: "#fff", color: COLORS.text,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.15s ease", textAlign: "left",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.tertiary1; e.currentTarget.style.background = `${COLORS.tertiary1}08`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = "#fff"; }}
              >
                <span>{a.icon}</span> {a.label}
              </button>
              <button
                onClick={() => onFavourite(a.label)}
                style={{
                  position: "absolute", top: 4, right: 4, background: "none", border: "none",
                  cursor: "pointer", fontSize: 14, color: isFav ? COLORS.secondary3 : COLORS.border,
                  padding: "2px 4px",
                }}
                title={isFav ? "Remove from favourites" : "Add to favourites"}
              >
                {isFav ? "★" : "☆"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PROGRESS INDICATOR
// ═══════════════════════════════════════════════

function DemoProgress({ steps, currentStep }) {
  return (
    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginRight: 8 }}>Progress</span>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%", fontSize: 11, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: i < currentStep ? COLORS.tertiary1 : i === currentStep ? `${COLORS.tertiary1}20` : COLORS.surfaceAlt,
            color: i < currentStep ? "#fff" : i === currentStep ? COLORS.tertiary1 : COLORS.textMuted,
            border: i === currentStep ? `2px solid ${COLORS.tertiary1}` : "none",
            transition: "all 0.3s ease",
          }}>
            {i < currentStep ? "✓" : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 20, height: 2, background: i < currentStep ? COLORS.tertiary1 : COLORS.border, borderRadius: 1, transition: "all 0.3s ease" }} />
          )}
        </div>
      ))}
      <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>{steps[currentStep] || "Complete"}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════

const DEMO_STEPS = ["Review Order", "Analyse Margins", "Reprice", "Verify Stock", "Review"];

export default function App() {
  const [messages, setMessages] = useLocalStorage("fw-ai-messages", []);
  const [favourites, setFavourites] = useLocalStorage("fw-ai-favourites", []);
  const [demoStep, setDemoStep] = useLocalStorage("fw-ai-step", 0);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const { streamedText, isStreaming, stream } = useStreaming();
  const [streamingMsgIndex, setStreamingMsgIndex] = useState(-1);
  const [pendingComponents, setPendingComponents] = useState(null);
  const [showComponents, setShowComponents] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText, isTyping, showComponents]);

  // Initial message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const badLine = ORDER_DATA.orderLines.find((l) => l.gpPercent < 0);
      const initial = {
        id: Date.now().toString(),
        role: "assistant",
        text: `You're viewing **SO ${ORDER_DATA.orderNumber}** for ${ORDER_DATA.customer.name} (Cust ${ORDER_DATA.customer.id}). There are ${ORDER_DATA.orderLines.length} order lines totalling **${ORDER_DATA.total}** exc. GST.`,
        components: badLine
          ? [{ type: "insight", severity: "warning", text: `Line ${badLine.lineNumber} has a negative GP of ${badLine.gpPercent}% — selling below cost.` }]
          : [],
        actions: [],
        followUps: ["Show margin breakdown", "Check stock for all items", "Customer order history", "Payment status"],
        timestamp: Date.now(),
        source: "script",
      };
      setMessages([initial]);
    }
  }, []);

  // Process user input
  const handleSend = useCallback(async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user", text: text.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowQuickActions(false);
    setIsTyping(true);

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const match = findBestMatch(text);
    setIsTyping(false);

    if (match) {
      const node = SCRIPT_NODES[match.nodeId];
      const response = node.response;
      const msgIndex = messages.length + 1; // +1 for user msg
      setStreamingMsgIndex(msgIndex);
      setPendingComponents(response);
      setShowComponents(false);

      // Stream the text
      await stream(response.text);

      // Show components after text completes
      setShowComponents(true);
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: response.text,
        components: response.components,
        actions: response.actions,
        followUps: response.followUps,
        timestamp: Date.now(),
        source: "script",
        nodeId: match.nodeId,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingMsgIndex(-1);
      setPendingComponents(null);

      // Advance demo progress
      if (match.nodeId === "margin-breakdown" && demoStep < 2) setDemoStep(1);
      if (match.nodeId.startsWith("reprice") && demoStep < 3) setDemoStep(2);
      if (match.nodeId === "stock-check" && demoStep < 4) setDemoStep(3);
      if (match.nodeId === "customer-history" && demoStep < 5) setDemoStep(4);
    } else {
      // Fallback response
      const fallback = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: `I can help with that. Try asking about **margin analysis**, **stock availability**, **customer history**, **payment status**, or **revenue by branch** for this order.`,
        components: [],
        actions: [],
        followUps: ["Show margin breakdown", "Check stock for all items", "Customer order history"],
        timestamp: Date.now(),
        source: "fallback",
      };
      setStreamingMsgIndex(messages.length + 1);
      await stream(fallback.text);
      setMessages((prev) => [...prev, fallback]);
      setStreamingMsgIndex(-1);
    }
  }, [messages, stream, demoStep]);

  const handleAction = useCallback((action) => {
    if (action.targetNode === "reprice-confirm" || action.targetNode === "reprice-15gp" || action.targetNode === "reprice-breakeven") {
      handleSend(action.label);
    } else if (action._isFollowUp) {
      handleSend(action.label);
    } else {
      handleSend(action.label);
    }
  }, [handleSend]);

  const handleApplyChange = useCallback(async () => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsTyping(false);
    const node = SCRIPT_NODES["reprice-applied"];
    setStreamingMsgIndex(messages.length);
    await stream(node.response.text);
    const msg = {
      id: Date.now().toString(),
      role: "assistant",
      text: node.response.text,
      components: node.response.components,
      actions: node.response.actions,
      followUps: node.response.followUps,
      timestamp: Date.now(),
      source: "script",
      nodeId: "reprice-applied",
    };
    setMessages((prev) => [...prev, msg]);
    setStreamingMsgIndex(-1);
    if (demoStep < 3) setDemoStep(2);
  }, [messages, stream, demoStep]);

  const handleCancelChange = useCallback(() => {
    const msg = {
      id: Date.now().toString(), role: "assistant",
      text: "Price change cancelled. The order remains unchanged.",
      components: [], actions: [],
      followUps: ["Show margin breakdown", "Check stock for all items", "Try a different price"],
      timestamp: Date.now(), source: "script",
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const toggleFavourite = useCallback((label) => {
    setFavourites((prev) => prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]);
  }, []);

  const handleReset = useCallback(() => {
    setMessages([]);
    setDemoStep(0);
    setShowQuickActions(true);
    setStreamingMsgIndex(-1);
    setPendingComponents(null);
    setShowComponents(false);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(input); }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: COLORS.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.tertiary1}, ${COLORS.secondary1})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>AI Assistant</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>Context: SO {ORDER_DATA.orderNumber}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowQuickActions(!showQuickActions)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}`, background: showQuickActions ? `${COLORS.tertiary1}10` : "#fff", color: showQuickActions ? COLORS.tertiary1 : COLORS.textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
            {showQuickActions ? "Hide" : "Show"} Actions
          </button>
          <button onClick={handleReset} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}`, background: "#fff", color: COLORS.textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
            Reset
          </button>
        </div>
      </div>

      {/* Demo Progress */}
      <DemoProgress steps={DEMO_STEPS} currentStep={demoStep} />

      {/* Favourites */}
      <FavouritesBar favourites={favourites} onSelect={(f) => handleSend(f)} onRemove={(f) => toggleFavourite(f)} />

      {/* Quick Actions */}
      {showQuickActions && messages.length <= 1 && (
        <QuickActionsPanel onSelect={(label) => handleSend(label)} onFavourite={toggleFavourite} favourites={favourites} />
      )}

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column" }}>
        {messages.map((msg, i) => {
          const isLatest = i === messages.length - 1;
          const isCurrentlyStreaming = i === streamingMsgIndex;

          // If this is the message being streamed, don't render it from messages array
          // It's rendered by the streaming section below
          if (isCurrentlyStreaming) return null;

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              onAction={handleAction}
              onApply={msg.nodeId?.includes("reprice") && !msg.nodeId?.includes("applied") ? handleApplyChange : null}
              onCancel={msg.nodeId?.includes("reprice") && !msg.nodeId?.includes("applied") ? handleCancelChange : null}
              isLatest={isLatest && !isStreaming}
            />
          );
        })}

        {/* Streaming message */}
        {isStreaming && streamedText && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.tertiary1}, ${COLORS.secondary1})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>AI Assistant</span>
            </div>
            <div style={{ paddingLeft: 34, fontSize: 14, lineHeight: 1.55, color: COLORS.text }}>
              <RichText text={streamedText} />
              <span style={{ display: "inline-block", width: 2, height: 16, background: COLORS.tertiary1, marginLeft: 2, animation: "blink 0.8s step-end infinite", verticalAlign: "middle" }} />
            </div>
            {showComponents && pendingComponents?.components?.map((comp, i) => (
              <div key={i} style={{ width: "100%", paddingLeft: 34 }}>
                {renderComponent(comp, { onApply: null, onCancel: null })}
              </div>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.tertiary1}, ${COLORS.secondary1})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
            </div>
            <TypingIndicator />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, background: "#fff", padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this order..."
              disabled={isStreaming || isTyping}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${COLORS.border}`,
                fontSize: 14, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
                background: isStreaming || isTyping ? COLORS.surfaceAlt : "#fff",
              }}
              onFocus={(e) => { e.target.style.borderColor = COLORS.tertiary1; }}
              onBlur={(e) => { e.target.style.borderColor = COLORS.border; }}
            />
          </div>
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isStreaming || isTyping}
            style={{
              width: 44, height: 44, borderRadius: 12, border: "none",
              background: input.trim() && !isStreaming ? COLORS.tertiary1 : COLORS.surfaceAlt,
              color: input.trim() && !isStreaming ? "#fff" : COLORS.textMuted,
              cursor: input.trim() && !isStreaming ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease", flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: COLORS.textMuted, textAlign: "center" }}>
          AI responses are generated — always verify important information
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: ${COLORS.textMuted}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.textMuted}; }
      `}</style>
    </div>
  );
}
