export type ProjectHealth = 'green' | 'amber' | 'red';

export type ProjectStage =
  | 'Lead / Enquiry'
  | 'Quotation'
  | 'Awaiting Client Approval'
  | 'Approved'
  | 'Design / Drawing'
  | 'Sourcing'
  | 'Production'
  | 'Delivery'
  | 'Installation'
  | 'Snagging'
  | 'Completed'
  | 'Maintenance'
  | 'On Hold'
  | 'Cancelled';

export type PriorityLevel = 'Normal' | 'High' | 'Urgent';

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary?: boolean;
}

export interface Client {
  id: string;
  code: string; // e.g. CL-0018
  name: string;
  type: string; // Hospitality group, Commercial Office, High-End Residential
  location: string;
  accountManager: string;
  status: 'Active' | 'Archived' | 'Lead';
  contacts: ContactPerson[];
  totalSettledValue: number;
  totalReceived: number;
  totalOutstanding: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
}

export interface QuotationLineItem {
  id: string;
  description: string;
  specification?: string;
  quantity: number;
  unit: string; // units, linear meters, sq ft, sets
  unitPrice: number;
  internalCost?: number;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  reference: string; // QT-2026-001
  projectId: string;
  projectName: string;
  clientName: string;
  version: string; // v1, v2
  type: 'Original' | 'Enhancement';
  date: string;
  approvedDate?: string;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Awaiting Approval' | 'Approved' | 'Settled' | 'Rejected';
  isLocked: boolean;
  lineItems: QuotationLineItem[];
  subtotal: number;
  discountPercentage: number;
  vatRate: number; // usually 20% UK
  deliveryCost: number;
  installationCost: number;
  totalAmount: number;
  marginPercentage?: number;
  notes?: string;
  approvedBy?: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  fileName: string;
  fileSize: string;
  type: 'Drawing' | 'Quotation' | 'Purchase Order' | 'Invoice' | 'Site Survey' | 'Approval' | 'Warranty' | 'Specification';
  version: string; // v1, v2, v3
  isCurrent: boolean;
  isApproved: boolean;
  approvalStatus: 'Approved' | 'Pending' | 'Internal' | 'Rejected';
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  fileUrl?: string;
}

export interface PaymentScheduleItem {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  invoiceRef: string; // INV-1001
  stage: 'Deposit 30%' | 'Production Stage' | 'Delivery Stage' | 'Installation Stage' | 'Final Payment' | 'Enhancement 1' | 'Enhancement 2';
  invoiceDate: string;
  dueDate: string;
  receivedDate?: string;
  amount: number;
  receivedAmount: number;
  status: 'Paid' | 'Part Paid' | 'Upcoming' | 'Invoiced' | 'Overdue' | 'Planned';
  paymentMethod?: string;
  notes?: string;
}

export type ProcurementStatus =
  | 'RFQ'
  | 'Quote Received'
  | 'Approved'
  | 'Ordered'
  | 'In Production'
  | 'Ready'
  | 'Shipped'
  | 'Delivered'
  | 'Delayed'
  | 'Defective'
  | 'Cancelled';

export interface SourcedProduct {
  id: string;
  projectId: string;
  projectName: string;
  vendorId: string;
  vendorName: string;
  description: string;
  specification: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  poNumber: string; // PO-2026-018
  orderDate?: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: ProcurementStatus;
  nextFollowUp?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // PO-2026-014
  projectId: string;
  projectName: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'In Production' | 'Delivered' | 'Delayed' | 'Cancelled';
  itemsCount: number;
  itemsList: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Timber' | 'Upholstery' | 'Metalwork' | 'Finishes & Lacquer' | 'Joinery Hardware' | 'Subcontractor';
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  paymentTerms: string; // e.g. "30 days"
  leadTimeDays: number;
  openOrdersCount: number;
  rating: number; // e.g. 4.8
  defectsCount: number;
  notes?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  owner: string;
  dueDate: string;
  completedDate?: string;
  dependency?: string;
  status: 'Not started' | 'In progress' | 'Waiting' | 'Completed' | 'Overdue';
  priority: PriorityLevel;
  progressPercent: number;
  notes?: string;
}

export interface TaskItem {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  owner: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: PriorityLevel;
}

