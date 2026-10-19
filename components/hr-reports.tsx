import { ArrowDownRight, ArrowUpRight, Building2, ClipboardList, UsersRound } from "lucide-react"
import type { BlockedRecord, HrApprovalRequest, Slot } from "@/components/hr-types"

type UnitReport = {
  department: string
  total: number
  filled: number
  vacant: number
  blocked: number
}

type HrReportsProps = {
  slots: Slot[]
  blockedRecords: BlockedRecord[]
  pendingRequests: HrApprovalRequest[]
  departmentUnits: string[]
}

function getFilledCount(slot: Slot) {
  return slot.filledCount ?? (slot.status === "Dolu" ? 1 : 0)
}

function getVacantCount(slot: Slot) {
  return slot.vacantCount ?? (slot.status === "Boş" ? 1 : 0)
}

function getUnitReport(slots: Slot[], blockedRecords: BlockedRecord[], departmentUnits: string[]): UnitReport[] {
  const units = new Map<string, UnitReport>()
  const getUnit = (department: string) => {
    const existing = units.get(department)
    if (existing) return existing
    const created = { department, total: 0, filled: 0, vacant: 0, blocked: 0 }
    units.set(department, created)
    return created
  }

  departmentUnits.forEach(getUnit)
  slots.forEach((slot) => {
    const unit = getUnit(slot.department)
    unit.filled += getFilledCount(slot)
    unit.vacant += getVacantCount(slot)
  })
  blockedRecords.forEach((record) => {
    getUnit(record.department).blocked += record.count
  })

  return [...units.values()]
    .map((unit) => ({ ...unit, total: unit.filled + unit.vacant + unit.blocked }))
    .sort((first, second) => second.total - first.total || first.department.localeCompare(second.department, "tr-TR"))
}

function getRequestDetails(request: HrApprovalRequest, slots: Slot[]) {
  const payload = request.payload
  const slotId = payload.kind === "slot-create" ? payload.slot.id : payload.kind === "block" ? payload.record.slotId : payload.kind === "slot-delete" || payload.kind === "slot-update" || payload.kind === "assignment" || payload.kind === "degree-change" ? payload.slotId : ""
  const slot = payload.kind === "slot-create" ? payload.slot : slots.find((item) => item.id === slotId)
  const typeLabels = {
    "slot-create": "Yeni kadro",
    "slot-update": "Kadro güncelleme",
    "slot-delete": "Kadro silme",
    assignment: "Personel atama",
    block: "Bloke kadro",
    "degree-change": "Derece değişikliği",
  }
  const details = payload.kind === "slot-create"
    ? `${payload.slot.title} · ${payload.slot.degree}`
    : payload.kind === "slot-update"
      ? `${slot?.title ?? "Kadro"} bilgileri güncellenecek`
      : payload.kind === "slot-delete"
        ? `${payload.title} kadrosu silinecek`
        : payload.kind === "assignment"
          ? `${slot?.title ?? "Kadro"} için atama talebi`
          : payload.kind === "block"
            ? `${payload.record.title} · ${payload.record.count} kadro`
            : `${payload.previousDegree} → ${payload.newDegree}`

  return { type: typeLabels[payload.kind], slotId, department: slot?.department ?? (payload.kind === "block" ? payload.record.department : "—"), details }
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(date)
}

function MetricCard({ label, value, caption, icon: Icon, accent }: { label: string; value: string; caption: string; icon: typeof UsersRound; accent: "slate" | "teal" | "amber" }) {
  const accents = {
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
  }
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}><Icon aria-hidden="true" className="size-5" /></span>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{caption}</p>
    </article>
  )
}

