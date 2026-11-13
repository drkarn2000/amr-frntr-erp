'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle2,
  Lock,
  Building2,
  Mail,
  Calendar,
  FileCheck,
} from 'lucide-react';

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = (params?.id as string) || 'qt-001';

  const { quotations, approveQuotation, showToast } = useApp();

  const quote = quotations.find((q) => q.id === quoteId) || quotations[0];

  const handlePrint = () => {
    window.print();
  };

  const handleApprove = () => {
    approveQuotation(quote.id);
  };

  const vatAmount = quote.subtotal * (quote.vatRate / 100);

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <Link
          href="/quotations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7b8798] hover:text-[#17243b] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Quotations Ledger
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print Quotation
          </Button>
          <Button
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={() => showToast(`Quotation ${quote.reference} PDF downloaded`, 'success')}
          >
            Download PDF
          </Button>
          {!quote.isLocked ? (
            <Button
              variant="primary"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={handleApprove}
            >
              Approve & Lock Version
            </Button>
          ) : (
            <Badge variant="green" className="py-2 px-3 text-xs">
              <Lock className="w-3.5 h-3.5 mr-1" /> Approved & Locked
            </Badge>
          )}
        </div>
      </div>

      {/* Formal PDF Quotation Canvas */}
      <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-lg max-w-4xl mx-auto p-8 sm:p-12 print:border-none print:shadow-none print:p-0">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#e8edf3] pb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d5b27a] to-[#f1dfbd] flex items-center justify-center text-[#17243b] font-black text-base shadow-sm">
                AMR
              </div>
              <div>
                <h1 className="font-extrabold text-xl tracking-widest text-[#17243b]">
                  AMR FRNTR
                </h1>
                <div className="text-[10px] font-bold tracking-wider text-[#7b8798] uppercase">
                  Furniture & Fit-Out Specialists UK
                </div>
              </div>
            </div>
            <div className="text-xs text-[#64748b] mt-3 space-y-0.5">
              <p>AMR Furniture Ltd · 24 Berkeley Square</p>
              <p>London, W1J 6HE, United Kingdom</p>
              <p>VAT Reg: GB 942 8102 44 · Company No: 12948192</p>
              <p>enquiries@amrfrntr.co.uk · +44 20 7946 0900</p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-[10px] font-extrabold text-[#4268e8] tracking-widest uppercase block">
              COMMERCIAL QUOTATION
            </span>
            <div className="text-2xl font-black text-[#17243b]">{quote.reference}</div>
            <div className="text-xs font-bold text-[#7b8798]">Version: {quote.version}</div>
            <div className="text-xs text-[#64748b] pt-1">
              Date: <b className="text-[#17243b]">{quote.date}</b>
            </div>
            <div className="text-xs text-[#64748b]">
              Valid Until: <b className="text-[#17243b]">{quote.validUntil}</b>
            </div>
          </div>
        </div>

        {/* Client & Project Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#e8edf3]">
          <div>
            <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block mb-1">
              Quotation Prepared For
            </span>
            <div className="font-bold text-sm text-[#17243b]">{quote.clientName}</div>
            <div className="text-xs text-[#64748b] mt-1 space-y-0.5">
              <p>Attention: Olivia Hart / Development Team</p>
              <p>Central London Operations HQ</p>
              <p>United Kingdom</p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block mb-1">
              Project & Delivery Site
            </span>
            <div className="font-bold text-sm text-[#17243b]">{quote.projectName}</div>
            <div className="text-xs text-[#64748b] mt-1 space-y-0.5">
              <p>Site Address: Soho, London, W1D 6PJ</p>
              <p>Scope: Bespoke Banquettes, Smoked Oak Tables, Brass Trim</p>
              <p>Installation Window: Night shifts (22:00 – 06:00)</p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#17243b] text-[10px] font-extrabold text-[#17243b] uppercase tracking-wider">
                <th className="pb-3 w-10">Item</th>
                <th className="pb-3">Description & Specification</th>
                <th className="pb-3 text-center w-16">Qty</th>
                <th className="pb-3 text-center w-20">Unit</th>
                <th className="pb-3 text-right w-24">Unit Price</th>
                <th className="pb-3 text-right w-24">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {quote.lineItems.map((item, i) => (
                <tr key={item.id}>
                  <td className="py-3.5 text-[#7b8798] font-bold">{i + 1}</td>
                  <td className="py-3.5 pr-4">
                    <div className="font-bold text-[#17243b]">{item.description}</div>
                    {item.specification && (
                      <div className="text-[11px] text-[#64748b] mt-0.5">
                        {item.specification}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 text-center font-bold text-[#17243b]">{item.quantity}</td>
                  <td className="py-3.5 text-center text-[#64748b]">{item.unit}</td>
                  <td className="py-3.5 text-right text-[#475569]">
                    £{item.unitPrice.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right font-extrabold text-[#17243b]">
                    £{item.totalPrice.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Totals */}
        <div className="border-t border-[#e8edf3] pt-6 flex justify-end">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-[#64748b]">
              <span>Net Subtotal:</span>
              <span className="font-bold text-[#17243b]">£{quote.subtotal.toLocaleString()}</span>
            </div>

            {quote.deliveryCost > 0 && (
              <div className="flex justify-between text-[#64748b]">
                <span>Specialist Delivery & Logistics:</span>
                <span className="font-bold text-[#17243b]">£{quote.deliveryCost.toLocaleString()}</span>
              </div>
            )}

            {quote.installationCost > 0 && (
              <div className="flex justify-between text-[#64748b]">
                <span>On-Site Night Installation:</span>
                <span className="font-bold text-[#17243b]">
                  £{quote.installationCost.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between text-[#64748b]">
              <span>VAT (20% UK Standard):</span>
              <span className="font-bold text-[#17243b]">£{vatAmount.toFixed(2)}</span>
            </div>

            <div className="border-t-2 border-[#17243b] pt-2 flex justify-between text-base font-extrabold text-[#17243b]">
              <span>Grand Total:</span>
              <span>£{quote.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Commercial Terms & Client Signoff */}
        <div className="border-t border-[#e8edf3] mt-8 pt-6 space-y-6">
          <div>
            <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block mb-1">
              Payment Terms & Milestones
            </span>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Standard commercial schedule: 30% Deposit upon quotation acceptance; 30% upon workshop factory completion prior to dispatch; 20% commencement of installation; 20% final retention upon practical completion and snagging signoff.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#f1f5f9]">
            <div>
              <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block mb-6">
                Authorized AMR FRNTR Signatory
              </span>
              <div className="border-b border-[#cbd5e1] pb-1 font-bold text-xs text-[#17243b]">
                Sarah Mitchell
              </div>
              <div className="text-[10px] text-[#7b8798] mt-1">Lead UK Project Manager</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#7b8798] uppercase tracking-wider block mb-6">
                Client Acceptance & Signoff
              </span>
              <div className="border-b border-[#cbd5e1] pb-1 font-bold text-xs text-[#17243b]">
                {quote.approvedBy || 'Pending Client Signature'}
              </div>
              <div className="text-[10px] text-[#7b8798] mt-1">
                Authorized Signature · Date: {quote.approvedDate || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

