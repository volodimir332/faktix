"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Calendar,
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

  Check,
  X
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

  // Calculate statistics
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
  
  return (
    <div className="min-h-screen bg-black text-white flex">
              <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/20 to-black/40">
        {/* Top Bar */}
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{t('invoices.title')}</h1>
              <p className="text-sm text-gray-400 mt-1">{t('invoices.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <button 
                onClick={() => setIsInvoiceModalOpen(true)}
                className="bg-money text-black px-4 py-2 text-sm flex items-center rounded-lg font-medium hover:bg-money-dark transition-colors money-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('invoices.newInvoice')}
              </button>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('invoices.search')}
                  className="minimal-input pl-10 pr-4 py-2 w-64"
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
        <div className="flex-1 p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/60 backdrop-blur-sm border-gray-thick rounded-xl p-6 hover:border-gray-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base text-gray-400">{t('dashboard.totalInvoicesCard')}</div>
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-white">{totalInvoices}</div>
              <div className="text-sm text-gray-300 mt-1 font-medium">{t('dashboard.thisMonth')}</div>
            </div>

            <div className="bg-gradient-to-br from-money/20 to-money/10 backdrop-blur-sm border-money-thick rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base text-gray-400">{t('dashboard.paidCard')}</div>
                <CheckCircle className="w-10 h-10 text-money" />
              </div>
              <div className="text-3xl font-bold text-white">{paidInvoices}</div>
              <div className="text-sm text-money mt-1 font-medium">{formatCurrency(paidAmount)}</div>
            </div>

            <div className="bg-orange-900/30 backdrop-blur-sm border-orange-thick rounded-xl p-6 hover:border-orange-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base text-gray-400">{t('dashboard.unpaidCard')}</div>
                <Clock className="w-10 h-10 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-white">{unpaidInvoices}</div>
              <div className="text-sm text-orange-300 mt-1 font-medium">{formatCurrency(unpaidAmount)}</div>
            </div>

            <div className="bg-red-900/30 backdrop-blur-sm border-red-thick rounded-xl p-6 hover:border-red-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base text-gray-400">{t('dashboard.overdueCard')}</div>
                <Clock className="w-10 h-10 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white">{overdueInvoices}</div>
              <div className="text-sm text-red-300 mt-1 font-medium">{formatCurrency(overdueAmount)}</div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {/* Status Filter */}
              <div className="relative group">
                <button className="bg-gray-900/60 border border-gray-700/50 hover:border-money/50 px-4 py-2.5 rounded-lg text-sm flex items-center min-w-[130px] justify-between transition-all group-hover:bg-gray-800/60">
                  <span>{t('filters.allStatuses')}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-money transition-colors" />
                </button>
              </div>

              {/* Date Filter */}
              <div className="relative group">
                <button className="bg-gray-900/60 border border-gray-700/50 hover:border-money/50 px-4 py-2.5 rounded-lg text-sm flex items-center min-w-[130px] justify-between transition-all group-hover:bg-gray-800/60">
                  <span>{t('dashboard.thisMonth')}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-money transition-colors" />
                </button>
              </div>

              {/* Client Filter */}
              <div className="relative group">
                <button className="bg-gray-900/60 border border-gray-700/50 hover:border-money/50 px-4 py-2.5 rounded-lg text-sm flex items-center min-w-[130px] justify-between transition-all group-hover:bg-gray-800/60">
                  <span>{t('filters.allClients')}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-money transition-colors" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="bg-gray-900/60 border border-gray-700/50 hover:border-money/50 px-4 py-2.5 text-sm flex items-center rounded-lg transition-all">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-300">{t('filters.moreFilters')}</span>
              </button>
              <button className="bg-money/10 border border-money/50 text-money px-4 py-2.5 text-sm flex items-center rounded-lg hover:bg-money hover:text-black transition-all">
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
                      <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 hover:text-money cursor-pointer transition-colors" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    <div className="flex items-center">
                        {t('table.client')}
                      <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 hover:text-money cursor-pointer transition-colors" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    <div className="flex items-center">
                        {t('table.date')}
                      <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 hover:text-money cursor-pointer transition-colors" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    <div className="flex items-center">
                        {t('table.dueDate')}
                      <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 hover:text-money cursor-pointer transition-colors" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    <div className="flex items-center">
                        {t('table.amount')}
                      <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 hover:text-money cursor-pointer transition-colors" />
                    </div>
                  </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">{t('table.status')}</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                  {invoices.map((invoice, index) => (
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
  );
} 