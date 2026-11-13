'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Client,
  Project,
  Quotation,
  ProjectDocument,
  PaymentScheduleItem,
  SourcedProduct,
  PurchaseOrder,
  Vendor,
  Milestone,
  TaskItem,
  EmailThread,
  CallMeetingLog,
  ProjectPhoto,
  DefectItem,
  MaintenancePlan,
  UserRole,
  AuditLogItem,
  ProjectStage,
  WhatsAppThread,
  VendorPayment,
  RolePermissions,
  ContactPerson,
} from '@/types';
import {
  initialClients,
  initialProjects,
  initialQuotations,
  initialDocuments,
  initialPayments,
  initialVendors,
  initialSourcedProducts,
  initialPurchaseOrders,
  initialMilestones,
  initialTasks,
  initialEmails,
  initialCallLogs,
  initialPhotos,
  initialDefects,
  initialMaintenancePlans,
  initialUsers,
  initialAuditLogs,
  initialWhatsAppThreads,
  initialVendorPayments,
} from '@/data/mockData';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Entities
  clients: Client[];
  projects: Project[];
  quotations: Quotation[];
  documents: ProjectDocument[];
  payments: PaymentScheduleItem[];
  vendors: Vendor[];
  sourcedProducts: SourcedProduct[];
  purchaseOrders: PurchaseOrder[];
  milestones: Milestone[];
  tasks: TaskItem[];
  emails: EmailThread[];
  callLogs: CallMeetingLog[];
  photos: ProjectPhoto[];
  defects: DefectItem[];
  maintenancePlans: MaintenancePlan[];
  users: UserRole[];
  auditLogs: AuditLogItem[];
  whatsappThreads: WhatsAppThread[];
  vendorPayments: VendorPayment[];

  // User & Role State
  isAuthenticated: boolean;
  login: (role: string) => void;
  logout: () => void;
  currentRole: string;
  setCurrentRole: (role: string) => void;
  permissions: RolePermissions;

  // Global Search & Notification
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;

  // Toast
  toasts: ToastItem[];
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Actions
  addClient: (client: Omit<Client, 'id' | 'code' | 'createdAt' | 'totalSettledValue' | 'totalReceived' | 'totalOutstanding'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addClientContact: (clientId: string, contact: Omit<ContactPerson, 'id'>) => void;
  addProject: (proj: Partial<Project>) => void;
  updateProjectStage: (projectId: string, newStage: ProjectStage) => void;
  addQuotation: (quote: Partial<Quotation>) => void;
  approveQuotation: (id: string) => void;
  addDocument: (doc: Partial<ProjectDocument>) => void;
  approveDocument: (id: string) => void;
  addPayment: (payment: Partial<PaymentScheduleItem>) => void;
  markPaymentPaid: (id: string, partialAmount?: number) => void;
  addSourcedProduct: (item: Partial<SourcedProduct>) => void;
  addPurchaseOrder: (po: Partial<PurchaseOrder>) => void;
  addVendor: (vendor: Partial<Vendor>) => void;
  addMilestone: (milestone: Partial<Milestone>) => void;
  toggleMilestoneStatus: (id: string) => void;
  addTask: (task: Partial<TaskItem>) => void;
  toggleTaskStatus: (id: string) => void;
  sendEmailReply: (threadId: string, replyText: string) => void;
  composeEmail: (newEmail: Partial<EmailThread>) => void;
  reassignEmail: (threadId: string, newProjectId: string) => void;
  sendWhatsAppMessage: (threadId: string, text: string, isInternalNote?: boolean) => void;
  addCallLog: (log: Partial<CallMeetingLog>) => void;
  addPhoto: (photo: Partial<ProjectPhoto>) => void;
  addDefect: (defect: Partial<DefectItem>) => void;
  resolveDefect: (id: string) => void;
  addMaintenancePlan: (plan: Partial<MaintenancePlan>) => void;
  addUser: (user: Partial<UserRole>) => void;
  addVendorPayment: (vp: Partial<VendorPayment>) => void;
  markVendorPaymentPaid: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [documents, setDocuments] = useState<ProjectDocument[]>(initialDocuments);
  const [payments, setPayments] = useState<PaymentScheduleItem[]>(initialPayments);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [sourcedProducts, setSourcedProducts] = useState<SourcedProduct[]>(initialSourcedProducts);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [emails, setEmails] = useState<EmailThread[]>(initialEmails);
  const [callLogs, setCallLogs] = useState<CallMeetingLog[]>(initialCallLogs);
  const [photos, setPhotos] = useState<ProjectPhoto[]>(initialPhotos);
  const [defects, setDefects] = useState<DefectItem[]>(initialDefects);
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>(initialMaintenancePlans);
  const [users, setUsers] = useState<UserRole[]>(initialUsers);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [whatsappThreads, setWhatsappThreads] = useState<WhatsAppThread[]>(initialWhatsAppThreads);
  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>(initialVendorPayments);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string>('Administrator / Director');
  const [searchQuery, setSearchQuery] = useState('');

  const login = (role: string) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Compute Role-Based Permissions (Section 4 & 24 & 29 UAT #15)
  const permissions: RolePermissions = React.useMemo(() => {
    const r = currentRole.toLowerCase();
    const isClientPortal = r.includes('client portal');
    const isReadOnly = r.includes('read-only') || isClientPortal;
    const isRestrictedCostRole =
      isClientPortal || r.includes('installer') || r.includes('workshop');

    let defaultDashboard: RolePermissions['defaultDashboard'] = 'management';
    if (r.includes('uk project manager') || r.includes('sales')) defaultDashboard = 'pm';
    else if (r.includes('india')) defaultDashboard = 'india';
    else if (r.includes('procurement') || r.includes('sourcing')) defaultDashboard = 'procurement';
    else if (r.includes('finance')) defaultDashboard = 'finance';

    return {
      canViewCostsAndMargins: !isRestrictedCostRole,
      canViewInternalNotes: !isClientPortal,
      canEdit: !isReadOnly,
      canApprove: r.includes('director') || r.includes('sales') || r.includes('uk project manager'),
      canManageUsers: r.includes('director') || r.includes('admin'),
      isClientPortal,
      isReadOnly,
      defaultDashboard,
    };
  }, [currentRole]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (user: string, action: 'Created' | 'Updated' | 'Approved' | 'Deleted' | 'Uploaded' | 'Payment', record: string, details: string, badgeColor: 'blue' | 'green' | 'amber' | 'red' | 'gray') => {
    const newLog: AuditLogItem = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user,
      action,
      record,
      details,
      badgeColor,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addClient = (data: Omit<Client, 'id' | 'code' | 'createdAt' | 'totalSettledValue' | 'totalReceived' | 'totalOutstanding'>) => {
    const newId = 'cl-' + (clients.length + 1).toString().padStart(4, '0');
    const newClient: Client = {
      ...data,
      id: newId,
      code: 'CL-' + (clients.length + 1).toString().padStart(4, '0'),
      totalSettledValue: 0,
      totalReceived: 0,
      totalOutstanding: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    addAuditLog(currentRole, 'Created', newClient.name, `New client registered (${newClient.code})`, 'blue');
    showToast(`Client "${data.name}" added successfully`, 'success');
  };

  const addProject = (data: Partial<Project>) => {
    const count = projects.length + 1;
    const code = `FFC-2026-${count.toString().padStart(3, '0')}`;
    const newProj: Project = {
      id: 'proj-' + count.toString().padStart(3, '0'),
      code,
      name: data.name || 'New Fit-Out Project',
      clientId: data.clientId || clients[0]?.id || '',
      clientName: data.clientName || clients[0]?.name || 'Client',
      siteAddress: data.siteAddress || 'London, UK',
      owner: data.owner || 'Sarah Mitchell',
      coordinator: data.coordinator || 'Arjun Mehta',
      stage: data.stage || 'Lead / Enquiry',
      health: data.health || 'green',
      priority: data.priority || 'Normal',
      approvedValue: data.approvedValue || 0,
      enhancementValue: 0,
      settledValue: data.approvedValue || 0,
      receivedValue: 0,
      targetCompletion: data.targetCompletion || '2027-01-31',
      startDate: new Date().toISOString().split('T')[0],
      description: data.description || '',
      stepIndex: 1,
      tags: data.tags || ['Bespoke Fit-Out'],
    };
    setProjects((prev) => [newProj, ...prev]);
    if (newProj.approvedValue > 0) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === newProj.clientId
            ? {
                ...c,
                totalSettledValue: c.totalSettledValue + newProj.approvedValue,
                totalOutstanding: c.totalOutstanding + newProj.approvedValue,
              }
            : c
        )
      );
    }
    addAuditLog(currentRole, 'Created', `${code} (${newProj.name})`, 'New project created', 'green');
    showToast(`Project "${newProj.name}" created (${code})`, 'success');
  };

  const updateProjectStage = (projectId: string, newStage: ProjectStage) => {
    const targetProj = projects.find((p) => p.id === projectId);
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const stages: ProjectStage[] = [
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
          ];
          const newIndex = stages.indexOf(newStage) + 1;
          return { ...p, stage: newStage, stepIndex: newIndex > 0 ? newIndex : p.stepIndex };
        }
        return p;
      })
    );
    if (
      (newStage === 'Completed' || newStage === 'Maintenance') &&
      targetProj &&
      !maintenancePlans.some((m) => m.projectId === projectId)
    ) {
      const nextYear = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
      const sixMonths = new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0];
      const autoPlan: MaintenancePlan = {
        id: 'maint-' + Date.now().toString().slice(-4),
        projectId: targetProj.id,
        projectName: targetProj.name,
        clientName: targetProj.clientName,
        warrantyEndDate: nextYear,
        packageType: 'Standard 12-Month',
        lastServiceDate: new Date().toISOString().split('T')[0],
        nextServiceDate: sixMonths,
        owner: targetProj.owner,
        annualValue: 2200,
        status: 'Scheduled',
        notes: 'Auto-created 12-month warranty and 6-month aftercare inspection upon project completion.',
      };
      setMaintenancePlans((prev) => [autoPlan, ...prev]);
      addAuditLog(
        currentRole,
        'Created',
        `MAINT (${targetProj.code})`,
        'Auto-generated 12-month warranty & maintenance follow-up upon project completion',
        'green'
      );
      showToast(
        `Project completed! 12-Month Warranty & Aftercare Plan auto-created for ${targetProj.name}`,
        'success'
      );
      return;
    }
    addAuditLog(currentRole, 'Updated', projectId, `Stage updated to ${newStage}`, 'blue');
    showToast(`Project stage transitioned to "${newStage}"`, 'info');
  };

  const addQuotation = (quote: Partial<Quotation>) => {
    const count = quotations.length + 1;
    const ref = quote.type === 'Enhancement' ? `EN-${count.toString().padStart(3, '0')} / QT-ADD-${count.toString().padStart(2, '0')}` : `QT-2026-${count.toString().padStart(3, '0')}`;
    const newQuote: Quotation = {
      id: 'qt-' + count.toString().padStart(3, '0'),
      reference: ref,
      projectId: quote.projectId || 'proj-001',
      projectName: quote.projectName || 'The Alder Restaurant',
      clientName: quote.clientName || 'North & Co.',
      version: 'v1',
      type: quote.type || 'Original',
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'Awaiting Approval',
      isLocked: false,
      subtotal: quote.subtotal || 15000,
      discountPercentage: 0,
      vatRate: 20,
      deliveryCost: quote.deliveryCost || 500,
      installationCost: quote.installationCost || 1500,
      totalAmount: quote.totalAmount || 17000,
      marginPercentage: 35,
      notes: quote.notes || '',
      lineItems: quote.lineItems || [],
    };
    setQuotations((prev) => [newQuote, ...prev]);
    addAuditLog(currentRole, 'Created', ref, `Quotation ${ref} drafted`, 'blue');
    showToast(`Quotation ${ref} created`, 'success');
  };

  const approveQuotation = (id: string) => {
    const targetQuote = quotations.find((q) => q.id === id);
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status: 'Approved',
            isLocked: true,
            approvedDate: new Date().toISOString().split('T')[0],
            approvedBy: currentRole,
          };
        }
        return q;
      })
    );
    if (targetQuote && !targetQuote.isLocked && targetQuote.type === 'Enhancement') {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === targetQuote.projectId
            ? {
                ...p,
                enhancementValue: p.enhancementValue + targetQuote.totalAmount,
                settledValue: p.settledValue + targetQuote.totalAmount,
              }
            : p
        )
      );
    }
    addAuditLog(currentRole, 'Approved', id, 'Quotation version approved and locked', 'green');
    showToast(`Quotation approved and locked against alterations`, 'success');
  };

  const addDocument = (doc: Partial<ProjectDocument>) => {
    const newDoc: ProjectDocument = {
      id: 'doc-' + Date.now().toString().slice(-4),
      projectId: doc.projectId || 'proj-001',
      projectName: doc.projectName || 'The Alder Restaurant',
      title: doc.title || 'Project Specification Document',
      fileName: doc.fileName || 'spec_document.pdf',
      fileSize: doc.fileSize || '3.2 MB',
      type: doc.type || 'Drawing',
      version: doc.version || 'v1',
      isCurrent: true,
      isApproved: doc.isApproved || false,
      approvalStatus: doc.approvalStatus || 'Pending',
      uploadedBy: currentRole,
      uploadedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      tags: doc.tags || ['Drawing'],
    };
    setDocuments((prev) => [
      newDoc,
      ...prev.map((existing) =>
        existing.projectId === newDoc.projectId && existing.type === newDoc.type && newDoc.isCurrent
          ? { ...existing, isCurrent: false }
          : existing
      ),
    ]);
    addAuditLog(currentRole, 'Uploaded', newDoc.title, `Uploaded version ${newDoc.version} (retained previous versions)`, 'gray');
    showToast(`Document "${newDoc.title}" (${newDoc.version}) uploaded & previous versions retained`, 'success');
  };

  const addPayment = (item: Partial<PaymentScheduleItem>) => {
    const newPay: PaymentScheduleItem = {
      id: 'pay-' + Date.now().toString().slice(-4),
      projectId: item.projectId || 'proj-001',
      projectName: item.projectName || 'The Alder Restaurant',
      clientName: item.clientName || 'North & Co.',
      invoiceRef: item.invoiceRef || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      stage: item.stage || 'Production Stage',
      invoiceDate: item.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: item.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      amount: item.amount || 5000,
      receivedAmount: item.receivedAmount || 0,
      status: item.status || 'Upcoming',
      notes: item.notes || '',
    };
    setPayments((prev) => [newPay, ...prev]);
    addAuditLog(currentRole, 'Created', newPay.invoiceRef, `Payment milestone schedule added (£${newPay.amount.toLocaleString()})`, 'blue');
    showToast(`Payment item ${newPay.invoiceRef} recorded`, 'success');
  };

  const markPaymentPaid = (id: string, partialAmount?: number) => {
    const targetPay = payments.find((p) => p.id === id);
    if (!targetPay) return;
    const delta =
      partialAmount !== undefined
        ? partialAmount
        : targetPay.amount - targetPay.receivedAmount;
    const nextReceived = Math.min(targetPay.amount, targetPay.receivedAmount + delta);
    const isFull = nextReceived >= targetPay.amount;

    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: isFull ? 'Paid' : 'Part Paid',
            receivedAmount: nextReceived,
            receivedDate: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );

    if (delta > 0) {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === targetPay.projectId
            ? { ...proj, receivedValue: proj.receivedValue + delta }
            : proj
        )
      );
      setClients((prev) =>
        prev.map((cl) =>
          cl.name === targetPay.clientName
            ? {
                ...cl,
                totalReceived: cl.totalReceived + delta,
                totalOutstanding: Math.max(0, cl.totalOutstanding - delta),
              }
            : cl
        )
      );
    }

    addAuditLog(
      currentRole,
      'Payment',
      targetPay.invoiceRef,
      isFull ? `Payment £${delta.toLocaleString()} marked as fully received` : `Part payment of £${delta.toLocaleString()} recorded`,
      'green'
    );
    showToast(
      isFull ? `Payment ${targetPay.invoiceRef} marked as paid in full` : `Part payment of £${delta.toLocaleString()} recorded`,
      'success'
    );
  };

  const addSourcedProduct = (item: Partial<SourcedProduct>) => {
    const newItem: SourcedProduct = {
      id: 'sp-' + Date.now().toString().slice(-4),
      projectId: item.projectId || 'proj-001',
      projectName: item.projectName || 'The Alder Restaurant',
      vendorId: item.vendorId || 'ven-001',
      vendorName: item.vendorName || 'Oakline Supplies Ltd',
      description: item.description || 'Bespoke Joinery Component',
      specification: item.specification || 'Standard specification',
      quantity: item.quantity || 10,
      unit: item.unit || 'units',
      unitCost: item.unitCost || 50,
      totalCost: (item.quantity || 10) * (item.unitCost || 50),
      poNumber: item.poNumber || `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      expectedDelivery: item.expectedDelivery || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      status: item.status || 'Ordered',
      notes: item.notes || '',
    };
    setSourcedProducts((prev) => [newItem, ...prev]);
    showToast(`Sourced item "${newItem.description}" logged`, 'success');
  };

  const addPurchaseOrder = (po: Partial<PurchaseOrder>) => {
    const count = purchaseOrders.length + 1;
    const num = `PO-2026-${count.toString().padStart(3, '0')}`;
    const newPO: PurchaseOrder = {
      id: 'po-' + count.toString().padStart(3, '0'),
      poNumber: num,
      projectId: po.projectId || 'proj-001',
      projectName: po.projectName || 'The Alder Restaurant',
      vendorId: po.vendorId || 'ven-001',
      vendorName: po.vendorName || 'Oakline Supplies Ltd',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: po.expectedDelivery || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      totalAmount: po.totalAmount || 1500,
      status: 'Approved',
      itemsCount: po.itemsCount || 1,
      itemsList: po.itemsList || 'Materials and joinery components',
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    addAuditLog(currentRole, 'Created', num, `Purchase order issued to ${newPO.vendorName}`, 'blue');
    showToast(`Purchase order ${num} generated`, 'success');
  };

  const addVendor = (vendor: Partial<Vendor>) => {
    const newV: Vendor = {
      id: 'ven-' + Date.now().toString().slice(-4),
      name: vendor.name || 'New Supplier Ltd',
      category: vendor.category || 'Timber',
      contactPerson: vendor.contactPerson || 'Contact Name',
      email: vendor.email || 'sales@supplier.co.uk',
      phone: vendor.phone || '+44 20 7946 0000',
      location: vendor.location || 'London, UK',
      paymentTerms: vendor.paymentTerms || '30 days net',
      leadTimeDays: vendor.leadTimeDays || 14,
      openOrdersCount: 0,
      rating: 5.0,
      defectsCount: 0,
      notes: vendor.notes || '',
    };
    setVendors((prev) => [newV, ...prev]);
    showToast(`Vendor "${newV.name}" added`, 'success');
  };

  const addMilestone = (ms: Partial<Milestone>) => {
    const newMs: Milestone = {
      id: 'ms-' + Date.now().toString().slice(-4),
      projectId: ms.projectId || 'proj-001',
      projectName: ms.projectName || 'The Alder Restaurant',
      title: ms.title || 'New Delivery Milestone',
      owner: ms.owner || 'James Wilson',
      dueDate: ms.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      dependency: ms.dependency,
      status: 'Not started',
      priority: ms.priority || 'Normal',
      progressPercent: 0,
      notes: ms.notes || '',
    };
    setMilestones((prev) => [newMs, ...prev]);
    showToast(`Milestone "${newMs.title}" scheduled`, 'success');
  };

  const toggleMilestoneStatus = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const isDone = m.status === 'Completed';
          return {
            ...m,
            status: isDone ? 'In progress' : 'Completed',
            progressPercent: isDone ? 50 : 100,
            completedDate: isDone ? undefined : new Date().toISOString().split('T')[0],
          };
        }
        return m;
      })
    );
    showToast(`Milestone status updated`, 'info');
  };

  const addTask = (task: Partial<TaskItem>) => {
    const newTask: TaskItem = {
      id: 'tsk-' + Date.now().toString().slice(-4),
      projectId: task.projectId || 'proj-001',
      milestoneId: task.milestoneId,
      title: task.title || 'Site Action Item',
      owner: task.owner || 'James Wilson',
      dueDate: task.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'To Do',
      priority: task.priority || 'Normal',
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" assigned`, 'success');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = t.status === 'Done' ? 'In Progress' : t.status === 'In Progress' ? 'Done' : 'In Progress';
          return { ...t, status: next };
        }
        return t;
      })
    );
    showToast(`Task updated`, 'info');
  };

  const sendEmailReply = (threadId: string, replyText: string) => {
    setEmails((prev) =>
      prev.map((em) => {
        if (em.id === threadId) {
          const newReply = {
            id: 'rep-' + Date.now(),
            fromName: currentRole,
            fromEmail: 'sarah@amrfrntr.co.uk',
            date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            message: replyText,
          };
          return {
            ...em,
            needsReply: false,
            replies: [...(em.replies || []), newReply],
          };
        }
        return em;
      })
    );
    addAuditLog(currentRole, 'Updated', threadId, 'Email reply sent in thread', 'blue');
    showToast(`Reply dispatched to thread`, 'success');
  };

  const composeEmail = (newEmail: Partial<EmailThread>) => {
    const em: EmailThread = {
      id: 'em-' + Date.now().toString().slice(-4),
      projectId: newEmail.projectId || 'proj-001',
      projectName: newEmail.projectName || 'The Alder Restaurant',
      clientName: newEmail.clientName || 'North & Co.',
      fromName: currentRole,
      fromEmail: 'sarah@amrfrntr.co.uk',
      toEmail: newEmail.toEmail || 'client@example.co.uk',
      ccEmail: newEmail.ccEmail,
      subject: newEmail.subject || 'Project Update',
      date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      snippet: (newEmail.body || '').substring(0, 60) + '...',
      body: newEmail.body || '',
      unread: false,
      needsReply: false,
      replies: [],
    };
    setEmails((prev) => [em, ...prev]);
    showToast(`Email sent to ${em.toEmail}`, 'success');
  };

  const addCallLog = (log: Partial<CallMeetingLog>) => {
    const newLog: CallMeetingLog = {
      id: 'cml-' + Date.now().toString().slice(-4),
      projectId: log.projectId || 'proj-001',
      projectName: log.projectName || 'The Alder Restaurant',
      contactName: log.contactName || 'Client Contact',
      type: log.type || 'Phone Call',
      dateTime: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      summary: log.summary || '',
      actionOwner: log.actionOwner || 'Sarah Mitchell',
      followUpDate: log.followUpDate,
    };
    setCallLogs((prev) => [newLog, ...prev]);
    showToast(`Communication log added to timeline`, 'success');
  };

  const addPhoto = (photo: Partial<ProjectPhoto>) => {
    const newPh: ProjectPhoto = {
      id: 'ph-' + Date.now().toString().slice(-4),
      projectId: photo.projectId || 'proj-001',
      projectName: photo.projectName || 'The Alder Restaurant',
      category: photo.category || 'Installation',
      caption: photo.caption || 'Project visual archive photo',
      uploadedBy: currentRole,
      uploadedAt: new Date().toISOString().split('T')[0],
      tags: photo.tags || ['Joinery', 'Site'],
      visibility: photo.visibility || 'Portfolio / Public',
      imageUrl: photo.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    };
    setPhotos((prev) => [newPh, ...prev]);
    showToast(`Photo added to project gallery`, 'success');
  };

  const addDefect = (def: Partial<DefectItem>) => {
    const count = defects.length + 1;
    const code = `DEF-${count.toString().padStart(4, '0')}`;
    const newDef: DefectItem = {
      id: 'def-' + count.toString().padStart(3, '0'),
      code,
      projectId: def.projectId || 'proj-001',
      projectName: def.projectName || 'The Alder Restaurant',
      issue: def.issue || 'Defect item identified',
      description: def.description || '',
      linkedProduct: def.linkedProduct,
      vendorName: def.vendorName,
      poNumber: def.poNumber,
      severity: def.severity || 'Medium',
      owner: def.owner || 'James Wilson',
      loggedDate: new Date().toISOString().split('T')[0],
      replacementTargetDate: def.replacementTargetDate,
      costImpact: def.costImpact || 0,
      status: 'Investigating',
      rootCause: def.rootCause,
      supplierResponse: def.supplierResponse,
    };
    setDefects((prev) => [newDef, ...prev]);
    addAuditLog(currentRole, 'Created', code, `Defect logged for ${newDef.projectName}`, 'amber');
    showToast(`Defect ${code} logged and assigned to ${newDef.owner}`, 'warning');
  };

  const resolveDefect = (id: string) => {
    setDefects((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return { ...d, status: 'Resolved' };
        }
        return d;
      })
    );
    showToast(`Defect marked as resolved`, 'success');
  };

  const addMaintenancePlan = (plan: Partial<MaintenancePlan>) => {
    const newPlan: MaintenancePlan = {
      id: 'maint-' + Date.now().toString().slice(-4),
      projectId: plan.projectId || 'proj-001',
      projectName: plan.projectName || 'The Alder Restaurant',
      clientName: plan.clientName || 'North & Co.',
      warrantyEndDate: plan.warrantyEndDate || '2027-11-28',
      packageType: plan.packageType || 'Annual Care Contract',
      nextServiceDate: plan.nextServiceDate || '2027-05-01',
      owner: plan.owner || 'Sarah Mitchell',
      annualValue: plan.annualValue || 2000,
      status: 'Scheduled',
      notes: plan.notes || '',
    };
    setMaintenancePlans((prev) => [newPlan, ...prev]);
    showToast(`Maintenance plan created for ${newPlan.clientName}`, 'success');
  };

  const addUser = (usr: Partial<UserRole>) => {
    const newUser: UserRole = {
      id: 'usr-' + Date.now().toString().slice(-4),
      name: usr.name || 'New Team Member',
      email: usr.email || 'team@amrfrntr.co.uk',
      role: usr.role || 'UK Project Manager / Sales',
      assignedScope: usr.assignedScope || 'Assigned fit-out projects',
      lastActive: 'Invited',
      status: 'Active',
      avatarInitials: (usr.name || 'NT')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };
    setUsers((prev) => [newUser, ...prev]);
    showToast(`User invitation issued to ${newUser.email}`, 'success');
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addAuditLog(currentRole, 'Updated', id, 'Client profile updated', 'blue');
    showToast('Client profile updated successfully', 'success');
  };

  const addClientContact = (clientId: string, contact: Omit<ContactPerson, 'id'>) => {
    const newCon: ContactPerson = {
      ...contact,
      id: 'con-' + Date.now(),
    };
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, contacts: [...c.contacts, newCon] } : c))
    );
    showToast(`Contact "${contact.name}" added to client directory`, 'success');
  };

  const approveDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, isApproved: true, approvalStatus: 'Approved', isCurrent: true }
          : d
      )
    );
    addAuditLog(currentRole, 'Approved', id, 'Document / Drawing marked Approved & Locked', 'green');
    showToast('Document / Drawing marked as Approved & Locked', 'success');
  };

  const reassignEmail = (threadId: string, newProjectId: string) => {
    const proj = projects.find((p) => p.id === newProjectId);
    if (!proj) return;
    setEmails((prev) =>
      prev.map((em) =>
        em.id === threadId
          ? { ...em, projectId: proj.id, projectName: proj.name, clientName: proj.clientName }
          : em
      )
    );
    addAuditLog(currentRole, 'Updated', threadId, `Email reassigned to ${proj.code} (${proj.name})`, 'blue');
    showToast(`Email thread reassigned to ${proj.code} · ${proj.name}`, 'success');
  };

  const sendWhatsAppMessage = (threadId: string, text: string, isInternalNote = false) => {
    setWhatsappThreads((prev) =>
      prev.map((th) => {
        if (th.id === threadId) {
          const newMsg = {
            id: 'wam-' + Date.now(),
            sender: isInternalNote ? `${currentRole} (Internal Note)` : currentRole,
            isInternalNote,
            isOutbound: true,
            timestamp: new Date().toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            text,
            status: 'Delivered' as const,
          };
          return {
            ...th,
            lastUpdated: newMsg.timestamp,
            unreadCount: 0,
            messages: [...th.messages, newMsg],
          };
        }
        return th;
      })
    );
    showToast(isInternalNote ? 'Internal note added to thread' : 'WhatsApp Business message sent', 'success');
  };

  const addVendorPayment = (vp: Partial<VendorPayment>) => {
    const newVP: VendorPayment = {
      id: 'vp-' + Date.now().toString().slice(-4),
      poNumber: vp.poNumber || 'PO-2026-018',
      vendorId: vp.vendorId || 'ven-001',
      vendorName: vp.vendorName || 'Oakline Supplies Ltd',
      projectId: vp.projectId || 'proj-001',
      projectName: vp.projectName || 'The Alder Restaurant',
      invoiceRef: vp.invoiceRef || `SUP-INV-${Math.floor(100 + Math.random() * 900)}`,
      dueDate: vp.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      amount: vp.amount || 1500,
      paidAmount: vp.paidAmount || 0,
      status: vp.status || 'Scheduled',
    };
    setVendorPayments((prev) => [newVP, ...prev]);
    addAuditLog(currentRole, 'Created', newVP.invoiceRef, `Vendor payment scheduled (£${newVP.amount.toLocaleString()})`, 'blue');
    showToast(`Vendor payment ${newVP.invoiceRef} scheduled`, 'success');
  };

  const markVendorPaymentPaid = (id: string) => {
    setVendorPayments((prev) =>
      prev.map((vp) => (vp.id === id ? { ...vp, paidAmount: vp.amount, status: 'Paid' } : vp))
    );
    addAuditLog(currentRole, 'Payment', id, 'Vendor invoice settled via BACS', 'green');
    showToast('Vendor invoice marked as Paid', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        projects,
        quotations,
        documents,
        payments,
        vendors,
        sourcedProducts,
        purchaseOrders,
        milestones,
        tasks,
        emails,
        callLogs,
        photos,
        defects,
        maintenancePlans,
        users,
        auditLogs,
        whatsappThreads,
        vendorPayments,
        isAuthenticated,
        login,
        logout,
        currentRole,
        setCurrentRole,
        permissions,
        searchQuery,
        setSearchQuery,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isQuickActionOpen,
        setIsQuickActionOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        toasts,
        showToast,
        dismissToast,
        addClient,
        updateClient,
        addClientContact,
        addProject,
        updateProjectStage,
        addQuotation,
        approveQuotation,
        addDocument,
        approveDocument,
        addPayment,
        markPaymentPaid,
        addSourcedProduct,
        addPurchaseOrder,
        addVendor,
        addMilestone,
        toggleMilestoneStatus,
        addTask,
        toggleTaskStatus,
        sendEmailReply,
        composeEmail,
        reassignEmail,
        sendWhatsAppMessage,
        addCallLog,
        addPhoto,
        addDefect,
        resolveDefect,
        addMaintenancePlan,
        addUser,
        addVendorPayment,
        markVendorPaymentPaid,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

