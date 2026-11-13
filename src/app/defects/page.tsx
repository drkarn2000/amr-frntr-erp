'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  PoundSterling,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { DefectItem } from '@/types';

export default function DefectsPage() {
  const { defects, projects, vendors, addDefect, resolveDefect, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<DefectItem | null>(null);

  // New defect form state
  const [newDef, setNewDef] = useState({
    projectId: projects[0]?.id || '',
    vendorName: vendors[0]?.name || '',
    poNumber: 'PO-2026-018',
    issue: '',
    description: '',
    linkedProduct: 'Contract FR Velvet Upholstery',
    severity: 'Medium' as const,
    owner: 'James Wilson',
    costImpact: 250,
    rootCause: '',
    supplierResponse: '',
  });

  const totalDefects = defects.length;
  const activeDefects = defects.filter((d) => d.status !== 'Resolved' && d.status !== 'Closed').length;
  const criticalCount = defects.filter((d) => d.severity === 'Critical' || d.severity === 'High').length;
  const resolvedCount = defects.filter((d) => d.status === 'Resolved' || d.status === 'Closed').length;

  const filteredDefects = defects.filter((def) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      def.code.toLowerCase().includes(q) ||
      def.issue.toLowerCase().includes(q) ||
      def.projectName.toLowerCase().includes(q) ||
      (def.vendorName && def.vendorName.toLowerCase().includes(q));
    const matchesSev = severityFilter === 'All' || def.severity === severityFilter;
    const matchesStat = statusFilter === 'All' || def.status === statusFilter;
    return matchesSearch && matchesSev && matchesStat;
  });

  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDef.issue) return;
    const proj = projects.find((p) => p.id === newDef.projectId) || projects[0];

    addDefect({
      projectId: proj.id,
      projectName: proj.name,
      issue: newDef.issue,
      description: newDef.description,
      linkedProduct: newDef.linkedProduct,
      vendorName: newDef.vendorName,
      poNumber: newDef.poNumber,
      severity: newDef.severity,
      owner: newDef.owner,
      costImpact: Number(newDef.costImpact),
      rootCause: newDef.rootCause,
      supplierResponse: newDef.supplierResponse,
    });

    setIsCreateModalOpen(false);
    setNewDef({
      projectId: projects[0]?.id || '',
      vendorName: vendors[0]?.name || '',
      poNumber: 'PO-2026-018',
      issue: '',
      description: '',
      linkedProduct: 'Contract FR Velvet Upholstery',
      severity: 'Medium',
      owner: 'James Wilson',
      costImpact: 250,
      rootCause: '',
      supplierResponse: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            QUALITY ASSURANCE & SNAGGING
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Defects & Snagging
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Trace defects directly to projects, joinery components, supplier purchase orders, and replacement lead times.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Defect
        </Button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Snags Logged"
          value={totalDefects.toString().padStart(2, '0')}
          trend="Lifetime quality audits"
          trendType="neutral"
          icon={<ShieldAlert className="w-5 h-5" />}
        />
        <StatCard
          label="Active / Investigating"
          value={activeDefects.toString().padStart(2, '0')}
          trend="Action assigned to supplier/fitter"
          trendType="warning"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="High / Critical Snags"
          value={criticalCount.toString().padStart(2, '0')}
          trend="Urgent replacement needed"
          trendType="negative"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <StatCard
          label="Resolved & Verified"
          value={resolvedCount.toString().padStart(2, '0')}
          trend="Signed off by site PM"
          trendType="positive"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search defect ID (DEF-0018), issue, supplier, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Investigating">Investigating</option>
            <option value="Supplier Contacted">Supplier Contacted</option>
            <option value="Replacement Awaited">Replacement Awaited</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Defects Master Table */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                <th className="py-3.5 px-6">Defect ID</th>
                <th className="py-3.5 px-4">Issue Description</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Product / PO</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4 text-center">Severity</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredDefects.map((def) => (
                <tr
                  key={def.id}
                  className="hover:bg-[#f8fafc] cursor-pointer"
                  onClick={() => setSelectedDefect(def)}
                >
                  <td className="py-4 px-6 font-extrabold text-[#17243b] text-xs">
                    {def.code}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-[#17243b]">{def.issue}</div>
                    <div className="text-[11px] text-[#7b8798] line-clamp-1 mt-0.5">
                      {def.description}
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-[#17243b]">{def.projectName}</td>

                  <td className="py-4 px-4 text-[#475569]">
                    {def.linkedProduct || '—'}{' '}
                    {def.poNumber ? (
                      <span className="text-[#4268e8] font-semibold">({def.poNumber})</span>
                    ) : (
                      ''
                    )}
                  </td>

                  <td className="py-4 px-4 text-[#334155]">{def.vendorName || 'In-House'}</td>

                  <td className="py-4 px-4 text-center">
                    <Badge
                      variant={
                        def.severity === 'Critical'
                          ? 'red'
                          : def.severity === 'High'
                          ? 'amber'
                          : 'blue'
                      }
                    >
                      {def.severity}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 text-[#475569]">{def.owner}</td>

                  <td className="py-4 px-4 text-center">
                    <Badge variant={def.status === 'Resolved' ? 'green' : 'amber'}>
                      {def.status}
                    </Badge>
                  </td>

                  <td className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    {def.status !== 'Resolved' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => resolveDefect(def.id)}
                      >
                        Resolve
                      </Button>
                    ) : (
                      <span className="text-[11px] font-bold text-[#16845f] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Closed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Defect Detail Drawer/Modal */}
      {selectedDefect && (
        <Modal
          isOpen={!!selectedDefect}
          onClose={() => setSelectedDefect(null)}
          title={`Defect Audit: ${selectedDefect.code}`}
          subtitle={`${selectedDefect.projectName} · Assigned to ${selectedDefect.owner}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-[#f8fafc] rounded-xl border border-[#edf0f5]">
              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase">Severity</span>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedDefect.severity === 'Critical'
                        ? 'red'
                        : selectedDefect.severity === 'High'
                        ? 'amber'
                        : 'blue'
                    }
                  >
                    {selectedDefect.severity} Priority
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase">Logged Date</span>
                <div className="text-xs font-bold text-[#17243b] mt-1">
                  {selectedDefect.loggedDate}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase">Cost Impact</span>
                <div className="text-xs font-extrabold text-[#c84c58] mt-1">
                  £{selectedDefect.costImpact.toLocaleString()}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase">Current Status</span>
                <div className="mt-1">
                  <Badge variant={selectedDefect.status === 'Resolved' ? 'green' : 'amber'}>
                    {selectedDefect.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#17243b] block mb-1">Issue Description</span>
              <p className="text-xs text-[#475569] leading-relaxed p-3 bg-white border border-[#cbd5e1] rounded-xl">
                {selectedDefect.description || selectedDefect.issue}
              </p>
            </div>

            {selectedDefect.rootCause && (
              <div>
                <span className="text-xs font-bold text-[#17243b] block mb-1">Root Cause Analysis</span>
                <p className="text-xs text-[#475569] leading-relaxed p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl">
                  {selectedDefect.rootCause}
                </p>
              </div>
            )}

            {selectedDefect.supplierResponse && (
              <div>
                <span className="text-xs font-bold text-[#17243b] block mb-1">Supplier Rectification Response</span>
                <p className="text-xs text-[#16845f] leading-relaxed p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl font-medium">
                  {selectedDefect.supplierResponse}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <Button variant="secondary" onClick={() => setSelectedDefect(null)}>
                Close
              </Button>
              {selectedDefect.status !== 'Resolved' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    resolveDefect(selectedDefect.id);
                    setSelectedDefect(null);
                  }}
                >
                  Mark Defect as Resolved
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Create Defect Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Log Defect / Snagging Issue"
        subtitle="Record quality failure, assign owner, and link to vendor purchase order"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDefect} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
              <select
                value={newDef.projectId}
                onChange={(e) => setNewDef({ ...newDef, projectId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Severity Rating</label>
              <select
                value={newDef.severity}
                onChange={(e) => setNewDef({ ...newDef, severity: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Low">Low (Aesthetic touch-up)</option>
                <option value="Medium">Medium (Component adjustment)</option>
                <option value="High">High (Sub-assembly replacement)</option>
                <option value="Critical">Critical (Immediate stop-work)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Defect Title / Summary *</label>
            <input
              required
              type="text"
              placeholder="e.g. Upholstery fabric seam misalignment on corner banquette module C2"
              value={newDef.issue}
              onChange={(e) => setNewDef({ ...newDef, issue: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Supplier / Vendor</label>
              <select
                value={newDef.vendorName}
                onChange={(e) => setNewDef({ ...newDef, vendorName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">PO Number</label>
              <input
                type="text"
                value={newDef.poNumber}
                onChange={(e) => setNewDef({ ...newDef, poNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Cost Impact (£)</label>
              <input
                type="number"
                value={newDef.costImpact}
                onChange={(e) => setNewDef({ ...newDef, costImpact: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Detailed Description</label>
            <textarea
              rows={3}
              placeholder="Full defect explanation, measurements variance, location on site..."
              value={newDef.description}
              onChange={(e) => setNewDef({ ...newDef, description: e.target.value })}
              className="w-full p-3 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Defect & Trigger Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

