'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  FileText,
  UploadCloud,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Tag,
  Lock,
} from 'lucide-react';
import { ProjectDocument } from '@/types';

export default function DocumentsPage() {
  const { documents, projects, addDocument, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [approvalFilter, setApprovalFilter] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);

  // New document form state
  const [newDoc, setNewDoc] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    fileName: '',
    type: 'Drawing' as const,
    version: 'v1',
    tags: 'Joinery, Approved',
  });

  const filteredDocs = documents.filter((doc) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      doc.title.toLowerCase().includes(q) ||
      doc.projectName.toLowerCase().includes(q) ||
      doc.fileName.toLowerCase().includes(q) ||
      doc.tags.some((t) => t.toLowerCase().includes(q));
    const matchesType = typeFilter === 'All' || doc.type === typeFilter;
    const matchesApproval = approvalFilter === 'All' || doc.approvalStatus === approvalFilter;
    return matchesSearch && matchesType && matchesApproval;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;
    const proj = projects.find((p) => p.id === newDoc.projectId) || projects[0];
    addDocument({
      projectId: proj.id,
      projectName: proj.name,
      title: newDoc.title,
      fileName: newDoc.fileName || `${newDoc.title.replace(/\s+/g, '_')}_${newDoc.version}.pdf`,
      fileSize: '5.4 MB',
      type: newDoc.type,
      version: newDoc.version,
      isCurrent: true,
      approvalStatus: 'Approved',
      isApproved: true,
      tags: newDoc.tags.split(',').map((t) => t.trim()),
    });
    setIsUploadModalOpen(false);
    setNewDoc({
      projectId: projects[0]?.id || '',
      title: '',
      fileName: '',
      type: 'Drawing',
      version: 'v1',
      tags: 'Joinery, Approved',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            PROJECT RECORDS & CAD SPECIFICATIONS
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Documents & Drawings
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            A controlled, versioned drawing archive for every project with audit-locked approvals.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<UploadCloud className="w-4 h-4" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      </div>

      {/* Controlled Revision Notice */}
      <div className="p-4 bg-[#edf1ff]/40 border border-[#cbd8ff] rounded-2xl flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#4268e8] shrink-0 mt-0.5" />
        <div className="text-xs text-[#334155]">
          <span className="font-bold text-[#17243b]">Drawing Revision Control: </span>
          Version history, metadata tags, uploader ID, and client approval timestamps are permanently retained. Current approved drawings are visually marked and protected against uncontrolled overwrite.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search document name, project, drawing revision or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
          >
            <option value="All">All Document Types</option>
            <option value="Drawing">Drawing</option>
            <option value="Quotation">Quotation</option>
            <option value="Purchase Order">Purchase Order</option>
            <option value="Site Survey">Site Survey</option>
            <option value="Specification">Specification</option>
          </select>

          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
          >
            <option value="All">All Approval States</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Internal">Internal</option>
          </select>
        </div>
      </div>

      {/* Documents Master Table */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                <th className="py-3.5 px-6">Document Title / File</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-center">Version</th>
                <th className="py-3.5 px-4">Uploaded By</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4 text-center">Approval State</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#f8fafc]">
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-[#17243b] text-xs flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#4268e8] shrink-0" />
                      <span>{doc.title}</span>
                    </div>
                    <div className="text-[11px] text-[#7b8798] mt-0.5 flex items-center gap-2">
                      <span>{doc.fileName}</span>
                      <span>·</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-[#17243b]">{doc.projectName}</td>

                  <td className="py-4 px-4">
                    <Badge variant="blue">{doc.type}</Badge>
                  </td>

                  <td className="py-4 px-4 text-center font-extrabold text-[#17243b]">
                    {doc.version}
                  </td>

                  <td className="py-4 px-4 text-[#475569]">{doc.uploadedBy}</td>

                  <td className="py-4 px-4 text-[#7b8798]">{doc.uploadedAt}</td>

                  <td className="py-4 px-4 text-center">
                    <Badge
                      variant={
                        doc.approvalStatus === 'Approved'
                          ? 'green'
                          : doc.approvalStatus === 'Pending'
                          ? 'amber'
                          : 'gray'
                      }
                    >
                      {doc.isCurrent ? `${doc.approvalStatus} / Current` : doc.approvalStatus}
                    </Badge>
                  </td>

                  <td className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setPreviewDoc(doc)}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Download className="w-3.5 h-3.5" />}
                        onClick={() => showToast(`Downloaded ${doc.fileName}`, 'info')}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Project Drawing or Document"
        subtitle="Controlled versioning and metadata classification"
        maxWidth="lg"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
            <select
              value={newDoc.projectId}
              onChange={(e) => setNewDoc({ ...newDoc, projectId: e.target.value })}
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
            <label className="block text-xs font-bold text-[#475569] mb-1">Document Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Approved Bespoke Joinery Drawings"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Document Category</label>
              <select
                value={newDoc.type}
                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Drawing">Drawing / CAD</option>
                <option value="Quotation">Signed Quotation</option>
                <option value="Purchase Order">Client Purchase Order</option>
                <option value="Site Survey">Site Survey / Laser Scan</option>
                <option value="Specification">Finishes Specification</option>
                <option value="Warranty">Warranty Certificate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Version Number</label>
              <input
                type="text"
                placeholder="v1, v2, v3"
                value={newDoc.version}
                onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Simulated Drag and Drop Zone */}
          <div className="p-6 border-2 border-dashed border-[#cbd5e1] rounded-2xl bg-[#f8fafc] text-center hover:bg-[#edf1ff]/30 transition-colors cursor-pointer">
            <UploadCloud className="w-10 h-10 text-[#4268e8] mx-auto mb-2" />
            <div className="text-xs font-bold text-[#17243b]">Drag and drop files here, or browse</div>
            <div className="text-[11px] text-[#7b8798] mt-1">Supports PDF, DWG, DXF, XLSX, PNG up to 50MB</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Metadata Tags</label>
            <input
              type="text"
              placeholder="e.g. Banquettes, Soho, Brass Inset, Approved"
              value={newDoc.tags}
              onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload & Log Revision
            </Button>
          </div>
        </form>
      </Modal>

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Preview: ${previewDoc.title}`}
          subtitle={`${previewDoc.fileName} (${previewDoc.version}) · Uploaded by ${previewDoc.uploadedBy}`}
          maxWidth="xl"
        >
          <div className="p-8 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] text-center space-y-4">
            <FileText className="w-16 h-16 text-[#4268e8] mx-auto opacity-70" />
            <div>
              <div className="font-bold text-base text-[#17243b]">{previewDoc.title}</div>
              <div className="text-xs text-[#7b8798] mt-1">
                Version {previewDoc.version} · {previewDoc.fileSize} · Status: {previewDoc.approvalStatus}
              </div>
            </div>
            <p className="text-xs text-[#475569] max-w-md mx-auto">
              Simulated PDF preview interface. When integrated with cloud storage, real inline PDF/CAD viewing will render here.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="primary"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  showToast(`Downloading ${previewDoc.fileName}`, 'info');
                  setPreviewDoc(null);
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

