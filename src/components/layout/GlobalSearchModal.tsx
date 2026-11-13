'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Search, FolderKanban, Users2, FileSpreadsheet, FileText, Boxes, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const GlobalSearchModal: React.FC = () => {
  const router = useRouter();
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    projects,
    clients,
    quotations,
    documents,
    sourcedProducts,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Command+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProjects = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q)
      )
    : projects.slice(0, 3);

  const filteredClients = q
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      )
    : clients.slice(0, 2);

  const filteredQuotations = q
    ? quotations.filter(
        (quote) =>
          quote.reference.toLowerCase().includes(q) ||
          quote.projectName.toLowerCase().includes(q) ||
          quote.clientName.toLowerCase().includes(q)
      )
    : quotations.slice(0, 2);

  const filteredDocs = q
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.projectName.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      )
    : documents.slice(0, 2);

  const handleSelect = (url: string) => {
    setIsSearchModalOpen(false);
    setQuery('');
    router.push(url);
  };

  return (
    <Modal
      isOpen={isSearchModalOpen}
      onClose={() => {
        setIsSearchModalOpen(false);
        setQuery('');
      }}
      title="Global Project & Records Search"
      subtitle="Search instantly across clients, projects, drawings, quotations, and procurement"
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#7b8798] absolute left-3.5 top-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a project code (FFC-2026-001), client name, drawing, or PO..."
            className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-sm text-[#17243b] focus:outline-none focus:ring-2 focus:ring-[#4268e8] focus:border-transparent transition-all"
          />
        </div>

        {/* Results Sections */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {/* Projects */}
          <div>
            <div className="text-[11px] font-bold text-[#7b8798] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-[#4268e8]" />
              Projects ({filteredProjects.length})
            </div>
            {filteredProjects.length > 0 ? (
              <div className="space-y-1.5">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(`/projects/${p.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-[#e8edf3] hover:bg-[#edf1ff]/40 hover:border-[#cbd8ff] cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#17243b] group-hover:text-[#4268e8]">
                          {p.code} · {p.name}
                        </span>
                        <Badge
                          variant={
                            p.health === 'green'
                              ? 'green'
                              : p.health === 'amber'
                              ? 'amber'
                              : 'red'
                          }
                        >
                          {p.stage}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-[#7b8798] mt-0.5">
                        Client: {p.clientName} · Value: £{p.settledValue.toLocaleString()} · Owner: {p.owner}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7b8798] group-hover:text-[#4268e8] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#94a3b8] italic pl-2">No matching projects found</div>
            )}
          </div>

          {/* Clients */}
          <div>
            <div className="text-[11px] font-bold text-[#7b8798] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5 text-[#16845f]" />
              Clients ({filteredClients.length})
            </div>
            {filteredClients.length > 0 ? (
              <div className="space-y-1.5">
                {filteredClients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(`/clients/${c.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-[#e8edf3] hover:bg-[#edf1ff]/40 hover:border-[#cbd8ff] cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-xs text-[#17243b] group-hover:text-[#4268e8]">
                        {c.name} <span className="text-[11px] font-normal text-[#7b8798]">({c.code})</span>
                      </div>
                      <div className="text-[11px] text-[#7b8798] mt-0.5">
                        {c.type} · {c.location} · {c.contacts.length} Contacts
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7b8798] group-hover:text-[#4268e8] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#94a3b8] italic pl-2">No matching clients found</div>
            )}
          </div>

          {/* Quotations */}
          <div>
            <div className="text-[11px] font-bold text-[#7b8798] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#b7791f]" />
              Quotations & Enhancements ({filteredQuotations.length})
            </div>
            {filteredQuotations.length > 0 ? (
              <div className="space-y-1.5">
                {filteredQuotations.map((quote) => (
                  <div
                    key={quote.id}
                    onClick={() => handleSelect(`/quotations/${quote.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-[#e8edf3] hover:bg-[#edf1ff]/40 hover:border-[#cbd8ff] cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#17243b] group-hover:text-[#4268e8]">
                          {quote.reference}
                        </span>
                        <Badge variant={quote.status === 'Approved' ? 'green' : 'amber'}>
                          {quote.status}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-[#7b8798] mt-0.5">
                        {quote.projectName} · £{quote.totalAmount.toLocaleString()} ({quote.version})
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7b8798] group-hover:text-[#4268e8] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#94a3b8] italic pl-2">No matching quotations found</div>
            )}
          </div>

          {/* Documents */}
          <div>
            <div className="text-[11px] font-bold text-[#7b8798] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#3b82f6]" />
              Controlled Drawings & Specs ({filteredDocs.length})
            </div>
            {filteredDocs.length > 0 && (
              <div className="space-y-1.5">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleSelect('/documents')}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-[#e8edf3] hover:bg-[#edf1ff]/40 hover:border-[#cbd8ff] cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-xs text-[#17243b] group-hover:text-[#4268e8]">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-[#7b8798] mt-0.5">
                        {doc.projectName} · {doc.type} ({doc.version}) · {doc.fileSize}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7b8798] group-hover:text-[#4268e8] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

