import { useState, useRef, useEffect } from "react";
import {
  Search, ChevronDown, Home, Users, HelpCircle, Menu, Sparkles, X, Send,
  FileText, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart,
  Calendar, Building2, Bell, Settings, ChevronRight, Download, Star,
  Clock, Filter, ArrowUpRight, ArrowDownRight, Eye, Play, Pin,
  BookOpen, Receipt, Wallet, CreditCard, Package, ShoppingCart,
  Truck, Layers, Bot, BarChart2, LineChart, Table2, FileSpreadsheet,
  Printer, Share2, RefreshCw, CircleDot, AlertCircle, Check,
  ArrowRight, Bookmark, Zap, MessageSquare, Activity, Target,
  PanelRightOpen, PanelRightClose, Boxes, ChevronUp, Banknote,
  Scale, BadgeDollarSign, ShieldCheck, FolderOpen, LayoutGrid, List,
  SlidersHorizontal, Paperclip, ThumbsUp, Copy, ExternalLink
} from "lucide-react";

const brand = {
  primary1: "#cd442c",
  primary2: "#4d504e",
  secondary1: "#006ca7",
  secondary2: "#6fb544",
  secondary3: "#eaab30",
  tertiary1: "#42b59f",
  tertiary2: "#612b52",
};

const kpiCards = [
  { label: "Revenue MTD", value: "$1.24M", change: "+8.3%", up: true, icon: DollarSign, color: brand.secondary2, sparkData: [30,45,35,60,55,70,65,80,75,90] },
  { label: "Gross Profit", value: "$412K", change: "+3.1%", up: true, icon: TrendingUp, color: brand.tertiary1, sparkData: [40,38,45,42,48,44,50,52,49,55] },
  { label: "Accounts Receivable", value: "$287K", change: "-2.4%", up: false, icon: Receipt, color: brand.secondary1, sparkData: [60,58,55,57,52,54,50,48,51,47] },
  { label: "Accounts Payable", value: "$198K", change: "+5.7%", up: true, icon: CreditCard, color: brand.secondary3, sparkData: [30,32,35,33,38,36,40,42,39,44] },
  { label: "Cash Position", value: "$534K", change: "+12.1%", up: true, icon: Wallet, color: brand.tertiary2, sparkData: [20,28,25,35,40,38,48,52,50,60] },
  { label: "GP Margin", value: "33.2%", change: "-0.8%", up: false, icon: Target, color: brand.primary1, sparkData: [35,34,36,35,34,33,35,34,33,33] },
];

