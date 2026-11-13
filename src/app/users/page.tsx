'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  UserCheck,
  UserPlus,
  Search,
  ShieldCheck,
  Lock,
  Eye,
  CheckCircle2,
  Users2,
  Key,
} from 'lucide-react';
import { UserRole } from '@/types';

export default function UsersPage() {
  const { users, addUser, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'UK Project Manager / Sales' as UserRole['role'],
    assignedScope: 'Assigned London fit-out projects',
  });

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    addUser({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      assignedScope: newUser.assignedScope,
    });

    setIsInviteModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'UK Project Manager / Sales',
      assignedScope: 'Assigned London fit-out projects',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            SECURITY & ROLE-BASED ACCESS CONTROL
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Users & Permissions
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Role-based access governance with granular least-privilege scoping across UK management and India coordination teams.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsInviteModalOpen(true)}
        >
          Invite User
        </Button>
      </div>

      {/* Role Hierarchy Notice */}
      <div className="p-4 bg-[#edf1ff]/40 border border-[#cbd8ff] rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#4268e8] shrink-0 mt-0.5" />
        <div className="text-xs text-[#334155]">
          <span className="font-bold text-[#17243b]">Commercial Privacy Protection: </span>
          Client Portal and installer roles are strictly prevented from viewing internal supplier purchase costs, company gross margins, or private internal notes. Privileged approval actions require MFA verification.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search team member name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
        >
          <option value="All">All User Roles</option>
          <option value="Administrator / Director">Administrator / Director</option>
          <option value="UK Project Manager / Sales">UK Project Manager / Sales</option>
          <option value="India Project Coordinator">India Project Coordinator</option>
          <option value="Procurement / Sourcing">Procurement / Sourcing</option>
          <option value="Finance">Finance</option>
          <option value="Workshop / Production">Workshop / Production</option>
          <option value="Installer">Installer</option>
        </select>
      </div>

      {/* Users Master Table */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                <th className="py-3.5 px-6">User & Email</th>
                <th className="py-3.5 px-4">Role Designation</th>
                <th className="py-3.5 px-4">Assigned Permission Scope</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredUsers.map((usr) => (
                <tr key={usr.id} className="hover:bg-[#f8fafc]">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e9edf8] text-[#3f5ca4] font-extrabold text-xs flex items-center justify-center border border-[#d0dbf5]">
                        {usr.avatarInitials}
                      </div>
                      <div>
                        <div className="font-extrabold text-[#17243b] text-xs">{usr.name}</div>
                        <div className="text-[11px] text-[#7b8798]">{usr.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant={usr.role.includes('Director') ? 'green' : 'blue'}>
                      {usr.role}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 text-[#475569] max-w-xs">{usr.assignedScope}</td>

                  <td className="py-4 px-4 text-[#7b8798]">{usr.lastActive}</td>

                  <td className="py-4 px-4 text-center">
                    <Badge variant={usr.status === 'Active' ? 'green' : 'gray'}>
                      {usr.status}
                    </Badge>
                  </td>

                  <td className="py-4 pr-6 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedUser(usr)}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix Inspection Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Role Permissions: ${selectedUser.name}`}
          subtitle={`${selectedUser.role} · ${selectedUser.email}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#edf0f5] text-xs">
              <span className="font-bold text-[#17243b] block mb-1">Assigned Operational Scope:</span>
              <p className="text-[#475569]">{selectedUser.assignedScope}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-[#17243b] block">Granular Capability Checklist</span>

              {[
                { name: 'View Customer Contact Details & Profiles', allowed: true },
                { name: 'Create & Edit Fit-Out Projects', allowed: true },
                { name: 'View Commercial Gross Margins & Internal Markup', allowed: selectedUser.role.includes('Director') || selectedUser.role.includes('Finance') },
                { name: 'Approve & Lock Quotation Versions', allowed: selectedUser.role.includes('Director') || selectedUser.role.includes('Sales') },
                { name: 'Upload & Revise Architectural Drawings (CAD)', allowed: selectedUser.role.includes('Director') || selectedUser.role.includes('Coordinator') || selectedUser.role.includes('Sales') },
                { name: 'Issue Binding Purchase Orders to Suppliers', allowed: selectedUser.role.includes('Director') || selectedUser.role.includes('Procurement') },
                { name: 'Record Cleared BACS Invoice Payments', allowed: selectedUser.role.includes('Director') || selectedUser.role.includes('Finance') },
              ].map((perm) => (
                <div
                  key={perm.name}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#e8edf3] bg-white"
                >
                  <span className="text-[#334155]">{perm.name}</span>
                  {perm.allowed ? (
                    <Badge variant="green">Authorized</Badge>
                  ) : (
                    <Badge variant="gray">Restricted</Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  showToast('Role permissions updated', 'success');
                  setSelectedUser(null);
                }}
              >
                Save Permission Overrides
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Invite User Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        subtitle="Issue platform access invitation with predefined operational role"
        maxWidth="md"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Full Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Alistair Vance"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Work Email Address *</label>
            <input
              required
              type="email"
              placeholder="alistair@amrfrntr.co.uk"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Role Designation</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            >
              <option value="Administrator / Director">Administrator / Director</option>
              <option value="UK Project Manager / Sales">UK Project Manager / Sales</option>
              <option value="India Project Coordinator">India Project Coordinator</option>
              <option value="Procurement / Sourcing">Procurement / Sourcing</option>
              <option value="Finance">Finance</option>
              <option value="Workshop / Production">Workshop / Production</option>
              <option value="Installer">Installer</option>
              <option value="Management Read-only">Management Read-only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Assigned Scope / Projects</label>
            <input
              type="text"
              placeholder="e.g. London Fit-Out Projects & Central Joinery Shop"
              value={newUser.assignedScope}
              onChange={(e) => setNewUser({ ...newUser, assignedScope: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Platform Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

