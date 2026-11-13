'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  MapPin,
  PoundSterling,
  Plus,
  Send,
  ShieldAlert,
  Truck,
  User,
  Users2,
  CheckCircle2,
  ChevronDown,
  Eye,
  Lock,
  PhoneCall,
  Bell,
} from 'lucide-react';
import {
  ProjectStage,
  ProjectDocument,
  GalleryCategory,
  ProcurementStatus,
  PaymentScheduleItem,
  CallMeetingLog,
} from '@/types';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || 'proj-001';

  const {
    projects,
    vendors,
    quotations,
    documents,
    payments,
    sourcedProducts,
    purchaseOrders,
    milestones,
    tasks,
    emails,
    whatsappThreads,
    callLogs,
    photos,
    defects,
    permissions,
    updateProjectStage,
    addQuotation,
    approveQuotation,
    addDocument,
    approveDocument,
    addPayment,
    markPaymentPaid,
    addSourcedProduct,
    addPurchaseOrder,
    addMilestone,
    addTask,
    toggleMilestoneStatus,
    toggleTaskStatus,
    sendEmailReply,
    addCallLog,
    addPhoto,
    addDefect,
    showToast,
  } = useApp();

  const project = projects.find((p) => p.id === projectId) || projects[0];

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'quotes' | 'docs' | 'pay' | 'sourcing' | 'tasks' | 'comms' | 'images' | 'snags' | 'history'
  >('overview');

  // Interactive Modals State
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSourcingModalOpen, setIsSourcingModalOpen] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Form States for all Quick Action Modals
  const [quoteForm, setQuoteForm] = useState({
    type: 'Enhancement' as 'Original' | 'Enhancement',
    version: 'v1',
    description: '',
    quantity: 1,
    unit: 'set',
    unitCost: 950,
    unitPrice: 2000,
    deliveryCost: 150,
    installationCost: 200,
    notes: '',
  });

  const [docForm, setDocForm] = useState({
    title: '',
    type: 'Drawing' as ProjectDocument['type'],
    version: 'v4',
    fileName: '',
    approvalStatus: 'Approved' as ProjectDocument['approvalStatus'],
    isCurrent: true,
    tags: 'CAD, Joinery, Approved',
  });

  const [paymentForm, setPaymentForm] = useState({
    invoiceRef: `INV-${1090 + payments.length}`,
    stage: 'Installation Stage' as PaymentScheduleItem['stage'],
    invoiceDate: '2026-11-13',
    dueDate: '2026-11-27',
    amount: 5000,
    status: 'Invoiced' as PaymentScheduleItem['status'],
  });

  const [sourcingForm, setSourcingForm] = useState({
    description: '',
    specification: '',
    vendorId: vendors[0]?.id || 'ven-001',
    quantity: 10,
    unit: 'm²',
    unitCost: 85,
    expectedDelivery: '2026-11-20',
    status: 'Ordered' as ProcurementStatus,
  });

  const [poForm, setPoForm] = useState({
    vendorId: vendors[0]?.id || 'ven-001',
    itemsList: '',
    totalAmount: 3200,
    expectedDelivery: '2026-11-22',
  });

  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    owner: project.owner,
    dueDate: '2026-11-25',
    dependency: 'Drawing Approval',
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    owner: project.coordinator,
    dueDate: '2026-11-19',
    priority: 'High' as 'Normal' | 'High' | 'Urgent',
  });

  const [photoForm, setPhotoForm] = useState({
    caption: '',
    category: 'Installation' as GalleryCategory,
    visibility: 'Portfolio / Public' as ProjectPhotoVisibility,
    tags: 'Site Fit-Out, Joinery',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
  });

  const [defectForm, setDefectForm] = useState({
    issue: '',
    description: '',
    linkedProduct: '',
    vendorName: vendors[0]?.name || 'TimberCraft Bespoke Joinery',
    poNumber: 'PO-2026-088',
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    rootCause: 'Transit / handling variance',
    replacementTargetDate: '2026-11-21',
    costImpact: 250,
  });

  const [callForm, setCallForm] = useState({
    contactName: project.clientName,
    type: 'Phone Call' as CallMeetingLog['type'],
    summary: '',
    followUpDate: '2026-11-18',
  });

  // Email reply state
  const [selectedEmailId, setSelectedEmailId] = useState<string>(
    emails.find((e) => e.projectId === project.id)?.id || emails[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');

  // Gallery category filter
  const [galleryFilter, setGalleryFilter] = useState('All');

  // Filter project-specific data
  const projectQuotes = quotations.filter((q) => q.projectId === project.id);
  const projectDocs = documents.filter((d) => d.projectId === project.id);
  const projectPayments = payments.filter((p) => p.projectId === project.id);
  const projectSourced = sourcedProducts.filter((s) => s.projectId === project.id);
  const projectMilestones = milestones.filter((m) => m.projectId === project.id);
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectEmails = emails.filter((e) => e.projectId === project.id);
  const projectWhatsApp = whatsappThreads.filter((w) => w.projectId === project.id);
  const projectCalls = callLogs.filter((c) => c.projectId === project.id);
  const projectPhotos = photos.filter((p) => p.projectId === project.id);
  const projectDefects = defects.filter((d) => d.projectId === project.id);

  // Commercial & Internal Cost / Margin Calculations (Section 6.2 & UAT #15)
  const committedSupplierCost =
    projectSourced.reduce((acc, s) => acc + s.totalCost, 0) ||
    Math.round(project.settledValue * 0.42);
  const estimatedInternalCost = Math.round(project.settledValue * 0.58);
  const grossMarginPound = project.settledValue - estimatedInternalCost;
  const grossMarginPct =
    project.settledValue > 0 ? Math.round((grossMarginPound / project.settledValue) * 100) : 0;

  const selectedEmail =
    emails.find((e) => e.id === selectedEmailId) || projectEmails[0] || emails[0];

  const filteredPhotos =
    galleryFilter === 'All'
      ? projectPhotos
      : projectPhotos.filter((p) => p.category === galleryFilter);

  const allStages: ProjectStage[] = [
    'Lead / Enquiry',
    'Quotation',
    'Awaiting Client Approval',
    'Approved',
    'Design / Drawing',
    'Sourcing',
    'Production',
    'Delivery',
    'Installation',
    'Snagging',
    'Completed',
    'Maintenance',
    'On Hold',
    'Cancelled',
  ];

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedEmail) return;
    sendEmailReply(selectedEmail.id, replyText);
    setReplyText('');
  };

  // Modal Submit Handlers
  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.description) return;
    const subtotal = quoteForm.quantity * quoteForm.unitPrice;
    const internalCost =
      quoteForm.quantity * quoteForm.unitCost +
      quoteForm.deliveryCost +
      quoteForm.installationCost;
    const totalAmount = Math.round(subtotal * 1.2);
    const marginPercentage =
      subtotal > 0 ? Math.round(((subtotal - internalCost) / subtotal) * 100) : 0;

    addQuotation({
      projectId: project.id,
      projectName: project.name,
      clientName: project.clientName,
      version: quoteForm.version,
      type: quoteForm.type,
      status: 'Awaiting Approval',
      date: '13 Nov 2026',
      validUntil: '13 Dec 2026',
      subtotal,
      discountPercentage: 0,
      vatRate: 20,
      totalAmount,
      deliveryCost: quoteForm.deliveryCost,
      installationCost: quoteForm.installationCost,
      marginPercentage,
      isLocked: false,
      notes: quoteForm.notes || 'Created from Project Detail Workspace',
      lineItems: [
        {
          id: `item-${Date.now()}`,
          description: quoteForm.description,
          quantity: quoteForm.quantity,
          unit: quoteForm.unit,
          internalCost: quoteForm.unitCost,
          unitPrice: quoteForm.unitPrice,
          totalPrice: quoteForm.quantity * quoteForm.unitPrice,
        },
      ],
    });
    setIsQuotationModalOpen(false);
    setActiveTab('quotes');
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title) return;
    addDocument({
      projectId: project.id,
      projectName: project.name,
      title: docForm.title,
      type: docForm.type,
      version: docForm.version,
      fileName:
        docForm.fileName ||
        `${project.code}_${docForm.title.replace(/\s+/g, '_')}_${docForm.version}.pdf`,
      fileSize: '4.8 MB',
      uploadedBy: 'Sarah Mitchell',
      uploadedAt: '13 Nov 2026, 15:10',
      approvalStatus: docForm.approvalStatus,
      isApproved: docForm.approvalStatus === 'Approved',
      isCurrent: docForm.isCurrent,
      tags: docForm.tags.split(',').map((t) => t.trim()),
    });
    setIsDocModalOpen(false);
    setActiveTab('docs');
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    addPayment({
      projectId: project.id,
      projectName: project.name,
      clientName: project.clientName,
      invoiceRef: paymentForm.invoiceRef,
      stage: paymentForm.stage,
      invoiceDate: paymentForm.invoiceDate,
      dueDate: paymentForm.dueDate,
      amount: Number(paymentForm.amount),
      receivedAmount: paymentForm.status === 'Paid' ? Number(paymentForm.amount) : 0,
      status: paymentForm.status,
      paymentMethod: 'Bank Transfer',
    });
    setIsPaymentModalOpen(false);
    setActiveTab('pay');
  };

  const handleCreateSourcedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcingForm.description) return;
    const vendor = vendors.find((v) => v.id === sourcingForm.vendorId) || vendors[0];
    addSourcedProduct({
      projectId: project.id,
      projectName: project.name,
      description: sourcingForm.description,
      specification: sourcingForm.specification || 'Standard architectural specification',
      vendorId: vendor.id,
      vendorName: vendor.name,
      quantity: Number(sourcingForm.quantity),
      unit: sourcingForm.unit,
      unitCost: Number(sourcingForm.unitCost),
      totalCost: Number(sourcingForm.quantity) * Number(sourcingForm.unitCost),
      poNumber: `PO-2026-0${90 + purchaseOrders.length}`,
      expectedDelivery: sourcingForm.expectedDelivery,
      status: sourcingForm.status,
    });
    setIsSourcingModalOpen(false);
    setActiveTab('sourcing');
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === poForm.vendorId) || vendors[0];
    addPurchaseOrder({
      projectId: project.id,
      projectName: project.name,
      vendorId: vendor.id,
      vendorName: vendor.name,
      orderDate: '13 Nov 2026',
      expectedDelivery: poForm.expectedDelivery,
      totalAmount: Number(poForm.totalAmount),
      status: 'Approved',
      itemsList: poForm.itemsList || 'Joinery & Architectural Fit-Out Package',
    });
    setIsPOModalOpen(false);
    setActiveTab('sourcing');
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.title) return;
    addMilestone({
      projectId: project.id,
      projectName: project.name,
      title: milestoneForm.title,
      owner: milestoneForm.owner,
      dueDate: milestoneForm.dueDate,
      status: 'In progress',
      priority: 'High',
      dependency: milestoneForm.dependency,
      progressPercent: 25,
    });
    setIsMilestoneModalOpen(false);
    setActiveTab('tasks');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) return;
    addTask({
      projectId: project.id,
      title: taskForm.title,
      owner: taskForm.owner,
      dueDate: taskForm.dueDate,
      priority: taskForm.priority,
      status: 'To Do',
    });
    setIsTaskModalOpen(false);
    setActiveTab('tasks');
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.caption) return;
    addPhoto({
      projectId: project.id,
      projectName: project.name,
      category: photoForm.category,
      caption: photoForm.caption,
      uploadedBy: 'Sarah Mitchell',
      uploadedAt: '13 Nov 2026',
      visibility: photoForm.visibility,
      tags: photoForm.tags.split(',').map((t) => t.trim()),
      imageUrl: photoForm.imageUrl,
    });
    setIsPhotoModalOpen(false);
    setActiveTab('images');
  };

  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectForm.issue) return;
    addDefect({
      projectId: project.id,
      projectName: project.name,
      issue: defectForm.issue,
      description: defectForm.description,
      linkedProduct: defectForm.linkedProduct,
      vendorName: defectForm.vendorName,
      poNumber: defectForm.poNumber,
      severity: defectForm.severity,
      status: 'New',
      rootCause: defectForm.rootCause,
      replacementTargetDate: defectForm.replacementTargetDate,
      costImpact: Number(defectForm.costImpact),
      loggedDate: '13 Nov 2026',
      owner: project.owner,
    });
    setIsDefectModalOpen(false);
    setActiveTab('snags');
  };

  const handleCreateCallLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callForm.summary) return;
    addCallLog({
      projectId: project.id,
      projectName: project.name,
      contactName: callForm.contactName,
      type: callForm.type,
      dateTime: '13 Nov 2026, 15:15',
      actionOwner: 'Sarah Mitchell',
      summary: callForm.summary,
      followUpDate: callForm.followUpDate,
    });
    setIsCallModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Sticky-Friendly Project Header */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7b8798] hover:text-[#17243b] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Master Matrix
        </Link>

        {/* Master Project Hero Card */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#e8edf3] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
                  {project.code}
                </span>
                <Badge
                  variant={
                    project.health === 'green'
                      ? 'green'
                      : project.health === 'amber'
                      ? 'amber'
                      : 'red'
                  }
                  dot
                >
                  {project.health === 'green'
                    ? 'Green · Healthy'
                    : project.health === 'amber'
                    ? 'Amber · At Risk'
                    : 'Red · Critical'}
                </Badge>
                <Badge
                  variant={
                    project.priority === 'Urgent'
                      ? 'red'
                      : project.priority === 'High'
                      ? 'amber'
                      : 'gray'
                  }
                >
                  Priority: {project.priority}
                </Badge>
                <Badge variant="blue">{project.stage}</Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
                {project.name}
              </h1>

              <div className="flex items-center gap-3 text-xs text-[#7b8798] mt-2 flex-wrap">
                <Link
                  href={`/clients/${project.clientId}`}
                  className="font-bold text-[#4268e8] hover:underline flex items-center gap-1"
                >
                  <Users2 className="w-3.5 h-3.5" /> {project.clientName}
                </Link>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#94a3b8]" /> UK Lead: {project.owner} (India Coord: {project.coordinator})
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#94a3b8]" /> {project.siteAddress}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" /> Target: {project.targetCompletion}
                </span>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-2 relative flex-wrap">
              {permissions.canEdit && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsQuotationModalOpen(true)}
                  >
                    ＋ Quote / Add-on
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsDocModalOpen(true)}
                  >
                    ＋ Drawing / Doc
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsCallModalOpen(true)}
                  >
                    ＋ Log Call
                  </Button>
                </>
              )}

              {/* Update Stage Dropdown */}
              <div className="relative">
                <Button
                  variant="dark"
                  size="sm"
                  icon={<ChevronDown className="w-3.5 h-3.5" />}
                  iconPosition="right"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                >
                  Stage: {project.stage}
                </Button>

                {isStatusDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-[#e2e8f0] py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-[#f1f5f9] font-bold text-[#17243b]">
                      Transition Project Stage (14 Stages)
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {allStages.map((stage) => (
                        <button
                          key={stage}
                          onClick={() => {
                            updateProjectStage(project.id, stage);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-[#f8fafc] flex items-center justify-between transition-colors ${
                            project.stage === stage
                              ? 'font-bold text-[#4268e8] bg-[#edf1ff]/40'
                              : 'text-[#334155]'
                          }`}
                        >
                          <span>{stage}</span>
                          {project.stage === stage && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#4268e8]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Commercial & Margin Summary Strip (RBAC Protected per UAT #15) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#edf0f5] bg-[#fafbfe]">
            <div className="p-4 sm:px-5">
              <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block">
                Settled Value (Inc. Add-ons)
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-[#17243b] mt-1">
                £{project.settledValue.toLocaleString()}
              </div>
              <span className="text-[10px] text-[#7b8798]">
                Base £{project.approvedValue.toLocaleString()} + £{project.enhancementValue.toLocaleString()}
              </span>
            </div>
            <div className="p-4 sm:px-5">
              <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block">
                Amount Received
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-[#16845f] mt-1">
                £{project.receivedValue.toLocaleString()}
              </div>
              <span className="text-[10px] text-[#16845f]">Cleared in UK bank</span>
            </div>
            <div className="p-4 sm:px-5">
              <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block">
                Outstanding Balance
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-[#c84c58] mt-1">
                £{(project.settledValue - project.receivedValue).toLocaleString()}
              </div>
              <span className="text-[10px] text-[#7b8798]">Scheduled milestones</span>
            </div>
            <div className="p-4 sm:px-5">
              <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block">
                Committed Supplier Cost
              </span>
              {permissions.canViewCostsAndMargins ? (
                <>
                  <div className="text-lg sm:text-xl font-extrabold text-[#334155] mt-1">
                    £{committedSupplierCost.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-[#7b8798]">Est. Total Cost: £{estimatedInternalCost.toLocaleString()}</span>
                </>
              ) : (
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#c84c58]">
                  <Lock className="w-3.5 h-3.5" /> Restricted by Role
                </div>
              )}
            </div>
            <div className="p-4 sm:px-5">
              <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block">
                Est. Gross Margin (UAT #15)
              </span>
              {permissions.canViewCostsAndMargins ? (
                <>
                  <div className="text-lg sm:text-xl font-extrabold text-[#4268e8] mt-1">
                    £{grossMarginPound.toLocaleString()} ({grossMarginPct}%)
                  </div>
                  <span className="text-[10px] text-[#7b8798]">Target threshold: ≥38%</span>
                </>
              ) : (
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#c84c58]">
                  <Lock className="w-3.5 h-3.5" /> Margin Hidden
                </div>
              )}
            </div>
          </div>

          {/* 10 Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 border-t border-[#e8edf3] overflow-x-auto bg-white select-none">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'quotes', label: `Quotations (${projectQuotes.length})` },
              { id: 'docs', label: `Documents (${projectDocs.length})` },
              { id: 'pay', label: `Payments (${projectPayments.length})` },
              { id: 'sourcing', label: `Sourcing & POs (${projectSourced.length})` },
              { id: 'tasks', label: `Milestones & Tasks (${projectMilestones.length + projectTasks.length})` },
              { id: 'comms', label: `Comms Hub (${projectEmails.length + projectWhatsApp.length})` },
              { id: 'images', label: `Gallery (${projectPhotos.length})` },
              { id: 'snags', label: `Defects (${projectDefects.length})` },
              { id: 'history', label: 'Audit Activity' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#4268e8] text-[#4268e8]'
                    : 'border-transparent text-[#7b8798] hover:text-[#17243b] hover:border-[#cbd5e1]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action Shortcuts Grid */}
          <div className="bg-white p-4 rounded-2xl border border-[#e8edf3] shadow-xs">
            <div className="text-xs font-bold text-[#17243b] mb-3">
              Workspace Quick Actions (Click any card to add records to {project.code})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              <button
                onClick={() => setIsQuotationModalOpen(true)}
                className="p-3 rounded-xl border border-[#e8edf3] hover:border-[#4268e8] hover:bg-[#edf1ff]/40 text-center transition-all group cursor-pointer"
              >
                <FileSpreadsheet className="w-5 h-5 mx-auto text-[#4268e8] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#17243b] block">＋ Quotation</span>
              </button>

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="p-3 rounded-xl border border-[#e8edf3] hover:border-[#16845f] hover:bg-[#e8f7f0]/40 text-center transition-all group cursor-pointer"
              >
                <PoundSterling className="w-5 h-5 mx-auto text-[#16845f] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#17243b] block">＋ Payment</span>
              </button>

              <button
                onClick={() => setIsSourcingModalOpen(true)}
                className="p-3 rounded-xl border border-[#e8edf3] hover:border-[#3b82f6] hover:bg-[#eff6ff] text-center transition-all group cursor-pointer"
              >
                <Truck className="w-5 h-5 mx-auto text-[#3b82f6] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#17243b] block">＋ Sourced Item</span>
              </button>

              <button
                onClick={() => setIsMilestoneModalOpen(true)}
                className="p-3 rounded-xl border border-[#e8edf3] hover:border-[#8b5cf6] hover:bg-[#f5f3ff] text-center transition-all group cursor-pointer"
              >
                <Clock className="w-5 h-5 mx-auto text-[#8b5cf6] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#17243b] block">＋ Milestone</span>
              </button>

              <button
                onClick={() => setIsDocModalOpen(true)}
                className="p-3 rounded-xl border border-[#e8edf3] hover:border-[#0ea5e9] hover:bg-[#f0f9ff] text-center transition-all group cursor-pointer"
              >
                <FileText className="w-5 h-5 mx-auto text-[#0ea5e9] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#17243b] block">＋ Drawing Rev</span>
              </button>

              <button
                onClick={() => setIsCallModalOpen(true)}
                className="p-3 rounded-xl border border-[#e8edf3] hover:border-[#f59e0b] hover:bg-[#fffbeb] text-center transition-all group cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 mx-auto text-[#f59e0b] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#17243b] block">＋ Log Call</span>
              </button>

              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="p-3 rounded-xl border border-[#e8edf3] hover:border-[#ec4899] hover:bg-[#fdf2f8] text-center transition-all group cursor-pointer"
              >
                <ImageIcon className="w-5 h-5 mx-auto text-[#ec4899] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#17243b] block">＋ Add Photo</span>
              </button>

              <button
                onClick={() => setIsDefectModalOpen(true)}
                className="p-3 rounded-xl border border-[#e8edf3] hover:border-[#c84c58] hover:bg-[#ffeaec]/40 text-center transition-all group cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 mx-auto text-[#c84c58] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#17243b] block">＋ Log Defect</span>
              </button>
            </div>
          </div>

          {/* Row 1: Delivery Progress Stepper & Commercial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Lifecycle Stepper */}
            <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-[#17243b]">Delivery Lifecycle Progress</h3>
                  <Badge variant="blue">Step {project.stepIndex} of 12</Badge>
                </div>
                <div className="text-xs text-[#7b8798] mb-4">
                  Current Stage: <b className="text-[#17243b]">{project.stage}</b> · Target: {project.targetCompletion}
                </div>

                <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden mb-6">
                  <div
                    className="bg-[#4268e8] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (project.stepIndex / 12) * 100)}%` }}
                  />
                </div>

                <div className="space-y-3.5 text-xs">
                  {projectMilestones.slice(0, 3).map((ms) => (
                    <div key={ms.id} className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-[#f8fafc] border border-[#edf0f5]">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px] ${
                            ms.status === 'Completed'
                              ? 'bg-[#e8f7f0] text-[#16845f]'
                              : 'bg-[#edf1ff] text-[#4268e8]'
                          }`}
                        >
                          {ms.status === 'Completed' ? '✓' : '●'}
                        </span>
                        <div>
                          <div className="font-bold text-[#17243b]">{ms.title}</div>
                          <div className="text-[11px] text-[#7b8798]">
                            Owner: {ms.owner} · Due: {ms.dueDate}
                          </div>
                        </div>
                      </div>
                      <Badge variant={ms.status === 'Completed' ? 'green' : 'blue'}>{ms.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-[#f1f5f9] mt-5 flex justify-end">
                <Button variant="secondary" size="sm" onClick={() => setActiveTab('tasks')}>
                  View Full Milestone Roadmap →
                </Button>
              </div>
            </div>

            {/* Commercial Summary */}
            <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-[#17243b]">Commercial Agreement & Enhancements</h3>
                  <Badge variant="green">Approved & Locked</Badge>
                </div>

                <div className="space-y-2.5 text-xs">
                  {projectQuotes.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => router.push(`/quotations/${q.id}`)}
                      className="p-3 bg-[#f8fafc] hover:bg-[#f1f5f9] cursor-pointer rounded-xl border border-[#edf0f5] flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-bold text-[#17243b] flex items-center gap-1.5">
                          <span>{q.reference} ({q.version})</span>
                          <Badge variant={q.type === 'Original' ? 'blue' : 'gold'}>{q.type}</Badge>
                        </div>
                        <div className="text-[11px] text-[#7b8798] mt-0.5">
                          {q.notes} · {q.status}
                        </div>
                      </div>
                      <span className="font-extrabold text-[#17243b] text-sm">
                        £{q.subtotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-[#f1f5f9] mt-5 flex justify-between items-center">
                <Button variant="secondary" size="sm" onClick={() => setIsQuotationModalOpen(true)}>
                  ＋ Add Enhancement Quote
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setActiveTab('pay')}>
                  Open Payment Ledger →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quotations & Enhancements */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#17243b]">Quotations & Enhancements (Section 7)</h2>
              <p className="text-xs text-[#7b8798]">
                Approved quotations are locked against alterations. Enhancements update the project settled value automatically (UAT #8).
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsQuotationModalOpen(true)}
            >
              Create Quotation / Enhancement
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Reference</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Version</th>
                    <th className="py-3.5 px-4">Subtotal (Ex VAT)</th>
                    <th className="py-3.5 px-4">Margin (UAT #15)</th>
                    <th className="py-3.5 px-4">Total (Inc VAT)</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {projectQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-[#f8fafc]">
                      <td className="py-4 px-6">
                        <Link
                          href={`/quotations/${quote.id}`}
                          className="font-extrabold text-[#17243b] text-xs hover:text-[#4268e8]"
                        >
                          {quote.reference}
                        </Link>
                        {quote.isLocked && (
                          <div className="text-[10px] text-[#16845f] font-semibold mt-0.5">
                            🔒 Version Locked ({quote.approvedDate})
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={quote.type === 'Original' ? 'blue' : 'gold'}>
                          {quote.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#17243b]">{quote.version}</td>
                      <td className="py-4 px-4 font-bold text-[#334155]">£{quote.subtotal.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        {permissions.canViewCostsAndMargins ? (
                          <span className="font-bold text-[#16845f]">
                            {quote.marginPercentage || 38}% Margin
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#c84c58] font-semibold">🔒 Hidden</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-[#17243b]">
                        £{quote.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant={quote.status === 'Approved' ? 'green' : 'amber'}>
                          {quote.status}
                        </Badge>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => router.push(`/quotations/${quote.id}`)}
                          >
                            View Breakdown
                          </Button>
                          {!quote.isLocked && permissions.canApprove && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => approveQuotation(quote.id)}
                            >
                              Approve & Lock
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Documents & Drawings */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#17243b]">Controlled Documents & Drawing Revisions (UAT #5)</h2>
              <p className="text-xs text-[#7b8798]">
                Uploading a new current revision automatically marks earlier versions as archived while retaining history.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsDocModalOpen(true)}
            >
              Upload Drawing Revision
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Document Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Version</th>
                    <th className="py-3.5 px-4">Uploaded By</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4 text-center">Approval State</th>
                    <th className="py-3.5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {projectDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#f8fafc]">
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#17243b] flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-[#4268e8]" />
                          <span>{doc.title}</span>
                          {doc.isCurrent && (
                            <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#e8f7f0] text-[#16845f] font-extrabold">
                              CURRENT 🔒
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#7b8798] mt-0.5">
                          {doc.fileName} · {doc.fileSize}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="blue">{doc.type}</Badge>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#17243b]">{doc.version}</td>
                      <td className="py-4 px-4 text-[#475569]">{doc.uploadedBy}</td>
                      <td className="py-4 px-4 text-[#7b8798]">{doc.uploadedAt}</td>
                      <td className="py-4 px-4 text-center">
                        <Badge
                          variant={
                            doc.approvalStatus === 'Approved'
                              ? 'green'
                              : doc.approvalStatus === 'Rejected'
                              ? 'red'
                              : 'amber'
                          }
                        >
                          {doc.approvalStatus}
                        </Badge>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {doc.approvalStatus !== 'Approved' && permissions.canEdit && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => approveDocument(doc.id)}
                            >
                              Approve {doc.version}
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => setPreviewDoc(doc)}
                          >
                            Preview
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Payments & Finance */}
      {activeTab === 'pay' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#17243b]">Payment Schedules & Invoices (UAT #7)</h2>
              <p className="text-xs text-[#7b8798]">
                Recording a payment immediately updates the project received value and outstanding balance.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Add Payment Milestone
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Invoice Ref</th>
                    <th className="py-3.5 px-4">Payment Stage</th>
                    <th className="py-3.5 px-4">Invoice Date</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Received</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {projectPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#f8fafc]">
                      <td className="py-4 px-6 font-bold text-[#17243b]">{pay.invoiceRef}</td>
                      <td className="py-4 px-4 font-semibold text-[#334155]">{pay.stage}</td>
                      <td className="py-4 px-4 text-[#7b8798]">{pay.invoiceDate}</td>
                      <td className="py-4 px-4 text-[#475569]">{pay.dueDate}</td>
                      <td className="py-4 px-4 font-bold text-[#17243b]">
                        £{pay.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#16845f]">
                        £{pay.receivedAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge
                          variant={
                            pay.status === 'Paid'
                              ? 'green'
                              : pay.status === 'Overdue'
                              ? 'red'
                              : pay.status === 'Upcoming' || pay.status === 'Invoiced'
                              ? 'amber'
                              : 'gray'
                          }
                        >
                          {pay.status}
                        </Badge>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        {pay.status !== 'Paid' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => markPaymentPaid(pay.id)}
                          >
                            Mark Paid
                          </Button>
                        ) : (
                          <span className="text-[11px] font-bold text-[#16845f]">✓ Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Sourcing & Purchase Orders */}
      {activeTab === 'sourcing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#17243b]">Materials Sourcing & Purchase Orders (UAT #6)</h2>
              <p className="text-xs text-[#7b8798]">
                Includes automated 7-day, 3-day, and 1-day expected delivery reminder alerts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsPOModalOpen(true)}
              >
                Create PO
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsSourcingModalOpen(true)}
              >
                Add Sourced Item
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Product / Specification</th>
                    <th className="py-3.5 px-4">Vendor</th>
                    <th className="py-3.5 px-4">Quantity</th>
                    <th className="py-3.5 px-4">Unit / Total Cost</th>
                    <th className="py-3.5 px-4">PO Ref</th>
                    <th className="py-3.5 px-4">Expected Delivery & Alert</th>
                    <th className="py-3.5 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {projectSourced.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8fafc]">
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#17243b]">{item.description}</div>
                        <div className="text-[11px] text-[#7b8798] line-clamp-1">
                          {item.specification}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#17243b]">{item.vendorName}</td>
                      <td className="py-4 px-4">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-4 px-4">
                        {permissions.canViewCostsAndMargins ? (
                          <div>
                            <span className="font-bold text-[#17243b]">£{item.totalCost.toLocaleString()}</span>
                            <span className="block text-[10px] text-[#7b8798]">£{item.unitCost}/{item.unit}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#c84c58] font-semibold">🔒 Cost Hidden</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#4268e8]">{item.poNumber}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#334155]">{item.expectedDelivery}</div>
                        {item.status !== 'Delivered' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#d97706] mt-0.5">
                            <Bell className="w-3 h-3" /> 7/3/1-Day Chase Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <Badge
                          variant={
                            item.status === 'Delivered'
                              ? 'green'
                              : item.status === 'Delayed'
                              ? 'red'
                              : 'amber'
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Milestones & Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#17243b]">Milestones & Actionable Tasks (Section 9)</h2>
              <p className="text-xs text-[#7b8798]">
                Delivery control, task dependencies, owners, due dates, and completion status.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsTaskModalOpen(true)}
              >
                ＋ Add Task
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsMilestoneModalOpen(true)}
              >
                Add Milestone
              </Button>
            </div>
          </div>

          {/* Milestones Table */}
          <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
            <div className="px-6 py-3.5 border-b border-[#e8edf3] font-bold text-xs text-[#17243b]">
              Project Milestones ({projectMilestones.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="py-3 px-6">Milestone Title</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Dependency</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 pr-6 text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {projectMilestones.map((ms) => (
                    <tr key={ms.id} className="hover:bg-[#f8fafc]">
                      <td className="py-3.5 px-6 font-bold text-[#17243b]">{ms.title}</td>
                      <td className="py-3.5 px-4 text-[#475569]">{ms.owner}</td>
                      <td className="py-3.5 px-4 text-[#7b8798]">{ms.dueDate}</td>
                      <td className="py-3.5 px-4 text-[#94a3b8]">{ms.dependency || '—'}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#4268e8] h-full rounded-full"
                              style={{ width: `${ms.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-[#7b8798]">{ms.progressPercent}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant={ms.status === 'Completed' ? 'green' : 'blue'}>
                          {ms.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 pr-6 text-right">
                        <Button
                          variant={ms.status === 'Completed' ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => toggleMilestoneStatus(ms.id)}
                        >
                          {ms.status === 'Completed' ? 'Reopen' : 'Complete'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assigned Tasks Table */}
          <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
            <div className="px-6 py-3.5 border-b border-[#e8edf3] font-bold text-xs text-[#17243b]">
              Assigned Project Tasks ({projectTasks.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="py-3 px-6">Task Title</th>
                    <th className="py-3 px-4">Assigned Owner</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {projectTasks.map((tsk) => (
                    <tr key={tsk.id} className="hover:bg-[#f8fafc]">
                      <td className="py-3.5 px-6 font-bold text-[#17243b]">{tsk.title}</td>
                      <td className="py-3.5 px-4 text-[#475569]">{tsk.owner}</td>
                      <td className="py-3.5 px-4 text-[#7b8798]">{tsk.dueDate}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={tsk.priority === 'Urgent' ? 'red' : tsk.priority === 'High' ? 'amber' : 'gray'}>
                          {tsk.priority}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant={tsk.status === 'Done' ? 'green' : 'blue'}>
                          {tsk.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 pr-6 text-right">
                        <Button
                          variant={tsk.status === 'Done' ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => toggleTaskStatus(tsk.id)}
                        >
                          {tsk.status === 'Done' ? 'Reopen' : 'Mark Done'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Email & Communication Hub */}
      {activeTab === 'comms' && (
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e8edf3] min-h-[460px]">
            {/* Thread list */}
            <div className="p-4 space-y-2 max-h-[460px] overflow-y-auto">
              <div className="text-[11px] font-bold text-[#7b8798] uppercase px-2 mb-2">
                Project Email Threads ({projectEmails.length})
              </div>
              {projectEmails.map((em) => (
                <div
                  key={em.id}
                  onClick={() => setSelectedEmailId(em.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedEmail?.id === em.id
                      ? 'bg-[#edf1ff]/50 border-[#cbd8ff]'
                      : 'border-[#e8edf3] hover:bg-[#f8fafc]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#17243b]">{em.fromName}</span>
                    <span className="text-[10px] text-[#7b8798]">{em.date.split(',')[0]}</span>
                  </div>
                  <div className="text-xs font-medium text-[#334155] mt-1 truncate">
                    {em.subject}
                  </div>
                  {em.needsReply && (
                    <Badge variant="amber" className="mt-1.5">
                      Needs Reply
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Email Message & Thread */}
            <div className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
              {selectedEmail ? (
                <>
                  <div>
                    <div className="border-b border-[#e8edf3] pb-4 mb-4">
                      <div className="text-[11px] font-extrabold text-[#4268e8] uppercase tracking-wider">
                        EMAIL CONVERSATION · {project.code}
                      </div>
                      <h3 className="text-lg font-bold text-[#17243b] mt-1">
                        {selectedEmail.subject}
                      </h3>
                      <div className="text-xs text-[#7b8798] mt-1">
                        From: <b className="text-[#17243b]">{selectedEmail.fromName}</b> ({selectedEmail.fromEmail}) · To: {selectedEmail.toEmail}
                      </div>
                    </div>

                    <div className="prose text-xs text-[#334155] whitespace-pre-line leading-relaxed mb-6">
                      {selectedEmail.body}
                    </div>

                    {/* Replies */}
                    {selectedEmail.replies && selectedEmail.replies.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <span className="text-[11px] font-bold text-[#7b8798] uppercase tracking-wider block">
                          Thread History
                        </span>
                        {selectedEmail.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-3.5 bg-[#f0f4ff] rounded-xl border border-[#d0dbf5] text-xs text-[#1e293b]"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[#4268e8]">{rep.fromName}</span>
                              <span className="text-[10px] text-[#7b8798]">{rep.date}</span>
                            </div>
                            <p>{rep.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply Input Box */}
                  <div className="pt-4 border-t border-[#e8edf3]">
                    <span className="text-xs font-bold text-[#17243b] block mb-1.5">
                      Reply in Thread
                    </span>
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Draft formal client reply..."
                      className="w-full p-3 text-xs border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#4268e8] outline-none resize-none"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="primary"
                        icon={<Send className="w-3.5 h-3.5" />}
                        onClick={handleSendReply}
                      >
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center text-xs text-[#94a3b8]">
                  Select an email thread from the left to view messages.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Project Gallery */}
      {activeTab === 'images' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#17243b]">Visual Project Archive (UAT #12)</h2>
              <p className="text-xs text-[#7b8798]">
                Before, Design, Manufacturing, Delivery, Installation, and Final Portfolio imagery.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <select
                value={galleryFilter}
                onChange={(e) => setGalleryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Before">Before</option>
                <option value="Design">Design</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Delivery">Delivery</option>
                <option value="Installation">Installation</option>
                <option value="Final">Final</option>
              </select>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsPhotoModalOpen(true)}
              >
                Upload Photo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo.imageUrl)}
                className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="h-44 relative bg-slate-200 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="blue">{photo.category}</Badge>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <Badge variant="gray">{photo.visibility}</Badge>
                  </div>
                </div>
                <div className="p-3.5 space-y-1.5">
                  <div className="text-xs font-bold text-[#17243b] line-clamp-2">
                    {photo.caption}
                  </div>
                  <div className="text-[11px] text-[#7b8798]">
                    By {photo.uploadedBy} · {photo.uploadedAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Defects & Snagging */}
      {activeTab === 'snags' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#17243b]">Defects & Snagging Audits (UAT #13)</h2>
              <p className="text-xs text-[#7b8798]">
                Quality management tracing defects to projects, vendors, purchase orders, and replacements.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsDefectModalOpen(true)}
            >
              Log Defect
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Defect ID</th>
                    <th className="py-3.5 px-4">Issue Description</th>
                    <th className="py-3.5 px-4">Linked Product / PO</th>
                    <th className="py-3.5 px-4">Vendor</th>
                    <th className="py-3.5 px-4">Severity</th>
                    <th className="py-3.5 px-4">Replacement Due</th>
                    <th className="py-3.5 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {projectDefects.map((def) => (
                    <tr key={def.id} className="hover:bg-[#f8fafc]">
                      <td className="py-4 px-6 font-bold text-[#17243b]">{def.code}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#17243b]">{def.issue}</div>
                        <div className="text-[11px] text-[#7b8798] line-clamp-1">
                          {def.description}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#475569]">
                        {def.linkedProduct || '—'} {def.poNumber ? `(${def.poNumber})` : ''}
                      </td>
                      <td className="py-4 px-4 text-[#334155]">{def.vendorName || '—'}</td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            def.severity === 'Critical'
                              ? 'red'
                              : def.severity === 'High'
                              ? 'amber'
                              : 'blue'
                          }
                        >
                          {def.severity}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-[#475569]">{def.replacementTargetDate || 'TBD'}</td>
                      <td className="py-4 pr-6 text-right">
                        <Badge variant={def.status === 'Resolved' ? 'green' : 'amber'}>
                          {def.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 10: Activity Timeline */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs p-6">
          <h3 className="font-bold text-sm text-[#17243b] mb-4">Project Audit & Stage Transition Log</h3>
          <div className="space-y-4 text-xs">
            <div className="relative pl-6 pb-4 border-l-2 border-[#edf1ff]">
              <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#4268e8] border-2 border-white" />
              <div className="font-bold text-[#17243b]">12 Nov 2026 · Client Email Received</div>
              <p className="text-[11px] text-[#7b8798] mt-0.5">
                Olivia Hart (North & Co.) sent revised banquette dimensions for mezzanine alcove.
              </p>
            </div>
            <div className="relative pl-6 pb-4 border-l-2 border-[#edf1ff]">
              <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#3b82f6] border-2 border-white" />
              <div className="font-bold text-[#17243b]">10 Nov 2026 · Drawing Revision v3 Approved</div>
              <p className="text-[11px] text-[#7b8798] mt-0.5">
                Drawing marked as approved and locked by Sarah Mitchell.
              </p>
            </div>
            <div className="relative pl-6 pb-1 border-l-2 border-transparent">
              <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#16845f] border-2 border-white" />
              <div className="font-bold text-[#17243b]">04 Nov 2026 · Payment Milestone Settled</div>
              <p className="text-[11px] text-[#7b8798] mt-0.5">
                £10,000 received for INV-1042 via direct bank transfer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6.2 & 31: Persistent Scrollable Lower Chronological Communication & Activity Feed */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-[#e8edf3] bg-[#fafbfe] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-extrabold text-[#4268e8] uppercase tracking-wider">
              SECTION 6.2 & 31 · SCROLLABLE PROJECT COMMUNICATION STREAM
            </div>
            <h3 className="font-bold text-sm text-[#17243b]">
              Unified Project Communications (Emails, WhatsApp Business, Call Notes & Approvals)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsCallModalOpen(true)}>
              ＋ Log Call / Site Note
            </Button>
            <Button variant="secondary" size="sm" onClick={() => router.push('/communications')}>
              Open Full Comms Hub →
            </Button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-6 space-y-3 divide-y divide-[#f1f5f9]">
          {/* WhatsApp Messages for this project */}
          {projectWhatsApp.map((wa) =>
            wa.messages.slice(-2).map((msg) => (
              <div key={msg.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      msg.isInternalNote
                        ? 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]'
                        : 'bg-[#e8f7f0] text-[#16845f]'
                    }`}
                  >
                    {msg.isInternalNote ? 'Internal Note' : 'WhatsApp'}
                  </span>
                  <div>
                    <div className="font-bold text-[#17243b]">
                      {msg.sender} <span className="text-[#7b8798] font-normal">({wa.clientName})</span>
                    </div>
                    <p className="text-[#475569] mt-0.5">{msg.text}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#94a3b8] shrink-0">{msg.timestamp}</span>
              </div>
            ))
          )}

          {/* Emails for this project */}
          {projectEmails.map((em) => (
            <div key={em.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#edf1ff] text-[#4268e8] shrink-0">
                  Email
                </span>
                <div>
                  <div className="font-bold text-[#17243b]">
                    {em.subject} <span className="text-[#7b8798] font-normal">· From {em.fromName}</span>
                  </div>
                  <p className="text-[#475569] mt-0.5">{em.snippet}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#94a3b8] shrink-0">{em.date}</span>
            </div>
          ))}

          {/* Call & Site Meeting Logs for this project */}
          {projectCalls.map((call) => (
            <div key={call.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] shrink-0">
                  {call.type}
                </span>
                <div>
                  <div className="font-bold text-[#17243b]">
                    {call.contactName} <span className="text-[#7b8798] font-normal">· Logged by {call.actionOwner}</span>
                  </div>
                  <p className="text-[#475569] mt-0.5">{call.summary}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#94a3b8] shrink-0">{call.dateTime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ALL WORKSPACE QUICK ACTION MODALS                                     */}
      {/* ===================================================================== */}

      {/* 1. Create Quotation / Enhancement Modal */}
      <Modal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        title={`Create Quotation / Enhancement (${project.code})`}
        subtitle="Includes internal supplier cost, delivery, installation, and live margin calculation (UAT #4 & #8)"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateQuote} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Quotation Type</label>
              <select
                value={quoteForm.type}
                onChange={(e) => setQuoteForm({ ...quoteForm, type: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Enhancement">Enhancement / Additional Scope</option>
                <option value="Original">Original Quotation Revision</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Revision Code</label>
              <input
                type="text"
                value={quoteForm.version}
                onChange={(e) => setQuoteForm({ ...quoteForm, version: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Line Item Description *</label>
            <input
              required
              type="text"
              placeholder="e.g. Custom Curved Walnut Reception Desk with Fluted Brass Base"
              value={quoteForm.description}
              onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Quantity</label>
              <input
                type="number"
                value={quoteForm.quantity}
                onChange={(e) => setQuoteForm({ ...quoteForm, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Unit</label>
              <input
                type="text"
                value={quoteForm.unit}
                onChange={(e) => setQuoteForm({ ...quoteForm, unit: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Unit Cost (£)</label>
              <input
                type="number"
                value={quoteForm.unitCost}
                onChange={(e) => setQuoteForm({ ...quoteForm, unitCost: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Selling Price (£)</label>
              <input
                type="number"
                value={quoteForm.unitPrice}
                onChange={(e) => setQuoteForm({ ...quoteForm, unitPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsQuotationModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Quotation
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Upload Controlled Document / Drawing Modal */}
      <Modal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        title={`Upload Controlled Document / Drawing (${project.code})`}
        subtitle="Marks previous drawing revisions as Superseded while retaining full version history (UAT #5)"
      >
        <form onSubmit={handleUploadDoc} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Document / Drawing Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Ground Floor & Mezzanine Joinery General Arrangement"
              value={docForm.title}
              onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Category</label>
              <select
                value={docForm.type}
                onChange={(e) => setDocForm({ ...docForm, type: e.target.value as ProjectDocument['type'] })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Drawing">Drawing</option>
                <option value="Specification">Specification</option>
                <option value="Quotation">Quotation</option>
                <option value="Approval">Approval</option>
                <option value="Warranty">Warranty</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Revision (v1/v2/v3/v4)</label>
              <input
                type="text"
                value={docForm.version}
                onChange={(e) => setDocForm({ ...docForm, version: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Approval State</label>
              <select
                value={docForm.approvalStatus}
                onChange={(e) => setDocForm({ ...docForm, approvalStatus: e.target.value as ProjectDocument['approvalStatus'] })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Internal">Internal</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsDocModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload Revision
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. Schedule / Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Add Payment Milestone (${project.code})`}
        subtitle="Record Deposit, Stage Payment, Enhancement, or Final Retention Invoice (UAT #7)"
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Invoice Reference *</label>
              <input
                required
                type="text"
                value={paymentForm.invoiceRef}
                onChange={(e) => setPaymentForm({ ...paymentForm, invoiceRef: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Milestone Stage</label>
              <select
                value={paymentForm.stage}
                onChange={(e) => setPaymentForm({ ...paymentForm, stage: e.target.value as PaymentScheduleItem['stage'] })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Deposit 30%">Deposit 30%</option>
                <option value="Production Stage">Production Stage</option>
                <option value="Delivery Stage">Delivery Stage</option>
                <option value="Installation Stage">Installation Stage</option>
                <option value="Enhancement 1">Enhancement 1</option>
                <option value="Final Payment">Final Payment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Amount (£)</label>
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Initial Status</label>
              <select
                value={paymentForm.status}
                onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value as PaymentScheduleItem['status'] })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Invoiced">Invoiced (Awaiting Payment)</option>
                <option value="Paid">Paid Immediately</option>
                <option value="Planned">Planned Milestone</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Payment Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. Add Sourced Product Modal */}
      <Modal
        isOpen={isSourcingModalOpen}
        onClose={() => setIsSourcingModalOpen(false)}
        title={`Add Sourced Product (${project.code})`}
        subtitle="Automatically enables 7-day, 3-day, and 1-day supplier delivery reminders (UAT #6)"
      >
        <form onSubmit={handleCreateSourcedItem} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Product / Material Description *</label>
            <input
              required
              type="text"
              placeholder="e.g. Crib 5 Olive Bouclé Upholstery Fabric"
              value={sourcingForm.description}
              onChange={(e) => setSourcingForm({ ...sourcingForm, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Assigned Vendor</label>
              <select
                value={sourcingForm.vendorId}
                onChange={(e) => setSourcingForm({ ...sourcingForm, vendorId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Expected Delivery Date</label>
              <input
                type="date"
                value={sourcingForm.expectedDelivery}
                onChange={(e) => setSourcingForm({ ...sourcingForm, expectedDelivery: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Quantity</label>
              <input
                type="number"
                value={sourcingForm.quantity}
                onChange={(e) => setSourcingForm({ ...sourcingForm, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Unit</label>
              <input
                type="text"
                value={sourcingForm.unit}
                onChange={(e) => setSourcingForm({ ...sourcingForm, unit: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Unit Cost (£)</label>
              <input
                type="number"
                value={sourcingForm.unitCost}
                onChange={(e) => setSourcingForm({ ...sourcingForm, unitCost: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsSourcingModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Sourced Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Create Purchase Order Modal */}
      <Modal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        title={`Generate Supplier Purchase Order (${project.code})`}
        subtitle="Issue formal Purchase Order linked to vendor and project procurement ledger"
      >
        <form onSubmit={handleCreatePO} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Supplier / Vendor</label>
            <select
              value={poForm.vendorId}
              onChange={(e) => setPoForm({ ...poForm, vendorId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Items Summary *</label>
            <input
              required
              type="text"
              placeholder="e.g. 24x Solid Brass Fluted Columns & Kickplates"
              value={poForm.itemsList}
              onChange={(e) => setPoForm({ ...poForm, itemsList: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Total PO Value (£)</label>
              <input
                type="number"
                value={poForm.totalAmount}
                onChange={(e) => setPoForm({ ...poForm, totalAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Expected Delivery</label>
              <input
                type="date"
                value={poForm.expectedDelivery}
                onChange={(e) => setPoForm({ ...poForm, expectedDelivery: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsPOModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Issue Purchase Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Add Milestone Modal */}
      <Modal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        title={`Add Delivery Milestone (${project.code})`}
        subtitle="Set milestone owner, target date, and predecessor dependency"
      >
        <form onSubmit={handleCreateMilestone} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Milestone Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Mezzanine Banquette Electrical & Lighting Sign-Off"
              value={milestoneForm.title}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Owner</label>
              <input
                type="text"
                value={milestoneForm.owner}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, owner: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Target Date</label>
              <input
                type="date"
                value={milestoneForm.dueDate}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsMilestoneModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Milestone
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. Add Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={`Assign Project Task (${project.code})`}
        subtitle="Create actionable task with owner, due date, and priority"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Task Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Verify site access lift dimensions with building manager"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Assigned To</label>
              <input
                type="text"
                value={taskForm.owner}
                onChange={(e) => setTaskForm({ ...taskForm, owner: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Due Date</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Assign Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* 8. Upload Project Photo Modal */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title={`Upload Project Photo (${project.code})`}
        subtitle="Categorise under Before, Design, Manufacturing, Delivery, Installation, or Final (UAT #12)"
      >
        <form onSubmit={handleUploadPhoto} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Photo Caption *</label>
            <input
              required
              type="text"
              placeholder="e.g. Completed fluted walnut bar installation on ground floor"
              value={photoForm.caption}
              onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Stage Category</label>
              <select
                value={photoForm.category}
                onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value as GalleryCategory })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Before">Before</option>
                <option value="Design">Design</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Delivery">Delivery</option>
                <option value="Installation">Installation</option>
                <option value="Final">Final</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Visibility</label>
              <select
                value={photoForm.visibility}
                onChange={(e) => setPhotoForm({ ...photoForm, visibility: e.target.value as ProjectPhotoVisibility })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Portfolio / Public">Portfolio / Public</option>
                <option value="Internal">Internal Only</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsPhotoModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload to Gallery
            </Button>
          </div>
        </form>
      </Modal>

      {/* 9. Log Defect / Snag Modal */}
      <Modal
        isOpen={isDefectModalOpen}
        onClose={() => setIsDefectModalOpen(false)}
        title={`Log Defect / Snagging Issue (${project.code})`}
        subtitle="Trace defect to supplier, product, and purchase order (UAT #13)"
      >
        <form onSubmit={handleCreateDefect} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Issue Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Hairline scratch on brass footrail section B"
              value={defectForm.issue}
              onChange={(e) => setDefectForm({ ...defectForm, issue: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Linked Product</label>
              <input
                type="text"
                placeholder="e.g. Brushed Brass Footrail"
                value={defectForm.linkedProduct}
                onChange={(e) => setDefectForm({ ...defectForm, linkedProduct: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Linked Supplier</label>
              <select
                value={defectForm.vendorName}
                onChange={(e) => setDefectForm({ ...defectForm, vendorName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">PO Number</label>
              <input
                type="text"
                value={defectForm.poNumber}
                onChange={(e) => setDefectForm({ ...defectForm, poNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Severity</label>
              <select
                value={defectForm.severity}
                onChange={(e) => setDefectForm({ ...defectForm, severity: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Replacement Date</label>
              <input
                type="date"
                value={defectForm.replacementTargetDate}
                onChange={(e) => setDefectForm({ ...defectForm, replacementTargetDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsDefectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Defect Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* 10. Log Call / Site Note Modal */}
      <Modal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        title={`Log Telephone Call / Site Meeting (${project.code})`}
        subtitle="Appends directly to the project and client communication timeline (UAT #11)"
      >
        <form onSubmit={handleCreateCallLog} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Contact Person</label>
              <input
                type="text"
                value={callForm.contactName}
                onChange={(e) => setCallForm({ ...callForm, contactName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Interaction Type</label>
              <select
                value={callForm.type}
                onChange={(e) => setCallForm({ ...callForm, type: e.target.value as CallMeetingLog['type'] })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg"
              >
                <option value="Phone Call">Phone Call</option>
                <option value="Site Meeting">Site Meeting</option>
                <option value="Teams Meeting">Teams Meeting</option>
                <option value="Workshop Visit">Workshop Visit</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Discussion Summary & Decisions *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Confirmed night-shift delivery access with site manager for 18 Nov..."
              value={callForm.summary}
              onChange={(e) => setCallForm({ ...callForm, summary: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsCallModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Call Log
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
              Controlled CAD/PDF Document Viewer. Version {previewDoc.version} is{' '}
              {previewDoc.isCurrent ? 'the active current revision 🔒' : 'archived in revision history'}.
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

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img src={selectedPhoto} alt="Preview" className="w-full h-auto rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}

type ProjectPhotoVisibility = 'Portfolio / Public' | 'Internal';
