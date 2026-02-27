import { useState } from "react";
import {
  Search, ChevronDown, Home, Users, Tag, Clock, Printer, MessageSquare,
  Key, HelpCircle, Menu, Sparkles, X, Send, FileText, TrendingUp,
  Package, DollarSign, Truck, ClipboardList, StickyNote, CheckSquare,
  MoreHorizontal, Plus, Check, AlertTriangle, ArrowRight, ChevronRight,
  Eye, RefreshCw, Scissors, BarChart3, Zap, Bot, ShoppingCart,
  Building2, Calendar, CreditCard, MapPin, User, Bell, Settings,
  PanelRightOpen, PanelRightClose, Copy, Split, Pause, Trash2,
  Download, Upload, Link, Receipt, ArrowUpDown, Filter, Columns,
  GripVertical, Info, ExternalLink, Star, Paperclip, CircleDot
} from "lucide-react";

// Brand colors
const brand = {
  primary1: "#cd442c",
  primary2: "#4d504e",
  secondary1: "#006ca7",
  secondary2: "#6fb544",
  secondary3: "#eaab30",
  tertiary1: "#42b59f",
  tertiary2: "#612b52",
};

const orderLines = [
  {
    ln: 1, product: "1381631", desc: "Extractor Screw #1 Prepack", supplier: "829663",
    qty: 2.0, uom: "CD", sell: 9.00, disc: 0, total: 18.00, usage: "",
    pickGroup: "", unitCost: 7.16, gp: 12.47, status: "ok"
  },
  {
    ln: 2, product: "JMB3", desc: "JODYS JMB3 PRODUCT", supplier: "GreenTexta",
    qty: 5.0, uom: "ea", sell: 2.20, disc: 0, total: 11.00, usage: "",
    pickGroup: "", unitCost: 6.12, gp: -206.08, status: "warning"
  },
  {
    ln: 3, product: "TIM4520", desc: "Timber Pine DAR 45x20 4.8m", supplier: "AUS-TIM",
    qty: 12.0, uom: "LM", sell: 4.85, disc: 5, total: 55.29, usage: "",
    pickGroup: "TIMBER", unitCost: 2.90, gp: 37.11, status: "ok"
  },
  {
    ln: 4, product: "CEM025", desc: "Cement GP 20kg Bag", supplier: "BORAL01",
    qty: 40.0, uom: "ea", sell: 9.50, disc: 0, total: 380.00, usage: "",
    pickGroup: "HEAVY", unitCost: 6.20, gp: 34.74, status: "ok"
  },
];

const aiMessages = [
  {
    role: "assistant",
    content: "You're viewing **SO 436/0** for PrePaid Deliveries (Customer 555555). I can see 4 order lines totalling $464.29 exc. GST.\n\nHere are some things I can help with:",
    suggestions: [
      "Check stock availability for all items",
      "Reprice based on current supplier costs",
      "Show margin analysis for this order",
      "Find similar past orders for this customer"
    ]
  },
];

