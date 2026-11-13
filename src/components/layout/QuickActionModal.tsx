'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  FolderPlus,
  UserPlus,
  FileSpreadsheet,
  UploadCloud,
  PoundSterling,
  Boxes,
  Truck,
  Clock,
  Mail,
  AlertTriangle,
} from 'lucide-react';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    clients,
    projects,
    addClient,
    addProject,
    addQuotation,
    addDocument,
    addPayment,
    addSourcedProduct,
    addMilestone,
    addDefect,
  } = useApp();

  const [activeForm, setActiveForm] = useState<string | null>(null);

  // Form states
  const [clientForm, setClientForm] = useState({
    name: '',
    type: 'Hospitality & Dining Group',
    location: '',
    accountManager: 'Sarah Mitchell',
    contactName: '',
    contactRole: 'Director',
    contactEmail: '',
    contactPhone: '',
    notes: '',
  });

  const [projectForm, setProjectForm] = useState({
    name: '',
    clientId: clients[0]?.id || '',
    siteAddress: '',
    owner: 'Sarah Mitchell',
    targetCompletion: '',
    approvedValue: 25000,
    priority: 'Normal' as const,
    description: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    projectId: projects[0]?.id || '',
    invoiceRef: 'INV-1085',
    stage: 'Production Stage' as const,
    amount: 10000,
    dueDate: '',
    status: 'Upcoming' as const,
  });

  const [defectForm, setDefectForm] = useState({
    projectId: projects[0]?.id || '',
    issue: '',
    description: '',
    linkedProduct: '',
    severity: 'Medium' as const,
    owner: 'James Wilson',
  });

  const handleClose = () => {
    setIsQuickActionOpen(false);
    setActiveForm(null);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name) return;
    addClient({
      name: clientForm.name,
      type: clientForm.type,
      location: clientForm.location || 'London, UK',
      accountManager: clientForm.accountManager,
      status: 'Active',
      notes: clientForm.notes,
      contacts: [
        {
          id: 'con-' + Date.now(),
          name: clientForm.contactName || 'Primary Contact',
          role: clientForm.contactRole,
          email: clientForm.contactEmail || 'contact@client.co.uk',
          phone: clientForm.contactPhone || '+44 20 7946 0000',
          isPrimary: true,
        },
      ],
    });
    handleClose();
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name) return;
    const client = clients.find((c) => c.id === projectForm.clientId) || clients[0];
    addProject({
      name: projectForm.name,
      clientId: client.id,
      clientName: client.name,
      siteAddress: projectForm.siteAddress || 'London, UK',
      owner: projectForm.owner,
      approvedValue: Number(projectForm.approvedValue) || 20000,
      priority: projectForm.priority,
      targetCompletion: projectForm.targetCompletion || '2027-01-31',
      description: projectForm.description,
    });
    handleClose();
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === paymentForm.projectId) || projects[0];
    addPayment({
      projectId: proj.id,
      projectName: proj.name,
      clientName: proj.clientName,
      invoiceRef: paymentForm.invoiceRef,
      stage: paymentForm.stage,
      amount: Number(paymentForm.amount),
      dueDate: paymentForm.dueDate || new Date().toISOString().split('T')[0],
      status: paymentForm.status,
    });
    handleClose();
  };

  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectForm.issue) return;
    const proj = projects.find((p) => p.id === defectForm.projectId) || projects[0];
    addDefect({
      projectId: proj.id,
      projectName: proj.name,
      issue: defectForm.issue,
      description: defectForm.description,
      linkedProduct: defectForm.linkedProduct,
      severity: defectForm.severity,
      owner: defectForm.owner,
    });
    handleClose();
  };

  if (!isQuickActionOpen) return null;

  return (
    <Modal
      isOpen={isQuickActionOpen}
      onClose={handleClose}
      title={
        activeForm === 'client'
          ? 'Add New Client'
          : activeForm === 'project'
          ? 'Create New Project'
          : activeForm === 'payment'
          ? 'Record Payment Milestone'
          : activeForm === 'defect'
          ? 'Log Defect / Snag'
          : 'Quick Create Action'
      }
      subtitle={
        activeForm
          ? 'Enter operational details below'
          : 'Select an operational record to create immediately'
      }
      maxWidth="lg"
    >
      {!activeForm ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
          <button
            onClick={() => setActiveForm('project')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#e8edf3] hover:border-[#4268e8] hover:bg-[#edf1ff]/40 text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#edf1ff] text-[#4268e8] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FolderPlus className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#17243b]">Create Project</span>
            <span className="text-[10px] text-[#7b8798] mt-0.5">FFC project workspace</span>
          </button>

          <button
            onClick={() => setActiveForm('client')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#e8edf3] hover:border-[#16845f] hover:bg-[#e8f7f0]/40 text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e8f7f0] text-[#16845f] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#17243b]">Add Client</span>
            <span className="text-[10px] text-[#7b8798] mt-0.5">Customer & contacts</span>
          </button>

          <button
            onClick={() => setActiveForm('payment')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#e8edf3] hover:border-[#4268e8] hover:bg-[#edf1ff]/40 text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#edf1ff] text-[#4268e8] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PoundSterling className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#17243b]">Record Payment</span>
            <span className="text-[10px] text-[#7b8798] mt-0.5">Milestone or invoice</span>
          </button>

          <button
            onClick={() => setActiveForm('defect')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#e8edf3] hover:border-[#c84c58] hover:bg-[#ffeaec]/40 text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ffeaec] text-[#c84c58] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#17243b]">Log Defect / Snag</span>
            <span className="text-[10px] text-[#7b8798] mt-0.5">Assign to vendor/fitter</span>
          </button>

          <button
            onClick={() => {
              addDocument({
                title: 'Spec Sheet & Finishes Schedule',
                type: 'Specification',
                version: 'v1',
                approvalStatus: 'Pending',
              });
              handleClose();
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#e8edf3] hover:border-[#3b82f6] hover:bg-[#eff6ff] text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#17243b]">Upload Drawing</span>
            <span className="text-[10px] text-[#7b8798] mt-0.5">Controlled revision</span>
          </button>

          <button
            onClick={() => {
              addQuotation({
                type: 'Enhancement',
                totalAmount: 3500,
                notes: 'Additional joinery work requested by client',
              });
              handleClose();
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#e8edf3] hover:border-[#b7791f] hover:bg-[#fff4df]/40 text-center transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fff4df] text-[#b7791f] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#17243b]">Draft Quotation</span>
            <span className="text-[10px] text-[#7b8798] mt-0.5">Original or add-on</span>
          </button>
        </div>
      ) : activeForm === 'client' ? (
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Company Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Belgravia Hospitality Group"
                value={clientForm.name}
                onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#4268e8] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Industry Sector</label>
              <select
                value={clientForm.type}
                onChange={(e) => setClientForm({ ...clientForm, type: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#4268e8] outline-none"
              >
                <option>Hospitality & Dining Group</option>
                <option>Boutique Hotelier & Leisure</option>
                <option>Prime Commercial Real Estate</option>
                <option>Luxury Residential Developer</option>
                <option>Retail & Showroom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Location / HQ</label>
              <input
                type="text"
                placeholder="e.g. Mayfair, London, UK"
                value={clientForm.location}
                onChange={(e) => setClientForm({ ...clientForm, location: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#4268e8] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Account Manager</label>
              <select
                value={clientForm.accountManager}
                onChange={(e) => setClientForm({ ...clientForm, accountManager: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#4268e8] outline-none"
              >
                <option>Sarah Mitchell</option>
                <option>James Wilson</option>
                <option>Arjun Mehta</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-3">
            <span className="text-xs font-bold text-[#17243b] block">Primary Contact Person</span>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Contact Full Name"
                value={clientForm.contactName}
                onChange={(e) => setClientForm({ ...clientForm, contactName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg bg-white outline-none"
              />
              <input
                type="text"
                placeholder="Role (e.g. Operations Director)"
                value={clientForm.contactRole}
                onChange={(e) => setClientForm({ ...clientForm, contactRole: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg bg-white outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={clientForm.contactEmail}
                onChange={(e) => setClientForm({ ...clientForm, contactEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg bg-white outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={clientForm.contactPhone}
                onChange={(e) => setClientForm({ ...clientForm, contactPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg bg-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setActiveForm(null)}>
              Back
            </Button>
            <Button variant="primary" type="submit">
              Save Client Record
            </Button>
          </div>
        </form>
      ) : activeForm === 'project' ? (
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Project Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. The Claridge Bar & Brasserie"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Client</label>
              <select
                value={projectForm.clientId}
                onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Site Address</label>
              <input
                type="text"
                placeholder="e.g. 10 Brook Street, Mayfair, London"
                value={projectForm.siteAddress}
                onChange={(e) => setProjectForm({ ...projectForm, siteAddress: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Target Completion</label>
              <input
                type="date"
                value={projectForm.targetCompletion}
                onChange={(e) => setProjectForm({ ...projectForm, targetCompletion: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Approved Project Value (£)</label>
              <input
                type="number"
                value={projectForm.approvedValue}
                onChange={(e) => setProjectForm({ ...projectForm, approvedValue: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Priority</label>
              <select
                value={projectForm.priority}
                onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Project Scope / Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of joinery, banquettes, timber finish..."
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setActiveForm(null)}>
              Back
            </Button>
            <Button variant="primary" type="submit">
              Create Project Workspace
            </Button>
          </div>
        </form>
      ) : activeForm === 'payment' ? (
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Project</label>
              <select
                value={paymentForm.projectId}
                onChange={(e) => setPaymentForm({ ...paymentForm, projectId: e.target.value })}
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
              <label className="block text-xs font-bold text-[#475569] mb-1">Invoice Reference</label>
              <input
                type="text"
                value={paymentForm.invoiceRef}
                onChange={(e) => setPaymentForm({ ...paymentForm, invoiceRef: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Stage</label>
              <select
                value={paymentForm.stage}
                onChange={(e) => setPaymentForm({ ...paymentForm, stage: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Deposit 30%">Deposit 30%</option>
                <option value="Production Stage">Production Stage</option>
                <option value="Delivery Stage">Delivery Stage</option>
                <option value="Installation Stage">Installation Stage</option>
                <option value="Final Payment">Final Payment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Amount (£)</label>
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setActiveForm(null)}>
              Back
            </Button>
            <Button variant="primary" type="submit">
              Save Payment Record
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCreateDefect} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Project</label>
              <select
                value={defectForm.projectId}
                onChange={(e) => setDefectForm({ ...defectForm, projectId: e.target.value })}
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
              <label className="block text-xs font-bold text-[#475569] mb-1">Severity</label>
              <select
                value={defectForm.severity}
                onChange={(e) => setDefectForm({ ...defectForm, severity: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Defect Title / Issue *</label>
            <input
              required
              type="text"
              placeholder="e.g. Scratched satin brass kickplate"
              value={defectForm.issue}
              onChange={(e) => setDefectForm({ ...defectForm, issue: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Description & Root Cause</label>
            <textarea
              rows={3}
              placeholder="Detailed description of defect on site or in workshop..."
              value={defectForm.description}
              onChange={(e) => setDefectForm({ ...defectForm, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setActiveForm(null)}>
              Back
            </Button>
            <Button variant="danger" type="submit">
              Log Snag & Assign
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

