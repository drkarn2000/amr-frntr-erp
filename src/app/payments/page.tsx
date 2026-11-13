'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  PoundSterling,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Truck,
} from 'lucide-react';
import { PaymentScheduleItem } from '@/types';

export default function PaymentsPage() {
  const {
    payments,
    vendorPayments,
    projects,
    addPayment,
    markPaymentPaid,
    markVendorPaymentPaid,
    showToast,
  } = useApp();

  const [ledgerTab, setLedgerTab] = useState<'client' | 'vendor'>('client');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // New Payment Form
  const [newPay, setNewPay] = useState({
    projectId: projects[0]?.id || '',
    invoiceRef: 'INV-1095',
    stage: 'Installation Stage' as PaymentScheduleItem['stage'],
    amount: 8000,
    dueDate: '2026-11-28',
    status: 'Invoiced' as PaymentScheduleItem['status'],
  });

  // Calculate Metrics
  const totalInvoiced = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalReceived = payments.reduce((acc, p) => acc + p.receivedAmount, 0);
  const totalOutstanding = totalInvoiced - totalReceived;
  const overdueTotal = payments
    .filter((p) => p.status === 'Overdue')
    .reduce((acc, p) => acc + (p.amount - p.receivedAmount), 0);

  const filteredPayments = payments.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.invoiceRef.toLowerCase().includes(q) ||
      p.projectName.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newPay.projectId) || projects[0];
    addPayment({
      projectId: proj.id,
      projectName: proj.name,
      clientName: proj.clientName,
      invoiceRef: newPay.invoiceRef,
      stage: newPay.stage,
      invoiceDate: '2026-11-13',
      amount: Number(newPay.amount),
      receivedAmount: newPay.status === 'Paid' ? Number(newPay.amount) : 0,
      dueDate: newPay.dueDate,
      status: newPay.status,
      paymentMethod: 'Bank Transfer',
    });
    setIsRecordModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            SECTION 13 · CLIENT RECEIVABLES & SUPPLIER PAYMENT TRACKING
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Payments & Milestone Finance Ledger
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Client milestone schedules (Deposit, Stage, Enhancement, Final), part-payment support, and Vendor PO payment tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={<Download className="w-4 h-4 text-[#64748b]" />}
            onClick={() => showToast('Exporting payment ledger to CSV', 'info')}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsRecordModalOpen(true)}
          >
            Schedule Client Payment
          </Button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Scheduled"
          value={`£${(totalInvoiced / 1000).toFixed(1)}k`}
          trend="All milestone billing"
          trendType="neutral"
          icon={<PoundSterling className="w-5 h-5" />}
        />
        <StatCard
          label="Received to Date"
          value={`£${(totalReceived / 1000).toFixed(1)}k`}
          trend="Cleared bank receipts"
          trendType="positive"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          label="Outstanding Balance"
          value={`£${(totalOutstanding / 1000).toFixed(1)}k`}
          trend="Remaining receivables"
          trendType="warning"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="Overdue Invoices"
          value={`£${(overdueTotal / 1000).toFixed(1)}k`}
          trend="Chaser notices generated"
          trendType="negative"
          icon={<AlertCircle className="w-5 h-5" />}
        />
      </div>

      {/* Ledger Switcher Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#e8edf3] shadow-xs w-fit">
        <button
          onClick={() => setLedgerTab('client')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
            ledgerTab === 'client' ? 'bg-[#17243b] text-white' : 'text-[#64748b] hover:bg-[#f8fafc]'
          }`}
        >
          <PoundSterling className="w-4 h-4" />
          <span>Client Milestone Invoices ({payments.length})</span>
        </button>
        <button
          onClick={() => setLedgerTab('vendor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
            ledgerTab === 'vendor' ? 'bg-[#4268e8] text-white' : 'text-[#64748b] hover:bg-[#f8fafc]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Supplier / Vendor Payments ({vendorPayments.length})</span>
        </button>
      </div>

      {ledgerTab === 'client' ? (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search invoice ref (INV-1001), client or project..."
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
              <option value="Paid">Paid</option>
              <option value="Part Paid">Part Paid</option>
              <option value="Invoiced">Invoiced</option>
              <option value="Overdue">Overdue</option>
              <option value="Planned">Planned</option>
            </select>
          </div>

          {/* Client Payments Master Table */}
          <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Invoice / Reference</th>
                    <th className="py-3.5 px-4">Client & Project</th>
                    <th className="py-3.5 px-4">Payment Stage</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Received</th>
                    <th className="py-3.5 px-4">Balance</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 pr-6 text-right">Actions (UAT #7)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredPayments.map((pay) => {
                    const balance = pay.amount - pay.receivedAmount;
                    return (
                      <tr key={pay.id} className="hover:bg-[#f8fafc]">
                        <td className="py-4 px-6 font-extrabold text-[#17243b] text-xs">
                          {pay.invoiceRef}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#17243b]">{pay.projectName}</div>
                          <div className="text-[11px] text-[#7b8798]">{pay.clientName}</div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#334155]">{pay.stage}</td>
                        <td className="py-4 px-4 text-[#475569]">{pay.dueDate}</td>
                        <td className="py-4 px-4 font-bold text-[#17243b]">
                          £{pay.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#16845f]">
                          £{pay.receivedAmount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#c84c58]">
                          £{balance.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge
                            variant={
                              pay.status === 'Paid'
                                ? 'green'
                                : pay.status === 'Overdue'
                                ? 'red'
                                : pay.status === 'Part Paid' || pay.status === 'Invoiced'
                                ? 'amber'
                                : 'gray'
                            }
                          >
                            {pay.status}
                          </Badge>
                        </td>
                        <td className="py-4 pr-6 text-right">
                          {pay.status !== 'Paid' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              {pay.receivedAmount === 0 && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    markPaymentPaid(pay.id, Math.round(pay.amount / 2))
                                  }
                                >
                                  50% Part-Pay
                                </Button>
                              )}
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => markPaymentPaid(pay.id)}
                              >
                                Mark Paid
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-bold text-[#16845f] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Supplier / Vendor Payments Table */
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-[#e8edf3]">
            <h2 className="text-sm md:text-base font-bold text-[#17243b]">
              Vendor & Subcontractor Payment Schedule
            </h2>
            <p className="text-xs text-[#7b8798]">
              Linked to issued Purchase Orders and trade credit terms
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                  <th className="py-3.5 px-6">PO Number</th>
                  <th className="py-3.5 px-4">Supplier / Vendor</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Paid</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {vendorPayments.map((vp) => (
                  <tr key={vp.id} className="hover:bg-[#f8fafc]">
                    <td className="py-4 px-6 font-extrabold text-[#4268e8]">{vp.poNumber}</td>
                    <td className="py-4 px-4 font-bold text-[#17243b]">{vp.vendorName}</td>
                    <td className="py-4 px-4 font-semibold text-[#334155]">{vp.projectName}</td>
                    <td className="py-4 px-4 text-[#475569]">{vp.dueDate}</td>
                    <td className="py-4 px-4 font-bold text-[#17243b]">
                      £{vp.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#16845f]">
                      £{vp.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={vp.status === 'Paid' ? 'green' : 'amber'}>
                        {vp.status}
                      </Badge>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      {vp.status !== 'Paid' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => markVendorPaymentPaid(vp.id)}
                        >
                          Remit Payment
                        </Button>
                      ) : (
                        <span className="text-[11px] font-bold text-[#16845f]">✓ Remitted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Schedule Payment Milestone"
        subtitle="Log staged contract milestone invoice details"
        maxWidth="md"
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
            <select
              value={newPay.projectId}
              onChange={(e) => setNewPay({ ...newPay, projectId: e.target.value })}
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
              <label className="block text-xs font-bold text-[#475569] mb-1">Invoice Reference *</label>
              <input
                required
                type="text"
                value={newPay.invoiceRef}
                onChange={(e) => setNewPay({ ...newPay, invoiceRef: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Milestone Stage</label>
              <select
                value={newPay.stage}
                onChange={(e) => setNewPay({ ...newPay, stage: e.target.value as PaymentScheduleItem['stage'] })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Deposit 30%">Deposit 30%</option>
                <option value="Production Stage">Production Stage</option>
                <option value="Delivery Stage">Delivery Stage</option>
                <option value="Installation Stage">Installation Stage</option>
                <option value="Enhancement 1">Enhancement 1</option>
                <option value="Final Payment">Final Payment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Amount (£) *</label>
              <input
                required
                type="number"
                value={newPay.amount}
                onChange={(e) => setNewPay({ ...newPay, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Due Date</label>
              <input
                type="date"
                value={newPay.dueDate}
                onChange={(e) => setNewPay({ ...newPay, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Payment Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
