import { Check, Clock3, FileCheck2, ShieldCheck, UserPlus, X } from "lucide-react"
import type { HrApprovalRequest, MockHrUser } from "@/components/hr-types"

type HrApprovalsProps = {
  requests: HrApprovalRequest[]
  currentUser: MockHrUser
  feedback: string
  canCreateDemoAssignment: boolean
  onCreateDemoAssignment: () => void
  onApprove: (requestId: string) => void
  onReject: (requestId: string) => void
}

const requestLabels = {
  "slot-create": "Yeni kadro",
  "slot-update": "Kadro bilgisi değişikliği",
  "slot-delete": "Kadro silme",
  assignment: "Personel atama",
  block: "Bloke kadro",
  "degree-change": "Kadro derece değişikliği",
} as const

function requestSummary(request: HrApprovalRequest) {
  const { payload } = request
  switch (payload.kind) {
    case "slot-create":
      return `${payload.slot.title} · ${payload.slot.department} · ${payload.slot.degree}`
    case "slot-update":
      return `${payload.slotId} numaralı kadronun bilgileri güncellenecek.`
    case "slot-delete":
      return `${payload.title} (${payload.slotId}) kadrosu silinecek.`
    case "assignment":
      return `${payload.employee} · ${payload.assignmentNumber} · ${payload.assignmentDate}`
    case "block":
      return `${payload.record.title} · ${payload.record.count} kadro · ${payload.record.reason}`
    case "degree-change":
      return `${payload.slotId} · ${payload.previousDegree} → ${payload.newDegree}`
  }
}

function statusCopy(status: HrApprovalRequest["status"]) {
  if (status === "approved") return "Onaylandı"
  if (status === "rejected") return "Reddedildi"
  return "Onay bekliyor"
}

export default function HrApprovals({ requests, currentUser, feedback, canCreateDemoAssignment, onCreateDemoAssignment, onApprove, onReject }: HrApprovalsProps) {
  const pendingRequests = requests.filter((request) => request.status === "pending")
  const historyRequests = requests.filter((request) => request.status !== "pending").slice().reverse()

  return (
    <section aria-labelledby="approvals-title" className="grid grid-cols-1 items-start gap-5">
      {feedback && <p role="status" className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-[11px] font-medium text-teal-800">{feedback}</p>}
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 border-b border-teal-100 bg-gradient-to-br from-teal-50/80 via-white to-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white text-teal-700 shadow-sm"><FileCheck2 aria-hidden="true" className="size-5" /></div>
            <div><h3 id="approvals-title" className="text-[15px] font-semibold tracking-tight text-slate-900">Onay bekleyen işlemler</h3><p className="mt-1 text-[11px] text-slate-500">İK Sorumlusu tarafından gönderilen kadro işlemlerini inceleyip karara bağlayın.</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onCreateDemoAssignment} disabled={!canCreateDemoAssignment} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 text-[11px] font-semibold text-teal-800 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50"><UserPlus aria-hidden="true" className="size-3.5" />Demo atama talebi ekle</button>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800"><Clock3 aria-hidden="true" className="size-3.5" />{pendingRequests.length} bekleyen işlem</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingRequests.map((request) => {
            const canDecide = request.submittedById !== currentUser.id
            return (
              <article key={request.id} className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-teal-50 px-2 py-1 text-[10px] font-semibold text-teal-800">{requestLabels[request.payload.kind]}</span><span className="font-mono text-[10px] text-slate-400">{request.id}</span></div>
                  <p className="mt-2 text-[13px] font-semibold text-slate-800">{requestSummary(request)}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{request.submittedByName} tarafından · {new Date(request.submittedAt).toLocaleString("tr-TR")}</p>
                </div>
                {canDecide ? (
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => onReject(request.id)} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"><X aria-hidden="true" className="size-3.5" />Reddet</button>
                    <button type="button" onClick={() => onApprove(request.id)} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-3 text-[11px] font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"><Check aria-hidden="true" className="size-3.5" />Onayla</button>
                  </div>
                ) : <p role="status" className="max-w-xs text-[11px] text-slate-500">Kendi gönderdiğiniz işlemi onaylayamaz veya reddedemezsiniz.</p>}
              </article>
            )
          })}
          {pendingRequests.length === 0 && <div className="px-6 py-12 text-center"><div className="mx-auto flex size-10 items-center justify-center rounded-full bg-teal-50 text-teal-700"><ShieldCheck aria-hidden="true" className="size-5" /></div><p className="mt-3 text-xs font-semibold text-slate-700">Bekleyen onay yok</p><p className="mt-1 text-[11px] text-slate-400">İK Sorumlusu tarafından gönderilen işlemler bu listede görüntülenir.</p></div>}
        </div>
      </article>

      <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h3 className="text-[14px] font-semibold text-slate-900">Karar geçmişi</h3><p className="mt-1 text-[11px] text-slate-500">Onaylanan ve reddedilen kayıtlar.</p></div>
        {historyRequests.length ? <ul className="divide-y divide-slate-100">{historyRequests.map((request) => <li key={request.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><p className="text-[11px] font-semibold text-slate-800">{requestLabels[request.payload.kind]} <span className="font-normal text-slate-500">· {requestSummary(request)}</span></p><p className="mt-1 text-[10px] text-slate-400">Gönderen: {request.submittedByName}{request.decidedByName ? ` · Karar veren: ${request.decidedByName}` : ""}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ${request.status === "approved" ? "bg-teal-50 text-teal-800" : "bg-rose-50 text-rose-700"}`}>{statusCopy(request.status)}</span></li>)}</ul> : <p className="px-6 py-8 text-center text-[11px] text-slate-400">Henüz karara bağlanmış kayıt yok.</p>}
      </article>
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[10px] leading-relaxed text-slate-500">Demo modu: kullanıcı rolleri ve onay kayıtları bu tarayıcı oturumundaki React state&apos;inde tutulur. Gerçek kullanıcı doğrulaması veya kalıcı veritabanı değildir.</p>
    </section>
  )
}
