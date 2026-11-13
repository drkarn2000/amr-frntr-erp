'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FolderKanban,
  PoundSterling,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  AlertCircle,
  Truck,
  Mail,
  FileCheck,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Boxes,
  UserCheck,
  FileText,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const {
    projects,
    clients,
    quotations,
    documents,
    payments,
    vendorPayments,
    milestones,
    tasks,
    sourcedProducts,
    purchaseOrders,
    defects,
    maintenancePlans,
    emails,
    currentRole,
    permissions,
    setIsQuickActionOpen,
    setIsNotificationOpen,
  } = useApp();

  const [dashboardView, setDashboardView] = useState<
    'management' | 'pm' | 'india' | 'procurement' | 'finance'
  >(permissions.defaultDashboard);

  // Sync dashboard view when role changes in Topbar
  useEffect(() => {
    setDashboardView(permissions.defaultDashboard);
  }, [permissions.defaultDashboard]);

  // Core Metrics
  const activeProjects = projects.filter(
    (p) => p.stage !== 'Completed' && p.stage !== 'Cancelled'
  ).length;
  const totalSettled = projects.reduce((acc, p) => acc + (p.settledValue || 0), 0);
  const totalReceived = projects.reduce((acc, p) => acc + (p.receivedValue || 0), 0);
  const totalOutstanding = totalSettled - totalReceived;

  const committedSupplierSpend = sourcedProducts.reduce((acc, s) => acc + s.totalCost, 0);
  const estimatedGrossMargin = Math.round(((totalSettled - committedSupplierSpend * 2.4) / totalSettled) * 100);

  const overdueMilestones = milestones.filter(
    (m) => m.status === 'Overdue' || (m.status !== 'Completed' && new Date(m.dueDate) < new Date())
  );

  const inProductionCount = projects.filter((p) => p.stage === 'Production').length;
  const inInstallationCount = projects.filter((p) => p.stage === 'Installation').length;
  const awaitingApprovalCount = projects.filter(
    (p) => p.stage === 'Awaiting Client Approval' || p.stage === 'Quotation'
  ).length;

  const overduePayments = payments.filter((p) => p.status === 'Overdue');
  const delayedShipments = sourcedProducts.filter(
    (s) => s.status === 'Delayed' || s.status === 'Defective'
  );
  const emailsAwaitingReply = emails.filter((e) => e.needsReply);
  const pendingQuotes = quotations.filter((q) => !q.isLocked);
  const openDefects = defects.filter((d) => d.status !== 'Resolved' && d.status !== 'Closed');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            OPERATIONS CONTROL CENTRE · ACTIVE ROLE: {currentRole.toUpperCase()}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1 flex items-center gap-2">
            AMR FRNTR Command Dashboard <span className="text-amber-500 text-xl">✦</span>
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Role-tailored visibility across UK client projects, India coordination, sourcing, payments, and project health.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {permissions.canEdit && (
            <Button
              variant="secondary"
              icon={<Plus className="w-4 h-4 text-[#4268e8]" />}
              onClick={() => setIsQuickActionOpen(true)}
            >
              Quick create
            </Button>
          )}
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => router.push('/projects')}
          >
            View all projects
          </Button>
        </div>
      </div>

      {/* Section 17: 5 Role-Specific Dashboard Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-[#e8edf3] shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'management', label: '1. Management Overview', badge: 'Director / Exec' },
            { id: 'pm', label: '2. UK Project Manager', badge: 'Sales & Delivery' },
            { id: 'india', label: '3. India Backend', badge: 'CAD & Sourcing Follow-up' },
            { id: 'procurement', label: '4. Procurement Desk', badge: 'RFQs, POs & Spend' },
            { id: 'finance', label: '5. Finance & Cash Flow', badge: 'Invoices & Forecast' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDashboardView(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                dashboardView === tab.id
                  ? 'bg-[#17243b] text-white shadow-xs'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  dashboardView === tab.id
                    ? 'bg-white/15 text-[#d5b27a]'
                    : 'bg-[#f1f5f9] text-[#7b8798]'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {!permissions.canViewCostsAndMargins && (
          <div className="px-3 py-1.5 bg-[#fff1f2] border border-[#fecdd3] rounded-xl text-[11px] font-bold text-[#c84c58] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>RBAC Active: Internal margins & supplier costs masked for {currentRole}</span>
          </div>
        )}
      </div>

      {/* =====================================================================
          VIEW 1: MANAGEMENT DASHBOARD (Section 17.1)
          Active projects, value, overdue milestones, procurement risk,
          outstanding payments, monthly inflow, margin, defects, maintenance
      ===================================================================== */}
      {dashboardView === 'management' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Active Projects & Clients"
              value={`${activeProjects} / ${clients.length} Clients`}
              trend="↑ 3 projects added this quarter"
              trendType="positive"
              icon={<FolderKanban className="w-5 h-5" />}
              onClick={() => router.push('/projects')}
            />

            <StatCard
              label="Total Settled Value"
              value={
                permissions.canViewCostsAndMargins
                  ? `£${totalSettled.toLocaleString()}`
                  : 'Restricted (RBAC)'
              }
              trend={
                permissions.canViewCostsAndMargins
                  ? `Gross Margin Avg: ${estimatedGrossMargin}%`
                  : 'Commercial value hidden for role'
              }
              trendType="positive"
              icon={<PoundSterling className="w-5 h-5" />}
              onClick={() => router.push('/reports')}
            />

            <StatCard
              label="Payments Outstanding"
              value={
                permissions.canViewCostsAndMargins
                  ? `£${totalOutstanding.toLocaleString()}`
                  : 'Restricted'
              }
              trend={`${overduePayments.length} overdue (£12,500) · £42.5k Nov inflow`}
              trendType="warning"
              icon={<TrendingUp className="w-5 h-5" />}
              onClick={() => router.push('/payments')}
            />

            <StatCard
              label="Operational Risk Index"
              value={`${overdueMilestones.length} MS · ${openDefects.length} Snags`}
              trend={`${delayedShipments.length} procurement risk · ${maintenancePlans.length} care plans`}
              trendType="negative"
              icon={<Clock className="w-5 h-5" />}
              onClick={() => router.push('/milestones')}
            />
          </div>

          {/* Main Grid: Project Portfolio & Needs Your Attention */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Project Portfolio */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
              <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
                <div>
                  <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                    Project Portfolio & Health Matrix
                  </h2>
                  <p className="text-xs text-[#7b8798]">
                    Live production, installation, commercial margin, and Green/Amber/Red health
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-xs font-bold text-[#4268e8] hover:text-[#3455cc] flex items-center gap-1"
                >
                  All projects <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6">
                {/* Stage Progress Mini Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#edf0f5]">
                    <div className="text-xs font-semibold text-[#7b8798]">In Production</div>
                    <div className="text-xl font-extrabold text-[#17243b] mt-1">
                      {inProductionCount.toString().padStart(2, '0')}
                    </div>
                    <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#4268e8] h-full rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#edf0f5]">
                    <div className="text-xs font-semibold text-[#7b8798]">On-Site Installation</div>
                    <div className="text-xl font-extrabold text-[#17243b] mt-1">
                      {inInstallationCount.toString().padStart(2, '0')}
                    </div>
                    <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#1b9c88] h-full rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#edf0f5]">
                    <div className="text-xs font-semibold text-[#7b8798]">Awaiting Approval</div>
                    <div className="text-xl font-extrabold text-[#17243b] mt-1">
                      {awaitingApprovalCount.toString().padStart(2, '0')}
                    </div>
                    <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#b7791f] h-full rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>

                {/* Portfolio Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e8edf3] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                        <th className="pb-3 pr-4">Project</th>
                        <th className="pb-3 px-4">Client</th>
                        <th className="pb-3 px-4">Stage</th>
                        <th className="pb-3 px-4">Settled Value</th>
                        <th className="pb-3 pl-4 text-right">Health</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {projects.map((project) => (
                        <tr
                          key={project.id}
                          onClick={() => router.push(`/projects/${project.id}`)}
                          className="hover:bg-[#f8fafc] cursor-pointer transition-colors group"
                        >
                          <td className="py-3.5 pr-4 font-bold text-[#17243b] group-hover:text-[#4268e8]">
                            <div className="flex items-center gap-1.5">
                              <span>{project.name}</span>
                              <span className="text-[10px] font-normal text-[#94a3b8]">
                                ({project.code})
                              </span>
                            </div>
                          </td>
                          <td
                            className="py-3.5 px-4 text-[#4268e8] font-semibold hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/clients/${project.clientId}`);
                            }}
                          >
                            {project.clientName}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant="blue">{project.stage}</Badge>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#17243b]">
                            {permissions.canViewCostsAndMargins
                              ? `£${project.settledValue.toLocaleString()}`
                              : '🔒 Restricted'}
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            <Badge
                              variant={
                                project.health === 'green'
                                  ? 'green'
                                  : project.health === 'amber'
                                  ? 'amber'
                                  : 'red'
                              }
                              dot
                            >
                              {project.health === 'green'
                                ? 'Green'
                                : project.health === 'amber'
                                ? 'Amber'
                                : 'Red'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Needs Your Attention */}
            <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden flex flex-col">
              <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
                <h2 className="text-sm md:text-base font-bold text-[#17243b]">Needs Attention</h2>
                <Badge variant="amber">Active Alerts</Badge>
              </div>

              <div className="p-6 flex-1 space-y-4">
                <div
                  onClick={() => router.push('/payments')}
                  className="relative pl-6 pb-4 border-l-2 border-[#edf1ff] last:border-l-transparent cursor-pointer group"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#edf1ff] border-2 border-[#c84c58] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c84c58]" />
                  </div>
                  <div className="font-bold text-xs text-[#17243b] group-hover:text-[#c84c58] transition-colors">
                    Payment overdue · Riverside Hotel
                  </div>
                  <p className="text-[11px] text-[#7b8798] mt-0.5">£12,500 · Due 10 Nov 2026</p>
                  <Badge variant="red" className="mt-1.5">
                    3 days overdue
                  </Badge>
                </div>

                <div
                  onClick={() => router.push('/procurement')}
                  className="relative pl-6 pb-4 border-l-2 border-[#edf1ff] last:border-l-transparent cursor-pointer group"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#edf1ff] border-2 border-[#b7791f] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b7791f]" />
                  </div>
                  <div className="font-bold text-xs text-[#17243b] group-hover:text-[#b7791f] transition-colors">
                    Supplier delivery reminder (3 days)
                  </div>
                  <p className="text-[11px] text-[#7b8798] mt-0.5">
                    Oakline Supplies · Forest Green Velvet Fabric
                  </p>
                  <Badge variant="amber" className="mt-1.5">
                    PO-2026-018
                  </Badge>
                </div>

                <div
                  onClick={() => router.push('/communications')}
                  className="relative pl-6 pb-4 border-l-2 border-[#edf1ff] last:border-l-transparent cursor-pointer group"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#edf1ff] border-2 border-[#4268e8] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4268e8]" />
                  </div>
                  <div className="font-bold text-xs text-[#17243b] group-hover:text-[#4268e8] transition-colors">
                    Client email awaiting reply ({emailsAwaitingReply.length})
                  </div>
                  <p className="text-[11px] text-[#7b8798] mt-0.5">
                    North & Co. · Revised banquette alcove dimensions
                  </p>
                  <Badge variant="blue" className="mt-1.5">
                    Requires Reply
                  </Badge>
                </div>

                <div
                  onClick={() => router.push('/defects')}
                  className="relative pl-6 pb-1 border-l-2 border-transparent cursor-pointer group"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#edf1ff] border-2 border-[#16845f] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16845f]" />
                  </div>
                  <div className="font-bold text-xs text-[#17243b] group-hover:text-[#16845f] transition-colors">
                    Defects & Maintenance Follow-ups
                  </div>
                  <p className="text-[11px] text-[#7b8798] mt-0.5">
                    {openDefects.length} active snags · {maintenancePlans.length} aftercare plans
                  </p>
                  <Badge variant="green" className="mt-1.5">
                    Quality & Aftercare
                  </Badge>
                </div>
              </div>

              <div className="p-4 border-t border-[#e8edf3] bg-[#f8fafc]">
                <Button
                  variant="soft"
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  onClick={() => setIsNotificationOpen(true)}
                >
                  Open action centre
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          VIEW 2: UK PROJECT MANAGER DASHBOARD (Section 17.2)
          Assigned projects, emails awaiting response, milestones due,
          overdue sourcing, pending approvals, payments due
      ===================================================================== */}
      {dashboardView === 'pm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="My Assigned UK Projects"
              value={projects.filter((p) => p.owner === 'Sarah Mitchell').length}
              trend="Lead UK Project Manager"
              trendType="positive"
              icon={<FolderKanban className="w-5 h-5" />}
              onClick={() => router.push('/projects')}
            />
            <StatCard
              label="Emails Awaiting Response"
              value={emailsAwaitingReply.length}
              trend="Client inbox threads flagged"
              trendType="warning"
              icon={<Mail className="w-5 h-5" />}
              onClick={() => router.push('/communications')}
            />
            <StatCard
              label="Pending Quote / Drawing Approvals"
              value={pendingQuotes.length + documents.filter((d) => d.approvalStatus === 'Pending').length}
              trend="Awaiting client signature"
              trendType="warning"
              icon={<FileCheck className="w-5 h-5" />}
              onClick={() => router.push('/quotations')}
            />
            <StatCard
              label="Milestones & Payments Due"
              value={`${overdueMilestones.length} Overdue`}
              trend={`${overduePayments.length} overdue invoice chasers`}
              trendType="negative"
              icon={<Clock className="w-5 h-5" />}
              onClick={() => router.push('/milestones')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[#e8edf3] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#17243b]">Client Emails Awaiting Response</h3>
                <Button variant="secondary" size="sm" onClick={() => router.push('/communications')}>
                  Open Inbox
                </Button>
              </div>
              {emailsAwaitingReply.map((em) => (
                <div
                  key={em.id}
                  onClick={() => router.push('/communications')}
                  className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#4268e8] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#17243b]">{em.fromName} ({em.clientName})</span>
                    <Badge variant="amber">Needs Reply</Badge>
                  </div>
                  <div className="text-xs font-semibold text-[#4268e8] mt-1">{em.subject}</div>
                  <p className="text-[11px] text-[#64748b] mt-1 line-clamp-2">{em.snippet}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#e8edf3] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#17243b]">Pending Approvals & Milestones Due</h3>
                <Button variant="secondary" size="sm" onClick={() => router.push('/milestones')}>
                  View Schedule
                </Button>
              </div>
              {milestones.slice(0, 4).map((ms) => (
                <div
                  key={ms.id}
                  className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-[#17243b]">{ms.title}</div>
                    <div className="text-[11px] text-[#7b8798]">{ms.projectName} · Due {ms.dueDate}</div>
                  </div>
                  <Badge variant={ms.status === 'Overdue' ? 'red' : ms.status === 'Completed' ? 'green' : 'blue'}>
                    {ms.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: INDIA BACKEND COORDINATOR DASHBOARD (Section 17.3)
          Assigned tasks, unassigned communications, sourcing follow-ups,
          missing documents, project health
      ===================================================================== */}
      {dashboardView === 'india' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Assigned Backend Tasks"
              value={tasks.filter((t) => t.status !== 'Done').length}
              trend="CAD revisions & factory coordination"
              trendType="neutral"
              icon={<UserCheck className="w-5 h-5" />}
              onClick={() => router.push('/milestones')}
            />
            <StatCard
              label="Sourcing Follow-ups Due"
              value={sourcedProducts.filter((s) => s.status !== 'Delivered').length}
              trend="7 / 3 / 1 day vendor checks"
              trendType="warning"
              icon={<Truck className="w-5 h-5" />}
              onClick={() => router.push('/procurement')}
            />
            <StatCard
              label="Drawing Revisions Pending"
              value={documents.filter((d) => d.approvalStatus !== 'Approved').length}
              trend="CAD files awaiting client sign-off"
              trendType="warning"
              icon={<FileText className="w-5 h-5" />}
              onClick={() => router.push('/documents')}
            />
            <StatCard
              label="Projects At Risk (Amber/Red)"
              value={projects.filter((p) => p.health !== 'green').length}
              trend="Requires daily coordination check"
              trendType="negative"
              icon={<ShieldAlert className="w-5 h-5" />}
              onClick={() => router.push('/projects')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[#e8edf3] p-6 space-y-3">
              <h3 className="font-bold text-sm text-[#17243b]">Sourcing Follow-ups & 7/3/1-Day Alerts</h3>
              {sourcedProducts.map((sp) => (
                <div key={sp.id} className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#17243b]">{sp.description}</div>
                    <div className="text-[11px] text-[#7b8798]">
                      {sp.projectName} · {sp.vendorName} · Expected: {sp.expectedDelivery}
                    </div>
                  </div>
                  <Badge variant={sp.status === 'Delivered' ? 'green' : 'amber'}>{sp.status}</Badge>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#e8edf3] p-6 space-y-3">
              <h3 className="font-bold text-sm text-[#17243b]">CAD Drawings & Missing Approvals Checklist</h3>
              {documents.slice(0, 4).map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#17243b]">{doc.title} ({doc.version})</div>
                    <div className="text-[11px] text-[#7b8798]">{doc.projectName} · {doc.fileName}</div>
                  </div>
                  <Badge variant={doc.approvalStatus === 'Approved' ? 'green' : 'amber'}>
                    {doc.approvalStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 4: PROCUREMENT DASHBOARD (Section 17.4)
          Open RFQs, POs, expected deliveries, overdue suppliers,
          delayed products, committed spend
      ===================================================================== */}
      {dashboardView === 'procurement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Active Purchase Orders"
              value={purchaseOrders.length}
              trend="Issued across 5 vetted suppliers"
              trendType="neutral"
              icon={<Boxes className="w-5 h-5" />}
              onClick={() => router.push('/procurement')}
            />
            <StatCard
              label="Committed Supplier Spend"
              value={
                permissions.canViewCostsAndMargins
                  ? `£${committedSupplierSpend.toLocaleString()}`
                  : '🔒 Restricted'
              }
              trend="Direct materials & joinery sub-contracts"
              trendType="neutral"
              icon={<PoundSterling className="w-5 h-5" />}
              onClick={() => router.push('/procurement')}
            />
            <StatCard
              label="Expected Deliveries (7 Days)"
              value={sourcedProducts.filter((s) => s.status !== 'Delivered').length}
              trend="Automated chase reminders active"
              trendType="warning"
              icon={<Truck className="w-5 h-5" />}
              onClick={() => router.push('/procurement')}
            />
            <StatCard
              label="Delayed / Supplier Snags"
              value={openDefects.length}
              trend="Supplier rectification tracked"
              trendType="negative"
              icon={<ShieldAlert className="w-5 h-5" />}
              onClick={() => router.push('/defects')}
            />
          </div>

          <div className="bg-white rounded-2xl border border-[#e8edf3] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#17243b]">Committed Purchase Orders & Expected Deliveries</h3>
              <Button variant="primary" size="sm" onClick={() => router.push('/procurement')}>
                Open Procurement Hub
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] text-[10px] font-bold text-[#8792a1] uppercase">
                    <th className="py-3 pr-4">PO Number</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Expected Delivery</th>
                    <th className="py-3 px-4">Committed Spend</th>
                    <th className="py-3 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-[#f8fafc]">
                      <td className="py-3.5 pr-4 font-bold text-[#4268e8]">{po.poNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-[#17243b]">{po.projectName}</td>
                      <td className="py-3.5 px-4 text-[#334155]">{po.vendorName}</td>
                      <td className="py-3.5 px-4 text-[#64748b]">{po.itemsList}</td>
                      <td className="py-3.5 px-4 text-[#475569]">{po.expectedDelivery}</td>
                      <td className="py-3.5 px-4 font-bold text-[#17243b]">
                        {permissions.canViewCostsAndMargins ? `£${po.totalAmount.toLocaleString()}` : '🔒'}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <Badge variant={po.status === 'Delivered' ? 'green' : 'blue'}>{po.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 5: FINANCE DASHBOARD (Section 17.5)
          Upcoming/overdue/received payments and monthly forecast
      ===================================================================== */}
      {dashboardView === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Received (Cleared)"
              value={`£${totalReceived.toLocaleString()}`}
              trend="BACS & CHAPS settled"
              trendType="positive"
              icon={<CheckCircle2 className="w-5 h-5" />}
              onClick={() => router.push('/payments')}
            />
            <StatCard
              label="Outstanding Client Balance"
              value={`£${totalOutstanding.toLocaleString()}`}
              trend="Scheduled & invoiced receivables"
              trendType="warning"
              icon={<PoundSterling className="w-5 h-5" />}
              onClick={() => router.push('/payments')}
            />
            <StatCard
              label="Overdue Client Invoices"
              value="£12,500"
              trend="INV-1051 (Riverside Hotel)"
              trendType="negative"
              icon={<AlertCircle className="w-5 h-5" />}
              onClick={() => router.push('/payments')}
            />
            <StatCard
              label="Vendor Payables Scheduled"
              value={`£${vendorPayments.reduce((a, v) => a + (v.amount - v.paidAmount), 0).toLocaleString()}`}
              trend="Supplier PO settlement queue"
              trendType="neutral"
              icon={<TrendingUp className="w-5 h-5" />}
              onClick={() => router.push('/payments')}
            />
          </div>
        </div>
      )}

      {/* Bottom Grid: Upcoming Payments & Procurement Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Payments (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">Upcoming & Overdue Payments</h2>
              <p className="text-xs text-[#7b8798]">Receivable milestone billing schedule</p>
            </div>
            <Link
              href="/payments"
              className="text-xs font-bold text-[#4268e8] hover:text-[#3455cc] flex items-center gap-1"
            >
              Payment schedule <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e8edf3] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                  <th className="pb-3 pr-4">Client / Project</th>
                  <th className="pb-3 px-4">Invoice Ref</th>
                  <th className="pb-3 px-4">Due Date</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {payments.slice(0, 5).map((pay) => (
                  <tr
                    key={pay.id}
                    onClick={() => router.push('/payments')}
                    className="hover:bg-[#f8fafc] transition-colors cursor-pointer"
                  >
                    <td className="py-3 pr-4">
                      <div className="font-bold text-[#17243b]">{pay.projectName}</div>
                      <div className="text-[11px] text-[#7b8798]">
                        {pay.clientName} · {pay.stage}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#4268e8]">{pay.invoiceRef}</td>
                    <td className="py-3 px-4 text-[#475569]">{pay.dueDate}</td>
                    <td className="py-3 px-4 font-bold text-[#17243b]">
                      {permissions.canViewCostsAndMargins
                        ? `£${pay.amount.toLocaleString()}`
                        : '🔒 Restricted'}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <Badge
                        variant={
                          pay.status === 'Paid'
                            ? 'green'
                            : pay.status === 'Overdue'
                            ? 'red'
                            : pay.status === 'Upcoming'
                            ? 'amber'
                            : 'blue'
                        }
                      >
                        {pay.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Procurement Pulse (1 col) */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">Procurement Pulse</h2>
              <p className="text-xs text-[#7b8798]">Supply chain order status</p>
            </div>
            <Link
              href="/procurement"
              className="text-xs font-bold text-[#4268e8] hover:text-[#3455cc] flex items-center gap-1"
            >
              Open <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#edf0f5] text-center">
                <span className="text-[10px] font-bold text-[#7b8798] uppercase">Open POs</span>
                <div className="text-xl font-extrabold text-[#17243b] mt-1">
                  {purchaseOrders.length.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="p-3 bg-[#fff1f2] rounded-xl border border-[#fecdd3] text-center">
                <span className="text-[10px] font-bold text-[#c84c58] uppercase">Snags</span>
                <div className="text-xl font-extrabold text-[#c84c58] mt-1">
                  {openDefects.length.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="p-3 bg-[#f0fdf4] rounded-xl border border-[#bbf7d0] text-center">
                <span className="text-[10px] font-bold text-[#16845f] uppercase">Delivered</span>
                <div className="text-xl font-extrabold text-[#16845f] mt-1">
                  {sourcedProducts.filter((s) => s.status === 'Delivered').length.toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#edf1ff]/40 rounded-xl border border-[#cbd8ff] text-xs space-y-1">
              <div className="font-bold text-[#17243b] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#4268e8]" />
                Next Incoming Delivery (3-Day Alert)
              </div>
              <div className="text-[#475569]">
                Oakline Supplies · 120m Forest Green FR Velvet
              </div>
              <div className="text-[11px] text-[#7b8798]">Expected 16 Nov 2026 · Soho Site</div>
            </div>
          </div>

          <div className="p-4 border-t border-[#e8edf3] bg-[#f8fafc]">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.push('/procurement')}
            >
              Track All Purchase Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
