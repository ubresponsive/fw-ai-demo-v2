export const getChartColors = (isDark: boolean) => ({
  // Primary revenue/main metrics
  primary: isDark ? '#6875f5' : '#485DCA',        // primary-400 : primary-500
  primaryGradient: isDark ? '#6875f5' : '#485DCA',

  // Secondary/cost/alternative lines
  secondary: isDark ? '#14b8a6' : '#14b8a6',      // tertiary works both modes

  // Grid, axes, and structure
  grid: isDark ? '#334155' : '#f3f4f6',           // slate-700 : gray-100
  axis: isDark ? '#64748b' : '#9ca3af',           // slate-500 : gray-400
  axisLine: isDark ? '#475569' : '#e5e7eb',       // slate-600 : gray-200

  // Semantic colors for status/categories
  success: isDark ? '#10b981' : '#059669',        // emerald-500 : emerald-600
  warning: isDark ? '#f59e0b' : '#d97706',        // amber-500 : amber-600
  danger: isDark ? '#ef4444' : '#dc2626',         // red-500 : red-600
  info: isDark ? '#3b82f6' : '#2563eb',           // blue-500 : blue-600

  // Category pie chart colors (6 categories)
  categories: isDark
    ? ['#6875f5', '#14b8a6', '#8b5cf6', '#06b6d4', '#f59e0b', '#64748b'] // Vibrant dark mode
    : ['#485DCA', '#3aa8d0', '#14b8a6', '#7281de', '#65c0de', '#9ca3af'], // Existing light

  // Tooltip styling
  tooltipBg: isDark ? '#1e293b' : '#ffffff',
  tooltipBorder: isDark ? '#475569' : '#e5e7eb',
  tooltipText: isDark ? '#f1f5f9' : '#111827',
})
