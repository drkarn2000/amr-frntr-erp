'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Mail,
  Send,
  Plus,
  Search,
  PhoneCall,
  Paperclip,
  CheckCheck,
  MessageSquare,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { CallMeetingLog } from '@/types';

export default function CommunicationHubPage() {
  const {
    emails,
    whatsappThreads,
    callLogs,
    projects,
    sendEmailReply,
    composeEmail,
    reassignEmail,
    sendWhatsAppMessage,
    addCallLog,
    showToast,
  } = useApp();

  const [activeChannel, setActiveChannel] = useState<'email' | 'whatsapp' | 'calls'>('email');
  const [selectedThreadId, setSelectedThreadId] = useState<string>(emails[0]?.id || '');
  const [selectedWaId, setSelectedWaId] = useState<string>(whatsappThreads[0]?.id || '');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  // WhatsApp composer state
  const [waText, setWaText] = useState('');
  const [isInternalWaNote, setIsInternalWaNote] = useState(false);

  // Modals state
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isCallLogModalOpen, setIsCallLogModalOpen] = useState(false);

  // Compose form state
  const [newEmail, setNewEmail] = useState({
    projectId: projects[0]?.id || '',
    toEmail: '',
    ccEmail: '',
    subject: '',
    body: '',
  });

  // Call log form state
  const [newCall, setNewCall] = useState({
    projectId: projects[0]?.id || '',
    contactName: '',
    type: 'Phone Call' as CallMeetingLog['type'],
    summary: '',
    actionOwner: 'Sarah Mitchell',
    followUpDate: '2026-11-20',
  });

  const selectedThread = emails.find((e) => e.id === selectedThreadId) || emails[0];
  const selectedWaThread =
    whatsappThreads.find((w) => w.id === selectedWaId) || whatsappThreads[0];

  const filteredThreads = emails.filter((em) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      em.subject.toLowerCase().includes(q) ||
      em.fromName.toLowerCase().includes(q) ||
      em.projectName.toLowerCase().includes(q);
    const matchesFilter =
      filterType === 'All' ||
      (filterType === 'Needs reply' && em.needsReply) ||
      (filterType === 'Unread' && em.unread);
    return matchesSearch && matchesFilter;
  });

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedThread) return;
    sendEmailReply(selectedThread.id, replyText);
    setReplyText('');
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waText.trim() || !selectedWaThread) return;
    sendWhatsAppMessage(selectedWaThread.id, waText, isInternalWaNote);
    setWaText('');
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.toEmail || !newEmail.subject) return;
    const proj = projects.find((p) => p.id === newEmail.projectId) || projects[0];
    composeEmail({
      projectId: proj.id,
      projectName: proj.name,
      clientName: proj.clientName,
      fromName: 'Sarah Mitchell (AMR FRNTR)',
      fromEmail: 'sarah@amrfrntr.co.uk',
      toEmail: newEmail.toEmail,
      ccEmail: newEmail.ccEmail,
      subject: newEmail.subject,
      snippet: newEmail.body.slice(0, 90),
      body: newEmail.body,
      date: '13 Nov 2026, 15:20',
      unread: false,
      needsReply: false,
    });
    setIsComposeModalOpen(false);
    setNewEmail({
      projectId: projects[0]?.id || '',
      toEmail: '',
      ccEmail: '',
      subject: '',
      body: '',
    });
  };

  const handleCallLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCall.summary) return;
    const proj = projects.find((p) => p.id === newCall.projectId) || projects[0];
    addCallLog({
      projectId: proj.id,
      projectName: proj.name,
      contactName: newCall.contactName || 'Client Point of Contact',
      type: newCall.type,
      dateTime: '13 Nov 2026, 15:20',
      actionOwner: newCall.actionOwner,
      summary: newCall.summary,
      followUpDate: newCall.followUpDate,
    });
    setIsCallLogModalOpen(false);
    setNewCall({
      projectId: projects[0]?.id || '',
      contactName: '',
      type: 'Phone Call',
      summary: '',
      actionOwner: 'Sarah Mitchell',
      followUpDate: '2026-11-20',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            SECTION 11 · UNIFIED COMMUNICATION HUB (EMAIL, WHATSAPP & CALLS)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Email, WhatsApp Business & Call Hub
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Gmail/Microsoft 365 OAuth threads with manual project reassignment, Official WhatsApp Business API chat, and telephone/site meeting logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={<PhoneCall className="w-4 h-4 text-[#4268e8]" />}
            onClick={() => setIsCallLogModalOpen(true)}
          >
            Log Call / Meeting
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsComposeModalOpen(true)}
          >
            Compose Email
          </Button>
        </div>
      </div>

      {/* 3 Channel Switcher Tabs (Section 11.1, 11.2, 11.3) */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#e8edf3] shadow-xs w-fit">
        <button
          onClick={() => setActiveChannel('email')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeChannel === 'email'
              ? 'bg-[#17243b] text-white shadow-xs'
              : 'text-[#64748b] hover:bg-[#f8fafc]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>11.1 Email Inbox ({emails.length})</span>
        </button>

        <button
          onClick={() => setActiveChannel('whatsapp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeChannel === 'whatsapp'
              ? 'bg-[#16845f] text-white shadow-xs'
              : 'text-[#64748b] hover:bg-[#f8fafc]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>11.2 WhatsApp Business ({whatsappThreads.length})</span>
        </button>

        <button
          onClick={() => setActiveChannel('calls')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeChannel === 'calls'
              ? 'bg-[#4268e8] text-white shadow-xs'
              : 'text-[#64748b] hover:bg-[#f8fafc]'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>11.3 Call & Site Logs ({callLogs.length})</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 11.1: EMAIL INBOX WITH PROJECT REASSIGNMENT (UAT #9)            */}
      {/* =================================================================== */}
      {activeChannel === 'email' && (
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e8edf3] min-h-[560px]">
            {/* Left Column: Thread List */}
            <div className="flex flex-col">
              <div className="p-3.5 border-b border-[#e8edf3] space-y-2.5 bg-[#f8fafc]">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search emails, client or project..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
                  />
                </div>

                <div className="flex gap-1.5">
                  {['All', 'Needs reply', 'Unread'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterType(tab)}
                      className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                        filterType === tab
                          ? 'bg-[#17243b] text-white'
                          : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Threads List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[580px]">
                {filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedThread?.id === thread.id
                        ? 'bg-[#edf1ff]/50 border-[#cbd8ff] shadow-xs'
                        : 'border-[#e8edf3] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-[#17243b]">
                        {thread.fromName}
                      </span>
                      <span className="text-[10px] text-[#7b8798]">{thread.date.split(',')[0]}</span>
                    </div>

                    <div className="text-xs font-semibold text-[#334155] mt-1 truncate">
                      {thread.subject}
                    </div>

                    <div className="text-[11px] text-[#7b8798] mt-0.5 line-clamp-2">
                      {thread.snippet}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
                      <span className="text-[10px] font-bold text-[#4268e8]">
                        {thread.projectName}
                      </span>
                      {thread.needsReply && (
                        <Badge variant="amber" className="text-[9px]">
                          Needs Reply
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Selected Thread Workspace */}
            <div className="md:col-span-2 flex flex-col justify-between p-6 space-y-6">
              {selectedThread ? (
                <>
                  <div className="space-y-4">
                    {/* Subject, Metadata & Manual Reassignment (Section 11.1) */}
                    <div className="border-b border-[#e8edf3] pb-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] font-extrabold text-[#4268e8] tracking-widest uppercase">
                          LINKED TO {selectedThread.projectName}
                        </span>

                        {/* Section 11.1 Manual Reassignment of Incorrectly Matched Messages */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#7b8798] flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" /> Reassign Project:
                          </span>
                          <select
                            value={selectedThread.projectId}
                            onChange={(e) => reassignEmail(selectedThread.id, e.target.value)}
                            className="px-2 py-1 text-[11px] font-semibold bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-[#17243b]"
                          >
                            {projects.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.code} · {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <h2 className="text-xl font-extrabold text-[#17243b] mt-1.5">
                        {selectedThread.subject}
                      </h2>

                      <div className="text-xs text-[#64748b] mt-2 space-y-0.5">
                        <div>
                          From: <b className="text-[#17243b]">{selectedThread.fromName}</b> ({selectedThread.fromEmail})
                        </div>
                        <div>To: {selectedThread.toEmail}</div>
                        {selectedThread.ccEmail && <div>CC: {selectedThread.ccEmail}</div>}
                        <div>Date: {selectedThread.date}</div>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="prose text-xs text-[#334155] whitespace-pre-line leading-relaxed">
                      {selectedThread.body}
                    </div>

                    {/* Attachments */}
                    {selectedThread.attachments && selectedThread.attachments.length > 0 && (
                      <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#edf0f5]">
                        <span className="text-[11px] font-bold text-[#7b8798] block mb-2">
                          Attached Files ({selectedThread.attachments.length})
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {selectedThread.attachments.map((att) => (
                            <div
                              key={att.name}
                              className="px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg text-xs font-semibold text-[#17243b] flex items-center gap-1.5 shadow-2xs hover:border-[#4268e8] cursor-pointer"
                              onClick={() => showToast(`Opening ${att.name}`, 'info')}
                            >
                              <Paperclip className="w-3.5 h-3.5 text-[#4268e8]" />
                              <span>{att.name}</span>
                              <span className="text-[10px] text-[#7b8798]">({att.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reply Thread History */}
                    {selectedThread.replies && selectedThread.replies.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-[#f1f5f9]">
                        <span className="text-[11px] font-bold text-[#7b8798] uppercase tracking-wider block">
                          Thread Responses
                        </span>
                        {selectedThread.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-4 bg-[#f0f4ff] rounded-xl border border-[#d0dbf5] text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[#4268e8]">{rep.fromName}</span>
                              <span className="text-[10px] text-[#7b8798]">{rep.date}</span>
                            </div>
                            <p className="text-[#1e293b] leading-relaxed">{rep.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Inline Reply Editor */}
                  <div className="pt-4 border-t border-[#e8edf3] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17243b]">
                        Reply in Thread (Gmail / Microsoft 365 Sync)
                      </span>
                      <button
                        onClick={() => setIsCallLogModalOpen(true)}
                        className="text-[11px] font-bold text-[#4268e8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <PhoneCall className="w-3 h-3" /> Add call note instead
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type client response..."
                      className="w-full p-3 text-xs border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#4268e8] outline-none resize-none"
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="primary"
                        icon={<Send className="w-3.5 h-3.5" />}
                        onClick={handleSendReply}
                      >
                        Send In-Thread Reply
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-24 text-center text-xs text-[#94a3b8]">
                  Select a message thread from the inbox to display.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 11.2: WHATSAPP BUSINESS CHAT (OFFICIAL API - UAT #10)           */}
      {/* =================================================================== */}
      {activeChannel === 'whatsapp' && (
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e8edf3] min-h-[560px]">
            {/* Left Column: WhatsApp Thread List */}
            <div className="p-4 space-y-2.5 bg-[#f8fafc]">
              <div className="text-[11px] font-extrabold text-[#16845f] uppercase tracking-wider px-1">
                Official WhatsApp Business Channels
              </div>
              {whatsappThreads.map((wa) => (
                <div
                  key={wa.id}
                  onClick={() => setSelectedWaId(wa.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedWaThread?.id === wa.id
                      ? 'bg-[#e8f7f0] border-[#a7f3d0] shadow-xs'
                      : 'bg-white border-[#e8edf3] hover:bg-[#f1f5f9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#17243b]">
                      {wa.contactName}
                    </span>
                    <span className="text-[10px] text-[#7b8798]">{wa.lastUpdated}</span>
                  </div>
                  <div className="text-[11px] text-[#475569] font-medium mt-0.5">
                    {wa.clientName} · {wa.contactPhone}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
                    <span className="text-[10px] font-bold text-[#16845f]">
                      {wa.projectName}
                    </span>
                    {wa.unreadCount > 0 && (
                      <Badge variant="green">{wa.unreadCount} new</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Active WhatsApp Conversation & Internal Team Notes */}
            <div className="md:col-span-2 flex flex-col justify-between p-6">
              {selectedWaThread && (
                <>
                  <div>
                    <div className="flex items-center justify-between border-b border-[#e8edf3] pb-4 mb-4">
                      <div>
                        <div className="text-[11px] font-extrabold text-[#16845f] uppercase tracking-wider">
                          WHATSAPP BUSINESS API · LINKED TO {selectedWaThread.projectName}
                        </div>
                        <h3 className="text-lg font-extrabold text-[#17243b] mt-0.5">
                          {selectedWaThread.contactName} ({selectedWaThread.clientName})
                        </h3>
                        <div className="text-xs text-[#7b8798]">
                          Verified Number: {selectedWaThread.contactPhone}
                        </div>
                      </div>
                      <Badge variant="green">Official API Connected</Badge>
                    </div>

                    {/* Messages Feed */}
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                      {selectedWaThread.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3.5 rounded-2xl text-xs max-w-[85%] ${
                            msg.isInternalNote
                              ? 'mx-auto bg-[#fffbeb] border border-[#fde68a] text-[#92400e] w-full max-w-none'
                              : msg.isOutbound
                              ? 'ml-auto bg-[#e8f7f0] border border-[#a7f3d0] text-[#064e3b]'
                              : 'mr-auto bg-[#f8fafc] border border-[#e2e8f0] text-[#1e293b]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <span className="font-extrabold flex items-center gap-1">
                              {msg.isInternalNote && <Lock className="w-3 h-3 text-[#d97706]" />}
                              {msg.sender}
                              {msg.isInternalNote && ' · INTERNAL TEAM NOTE (Hidden from Client)'}
                            </span>
                            <span className="text-[10px] opacity-75 flex items-center gap-1">
                              {msg.timestamp}
                              {!msg.isInternalNote && msg.isOutbound && (
                                <CheckCheck className="w-3.5 h-3.5 text-[#16845f]" />
                              )}
                            </span>
                          </div>
                          <p className="leading-relaxed">{msg.text}</p>
                          {msg.attachment && (
                            <div className="mt-2 px-2.5 py-1.5 bg-white/80 rounded-lg border border-black/10 inline-flex items-center gap-1.5 font-semibold">
                              <Paperclip className="w-3 h-3" />
                              <span>{msg.attachment}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp / Internal Note Composer */}
                  <form onSubmit={handleSendWhatsApp} className="pt-4 border-t border-[#e8edf3] mt-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsInternalWaNote(false)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                            !isInternalWaNote
                              ? 'bg-[#16845f] text-white'
                              : 'bg-[#f1f5f9] text-[#64748b]'
                          }`}
                        >
                          Client WhatsApp Message
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsInternalWaNote(true)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                            isInternalWaNote
                              ? 'bg-[#d97706] text-white'
                              : 'bg-[#f1f5f9] text-[#64748b]'
                          }`}
                        >
                          🔒 Internal Team Note (Private)
                        </button>
                      </div>
                      <span className="text-[10px] text-[#7b8798]">
                        {isInternalWaNote
                          ? 'Visible only to AMR staff'
                          : `Dispatches via WhatsApp API to ${selectedWaThread.contactPhone}`}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={waText}
                        onChange={(e) => setWaText(e.target.value)}
                        placeholder={
                          isInternalWaNote
                            ? 'Write internal team note on this WhatsApp thread...'
                            : 'Type WhatsApp message to client...'
                        }
                        className="flex-1 px-3.5 py-2 text-xs border border-[#cbd5e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16845f]"
                      />
                      <Button
                        variant="primary"
                        type="submit"
                        icon={<Send className="w-3.5 h-3.5" />}
                      >
                        {isInternalWaNote ? 'Post Internal Note' : 'Send WhatsApp'}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 11.3: MANUAL TELEPHONE & SITE MEETING LOGS (UAT #11)            */}
      {/* =================================================================== */}
      {activeChannel === 'calls' && (
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#17243b]">
                Manual Telephone & Site Meeting Log (Section 11.3)
              </h2>
              <p className="text-xs text-[#7b8798]">
                Telephone calls, site meetings, and video calls logged directly against projects
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsCallLogModalOpen(true)}
            >
              Log Call / Meeting
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Date & Type</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Contact Person</th>
                  <th className="py-3.5 px-4">Summary of Conversation</th>
                  <th className="py-3.5 px-4">Action Owner</th>
                  <th className="py-3.5 pr-6 text-right">Follow-up Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {callLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f8fafc]">
                    <td className="py-4 px-6">
                      <Badge variant="gold">{log.type}</Badge>
                      <div className="text-[10px] text-[#7b8798] mt-1">{log.dateTime}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#4268e8]">{log.projectName}</td>
                    <td className="py-4 px-4 font-bold text-[#17243b]">{log.contactName}</td>
                    <td className="py-4 px-4 text-[#475569] max-w-md">
                      <p>{log.summary}</p>
                    </td>
                    <td className="py-4 px-4 font-medium text-[#17243b]">{log.actionOwner}</td>
                    <td className="py-4 pr-6 text-right font-semibold text-[#d97706]">
                      {log.followUpDate || 'None required'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      <Modal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        title="Compose Project Email"
        subtitle="Dispatches client email linked directly into project chronological audit trail"
        maxWidth="lg"
      >
        <form onSubmit={handleComposeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
            <select
              value={newEmail.projectId}
              onChange={(e) => setNewEmail({ ...newEmail, projectId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name} ({p.clientName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">To Email *</label>
              <input
                required
                type="email"
                placeholder="client@northco.co.uk"
                value={newEmail.toEmail}
                onChange={(e) => setNewEmail({ ...newEmail, toEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">CC Email</label>
              <input
                type="text"
                placeholder="pm@amrfrntr.co.uk"
                value={newEmail.ccEmail}
                onChange={(e) => setNewEmail({ ...newEmail, ccEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Subject *</label>
            <input
              required
              type="text"
              placeholder="e.g. Drawing Revision v3 & On-Site Installation Programme"
              value={newEmail.subject}
              onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Message Body *</label>
            <textarea
              required
              rows={5}
              placeholder="Write formal project update, specification confirmations or schedule notices..."
              value={newEmail.body}
              onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
              className="w-full p-3 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsComposeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
              Send Project Email
            </Button>
          </div>
        </form>
      </Modal>

      {/* Log Call Modal */}
      <Modal
        isOpen={isCallLogModalOpen}
        onClose={() => setIsCallLogModalOpen(false)}
        title="Log Telephone or Site Meeting"
        subtitle="Add conversational record into the project activity timeline"
        maxWidth="md"
      >
        <form onSubmit={handleCallLogSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Project</label>
            <select
              value={newCall.projectId}
              onChange={(e) => setNewCall({ ...newCall, projectId: e.target.value })}
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
              <label className="block text-xs font-bold text-[#475569] mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Olivia Hart"
                value={newCall.contactName}
                onChange={(e) => setNewCall({ ...newCall, contactName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Type</label>
              <select
                value={newCall.type}
                onChange={(e) => setNewCall({ ...newCall, type: e.target.value as CallMeetingLog['type'] })}
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
              rows={4}
              placeholder="Key notes, verbal agreements, site access arrangements..."
              value={newCall.summary}
              onChange={(e) => setNewCall({ ...newCall, summary: e.target.value })}
              className="w-full p-3 text-xs border border-[#cbd5e1] rounded-lg outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Action Owner</label>
              <input
                type="text"
                value={newCall.actionOwner}
                onChange={(e) => setNewCall({ ...newCall, actionOwner: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Follow-up Date</label>
              <input
                type="date"
                value={newCall.followUpDate}
                onChange={(e) => setNewCall({ ...newCall, followUpDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsCallLogModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Conversation Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