function StatusBadge({ label, variant }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${styles[variant]}`}>
      {variant === "green" && <Check className="w-3 h-3 mr-1" />}
      {variant === "amber" && <Clock className="w-3 h-3 mr-1" />}
      {label}
    </span>
  );
}

function Tab({ active, icon: Icon, label, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active
          ? "border-sky-600 text-sky-700"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      {count !== undefined && (
        <span className={`ml-1 px-1.5 py-0 text-xs rounded-full ${active ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-500"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ActionButton({ icon: Icon, label, variant = "default", onClick }) {
  const styles = {
    default: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    primary: "text-white hover:opacity-90",
    danger: "bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200",
    success: "text-white hover:opacity-90",
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${styles[variant]}`}
      style={variant === "primary" ? { backgroundColor: brand.secondary1 } : variant === "success" ? { backgroundColor: brand.secondary2 } : {}}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

export default function FrameworksSalesOrder() {
  const [activeTab, setActiveTab] = useState("lines");
  const [aiOpen, setAiOpen] = useState(true);
  const [aiInput, setAiInput] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showActions, setShowActions] = useState(false);

  const toggleRow = (ln) => {
    setSelectedRows(prev => prev.includes(ln) ? prev.filter(r => r !== ln) : [...prev, ln]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50" style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      {/* ── Top Nav Bar ── */}
      <header className="flex items-center justify-between px-4 h-12 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: brand.secondary1 }}>
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="font-semibold text-sm" style={{ color: brand.primary2 }}>Frameworks</span>
          </div>
          <div className="h-5 w-px bg-gray-200 mx-1" />
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-100">
              <Home className="w-3 h-3" /> Home
            </button>
            <ChevronRight className="w-3 h-3" />
            <button className="hover:text-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-100">Sales Orders</button>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-gray-800 px-1.5 py-0.5 rounded bg-gray-100">SO 436/0</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>TEST COMPANY 01</span>
            <span className="text-gray-300">|</span>
            <span>Branch: 10</span>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Bell className="w-4 h-4 text-gray-400" /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Settings className="w-4 h-4 text-gray-400" /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><HelpCircle className="w-4 h-4 text-gray-400" /></button>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ backgroundColor: brand.tertiary2 }}>RA</div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Sales Order Content ── */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>

          {/* Order Header Card */}
          <div className="mx-4 mt-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Header Top Row */}
            <div className="flex items-start justify-between px-5 pt-4 pb-3">
              <div className="flex items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-lg font-semibold text-gray-900">SO 436/0</h1>
                    <StatusBadge label="Entry Complete" variant="green" />
                    <StatusBadge label="Date Confirmed" variant="blue" />
                    <StatusBadge label="Waiting on Picking" variant="amber" />
                  </div>
                  <p className="text-xs text-gray-500">Order &middot; PrePaid Deliveries &middot; Cash Card Holder</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* AI Toggle */}
                <button
                  onClick={() => setAiOpen(!aiOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border"
                  style={aiOpen
                    ? { backgroundColor: `${brand.tertiary1}15`, borderColor: brand.tertiary1, color: brand.tertiary1 }
                    : { backgroundColor: "white", borderColor: "#e5e7eb", color: "#6b7280" }
                  }
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Assistant
                  {aiOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: brand.secondary1 }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Actions
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showActions && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1">
                      {[
                        { icon: FileText, label: "Edit Header" },
                        { icon: Eye, label: "Hide Costs" },
                        { icon: RefreshCw, label: "Reprice" },
                        { icon: DollarSign, label: "Gross Profit Reprice" },
                        { icon: Scissors, label: "Split Transaction" },
                        { icon: Package, label: "Pick & Release" },
                        { icon: ClipboardList, label: "Picking Enquiry" },
                        { icon: Link, label: "Linked PO" },
                        { icon: CreditCard, label: "Make Payment" },
                        { icon: Pause, label: "Hold Order" },
                        { icon: Trash2, label: "Void Order", danger: true },
                        { icon: Printer, label: "Print Options" },
                        { icon: Copy, label: "Copy Order" },
                      ].map(({ icon: Icon, label, danger }, i) => (
                        <button
                          key={i}
                          className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${danger ? "text-red-600" : "text-gray-700"}`}
                        >
                          <Icon className="w-3.5 h-3.5 text-gray-400" />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Header Fields Grid */}
            <div className="grid grid-cols-6 gap-x-4 gap-y-2 px-5 pb-4 text-xs">
              <div>
                <label className="text-gray-400 font-medium uppercase tracking-wider" style={{ fontSize: "10px" }}>Customer</label>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-semibold text-gray-800">555555</span>
                  <span className="text-gray-500">— PrePaid Deliveries</span>
                </div>
              </div>
              <div>
                <label className="text-gray-400 font-medium uppercase tracking-wider" style={{ fontSize: "10px" }}>Cust Order #</label>
                <div className="font-semibold text-gray-800 mt-0.5">3321</div>
              </div>
              <div>
                <label className="text-gray-400 font-medium uppercase tracking-wider" style={{ fontSize: "10px" }}>Sales Rep</label>
                <div className="font-semibold text-gray-800 mt-0.5">Anne Love</div>
              </div>
              <div>
                <label className="text-gray-400 font-medium uppercase tracking-wider" style={{ fontSize: "10px" }}>Branch</label>
                <div className="font-semibold text-gray-800 mt-0.5">10 — Test Branch 010</div>
              </div>
              <div>
                <label className="text-gray-400 font-medium uppercase tracking-wider" style={{ fontSize: "10px" }}>Despatch Method</label>
                <div className="font-semibold text-gray-800 mt-0.5">Delivery from Store</div>
              </div>
              <div>
                <label className="text-gray-400 font-medium uppercase tracking-wider" style={{ fontSize: "10px" }}>Date Required</label>
                <div className="flex items-center gap-1 font-semibold text-gray-800 mt-0.5">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  20/10/2025
                </div>
              </div>
            </div>

            {/* Payment Alert */}
            <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: `${brand.secondary3}15`, border: `1px solid ${brand.secondary3}40` }}>
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: brand.secondary3 }} />
              <span style={{ color: "#92700f" }}>$15.00 still to be paid on this order.</span>
              <button className="ml-auto text-xs font-medium hover:underline" style={{ color: brand.secondary1 }}>Make Payment</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0 px-4 mt-2 border-b border-gray-200 bg-white mx-4 rounded-t-lg">
            <Tab active={activeTab === "lines"} icon={ShoppingCart} label="Order Lines" count={4} onClick={() => setActiveTab("lines")} />
            <Tab active={activeTab === "delivery"} icon={Truck} label="Delivery Details" onClick={() => setActiveTab("delivery")} />
            <Tab active={activeTab === "header"} icon={FileText} label="Header" onClick={() => setActiveTab("header")} />
            <Tab active={activeTab === "diary"} icon={StickyNote} label="Diary Notes" onClick={() => setActiveTab("diary")} />
            <Tab active={activeTab === "messages"} icon={MessageSquare} label="Messages" onClick={() => setActiveTab("messages")} />
            <Tab active={activeTab === "tasks"} icon={CheckSquare} label="Tasks" onClick={() => setActiveTab("tasks")} />
          </div>

          {/* Line Entry + Grid */}
          <div className="flex-1 mx-4 bg-white border-x border-b border-gray-200 rounded-b-lg flex flex-col overflow-hidden">

            {/* Quick Add Bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Plus className="w-3.5 h-3.5" />
                Quick Add:
              </div>
              <input className="w-32 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300" placeholder="Product code..." />
              <input className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-md text-center" placeholder="Qty" defaultValue="1" />
              <input className="w-20 px-2 py-1 text-xs border border-gray-200 rounded-md text-right" placeholder="Sell Price" />
              <input className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-md text-center" placeholder="Disc%" defaultValue="0" />
              <input className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-md" placeholder="Comments..." />
              <button className="p-1.5 rounded-md text-white" style={{ backgroundColor: brand.secondary2 }}>
                <Check className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="ml-auto flex items-center gap-3 text-xs text-gray-500">
                <span>SOH: <strong className="text-gray-700">—</strong></span>
                <span>Avail: <strong className="text-gray-700">—</strong></span>
              </div>
            </div>

            {/* Table Toolbar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {selectedRows.length > 0 && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${brand.secondary1}15`, color: brand.secondary1 }}>
                    {selectedRows.length} selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded hover:bg-gray-100"><Filter className="w-3.5 h-3.5 text-gray-400" /></button>
                <button className="p-1 rounded hover:bg-gray-100"><ArrowUpDown className="w-3.5 h-3.5 text-gray-400" /></button>
                <button className="p-1 rounded hover:bg-gray-100"><Columns className="w-3.5 h-3.5 text-gray-400" /></button>
              </div>
            </div>

            {/* Data Grid */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-8 px-2 py-2"><input type="checkbox" className="rounded border-gray-300" /></th>
                    <th className="w-10 px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>Ln</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>Product</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider min-w-48" style={{ fontSize: "10px" }}>Description</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>Supplier</th>
                    <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>Qty</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>UOM</th>
                    <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>Sell Price</th>
                    <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>Disc%</th>
                    <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>Total</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>Pick Grp</th>
                    <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>Unit Cost</th>
                    <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase tracking-wider" style={{ fontSize: "10px" }}>GP%</th>
                    <th className="w-8 px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {orderLines.map((line) => (
                    <tr
                      key={line.ln}
                      className={`border-b border-gray-100 transition-colors ${
                        selectedRows.includes(line.ln) ? "bg-sky-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-2 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(line.ln)}
                          onChange={() => toggleRow(line.ln)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-2 py-2.5 text-gray-400 font-mono">{line.ln}</td>
                      <td className="px-2 py-2.5">
                        <button className="font-medium hover:underline" style={{ color: brand.secondary1 }}>{line.product}</button>
                      </td>
                      <td className="px-2 py-2.5 text-gray-700">{line.desc}</td>
                      <td className="px-2 py-2.5 text-gray-500">{line.supplier}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-gray-700">{line.qty.toFixed(1)}</td>
                      <td className="px-2 py-2.5 text-center text-gray-500">{line.uom}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-gray-700">${line.sell.toFixed(2)}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-gray-400">{line.disc.toFixed(0)}</td>
                      <td className="px-2 py-2.5 text-right font-mono font-medium text-gray-800">${line.total.toFixed(2)}</td>
                      <td className="px-2 py-2.5 text-gray-500">{line.pickGroup}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-gray-500">${line.unitCost.toFixed(2)}</td>
                      <td className="px-2 py-2.5 text-right font-mono">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium ${
                          line.gp < 0 ? "bg-red-50 text-red-700" : line.gp < 15 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {line.gp.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <button className="p-0.5 rounded hover:bg-gray-100">
                          <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Totals */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-2.5 flex items-center gap-6 text-xs shrink-0">
              {[
                { label: "Total Exc", value: "$464.29", bold: true },
                { label: "Total Inc", value: "$510.72" },
                { label: "GP%", value: "-26.71", warn: true },
                { label: "Rebated GP%", value: "-22.34", warn: true },
                { label: "Fully Reb. GP%", value: "-13.74", warn: true },
                { label: "Total Cost", value: "$544.92" },
                { label: "Delivery Fee", value: "$10.00" },
              ].map(({ label, value, bold, warn }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-gray-400">{label}</span>
                  <span className={`font-mono font-semibold ${warn ? "text-red-600" : bold ? "text-gray-900" : "text-gray-700"}`}>
                    {value}
                  </span>
                </div>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <button className="px-4 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: brand.secondary2 }}>
                  Save
                </button>
                <button className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-300">
                  Cancel
                </button>
                <button className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Side Panel ── */}
        {aiOpen && (
          <div className="w-96 border-l border-gray-200 bg-white flex flex-col shrink-0">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${brand.tertiary1}20` }}>
                  <Sparkles className="w-4 h-4" style={{ color: brand.tertiary1 }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">AI Assistant</h3>
                  <p className="text-xs text-gray-400">Context: SO 436/0</p>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Context-Aware Quick Actions */}
            <div className="px-3 py-2.5 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2" style={{ fontSize: "10px" }}>Quick Actions</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { icon: RefreshCw, label: "Reprice Order", color: brand.secondary1 },
                  { icon: Package, label: "Check Stock", color: brand.tertiary1 },
                  { icon: Scissors, label: "Split Transaction", color: brand.secondary3 },
                  { icon: BarChart3, label: "Margin Analysis", color: brand.tertiary2 },
                  { icon: TrendingUp, label: "Customer Trends", color: brand.secondary2 },
                  { icon: Receipt, label: "Payment Status", color: brand.primary1 },
                ].map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                    <span className="text-xs text-gray-600">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {/* AI Welcome Message */}
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${brand.tertiary1}20` }}>
                  <Bot className="w-3.5 h-3.5" style={{ color: brand.tertiary1 }} />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                    <p>You're viewing <strong>SO 436/0</strong> for PrePaid Deliveries (Cust 555555). There are <strong>4 order lines</strong> totalling <strong>$464.29</strong> exc. GST.</p>
                    <p className="mt-2 flex items-center gap-1.5 text-red-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Line 2 has a negative GP of -206% — selling below cost.</span>
                    </p>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[
                      "Check stock for all items",
                      "Reprice line 2",
                      "Show margin breakdown",
                      "Customer order history"
                    ].map(s => (
                      <button
                        key={s}
                        className="px-2.5 py-1 text-xs rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulated User Message */}
              <div className="flex gap-2.5 justify-end">
                <div className="bg-sky-50 border border-sky-100 rounded-xl rounded-tr-sm px-3 py-2 text-xs text-gray-700 max-w-72">
                  Show me the margin breakdown for this order
                </div>
              </div>

              {/* AI Response with Inline Chart */}
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${brand.tertiary1}20` }}>
                  <Bot className="w-3.5 h-3.5" style={{ color: brand.tertiary1 }} />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                    <p className="font-medium mb-2">Margin Analysis — SO 436/0</p>

                    {/* Mini Chart */}
                    <div className="bg-white rounded-lg border border-gray-100 p-2.5 mb-2">
                      <div className="space-y-2">
                        {orderLines.map(line => (
                          <div key={line.ln} className="flex items-center gap-2">
                            <span className="w-20 text-xs text-gray-500 truncate">{line.product}</span>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.max(2, Math.min(100, line.gp > 0 ? line.gp * 2 : 2))}%`,
                                  backgroundColor: line.gp < 0 ? brand.primary1 : line.gp < 15 ? brand.secondary3 : brand.secondary2
                                }}
                              />
                            </div>
                            <span className={`w-14 text-right text-xs font-mono font-medium ${line.gp < 0 ? "text-red-600" : "text-gray-700"}`}>
                              {line.gp.toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p><strong className="text-red-600">Line 2 (JMB3)</strong> is selling at $2.20 against a unit cost of $6.12, resulting in a loss of $3.92 per unit ($19.60 total).</p>
                    <p className="mt-1.5">The other 3 lines average <strong className="text-emerald-600">28.1% GP</strong>, which is within acceptable range.</p>
                  </div>

                  {/* Action Suggestions */}
                  <div className="mt-2 space-y-1">
                    <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left">
                      <RefreshCw className="w-3.5 h-3.5" style={{ color: brand.secondary1 }} />
                      <span className="text-xs text-gray-600 flex-1">Reprice JMB3 to breakeven ($6.12)</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left">
                      <DollarSign className="w-3.5 h-3.5" style={{ color: brand.secondary2 }} />
                      <span className="text-xs text-gray-600 flex-1">Reprice JMB3 to 15% GP ($7.20)</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirmation Preview Example */}
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${brand.tertiary1}20` }}>
                  <Bot className="w-3.5 h-3.5" style={{ color: brand.tertiary1 }} />
                </div>
                <div className="flex-1">
                  <div className="rounded-xl border-2 border-dashed px-3 py-2.5 text-xs" style={{ borderColor: `${brand.secondary3}80`, backgroundColor: `${brand.secondary3}08` }}>
                    <p className="font-medium text-gray-700 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3 h-3" style={{ color: brand.secondary3 }} />
                      Confirm Price Change
                    </p>
                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden mb-2">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-2 py-1.5 text-left text-gray-500 font-medium">Field</th>
                            <th className="px-2 py-1.5 text-right text-gray-500 font-medium">Current</th>
                            <th className="px-2 py-1.5 text-right text-gray-500 font-medium">New</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-gray-50">
                            <td className="px-2 py-1.5 text-gray-600">Sell Price</td>
                            <td className="px-2 py-1.5 text-right font-mono text-red-500 line-through">$2.20</td>
                            <td className="px-2 py-1.5 text-right font-mono font-medium text-emerald-600">$7.20</td>
                          </tr>
                          <tr className="border-t border-gray-50">
                            <td className="px-2 py-1.5 text-gray-600">Line Total</td>
                            <td className="px-2 py-1.5 text-right font-mono text-gray-400">$11.00</td>
                            <td className="px-2 py-1.5 text-right font-mono font-medium text-gray-700">$36.00</td>
                          </tr>
                          <tr className="border-t border-gray-50">
                            <td className="px-2 py-1.5 text-gray-600">GP%</td>
                            <td className="px-2 py-1.5 text-right font-mono text-red-500">-206.1%</td>
                            <td className="px-2 py-1.5 text-right font-mono font-medium text-emerald-600">15.0%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium" style={{ backgroundColor: brand.secondary2 }}>
                        <Check className="w-3 h-3" /> Apply Change
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200">
                        <X className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask about this order..."
                    rows={1}
                    className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:border-transparent pr-10"
                    style={{ focusRingColor: brand.tertiary1 }}
                  />
                  <button className="absolute right-2 bottom-2 p-1 rounded-lg transition-colors hover:bg-gray-100">
                    <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                <button className="p-2.5 rounded-xl text-white shrink-0" style={{ backgroundColor: brand.tertiary1 }}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-center text-xs text-gray-300 mt-1.5" style={{ fontSize: "10px" }}>
                AI responses are generated — always verify before applying changes
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Click-away for actions dropdown */}
      {showActions && <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />}
    </div>
  );
}
