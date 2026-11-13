'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  PoundSterling,
  FileSpreadsheet,
  Bell,
  Mail,
  Eye,
  Lock,
  Download,
} from 'lucide-react';
import { ProcurementStatus, PurchaseOrder, SourcedProduct } from '@/types';

export default function ProcurementPage() {
  const {
    sourcedProducts,
    purchaseOrders,
    vendors,
    projects,
    permissions,
    addSourcedProduct,
    addPurchaseOrder,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSourcingModalOpen, setIsSourcingModalOpen] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [chaseItem, setChaseItem] = useState<SourcedProduct | null>(null);

  // New Sourced Item Form State
  const [newItem, setNewItem] = useState({
    projectId: projects[0]?.id || '',
    vendorId: vendors[0]?.id || '',
    description: '',
    specification: '',
    quantity: 10,
    unit: 'meters',
    unitCost: 25,
    poNumber: 'PO-2026-030',
    expectedDelivery: '2026-11-22',
    status: 'Ordered' as ProcurementStatus,
  });

  // New PO Form State
  const [newPO, setNewPO] = useState({
    projectId: projects[0]?.id || '',
    vendorId: vendors[0]?.id || '',
    expectedDelivery: '2026-11-24',
    totalAmount: 3200,
    itemsList: 'Timber frames and lacquer supplies',
  });

  // Metrics
  const openOrders = purchaseOrders.filter(
    (po) => po.status !== 'Delivered' && po.status !== 'Cancelled'
  ).length;
  const committedSpend = sourcedProducts.reduce((acc, s) => acc + s.totalCost, 0);
  const delayedCount = sourcedProducts.filter(
    (s) => s.status === 'Delayed' || s.status === 'Defective'
  ).length;
  const deliveredCount = sourcedProducts.filter((s) => s.status === 'Delivered').length;

  const filteredProducts = sourcedProducts.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.description.toLowerCase().includes(q) ||
      p.vendorName.toLowerCase().includes(q) ||
      (p.poNumber || '').toLowerCase().includes(q) ||
      p.projectName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSourcedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.description) return;
    const proj = projects.find((p) => p.id === newItem.projectId) || projects[0];
    const ven = vendors.find((v) => v.id === newItem.vendorId) || vendors[0];

    addSourcedProduct({
      projectId: proj.id,
      projectName: proj.name,
      vendorId: ven.id,
      vendorName: ven.name,
      description: newItem.description,
      specification: newItem.specification,
      quantity: Number(newItem.quantity),
      unit: newItem.unit,
      unitCost: Number(newItem.unitCost),
      totalCost: Number(newItem.quantity) * Number(newItem.unitCost),
      poNumber: newItem.poNumber,
      expectedDelivery: newItem.expectedDelivery,
      status: newItem.status,
    });

    setIsSourcingModalOpen(false);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newPO.projectId) || projects[0];
    const ven = vendors.find((v) => v.id === newPO.vendorId) || vendors[0];

    addPurchaseOrder({
      projectId: proj.id,
      projectName: proj.name,
      vendorId: ven.id,
      vendorName: ven.name,
      orderDate: '13 Nov 2026',
      expectedDelivery: newPO.expectedDelivery,
      totalAmount: Number(newPO.totalAmount),
      status: 'Approved',
      itemsList: newPO.itemsList,
    });

    setIsPOModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            SECTION 10 & 12.1 · PROCUREMENT & PURCHASE ORDER ENGINE
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Products, Sourcing & Purchase Orders
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Track sourced materials, 7/3/1-day supplier chase alerts, Purchase Order detail sheets, and factory dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={<FileSpreadsheet className="w-4 h-4 text-[#4268e8]" />}
            onClick={() => setIsPOModalOpen(true)}
          >
            Create PO
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsSourcingModalOpen(true)}
          >
            Add Sourced Item
          </Button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Open RFQs / Orders"
          value={openOrders.toString().padStart(2, '0')}
          trend="Active supplier work"
          trendType="neutral"
          icon={<Boxes className="w-5 h-5" />}
        />
        <StatCard
          label="Committed Supplier Spend"
          value={permissions.canViewCostsAndMargins ? `£${committedSpend.toLocaleString()}` : '🔒 Restricted'}
          trend="Across all active projects"
          trendType="neutral"
          icon={<PoundSterling className="w-5 h-5" />}
        />
        <StatCard
          label="Delivered to Site / Shop"
          value={deliveredCount.toString().padStart(2, '0')}
          trend="Passed QC receipt"
          trendType="positive"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          label="Delayed / Defective"
          value={delayedCount.toString().padStart(2, '0')}
          trend="Supplier follow-up triggered"
          trendType="negative"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      {/* Supplier Reminders Strip (Section 12.1) */}
      <div className="p-4 bg-[#edf1ff]/40 border border-[#cbd8ff] rounded-2xl flex items-start gap-3">
        <Bell className="w-5 h-5 text-[#4268e8] shrink-0 mt-0.5" />
        <div className="text-xs text-[#334155]">
          <span className="font-bold text-[#17243b]">Section 12.1 · Automated 7-Day, 3-Day & 1-Day Supplier Delivery Reminders: </span>
          Every sourced product with an Expected Delivery Date automatically schedules 7-day, 3-day, and 24-hour dispatch checks. Click <b>Chase Supplier</b> on any row to preview/send the pre-filled chase email template.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search material specification, vendor, PO number or project..."
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
          <option value="All">All 11 Procurement Statuses</option>
          <option value="RFQ">RFQ</option>
          <option value="Quote Received">Quote Received</option>
          <option value="Approved">Approved</option>
          <option value="Ordered">Ordered</option>
          <option value="In Production">In Production</option>
          <option value="Ready">Ready</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Delayed">Delayed</option>
          <option value="Defective">Defective</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Sourced Items Master Table */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
          <h2 className="text-sm md:text-base font-bold text-[#17243b]">Sourced Products & Materials (UAT #6)</h2>
          <Badge variant="gray">{filteredProducts.length} Items</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                <th className="py-3.5 px-6">Product / Specification</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Internal Cost (UAT #15)</th>
                <th className="py-3.5 px-4">PO Ref</th>
                <th className="py-3.5 px-4">Expected Delivery & Alert</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 pr-6 text-right">Chase Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8fafc]">
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-[#17243b] text-xs">{item.description}</div>
                    <div className="text-[11px] text-[#7b8798] line-clamp-1 mt-0.5">
                      {item.specification}
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-[#17243b]">{item.projectName}</td>

                  <td className="py-4 px-4 font-semibold text-[#334155]">{item.vendorName}</td>

                  <td className="py-4 px-4">
                    {item.quantity} {item.unit}
                  </td>

                  <td className="py-4 px-4">
                    {permissions.canViewCostsAndMargins ? (
                      <div>
                        <div className="font-bold text-[#17243b]">£{item.totalCost.toLocaleString()}</div>
                        <div className="text-[10px] text-[#7b8798]">£{item.unitCost}/{item.unit}</div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c84c58]">
                        <Lock className="w-3 h-3" /> Hidden
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 font-semibold text-[#4268e8]">{item.poNumber}</td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#334155]">{item.expectedDelivery}</div>
                    {item.status !== 'Delivered' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#d97706]">
                        <Bell className="w-3 h-3" /> 7d / 3d / 1d Alert
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <Badge
                      variant={
                        item.status === 'Delivered'
                          ? 'green'
                          : item.status === 'Delayed' || item.status === 'Defective'
                          ? 'red'
                          : item.status === 'Ready' || item.status === 'In Production'
                          ? 'blue'
                          : 'amber'
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>

                  <td className="py-4 pr-6 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Mail className="w-3.5 h-3.5 text-[#4268e8]" />}
                      onClick={() => setChaseItem(item)}
                    >
                      Chase Supplier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Orders Master Ledger (Screen #16 in Section 27) */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
          <div>
            <h2 className="text-sm md:text-base font-bold text-[#17243b]">
              Purchase Orders Ledger (Click any PO for Screen #16 PO Detail Sheet)
            </h2>
            <p className="text-xs text-[#7b8798]">Committed binding orders issued to suppliers</p>
          </div>
          <Button
            variant="soft"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsPOModalOpen(true)}
          >
            New PO
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                <th className="py-3.5 px-6">PO Number</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Order Date</th>
                <th className="py-3.5 px-4">Delivery Due</th>
                <th className="py-3.5 px-4">PO Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 pr-6 text-right">PO Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {purchaseOrders.map((po) => (
                <tr
                  key={po.id}
                  onClick={() => setSelectedPO(po)}
                  className="hover:bg-[#f8fafc] cursor-pointer"
                >
                  <td className="py-4 px-6 font-extrabold text-[#4268e8] text-xs">{po.poNumber}</td>
                  <td className="py-4 px-4 font-bold text-[#17243b]">{po.projectName}</td>
                  <td className="py-4 px-4 text-[#475569]">{po.vendorName}</td>
                  <td className="py-4 px-4 text-[#7b8798]">{po.itemsList}</td>
                  <td className="py-4 px-4 text-[#7b8798]">{po.orderDate}</td>
                  <td className="py-4 px-4 text-[#475569]">{po.expectedDelivery}</td>
                  <td className="py-4 px-4 font-bold text-[#17243b]">
                    {permissions.canViewCostsAndMargins
                      ? `£${po.totalAmount.toLocaleString()}`
                      : '🔒 Hidden'}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant={po.status === 'Delivered' ? 'green' : 'blue'}>
                      {po.status}
                    </Badge>
                  </td>
                  <td className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedPO(po)}
                    >
                      View PO
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screen #16: Purchase Order Detail Modal */}
      {selectedPO && (
        <Modal
          isOpen={!!selectedPO}
          onClose={() => setSelectedPO(null)}
          title={`Purchase Order Detail: ${selectedPO.poNumber}`}
          subtitle={`Issued to ${selectedPO.vendorName} · Linked to ${selectedPO.projectName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase block">Supplier</span>
                <div className="font-extrabold text-[#17243b] mt-0.5">{selectedPO.vendorName}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase block">Order Date / Due Date</span>
                <div className="font-bold text-[#334155] mt-0.5">
                  {selectedPO.orderDate} → {selectedPO.expectedDelivery}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase block">Committed Total</span>
                <div className="font-extrabold text-[#4268e8] text-sm mt-0.5">
                  {permissions.canViewCostsAndMargins
                    ? `£${selectedPO.totalAmount.toLocaleString()}`
                    : '🔒 Restricted'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#e8edf3]">
              <div className="font-bold text-[#17243b] mb-1">Specification & Line Items Summary</div>
              <p className="text-[#475569]">{selectedPO.itemsList}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <Button
                variant="secondary"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => showToast(`Downloaded ${selectedPO.poNumber}.pdf`, 'info')}
              >
                Download PO PDF
              </Button>
              <Button variant="primary" onClick={() => setSelectedPO(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Section 12.1: Pre-Filled Supplier Chase Email Template Modal */}
      {chaseItem && (
        <Modal
          isOpen={!!chaseItem}
          onClose={() => setChaseItem(null)}
          title={`Supplier Delivery Chase Template (${chaseItem.poNumber})`}
          subtitle={`Automated 7/3/1-Day Lead-Time Follow-Up to ${chaseItem.vendorName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl text-[#92400e]">
              <b>Automated Reminder Trigger:</b> Expected delivery is scheduled for{' '}
              <b>{chaseItem.expectedDelivery}</b> ({chaseItem.status}).
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Subject</label>
              <input
                type="text"
                readOnly
                value={`URGENT DISPATCH CHECK: ${chaseItem.poNumber} – ${chaseItem.description} (${chaseItem.projectName})`}
                className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg font-semibold text-[#17243b]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Pre-Filled Chase Message</label>
              <textarea
                rows={5}
                defaultValue={`Dear ${chaseItem.vendorName} Dispatch Team,\n\nPlease confirm production readiness and dispatch tracking for ${chaseItem.poNumber} (${chaseItem.quantity} ${chaseItem.unit} – ${chaseItem.description}) scheduled for delivery on ${chaseItem.expectedDelivery} for project ${chaseItem.projectName}.\n\nKind regards,\nAMR FRNTR Procurement Desk`}
                className="w-full p-3 border border-[#cbd5e1] rounded-lg text-[#334155]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <Button variant="secondary" onClick={() => setChaseItem(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  showToast(`Supplier chase email dispatched to ${chaseItem.vendorName}`, 'success');
                  setChaseItem(null);
                }}
              >
                Send Supplier Chase Email
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Sourced Item Modal */}
      <Modal
        isOpen={isSourcingModalOpen}
        onClose={() => setIsSourcingModalOpen(false)}
        title="Add Sourced Product / Material"
        subtitle="Log material specification, vendor pricing, and expected delivery date"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSourcedItem} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
              <select
                value={newItem.projectId}
                onChange={(e) => setNewItem({ ...newItem, projectId: e.target.value })}
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
              <label className="block text-xs font-bold text-[#475569] mb-1">Vendor / Supplier</label>
              <select
                value={newItem.vendorId}
                onChange={(e) => setNewItem({ ...newItem, vendorId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Product Description *</label>
            <input
              required
              type="text"
              placeholder="e.g. Contract FR Crib 5 Velvet Upholstery Fabric"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Quantity</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Unit</label>
              <input
                type="text"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Unit Cost (£)</label>
              <input
                type="number"
                value={newItem.unitCost}
                onChange={(e) => setNewItem({ ...newItem, unitCost: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">PO / RFQ Number</label>
              <input
                type="text"
                value={newItem.poNumber}
                onChange={(e) => setNewItem({ ...newItem, poNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Expected Delivery Date</label>
              <input
                type="date"
                value={newItem.expectedDelivery}
                onChange={(e) => setNewItem({ ...newItem, expectedDelivery: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsSourcingModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Sourced Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create PO Modal */}
      <Modal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        title="Generate Purchase Order"
        subtitle="Issue official supplier purchase order with committed costs and expected delivery dates"
        maxWidth="md"
      >
        <form onSubmit={handleCreatePO} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
            <select
              value={newPO.projectId}
              onChange={(e) => setNewPO({ ...newPO, projectId: e.target.value })}
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
            <label className="block text-xs font-bold text-[#475569] mb-1">Supplier / Vendor</label>
            <select
              value={newPO.vendorId}
              onChange={(e) => setNewPO({ ...newPO, vendorId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Items Summary *</label>
            <input
              required
              type="text"
              value={newPO.itemsList}
              onChange={(e) => setNewPO({ ...newPO, itemsList: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Total PO Value (£)</label>
              <input
                type="number"
                value={newPO.totalAmount}
                onChange={(e) => setNewPO({ ...newPO, totalAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Required Delivery Date</label>
              <input
                type="date"
                value={newPO.expectedDelivery}
                onChange={(e) => setNewPO({ ...newPO, expectedDelivery: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsPOModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Issue Purchase Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
