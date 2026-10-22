import React, { useState } from 'react';
import {
  CommunicationWorkflow,
  CommunicationLogEntry,
  Reservation,
  PropertyUnit,
} from '../types/resort';
import {
  Mail,
  MessageSquare,
  Sparkles,
  Send,
  Edit3,
  CheckCircle,
  Eye,
  Clock,
  Settings2,
  FileText,
  RotateCcw,
  Tag,
  AlertCircle,
  X,
} from 'lucide-react';

interface Props {
  workflows: CommunicationWorkflow[];
  logs: CommunicationLogEntry[];
  reservations: Reservation[];
  units: PropertyUnit[];
  onUpdateWorkflow: (updated: CommunicationWorkflow) => void;
  onDispatchWorkflow: (workflowId: string, reservationId: string) => void;
}

const TEMPLATE_VARIABLES = [
  { tag: '{guest_name}', label: 'Guest Name', sample: 'Eleanor Vance' },
  { tag: '{unit_name}', label: 'Unit / Cottage Name', sample: 'Azure Overwater Villa 101' },
  { tag: '{confirmation_code}', label: 'Confirmation Code', sample: 'RE-2026-9481' },
  { tag: '{check_in_date}', label: 'Check-In Date', sample: '2026-10-21' },
  { tag: '{check_out_date}', label: 'Check-Out Date', sample: '2026-10-25' },
  { tag: '{digital_key}', label: 'Digital Key PIN', sample: '8492' },
  { tag: '{total_amount}', label: 'Total Stay Amount', sample: '$3,400' },
  { tag: '{deposit_paid}', label: 'Deposit Paid', sample: '$1,020' },
  { tag: '{balance_due}', label: 'Balance Due', sample: '$2,380' },
  { tag: '{resort_phone}', label: 'Resort Concierge Desk', sample: '+1 (800) 555-EASE' },
];