export function buildHrReportCsv({ slots, blockedRecords, pendingRequests, departmentUnits }: HrReportsProps) {
  const units = getUnitReport(slots, blockedRecords, departmentUnits)
  const totals = units.reduce((result, unit) => ({
    total: result.total + unit.total,
    filled: result.filled + unit.filled,
    vacant: result.vacant + unit.vacant,
    blocked: result.blocked + unit.blocked,
  }), { total: 0, filled: 0, vacant: 0, blocked: 0 })
  const rows: unknown[][] = [
    ["Yönetici Özeti"],
    ["Metrik", "Değer"],
    ["Toplam kadro", totals.total],
    ["Dolu kadro", totals.filled],
    ["Boş kadro", totals.vacant],
    ["Bloke kadro", totals.blocked],
    ["Doluluk oranı", `${totals.total ? Math.round((totals.filled / totals.total) * 100) : 0}%`],
    [],
    ["Birim Bazlı Kadro Durumu"],
    ["Birim", "Toplam", "Dolu", "Boş", "Bloke", "Doluluk oranı"],
    ...units.map((unit) => [unit.department, unit.total, unit.filled, unit.vacant, unit.blocked, `${unit.total ? Math.round((unit.filled / unit.total) * 100) : 0}%`]),
    [],
    ["Bekleyen Talepler"],
    ["Talep No", "Talep türü", "Gönderim tarihi", "Kadro ID", "Birim", "Açıklama"],
    ...pendingRequests.map((request) => {
      const details = getRequestDetails(request, slots)
      return [request.id, details.type, formatDate(request.submittedAt), details.slotId, details.department, details.details]
    }),
  ]
  const encode = (value: unknown) => {
    const text = String(value ?? "")
    const safeText = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text
    return `"${safeText.replaceAll('"', '""')}"`
  }
  return "\uFEFF" + rows.map((row) => row.map(encode).join(",")).join("\r\n")
}

