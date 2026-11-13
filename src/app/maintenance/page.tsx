'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  ShieldCheck,
  Plus,
  Search,
  Calendar,
  Clock,
  PoundSterling,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
} from 'lucide-react';
import { MaintenancePlan } from '@/types';

export default function MaintenancePage() {
  const { maintenancePlans, projects, addMaintenancePlan, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);

  // New plan form state
  const [newPlan, setNewPlan] = useState({
    projectId: projects[0]?.id || '',
    warrantyEndDate: '2027-11-28',
    packageType: 'Annual Care Contract' as const,
    nextServiceDate: '2027-05-15',
    owner: 'Sarah Mitchell',
    annualValue: 2500,
    notes: 'Bi-annual timber re-oiling and bolt torque inspection',
  });

  const totalPlans = maintenancePlans.length;
  const totalAnnualValue = maintenancePlans.reduce((acc, p) => acc + p.annualValue, 0);
  const followUpDueCount = maintenancePlans.filter((p) => p.status === 'Follow-up due').length;
  const activeContractsCount = maintenancePlans.filter(
    (p) => p.status === 'Active' || p.status === 'Scheduled'
  ).length;

  const filteredPlans = maintenancePlans.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.projectName.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.packageType.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newPlan.projectId) || projects[0];

    addMaintenancePlan({
      projectId: proj.id,
      projectName: proj.name,
      clientName: proj.clientName,
      warrantyEndDate: newPlan.warrantyEndDate,
      packageType: newPlan.packageType,
      nextServiceDate: newPlan.nextServiceDate,
      owner: newPlan.owner,
      annualValue: Number(newPlan.annualValue),
      notes: newPlan.notes,
    });

    setIsAddPlanModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            AFTERCARE & LIFECYCLE WARRANTIES
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Maintenance & Warranty
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Turn completed projects into recurring service contracts, warranty tracking, and scheduled aftercare inspections.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddPlanModalOpen(true)}
        >
          Add Maintenance Plan
        </Button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Care Contracts"
          value={activeContractsCount.toString().padStart(2, '0')}
          trend="Hospitality & corporate clients"
          trendType="positive"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <StatCard
          label="Recurring Annual Value"
          value={`£${totalAnnualValue.toLocaleString()}`}
          trend="Annual maintenance revenue"
          trendType="positive"
          icon={<PoundSterling className="w-5 h-5" />}
        />
        <StatCard
          label="Inspections Due Soon"
          value="06"
          trend="Scheduled for next 30 days"
          trendType="neutral"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="Follow-ups Overdue"
          value={followUpDueCount.toString().padStart(2, '0')}
          trend="Client service outreach pending"
          trendType="warning"
          icon={<AlertCircle className="w-5 h-5" />}
        />
      </div>

      {/* Commercial Aftercare Notice */}
      <div className="p-4 bg-[#edf1ff]/40 border border-[#cbd8ff] rounded-2xl flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#4268e8] shrink-0 mt-0.5" />
        <div className="text-xs text-[#334155]">
          <span className="font-bold text-[#17243b]">Post-Handover Value Generation: </span>
          Project practical completion generates a 12-month defect liability warranty, recommended bi-annual timber care visits, and recurring revenue maintenance opportunities for banquet seating upholstery and surface finishes.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search project, client, or package type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Active">Active</option>
          <option value="Follow-up due">Follow-up Due</option>
        </select>
      </div>

      {/* Maintenance Plans Master Table */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                <th className="py-3.5 px-6">Client / Project</th>
                <th className="py-3.5 px-4">Care Package</th>
                <th className="py-3.5 px-4">Warranty Expiry</th>
                <th className="py-3.5 px-4">Last Service</th>
                <th className="py-3.5 px-4">Next Inspection</th>
                <th className="py-3.5 px-4">Account Owner</th>
                <th className="py-3.5 px-4">Annual Value</th>
                <th className="py-3.5 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-[#f8fafc]">
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-[#17243b] text-xs">{plan.projectName}</div>
                    <div className="text-[11px] text-[#7b8798]">{plan.clientName}</div>
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant="blue">{plan.packageType}</Badge>
                  </td>

                  <td className="py-4 px-4 text-[#7b8798]">{plan.warrantyEndDate}</td>

                  <td className="py-4 px-4 text-[#475569]">{plan.lastServiceDate || 'Initial Setup'}</td>

                  <td className="py-4 px-4 font-bold text-[#17243b]">{plan.nextServiceDate}</td>

                  <td className="py-4 px-4 text-[#475569]">{plan.owner}</td>

                  <td className="py-4 px-4 font-bold text-[#16845f]">
                    £{plan.annualValue.toLocaleString()}/yr
                  </td>

                  <td className="py-4 pr-6 text-right">
                    <Badge
                      variant={
                        plan.status === 'Scheduled' || plan.status === 'Active'
                          ? 'green'
                          : 'amber'
                      }
                    >
                      {plan.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Maintenance Plan Modal */}
      <Modal
        isOpen={isAddPlanModalOpen}
        onClose={() => setIsAddPlanModalOpen(false)}
        title="Schedule Project Maintenance Plan"
        subtitle="Establish warranty timeline, service package, and recurring aftercare revenue"
        maxWidth="md"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
            <select
              value={newPlan.projectId}
              onChange={(e) => setNewPlan({ ...newPlan, projectId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Care Package Tier</label>
              <select
                value={newPlan.packageType}
                onChange={(e) => setNewPlan({ ...newPlan, packageType: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Standard 12-Month">Standard 12-Month Warranty</option>
                <option value="Annual Care Contract">Annual Care Contract</option>
                <option value="Bi-Annual Commercial Inspection">Bi-Annual Commercial Inspection</option>
                <option value="Bespoke Fit-Out Care">Bespoke Fit-Out Care</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Annual Contract Value (£)</label>
              <input
                type="number"
                value={newPlan.annualValue}
                onChange={(e) => setNewPlan({ ...newPlan, annualValue: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Warranty End Date</label>
              <input
                type="date"
                value={newPlan.warrantyEndDate}
                onChange={(e) => setNewPlan({ ...newPlan, warrantyEndDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Next Inspection Date</label>
              <input
                type="date"
                value={newPlan.nextServiceDate}
                onChange={(e) => setNewPlan({ ...newPlan, nextServiceDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Scope & Maintenance Checklist</label>
            <textarea
              rows={3}
              placeholder="e.g. Timber wax buffing, fabric stain protection, pivot hinge inspection..."
              value={newPlan.notes}
              onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
              className="w-full p-3 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsAddPlanModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Establish Plan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

