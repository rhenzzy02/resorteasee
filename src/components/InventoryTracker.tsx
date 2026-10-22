import React, { useState } from 'react';
import { InventoryItem, StockTransaction } from '../types/resort';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle,
  FileSpreadsheet,
  RotateCw,
  ShoppingBag,
  TrendingDown,
  X,
} from 'lucide-react';

interface Props {
  inventory: InventoryItem[];
  onUpdateStock: (itemId: string, delta: number, type: 'consumed' | 'restocked' | 'damaged', notes: string) => void;
}

export const InventoryTracker: React.FC<Props> = ({ inventory, onUpdateStock }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [actionItem, setActionItem] = useState<InventoryItem | null>(null);
  const [actionType, setActionType] = useState<'consumed' | 'restocked' | 'damaged'>('consumed');
  const [quantity, setQuantity] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [generatedPO, setGeneratedPO] = useState<string | null>(null);

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minParLevel);

  const filteredItems = inventory.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const totalAssetValue = inventory.reduce(
    (sum, item) => sum + item.currentStock * item.unitCost,
    0
  );

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionItem || quantity <= 0) return;

    const delta = actionType === 'restocked' ? quantity : -quantity;
    onUpdateStock(
      actionItem.id,
      delta,
      actionType,
      notes.trim() || `${actionType} logged by staff`
    );

    setActionItem(null);
    setNotes('');
  };

  const handleGeneratePO = () => {
    const poLines = lowStockItems.map((item) => {
      const orderQty = item.maxCapacity - item.currentStock;
      const cost = orderQty * item.unitCost;
      return `• ${item.name} (${item.sku}): Order ${orderQty} ${item.unitName} @ $${item.unitCost} = $${cost.toLocaleString()} (Supplier: ${item.supplier})`;
    });

    const summary = `AUTOMATED RESTOCK PURCHASE ORDER #PO-2026-${Math.floor(
      1000 + Math.random() * 9000
    )}
Generated: 2026-10-21
Destination: Resort Ease Receiving Dock

ITEMS TO REPLENISH TO MAXIMUM PAR:
${poLines.join('\n')}

Estimated Total Order Value: $${lowStockItems
      .reduce((sum, item) => sum + (item.maxCapacity - item.currentStock) * item.unitCost, 0)
      .toLocaleString()}`;

    setGeneratedPO(summary);
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold">
                Critical Par Level Alert ({lowStockItems.length} Items Below Safe Threshold)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Plush pool towels and minibar champagne are below required inventory par for
                weekend resort capacity.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGeneratePO}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-800 transition-colors shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Generate 1-Click Restock PO</span>
          </button>
        </div>
      )}

      {/* PO Generated Modal */}
      {generatedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-semibold">Automated Restock Purchase Order</h3>
              <button
                onClick={() => setGeneratedPO(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <pre className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono whitespace-pre-wrap text-stone-800 leading-relaxed max-h-72 overflow-y-auto">
                {generatedPO}
              </pre>
            </div>
            <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedPO);
                  alert('Purchase order copied to clipboard!');
                  setGeneratedPO(null);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-teal-800 rounded-md hover:bg-teal-700"
              >
                Copy & Dispatch to Suppliers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Filter and Asset Value Strip */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Resort Asset & Amenities Inventory
            </h2>
            <div className="text-xs text-stone-500 mt-0.5">
              Live consumable levels, linens, minibar items, and recreation equipment.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-medium">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-md ${
                selectedCategory === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setSelectedCategory('linens')}
              className={`px-3 py-1 rounded-md ${
                selectedCategory === 'linens'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600'
              }`}
            >
              Linens
            </button>
            <button
              onClick={() => setSelectedCategory('pool_spa')}
              className={`px-3 py-1 rounded-md ${
                selectedCategory === 'pool_spa'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600'
              }`}
            >
              Pool & Spa
            </button>
            <button
              onClick={() => setSelectedCategory('minibar')}
              className={`px-3 py-1 rounded-md ${
                selectedCategory === 'minibar'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600'
              }`}
            >
              Minibar
            </button>
          </div>

          <div className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium">
            <span className="text-stone-500">Total Stock Value: </span>
            <span className="font-mono tabular-nums font-bold text-stone-900">
              ${totalAssetValue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">SKU & Item Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock vs Safe Par Level</th>
                <th className="px-4 py-3">Unit Valuation</th>
                <th className="px-4 py-3">Supplier & Restock</th>
                <th className="px-4 py-3 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item) => {
                const isLow = item.currentStock <= item.minParLevel;
                const percentage = Math.min(100, Math.round((item.currentStock / item.maxCapacity) * 100));

                return (
                  <tr key={item.id} className="hover:bg-stone-50/70">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-stone-900">{item.name}</div>
                      <div className="font-mono text-[11px] text-stone-400 mt-0.5">{item.sku}</div>
                    </td>

                    <td className="px-4 py-3 capitalize text-stone-600 font-medium">
                      {item.category.replace('_', ' ')}
                    </td>

                    <td className="px-4 py-3 w-56">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span
                          className={`font-mono font-bold ${
                            isLow ? 'text-amber-800' : 'text-stone-900'
                          }`}
                        >
                          {item.currentStock} {item.unitName}
                        </span>
                        <span className="text-stone-400 font-mono text-[10px]">
                          Par: {item.minParLevel} / Max: {item.maxCapacity}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isLow ? 'bg-amber-500' : 'bg-teal-700'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] tabular-nums">
                      <div className="text-stone-900 font-medium">${item.unitCost} / unit</div>
                      <div className="text-[10px] text-stone-400">
                        Total: ${(item.currentStock * item.unitCost).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-stone-800 font-medium">{item.supplier}</div>
                      <div className="text-[11px] text-stone-400 font-mono">
                        Last restocked {item.lastRestocked}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setActionItem(item);
                          setActionType('consumed');
                          setQuantity(1);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                      >
                        Adjust / Log
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {actionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Adjust Stock: {actionItem.name}</h3>
                <span className="text-[11px] text-stone-300 font-mono">Current: {actionItem.currentStock} {actionItem.unitName}</span>
              </div>
              <button
                onClick={() => setActionItem(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Action Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionType('consumed')}
                    className={`py-1.5 px-2 rounded-md font-medium text-center border ${
                      actionType === 'consumed'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    Consumed / Used
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('restocked')}
                    className={`py-1.5 px-2 rounded-md font-medium text-center border ${
                      actionType === 'restocked'
                        ? 'bg-teal-800 text-white border-teal-800'
                        : 'bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    Restock Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('damaged')}
                    className={`py-1.5 px-2 rounded-md font-medium text-center border ${
                      actionType === 'damaged'
                        ? 'bg-rose-800 text-white border-rose-800'
                        : 'bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    Damage / Loss
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quantity ({actionItem.unitName})
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50 font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Replenished 4 poolside daybeds"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActionItem(null)}
                  className="px-3 py-1.5 border border-stone-300 rounded-md text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-800 hover:bg-teal-700 text-white font-medium rounded-md"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