export interface EmailThread {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  fromName: string;
  fromEmail: string;
  toEmail: string;
  ccEmail?: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  unread: boolean;
  needsReply: boolean;
  attachments?: { name: string; size: string }[];
  replies?: {
    id: string;
    fromName: string;
    fromEmail: string;
    date: string;
    message: string;
  }[];
}

export interface CallMeetingLog {
  id: string;
  projectId: string;
  projectName: string;
  contactName: string;
  type: 'Phone Call' | 'Site Meeting' | 'Teams Meeting' | 'Workshop Visit';
  dateTime: string;
  summary: string;
  actionOwner: string;
  followUpDate?: string;
}

export type GalleryCategory = 'Before' | 'Design' | 'Manufacturing' | 'Delivery' | 'Installation' | 'Final';

export interface ProjectPhoto {
  id: string;
  projectId: string;
  projectName: string;
  category: GalleryCategory;
  caption: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  visibility: 'Portfolio / Public' | 'Internal';
  imageUrl: string;
}

export interface DefectItem {
  id: string;
  code: string; // DEF-0018
  projectId: string;
  projectName: string;
  issue: string;
  description: string;
  linkedProduct?: string;
  vendorName?: string;
  poNumber?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  owner: string;
  loggedDate: string;
  replacementTargetDate?: string;
  costImpact: number;
  status: 'New' | 'Investigating' | 'Supplier Contacted' | 'Replacement Awaited' | 'Resolved' | 'Closed';
  rootCause?: string;
  supplierResponse?: string;
}

export interface MaintenancePlan {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  warrantyEndDate: string;
  packageType: 'Standard 12-Month' | 'Annual Care Contract' | 'Bi-Annual Commercial Inspection' | 'Bespoke Fit-Out Care';
  lastServiceDate?: string;
  nextServiceDate: string;
  owner: string;
  annualValue: number;
  status: 'Scheduled' | 'Follow-up due' | 'Under Review' | 'Active' | 'Completed';
  notes?: string;
}

export interface Project {
  id: string;
  code: string; // FFC-2026-001
  name: string;
  clientId: string;
  clientName: string;
  siteAddress: string;
  owner: string; // e.g. Sarah Mitchell (UK PM)
  coordinator: string; // e.g. Arjun Mehta (India Coordinator)
  stage: ProjectStage;
  health: ProjectHealth;
  priority: PriorityLevel;
  approvedValue: number;
  enhancementValue: number;
  settledValue: number;
  receivedValue: number;
  targetCompletion: string;
  startDate: string;
  description: string;
  stepIndex: number; // 1 to 12
  tags: string[];
}

export interface UserRole {
  id: string;
  name: string;
  email: string;
  role:
    | 'Administrator / Director'
    | 'UK Project Manager / Sales'
    | 'India Project Coordinator'
    | 'Procurement / Sourcing'
    | 'Finance'
    | 'Workshop / Production'
    | 'Installer'
    | 'Management Read-only'
    | 'Client Portal';
  assignedScope: string;
  lastActive: string;
  status: 'Active' | 'Inactive';
  avatarInitials: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: 'Created' | 'Updated' | 'Approved' | 'Deleted' | 'Uploaded' | 'Payment';
  record: string;
  details: string;
  badgeColor: 'blue' | 'green' | 'amber' | 'red' | 'gray';
}

export interface WhatsAppMessage {
  id: string;
  sender: string;
  isInternalNote?: boolean;
  isOutbound: boolean;
  timestamp: string;
  text: string;
  attachment?: string;
  status: 'Sent' | 'Delivered' | 'Read';
}

export interface WhatsAppThread {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  contactName: string;
  contactPhone: string;
  lastUpdated: string;
  unreadCount: number;
  messages: WhatsAppMessage[];
}

export interface VendorPayment {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  invoiceRef: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'Scheduled' | 'Part Paid' | 'Paid' | 'Overdue';
}

export interface RolePermissions {
  canViewCostsAndMargins: boolean;
  canViewInternalNotes: boolean;
  canEdit: boolean;
  canApprove: boolean;
  canManageUsers: boolean;
  isClientPortal: boolean;
  isReadOnly: boolean;
  defaultDashboard: 'management' | 'pm' | 'india' | 'procurement' | 'finance';
}