const reportCategories = [
  {
    id: "sales", label: "Sales & Revenue", icon: ShoppingCart, color: brand.secondary1,
    reports: [
      { name: "Sales Summary by Branch", type: "table", starred: true, lastRun: "2h ago" },
      { name: "Sales by Product Group", type: "chart", starred: false, lastRun: "1d ago" },
      { name: "Sales Rep Performance", type: "table", starred: true, lastRun: "3h ago" },
      { name: "Monthly Revenue Trend", type: "chart", starred: false, lastRun: "5h ago" },
      { name: "Top 20 Customers by Revenue", type: "table", starred: false, lastRun: "1d ago" },
      { name: "Sales Order Pipeline", type: "table", starred: true, lastRun: "30m ago" },
    ]
  },
  {
    id: "profit", label: "Profitability", icon: TrendingUp, color: brand.secondary2,
    reports: [
      { name: "Gross Profit by Branch", type: "chart", starred: true, lastRun: "1h ago" },
      { name: "GP% by Product Category", type: "chart", starred: false, lastRun: "4h ago" },
      { name: "Margin Erosion Analysis", type: "table", starred: false, lastRun: "2d ago" },
      { name: "Below-Margin Transactions", type: "table", starred: true, lastRun: "1h ago" },
    ]
  },
  {
    id: "ar", label: "Accounts Receivable", icon: Receipt, color: brand.tertiary1,
    reports: [
      { name: "Aged Debtors Summary", type: "table", starred: true, lastRun: "1h ago" },
      { name: "Overdue Invoices", type: "table", starred: true, lastRun: "2h ago" },
      { name: "Customer Payment History", type: "table", starred: false, lastRun: "1d ago" },
      { name: "DSO Trend Analysis", type: "chart", starred: false, lastRun: "3d ago" },
    ]
  },
  {
    id: "ap", label: "Accounts Payable", icon: CreditCard, color: brand.secondary3,
    reports: [
      { name: "Aged Creditors Summary", type: "table", starred: true, lastRun: "2h ago" },
      { name: "Supplier Spend Analysis", type: "chart", starred: false, lastRun: "1d ago" },
      { name: "Purchase Order Commitments", type: "table", starred: false, lastRun: "5h ago" },
    ]
  },
  {
    id: "inventory", label: "Inventory & Stock", icon: Package, color: brand.tertiary2,
    reports: [
      { name: "Stock Valuation by Location", type: "table", starred: true, lastRun: "3h ago" },
      { name: "Slow Moving Stock", type: "table", starred: false, lastRun: "1d ago" },
      { name: "Stock Turn Analysis", type: "chart", starred: false, lastRun: "2d ago" },
      { name: "Reorder Point Report", type: "table", starred: false, lastRun: "6h ago" },
    ]
  },
  {
    id: "gl", label: "General Ledger", icon: BookOpen, color: brand.primary2,
    reports: [
      { name: "Trial Balance", type: "table", starred: true, lastRun: "1h ago" },
      { name: "P&L Statement", type: "table", starred: true, lastRun: "2h ago" },
      { name: "Balance Sheet", type: "table", starred: true, lastRun: "2h ago" },
      { name: "GL Transaction Listing", type: "table", starred: false, lastRun: "4h ago" },
      { name: "Budget vs Actual", type: "chart", starred: false, lastRun: "1d ago" },
    ]
  },
];

const aiQuickActions = [
  { icon: BarChart3, label: "Revenue by branch this month", color: brand.secondary1 },
  { icon: AlertCircle, label: "Overdue invoices over $5K", color: brand.primary1 },
  { icon: TrendingDown, label: "Products with declining margins", color: brand.secondary3 },
  { icon: PieChart, label: "Top 10 customers by profit", color: brand.secondary2 },
  { icon: Package, label: "Slow-moving stock over 90 days", color: brand.tertiary2 },
  { icon: Activity, label: "Cash flow forecast next 30 days", color: brand.tertiary1 },
];

const aiConversation = [
  {
    role: "assistant",
    content: "welcome",
  },
  {
    role: "user",
    content: "Show me revenue by branch for January 2026",
  },
  {
    role: "assistant",
    content: "report",
    reportData: {
      title: "Revenue by Branch — January 2026",
      subtitle: "All branches, ordered by revenue descending",
      rows: [
        { branch: "10 — Sydney Metro", revenue: "$342,180", orders: 487, gp: "34.2%", trend: "up" },
        { branch: "20 — Melbourne", revenue: "$298,450", orders: 412, gp: "31.8%", trend: "up" },
        { branch: "30 — Brisbane", revenue: "$187,320", orders: 298, gp: "35.1%", trend: "down" },
        { branch: "40 — Adelaide", revenue: "$124,890", orders: 189, gp: "29.4%", trend: "up" },
        { branch: "50 — Perth", revenue: "$98,760", orders: 156, gp: "32.7%", trend: "down" },
      ],
      total: { revenue: "$1,051,600", orders: 1542, gp: "32.8%" }
    }
  }
];

