# AMR FRNTR – Furniture & Fit-Out ERP Platform

A comprehensive, production-quality enterprise ERP and project operations platform built for UK luxury and commercial furniture fit-out businesses.

---

## 🏛 Architecture & Tech Stack

- **Framework:** Next.js 15+ with App Router
- **UI Runtime:** React 19
- **Type Safety:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS with custom AMR FRNTR design tokens
- **Icons:** Lucide React
- **Animations:** Framer Motion & CSS keyframe transitions
- **Architecture:** Modular component architecture with centralized reactive mock data store (`AppContext`)
- **State & Storage:** In-memory reactive React Context with local CRUD mutations for all ERP entities

---

## 🎨 Design System & Palette

- **Deep Brand Navy:** `#17243b` (Sidebar & Dark Buttons), `#223653` (Sub-elements)
- **Craftsmanship Gold / Brass:** `#d5b27a` & `#f1dfbd` (AMR badge gradient, accents)
- **Action Royal Blue:** `#4268e8` (Primary buttons, active tabs, highlights), `#edf1ff` (Soft backgrounds)
- **Semantic Status Badges:**
  - **Healthy / Approved / Settled:** `#16845f` on `#e8f7f0`
  - **At Risk / In Progress / Pending:** `#b7791f` on `#fff4df`
  - **Critical / Overdue / Delayed:** `#c84c58` on `#ffeaec`
- **Canvas & Elevation:** Canvas `#f5f7fa`, Pure White `#ffffff` cards with subtle borders `#e8edf3` and soft ambient enterprise shadows.

---

## 📁 System Module Map

```
src/
├── app/
│   ├── layout.tsx                # Enterprise Shell Layout (Sidebar, Topbar, Global Modals, Toasts)
│   ├── page.tsx                  # Dashboard: Management overview, KPI cards, portfolio by stage, attention items
│   ├── clients/
│   │   ├── page.tsx              # Clients Master Grid, commercial balance totals, search/filters, Add Client modal
│   │   └── [id]/page.tsx         # Client 360 Workspace: multi-contact directory, project history, payment ledger
│   ├── projects/
│   │   ├── page.tsx              # Projects Portfolio: health states, commercial values, stages, Create Project modal
│   │   └── [id]/page.tsx         # Unified Project Workspace (10 interactive tabs):
│   │                             # 1. Overview (progress stepper, quick actions, commercial summary)
│   │                             # 2. Quotations & Add-ons (version history, locked approved baseline)
│   │                             # 3. Controlled Drawings & Documents (revisions v1/v2/v3, previews)
│   │                             # 4. Payments Ledger (milestone billing, deposit/production/final)
│   │                             # 5. Sourcing & Purchase Orders (RFQ, ordered, shipped, delivered)
│   │                             # 6. Milestones & Site Tasks (dependency tracking, completion toggles)
│   │                             # 7. Communications Hub (in-thread Gmail-style replies, attachments)
│   │                             # 8. Visual Project Gallery (stage categorization, lightbox)
│   │                             # 9. Defects & Snagging (root cause, supplier response, cost impact)
│   │                             # 10. Chronological Activity Timeline (audit trail)
│   ├── quotations/
│   │   ├── page.tsx              # Quotations Ledger & Add-on variation orders manager
│   │   └── [id]/page.tsx         # Interactive Quotation Detail with formal printable/downloadable PDF view
│   ├── documents/
│   │   └── page.tsx              # Controlled Drawing & Specification Repository with drag-and-drop uploader
│   ├── payments/
│   │   └── page.tsx              # Commercial Cash Flow, Milestone Payment Schedules & Invoices
│   ├── procurement/
│   │   └── page.tsx              # Sourced Materials, Purchase Orders & Supplier Chase Alerts
│   ├── vendors/
│   │   └── page.tsx              # Supplier Network Directory, ratings, lead times & defect counts
│   ├── milestones/
│   │   └── page.tsx              # Delivery Milestones, Task Dependencies, and Gantt progress
│   ├── communications/
│   │   └── page.tsx              # Email Inbox & Thread Viewer with telephone and site meeting logging
│   ├── gallery/
│   │   └── page.tsx              # Multi-Stage Project Photo Gallery & Lightbox
│   ├── defects/
│   │   └── page.tsx              # Snagging & Quality Defect Tracker linked to POs and Suppliers
│   ├── maintenance/
│   │   └── page.tsx              # Aftercare, Warranties, Service Packages & Opportunity Pipeline
│   ├── reports/
│   │   └── page.tsx              # Business Intelligence, Monthly Cash Inflow Forecasts & Performance Charts
│   ├── users/
│   │   └── page.tsx              # Role-Based Access Control (Admin, UK PM, India Coordinator, Procurement, etc.)
│   └── settings/
│       └── page.tsx              # System Config, Audit Logs, Integration Status (Gmail/M365/S3)
├── components/
│   ├── layout/                   # Sidebar, Topbar, GlobalSearchModal, QuickActionModal, NotificationDrawer
│   ├── ui/                       # Badge, Button, Modal, StatCard, ToastContainer
│   └── ...
├── context/
│   └── AppContext.tsx            # Central state management with full CRUD mutations & local persistence
├── data/
│   └── mockData.ts               # Realistic UK luxury & commercial fit-out business dataset
└── types/
    └── index.ts                  # Comprehensive TypeScript interfaces
```

---

## 🔄 12-Stage Controlled Project Lifecycle

1. **Lead / Enquiry**
2. **Quotation**
3. **Awaiting Client Approval**
4. **Approved**
5. **Design / Drawing**
6. **Sourcing**
7. **Production**
8. **Delivery**
9. **Installation**
10. **Snagging**
11. **Completed**
12. **Maintenance & Warranty**

*(Also supports `On Hold` and `Cancelled`)*

---

## 🚀 Running the Platform

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run TypeScript type check
node node_modules/typescript/bin/tsc --noEmit

# Build production bundle
npm run build
```

