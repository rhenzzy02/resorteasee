import React from 'react';
import { Reservation, PropertyUnit, AmenityBooking, FolioEntry } from '../types/resort';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  Calendar,
  Percent,
  Bed,
  Waves,
} from 'lucide-react';

interface Props {
  reservations: Reservation[];
  units: PropertyUnit[];
  amenityBookings: AmenityBooking[];
  folioEntries: FolioEntry[];
  onOpenFolio: (reservation: Reservation) => void;
}

export const FinancialReporting: React.FC<Props> = ({
  reservations,
  units,
  amenityBookings,
  folioEntries,
  onOpenFolio,
}) => {
  // Compute Key Hospitality Financial KPIs
  const totalRoomRevenue = reservations
    .filter((r) => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const totalAmenityRevenue = amenityBookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalFolioExtras = folioEntries
    .filter((f) => !f.isCredit && (f.category === 'dining' || f.category === 'spa'))
    .reduce((sum, f) => sum + f.amount, 0);

  const totalGrossRevenue = totalRoomRevenue + totalAmenityRevenue + totalFolioExtras;

  // Occupancy rate calculation
  const occupiedCount = units.filter(
    (u) => u.status === 'occupied' || u.status === 'reserved'
  ).length;
  const occupancyRate = Math.round((occupiedCount / (units.length || 1)) * 100);

  // ADR & RevPAR calculations
  const totalNightsBooked = reservations
    .filter((r) => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.totalNights, 0);

  const adr = totalNightsBooked > 0 ? Math.round(totalRoomRevenue / totalNightsBooked) : 0;
  const revPar = Math.round(totalRoomRevenue / (units.length * 7 || 1));

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Confirmation,Guest,Unit,CheckIn,CheckOut,Nights,TotalAmount,DepositPaid,BalanceDue,Status',
        ...reservations.map(
          (r) =>
            `${r.confirmationCode},"${r.guestName}",${r.unitId},${r.checkInDate},${r.checkOutDate},${r.totalNights},${r.totalAmount},${r.depositPaid},${r.balanceDue},${r.status}`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ResortEase_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-900 tracking-tight">
            Financial Ledger & Revenue Intelligence
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time tracking of room revenue, private pool bookings, ADR, RevPAR, and tax folios.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Ledger (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">Total Gross Revenue</span>
          <div className="text-xl font-bold font-mono text-teal-900 mt-1">
            ${totalGrossRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">+14.2% vs previous period</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">Occupancy Rate</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">{occupancyRate}%</div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">
            {occupiedCount} of {units.length} Units Active
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">ADR (Average Daily Rate)</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">${adr}</div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Across all luxury categories</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">RevPAR</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">${revPar}</div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Revenue per available unit</span>
        </div>
      </div>

      {/* Revenue Breakdown by Source */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Bed className="w-4 h-4 text-teal-800" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Villas & Accommodations
            </h3>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            ${totalRoomRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {Math.round((totalRoomRevenue / (totalGrossRevenue || 1)) * 100)}% of total resort
            turnover
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Waves className="w-4 h-4 text-teal-800" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Private Pools & Cabanas
            </h3>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            ${totalAmenityRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {Math.round((totalAmenityRevenue / (totalGrossRevenue || 1)) * 100)}% of total resort
            turnover
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-teal-800" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              In-Villa Dining & Spa
            </h3>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            ${totalFolioExtras.toLocaleString()}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {Math.round((totalFolioExtras / (totalGrossRevenue || 1)) * 100)}% of total resort
            turnover
          </p>
        </div>
      </div>

      {/* Guest Billing & Settlements Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Active Guest Accounts & Folio Ledger
          </h3>
          <span className="text-xs text-stone-500">Includes 12% Resort & Eco Surcharge</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
            <tr>
              <th className="px-4 py-3">Guest & Res ID</th>
              <th className="px-4 py-3">Stay Dates</th>
              <th className="px-4 py-3">Total Billed</th>
              <th className="px-4 py-3">Advance Deposit</th>
              <th className="px-4 py-3">Outstanding Balance</th>
              <th className="px-4 py-3 text-right">Folio Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-mono text-[11px] tabular-nums">
            {reservations.map((r) => {
              const unit = units.find((u) => u.id === r.unitId);
              return (
                <tr key={r.id} className="hover:bg-stone-50/70">
                  <td className="px-4 py-3 font-sans">
                    <div className="font-semibold text-stone-900">{r.guestName}</div>
                    <div className="text-[11px] text-stone-500 font-mono">
                      #{r.confirmationCode} · [{unit?.code || 'Villa'}]
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {r.checkInDate} → {r.checkOutDate} ({r.totalNights}n)
                  </td>
                  <td className="px-4 py-3 font-bold text-stone-900">
                    ${r.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-teal-800">
                    ${r.depositPaid.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${
                        r.balanceDue > 0 ? 'text-amber-800' : 'text-emerald-700'
                      }`}
                    >
                      ${r.balanceDue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => onOpenFolio(r)}
                      className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                    >
                      Manage Folio & Settle
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