function MiniSparkline({ data, color, width = 80, height = 24 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`
  ).join(" ");
  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} opacity="0.6" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * height} r="2" fill={color} />
    </svg>
  );
}

function KPICard({ item }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}12` }}>
          <item.icon className="w-4.5 h-4.5" style={{ color: item.color }} />
        </div>
        <MiniSparkline data={item.sparkData} color={item.color} />
      </div>
      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'DM Sans', system-ui" }}>{item.value}</span>
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${item.up ? "text-emerald-600" : "text-red-500"}`}>
          {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {item.change}
        </span>
      </div>
    </div>
  );
}

function ReportRow({ report, catColor }) {
  const typeIcon = report.type === "chart" ? BarChart2 : Table2;
  const TypeIcon = typeIcon;
  return (
    <div className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="w-7 h-7 rounded-md flex items-center justify-center bg-gray-50 group-hover:bg-white border border-gray-100">
        <TypeIcon className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 group-hover:text-gray-900 truncate">{report.name}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
          <Clock className="w-3 h-3" /> {report.lastRun}
        </p>
      </div>
      {report.starred && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
        <button className="p-1 rounded hover:bg-gray-200" title="Run"><Play className="w-3.5 h-3.5 text-gray-400" /></button>
        <button className="p-1 rounded hover:bg-gray-200" title="Download"><Download className="w-3.5 h-3.5 text-gray-400" /></button>
        <button className="p-1 rounded hover:bg-gray-200" title="Schedule"><Clock className="w-3.5 h-3.5 text-gray-400" /></button>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
    </div>
  );
}

export default function FinancialReportsDashboard() {
  const [aiOpen, setAiOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [aiInput, setAiInput] = useState("");
  const [dateRange, setDateRange] = useState("This Month");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (aiOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiOpen]);

  const filteredCategories = activeCategory === "all"
    ? reportCategories
    : reportCategories.filter(c => c.id === activeCategory);

  const starredReports = reportCategories.flatMap(c =>
    c.reports.filter(r => r.starred).map(r => ({ ...r, category: c.label, catColor: c.color, catIcon: c.icon }))
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50" style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      {/* ── Top Nav ── */}
      <header className="flex items-center justify-between px-4 h-12 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-1 hover:bg-gray-100 rounded"><Menu className="w-5 h-5 text-gray-500" /></button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: brand.secondary1 }}>
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="font-semibold text-sm" style={{ color: brand.primary2 }}>Frameworks</span>
          </div>
          <div className="h-5 w-px bg-gray-200 mx-1" />
          <nav className="flex items-center gap-1 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-100">
              <Home className="w-3 h-3" /> Home
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-gray-800 px-1.5 py-0.5 rounded bg-gray-100">Financial Reports</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-2">
            <Building2 className="w-3.5 h-3.5" /><span>TEST COMPANY 01</span>
            <span className="text-gray-300">|</span><span>Branch: 10</span>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Bell className="w-4 h-4 text-gray-400" /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Settings className="w-4 h-4 text-gray-400" /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><HelpCircle className="w-4 h-4 text-gray-400" /></button>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ backgroundColor: brand.tertiary2 }}>RA</div>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto">

          {/* Page Header */}
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Financial Reports</h1>
                <p className="text-sm text-gray-500 mt-0.5">Run standard reports or use AI to generate custom analysis</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Date Range Selector */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 cursor-pointer hover:border-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {dateRange}
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
                {/* Branch Filter */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 cursor-pointer hover:border-gray-300">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  All Branches
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
                {/* AI Button */}
                <button
                  onClick={() => setAiOpen(!aiOpen)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg text-white transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: brand.tertiary1 }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Report Builder
                </button>
              </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-6 gap-3">
              {kpiCards.map(item => <KPICard key={item.label} item={item} />)}
            </div>
          </div>

          {/* Reports Section */}
          <div className="px-6 pb-6 flex-1">

            {/* Starred / Favourites */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <h2 className="text-sm font-semibold text-gray-800">Favourites</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{starredReports.length}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {starredReports.map((r, i) => (
                  <button key={i} className="group flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-3.5 py-3 hover:shadow-md hover:border-gray-300 transition-all text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${r.catColor}12` }}>
                      <r.catIcon className="w-4 h-4" style={{ color: r.catColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate group-hover:text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.category}</p>
                    </div>
                    <Play className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeCategory === "all"
                      ? "bg-gray-800 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Reports
                </button>
                {reportCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeCategory === cat.id
                        ? "text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                    style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
                  >
                    <cat.icon className="w-3 h-3" />
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search reports..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
                  />
                </div>
                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 ${viewMode === "grid" ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 ${viewMode === "list" ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Report Categories Grid */}
            <div className={`grid ${viewMode === "grid" ? "grid-cols-3" : "grid-cols-1"} gap-4`}>
              {filteredCategories.map(cat => (
                <div key={cat.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Category Header */}
                  <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}12` }}>
                      <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">{cat.label}</h3>
                      <p className="text-xs text-gray-400">{cat.reports.length} reports</p>
                    </div>
                    <button className="text-xs font-medium hover:underline" style={{ color: cat.color }}>View All</button>
                  </div>
                  {/* Report List */}
                  <div className="py-1">
                    {cat.reports.map((report, i) => (
                      <ReportRow key={i} report={report} catColor={cat.color} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── AI Drawer ── */}
        <div
          className={`shrink-0 border-l border-gray-200 bg-white flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
            aiOpen ? "w-[420px]" : "w-0 border-l-0"
          }`}
        >
          {aiOpen && (
            <>
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brand.tertiary1}, ${brand.secondary1})` }}>
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">AI Report Builder</h3>
                    <p className="text-xs text-gray-400">Generate custom reports with natural language</p>
                  </div>
                </div>
                <button onClick={() => setAiOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Quick Starters */}
              <div className="px-4 py-3 border-b border-gray-100 shrink-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2" style={{ fontSize: "10px" }}>Quick Reports</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {aiQuickActions.map(({ icon: Icon, label, color }) => (
                    <button
                      key={label}
                      className="group flex items-start gap-2 px-2.5 py-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left"
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color }} />
                      <span className="text-xs text-gray-600 leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {/* Welcome */}
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${brand.tertiary1}20` }}>
                    <Bot className="w-3.5 h-3.5" style={{ color: brand.tertiary1 }} />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                      <p>Describe the report you need in plain language and I'll generate it. You can ask for any combination of data, time periods, branches, customers, and products.</p>
                      <p className="mt-1.5 text-gray-500">Try: <em>"Show me aged debtors over $10K for the Sydney branch"</em></p>
                    </div>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-sky-50 border border-sky-100 rounded-xl rounded-tr-sm px-3 py-2 text-xs text-gray-700 max-w-80">
                    Show me revenue by branch for January 2026
                  </div>
                </div>

                {/* AI Generated Report */}
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${brand.tertiary1}20` }}>
                    <Bot className="w-3.5 h-3.5" style={{ color: brand.tertiary1 }} />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-800">Revenue by Branch — Jan 2026</p>
                        <div className="flex items-center gap-1">
                          <button className="p-1 rounded hover:bg-gray-200" title="Export"><Download className="w-3 h-3 text-gray-400" /></button>
                          <button className="p-1 rounded hover:bg-gray-200" title="Open full screen"><ExternalLink className="w-3 h-3 text-gray-400" /></button>
                        </div>
                      </div>

                      {/* Inline bar chart visualisation */}
                      <div className="bg-white rounded-lg border border-gray-100 p-3 mb-2.5">
                        {[
                          { branch: "Sydney Metro", value: 342180, pct: 100 },
                          { branch: "Melbourne", value: 298450, pct: 87 },
                          { branch: "Brisbane", value: 187320, pct: 55 },
                          { branch: "Adelaide", value: 124890, pct: 37 },
                          { branch: "Perth", value: 98760, pct: 29 },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                            <span className="w-24 text-xs text-gray-500 truncate text-right">{row.branch}</span>
                            <div className="flex-1 h-5 bg-gray-50 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all flex items-center justify-end pr-2"
                                style={{
                                  width: `${row.pct}%`,
                                  backgroundColor: `${brand.secondary1}${i === 0 ? "cc" : i === 1 ? "aa" : i === 2 ? "88" : i === 3 ? "66" : "44"}`,
                                }}
                              >
                                {row.pct > 40 && (
                                  <span className="text-white text-xs font-medium" style={{ fontSize: "10px" }}>
                                    ${(row.value / 1000).toFixed(0)}K
                                  </span>
                                )}
                              </div>
                            </div>
                            {row.pct <= 40 && (
                              <span className="text-xs text-gray-500 font-mono w-12">${(row.value / 1000).toFixed(0)}K</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Data Table */}
                      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden mb-2.5">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-2.5 py-1.5 text-left font-medium text-gray-500">Branch</th>
                              <th className="px-2.5 py-1.5 text-right font-medium text-gray-500">Revenue</th>
                              <th className="px-2.5 py-1.5 text-right font-medium text-gray-500">Orders</th>
                              <th className="px-2.5 py-1.5 text-right font-medium text-gray-500">GP%</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { branch: "10 — Sydney Metro", revenue: "$342,180", orders: "487", gp: "34.2%", up: true },
                              { branch: "20 — Melbourne", revenue: "$298,450", orders: "412", gp: "31.8%", up: true },
                              { branch: "30 — Brisbane", revenue: "$187,320", orders: "298", gp: "35.1%", up: false },
                              { branch: "40 — Adelaide", revenue: "$124,890", orders: "189", gp: "29.4%", up: true },
                              { branch: "50 — Perth", revenue: "$98,760", orders: "156", gp: "32.7%", up: false },
                            ].map((row, i) => (
                              <tr key={i} className="border-t border-gray-50">
                                <td className="px-2.5 py-1.5 text-gray-700">{row.branch}</td>
                                <td className="px-2.5 py-1.5 text-right font-mono text-gray-700">{row.revenue}</td>
                                <td className="px-2.5 py-1.5 text-right font-mono text-gray-500">{row.orders}</td>
                                <td className="px-2.5 py-1.5 text-right">
                                  <span className="inline-flex items-center gap-0.5">
                                    {row.up ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
                                    <span className={`font-mono ${row.up ? "text-emerald-600" : "text-red-500"}`}>{row.gp}</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                            <tr className="border-t-2 border-gray-200 bg-gray-50">
                              <td className="px-2.5 py-1.5 font-semibold text-gray-800">Total</td>
                              <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-gray-800">$1,051,600</td>
                              <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-gray-700">1,542</td>
                              <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-gray-700">32.8%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* AI Summary */}
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-xs text-emerald-800 leading-relaxed">
                        <p className="flex items-center gap-1.5 font-medium mb-1">
                          <Zap className="w-3 h-3" /> Key Insights
                        </p>
                        <p>Sydney Metro leads with 32.5% of total revenue. Brisbane has the highest GP% at 35.1% despite being 3rd in volume. Adelaide's GP of 29.4% is below the 32.8% company average — worth investigating pricing.</p>
                      </div>
                    </div>

                    {/* Report Actions */}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Download className="w-3 h-3" /> Export CSV
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <FileSpreadsheet className="w-3 h-3" /> Export Excel
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Printer className="w-3 h-3" /> Print
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Bookmark className="w-3 h-3" /> Save Report
                      </button>
                    </div>

                    {/* Refinement Chips */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[
                        "Add comparison to last month",
                        "Break down Sydney by product group",
                        "Show as line chart",
                        "Filter to branches under target"
                      ].map(s => (
                        <button
                          key={s}
                          className="px-2.5 py-1 text-xs rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100 shrink-0">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      placeholder="Describe the report you need..."
                      rows={2}
                      className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:border-transparent pr-10"
                      style={{ focusRingColor: brand.tertiary1 }}
                    />
                    <button className="absolute right-2 bottom-2 p-1 rounded-lg hover:bg-gray-100">
                      <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                  <button className="p-2.5 rounded-xl text-white shrink-0" style={{ backgroundColor: brand.tertiary1 }}>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-center text-gray-300 mt-1.5" style={{ fontSize: "10px" }}>
                  AI-generated reports should be verified against source data
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
