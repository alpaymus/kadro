import { useState } from "react"
import { ArrowDownRight, ArrowUpRight, Building2, ClipboardList, UsersRound } from "lucide-react"
import type { BlockedRecord, HrApprovalRequest, Slot } from "@/components/hr-types"

type ReportDimension = "department" | "title" | "serviceClass" | "degree" | "location"
type UnitReport = {
  department: string
  total: number
  filled: number
  vacant: number
  blocked: number
}
type GroupReport = UnitReport & { name: string }

const reportDimensions: { value: ReportDimension; label: string }[] = [
  { value: "department", label: "Kurum / birim" },
  { value: "title", label: "Ünvan" },
  { value: "serviceClass", label: "Sınıf" },
  { value: "degree", label: "Derece" },
  { value: "location", label: "Lokasyon" },
]

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

function getGroupedReport(slots: Slot[], blockedRecords: BlockedRecord[], dimension: ReportDimension, departmentUnits: string[] = []): GroupReport[] {
  const groups = new Map<string, GroupReport>()
  const slotsById = new Map(slots.map((slot) => [slot.id, slot]))
  const getGroup = (name: string, department = name) => {
    const existing = groups.get(name)
    if (existing) return existing
    const created = { name, department, total: 0, filled: 0, vacant: 0, blocked: 0 }
    groups.set(name, created)
    return created
  }
  const valueFor = (item: Slot | BlockedRecord) => {
    const slot = "slotId" in item ? slotsById.get(item.slotId) : item
    if (dimension === "department") return slot?.department ?? item.department
    if (dimension === "title") return slot?.title ?? item.title
    if (dimension === "degree") return slot?.degree ?? item.degree
    if (dimension === "location") return (slot?.location ?? item.location)?.trim() || "Lokasyon belirtilmemiş"
    return slot?.serviceClass?.trim() || ("serviceClass" in item ? item.serviceClass?.trim() : "") || "Sınıf belirtilmemiş"
  }

  if (dimension === "department") departmentUnits.forEach((department) => getGroup(department))
  slots.forEach((slot) => {
    const group = getGroup(valueFor(slot))
    group.filled += getFilledCount(slot)
    group.vacant += getVacantCount(slot)
  })
  blockedRecords.forEach((record) => {
    getGroup(valueFor(record)).blocked += record.count
  })

  return [...groups.values()]
    .map((group) => ({ ...group, total: group.filled + group.vacant + group.blocked }))
    .sort((first, second) => second.total - first.total || first.name.localeCompare(second.name, "tr-TR"))
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
  const units = getGroupedReport(slots, blockedRecords, "department", departmentUnits)
  const totals = units.reduce((result, unit) => ({
    total: result.total + unit.total,
    filled: result.filled + unit.filled,
    vacant: result.vacant + unit.vacant,
    blocked: result.blocked + unit.blocked,
  }), { total: 0, filled: 0, vacant: 0, blocked: 0 })
  const rows: unknown[][] = [
    ["Yönetici Özeti"], ["Metrik", "Değer", "Oran"],
    ["Mevcut kadro", totals.total, "100%"],
    ["Dolu kadro", totals.filled, `${totals.total ? Math.round((totals.filled / totals.total) * 100) : 0}%`],
    ["Boş kadro", totals.vacant, `${totals.total ? Math.round((totals.vacant / totals.total) * 100) : 0}%`],
    ["Bloke kadro", totals.blocked, `${totals.total ? Math.round((totals.blocked / totals.total) * 100) : 0}%`],
  ]
  reportDimensions.forEach(({ value, label }) => {
    const groups = getGroupedReport(slots, blockedRecords, value, departmentUnits)
    rows.push([], [`Kadro Dağılımı — ${label}`], [label, "Mevcut sayı", "Mevcut oranı", "Dolu sayı", "Dolu oranı", "Boş sayı", "Boş oranı", "Bloke sayı", "Bloke oranı"])
    groups.forEach((group) => rows.push([
      group.name, group.total, `${group.total ? Math.round((group.total / totals.total) * 100) : 0}%`,
      group.filled, `${group.total ? Math.round((group.filled / group.total) * 100) : 0}%`,
      group.vacant, `${group.total ? Math.round((group.vacant / group.total) * 100) : 0}%`,
      group.blocked, `${group.total ? Math.round((group.blocked / group.total) * 100) : 0}%`,
    ]))
    rows.push(["Genel toplam", totals.total, "100%", totals.filled, `${totals.total ? Math.round((totals.filled / totals.total) * 100) : 0}%`, totals.vacant, `${totals.total ? Math.round((totals.vacant / totals.total) * 100) : 0}%`, totals.blocked, `${totals.total ? Math.round((totals.blocked / totals.total) * 100) : 0}%`])
  })
  rows.push([], ["Bekleyen Talepler"], ["Talep No", "Talep türü", "Gönderim tarihi", "Kadro ID", "Birim", "Açıklama"])
  pendingRequests.forEach((request) => {
    const details = getRequestDetails(request, slots)
    rows.push([request.id, details.type, formatDate(request.submittedAt), details.slotId, details.department, details.details])
  })
  const encode = (value: unknown) => {
    const text = String(value ?? "")
    const safeText = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text
    return `"${safeText.replaceAll('"', '""')}"`
  }
  return "\uFEFF" + rows.map((row) => row.map(encode).join(",")).join("\r\n")
}

