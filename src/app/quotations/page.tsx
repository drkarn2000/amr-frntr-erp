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
  FileSpreadsheet,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Lock,
  ArrowRight,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Quotation } from '@/types';

export default function QuotationsPage() {
  const router = useRouter();
  const { quotations, projects, addQuotation, approveQuotation, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);

  // New quotation form state
  const [newQuote, setNewQuote] = useState({
    projectId: projects[0]?.id || '',
    type: 'Original' as 'Original' | 'Enhancement',
    subtotal: 25000,
    deliveryCost: 1000,
    installationCost: 2500,
    notes: 'Bespoke fit-out and contract furniture joinery',
    itemDescription: 'Bespoke Fluted Banquettes (Crib 5 velvet)',
    itemQty: 10,
    itemUnit: 'linear meters',
    itemUnitPrice: 950,
  });

  // Calculate metrics
  const totalValue = quotations.reduce((acc, q) => acc + q.totalAmount, 0);
  const approvedValue = quotations
    .filter((q) => q.status === 'Approved' || q.status === 'Settled')
    .reduce((acc, q) => acc + q.totalAmount, 0);
  const enhancementCount = quotations.filter((q) => q.type === 'Enhancement').length;
  const pendingCount = quotations.filter((q) => q.status === 'Awaiting Approval' || q.status === 'Sent').length;

  const filteredQuotes = quotations.filter((q) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      q.reference.toLowerCase().includes(term) ||
      q.projectName.toLowerCase().includes(term) ||
      q.clientName.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    const matchesType = typeFilter === 'All' || q.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newQuote.projectId) || projects[0];
    const subtotal = Number(newQuote.subtotal);
    const delivery = Number(newQuote.deliveryCost);
    const install = Number(newQuote.installationCost);
    const vat = subtotal * 0.2;
    const total = subtotal + vat + delivery + install;

    addQuotation({
      projectId: proj.id,
      projectName: proj.name,
      clientName: proj.clientName,
      type: newQuote.type,
      subtotal,
      deliveryCost: delivery,
      installationCost: install,
      totalAmount: total,
      notes: newQuote.notes,
      lineItems: [
        {
          id: 'li-' + Date.now(),
          description: newQuote.itemDescription,
          quantity: Number(newQuote.itemQty),
          unit: newQuote.itemUnit,
          unitPrice: Number(newQuote.itemUnitPrice),
          totalPrice: Number(newQuote.itemQty) * Number(newQuote.itemUnitPrice),
        },
      ],
    });
    setIsCreateModalOpen(false);
    setIsAddonModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            COMMERCIAL CONTROL & REVENUE
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Quotations & Enhancements
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Quotation versioning, client approvals, line items, and separately tracked project add-ons.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={<Plus className="w-4 h-4 text-[#d5b27a]" />}
            onClick={() => {
              setNewQuote((prev) => ({ ...prev, type: 'Enhancement' }));
              setIsAddonModalOpen(true);
            }}
          >
            Add Enhancement
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setNewQuote((prev) => ({ ...prev, type: 'Original' }));
              setIsCreateModalOpen(true);
            }}
          >
            New Quotation
          </Button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Quotation Value"
          value={`£${totalValue.toLocaleString()}`}
          trend="All quotations & add-ons"
          trendType="neutral"
          icon={<FileSpreadsheet className="w-5 h-5" />}
        />
        <StatCard
          label="Approved & Settled"
          value={`£${approvedValue.toLocaleString()}`}
          trend="Locked commercial baselines"
          trendType="positive"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          label="Enhancements / Add-ons"
          value={enhancementCount.toString().padStart(2, '0')}
          trend="Variation orders tracked"
          trendType="positive"
          icon={<Layers className="w-5 h-5" />}
        />
        <StatCard
          label="Awaiting Approval"
          value={pendingCount.toString().padStart(2, '0')}
          trend="Sent to client for signature"
          trendType="warning"
          icon={<FileCheck className="w-5 h-5" />}
        />
      </div>

      {/* Controlled Baseline Notice */}
      <div className="p-4 bg-[#edf1ff]/40 border border-[#cbd8ff] rounded-2xl flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#4268e8] shrink-0 mt-0.5" />
        <div className="text-xs text-[#334155]">
          <span className="font-bold text-[#17243b]">Audit-Proof Versioning: </span>
          Approved quotation versions are locked and retained. Enhancements (add-ons) are separately quoted, approved, and tracked against their own purchase orders and billing milestones to prevent scope creep.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search quotation number (QT-2026-001), project or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Settled">Settled</option>
            <option value="Awaiting Approval">Awaiting Approval</option>
            <option value="Sent">Sent</option>
            <option value="Draft">Draft</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Original">Original Baseline</option>
            <option value="Enhancement">Enhancement / Add-on</option>
          </select>
        </div>
      </div>

      {/* Quotations Master Table */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                <th className="py-3.5 px-6">Reference</th>
                <th className="py-3.5 px-4">Project & Client</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-center">Version</th>
                <th className="py-3.5 px-4">Subtotal</th>
                <th className="py-3.5 px-4">VAT (20%)</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-[#f8fafc] cursor-pointer group"
                  onClick={() => router.push(`/quotations/${quote.id}`)}
                >
                  <td className="py-4 px-6 font-bold text-[#17243b] group-hover:text-[#4268e8]">
                    <div className="flex items-center gap-1.5">
                      <span>{quote.reference}</span>
                      {quote.isLocked && <Lock className="w-3 h-3 text-[#16845f]" />}
                    </div>
                    <div className="text-[10px] text-[#7b8798] mt-0.5">
                      Date: {quote.date}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-[#17243b]">{quote.projectName}</div>
                    <div className="text-[11px] text-[#7b8798]">{quote.clientName}</div>
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant={quote.type === 'Original' ? 'blue' : 'gold'}>
                      {quote.type}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-[#17243b]">
                    {quote.version}
                  </td>

                  <td className="py-4 px-4 text-[#475569]">
                    £{quote.subtotal.toLocaleString()}
                  </td>

                  <td className="py-4 px-4 text-[#7b8798]">
                    £{(quote.subtotal * 0.2).toFixed(2)}
                  </td>

                  <td className="py-4 px-4 font-extrabold text-[#17243b]">
                    £{quote.totalAmount.toLocaleString()}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <Badge
                      variant={
                        quote.status === 'Approved' || quote.status === 'Settled'
                          ? 'green'
                          : quote.status === 'Rejected'
                          ? 'red'
                          : 'amber'
                      }
                    >
                      {quote.status}
                    </Badge>
                  </td>

                  <td className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/quotations/${quote.id}`)}
                      >
                        View PDF
                      </Button>
                      {!quote.isLocked && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => approveQuotation(quote.id)}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Quotation Modal */}
      <Modal
        isOpen={isCreateModalOpen || isAddonModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsAddonModalOpen(false);
        }}
        title={isAddonModalOpen ? 'Create Project Enhancement (Add-on)' : 'Draft New Quotation'}
        subtitle="Specify scope line items, internal cost markup, delivery, and VAT"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateQuotation} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
              <select
                value={newQuote.projectId}
                onChange={(e) => setNewQuote({ ...newQuote, projectId: e.target.value })}
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
              <label className="block text-xs font-bold text-[#475569] mb-1">Quotation Type</label>
              <select
                value={newQuote.type}
                onChange={(e) => setNewQuote({ ...newQuote, type: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Original">Original Baseline</option>
                <option value="Enhancement">Enhancement / Add-on</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-3">
            <span className="text-xs font-bold text-[#17243b] block">Primary Line Item</span>
            <div>
              <input
                required
                type="text"
                placeholder="Item Description (e.g. Bespoke fluted velvet banquette)"
                value={newQuote.itemDescription}
                onChange={(e) => setNewQuote({ ...newQuote, itemDescription: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg bg-white outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#7b8798] mb-1">Quantity</label>
                <input
                  type="number"
                  value={newQuote.itemQty}
                  onChange={(e) => setNewQuote({ ...newQuote, itemQty: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7b8798] mb-1">Unit</label>
                <input
                  type="text"
                  value={newQuote.itemUnit}
                  onChange={(e) => setNewQuote({ ...newQuote, itemUnit: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#7b8798] mb-1">Unit Price (£)</label>
                <input
                  type="number"
                  value={newQuote.itemUnitPrice}
                  onChange={(e) => setNewQuote({ ...newQuote, itemUnitPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg bg-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Subtotal (£)</label>
              <input
                type="number"
                value={newQuote.subtotal}
                onChange={(e) => setNewQuote({ ...newQuote, subtotal: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Delivery (£)</label>
              <input
                type="number"
                value={newQuote.deliveryCost}
                onChange={(e) => setNewQuote({ ...newQuote, deliveryCost: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Installation (£)</label>
              <input
                type="number"
                value={newQuote.installationCost}
                onChange={(e) => setNewQuote({ ...newQuote, installationCost: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Commercial Notes & Terms</label>
            <textarea
              rows={2}
              value={newQuote.notes}
              onChange={(e) => setNewQuote({ ...newQuote, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsAddonModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Generate Quotation Version
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
