'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  FolderPlus,
  Plus,
  ArrowLeft,
  Mail,
  Phone,
  PoundSterling,
  MapPin,
  ArrowRight,
  UserPlus,
  PhoneCall,
  FileSpreadsheet,
  ShieldCheck,
  Tag,
  Lock,
} from 'lucide-react';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.id as string;

  const {
    clients,
    projects,
    quotations,
    payments,
    emails,
    callLogs,
    maintenancePlans,
    permissions,
    updateClient,
    addClientContact,
    addProject,
    addCallLog,
  } = useApp();

  const client = clients.find((c) => c.id === clientId) || clients[0];

  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const clientQuotes = quotations.filter((q) => q.clientName === client.name);
  const clientPayments = payments.filter((p) => p.clientName === client.name);
  const clientMaintenance = maintenancePlans.filter((m) => m.clientName === client.name);

  // Project Filter for Communication Timeline (Section 5.2)
  const [commProjectFilter, setCommProjectFilter] = useState('All');

  const clientEmails = emails.filter(
    (e) =>
      e.clientName === client.name &&
      (commProjectFilter === 'All' || e.projectName === commProjectFilter)
  );
  const clientCallLogs = callLogs.filter(
    (c) =>
      clientProjects.some((p) => p.name === c.projectName) &&
      (commProjectFilter === 'All' || c.projectName === commProjectFilter)
  );

  // Modals state
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  // Edit Client Form State
  const [editForm, setEditForm] = useState({
    name: client.name,
    type: client.type,
    location: client.location,
    accountManager: client.accountManager,
    notes: client.notes || '',
    tags: (client.tags || ['Hospitality', 'Repeat Client']).join(', '),
  });

  // New Project Form
  const [newProject, setNewProject] = useState({
    name: '',
    siteAddress: '',
    approvedValue: 35000,
    owner: 'Sarah Mitchell',
    targetCompletion: '2027-02-28',
    description: '',
  });

  // New Contact Form (Owner, Project Manager, Designer, Accounts, Site Contact)
  const [newContact, setNewContact] = useState({
    name: '',
    role: 'Project Manager',
    email: '',
    phone: '',
  });

  // New Call / Meeting Log Form
  const [newLog, setNewLog] = useState({
    contactName: client.contacts[0]?.name || '',
    projectName: clientProjects[0]?.name || client.name,
    type: 'Phone Call' as const,
    summary: '',
    actionOwner: 'Sarah Mitchell',
    followUpDate: '',
  });

  const handleSaveClientEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClient(client.id, {
      name: editForm.name,
      type: editForm.type,
      location: editForm.location,
      accountManager: editForm.accountManager,
      notes: editForm.notes,
      tags: editForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setIsEditClientModalOpen(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    addProject({
      name: newProject.name,
      clientId: client.id,
      clientName: client.name,
      siteAddress: newProject.siteAddress || client.location,
      owner: newProject.owner,
      approvedValue: Number(newProject.approvedValue),
      targetCompletion: newProject.targetCompletion,
      description: newProject.description,
    });
    setIsNewProjectModalOpen(false);
    setNewProject({
      name: '',
      siteAddress: '',
      approvedValue: 35000,
      owner: 'Sarah Mitchell',
      targetCompletion: '2027-02-28',
      description: '',
    });
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name) return;
    addClientContact(client.id, {
      name: newContact.name,
      role: newContact.role || 'Project Contact',
      email: newContact.email || 'contact@client.co.uk',
      phone: newContact.phone || '+44 20 7946 0000',
      isPrimary: false,
    });
    setIsAddContactModalOpen(false);
    setNewContact({ name: '', role: 'Project Manager', email: '', phone: '' });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.summary) return;
    addCallLog({
      projectName: newLog.projectName,
      contactName: newLog.contactName,
      type: newLog.type,
      summary: newLog.summary,
      actionOwner: newLog.actionOwner,
      followUpDate: newLog.followUpDate,
    });
    setIsAddNoteModalOpen(false);
    setNewLog({
      contactName: client.contacts[0]?.name || '',
      projectName: clientProjects[0]?.name || client.name,
      type: 'Phone Call',
      summary: '',
      actionOwner: 'Sarah Mitchell',
      followUpDate: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button & Page Header */}
      <div>
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7b8798] hover:text-[#17243b] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Clients Directory
        </Link>

        <div className="bg-white p-6 rounded-2xl border border-[#e8edf3] shadow-xs flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
                CLIENT 360 WORKSPACE / {client.code}
              </span>
              <Badge variant={client.status === 'Active' ? 'green' : 'gray'}>
                {client.status}
              </Badge>
              {(client.tags || ['Hospitality', 'VIP Client']).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[10px] font-bold"
                >
                  <Tag className="w-2.5 h-2.5 text-[#4268e8]" /> {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight">
              {client.name}
            </h1>
            <p className="text-xs md:text-sm text-[#7b8798] flex items-center gap-2 flex-wrap">
              <span>{client.type}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#94a3b8]" /> {client.location}
              </span>
              <span>·</span>
              <span>
                Account Manager: <b className="text-[#17243b]">{client.accountManager}</b>
              </span>
            </p>
            {permissions.canViewInternalNotes ? (
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#edf0f5] text-xs text-[#475569] max-w-3xl mt-2">
                <span className="font-bold text-[#17243b]">Internal Account Notes: </span>
                {client.notes || 'Standard commercial terms apply. Multi-site rollout account.'}
              </div>
            ) : (
              <div className="p-2.5 bg-[#fff1f2] rounded-xl border border-[#fecdd3] text-[11px] text-[#c84c58] font-semibold inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Internal account notes hidden in Client Portal view
              </div>
            )}
          </div>

          {permissions.canEdit && (
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditForm({
                    name: client.name,
                    type: client.type,
                    location: client.location,
                    accountManager: client.accountManager,
                    notes: client.notes || '',
                    tags: (client.tags || ['Hospitality', 'VIP Client']).join(', '),
                  });
                  setIsEditClientModalOpen(true);
                }}
              >
                ✎ Edit Client
              </Button>
              <Button
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsNewProjectModalOpen(true)}
              >
                Add Project
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Top 4 Client Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Settled Value"
          value={
            permissions.canViewCostsAndMargins
              ? `£${client.totalSettledValue.toLocaleString()}`
              : '🔒 Restricted'
          }
          trend="Approved projects & add-ons"
          trendType="neutral"
          icon={<PoundSterling className="w-5 h-5" />}
        />
        <StatCard
          label="Received"
          value={
            permissions.canViewCostsAndMargins
              ? `£${client.totalReceived.toLocaleString()}`
              : '🔒 Restricted'
          }
          trend="Cleared payments"
          trendType="positive"
        />
        <StatCard
          label="Outstanding Balance"
          value={
            permissions.canViewCostsAndMargins
              ? `£${client.totalOutstanding.toLocaleString()}`
              : '🔒 Restricted'
          }
          trend="Invoiced & upcoming milestones"
          trendType="warning"
        />
        <StatCard
          label="Associated Projects"
          value={clientProjects.length.toString().padStart(2, '0')}
          trend="All clickable below"
          trendType="neutral"
          icon={<FolderPlus className="w-5 h-5" />}
        />
      </div>

      {/* Main Grid: Projects History (with Target Completion & Outstanding) & Multi-Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: All Associated Projects */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                Associated Projects & Commercial History
              </h2>
              <p className="text-xs text-[#7b8798]">
                All projects with status, value, target completion, and outstanding payment (Section 5.2)
              </p>
            </div>
            {permissions.canEdit && (
              <Button
                variant="soft"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsNewProjectModalOpen(true)}
              >
                New Project
              </Button>
            )}
          </div>

          <div className="p-6 overflow-x-auto">
            {clientProjects.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="pb-3 pr-4">Project ID & Name</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Target Date</th>
                    <th className="pb-3 px-3">Settled Value</th>
                    <th className="pb-3 px-3">Outstanding</th>
                    <th className="pb-3 pl-3 text-right">Direct Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {clientProjects.map((p) => {
                    const balance = p.settledValue - p.receivedValue;
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-[#f8fafc] cursor-pointer transition-colors group"
                        onClick={() => router.push(`/projects/${p.id}`)}
                      >
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-[#17243b] group-hover:text-[#4268e8]">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-[#7b8798]">
                            {p.code} · {p.siteAddress}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <Badge variant="blue">{p.stage}</Badge>
                        </td>
                        <td className="py-3.5 px-3 text-[#475569] font-medium">
                          {p.targetCompletion}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-[#17243b]">
                          {permissions.canViewCostsAndMargins
                            ? `£${p.settledValue.toLocaleString()}`
                            : '🔒'}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-[#c84c58]">
                          {permissions.canViewCostsAndMargins
                            ? `£${balance.toLocaleString()}`
                            : '🔒'}
                        </td>
                        <td className="py-3.5 pl-3 text-right">
                          <span className="text-xs font-bold text-[#4268e8] group-hover:underline inline-flex items-center gap-1">
                            Open <ArrowRight className="w-3 h-3" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-xs text-[#94a3b8]">
                No projects currently logged for this client.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Contacts Directory */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                Contacts ({client.contacts.length})
              </h2>
              <p className="text-[11px] text-[#7b8798]">
                Owner, PM, Designer, Accounts & Site Contacts
              </p>
            </div>
            {permissions.canEdit && (
              <Button
                variant="secondary"
                size="sm"
                icon={<UserPlus className="w-3.5 h-3.5" />}
                onClick={() => setIsAddContactModalOpen(true)}
              >
                Add
              </Button>
            )}
          </div>

          <div className="p-6 flex-1 space-y-3 max-h-[380px] overflow-y-auto">
            {client.contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf0f5] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-xs text-[#17243b] flex items-center gap-1.5">
                    <span>{contact.name}</span>
                    {contact.isPrimary && <Badge variant="blue">Primary</Badge>}
                  </div>
                  <span className="text-[10px] font-bold text-[#4268e8] bg-[#edf1ff] px-2 py-0.5 rounded">
                    {contact.role}
                  </span>
                </div>

                <div className="text-[11px] text-[#475569] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#94a3b8]" />
                    <a href={`mailto:${contact.email}`} className="hover:text-[#4268e8]">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#94a3b8]" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#e8edf3] bg-[#f8fafc] text-[11px] text-[#7b8798]">
            Multi-contact routing automatically links incoming Gmail/Outlook emails to this client.
          </div>
        </div>
      </div>

      {/* Middle Grid: Open/Approved Quotations & Maintenance Opportunities (Section 5.2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open & Approved Quotations */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                Open & Approved Quotations
              </h2>
              <p className="text-xs text-[#7b8798]">Commercial proposals and variation add-ons</p>
            </div>
            <Link
              href="/quotations"
              className="text-xs font-bold text-[#4268e8] hover:underline flex items-center gap-1"
            >
              All Quotes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-6 overflow-x-auto">
            {clientQuotes.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] text-[10px] font-bold text-[#8792a1] uppercase">
                    <th className="pb-2.5 pr-3">Reference</th>
                    <th className="pb-2.5 px-3">Project</th>
                    <th className="pb-2.5 px-3">Type</th>
                    <th className="pb-2.5 px-3">Total</th>
                    <th className="pb-2.5 pl-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {clientQuotes.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => router.push(`/quotations/${q.id}`)}
                      className="hover:bg-[#f8fafc] cursor-pointer"
                    >
                      <td className="py-3 pr-3 font-bold text-[#4268e8]">{q.reference} ({q.version})</td>
                      <td className="py-3 px-3 text-[#17243b] font-semibold">{q.projectName}</td>
                      <td className="py-3 px-3">
                        <Badge variant={q.type === 'Original' ? 'blue' : 'gold'}>{q.type}</Badge>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#17243b]">
                        £{q.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <Badge variant={q.status === 'Approved' ? 'green' : 'amber'}>
                          {q.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-6 text-center text-xs text-[#94a3b8]">No quotations logged.</div>
            )}
          </div>
        </div>

        {/* Maintenance History & Future Opportunities */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                Maintenance History & Aftercare Opportunities
              </h2>
              <p className="text-xs text-[#7b8798]">Warranty schedules and recurring care packages</p>
            </div>
            <Link
              href="/maintenance"
              className="text-xs font-bold text-[#4268e8] hover:underline flex items-center gap-1"
            >
              Aftercare Hub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-6 space-y-3">
            {clientMaintenance.length > 0 ? (
              clientMaintenance.map((mp) => (
                <div
                  key={mp.id}
                  className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf0f5] flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-[#17243b] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#16845f]" />
                      <span>{mp.projectName} · {mp.packageType}</span>
                    </div>
                    <div className="text-[11px] text-[#7b8798] mt-1">
                      Warranty Expiry: {mp.warrantyEndDate} · Next Service: <b>{mp.nextServiceDate}</b>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-xs text-[#16845f]">
                      £{mp.annualValue.toLocaleString()}/yr
                    </div>
                    <Badge variant="green" className="mt-1">{mp.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf0f5] text-xs text-[#64748b]">
                 Maintenance opportunity will auto-generate upon practical completion of active projects.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Payment History Ledger & Client Communication (with Project Filter) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment History Ledger */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">Payment History Ledger</h2>
              <p className="text-xs text-[#7b8798]">Invoices and receipts recorded for {client.name}</p>
            </div>
            <Link
              href="/payments"
              className="text-xs font-bold text-[#4268e8] hover:text-[#3455cc] flex items-center gap-1"
            >
              Full Ledger <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 overflow-x-auto">
            {clientPayments.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="pb-3 pr-4">Invoice / Date</th>
                    <th className="pb-3 px-4">Project</th>
                    <th className="pb-3 px-4">Stage</th>
                    <th className="pb-3 px-4">Amount</th>
                    <th className="pb-3 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {clientPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#f8fafc]">
                      <td className="py-3 pr-4">
                        <div className="font-bold text-[#17243b]">{pay.invoiceRef}</div>
                        <div className="text-[10px] text-[#7b8798]">{pay.invoiceDate}</div>
                      </td>
                      <td className="py-3 px-4 text-[#475569]">{pay.projectName}</td>
                      <td className="py-3 px-4 text-[#7b8798]">{pay.stage}</td>
                      <td className="py-3 px-4 font-bold text-[#17243b]">
                        £{pay.amount.toLocaleString()}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <Badge
                          variant={
                            pay.status === 'Paid'
                              ? 'green'
                              : pay.status === 'Overdue'
                              ? 'red'
                              : 'amber'
                          }
                        >
                          {pay.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-xs text-[#94a3b8]">
                No payment entries recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Client Communication Timeline with Project Filter (Section 5.2) */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                Communication Timeline
              </h2>
              <p className="text-xs text-[#7b8798]">Filterable by project (Emails & Call Logs)</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={commProjectFilter}
                onChange={(e) => setCommProjectFilter(e.target.value)}
                className="px-2.5 py-1 text-xs border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-[#334155]"
              >
                <option value="All">All Client Projects</option>
                {clientProjects.map((cp) => (
                  <option key={cp.id} value={cp.name}>
                    {cp.code} · {cp.name}
                  </option>
                ))}
              </select>
              {permissions.canEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<PhoneCall className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddNoteModalOpen(true)}
                >
                  Log Call
                </Button>
              )}
            </div>
          </div>

          <div className="p-6 flex-1 space-y-3 max-h-[360px] overflow-y-auto">
            {clientEmails.map((em) => (
              <div
                key={em.id}
                onClick={() => router.push('/communications')}
                className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf0f5] hover:border-[#cbd5e1] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#17243b] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#4268e8]" />
                    <span>{em.fromName} · {em.projectName}</span>
                  </div>
                  <span className="text-[10px] text-[#7b8798]">{em.date}</span>
                </div>
                <div className="text-xs font-semibold text-[#334155] mt-1">{em.subject}</div>
                <p className="text-[11px] text-[#7b8798] mt-0.5 line-clamp-2">{em.snippet}</p>
              </div>
            ))}

            {clientCallLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#fffcf5] border border-[#fef08a] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#92400e] flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{log.type} with {log.contactName} ({log.projectName})</span>
                  </div>
                  <span className="text-[10px] text-[#a16207]">{log.dateTime}</span>
                </div>
                <p className="text-[#78350f] text-[11px] mt-1">{log.summary}</p>
                <div className="text-[10px] text-[#b45309] font-medium pt-1">
                  Action Owner: {log.actionOwner}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#e8edf3] bg-[#f8fafc]">
            <Button
              variant="soft"
              className="w-full"
              onClick={() => router.push('/communications')}
            >
              Open Full Communications Hub
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Client Profile Modal */}
      <Modal
        isOpen={isEditClientModalOpen}
        onClose={() => setIsEditClientModalOpen(false)}
        title={`Edit Client Profile: ${client.name}`}
        subtitle="Update company details, account manager, tags, and internal commercial notes"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveClientEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Company Name *</label>
              <input
                required
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Industry Sector</label>
              <input
                type="text"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Account Manager</label>
              <select
                value={editForm.accountManager}
                onChange={(e) => setEditForm({ ...editForm, accountManager: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option>Sarah Mitchell</option>
                <option>James Wilson</option>
                <option>Arjun Mehta</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Internal Account Notes</label>
            <textarea
              rows={3}
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsEditClientModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Project Modal */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title={`Create Project for ${client.name}`}
        subtitle="Initialize new fit-out workspace and commercial baseline"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Project Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. The Alder Restaurant Mezzanine Extension"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Site Address</label>
              <input
                type="text"
                placeholder="Site location in UK"
                value={newProject.siteAddress}
                onChange={(e) => setNewProject({ ...newProject, siteAddress: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Project Owner (UK PM)</label>
              <select
                value={newProject.owner}
                onChange={(e) => setNewProject({ ...newProject, owner: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option>Sarah Mitchell</option>
                <option>James Wilson</option>
                <option>Arjun Mehta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Approved Project Value (£)</label>
              <input
                type="number"
                value={newProject.approvedValue}
                onChange={(e) => setNewProject({ ...newProject, approvedValue: Number(e.target.value) })}
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
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Scope & Joinery Description</label>
            <textarea
              rows={3}
              placeholder="Detailed description of joinery items, finishes, site restrictions..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsNewProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Initialize Project Workspace
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        title={`Add Contact to ${client.name}`}
        subtitle="Support roles: Owner, Project Manager, Designer, Accounts, Site Contact"
        maxWidth="md"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Full Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Michael Green"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Contact Role (Section 5.2)</label>
            <select
              value={newContact.role}
              onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            >
              <option value="Owner / Director">Owner / Director</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Interior Designer / Architect">Interior Designer / Architect</option>
              <option value="Accounts / Finance">Accounts / Finance</option>
              <option value="Site Contact">Site Contact</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Email</label>
              <input
                type="email"
                placeholder="michael@client.co.uk"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Phone</label>
              <input
                type="text"
                placeholder="+44 7700..."
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsAddContactModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Call / Meeting Note Modal */}
      <Modal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        title="Log Communication / Meeting Note"
        subtitle="Record telephone conversation or on-site meeting details"
        maxWidth="md"
      >
        <form onSubmit={handleAddNote} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Contact Person</label>
              <input
                type="text"
                value={newLog.contactName}
                onChange={(e) => setNewLog({ ...newLog, contactName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Interaction Type</label>
              <select
                value={newLog.type}
                onChange={(e) => setNewLog({ ...newLog, type: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Phone Call">Phone Call</option>
                <option value="Site Meeting">Site Meeting</option>
                <option value="Teams Meeting">Teams Meeting</option>
                <option value="Workshop Visit">Workshop Visit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Summary of Discussion *</label>
            <textarea
              required
              rows={4}
              placeholder="Key notes, decisions made, dimensions agreed, access restrictions discussed..."
              value={newLog.summary}
              onChange={(e) => setNewLog({ ...newLog, summary: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Action Owner</label>
              <input
                type="text"
                value={newLog.actionOwner}
                onChange={(e) => setNewLog({ ...newLog, actionOwner: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Follow-up Date</label>
              <input
                type="date"
                value={newLog.followUpDate}
                onChange={(e) => setNewLog({ ...newLog, followUpDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsAddNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Log Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
