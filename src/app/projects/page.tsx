'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  FolderKanban,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  FileSpreadsheet,
  FileText,
  Truck,
  ShoppingCart,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { ProjectStage, ProjectHealth } from '@/types';

const ALL_STAGES: ProjectStage[] = [
  'Lead / Enquiry',
  'Quotation',
  'Awaiting Client Approval',
  'Approved',
  'Design / Drawing',
  'Sourcing',
  'Production',
  'Delivery',
  'Installation',
  'Snagging',
  'Completed',
  'Maintenance',
  'On Hold',
  'Cancelled',
];

export default function ProjectsPage() {
  const router = useRouter();
  const {
    projects,
    clients,
    quotations,
    documents,
    sourcedProducts,
    purchaseOrders,
    milestones,
    emails,
    whatsappThreads,
    callLogs,
    permissions,
    addProject,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [healthFilter, setHealthFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    name: '',
    clientId: clients[0]?.id || '',
    siteAddress: '',
    owner: 'Sarah Mitchell',
    coordinator: 'Arjun Mehta',
    stage: 'Lead / Enquiry' as ProjectStage,
    health: 'green' as ProjectHealth,
    priority: 'Normal' as 'Normal' | 'High' | 'Urgent',
    approvedValue: 40000,
    targetCompletion: '2027-02-15',
    description: '',
  });

  // Calculate Metrics
  const totalProjects = projects.length;
  const inProgress = projects.filter(
    (p) => p.stage !== 'Completed' && p.stage !== 'Cancelled'
  ).length;
  const completed = projects.filter((p) => p.stage === 'Completed' || p.stage === 'Maintenance').length;
  const atRisk = projects.filter((p) => p.health === 'amber' || p.health === 'red').length;

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.siteAddress.toLowerCase().includes(q);
    const matchesStage = stageFilter === 'All' || p.stage === stageFilter;
    const matchesHealth = healthFilter === 'All' || p.health === healthFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All' || p.priority === priorityFilter;
    const matchesOwner = ownerFilter === 'All' || p.owner === ownerFilter;
    return matchesSearch && matchesStage && matchesHealth && matchesPriority && matchesOwner;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    const client = clients.find((c) => c.id === newProject.clientId) || clients[0];
    addProject({
      name: newProject.name,
      clientId: client.id,
      clientName: client.name,
      siteAddress: newProject.siteAddress || client.location,
      owner: newProject.owner,
      coordinator: newProject.coordinator,
      stage: newProject.stage,
      health: newProject.health,
      priority: newProject.priority,
      approvedValue: Number(newProject.approvedValue),
      targetCompletion: newProject.targetCompletion,
      description: newProject.description,
    });
    setIsCreateModalOpen(false);
    setNewProject({
      name: '',
      clientId: clients[0]?.id || '',
      siteAddress: '',
      owner: 'Sarah Mitchell',
      coordinator: 'Arjun Mehta',
      stage: 'Lead / Enquiry',
      health: 'green',
      priority: 'Normal',
      approvedValue: 40000,
      targetCompletion: '2027-02-15',
      description: '',
    });
  };

  const handleExport = () => {
    showToast('Exporting full 16-column Project Master Matrix to CSV (Demo)', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            SECTION 6.1 · MASTER PROJECT MATRIX
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Projects Portfolio & Master Matrix
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Complete operational matrix: Client links, Quotations, Enhancements, Controlled Drawings, Sourcing, POs, Milestones, Payments & Comms.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={<Download className="w-4 h-4 text-[#64748b]" />}
            onClick={handleExport}
          >
            Export Matrix
          </Button>
          {permissions.canEdit && (
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4 text-white" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Project
            </Button>
          )}
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="All Projects"
          value={totalProjects}
          trend="Total fit-out contracts recorded"
          trendType="neutral"
          icon={<FolderKanban className="w-5 h-5" />}
        />
        <StatCard
          label="In Active Delivery"
          value={inProgress}
          trend="Live design, sourcing & site fit-outs"
          trendType="positive"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="Completed / Aftercare"
          value={completed}
          trend="Handed over & 12-month warranty"
          trendType="positive"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          label="At Risk / Critical"
          value={atRisk.toString().padStart(2, '0')}
          trend="Amber / Red RAG status review"
          trendType="negative"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search project ID (FFC-2026-001), name, client or site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#4268e8]"
          >
            <option value="All">All 14 Workflow Stages</option>
            {ALL_STAGES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#4268e8]"
          >
            <option value="All">All Priorities</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#4268e8]"
          >
            <option value="All">All RAG Health</option>
            <option value="Green">Green (Healthy)</option>
            <option value="Amber">Amber (At Risk)</option>
            <option value="Red">Red (Critical)</option>
          </select>

          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#4268e8]"
          >
            <option value="All">All UK Owners</option>
            <option value="Sarah Mitchell">Sarah Mitchell</option>
            <option value="James Wilson">James Wilson</option>
          </select>
        </div>
      </div>

      {/* Section 6.1 Master Concept Matrix Table */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e8edf3] bg-gradient-to-r from-[#f8fafc] via-white to-[#f8fafc] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-extrabold text-[#17243b] tracking-tight">
              Master Project Operations Matrix
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#edf1ff] text-[#4268e8] border border-[#cbd8ff]">
              {filteredProjects.length} Active Contracts
            </span>
          </div>
          <div className="text-[11px] font-medium text-[#64748b] flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4268e8]/70 animate-pulse" />
            <span>Scroll horizontally ↔ to view all 10 operational columns</span>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1680px] text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 px-5">Project ID / Name</th>
                <th className="py-3.5 px-4">Client (UAT #3)</th>
                <th className="py-3.5 px-4">Quotation & Add-ons</th>
                <th className="py-3.5 px-4">Controlled Drawing</th>
                <th className="py-3.5 px-4">Sourcing & POs</th>
                <th className="py-3.5 px-4">Milestones & Comms</th>
                <th className="py-3.5 px-4">Commercial & Payments</th>
                <th className="py-3.5 px-4">Stage & Target</th>
                <th className="py-3.5 px-4 text-center">Priority / RAG</th>
                <th className="py-3.5 pr-5 pl-4 text-right">Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredProjects.map((project) => {
                const paymentsDue = project.settledValue - project.receivedValue;
                const projQuotes = quotations.filter((q) => q.projectId === project.id);
                const mainQuote = projQuotes.find((q) => q.type === 'Original') || projQuotes[0];
                const enhancementsCount = projQuotes.filter((q) => q.type === 'Enhancement').length;
                const projDocs = documents.filter((d) => d.projectId === project.id && d.type === 'Drawing');
                const currentDrawing = projDocs.find((d) => d.isCurrent) || projDocs[0];
                const projSourced = sourcedProducts.filter((s) => s.projectId === project.id);
                const projPOs = purchaseOrders.filter((po) => po.projectId === project.id);
                const projMilestones = milestones.filter((m) => m.projectId === project.id);
                const completedMs = projMilestones.filter((m) => m.status === 'Completed').length;
                const projCommsCount =
                  emails.filter((e) => e.projectId === project.id).length +
                  whatsappThreads.filter((w) => w.projectId === project.id).length +
                  callLogs.filter((c) => c.projectId === project.id).length;

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-[#f8fafc] transition-colors group cursor-pointer"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    {/* 1. Project ID & Name */}
                    <td className="py-4 px-5">
                      <div className="font-extrabold text-[#17243b] text-xs group-hover:text-[#4268e8]">
                        {project.code}
                      </div>
                      <div className="text-xs font-bold text-[#334155] mt-0.5">{project.name}</div>
                      <div className="text-[10px] text-[#94a3b8] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#cbd5e1] shrink-0" />
                        <span className="truncate max-w-[170px]">{project.siteAddress}</span>
                      </div>
                    </td>

                    {/* 2. Clickable Client (UAT #3) */}
                    <td className="py-4 px-3" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/clients/${project.clientId}`}
                        className="font-bold text-[#4268e8] hover:underline block"
                      >
                        {project.clientName}
                      </Link>
                      <div className="text-[10px] text-[#7b8798] mt-0.5">
                        PM: {project.owner}
                      </div>
                      <div className="text-[10px] text-[#94a3b8]">
                        Coord: {project.coordinator}
                      </div>
                    </td>

                    {/* 3. Quotation & Enhancements */}
                    <td className="py-4 px-3" onClick={(e) => e.stopPropagation()}>
                      {mainQuote ? (
                        <Link
                          href={`/quotations/${mainQuote.id}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#edf1ff] text-[#4268e8] font-bold text-[11px] hover:bg-[#dbe4ff]"
                        >
                          <FileSpreadsheet className="w-3 h-3" />
                          {mainQuote.reference} ({mainQuote.version})
                        </Link>
                      ) : (
                        <span className="text-[11px] text-[#94a3b8]">No Quote</span>
                      )}
                      <div className="text-[10px] text-[#16845f] font-semibold mt-1">
                        {enhancementsCount > 0
                          ? `+${enhancementsCount} Enhancement${enhancementsCount > 1 ? 's' : ''} (£${project.enhancementValue.toLocaleString()})`
                          : 'No Add-ons'}
                      </div>
                    </td>

                    {/* 4. Controlled Drawing */}
                    <td className="py-4 px-3">
                      {currentDrawing ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e8f7f0] text-[#16845f] font-bold text-[11px]">
                            <FileText className="w-3 h-3" />
                            {currentDrawing.version} {currentDrawing.approvalStatus} 🔒
                          </span>
                          <div className="text-[10px] text-[#7b8798] mt-0.5 truncate max-w-[140px]">
                            {currentDrawing.title}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#94a3b8]">Awaiting CAD</span>
                      )}
                    </td>

                    {/* 5. Products to Source & Purchase Orders */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#334155] font-semibold text-[11px]">
                          <Truck className="w-3 h-3 text-[#4268e8]" />
                          {projSourced.length} Items
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#eff6ff] text-[#2563eb] font-semibold text-[11px]">
                          <ShoppingCart className="w-3 h-3" />
                          {projPOs.length} POs
                        </span>
                      </div>
                      <div className="text-[10px] text-[#7b8798] mt-1">
                        {projSourced.filter((s) => s.status === 'Delivered').length} delivered
                      </div>
                    </td>

                    {/* 6. Milestones & Communication */}
                    <td className="py-4 px-3">
                      <div className="font-semibold text-[#17243b] text-[11px]">
                        Milestones: {completedMs}/{projMilestones.length || 1}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] text-[#4268e8] font-semibold mt-1">
                        <MessageSquare className="w-3 h-3" />
                        {projCommsCount} Comms Logged
                      </div>
                    </td>

                    {/* 7. Commercial Value & Payment History */}
                    <td className="py-4 px-3">
                      <div className="font-extrabold text-[#17243b] text-xs">
                        £{project.settledValue.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#16845f] font-semibold">
                        Paid: £{project.receivedValue.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#c84c58] font-semibold">
                        Due: £{paymentsDue.toLocaleString()}
                      </div>
                    </td>

                    {/* 8. Project Status & Target Completion */}
                    <td className="py-4 px-3">
                      <Badge variant="blue">{project.stage}</Badge>
                      <div className="text-[10px] text-[#475569] flex items-center gap-1 mt-1 font-medium">
                        <Calendar className="w-3 h-3 text-[#94a3b8]" />
                        <span>{project.targetCompletion}</span>
                      </div>
                    </td>

                    {/* 9. Priority & Health (Green / Amber / Red) */}
                    <td className="py-4 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge
                          variant={
                            project.priority === 'Urgent'
                              ? 'red'
                              : project.priority === 'High'
                              ? 'amber'
                              : 'gray'
                          }
                        >
                          {project.priority}
                        </Badge>
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
                      </div>
                    </td>

                    {/* 10. Action */}
                    <td className="py-4 pr-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        Open Hub
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Initialize New Fit-Out Project"
        subtitle="Set up project code (FFC-YYYY-NNN), commercial contract value, priority, and target completion schedule"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Project Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. The Claridge Hotel Bar & Lounge"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Client *</label>
              <select
                value={newProject.clientId}
                onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Site Delivery Address</label>
              <input
                type="text"
                placeholder="e.g. 55 Brook Street, Mayfair, London"
                value={newProject.siteAddress}
                onChange={(e) => setNewProject({ ...newProject, siteAddress: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Target Completion</label>
              <input
                type="date"
                value={newProject.targetCompletion}
                onChange={(e) => setNewProject({ ...newProject, targetCompletion: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Priority Level</label>
              <select
                value={newProject.priority}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    priority: e.target.value as 'Normal' | 'High' | 'Urgent',
                  })
                }
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Initial Value (£)</label>
              <input
                type="number"
                value={newProject.approvedValue}
                onChange={(e) => setNewProject({ ...newProject, approvedValue: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">UK Project Manager</label>
              <select
                value={newProject.owner}
                onChange={(e) => setNewProject({ ...newProject, owner: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option>Sarah Mitchell</option>
                <option>James Wilson</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">India Coordinator</label>
              <select
                value={newProject.coordinator}
                onChange={(e) => setNewProject({ ...newProject, coordinator: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option>Arjun Mehta</option>
                <option>Priya Nair</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Project Scope / Fit-Out Notes</label>
            <textarea
              rows={3}
              placeholder="Joinery specifications, banquette dimensions, veneer selections..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Project Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
