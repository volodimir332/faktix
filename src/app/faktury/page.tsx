"use client";

import { useState, useEffect } from "react";
import { 
  FileText,
  CheckCircle,
  Plus,
  Search,
  Bell,
  Copy,
  MoreHorizontal,
  ChevronDown,
  Filter,
  Download,
  ArrowUpDown,
  Eye,
  Edit,
  Clock,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { NewInvoiceModal } from "@/components/NewInvoiceModal";
import { useInvoices } from "@/contexts/InvoiceContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAutoUpdatedStatus } from "@/lib/invoice-utils";

export default function FakturyPage() {
  const router = useRouter();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const { invoices, updateInvoiceStatus } = useInvoices();
  const { t } = useLanguage();

  // Автоматичне оновлення статусів прострочених фактур
  useEffect(() => {
    invoices.forEach(invoice => {
      const newStatus = getAutoUpdatedStatus(invoice);
      if (newStatus !== invoice.status) {
        updateInvoiceStatus(invoice.id, newStatus);
      }
    });
  }, [invoices, updateInvoiceStatus]);

  // ---------- Filters / Sorting / Search ----------
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'sent' | 'overdue' | 'draft'>('all');
  const [dateFilter, setDateFilter] = useState<'this_month' | 'this_week' | 'this_quarter' | 'this_year' | 'all_time'>('this_month');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minTotal, setMinTotal] = useState<string>('');
  const [maxTotal, setMaxTotal] = useState<string>('');
  const [moreOpen, setMoreOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  const [sort, setSort] = useState<{ key: 'invoiceNumber' | 'customer' | 'date' | 'dueDate' | 'total'; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' });

  const uniqueClients = Array.from(new Set(invoices.map((i) => i.customer))).sort();

  const getPeriodStart = (mode: typeof dateFilter): Date | null => {
    const now = new Date();
    const start = new Date(now);
    if (mode === 'all_time') return null;
    if (mode === 'this_month') { start.setDate(1); start.setHours(0,0,0,0); return start; }
    if (mode === 'this_week') {
      const day = now.getDay();
      const diff = (day === 0 ? 6 : day - 1); // Monday start
      start.setDate(now.getDate() - diff); start.setHours(0,0,0,0); return start;
    }
    if (mode === 'this_quarter') {
      const q = Math.floor(now.getMonth() / 3);
      start.setMonth(q * 3, 1); start.setHours(0,0,0,0); return start;
    }
    if (mode === 'this_year') { start.setMonth(0,1); start.setHours(0,0,0,0); return start; }
    return null;
  };

  const periodStart = getPeriodStart(dateFilter);

  const normalized = (v: unknown): number => {
    const n = typeof v === 'number' ? v : Number(v);
    return isNaN(n) ? 0 : n;
  };

  const filteredInvoices = invoices
    .filter((inv) => statusFilter === 'all' ? true : inv.status === statusFilter)
    .filter((inv) => clientFilter === 'all' ? true : inv.customer === clientFilter)
    .filter((inv) => {
      if (!periodStart) return true;
      const d = new Date(inv.date);
      return !isNaN(d.getTime()) && d >= periodStart;
    })
    .filter((inv) => {
      const minOk = minTotal ? normalized(inv.total) >= Number(minTotal) : true;
      const maxOk = maxTotal ? normalized(inv.total) <= Number(maxTotal) : true;
      return minOk && maxOk;
    })
    .filter((inv) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        String(inv.invoiceNumber).toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        (inv.items[0]?.description || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      const key = sort.key;

      let av: number | string;
      let bv: number | string;

      if (key === 'total') {
        av = normalized(a.total);
        bv = normalized(b.total);
      } else if (key === 'date' || key === 'dueDate') {
        av = new Date(a[key]).getTime();
        bv = new Date(b[key]).getTime();
      } else if (key === 'invoiceNumber' || key === 'customer') {
        av = String(a[key]);
        bv = String(b[key]);
      } else {
        av = 0;
        bv = 0;
      }

      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });

  // Calculate statistics from filtered list for visible context
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const unpaidInvoices = invoices.filter(inv => inv.status === 'sent').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  
  const paidAmount = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const unpaidAmount = invoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.total, 0);
  const overdueAmount = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="bg-money/20 text-money px-3 py-1 rounded-full text-xs font-medium border border-money/30">{t('status.paid')}</span>;
      case 'sent':
        return <span className="bg-gray-700/60 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-600">{t('status.sent')}</span>;
      case 'overdue':
        return <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium border border-red-500/30 whitespace-nowrap">{t('status.overdue')}</span>;
      case 'draft':
        return <span className="bg-gray-700/60 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-600">{t('status.draft')}</span>;
      default:
        return <span className="bg-gray-700/60 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-600">{t('status.draft')}</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK'
    }).format(amount);
  };
  
  // ---------- Export CSV ----------
  const handleExportCSV = () => {
    const headers = ['invoiceNumber','customer','date','dueDate','total','status'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      inv.customer,
      inv.date,
      inv.dueDate,
      normalized(inv.total),
      inv.status
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (key: typeof sort.key) => {
    setSort(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <div className="ml-0 md:ml-16 min-h-screen">

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/20 to-black/40">
        {/* Top Bar */}
        <div className="border-b border-gray-700 p-3 md:p-6 pt-16 md:pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">{t('invoices.title')}</h1>
              <p className="text-xs md:text-sm text-gray-400 mt-1">{t('invoices.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto flex-wrap gap-2">
              {/* Quick Actions */}
              <button 
                onClick={() => setIsInvoiceModalOpen(true)}
                className="bg-money text-black px-3 md:px-4 py-2 text-xs md:text-sm flex items-center rounded-lg font-medium hover:bg-money-dark transition-colors money-glow"
              >
                <Plus className="w-4 h-4 mr-1 md:mr-2" />
                {t('invoices.newInvoice')}
              </button>
              
              {/* Search */}
              <div className="relative flex-1 md:flex-initial">
                <input
                  type="text"
                  placeholder={t('invoices.search')}
                  className="minimal-input pl-10 pr-4 py-2 w-full md:w-64 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              
              {/* Notifications */}
              <button className="minimal-button p-2">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 md:p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="bg-gray-800/60 backdrop-blur-sm border-gray-thick rounded-xl p-4 md:p-6 hover:border-gray-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm md:text-base text-gray-400">{t('dashboard.totalInvoicesCard')}</div>
                <FileText className="w-6 h-6 md:w-10 md:h-10 text-gray-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{totalInvoices}</div>
              <div className="text-xs md:text-sm text-gray-300 mt-1 font-medium">{t('dashboard.thisMonth')}</div>
            </div>

            <div className="bg-gradient-to-br from-money/20 to-money/10 backdrop-blur-sm border-money-thick rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm md:text-base text-gray-400">{t('dashboard.paidCard')}</div>
                <CheckCircle className="w-6 h-6 md:w-10 md:h-10 text-money" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{paidInvoices}</div>
              <div className="text-xs md:text-sm text-money mt-1 font-medium">{formatCurrency(paidAmount)}</div>
            </div>

            <div className="bg-orange-900/30 backdrop-blur-sm border-orange-thick rounded-xl p-4 md:p-6 hover:border-orange-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm md:text-base text-gray-400">{t('dashboard.unpaidCard')}</div>
                <Clock className="w-6 h-6 md:w-10 md:h-10 text-orange-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{unpaidInvoices}</div>
              <div className="text-xs md:text-sm text-orange-300 mt-1 font-medium">{formatCurrency(unpaidAmount)}</div>
            </div>

            <div className="bg-red-900/30 backdrop-blur-sm border-red-thick rounded-xl p-4 md:p-6 hover:border-red-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm md:text-base text-gray-400">{t('dashboard.overdueCard')}</div>
                <Clock className="w-6 h-6 md:w-10 md:h-10 text-red-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{overdueInvoices}</div>
              <div className="text-xs md:text-sm text-red-300 mt-1 font-medium">{formatCurrency(overdueAmount)}</div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
            <div className="flex items-center space-x-2 md:space-x-3 w-full md:w-auto overflow-x-auto">
              {/* Status Filter */}
              <div className="relative group">
                <button onClick={() => setStatusMenuOpen(v=>!v)} className="bg-gray-900/60 border border-gray-700/50 hover:border-money/50 px-4 py-2.5 rounded-lg text-sm flex items-center min-w-[160px] justify-between transition-all group-hover:bg-gray-800/60">
                  <span>
                    {statusFilter === 'all' ? t('filters.allStatuses') : t(`status.${statusFilter}`)}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-money transition-colors" />
                </button>
                {statusMenuOpen && (
                  <div className="absolute z-20 mt-2 w-56 bg-black border border-gray-700 rounded-lg shadow-lg p-2">
                    {([
                      { id: 'all', label: t('filters.allStatuses') },
                      { id: 'paid', label: t('status.paid') },
                      { id: 'sent', label: t('status.sent') },
                      { id: 'overdue', label: t('status.overdue') },
                      { id: 'draft', label: t('status.draft') }
                    ] as { id: 'all' | 'paid' | 'sent' | 'overdue' | 'draft'; label: string }[]).map((opt) => (
                      <button
                        key={opt.id}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-gray-800 ${statusFilter===opt.id?'text-money':''}`}
                        onClick={() => { setStatusFilter(opt.id); setStatusMenuOpen(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Filter */}
              <div className="relative group">
                <button onClick={() => setDateMenuOpen(v=>!v)} className="bg-gray-900/60 border border-gray-700/50 hover:border-money/50 px-4 py-2.5 rounded-lg text-sm flex items-center min-w-[160px] justify-between transition-all group-hover:bg-gray-800/60">
                  <span>
                    {dateFilter==='this_month'?t('dashboard.thisMonth'):dateFilter==='this_week'?t('period.week'):dateFilter==='this_quarter'?t('period.quarter'):dateFilter==='this_year'?t('period.year'):t('filters.allTime')}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-money transition-colors" />
                </button>
                {dateMenuOpen && (
                  <div className="absolute z-20 mt-2 w-56 bg-black border border-gray-700 rounded-lg shadow-lg p-2">
                    {([
                      { id: 'this_week', label: t('period.week') },
                      { id: 'this_month', label: t('dashboard.thisMonth') },
                      { id: 'this_quarter', label: t('period.quarter') },
                      { id: 'this_year', label: t('period.year') },
                      { id: 'all_time', label: t('filters.allTime') }
                    ] as { id: 'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'all_time'; label: string }[]).map((opt) => (
                      <button
                        key={opt.id}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-gray-800 ${dateFilter===opt.id?'text-money':''}`}
                        onClick={() => { setDateFilter(opt.id); setDateMenuOpen(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Filter */}
              <div className="relative group">
                <button onClick={() => setClientMenuOpen(v=>!v)} className="bg-gray-900/60 border border-gray-700/50 hover:border-money/50 px-4 py-2.5 rounded-lg text-sm flex items-center min-w-[160px] justify-between transition-all group-hover:bg-gray-800/60">
                  <span>{clientFilter==='all'?t('filters.allClients'):clientFilter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-money transition-colors" />
                </button>
                {clientMenuOpen && (
                  <div className="absolute z-20 mt-2 w-60 max-h-64 overflow-auto bg-black border border-gray-700 rounded-lg shadow-lg p-2">
                    <button className={`w-full text-left px-3 py-2 rounded hover:bg-gray-800 ${clientFilter==='all'?'text-money':''}`} onClick={() => { setClientFilter('all'); setClientMenuOpen(false); }}>{t('filters.allClients')}</button>
                    {uniqueClients.map(c => (
                      <button key={c} className={`w-full text-left px-3 py-2 rounded hover:bg-gray-800 ${clientFilter===c?'text-money':''}`} onClick={() => { setClientFilter(c); setClientMenuOpen(false); }}>{c}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={() => setMoreOpen(v=>!v)} className="bg-gray-900/60 border border-gray-700/50 hover:border-money/50 px-4 py-2.5 text-sm flex items-center rounded-lg transition-all relative">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-300">{t('filters.moreFilters')}</span>
                {moreOpen && (
                  <div className="absolute right-0 top-11 z-20 w-72 bg-black border border-gray-700 rounded-lg shadow-lg p-4">
                    <div className="text-sm text-gray-300 mb-3">{t('filters.amountRange')}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" placeholder={t('filters.min')} value={minTotal} onChange={e=>setMinTotal(e.target.value)} className="minimal-input px-3 py-2" />
                      <input type="number" placeholder={t('filters.max')} value={maxTotal} onChange={e=>setMaxTotal(e.target.value)} className="minimal-input px-3 py-2" />
                    </div>
                    <div className="flex justify-end space-x-2 mt-3">
                      <button className="text-gray-300 hover:text-white text-sm" onClick={()=>{setMinTotal('');setMaxTotal('');setMoreOpen(false);}}>{t('common.clear')}</button>
                      <button className="text-money hover:text-white text-sm" onClick={()=>setMoreOpen(false)}>{t('common.apply')}</button>
                    </div>
                  </div>
                )}
              </button>
              <button onClick={handleExportCSV} className="bg-money/10 border border-money/50 text-money px-4 py-2.5 text-sm flex items-center rounded-lg hover:bg-money hover:text-black transition-all">
                <Download className="w-4 h-4 mr-2" />
                {t('common.export')}
              </button>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/60 border-b border-gray-700/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-3 accent-money" />
                        {t('table.invoiceNumber')}
                      <ArrowUpDown onClick={() => toggleSort('invoiceNumber')} className={`w-4 h-4 ml-1 cursor-pointer transition-colors ${sort.key==='invoiceNumber'?'text-money':'text-gray-400 hover:text-money'}`} />
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    <div className="flex items-center">
                        {t('table.client')}
                      <ArrowUpDown onClick={() => toggleSort('customer')} className={`w-4 h-4 ml-1 cursor-pointer transition-colors ${sort.key==='customer'?'text-money':'text-gray-400 hover:text-money'}`} />
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    <div className="flex items-center">
                        {t('table.date')}
                      <ArrowUpDown onClick={() => toggleSort('date')} className={`w-4 h-4 ml-1 cursor-pointer transition-colors ${sort.key==='date'?'text-money':'text-gray-400 hover:text-money'}`} />
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    <div className="flex items-center">
                        {t('table.dueDate')}
                      <ArrowUpDown onClick={() => toggleSort('dueDate')} className={`w-4 h-4 ml-1 cursor-pointer transition-colors ${sort.key==='dueDate'?'text-money':'text-gray-400 hover:text-money'}`} />
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    <div className="flex items-center">
                        {t('table.amount')}
                      <ArrowUpDown onClick={() => toggleSort('total')} className={`w-4 h-4 ml-1 cursor-pointer transition-colors ${sort.key==='total'?'text-money':'text-gray-400 hover:text-money'}`} />
                    </div>
                  </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">{t('table.status')}</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                  {filteredInvoices.map((invoice, index) => (
                    <tr key={`invoice-${invoice.id}-${index}`} className="hover:bg-gray-800/30 transition-colors bg-black/20">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-3 accent-money" />
                      <div>
                            <div className="font-medium text-money">#{invoice.invoiceNumber}</div>
                            <div className="text-xs text-gray-400">{invoice.items[0]?.description || t('invoices.title')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                        <div className="font-medium">{invoice.customer}</div>
                  </td>
                      <td className="py-4 px-6 text-gray-300">{invoice.date}</td>
                      <td className="py-4 px-6 text-gray-300">{invoice.dueDate}</td>
                  <td className="py-4 px-6">
                        <span className="font-medium text-money">{formatCurrency(invoice.total)}</span>
                  </td>
                  <td className="py-4 px-6">
                        {getStatusBadge(invoice.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {/* Quick Status Change Buttons */}
                      <button 
                        onClick={() => {
                          // Toggle between paid and sent
                          const newStatus = invoice.status === 'paid' ? 'sent' : 'paid';
                          updateInvoiceStatus(invoice.id, newStatus);
                        }}
                        className={`p-1 rounded transition-colors ${
                          invoice.status === 'paid'
                            ? 'text-green-500 hover:text-green-400 hover:bg-green-500/10'
                            : 'text-gray-400 hover:text-green-500 hover:bg-green-500/10'
                        }`}
                        title={invoice.status === 'paid' ? t('action.markAsUnpaid') : t('action.markAsPaid')}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      
                      <div className="w-px h-4 bg-gray-600 mx-1"></div>
                      
                      {/* Regular Action Buttons */}
                      <button 
                        onClick={() => router.push(`/faktury/${invoice.id}`)}
                        className="text-gray-400 hover:text-money transition-colors p-1"
                        title="Zobrazit"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => router.push(`/faktury/${invoice.id}`)}
                        className="text-gray-400 hover:text-money transition-colors p-1"
                        title="Upravit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-money transition-colors p-1"
                        title="Kopírovat"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-money transition-colors p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                  ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Invoice Modal */}
      <NewInvoiceModal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
      />
      </div>
    </div>
  );
} 