export const CommunicationWorkflows: React.FC<Props> = ({
  workflows,
  logs,
  reservations,
  units,
  onUpdateWorkflow,
  onDispatchWorkflow,
}) => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'history'>('workflows');
  const [editingWorkflow, setEditingWorkflow] = useState<CommunicationWorkflow | null>(null);
  const [previewWorkflow, setPreviewWorkflow] = useState<CommunicationWorkflow | null>(null);
  const [selectedPreviewGuestId, setSelectedPreviewGuestId] = useState<string>(
    reservations[0]?.id || ''
  );
  const [inspectLog, setInspectLog] = useState<CommunicationLogEntry | null>(null);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  // Selected reservation for preview
  const previewReservation = reservations.find((r) => r.id === selectedPreviewGuestId) || reservations[0];
  const previewUnit = units.find((u) => u.id === previewReservation?.unitId) || units[0];

  // Helper to render template text with variables
  const renderTemplate = (content: string) => {
    if (!content) return '';
    return content
      .replace(/{guest_name}/g, previewReservation?.guestName || 'Valued Guest')
      .replace(/{unit_name}/g, previewUnit?.name || 'Sanctuary Villa')
      .replace(/{confirmation_code}/g, previewReservation?.confirmationCode || 'RE-2026-0000')
      .replace(/{check_in_date}/g, previewReservation?.checkInDate || '2026-10-21')
      .replace(/{check_out_date}/g, previewReservation?.checkOutDate || '2026-10-25')
      .replace(/{digital_key}/g, '8492')
      .replace(/{total_amount}/g, `$${(previewReservation?.totalAmount || 0).toLocaleString()}`)
      .replace(/{deposit_paid}/g, `$${(previewReservation?.depositPaid || 0).toLocaleString()}`)
      .replace(/{balance_due}/g, `$${(previewReservation?.balanceDue || 0).toLocaleString()}`)
      .replace(/{resort_phone}/g, '+1 (800) 555-EASE');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkflow) return;
    onUpdateWorkflow(editingWorkflow);
    setEditingWorkflow(null);
  };

  const insertVariableIntoEmail = (variableTag: string) => {
    if (!editingWorkflow) return;
    setEditingWorkflow({
      ...editingWorkflow,
      emailBody: editingWorkflow.emailBody + ' ' + variableTag,
    });
  };

  const handleInstantDispatch = (wfId: string) => {
    if (!previewReservation) return;
    onDispatchWorkflow(wfId, previewReservation.id);
    setDispatchSuccessMsg(`Automated message successfully sent to ${previewReservation.guestName}!`);
    setTimeout(() => {
      setDispatchSuccessMsg(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {dispatchSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{dispatchSuccessMsg}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700">Logged to audit trail</span>
        </div>
      )}

      {/* Header & Sub-Tabs */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-900 tracking-tight">
            Automated Guest Communications & Messaging Engine
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pre-configured automated touchpoints: Booking confirmation, pre-arrival orientation,
            mid-stay check-in, and post-stay review.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'workflows'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Configured Workflows ({workflows.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dispatch Audit Log ({logs.length})
          </button>
        </div>
      </div>

      {activeTab === 'workflows' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 flex flex-col justify-between hover:border-stone-300 transition-colors"
            >
              <div>
                {/* Top status bar */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-teal-800 uppercase tracking-wider text-[11px]">
                    {wf.type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500">{wf.triggerSchedule}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateWorkflow({
                          ...wf,
                          isActive: !wf.isActive,
                        })
                      }
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border transition-colors ${
                        wf.isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-stone-100 text-stone-500 border-stone-300'
                      }`}
                    >
                      {wf.isActive ? 'Active' : 'Paused'}
                    </button>
                  </div>
                </div>

                {/* Workflow Title */}
                <h3 className="text-sm font-bold text-stone-900">{wf.title}</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{wf.description}</p>

                {/* Subject Preview */}
                <div className="mt-3 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <div className="text-[11px] text-stone-400 font-medium">Email Subject:</div>
                  <div className="font-semibold text-stone-800 truncate mt-0.5">{wf.subject}</div>
                </div>

                {/* Performance Metrics */}
                <div className="mt-3 grid grid-cols-3 gap-2 p-2 bg-stone-50/70 rounded-lg text-center text-xs">
                  <div>
                    <span className="block text-[10px] text-stone-400">Total Sent</span>
                    <span className="font-mono tabular-nums font-semibold text-stone-800">
                      {wf.stats.sentTotal}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400">Open Rate</span>
                    <span className="font-mono tabular-nums font-semibold text-teal-800">
                      {wf.stats.openRate}%
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400">Guest Response</span>
                    <span className="font-mono tabular-nums font-semibold text-stone-800">
                      {wf.stats.responseRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-stone-500">
                  {wf.channel === 'both' ? (
                    <span>Email & SMS</span>
                  ) : wf.channel === 'email' ? (
                    <span>Email Only</span>
                  ) : (
                    <span>SMS Only</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewWorkflow(wf)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingWorkflow(wf)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-white bg-teal-800 hover:bg-teal-700 rounded-lg font-medium transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dispatch Audit Log Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
              Automated Dispatch Records & Delivery Audit
            </h3>
            <span className="text-xs text-stone-500">Real-time gateway status</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 font-medium border-b border-stone-200">
              <tr>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Workflow Touchpoint</th>
                <th className="px-4 py-2.5">Guest & Room</th>
                <th className="px-4 py-2.5">Channel</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="px-4 py-2.5 font-mono text-[11px] text-stone-500">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-stone-800">{log.workflowTitle}</td>
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-stone-900">{log.guestName}</span>
                    <span className="text-stone-400 mx-1">·</span>
                    <span className="font-mono text-teal-800">[{log.roomNumber}]</span>
                  </td>
                  <td className="px-4 py-2.5 uppercase text-[10px] font-mono text-stone-600">
                    {log.channel}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        log.status === 'opened'
                          ? 'bg-teal-50 text-teal-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {log.status === 'opened' ? 'Opened & Read' : 'Delivered'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => setInspectLog(log)}
                      className="text-teal-800 hover:text-teal-900 font-medium underline"
                    >
                      View Sent Transcript
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Customize Workflow Template */}
      {editingWorkflow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-teal-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">
                  Customize Workflow: {editingWorkflow.title}
                </h3>
                <p className="text-xs text-teal-200/80 mt-0.5">
                  Update subject, content copy, timing trigger rules, and dynamic variable tags.
                </p>
              </div>
              <button
                onClick={() => setEditingWorkflow(null)}
                className="p-1 text-teal-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Trigger Schedule & Channel Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Trigger Dispatch Rule
                  </label>
                  <input
                    type="text"
                    value={editingWorkflow.triggerSchedule}
                    onChange={(e) =>
                      setEditingWorkflow({
                        ...editingWorkflow,
                        triggerSchedule: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50"
                    placeholder="e.g. 48 hours before arrival at 09:00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery Channel
                  </label>
                  <select
                    value={editingWorkflow.channel}
                    onChange={(e) =>
                      setEditingWorkflow({
                        ...editingWorkflow,
                        channel: e.target.value as any,
                      })
                    }
                    className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50"
                  >
                    <option value="both">Both Email & SMS Alert</option>
                    <option value="email">Email Only</option>
                    <option value="sms">SMS / WhatsApp Only</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Variables Palette */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-700" />
                  <span>Insert Dynamic Personalization Tags (Click to append):</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATE_VARIABLES.map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => insertVariableIntoEmail(v.tag)}
                      className="px-2 py-1 bg-stone-100 hover:bg-teal-50 hover:text-teal-900 border border-stone-200 rounded text-[11px] font-mono transition-colors"
                      title={v.label}
                    >
                      {v.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Subject */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={editingWorkflow.subject}
                  onChange={(e) =>
                    setEditingWorkflow({
                      ...editingWorkflow,
                      subject: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50 font-medium"
                  required
                />
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Message Body (Markdown / Plain Text)
                </label>
                <textarea
                  rows={9}
                  value={editingWorkflow.emailBody}
                  onChange={(e) =>
                    setEditingWorkflow({
                      ...editingWorkflow,
                      emailBody: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-stone-300 rounded-lg bg-stone-50 font-mono text-[11px] leading-relaxed"
                  required
                />
              </div>

              {/* SMS Copy */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
                  <span>SMS / WhatsApp Companion Message</span>
                  <span className="font-mono text-stone-400">
                    {editingWorkflow.smsBody?.length || 0} characters
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={editingWorkflow.smsBody}
                  onChange={(e) =>
                    setEditingWorkflow({
                      ...editingWorkflow,
                      smsBody: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-stone-300 rounded-lg bg-stone-50 font-mono text-[11px]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingWorkflow(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
                >
                  Save & Apply Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Live Test Preview */}
      {previewWorkflow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Live Guest Message Preview</h3>
                <p className="text-xs text-stone-300 mt-0.5">
                  Rendered simulation showing how the email and SMS appear to a specific guest.
                </p>
              </div>
              <button
                onClick={() => setPreviewWorkflow(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Guest Picker for Preview */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-700">Preview with Guest Record:</span>
                <select
                  value={selectedPreviewGuestId}
                  onChange={(e) => setSelectedPreviewGuestId(e.target.value)}
                  className="p-1.5 text-xs border border-stone-300 rounded-md bg-white flex-1"
                >
                  {reservations.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.guestName} ({r.confirmationCode}) · {r.checkInDate} to {r.checkOutDate}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email Envelope */}
              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-stone-100 p-3 border-b border-stone-200 space-y-1">
                  <div className="flex gap-2">
                    <span className="text-stone-400 font-medium">To:</span>
                    <span className="font-medium text-stone-900">
                      {previewReservation?.guestName} &lt;{previewReservation?.guestEmail}&gt;
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-stone-400 font-medium">Subject:</span>
                    <span className="font-bold text-stone-900">
                      {renderTemplate(previewWorkflow.subject)}
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-white whitespace-pre-wrap font-sans text-stone-800 leading-relaxed text-xs">
                  {renderTemplate(previewWorkflow.emailBody)}
                </div>
              </div>

              {/* SMS Companion Preview */}
              {previewWorkflow.smsBody && (
                <div className="border border-stone-200 rounded-xl p-3 bg-stone-50">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-teal-800" />
                    <span>SMS / WhatsApp Companion Delivery:</span>
                  </div>
                  <div className="p-3 bg-white border border-stone-200 rounded-lg font-mono text-[11px] text-stone-800">
                    {renderTemplate(previewWorkflow.smsBody)}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Trigger: <strong className="text-stone-700">{previewWorkflow.triggerSchedule}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewWorkflow(null)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-md"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleInstantDispatch(previewWorkflow.id);
                    setPreviewWorkflow(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-md shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Immediate Test Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Sent Transcript */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-semibold">Sent Message Transcript</h3>
              <button
                onClick={() => setInspectLog(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3 text-xs">
              <div className="p-2.5 bg-stone-100 rounded-lg text-stone-700 space-y-1">
                <div>
                  <strong>Recipient:</strong> {inspectLog.guestName} ({inspectLog.recipientEmail})
                </div>
                <div>
                  <strong>Room:</strong> {inspectLog.roomNumber} ·{' '}
                  <strong>Channel:</strong> {inspectLog.channel}
                </div>
                <div>
                  <strong>Timestamp:</strong> {inspectLog.timestamp}
                </div>
              </div>
              <div className="font-semibold text-stone-900">{inspectLog.renderedSubject}</div>
              <div className="p-3 border border-stone-200 rounded-lg bg-stone-50 whitespace-pre-wrap font-mono text-[11px] text-stone-800 leading-relaxed">
                {inspectLog.renderedBody}
              </div>
            </div>
            <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectLog(null)}
                className="px-3 py-1 text-xs text-stone-700 border border-stone-300 rounded-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