export default function HrReports({ slots, blockedRecords, pendingRequests, departmentUnits }: HrReportsProps) {
  const units = getUnitReport(slots, blockedRecords, departmentUnits)
  const total = units.reduce((sum, unit) => sum + unit.total, 0)
  const filled = units.reduce((sum, unit) => sum + unit.filled, 0)
  const vacant = units.reduce((sum, unit) => sum + unit.vacant, 0)
  const blocked = units.reduce((sum, unit) => sum + unit.blocked, 0)
  const occupancy = total ? Math.round((filled / total) * 100) : 0

  return (
    <section aria-label="Kadro raporları" className="flex flex-col gap-6">
      <section aria-labelledby="executive-summary-title" className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-700">Kurum geneli · Güncel durum</p>
            <h3 id="executive-summary-title" className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Yönetici özeti</h3>
            <p className="mt-1 text-xs text-slate-500">Kadro kayıtları ve onay bekleyen taleplerin anlık görünümü.</p>
          </div>
          <p className="text-[11px] text-slate-500">{units.length} birim · {pendingRequests.length} bekleyen talep</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Toplam kadro" value={String(total)} caption="Dolu, boş ve bloke kadrolar" icon={UsersRound} accent="slate" />
          <MetricCard label="Dolu kadro" value={String(filled)} caption={`${occupancy}% doluluk oranı`} icon={ArrowUpRight} accent="teal" />
          <MetricCard label="Boş kadro" value={String(vacant)} caption="Atama yapılabilecek kadrolar" icon={ArrowDownRight} accent="teal" />
          <MetricCard label="Bloke kadro" value={String(blocked)} caption="Geçici olarak kullanıma kapalı" icon={Building2} accent="amber" />
        </div>
      </section>

      <section aria-labelledby="unit-status-title" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-end sm:px-6">
          <div>
            <h3 id="unit-status-title" className="text-sm font-semibold text-slate-900">Birim bazlı kadro durumu</h3>
            <p className="mt-1 text-[11px] text-slate-500">Her birimde dolu, boş ve bloke kadro adetleri ile doluluk oranı.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-[10px] font-medium text-slate-500" aria-label="Grafik renk açıklaması">
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-teal-600" />Dolu</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-sky-300" />Boş</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400" />Bloke</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead><tr className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              <th scope="col" className="px-5 py-3 sm:px-6">Birim</th><th scope="col" className="px-3 py-3 text-right">Toplam</th><th scope="col" className="px-3 py-3 text-right">Dolu</th><th scope="col" className="px-3 py-3 text-right">Boş</th><th scope="col" className="px-3 py-3 text-right">Bloke</th><th scope="col" className="px-5 py-3 sm:px-6">Doluluk</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {units.map((unit) => {
                const rate = unit.total ? Math.round((unit.filled / unit.total) * 100) : 0
                const filledWidth = unit.total ? (unit.filled / unit.total) * 100 : 0
                const vacantWidth = unit.total ? (unit.vacant / unit.total) * 100 : 0
                const blockedWidth = unit.total ? (unit.blocked / unit.total) * 100 : 0
                return (
                  <tr key={unit.department} className="hover:bg-slate-50/70">
                    <th scope="row" className="max-w-[260px] px-5 py-3.5 text-left text-xs font-medium leading-relaxed text-slate-700 sm:px-6">{unit.department}</th>
                    <td className="px-3 py-3.5 text-right text-xs font-semibold tabular-nums text-slate-800">{unit.total}</td>
                    <td className="px-3 py-3.5 text-right text-xs tabular-nums text-slate-700">{unit.filled}</td>
                    <td className="px-3 py-3.5 text-right text-xs tabular-nums text-slate-700">{unit.vacant}</td>
                    <td className="px-3 py-3.5 text-right text-xs tabular-nums text-slate-700">{unit.blocked}</td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div role="img" aria-label={`${unit.department}: ${unit.filled} dolu, ${unit.vacant} boş, ${unit.blocked} bloke`} className="flex h-2 min-w-24 flex-1 overflow-hidden rounded-full bg-slate-100">
                          {filledWidth > 0 && <span className="h-full bg-teal-600" style={{ width: `${filledWidth}%` }} />}
                          {vacantWidth > 0 && <span className="h-full bg-sky-300" style={{ width: `${vacantWidth}%` }} />}
                          {blockedWidth > 0 && <span className="h-full bg-amber-400" style={{ width: `${blockedWidth}%` }} />}
                        </div>
                        <span className="w-10 text-right text-[11px] font-semibold tabular-nums text-slate-700">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!units.length && <tr><td colSpan={6} className="px-6 py-10 text-center text-xs text-slate-500">Raporlanacak birim veya kadro kaydı bulunmuyor.</td></tr>}
            </tbody>
            <tfoot><tr className="border-t border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800"><th scope="row" className="px-5 py-3.5 text-left sm:px-6">Genel toplam</th><td className="px-3 py-3.5 text-right tabular-nums">{total}</td><td className="px-3 py-3.5 text-right tabular-nums">{filled}</td><td className="px-3 py-3.5 text-right tabular-nums">{vacant}</td><td className="px-3 py-3.5 text-right tabular-nums">{blocked}</td><td className="px-5 py-3.5 text-right tabular-nums sm:px-6">{occupancy}%</td></tr></tfoot>
          </table>
        </div>
      </section>

      <section aria-labelledby="pending-requests-title" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-end sm:px-6">
          <div>
            <h3 id="pending-requests-title" className="text-sm font-semibold text-slate-900">Bekleyen talepler</h3>
            <p className="mt-1 text-[11px] text-slate-500">Henüz karara bağlanmamış kadro ve personel işlemleri.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800"><ClipboardList aria-hidden="true" className="size-3.5" />{pendingRequests.length} talep</span>
        </div>
        {pendingRequests.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead><tr className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wide text-slate-500"><th scope="col" className="px-5 py-3 sm:px-6">Talep</th><th scope="col" className="px-3 py-3">Kadro / Birim</th><th scope="col" className="px-3 py-3">Gönderen</th><th scope="col" className="px-3 py-3">Gönderim</th><th scope="col" className="px-5 py-3 sm:px-6">Durum</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {pendingRequests.map((request) => {
                  const details = getRequestDetails(request, slots)
                  return <tr key={request.id} className="hover:bg-slate-50/70">
                    <th scope="row" className="px-5 py-3.5 text-left sm:px-6"><span className="block text-xs font-semibold text-slate-800">{details.type}</span><span className="mt-1 block max-w-[250px] text-[10px] leading-relaxed text-slate-500">{details.details}</span></th>
                    <td className="px-3 py-3.5"><span className="block font-mono text-[10px] text-slate-600">{details.slotId || "—"}</span><span className="mt-1 block max-w-[220px] text-[10px] leading-relaxed text-slate-500">{details.department}</span></td>
                    <td className="px-3 py-3.5 text-[11px] text-slate-600">{request.submittedByName}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-slate-600">{formatDate(request.submittedAt)}</td>
                    <td className="px-5 py-3.5 sm:px-6"><span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800"><span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />Bekliyor</span></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 py-10 text-center"><span className="flex size-10 items-center justify-center rounded-full bg-teal-50 text-teal-700"><ClipboardList aria-hidden="true" className="size-5" /></span><p className="mt-3 text-xs font-semibold text-slate-700">Bekleyen talep yok</p><p className="mt-1 text-[11px] text-slate-500">Yeni talepler gönderildiğinde bu raporda listelenecek.</p></div>
        )}
      </section>
      <p className="text-[10px] leading-relaxed text-slate-400">Bu rapor görünümü prototipteki güncel örnek kayıtları temel alır; geçmiş dönem karşılaştırması sunmaz.</p>
    </section>
  )
}
