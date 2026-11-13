'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { X, AlertCircle, Clock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    payments,
    sourcedProducts,
    documents,
    emails,
    defects,
  } = useApp();

  if (!isNotificationOpen) return null;

  const overduePayments = payments.filter((p) => p.status === 'Overdue');
  const delayedSourcing = sourcedProducts.filter((s) => s.status === 'Delayed');
  const pendingDrawings = documents.filter((d) => d.approvalStatus === 'Pending');
  const actionEmails = emails.filter((e) => e.needsReply || e.unread);
  const criticalDefects = defects.filter(
    (d) => (d.severity === 'Critical' || d.severity === 'High') && d.status !== 'Resolved'
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#142239]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 border-l border-[#e8edf3] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#e8edf3]">
          <div>
            <h3 className="font-bold text-base text-[#17243b]">Operational Action Centre</h3>
            <p className="text-xs text-[#7b8798] mt-0.5">Critical items requiring team attention</p>
          </div>
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-1.5 rounded-lg text-[#7b8798] hover:text-[#17243b] hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Overdue Payments */}
          {overduePayments.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#c84c58] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#c84c58]" />
                Overdue Payments ({overduePayments.length})
              </div>
              <div className="space-y-2">
                {overduePayments.map((p) => (
                  <Link
                    key={p.id}
                    href="/payments"
                    onClick={() => setIsNotificationOpen(false)}
                    className="block p-3 rounded-xl bg-[#ffeaec]/50 border border-[#fecdd3] hover:border-[#fda4af] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#17243b]">{p.projectName}</span>
                      <span className="font-extrabold text-xs text-[#c84c58]">
                        £{p.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#7b8798] mt-1">
                      {p.invoiceRef} · Due {p.dueDate}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Action Emails */}
          {actionEmails.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#b7791f] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#b7791f]" />
                Client Communications ({actionEmails.length})
              </div>
              <div className="space-y-2">
                {actionEmails.map((em) => (
                  <Link
                    key={em.id}
                    href="/communications"
                    onClick={() => setIsNotificationOpen(false)}
                    className="block p-3 rounded-xl bg-[#fff4df]/40 border border-[#fed7aa] hover:border-[#fdba74] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#17243b]">{em.fromName}</span>
                      <Badge variant="amber">Requires Reply</Badge>
                    </div>
                    <div className="font-medium text-xs text-[#334155] mt-1 truncate">
                      {em.subject}
                    </div>
                    <div className="text-[10px] text-[#7b8798] mt-1">{em.date}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Critical Defects */}
          {criticalDefects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#dc2626] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#dc2626]" />
                Urgent Snagging & Defects ({criticalDefects.length})
              </div>
              <div className="space-y-2">
                {criticalDefects.map((def) => (
                  <Link
                    key={def.id}
                    href="/defects"
                    onClick={() => setIsNotificationOpen(false)}
                    className="block p-3 rounded-xl bg-white border border-[#e8edf3] hover:border-[#cbd5e1] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#17243b]">{def.code}</span>
                      <Badge variant="red">{def.severity}</Badge>
                    </div>
                    <div className="text-xs text-[#334155] font-medium mt-1">{def.issue}</div>
                    <div className="text-[11px] text-[#7b8798] mt-1">
                      {def.projectName} · Assigned to {def.owner}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pending Drawings */}
          {pendingDrawings.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#4268e8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4268e8]" />
                Drawings Awaiting Approval ({pendingDrawings.length})
              </div>
              <div className="space-y-2">
                {pendingDrawings.map((doc) => (
                  <Link
                    key={doc.id}
                    href="/documents"
                    onClick={() => setIsNotificationOpen(false)}
                    className="block p-3 rounded-xl bg-[#edf1ff]/40 border border-[#cbd8ff] hover:border-[#93c5fd] transition-colors"
                  >
                    <div className="font-bold text-xs text-[#17243b]">{doc.title}</div>
                    <div className="text-[11px] text-[#7b8798] mt-1">
                      {doc.projectName} · {doc.version}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e8edf3] bg-[#f8fafc]">
          <Link
            href="/reports"
            onClick={() => setIsNotificationOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#17243b] hover:bg-[#223653] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>Open Executive Health Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

