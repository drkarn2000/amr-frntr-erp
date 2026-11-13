'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Settings,
  ShieldCheck,
  Lock,
  Mail,
  Cloud,
  FileCheck,
  Download,
  CheckCircle2,
  AlertCircle,
  Database,
  Key,
} from 'lucide-react';

export default function SettingsPage() {
  const { auditLogs, showToast } = useApp();

  const handleExportAudit = () => {
    showToast('Exporting complete audit trail to CSV', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            SYSTEM ARCHITECTURE & TRACEABILITY
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Settings & Audit Log
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Third-party integrations readiness, UK GDPR privacy controls, security configurations, and immutable audit activity.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={<Download className="w-4 h-4 text-[#4268e8]" />}
          onClick={handleExportAudit}
        >
          Export Audit Trail
        </Button>
      </div>

      {/* Top Grid: Integrations Readiness & Security Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integrations Card */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                Third-Party Integrations
              </h2>
              <Badge variant="blue">API Configuration</Badge>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#edf0f5] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#17243b]">Google Workspace / Gmail</span>
                    <Badge variant="amber">OAuth Ready</Badge>
                  </div>
                  <p className="text-[11px] text-[#7b8798] mt-1">
                    Direct mailbox synchronization, thread matching to project codes, and outbound dispatch via Gmail API.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => showToast('Gmail OAuth connector dialog opened', 'info')}
                >
                  Configure
                </Button>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#edf0f5] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#17243b]">Microsoft 365 / Outlook</span>
                    <Badge variant="gray">Optional</Badge>
                  </div>
                  <p className="text-[11px] text-[#7b8798] mt-1">
                    Enterprise Microsoft Graph API connectivity for Outlook corporate email and calendar integration.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => showToast('Microsoft Graph configuration panel opened', 'info')}
                >
                  Configure
                </Button>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#edf0f5] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#17243b]">Cloud Document Storage (AWS S3)</span>
                    <Badge variant="green">Configured</Badge>
                  </div>
                  <p className="text-[11px] text-[#7b8798] mt-1">
                    Secure drawing versioning with pre-signed temporary download URLs and encrypted CAD storage.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => showToast('Cloud storage settings verified', 'success')}
                >
                  Manage
                </Button>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#edf0f5] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#17243b]">Xero / QuickBooks Accounting</span>
                    <Badge variant="gray">Phase 2</Badge>
                  </div>
                  <p className="text-[11px] text-[#7b8798] mt-1">
                    Two-way synchronization for commercial invoices, tax receipts, and payment status updates.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => showToast('Accounting bridge scheduled for Phase 2', 'info')}
                >
                  Roadmap
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f1f5f9] mt-4 text-[11px] text-[#7b8798]">
            All external API integrations utilize industry-standard OAuth 2.0 PKCE and AES-256 token encryption.
          </div>
        </div>

        {/* Security & System Controls */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                Enterprise Security Controls
              </h2>
              <Badge variant="green">Compliance Verified</Badge>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: 'Role-Based Access Control (RBAC)', desc: 'Least-privilege isolation between UK management, India coordinators, fitters, and clients', icon: ShieldCheck },
                { title: 'Two-Factor Authentication (MFA)', desc: 'Mandatory TOTP authenticator enforcement for all Director and Finance users', icon: Key },
                { title: 'Data Encryption Standards', desc: 'TLS 1.3 in-transit and AES-256 at-rest encryption across all database records', icon: Lock },
                { title: 'UK GDPR & Data Privacy Compliance', desc: 'Client personal contact information protected with full right-to-be-forgotten export tools', icon: FileCheck },
                { title: 'Automated Snapshot Backups', desc: 'Daily point-in-time recovery with tested 15-minute RPO / 1-hour RTO disaster recovery SLA', icon: Database },
                { title: 'Tamper-Evident Audit Logging', desc: 'Every commercial quotation, payment receipt, and drawing approval is immutably logged', icon: CheckCircle2 },
              ].map((sec) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.title}
                    className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf0f5] flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-lg bg-[#e8f7f0] text-[#16845f] shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#17243b]">{sec.title}</div>
                      <div className="text-[11px] text-[#7b8798] mt-0.5">{sec.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#f1f5f9] mt-4 flex items-center justify-between text-xs text-[#7b8798]">
            <span>System Version: <b className="text-[#17243b]">AMR FRNTR ERP 2.4 Enterprise</b></span>
            <span>Server: <b className="text-[#16845f]">UK South (London)</b></span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Immutable Audit Activity Log */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
          <div>
            <h2 className="text-sm md:text-base font-bold text-[#17243b]">Traceable Audit Activity</h2>
            <p className="text-xs text-[#7b8798]">Immutable log of user actions, approvals, and data mutations</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportAudit}
          >
            Export Log
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4 text-center">Action Type</th>
                <th className="py-3.5 px-4">Record Identifier</th>
                <th className="py-3.5 pr-6">Activity Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f8fafc]">
                  <td className="py-4 px-6 text-[#7b8798] font-medium whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-4 px-4 font-bold text-[#17243b]">{log.user}</td>

                  <td className="py-4 px-4 text-center">
                    <Badge variant={log.badgeColor}>{log.action}</Badge>
                  </td>

                  <td className="py-4 px-4 font-extrabold text-[#17243b]">{log.record}</td>

                  <td className="py-4 pr-6 text-[#475569]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

