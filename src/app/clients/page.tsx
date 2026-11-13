'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Users2,
  UserPlus,
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  FolderKanban,
  PhoneCall,
  Plus,
  PoundSterling,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
} from 'lucide-react';
import { Client } from '@/types';

export default function ClientsPage() {
  const router = useRouter();
  const {
    clients,
    projects,
    payments,
    permissions,
    addClient,
    addProject,
    addCallLog,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');

  // Modals & Action Dropdown
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [paymentHistoryClient, setPaymentHistoryClient] = useState<Client | null>(null);
  const [callNoteClient, setCallNoteClient] = useState<Client | null>(null);
  const [addProjectClient, setAddProjectClient] = useState<Client | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // New Client Form State with Multi-Contact Support (UAT #1)
  const [newClient, setNewClient] = useState({
    name: '',
    type: 'Hospitality & Dining Group',
    location: '',
    accountManager: 'Sarah Mitchell',
    notes: '',
    contacts: [
      {
        name: '',
        role: 'Operations Director',
        email: '',
        phone: '',
        isPrimary: true,
      },
    ],
  });

  // Quick Call Note Form State
  const [newCallNote, setNewCallNote] = useState({
    contactName: '',
    projectName: '',
    type: 'Phone Call' as const,
    summary: '',
    actionOwner: 'Sarah Mitchell',
    followUpDate: '',
  });

  // Quick Add Project Form State
  const [newProjForm, setNewProjForm] = useState({
    name: '',
    siteAddress: '',
    approvedValue: 40000,
    owner: 'Sarah Mitchell',
    targetCompletion: '2027-02-28',
    description: '',
  });

  // Calculate Metrics
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === 'Active').length;
  const totalPortfolioValue = clients.reduce((acc, c) => acc + (c.totalSettledValue || 0), 0);
  const totalOutstanding = clients.reduce((acc, c) => acc + (c.totalOutstanding || 0), 0);

  // Filtering (Section 5.1: Client, contact, email, phone, project, status)
  const filteredClients = clients.filter((c) => {
    const q = searchTerm.toLowerCase();
    const clientProjects = projects.filter((p) => p.clientId === c.id);
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.contacts.some(
        (con) =>
          con.name.toLowerCase().includes(q) ||
          con.email.toLowerCase().includes(q) ||
          con.phone.includes(q)
      ) ||
      clientProjects.some(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.stage.toLowerCase().includes(q)
      );
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesManager = managerFilter === 'All' || c.accountManager === managerFilter;
    return matchesSearch && matchesStatus && matchesManager;
  });

  const handleAddContactRow = () => {
    setNewClient((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        { name: '', role: 'Project Manager', email: '', phone: '', isPrimary: false },
      ],
    }));
  };

  const handleRemoveContactRow = (idx: number) => {
    setNewClient((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== idx),
    }));
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;
    addClient({
      name: newClient.name,
      type: newClient.type,
      location: newClient.location || 'London, UK',
      accountManager: newClient.accountManager,
      status: 'Active',
      notes: newClient.notes,
      contacts: newClient.contacts.map((con, idx) => ({
        id: 'con-' + Date.now() + '-' + idx,
        name: con.name || `Contact ${idx + 1}`,
        role: con.role || 'Contact',
        email: con.email || 'contact@client.co.uk',
        phone: con.phone || '+44 20 7946 0000',
        isPrimary: idx === 0,
      })),
    });
    setIsAddClientOpen(false);
    setNewClient({
      name: '',
      type: 'Hospitality & Dining Group',
      location: '',
      accountManager: 'Sarah Mitchell',
      notes: '',
      contacts: [
        { name: '', role: 'Operations Director', email: '', phone: '', isPrimary: true },
      ],
    });
  };

  const handleQuickLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callNoteClient || !newCallNote.summary) return;
    addCallLog({
      projectName: newCallNote.projectName || callNoteClient.name,
      contactName: newCallNote.contactName || callNoteClient.contacts[0]?.name || 'Client Contact',
      type: newCallNote.type,
      summary: newCallNote.summary,
      actionOwner: newCallNote.actionOwner,
      followUpDate: newCallNote.followUpDate,
    });
    setCallNoteClient(null);
    setNewCallNote({
      contactName: '',
      projectName: '',
      type: 'Phone Call',
      summary: '',
      actionOwner: 'Sarah Mitchell',
      followUpDate: '',
    });
  };

  const handleQuickCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addProjectClient || !newProjForm.name) return;
    addProject({
      name: newProjForm.name,
      clientId: addProjectClient.id,
      clientName: addProjectClient.name,
      siteAddress: newProjForm.siteAddress || addProjectClient.location,
      owner: newProjForm.owner,
      approvedValue: Number(newProjForm.approvedValue),
      targetCompletion: newProjForm.targetCompletion,
      description: newProjForm.description,
    });
    setAddProjectClient(null);
    setNewProjForm({
      name: '',
      siteAddress: '',
      approvedValue: 40000,
      owner: 'Sarah Mitchell',
      targetCompletion: '2027-02-28',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            RELATIONSHIPS & CLIENT ACCOUNTS (SECTION 5.1)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Client Management
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Customer directory, multi-contact records, clickable projects, payment history, and direct communication access.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={<Download className="w-4 h-4 text-[#64748b]" />}
            onClick={() => showToast('Exporting clients roster to CSV (Demo)', 'info')}
          >
            Export
          </Button>
          {permissions.canEdit && (
            <Button
              variant="primary"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => setIsAddClientOpen(true)}
            >
              Add Client
            </Button>
          )}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Clients"
          value={totalClients}
          trend="Hospitality & commercial accounts"
          trendType="neutral"
          icon={<Users2 className="w-5 h-5" />}
        />
        <StatCard
          label="Active Accounts"
          value={activeClients}
          trend="Live project contracts"
          trendType="positive"
          icon={<FolderKanban className="w-5 h-5" />}
        />
        <StatCard
          label="Client Portfolio Value"
          value={
            permissions.canViewCostsAndMargins
              ? `£${(totalPortfolioValue / 1000).toFixed(1)}k`
              : '🔒 Restricted'
          }
          trend="Settled project volume & enhancements"
          trendType="positive"
        />
        <StatCard
          label="Outstanding Receivables"
          value={
            permissions.canViewCostsAndMargins
              ? `£${(totalOutstanding / 1000).toFixed(1)}k`
              : '🔒 Restricted'
          }
          trend="Awaiting invoice settlement"
          trendType="warning"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search client, contact, email, phone, project or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#4268e8]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#4268e8]"
          >
            <option value="All">All Account Managers</option>
            <option value="Sarah Mitchell">Sarah Mitchell</option>
            <option value="James Wilson">James Wilson</option>
            <option value="Arjun Mehta">Arjun Mehta</option>
          </select>
        </div>
      </div>

      {/* Client Master Table (All Section 5.1 Fields & Functions - Enterprise Horizontal Data Grid) */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        {/* Table Header Strip with Horizontal Scroll Indicator */}
        <div className="px-5 py-3 border-b border-[#e8edf3] bg-gradient-to-r from-[#f8fafc] via-white to-[#f8fafc] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-extrabold text-[#17243b] tracking-tight">
              Client Portfolio & Commercial Matrix
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#edf1ff] text-[#4268e8] border border-[#cbd8ff]">
              {filteredClients.length} Accounts
            </span>
          </div>
          <div className="text-[11px] font-medium text-[#64748b] flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4268e8]/70 animate-pulse" />
            <span>Scroll horizontally ↔ to view all columns</span>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1620px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]/95 text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 px-5 w-[250px]">Client Account & Location</th>
                <th className="py-3.5 px-4 w-[200px]">Sector & Account Owner</th>
                <th className="py-3.5 px-4 w-[250px]">Contacts (Multi-Contact)</th>
                <th className="py-3.5 px-4 w-[330px]">Linked Projects & Stage</th>
                <th className="py-3.5 px-4 w-[175px]">Portfolio Value</th>
                <th className="py-3.5 px-4 w-[225px]">Payment Status & Ledger</th>
                <th className="py-3.5 px-4 w-[185px]">Communication</th>
                <th className="py-3.5 pr-5 pl-4 w-[215px] text-right">Client Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2f6]">
              {filteredClients.map((client) => {
                const primaryContact =
                  client.contacts.find((c) => c.isPrimary) || client.contacts[0];
                const extraContacts = client.contacts.length - 1;
                const clientProjects = projects.filter((p) => p.clientId === client.id);
                const clientEnhancements = clientProjects.reduce(
                  (acc, p) => acc + (p.enhancementValue || 0),
                  0
                );
                const paidPct =
                  client.totalSettledValue > 0
                    ? Math.min(
                        100,
                        Math.round((client.totalReceived / client.totalSettledValue) * 100)
                      )
                    : 0;
                const initials = client.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={client.id}
                    className="hover:bg-[#f8fafc] transition-colors group"
                  >
                    {/* 1. Client Account & Location */}
                    <td className="py-4 px-5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/clients/${client.id}`}
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#17243b] to-[#283d63] text-[#d5b27a] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                        >
                          {initials}
                        </Link>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/clients/${client.id}`}
                              className="font-extrabold text-[#17243b] text-sm hover:text-[#4268e8] transition-colors whitespace-nowrap"
                            >
                              {client.name}
                            </Link>
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0] rounded-md whitespace-nowrap">
                              {client.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-[#64748b] inline-flex items-center gap-1 whitespace-nowrap">
                              <MapPin className="w-3 h-3 text-[#94a3b8] shrink-0" />
                              {client.location}
                            </span>
                            <Badge variant={client.status === 'Active' ? 'green' : 'gray'}>
                              {client.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Sector & Account Owner */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-[#1e293b] whitespace-nowrap">
                          {client.type}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[11px] text-[#475569]">
                          <span className="w-4 h-4 rounded-full bg-[#edf1ff] text-[#4268e8] font-bold text-[9px] flex items-center justify-center">
                            {client.accountManager.charAt(0)}
                          </span>
                          <span className="font-medium">{client.accountManager}</span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Contacts (Primary + Multiple) */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      {primaryContact ? (
                        <div className="space-y-1">
                          <div className="font-bold text-[#17243b] flex items-center gap-2 whitespace-nowrap">
                            <span>{primaryContact.name}</span>
                            {extraContacts > 0 && (
                              <span
                                onClick={() => router.push(`/clients/${client.id}`)}
                                className="px-2 py-0.5 text-[10px] font-bold bg-[#edf1ff] text-[#4268e8] border border-[#cbd8ff] rounded-full cursor-pointer hover:bg-[#4268e8] hover:text-white transition-colors whitespace-nowrap"
                                title={client.contacts.map((c) => `${c.name} (${c.role})`).join(', ')}
                              >
                                +{extraContacts} Contacts
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#64748b] whitespace-nowrap">
                            {primaryContact.role}
                          </div>
                          <div className="flex items-center gap-3 pt-0.5 text-[11px] text-[#475569] whitespace-nowrap">
                            <span className="inline-flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#4268e8]" />
                              {primaryContact.email}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[#64748b]">
                              <Phone className="w-3 h-3 text-[#94a3b8]" />
                              {primaryContact.phone}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#94a3b8] italic">No contact logged</span>
                      )}
                    </td>

                    {/* 4. Linked Projects & Stage (UAT #2) */}
                    <td className="py-4 px-4 align-middle">
                      <div className="space-y-1.5">
                        {clientProjects.length > 0 ? (
                          clientProjects.map((proj) => (
                            <Link
                              key={proj.id}
                              href={`/projects/${proj.id}`}
                              className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-[#f8fafc] hover:bg-[#edf1ff]/75 border border-[#e2e8f0] hover:border-[#93b4ff] transition-all whitespace-nowrap"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="px-1.5 py-0.5 rounded bg-white border border-[#cbd5e1] text-[10px] font-extrabold text-[#17243b]">
                                  {proj.code}
                                </span>
                                <span className="font-bold text-[#4268e8] text-xs truncate max-w-[155px]">
                                  {proj.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] font-semibold text-[#64748b] bg-white px-2 py-0.5 rounded-md border border-[#e2e8f0]">
                                  {proj.stage}
                                </span>
                                <Badge
                                  variant={
                                    proj.health === 'green'
                                      ? 'green'
                                      : proj.health === 'amber'
                                      ? 'amber'
                                      : 'red'
                                  }
                                >
                                  {permissions.canViewCostsAndMargins
                                    ? `£${(proj.settledValue / 1000).toFixed(0)}k`
                                    : proj.stage}
                                </Badge>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <span className="text-[11px] text-[#94a3b8] italic block whitespace-nowrap">
                            No active projects assigned
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Portfolio Value & Enhancements */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      {permissions.canViewCostsAndMargins ? (
                        <div className="space-y-1">
                          <div className="font-extrabold text-[#17243b] text-base tracking-tight whitespace-nowrap">
                            £{client.totalSettledValue.toLocaleString()}
                          </div>
                          {clientEnhancements > 0 ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#edf1ff] text-[#4268e8] text-[10px] font-bold whitespace-nowrap">
                              <span>+£{clientEnhancements.toLocaleString()} Enhancements</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-[#94a3b8] whitespace-nowrap">
                              Base contract value
                            </div>
                          )}
                          <div className="text-[10px] font-medium text-[#64748b] whitespace-nowrap">
                            {clientProjects.length} active contract(s)
                          </div>
                        </div>
                      ) : (
                        <Badge variant="gray">🔒 Restricted</Badge>
                      )}
                    </td>

                    {/* 6. Clickable Payment Status & Ledger */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setPaymentHistoryClient(client)}
                        className="text-left p-2.5 rounded-xl bg-[#f8fafc] hover:bg-[#edf1ff]/50 border border-[#e2e8f0] hover:border-[#93b4ff] transition-all cursor-pointer w-full min-w-[205px]"
                      >
                        <div className="flex items-center justify-between gap-3 text-[11px] whitespace-nowrap">
                          <span className="text-[#64748b]">
                            Paid:{' '}
                            <b className="text-[#16845f]">
                              {permissions.canViewCostsAndMargins
                                ? `£${client.totalReceived.toLocaleString()}`
                                : '🔒'}
                            </b>
                          </span>
                          <span className="text-[#64748b]">
                            Due:{' '}
                            <b className="text-[#c84c58]">
                              {permissions.canViewCostsAndMargins
                                ? `£${client.totalOutstanding.toLocaleString()}`
                                : '🔒'}
                            </b>
                          </span>
                        </div>

                        {/* Collection Progress Bar */}
                        <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden my-2">
                          <div
                            className="h-full bg-gradient-to-r from-[#16845f] to-[#1b9c88] rounded-full"
                            style={{ width: `${paidPct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] whitespace-nowrap">
                          <span className="font-semibold text-[#64748b]">{paidPct}% Settled</span>
                          <span className="font-bold text-[#4268e8] inline-flex items-center gap-0.5 hover:underline">
                            Payment Ledger
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    </td>

                    {/* 7. Dedicated Communication Column */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Mail className="w-3.5 h-3.5 text-[#4268e8]" />}
                          onClick={() => router.push('/communications')}
                        >
                          Inbox
                        </Button>
                        {permissions.canEdit && (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<PhoneCall className="w-3.5 h-3.5 text-[#d97706]" />}
                            onClick={() => {
                              setCallNoteClient(client);
                              setNewCallNote((prev) => ({
                                ...prev,
                                contactName: primaryContact?.name || '',
                                projectName: clientProjects[0]?.name || client.name,
                              }));
                            }}
                          >
                            Log Call
                          </Button>
                        )}
                      </div>
                    </td>

                    {/* 8. Dedicated Client Actions Column */}
                    <td className="py-4 pr-5 pl-4 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        {permissions.canEdit && (
                          <Button
                            variant="soft"
                            size="sm"
                            icon={<Plus className="w-3.5 h-3.5" />}
                            onClick={() => setAddProjectClient(client)}
                          >
                            Project
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<ChevronRight className="w-3.5 h-3.5" />}
                          iconPosition="right"
                          onClick={() => router.push(`/clients/${client.id}`)}
                        >
                          Workspace
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add Client (Supports Multiple Contacts - UAT #1) */}
      <Modal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        title="Add New Client Account (Multi-Contact Supported)"
        subtitle="Register customer details, location, account manager, and multiple points of contact"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Company / Group Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. ABC Limited"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Industry Sector</label>
              <select
                value={newClient.type}
                onChange={(e) => setNewClient({ ...newClient, type: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
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
              <label className="block text-xs font-bold text-[#475569] mb-1">Office / Billing / Site Location</label>
              <input
                type="text"
                placeholder="e.g. Soho, London, UK"
                value={newClient.location}
                onChange={(e) => setNewClient({ ...newClient, location: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Account Manager</label>
              <select
                value={newClient.accountManager}
                onChange={(e) => setNewClient({ ...newClient, accountManager: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option>Sarah Mitchell</option>
                <option>James Wilson</option>
                <option>Arjun Mehta</option>
              </select>
            </div>
          </div>

          {/* Multi-Contact Builder */}
          <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#17243b]">
                Client Contacts ({newClient.contacts.length})
              </span>
              <button
                type="button"
                onClick={handleAddContactRow}
                className="text-xs font-bold text-[#4268e8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Contact
              </button>
            </div>

            {newClient.contacts.map((con, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-lg border border-[#e2e8f0] space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#475569]">
                    {idx === 0 ? 'Primary Contact' : `Additional Contact #${idx + 1}`}
                  </span>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveContactRow(idx)}
                      className="text-[#c84c58] hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Olivia Hart)"
                    value={con.name}
                    onChange={(e) => {
                      const updated = [...newClient.contacts];
                      updated[idx].name = e.target.value;
                      setNewClient({ ...newClient, contacts: updated });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-[#cbd5e1] rounded-lg outline-none"
                  />
                  <select
                    value={con.role}
                    onChange={(e) => {
                      const updated = [...newClient.contacts];
                      updated[idx].role = e.target.value;
                      setNewClient({ ...newClient, contacts: updated });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-[#cbd5e1] rounded-lg outline-none"
                  >
                    <option value="Owner / Director">Owner / Director</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Interior Designer / Architect">Interior Designer / Architect</option>
                    <option value="Accounts / Finance">Accounts / Finance</option>
                    <option value="Site Contact">Site Contact</option>
                  </select>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={con.email}
                    onChange={(e) => {
                      const updated = [...newClient.contacts];
                      updated[idx].email = e.target.value;
                      setNewClient({ ...newClient, contacts: updated });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-[#cbd5e1] rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone (+44...)"
                    value={con.phone}
                    onChange={(e) => {
                      const updated = [...newClient.contacts];
                      updated[idx].phone = e.target.value;
                      setNewClient({ ...newClient, contacts: updated });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-[#cbd5e1] rounded-lg outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Internal Notes & Commercial Brief</label>
            <textarea
              rows={2}
              placeholder="Key design preferences, fit-out specifications, billing cycle notes..."
              value={newClient.notes}
              onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsAddClientOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Client Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Clickable Payment History Summary from Client Listing */}
      {paymentHistoryClient && (
        <Modal
          isOpen={!!paymentHistoryClient}
          onClose={() => setPaymentHistoryClient(null)}
          title={`Payment History: ${paymentHistoryClient.name}`}
          subtitle={`Settled: £${paymentHistoryClient.totalSettledValue.toLocaleString()} · Received: £${paymentHistoryClient.totalReceived.toLocaleString()} · Balance: £${paymentHistoryClient.totalOutstanding.toLocaleString()}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] text-[10px] font-bold text-[#8792a1] uppercase">
                    <th className="py-2.5 pr-3">Invoice</th>
                    <th className="py-2.5 px-3">Project</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 pl-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {payments
                    .filter((p) => p.clientName === paymentHistoryClient.name)
                    .map((pay) => (
                      <tr key={pay.id}>
                        <td className="py-2.5 pr-3 font-bold text-[#17243b]">{pay.invoiceRef}</td>
                        <td className="py-2.5 px-3 text-[#475569]">{pay.projectName}</td>
                        <td className="py-2.5 px-3 text-[#7b8798]">{pay.stage}</td>
                        <td className="py-2.5 px-3 text-[#475569]">{pay.dueDate}</td>
                        <td className="py-2.5 px-3 font-bold text-[#17243b]">
                          £{pay.amount.toLocaleString()}
                        </td>
                        <td className="py-2.5 pl-3 text-right">
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
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <Button variant="secondary" onClick={() => setPaymentHistoryClient(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setPaymentHistoryClient(null);
                  router.push('/payments');
                }}
              >
                Open Full Payment Ledger
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 3: Manual Call Note from Client Listing */}
      {callNoteClient && (
        <Modal
          isOpen={!!callNoteClient}
          onClose={() => setCallNoteClient(null)}
          title={`Log Telephone / Offline Note: ${callNoteClient.name}`}
          subtitle="Record telephone or face-to-face communication directly against client & project"
          maxWidth="md"
        >
          <form onSubmit={handleQuickLogCall} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">Contact Person</label>
                <input
                  type="text"
                  value={newCallNote.contactName}
                  onChange={(e) => setNewCallNote({ ...newCallNote, contactName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">Type</label>
                <select
                  value={newCallNote.type}
                  onChange={(e) => setNewCallNote({ ...newCallNote, type: e.target.value as any })}
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
              <label className="block text-xs font-bold text-[#475569] mb-1">Discussion Summary *</label>
              <textarea
                required
                rows={3}
                placeholder="Record telephone/offline conversation details..."
                value={newCallNote.summary}
                onChange={(e) => setNewCallNote({ ...newCallNote, summary: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <Button variant="secondary" onClick={() => setCallNoteClient(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Call Note
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 4: Add Project directly from Client Listing */}
      {addProjectClient && (
        <Modal
          isOpen={!!addProjectClient}
          onClose={() => setAddProjectClient(null)}
          title={`Create Project under ${addProjectClient.name}`}
          subtitle="Auto-generates unique Project ID (e.g. FFC-2026-005) and links to client"
          maxWidth="md"
        >
          <form onSubmit={handleQuickCreateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Project Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Knightsbridge Flagship Fit-Out"
                value={newProjForm.name}
                onChange={(e) => setNewProjForm({ ...newProjForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">Approved Value (£)</label>
                <input
                  type="number"
                  value={newProjForm.approvedValue}
                  onChange={(e) => setNewProjForm({ ...newProjForm, approvedValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">Target Completion</label>
                <input
                  type="date"
                  value={newProjForm.targetCompletion}
                  onChange={(e) => setNewProjForm({ ...newProjForm, targetCompletion: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <Button variant="secondary" onClick={() => setAddProjectClient(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Project
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
