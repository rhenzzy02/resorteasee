import React, { useState } from 'react';
import { Reservation, PropertyUnit, FolioEntry } from '../types/resort';
import { X, CreditCard, PlusCircle, CheckCircle, Receipt, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  unit: PropertyUnit;
  folioEntries: FolioEntry[];
  onAddFolioCharge: (entry: Omit<FolioEntry, 'id'>) => void;
  onSettlePayment: (reservationId: string, amount: number, method: string) => void;
}

export const FolioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reservation,
  unit,
  folioEntries,
  onAddFolioCharge,
  onSettlePayment,
}) => {
  const [showAddCharge, setShowAddCharge] = useState(false);
  const [chargeCategory, setChargeCategory] = useState<'room' | 'amenity' | 'dining' | 'spa'>('dining');
  const [chargeDescription, setChargeDescription] = useState('');
  const [chargeAmount, setChargeAmount] = useState<number>(65);

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter entries for this reservation
  const entries = folioEntries.filter((f) => f.reservationId === reservation.id);

  const totalCharges = entries
    .filter((f) => !f.isCredit)
    .reduce((sum, f) => sum + f.amount, 0);

  const totalCredits = entries
    .filter((f) => f.isCredit)
    .reduce((sum, f) => sum + f.amount, 0);

  const taxAmount = Math.round(totalCharges * 0.12); // 12% resort & tourism tax
  const grandTotal = totalCharges + taxAmount;
  const netBalance = Math.max(0, grandTotal - totalCredits);

  const handleCreateCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chargeDescription || chargeAmount <= 0) return;

    onAddFolioCharge({
      reservationId: reservation.id,
      date: new Date().toISOString().split('T')[0],
      category: chargeCategory,
      description: chargeDescription,
      amount: Number(chargeAmount),
    });

    setChargeDescription('');
    setShowAddCharge(false);
  };

  const handleSettle = () => {
    const payAmt = paymentAmount > 0 ? paymentAmount : netBalance;
    if (payAmt <= 0) return;

    onSettlePayment(reservation.id, payAmt, paymentMethod);
    setShowPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-400" />
              <h2 className="text-base font-semibold tracking-tight">Guest Folio & Billing Statement</h2>
            </div>
            <div className="text-xs text-stone-300 mt-1 flex items-center gap-2">
              <span>{reservation.guestName}</span>
              <span>·</span>
              <span className="font-mono">{unit.code} ({unit.name})</span>
              <span>·</span>
              <span>Res #{reservation.confirmationCode}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Success Banner */}
          {showPaymentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Payment successfully posted and reconciled to guest folio.</span>
            </div>
          )}

          {/* Guest Stay Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block">Check-In</span>
              <span className="font-semibold text-stone-800">{reservation.checkInDate}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Check-Out</span>
              <span className="font-semibold text-stone-800">{reservation.checkOutDate}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Stay Duration</span>
              <span className="font-semibold text-stone-800">{reservation.totalNights} Night(s)</span>
            </div>
            <div>
              <span className="text-stone-500 block">Status</span>
              <span className="font-semibold text-teal-800 capitalize">{reservation.status.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                Itemized Charges & Credits
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCharge(!showAddCharge)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 hover:text-teal-900"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Charge</span>
              </button>
            </div>

            {/* Quick Add Charge Form */}
            {showAddCharge && (
              <form onSubmit={handleCreateCharge} className="p-3 bg-stone-100 rounded-lg border border-stone-200 space-y-2 mb-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-stone-600">Category</label>
                    <select
                      value={chargeCategory}
                      onChange={(e) => setChargeCategory(e.target.value as any)}
                      className="w-full p-1.5 text-xs border border-stone-300 rounded-md bg-white"
                    >
                      <option value="dining">In-Villa Dining</option>
                      <option value="amenity">Amenity / Pool</option>
                      <option value="spa">Spa & Wellness</option>
                      <option value="room">Room Charge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Sunset cocktails"
                      value={chargeDescription}
                      onChange={(e) => setChargeDescription(e.target.value)}
                      className="w-full p-1.5 text-xs border border-stone-300 rounded-md bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600">Amount ($)</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={chargeAmount}
                      onChange={(e) => setChargeAmount(Number(e.target.value))}
                      className="w-full p-1.5 text-xs border border-stone-300 rounded-md bg-white font-mono"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddCharge(false)}
                    className="px-2.5 py-1 text-xs text-stone-600 border border-stone-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-medium text-white bg-teal-800 rounded-md hover:bg-teal-700"
                  >
                    Post Charge
                  </button>
                </div>
              </form>
            )}

            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 border-b border-stone-200 font-medium">
                  <tr>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-stone-400">
                        No charges recorded yet.
                      </td>
                    </tr>
                  ) : (
                    entries.map((f) => (
                      <tr key={f.id} className="hover:bg-stone-50/60">
                        <td className="px-3 py-2 text-stone-500 font-mono text-[11px]">{f.date}</td>
                        <td className="px-3 py-2 capitalize font-medium text-stone-700">{f.category}</td>
                        <td className="px-3 py-2 text-stone-800">{f.description}</td>
                        <td
                          className={`px-3 py-2 text-right font-mono tabular-nums font-medium ${
                            f.isCredit ? 'text-emerald-700' : 'text-stone-900'
                          }`}
                        >
                          {f.isCredit ? `-$${f.amount.toLocaleString()}` : `$${f.amount.toLocaleString()}`}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Folio Financial Breakdown */}
          <div className="p-4 bg-stone-100 rounded-lg border border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal Services & Accommodations</span>
              <span className="font-mono tabular-nums font-medium text-stone-900">
                ${totalCharges.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Resort Tax & Environmental Surcharge (12%)</span>
              <span className="font-mono tabular-nums font-medium text-stone-900">
                ${taxAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Less Deposits & Applied Credits</span>
              <span className="font-mono tabular-nums font-medium text-emerald-700">
                -${totalCredits.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-semibold text-stone-900">
              <span>Outstanding Balance Due</span>
              <span className="font-mono tabular-nums text-teal-900 font-bold text-base">
                ${netBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Settle Balance Section */}
          {netBalance > 0 && (
            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
              <h4 className="text-xs font-semibold text-stone-800 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-teal-800" />
                <span>Process Payment Settlement</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-stone-600 mb-0.5">Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-1.5 text-xs border border-stone-300 rounded-md bg-white"
                  >
                    <option value="card">Credit Card (Terminal)</option>
                    <option value="cash">Cash Settlement</option>
                    <option value="transfer">Bank / Wire Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-stone-600 mb-0.5">Pay Amount ($)</label>
                  <input
                    type="number"
                    value={paymentAmount || netBalance}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full p-1.5 text-xs border border-stone-300 rounded-md bg-white font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleSettle}
                    className="w-full py-1.5 text-xs font-medium text-white bg-teal-800 hover:bg-teal-700 rounded-md shadow-xs transition-colors"
                  >
                    Post Settlement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-md px-3 py-1.5 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Folio Receipt</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
