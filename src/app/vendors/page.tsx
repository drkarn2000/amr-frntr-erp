'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Truck,
  Plus,
  Search,
  Star,
  Clock,
  AlertTriangle,
  Mail,
  Eye,
} from 'lucide-react';
import { Vendor } from '@/types';

export default function VendorsPage() {
  const { vendors, sourcedProducts, defects, addVendor } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // New vendor form state
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: 'Timber' as Vendor['category'],
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    paymentTerms: '30 Days Net',
    leadTimeDays: 14,
  });

  const filteredVendors = vendors.filter((v) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      v.name.toLowerCase().includes(q) ||
      v.contactPerson.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'All' || v.category.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name) return;
    addVendor({
      name: newVendor.name,
      category: newVendor.category,
      contactPerson: newVendor.contactPerson || 'Sales Desk',
      email: newVendor.email || 'sales@vendor.co.uk',
      phone: newVendor.phone || '+44 20 7946 0000',
      location: newVendor.location || 'United Kingdom',
      paymentTerms: newVendor.paymentTerms,
      leadTimeDays: Number(newVendor.leadTimeDays),
      rating: 4.8,
      openOrdersCount: 0,
      defectsCount: 0,
    });
    setIsAddVendorModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            SECTION 10.1 & SCREEN #15 · VENDOR DIRECTORY & DETAIL WORKSPACE
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Vendors & Suppliers Directory
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Directory of timber mills, contract upholstery fabric houses, metal fabricators, and specialized joinery subcontractors.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddVendorModalOpen(true)}
        >
          Add Vendor
        </Button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Suppliers"
          value={vendors.length.toString().padStart(2, '0')}
          trend="Vetted UK & European suppliers"
          trendType="neutral"
          icon={<Truck className="w-5 h-5" />}
        />
        <StatCard
          label="Avg Lead Time"
          value="12.4 Days"
          trend="Order issue to shop dispatch"
          trendType="positive"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="Supplier Performance"
          value="4.7 / 5"
          trend="On-time delivery index"
          trendType="positive"
          icon={<Star className="w-5 h-5" />}
        />
        <StatCard
          label="Active Orders"
          value={vendors.reduce((acc, v) => acc + v.openOrdersCount, 0).toString().padStart(2, '0')}
          trend="Live POs in production"
          trendType="neutral"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search vendor name, contact person, email or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
        >
          <option value="All">All Categories</option>
          <option value="Timber">Timber & Hardwoods</option>
          <option value="Upholstery">Upholstery & Fabrics</option>
          <option value="Metalwork">Metalwork & Brass</option>
          <option value="Subcontractor">Subcontractor</option>
        </select>
      </div>

      {/* Vendors Master Table */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                <th className="py-3.5 px-6">Vendor / Supplier</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Payment Terms</th>
                <th className="py-3.5 px-4 text-center">Lead Time</th>
                <th className="py-3.5 px-4 text-center">Rating</th>
                <th className="py-3.5 px-4 text-center">Defects</th>
                <th className="py-3.5 pr-6 text-right">Vendor Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredVendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  onClick={() => setSelectedVendor(vendor)}
                  className="hover:bg-[#f8fafc] cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-[#17243b] text-xs">{vendor.name}</div>
                    <div className="text-[11px] text-[#7b8798] flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-[#94a3b8]" />
                      <span>{vendor.email}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant="blue">{vendor.category}</Badge>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-[#17243b]">{vendor.contactPerson}</div>
                    <div className="text-[11px] text-[#7b8798]">{vendor.phone}</div>
                  </td>

                  <td className="py-4 px-4 text-[#475569]">{vendor.location}</td>

                  <td className="py-4 px-4 font-medium text-[#334155]">{vendor.paymentTerms}</td>

                  <td className="py-4 px-4 text-center font-bold text-[#17243b]">
                    {vendor.leadTimeDays} days
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {vendor.rating}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <Badge variant={vendor.defectsCount > 0 ? 'red' : 'green'}>
                      {vendor.defectsCount}
                    </Badge>
                  </td>

                  <td className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedVendor(vendor)}
                    >
                      View Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screen #15: Vendor Detail Modal */}
      {selectedVendor && (
        <Modal
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          title={`Vendor Profile: ${selectedVendor.name}`}
          subtitle={`${selectedVendor.category} · ${selectedVendor.location} · Terms: ${selectedVendor.paymentTerms}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-4 gap-3 p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase block">Primary Contact</span>
                <div className="font-bold text-[#17243b] mt-0.5">{selectedVendor.contactPerson}</div>
                <div className="text-[11px] text-[#7b8798]">{selectedVendor.phone}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase block">Avg Lead Time</span>
                <div className="font-extrabold text-[#17243b] mt-0.5">{selectedVendor.leadTimeDays} Days</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase block">Open Orders</span>
                <div className="font-extrabold text-[#4268e8] mt-0.5">
                  {selectedVendor.openOrdersCount} Active POs
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#7b8798] uppercase block">Quality / Defects</span>
                <div className="font-bold text-[#16845f] mt-0.5">
                  Rating {selectedVendor.rating}/5 ({selectedVendor.defectsCount} defects)
                </div>
              </div>
            </div>

            {/* Sourced Items from this Vendor */}
            <div>
              <div className="font-bold text-[#17243b] mb-2">
                Supplied Products & Active Orders ({sourcedProducts.filter((s) => s.vendorId === selectedVendor.id).length})
              </div>
              <div className="space-y-2">
                {sourcedProducts
                  .filter((s) => s.vendorId === selectedVendor.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf0f5] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#17243b]">{item.description}</div>
                        <div className="text-[11px] text-[#7b8798]">
                          Project: {item.projectName} · PO: {item.poNumber} · Expected: {item.expectedDelivery}
                        </div>
                      </div>
                      <Badge variant={item.status === 'Delivered' ? 'green' : 'amber'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            {/* Linked Defects */}
            <div>
              <div className="font-bold text-[#17243b] mb-2">
                Supplier Quality / Snagging History ({defects.filter((d) => d.vendorName === selectedVendor.name).length})
              </div>
              {defects.filter((d) => d.vendorName === selectedVendor.name).length > 0 ? (
                defects
                  .filter((d) => d.vendorName === selectedVendor.name)
                  .map((def) => (
                    <div
                      key={def.id}
                      className="p-3 rounded-xl bg-[#ffeaec]/40 border border-[#fecdd3] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#17243b]">
                          {def.code}: {def.issue}
                        </div>
                        <div className="text-[11px] text-[#7b8798]">
                          Root Cause: {def.rootCause} · Replacement: {def.replacementTargetDate}
                        </div>
                      </div>
                      <Badge variant="red">{def.status}</Badge>
                    </div>
                  ))
              ) : (
                <div className="p-3 rounded-xl bg-[#e8f7f0] text-[#16845f] font-semibold">
                  ✓ Zero defects logged against this supplier.
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Add Vendor Modal */}
      <Modal
        isOpen={isAddVendorModalOpen}
        onClose={() => setIsAddVendorModalOpen(false)}
        title="Register Supplier / Vendor"
        subtitle="Add material manufacturer, terms, lead time, and contact point"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateVendor} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Company Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Apex Stone & Quartz Ltd"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Category</label>
              <select
                value={newVendor.category}
                onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as Vendor['category'] })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Timber">Timber</option>
                <option value="Upholstery">Upholstery</option>
                <option value="Metalwork">Metalwork</option>
                <option value="Finishes & Lacquer">Finishes & Lacquer</option>
                <option value="Joinery Hardware">Joinery Hardware</option>
                <option value="Subcontractor">Subcontractor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Primary Contact Person</label>
              <input
                type="text"
                placeholder="e.g. David Miller"
                value={newVendor.contactPerson}
                onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Factory Location</label>
              <input
                type="text"
                placeholder="e.g. Leeds, West Yorkshire, UK"
                value={newVendor.location}
                onChange={(e) => setNewVendor({ ...newVendor, location: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Email</label>
              <input
                type="email"
                placeholder="sales@vendor.co.uk"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Phone</label>
              <input
                type="text"
                placeholder="+44 113 496..."
                value={newVendor.phone}
                onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsAddVendorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register Vendor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