export default function HrReports({ slots, blockedRecords, pendingRequests, departmentUnits }: HrReportsProps) {
  const [groupBy, setGroupBy] = useState<ReportDimension>("department")
  const units = getGroupedReport(slots, blockedRecords, "department", departmentUnits)
  const groups = getGroupedReport(slots, blockedRecords, groupBy, departmentUnits)
  const total = units.reduce((sum, unit) => sum + unit.total, 0)
  const filled = units.reduce((sum, unit) => sum + unit.filled, 0)
  const vacant = units.reduce((sum, unit) => sum + unit.vacant, 0)
  const blocked = units.reduce((sum, unit) => sum + unit.blocked, 0)
  const occupancy = total ? Math.round((filled / total) * 100) : 0
  const selectedDimension = reportDimensions.find((dimension) => dimension.value === groupBy)?.label ?? "Kurum / birim"

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
          <MetricCard label="Boş kadro" value={String(vacant)} caption={`${total ? Math.round((vacant / total) * 100) : 0}% boş kadro oranı`} icon={ArrowDownRight} accent="teal" />
          <MetricCard label="Bloke kadro" value={String(blocked)} caption="Geçici olarak kullanıma kapalı" icon={Building2} accent="amber" />
        </div>
      </section>

      <section aria-labelledby="distribution-title" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-end sm:px-6">
          <div>
            <h3 id="distribution-title" className="text-sm font-semibold text-slate-900">Kadro dağılımı</h3>
            <p className="mt-1 text-[11px] text-slate-500">Kurum genelinde; birim, ünvan, sınıf, derece ve lokasyon kırılımında mevcut kadro ile dolu ve boş adet/oranları.</p>
          </div>
          <label className="flex shrink-0 items-center gap-2 text-[11px] font-medium text-slate-600">
            <span>Kırılım</span>
            <select aria-label="Kadro raporu kırılımı" value={groupBy} onChange={(event) => setGroupBy(event.target.value as ReportDimension)} className="h-9 min-w-40 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
              {reportDimensions.map((dimension) => <option key={dimension.value} value={dimension.value}>{dimension.label}</option>)}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-3 border-b border-slate-100 px-5 py-3 text-[10px] font-medium text-slate-500 sm:px-6" aria-label="Kadro durum renk açıklaması">
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-teal-600" />Dolu</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-sky-300" />Boş</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400" />Bloke</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                <th scope="col" rowSpan={2} className="px-5 py-3 sm:px-6">{selectedDimension}</th>
                <th scope="colgroup" colSpan={2} className="px-3 py-2 text-center">Mevcut kadro</th>
                <th scope="colgroup" colSpan={2} className="px-3 py-2 text-center">Dolu</th>
                <th scope="colgroup" colSpan={2} className="px-3 py-2 text-center">Boş</th>
                <th scope="colgroup" colSpan={2} className="px-3 py-2 text-center">Bloke</th>
              </tr>
              <tr className="border-t border-slate-100 bg-slate-50/80 text-[10px] font-medium text-slate-500">
                <th scope="col" className="px-3 py-2 text-right">Sayı</th><th scope="col" className="px-3 py-2 text-right">Pay</th>
                <th scope="col" className="px-3 py-2 text-right">Sayı</th><th scope="col" className="px-3 py-2 text-right">Oran</th>
                <th scope="col" className="px-3 py-2 text-right">Sayı</th><th scope="col" className="px-3 py-2 text-right">Oran</th>
                <th scope="col" className="px-3 py-2 text-right">Sayı</th><th scope="col" className="px-5 py-2 text-right sm:px-6">Oran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groups.map((group) => {
                const ratio = (count: number) => group.total ? Math.round((count / group.total) * 100) : 0
                const share = total ? Math.round((group.total / total) * 100) : 0
                return <tr key={group.name} className="hover:bg-slate-50/70">
                  <th scope="row" className="max-w-[260px] px-5 py-3.5 text-left text-xs font-medium leading-relaxed text-slate-700 sm:px-6">{group.name}</th>
                  <td className="px-3 py-3.5 text-right text-xs font-semibold tabular-nums text-slate-800">{group.total}</td><td className="px-3 py-3.5 text-right text-xs tabular-nums text-slate-500">{share}%</td>
                  <td className="px-3 py-3.5 text-right text-xs tabular-nums text-slate-700">{group.filled}</td><td className="px-3 py-3.5 text-right text-xs tabular-nums text-teal-700">{ratio(group.filled)}%</td>
                  <td className="px-3 py-3.5 text-right text-xs tabular-nums text-slate-700">{group.vacant}</td><td className="px-3 py-3.5 text-right text-xs tabular-nums text-sky-700">{ratio(group.vacant)}%</td>
                  <td className="px-3 py-3.5 text-right text-xs tabular-nums text-slate-700">{group.blocked}</td><td className="px-5 py-3.5 text-right text-xs tabular-nums text-amber-700 sm:px-6">{ratio(group.blocked)}%</td>
                </tr>
              })}
              {!groups.length && <tr><td colSpan={9} className="px-6 py-10 text-center text-xs text-slate-500">Raporlanacak kadro kaydı bulunmuyor.</td></tr>}
            </tbody>
            <tfoot><tr className="border-t border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800">
              <th scope="row" className="px-5 py-3.5 text-left sm:px-6">Kurum geneli</th>
              <td className="px-3 py-3.5 text-right tabular-nums">{total}</td><td className="px-3 py-3.5 text-right tabular-nums">100%</td>
              <td className="px-3 py-3.5 text-right tabular-nums">{filled}</td><td className="px-3 py-3.5 text-right tabular-nums">{occupancy}%</td>
              <td className="px-3 py-3.5 text-right tabular-nums">{vacant}</td><td className="px-3 py-3.5 text-right tabular-nums">{total ? Math.round((vacant / total) * 100) : 0}%</td>
              <td className="px-3 py-3.5 text-right tabular-nums">{blocked}</td><td className="px-5 py-3.5 text-right tabular-nums sm:px-6">{total ? Math.round((blocked / total) * 100) : 0}%</td>
            </tr></tfoot>
          </table>
        </div>
        <p className="border-t border-slate-100 px-5 py-3 text-[10px] leading-relaxed text-slate-500 sm:px-6">Dolu, boş ve bloke oranları ilgili kırılımdaki mevcut kadroya göre; mevcut oranı kurum toplamına göre hesaplanır. Bloke kadrolar mevcut sayıya dahildir.</p>
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
