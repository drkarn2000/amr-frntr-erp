'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BarChart3,
  Download,
  TrendingUp,
  PoundSterling,
  ShieldAlert,
  Boxes,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  PieChart,
} from 'lucide-react';

export default function ReportsPage() {
  const { projects, payments, sourcedProducts, defects, maintenancePlans, showToast } = useApp();

  const totalSettled = projects.reduce((acc, p) => acc + p.settledValue, 0);
  const totalReceived = projects.reduce((acc, p) => acc + p.receivedValue, 0);
  const committedSpend = sourcedProducts.reduce((acc, s) => acc + s.totalCost, 0);
  const openDefects = defects.filter((d) => d.status !== 'Resolved' && d.status !== 'Closed').length;

  const handleExport = () => {
    showToast('Exporting executive report pack (PDF / Excel)', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            BUSINESS INTELLIGENCE & COMMERCIAL ANALYTICS
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Reports & Performance
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Executive financial summaries, cash inflow forecasting, project delivery velocity, and supply chain audit reports.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={<Download className="w-4 h-4 text-[#4268e8]" />}
          onClick={handleExport}
        >
          Export Management Report
        </Button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Settled Project Value"
          value={`£${(totalSettled / 1000).toFixed(1)}k`}
          trend="Approved contracts & add-ons"
          trendType="neutral"
          icon={<FileSpreadsheet className="w-5 h-5" />}
        />
        <StatCard
          label="Cash Inflow Settled"
          value={`£${(totalReceived / 1000).toFixed(1)}k`}
          trend="Cleared in bank accounts"
          trendType="positive"
          icon={<PoundSterling className="w-5 h-5" />}
        />
        <StatCard
          label="Committed Material Spend"
          value={`£${(committedSpend / 1000).toFixed(1)}k`}
          trend="Binding purchase orders"
          trendType="neutral"
          icon={<Boxes className="w-5 h-5" />}
        />
        <StatCard
          label="Active Quality Snags"
          value={openDefects.toString().padStart(2, '0')}
          trend="Under active rectification"
          trendType="warning"
          icon={<ShieldAlert className="w-5 h-5" />}
        />
      </div>

      {/* Main Grid: Cash Inflow Visualization & Reports Catalogue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Cash Flow Forecast Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8edf3] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                  Monthly Cash Inflow Forecast (£)
                </h2>
                <p className="text-xs text-[#7b8798]">
                  Milestone billing settlement trajectory based on scheduled delivery dates
                </p>
              </div>
              <Badge variant="blue">Rolling 5-Month Projection</Badge>
            </div>

            {/* Custom Bar Visualization */}
            <div className="pt-8 pb-4">
              <div className="flex items-end justify-between gap-4 h-56 border-b border-[#e8edf3] px-2 sm:px-6">
                {/* Sep */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-[#7b8798] opacity-0 group-hover:opacity-100 transition-opacity">
                    £42k
                  </span>
                  <div
                    className="w-full max-w-[50px] bg-[#cbd5fb] group-hover:bg-[#4268e8] rounded-t-lg transition-all duration-300"
                    style={{ height: '75px' }}
                  />
                  <span className="text-xs font-bold text-[#17243b]">Sep 2026</span>
                </div>

                {/* Oct */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-[#7b8798] opacity-0 group-hover:opacity-100 transition-opacity">
                    £78k
                  </span>
                  <div
                    className="w-full max-w-[50px] bg-[#9fb0f5] group-hover:bg-[#4268e8] rounded-t-lg transition-all duration-300"
                    style={{ height: '135px' }}
                  />
                  <span className="text-xs font-bold text-[#17243b]">Oct 2026</span>
                </div>

                {/* Nov (Current) */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-extrabold text-[#4268e8]">
                    £112k
                  </span>
                  <div
                    className="w-full max-w-[50px] bg-[#4268e8] shadow-md rounded-t-lg transition-all duration-300 relative"
                    style={{ height: '190px' }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#17243b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      Current
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#4268e8]">Nov 2026</span>
                </div>

                {/* Dec */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-[#7b8798] opacity-0 group-hover:opacity-100 transition-opacity">
                    £68k
                  </span>
                  <div
                    className="w-full max-w-[50px] bg-[#cbd5fb] group-hover:bg-[#4268e8] rounded-t-lg transition-all duration-300"
                    style={{ height: '115px' }}
                  />
                  <span className="text-xs font-bold text-[#17243b]">Dec 2026</span>
                </div>

                {/* Jan */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-[#7b8798] opacity-0 group-hover:opacity-100 transition-opacity">
                    £95k
                  </span>
                  <div
                    className="w-full max-w-[50px] bg-[#9fb0f5] group-hover:bg-[#4268e8] rounded-t-lg transition-all duration-300"
                    style={{ height: '160px' }}
                  />
                  <span className="text-xs font-bold text-[#17243b]">Jan 2027</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#7b8798]">
            <span>Average project gross margin: <b className="text-[#16845f]">34.2%</b></span>
            <span>Target monthly billing: <b className="text-[#17243b]">£75,000</b></span>
          </div>
        </div>

        {/* Right 1 Col: Standard Reports Catalogue */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm md:text-base font-bold text-[#17243b] mb-1">
              Standard Management Reports
            </h2>
            <p className="text-xs text-[#7b8798] mb-4">Exportable operational & financial audit reports</p>

            <div className="space-y-2.5">
              {[
                { title: 'Project Profitability & Margin Ledger', icon: PoundSterling, desc: 'Gross margin vs workshop labor and material costs' },
                { title: 'Client Aged Debt & Outstanding Invoices', icon: TrendingUp, desc: '30/60/90-day receivable balance schedule' },
                { title: 'Milestone Delivery Velocity & Health', icon: Clock, desc: 'On-time stage completion across all fit-outs' },
                { title: 'Supplier Lead Time & Reliability Audits', icon: Boxes, desc: 'Vendor delivery accuracy and defect rates' },
                { title: 'Snagging Defect Root Cause Analysis', icon: ShieldAlert, desc: 'Defect distribution by supplier and component' },
                { title: 'Warranty & Maintenance Opportunity Pipeline', icon: CheckCircle2, desc: 'Recurring contract revenue tracking' },
              ].map((rep) => {
                const Icon = rep.icon;
                return (
                  <div
                    key={rep.title}
                    onClick={() => showToast(`Generating "${rep.title}" (demo)`, 'info')}
                    className="p-3 rounded-xl border border-[#e8edf3] hover:border-[#cbd5e1] hover:bg-[#f8fafc] cursor-pointer transition-colors group flex items-start justify-between"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#edf1ff] text-[#4268e8] group-hover:scale-105 transition-transform mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#17243b] group-hover:text-[#4268e8]">
                          {rep.title}
                        </div>
                        <div className="text-[10px] text-[#7b8798]">{rep.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-[#4268e8] shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-[10px] text-[#7b8798]">
            Role-Based Filtering: Internal costs and margin visibility are automatically restricted based on logged-in user permissions.
          </div>
        </div>
      </div>
    </div>
  );
}

