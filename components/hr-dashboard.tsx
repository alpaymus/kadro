"use client"

import { useMemo, useState, type FormEvent } from "react"
import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  FileBarChart,
  Eye,
  LayoutDashboard,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UsersRound,
  X,
} from "lucide-react"

type SlotStatus = "Boş" | "Dolu" | "Bloke"
type Slot = {
  id: string
  title: string
  department: string
  degree: string
  serviceClass?: string
  approvalDate?: string
  vacantCount?: number
  filledCount?: number
  statusCode?: string
  budgetCode?: string
  status: SlotStatus
  employee: string | null
  assignmentDutyType?: string
  assignmentDate?: string
  assignmentNumber?: string
  extraStatus?: string
  assignmentNotes?: string
  initials: string | null
  avatarTone: string
}

type BlockedRecord = {
  id: string
  slotId: string
  title: string
  department: string
  degree: string
  count: number
  processDate: string
  reason: string
  description: string
}

function getTodayDate() {
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  return today.toISOString().slice(0, 10)
}

const initialSlots: Slot[] = [
  { id: "KDR-2025-001", title: "Kıdemli Ürün Tasarımcısı", department: "Ürün & Tasarım", serviceClass: "Teknik Hizmetler", degree: "5. Derece", approvalDate: "2025-02-12", vacantCount: 1, filledCount: 3, statusCode: "AKTİF-01", status: "Dolu", employee: "Deniz Yılmaz", initials: "DY", avatarTone: "bg-violet-100 text-violet-700" },
  { id: "KDR-2025-002", title: "İK İş Ortağı", department: "İnsan & Kültür", serviceClass: "Genel İdare Hizmetleri", degree: "6. Derece", approvalDate: "2025-03-04", vacantCount: 2, filledCount: 0, statusCode: "AKTİF-02", status: "Boş", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-003", title: "Frontend Geliştirici", department: "Teknoloji", serviceClass: "Teknik Hizmetler", degree: "5. Derece", approvalDate: "2025-01-22", vacantCount: 0, filledCount: 2, statusCode: "AKTİF-01", status: "Dolu", employee: "Mert Aydın", initials: "MA", avatarTone: "bg-sky-100 text-sky-700" },
  { id: "KDR-2025-004", title: "Finans Uzmanı", department: "Finans", serviceClass: "Genel İdare Hizmetleri", degree: "6. Derece", approvalDate: "2025-04-16", vacantCount: 1, filledCount: 0, statusCode: "AKTİF-02", status: "Boş", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-005", title: "İş Analisti", department: "Ürün & Tasarım", serviceClass: "Teknik Hizmetler", degree: "7. Derece", approvalDate: "2025-05-08", vacantCount: 0, filledCount: 0, statusCode: "BLOKE-01", status: "Bloke", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-006", title: "Backend Geliştirici", department: "Teknoloji", serviceClass: "Teknik Hizmetler", degree: "5. Derece", approvalDate: "2025-02-27", vacantCount: 1, filledCount: 2, statusCode: "AKTİF-01", status: "Dolu", employee: "Ece Kaya", initials: "EK", avatarTone: "bg-amber-100 text-amber-700" },
  { id: "KDR-2025-007", title: "Pazarlama Uzmanı", department: "Pazarlama", serviceClass: "Genel İdare Hizmetleri", degree: "6. Derece", approvalDate: "2025-06-10", vacantCount: 1, filledCount: 0, statusCode: "AKTİF-02", status: "Boş", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-008", title: "Operasyon Yöneticisi", department: "Operasyon", serviceClass: "Genel İdare Hizmetleri", degree: "4. Derece", approvalDate: "2025-01-14", vacantCount: 0, filledCount: 1, statusCode: "AKTİF-01", status: "Dolu", employee: "Can Demir", initials: "CD", avatarTone: "bg-rose-100 text-rose-700" },
  { id: "KDR-2025-009", title: "Veri Analisti", department: "Teknoloji", serviceClass: "Teknik Hizmetler", degree: "6. Derece", approvalDate: "2025-07-03", vacantCount: 2, filledCount: 0, statusCode: "AKTİF-02", status: "Boş", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-010", title: "İşe Alım Uzmanı", department: "İnsan & Kültür", serviceClass: "Genel İdare Hizmetleri", degree: "6. Derece", approvalDate: "2025-03-21", vacantCount: 0, filledCount: 0, statusCode: "BLOKE-01", status: "Bloke", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-011", title: "Satış Yöneticisi", department: "Satış", serviceClass: "Genel İdare Hizmetleri", degree: "4. Derece", approvalDate: "2025-02-05", vacantCount: 0, filledCount: 2, statusCode: "AKTİF-01", status: "Dolu", employee: "Selin Aras", initials: "SA", avatarTone: "bg-teal-100 text-teal-700" },
  { id: "KDR-2025-012", title: "İç İletişim Uzmanı", department: "İnsan & Kültür", serviceClass: "Genel İdare Hizmetleri", degree: "7. Derece", approvalDate: "2025-08-19", vacantCount: 1, filledCount: 0, statusCode: "AKTİF-02", status: "Boş", employee: null, initials: null, avatarTone: "" },
]

type DashboardSection = "positions" | "assignments" | "blocked" | "degree-change" | "reports"

const navigation: { id: DashboardSection; label: string; icon: typeof BriefcaseBusiness }[] = [
  { id: "positions", label: "Kadro Yönetimi", icon: BriefcaseBusiness },
  { id: "assignments", label: "Personel Atama", icon: UsersRound },
  { id: "blocked", label: "Bloke Kadro", icon: ShieldCheck },
  { id: "degree-change", label: "Kadro Derece Değişikliği", icon: Settings2 },
  { id: "reports", label: "Raporlar", icon: FileBarChart },
]

function BrandMark() {
  return (
    <div className="flex items-center gap-3 px-6 py-6">
      <div className="flex size-9 items-center justify-center rounded-xl bg-teal-500 text-white shadow-sm shadow-teal-900/20">
        <Building2 aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-[15px] font-bold tracking-tight text-white">insight<span className="text-teal-400">HR</span></p>
        <p className="mt-0.5 text-[10px] font-medium tracking-[0.16em] text-slate-400">İNSAN KAYNAKLARI</p>
      </div>
    </div>
  )
}

function Sidebar({ activeSection, onNavigate }: { activeSection: DashboardSection; onNavigate: (section: DashboardSection) => void }) {
  return (
    <aside className="hidden min-h-screen w-[252px] shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 md:flex">
      <BrandMark />
      <div className="mx-5 mt-2 border-t border-slate-800" />
      <div className="px-5 pt-7">
        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-slate-500">ÇALIŞMA ALANI</p>
        <nav aria-label="Ana menü" className="flex flex-col gap-1">
          {navigation.map(({ id, label, icon: Icon }) => {
            const current = activeSection === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={current ? "page" : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${current ? "bg-teal-500/12 text-teal-300 ring-1 ring-inset ring-teal-400/15" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"}`}
              >
                <Icon aria-hidden="true" className={`size-[17px] ${current ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`} strokeWidth={1.8} />
                {label}
                {current && <span className="ml-auto size-1.5 rounded-full bg-teal-400" />}
              </button>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto px-5 pb-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
            <CircleHelp aria-hidden="true" className="size-4" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-100">Yardıma mı ihtiyacınız var?</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">İK operasyon ekibimiz size yardımcı olabilir.</p>
          <a href="#destek" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-300 hover:text-teal-200">Destek merkezi <ArrowUpRight aria-hidden="true" className="size-3" /></a>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-200">ZA</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-100">Zeynep Arslan</p>
            <p className="mt-0.5 text-[10px] text-slate-500">İK Yöneticisi</p>
          </div>
          <Settings2 aria-hidden="true" className="size-4 text-slate-500" />
        </div>
      </div>
    </aside>
  )
}

function StatCard({ label, value, helper, icon: Icon, tone, trend }: {
  label: string
  value: number
  helper: string
  icon: typeof UsersRound
  tone: "slate" | "teal" | "amber"
  trend?: string
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
  }
  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.04em] text-slate-900">{value}</p>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500">
        {trend && <span className="inline-flex items-center gap-0.5 font-semibold text-teal-700"><ArrowUpRight aria-hidden="true" className="size-3" />{trend}</span>}
        <span>{helper}</span>
      </div>
    </article>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-slate-700">
      {label}
      {children}
    </label>
  )
}

function FieldControl({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/15 ${className}`}>{children}</span>
}

function getVacantCount(slot: Slot) {
  return slot.vacantCount ?? (slot.status === "Boş" ? 1 : 0)
}

function getFilledCount(slot: Slot) {
  return slot.filledCount ?? (slot.status === "Dolu" ? 1 : 0)
}

export default function HrDashboard() {
  const [slots, setSlots] = useState(initialSlots)
  const [blockedRecords, setBlockedRecords] = useState<BlockedRecord[]>(() => initialSlots.filter((slot) => slot.status === "Bloke").map((slot) => ({ id: slot.id, slotId: slot.id, title: slot.title, department: slot.department, degree: slot.degree, count: 1, processDate: slot.approvalDate ?? "", reason: "Geçici kadro blokesi", description: "Mevcut bloke kadro kaydı." })))
  const [blockForm, setBlockForm] = useState({ slotId: "", blockCount: "1", processDate: getTodayDate(), reason: "", description: "" })
  const [blockMessage, setBlockMessage] = useState("")
  const [degreeChangeSlotId, setDegreeChangeSlotId] = useState("")
  const [newDegree, setNewDegree] = useState("")
  const [degreeChangeMessage, setDegreeChangeMessage] = useState("")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tümü")
  const [formMessage, setFormMessage] = useState("")
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [form, setForm] = useState({ unit: "", title: "", serviceClass: "", degree: "", approvalDate: "", vacantCount: "1", filledCount: "0", statusCode: "AKTİF" })
  const [activeSection, setActiveSection] = useState<DashboardSection>("positions")
  const [assignmentSlotId, setAssignmentSlotId] = useState("")
  const [employeeName, setEmployeeName] = useState("")
  const [assignmentDutyType, setAssignmentDutyType] = useState("Kadro")
  const [assignmentDate, setAssignmentDate] = useState("")
  const [assignmentNumber, setAssignmentNumber] = useState("")
  const [extraStatus, setExtraStatus] = useState("")
  const [assignmentNotes, setAssignmentNotes] = useState("")
  const [assignmentMessage, setAssignmentMessage] = useState("")

  const totals = useMemo(() => {
    const vacant = slots.reduce((sum, slot) => sum + getVacantCount(slot), 0)
    const filled = slots.reduce((sum, slot) => sum + getFilledCount(slot), 0)
    const blocked = blockedRecords.reduce((sum, record) => sum + record.count, 0)
    return { total: vacant + filled + blocked, vacant, filled, blocked }
  }, [blockedRecords, slots])
  const vacantSlots = useMemo(() => slots.filter((slot) => getVacantCount(slot) > 0 && slot.status !== "Bloke"), [slots])
  const blockableSlots = useMemo(() => slots.filter((slot) => getVacantCount(slot) > 0 && slot.status !== "Bloke"), [slots])
  const selectedBlockSlot = slots.find((slot) => slot.id === blockForm.slotId)
  const degreeChangeSlots = useMemo(() => slots.filter((slot) => slot.employee && getFilledCount(slot) > 0), [slots])
  const selectedDegreeChangeSlot = degreeChangeSlots.find((slot) => slot.id === degreeChangeSlotId)
  const degreeOptions = Array.from({ length: 15 }, (_, index) => `${index + 1}. Derece`)
  const departmentStats = useMemo(() => {
    const counts = new Map<string, number>()
    slots.forEach((slot) => counts.set(slot.department, (counts.get(slot.department) ?? 0) + getVacantCount(slot) + getFilledCount(slot)))
    blockedRecords.forEach((record) => counts.set(record.department, (counts.get(record.department) ?? 0) + record.count))
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [blockedRecords, slots])

  const filteredSlots = useMemo(() => slots.filter((slot) => {
    const matchesQuery = `${slot.id} ${slot.title} ${slot.department} ${slot.serviceClass ?? ""} ${slot.degree} ${slot.statusCode ?? ""} ${slot.employee ?? ""}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"))
    const matchesStatus = statusFilter === "Tümü" || slot.status === statusFilter
    return matchesQuery && matchesStatus
  }), [query, slots, statusFilter])

  const sectionCopy = {
    positions: { title: "Kadro yönetimi", subtitle: "Kurumunuzun kadro planını tek bir yerden yönetin." },
  assignments: { title: "Personel atama", subtitle: "Boş kadroları çalışanlarla eşleştirin ve atamaları yönetin." },
  blocked: { title: "Bloke Kadro", subtitle: "Geçici olarak kullanıma kapalı kadroları ve durum bilgilerini inceleyin." },
  "degree-change": { title: "Kadro Derece Değişikliği", subtitle: "Kadro derecelerini güncelleyin ve değişiklikleri yönetin." },
  reports: { title: "Raporlar", subtitle: "Organizasyon kadronuzun güncel dağılımını ve durumunu inceleyin." },
  }[activeSection]

  function handleBlockSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const slot = slots.find((item) => item.id === blockForm.slotId)
    const count = Number(blockForm.blockCount)
    const availableCount = slot ? getVacantCount(slot) : 0
    const reason = blockForm.reason.trim()

    if (!slot || !Number.isInteger(count) || count < 1 || count > availableCount || !blockForm.processDate || !reason) {
      setBlockMessage("Lütfen geçerli bir kadro, bloke sayısı, işlem tarihi ve sebep girin.")
      return
    }

    const remainingVacant = availableCount - count
    setSlots((current) => current.map((item) => item.id !== slot.id ? item : {
      ...item,
      vacantCount: remainingVacant,
      status: remainingVacant > 0 ? "Boş" : getFilledCount(item) > 0 ? "Dolu" : "Bloke",
    }))
    setBlockedRecords((current) => [...current, {
      id: `${slot.id}-BLK-${Date.now()}`,
      slotId: slot.id,
      title: slot.title,
      department: slot.department,
      degree: slot.degree,
      count,
      processDate: blockForm.processDate,
      reason,
      description: blockForm.description.trim(),
    }])
    setBlockMessage(`${slot.title} kadrosundan ${count} adet bloke edildi.`)
    setBlockForm({ slotId: "", blockCount: "1", processDate: getTodayDate(), reason: "", description: "" })
  }

  function handleDegreeChangeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const slot = degreeChangeSlots.find((item) => item.id === degreeChangeSlotId)
    if (!slot || !newDegree || newDegree === slot.degree) {
      setDegreeChangeMessage("Lütfen kadro için mevcut dereceden farklı yeni bir derece seçin.")
      return
    }

    setSlots((current) => current.map((item) => item.id === slot.id ? { ...item, degree: newDegree } : item))
    setDegreeChangeMessage(`${slot.title} kadrosunun derecesi ${newDegree} olarak güncellendi.`)
    setDegreeChangeSlotId("")
    setNewDegree("")
  }

  function handleAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = employeeName.trim()
    const number = assignmentNumber.trim()
    if (!assignmentSlotId || !name || !assignmentDate || !number) return
    setSlots((current) => current.map((slot) => {
      if (slot.id !== assignmentSlotId) return slot
      const nextVacantCount = Math.max(0, getVacantCount(slot) - 1)
      const nextFilledCount = getFilledCount(slot) + 1
      return {
        ...slot,
        status: nextVacantCount > 0 ? "Boş" : "Dolu",
        vacantCount: nextVacantCount,
        filledCount: nextFilledCount,
        employee: name,
        assignmentDutyType,
        assignmentDate,
        assignmentNumber: number,
        extraStatus: extraStatus.trim(),
        assignmentNotes: assignmentNotes.trim(),
        initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("tr-TR"),
        avatarTone: "bg-teal-100 text-teal-700",
      }
    }))
    setAssignmentMessage(`${name}, seçilen kadroya başarıyla atandı.`)
    setEmployeeName("")
    setAssignmentDutyType("Kadro")
    setAssignmentDate("")
    setAssignmentNumber("")
    setExtraStatus("")
    setAssignmentNotes("")
    setAssignmentSlotId("")
  }

  function handleExport() {
    const columns = ["Kadro ID", "Birimi", "Kadro Ünvanı", "Hizmet Sınıfı", "Kadro Derecesi", "Onay Tarihi", "Boş Kadro Sayısı", "Dolu Kadro Sayısı", "Durum Kodu", "Durum", "Atanmış Personel"]
    const rows = slots.map((slot) => [slot.id, slot.department, slot.title, slot.serviceClass ?? "", slot.degree, slot.approvalDate ?? "", getVacantCount(slot), getFilledCount(slot), slot.statusCode ?? "", slot.status, slot.employee ?? "Atama bekliyor"])
    const csv = "\uFEFF" + [columns, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "kadro-raporu.csv"
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function resetForm() {
    setForm({ unit: "", title: "", serviceClass: "", degree: "", approvalDate: "", vacantCount: "1", filledCount: "0", statusCode: "AKTİF" })
    setEditingSlotId(null)
  }

  function startEditing(slot: Slot) {
    setEditingSlotId(slot.id)
    setForm({
      unit: slot.department,
      title: slot.title,
      serviceClass: slot.serviceClass ?? "",
      degree: slot.degree,
      approvalDate: slot.approvalDate ?? "",
      vacantCount: String(getVacantCount(slot)),
      filledCount: String(getFilledCount(slot)),
      statusCode: slot.statusCode ?? "",
    })
    setFormMessage(`${slot.id} düzenleme için forma yüklendi.`)
    document.getElementById("new-cadre-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const vacantCount = Number(form.vacantCount)
    const filledCount = Number(form.filledCount)
    const status: SlotStatus = vacantCount > 0 ? "Boş" : filledCount > 0 ? "Dolu" : "Bloke"
    const updatedFields = {
      title: form.title.trim(),
      department: form.unit,
      degree: form.degree,
      serviceClass: form.serviceClass.trim(),
      approvalDate: form.approvalDate,
      vacantCount,
      filledCount,
      statusCode: form.statusCode.trim().toLocaleUpperCase("tr-TR"),
      status,
    }

    if (editingSlotId) {
      setSlots((current) => current.map((slot) => slot.id === editingSlotId ? { ...slot, ...updatedFields } : slot))
      setFormMessage(`${editingSlotId} numaralı kadro güncellendi.`)
      resetForm()
      return
    }

    const nextId = `KDR-2025-${String(slots.length + 1).padStart(3, "0")}`
    setSlots((current) => [{
      id: nextId,
      ...updatedFields,
      employee: null,
      initials: null,
      avatarTone: "",
    }, ...current])
    resetForm()
    setFormMessage(`${nextId} numaralı kadro başarıyla oluşturuldu.`)
  }

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-slate-900 md:flex">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main id="kadro-yonetimi" className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-teal-500 text-white md:hidden"><Building2 aria-hidden="true" className="size-[18px]" /></div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">İnsan & Kültür <span className="px-1 text-slate-300">/</span> {sectionCopy.title}</p>
                <h1 className="mt-0.5 text-[14px] font-semibold text-slate-800">{sectionCopy.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button type="button" aria-label="Bildirimler" className="relative flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
                <Bell aria-hidden="true" className="size-[17px]" strokeWidth={1.8} />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-teal-500 ring-2 ring-white" />
              </button>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <button type="button" className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-1.5 text-left hover:bg-slate-50">
                <span className="flex size-8 items-center justify-center rounded-full bg-teal-100 text-[11px] font-bold text-teal-800">ZA</span>
                <span className="hidden text-xs font-medium text-slate-700 sm:block">Zeynep Arslan</span>
                <ChevronDown aria-hidden="true" className="hidden size-3.5 text-slate-400 sm:block" />
              </button>
            </div>
          </div>
          <nav aria-label="Mobil menü" className="flex gap-1 overflow-x-auto border-t border-slate-100 px-5 py-2 md:hidden">
            {navigation.map(({ id, label, icon: Icon }) => {
              const current = activeSection === id
              return <button key={id} type="button" onClick={() => setActiveSection(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${current ? "bg-teal-50 text-teal-800" : "text-slate-500 hover:bg-slate-50"}`} aria-current={current ? "page" : undefined}><Icon aria-hidden="true" className="size-3.5" />{label}</button>
            })}
          </nav>
        </header>

        <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <section aria-labelledby="page-title" className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-800"><span className="size-1.5 rounded-full bg-teal-500" /> 2025 ORGANİZASYON PLANI</div>
              <h2 id="page-title" className="text-[26px] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[30px]">{sectionCopy.title}</h2>
              <p className="mt-1.5 text-[13px] text-slate-500">{sectionCopy.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleExport} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"><ArrowDownToLine aria-hidden="true" className="size-3.5" /> Dışa aktar</button>
              <button type="button" onClick={() => setActiveSection("positions")} className="inline-flex h-9 items-center gap-2 rounded-lg bg-teal-700 px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800"><Plus aria-hidden="true" className="size-3.5" /> Yeni kadro</button>
            </div>
          </section>

          <section aria-label="Kadro istatistikleri" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <StatCard label="Toplam kadro" value={totals.total} helper="Aktif organizasyon kadrosu" icon={UsersRound} tone="slate" trend="%8,2" />
            <StatCard label="Boş kadro" value={totals.vacant} helper="Atama bekleyen pozisyon" icon={BriefcaseBusiness} tone="teal" />
            <StatCard label="Dolu kadro" value={totals.filled} helper="Personel atanmış kadro" icon={UsersRound} tone="slate" />
            <StatCard label="Bloke kadro" value={totals.blocked} helper="Geçici olarak kullanıma kapalı" icon={ShieldCheck} tone="amber" />
          </section>

          {activeSection === "positions" ? (
          <section className="grid grid-cols-1 items-start gap-5">
            <article id="yeni-kadro" className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] xl:max-w-[760px]">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Plus aria-hidden="true" className="size-[18px]" /></div>
                  <div><h3 className="text-[14px] font-semibold text-slate-900">{editingSlotId ? "Kadroyu güncelle" : "Yeni kadro tanımlama"}</h3><p className="mt-1 text-[11px] text-slate-500">{editingSlotId ? `${editingSlotId} için bilgileri düzenleyin.` : "Organizasyonunuza yeni bir pozisyon ekleyin."}</p></div>
                </div>
              </div>
              <form id="new-cadre-form" onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:px-6 sm:py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Birimi">
                    <FieldControl><Building2 aria-hidden="true" className="mr-2 size-3.5 shrink-0 text-slate-400" /><select required value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} className="w-full appearance-none bg-transparent text-xs text-slate-700 outline-none"><option value="" disabled>Birim seçin</option>{["İnsan & Kültür", "Teknoloji", "Ürün & Tasarım", "Finans", "Pazarlama", "Operasyon", "Satış"].map((item) => <option key={item}>{item}</option>)}</select><ChevronDown aria-hidden="true" className="ml-2 size-3.5 shrink-0 text-slate-400" /></FieldControl>
                  </FormField>
                  <FormField label="Kadro Ünvanı"><FieldControl><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Örn. Kıdemli ürün uzmanı" className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" /></FieldControl></FormField>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Hizmet Sınıfı"><FieldControl><input required value={form.serviceClass} onChange={(event) => setForm({ ...form, serviceClass: event.target.value })} placeholder="Örn. Genel İdare Hizmetleri" className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" /></FieldControl></FormField>
                  <FormField label="Kadro Derecesi"><FieldControl><select required value={form.degree} onChange={(event) => setForm({ ...form, degree: event.target.value })} className="w-full appearance-none bg-transparent text-xs text-slate-700 outline-none"><option value="" disabled>Derece seçin</option>{["3. Derece", "4. Derece", "5. Derece", "6. Derece", "7. Derece", "8. Derece"].map((item) => <option key={item}>{item}</option>)}</select><ChevronDown aria-hidden="true" className="ml-2 size-3.5 shrink-0 text-slate-400" /></FieldControl></FormField>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Onay Tarihi"><FieldControl><input required type="date" value={form.approvalDate} onChange={(event) => setForm({ ...form, approvalDate: event.target.value })} className="w-full min-w-0 bg-transparent text-xs text-slate-700 outline-none" /></FieldControl></FormField>
                  <FormField label="Durum Kodu"><FieldControl><input required maxLength={40} value={form.statusCode} onChange={(event) => setForm({ ...form, statusCode: event.target.value })} placeholder="Örn. AKTİF-01" className="w-full bg-transparent text-xs uppercase text-slate-700 outline-none placeholder:normal-case placeholder:text-slate-400" /></FieldControl></FormField>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Boş Kadro Sayısı"><FieldControl><input required type="number" min="0" step="1" inputMode="numeric" value={form.vacantCount} onChange={(event) => setForm({ ...form, vacantCount: event.target.value })} className="w-full bg-transparent text-xs text-slate-700 outline-none" /></FieldControl></FormField>
                  <FormField label="Dolu Kadro Sayısı"><FieldControl><input required type="number" min="0" step="1" inputMode="numeric" value={form.filledCount} onChange={(event) => setForm({ ...form, filledCount: event.target.value })} className="w-full bg-transparent text-xs text-slate-700 outline-none" /></FieldControl></FormField>
                </div>
                <div className="mt-1 border-t border-slate-100 pt-4">
                  {formMessage && <p role="status" className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-teal-700"><Check aria-hidden="true" className="size-3.5" />{formMessage}</p>}
                  <button type="submit" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"><Check aria-hidden="true" className="size-3.5" /> {editingSlotId ? "Değişiklikleri kaydet" : "Kadroyu oluştur"}</button>
                  {editingSlotId && <button type="button" onClick={() => { resetForm(); setFormMessage("Düzenleme iptal edildi.") }} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-xs font-medium text-slate-600 transition hover:bg-slate-50"><X aria-hidden="true" className="size-3.5" /> Düzenlemeden vazgeç</button>}
                  <p className="mt-3 text-center text-[10px] text-slate-400">Durum, boş ve dolu kadro sayılarına göre belirlenir.</p>
                </div>
              </form>
            </article>

            <article className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div><h3 className="text-[14px] font-semibold text-slate-900">Mevcut kadro slotları</h3><p className="mt-1 text-[11px] text-slate-500">Pozisyonların güncel durum ve atama bilgileri.</p></div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex h-8 min-w-[155px] flex-1 items-center gap-2 rounded-lg border border-slate-200 px-2.5 sm:flex-none"><Search aria-hidden="true" className="size-3.5 shrink-0 text-slate-400" /><span className="sr-only">Kadrolarda ara</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kadrolarda ara..." className="w-full min-w-0 bg-transparent text-[11px] text-slate-700 outline-none placeholder:text-slate-400" /></label>
                  <label className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-[11px] text-slate-600"><SlidersHorizontal aria-hidden="true" className="size-3.5 text-slate-400" /><span className="sr-only">Duruma göre filtrele</span><select aria-label="Duruma göre filtrele" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="max-w-[82px] bg-transparent font-medium outline-none"><option>Tümü</option><option>Boş</option><option>Dolu</option><option>Bloke</option></select></label>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1260px] border-collapse text-left">
                  <thead><tr className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400"><th scope="col" className="px-5 py-3 font-semibold sm:px-6">Kadro ID</th><th scope="col" className="px-3 py-3 font-semibold">Birimi</th><th scope="col" className="px-3 py-3 font-semibold">Kadro Ünvanı</th><th scope="col" className="px-3 py-3 font-semibold">Hizmet Sınıfı</th><th scope="col" className="px-3 py-3 font-semibold">Kadro Derecesi</th><th scope="col" className="px-3 py-3 font-semibold">Onay Tarihi</th><th scope="col" className="px-3 py-3 font-semibold">Boş Kadro Sayısı</th><th scope="col" className="px-3 py-3 font-semibold">Dolu Kadro Sayısı</th><th scope="col" className="px-3 py-3 font-semibold">Durum Kodu</th><th scope="col" className="px-3 py-3 text-right font-semibold">İşlemler</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSlots.map((slot) => <tr key={slot.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[10px] font-medium text-slate-500 sm:px-6">{slot.id}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[11px] text-slate-700">{slot.department}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold text-slate-800">{slot.title}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[11px] text-slate-700">{slot.serviceClass ?? "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[11px] text-slate-700">{slot.degree}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[11px] text-slate-700">{slot.approvalDate ? slot.approvalDate.split("-").reverse().join(".") : "—"}</td>
                      <td className="px-4 py-3.5 text-[11px] font-semibold text-teal-700">{getVacantCount(slot)}</td>
                      <td className="px-4 py-3.5 text-[11px] font-semibold text-slate-700">{getFilledCount(slot)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[10px] text-slate-600">{slot.statusCode || "—"}</td>
                      <td className="px-3 py-3.5"><div className="flex items-center justify-end gap-1.5"><button type="button" onClick={() => setSelectedSlot(slot)} aria-label={`${slot.title} kadrosunu görüntüle`} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-2 text-[10px] font-medium text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"><Eye aria-hidden="true" className="size-3.5" />Görüntüle</button><button type="button" onClick={() => startEditing(slot)} aria-label={`${slot.title} kadrosunu güncelle`} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-2 text-[10px] font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><Pencil aria-hidden="true" className="size-3.5" />Güncelle</button><button type="button" onClick={() => { if (window.confirm(`${slot.title} kadrosunu silmek istediğinizden emin misiniz?`)) { setSlots((current) => current.filter((item) => item.id !== slot.id)); if (editingSlotId === slot.id) resetForm() } }} aria-label={`${slot.title} kadrosunu sil`} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-rose-200 px-2 text-[10px] font-medium text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"><Trash2 aria-hidden="true" className="size-3.5" />Sil</button></div></td>
                    </tr>)}
                    {filteredSlots.length === 0 && <tr><td colSpan={10} className="px-6 py-12 text-center"><div className="mx-auto flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Search aria-hidden="true" className="size-4" /></div><p className="mt-3 text-xs font-medium text-slate-700">Sonuç bulunamadı</p><p className="mt-1 text-[11px] text-slate-400">Arama veya filtre kriterlerinizi değiştirmeyi deneyin.</p></td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 sm:px-6">
                <p className="text-[10px] text-slate-500"><span className="font-semibold text-slate-700">{filteredSlots.length}</span> kadro listeleniyor</p>
                <span className="text-[10px] text-slate-400">Son güncelleme: bugün, 09:42</span>
              </div>
            </article>
            {selectedSlot && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedSlot(null) }}>
              <section role="dialog" aria-modal="true" aria-labelledby="slot-details-title" className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div><p className="font-mono text-[10px] font-semibold tracking-wide text-teal-700">{selectedSlot.id}</p><h3 id="slot-details-title" className="mt-1 text-lg font-semibold text-slate-900">{selectedSlot.title}</h3><p className="mt-1 text-xs text-slate-500">Kadro bilgileri ve güncel atama durumu</p></div>
                  <button type="button" onClick={() => setSelectedSlot(null)} aria-label="Ayrıntı penceresini kapat" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"><X aria-hidden="true" className="size-4" /></button>
                </div>
                <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[["Birimi", selectedSlot.department], ["Hizmet sınıfı", selectedSlot.serviceClass || "—"], ["Kadro derecesi", selectedSlot.degree], ["Onay tarihi", selectedSlot.approvalDate ? selectedSlot.approvalDate.split("-").reverse().join(".") : "—"], ["Boş kadro sayısı", String(getVacantCount(selectedSlot))], ["Dolu kadro sayısı", String(getFilledCount(selectedSlot))], ["Durum kodu", selectedSlot.statusCode || "—"], ["Atanmış personel", selectedSlot.employee || "Atama bekliyor"]].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 px-3.5 py-3"><dt className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd></div>)}
                </dl>
                <div className="mt-5 flex items-center justify-between"><StatusBadge status={selectedSlot.status} /><button type="button" onClick={() => setSelectedSlot(null)} className="rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">Kapat</button></div>
              </section>
            </div>}
          </section>
          ) : activeSection === "assignments" ? (
            <section className="grid grid-cols-1 items-start gap-5">
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                <div className="border-b border-teal-100/80 bg-gradient-to-br from-teal-50/90 via-white to-white px-5 py-5 sm:px-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white text-teal-700 shadow-sm shadow-teal-900/5"><UsersRound aria-hidden="true" className="size-5" /></div>
                      <div className="min-w-0 pt-0.5"><p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-teal-700">Personel işlemleri</p><h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Yeni personel ataması</h3><p className="mt-1 text-[11px] leading-relaxed text-slate-500">Çalışan ve kadro bilgilerini girerek atamayı oluşturun.</p><span className="mt-2 inline-flex rounded-full border border-teal-100 bg-white/80 px-2.5 py-1 text-[9px] font-semibold text-teal-700">{vacantSlots.length} boş kadro</span></div>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleAssignment} className="flex flex-col gap-5 p-5 sm:p-6">
                  <FormField label="Boş kadro">
                    <FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><select required value={assignmentSlotId} onChange={(event) => setAssignmentSlotId(event.target.value)} disabled={vacantSlots.length === 0} className="w-full appearance-none bg-transparent text-[13px] text-slate-700 outline-none disabled:text-slate-400"><option value="" disabled>{vacantSlots.length ? "Kadro seçin" : "Atanabilir boş kadro yok"}</option>{vacantSlots.map((slot) => <option key={slot.id} value={slot.id}>{slot.id} · {slot.title}</option>)}</select><ChevronDown aria-hidden="true" className="ml-2 size-3.5 shrink-0 text-slate-400" /></FieldControl>
                  </FormField>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <FormField label="Personel Adı ve Soyadı"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><input required maxLength={100} value={employeeName} onChange={(event) => setEmployeeName(event.target.value)} placeholder="Örn. Ayşe Demir" className="w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400" /></FieldControl></FormField>
                    <FormField label="Kadro/Fiili Görev"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><select required value={assignmentDutyType} onChange={(event) => setAssignmentDutyType(event.target.value)} className="w-full appearance-none bg-transparent text-[13px] text-slate-700 outline-none"><option value="Kadro">Kadro</option><option value="Fiili Görev">Fiili Görev</option></select><ChevronDown aria-hidden="true" className="ml-2 size-3.5 shrink-0 text-slate-400" /></FieldControl></FormField>
                    <FormField label="Atama Tarihi"><FieldControl className="h-11 min-w-0 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><input required type="date" value={assignmentDate} onChange={(event) => setAssignmentDate(event.target.value)} className="w-full min-w-0 bg-transparent text-[13px] text-slate-700 outline-none" /></FieldControl></FormField>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <FormField label="Atama No"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><input required maxLength={40} value={assignmentNumber} onChange={(event) => setAssignmentNumber(event.target.value)} placeholder="Örn. ATA-2025-001" className="w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400" /></FieldControl></FormField>
                    <FormField label="Ekstra Durum"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><input maxLength={100} value={extraStatus} onChange={(event) => setExtraStatus(event.target.value)} placeholder="Varsa ek durumu belirtin" className="w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400" /></FieldControl></FormField>
                    <FormField label="Açıklama"><textarea maxLength={500} value={assignmentNotes} onChange={(event) => setAssignmentNotes(event.target.value)} placeholder="Atamayla ilgili açıklama ekleyin" rows={2} className="w-full min-h-11 resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" /></FormField>
                  </div>
                  {assignmentMessage && <p role="status" className="rounded-xl border border-teal-100 bg-teal-50 px-3.5 py-3 text-[11px] font-medium text-teal-800">{assignmentMessage}</p>}
                  <button type="submit" disabled={!vacantSlots.length || !assignmentSlotId || !employeeName.trim() || !assignmentDate || !assignmentNumber.trim()} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-[13px] font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-45"><Check aria-hidden="true" className="size-4" />Personeli ata</button>
                </form>
              </article>
              <article className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h3 className="text-[14px] font-semibold text-slate-900">Mevcut personel atamaları</h3><p className="mt-1 text-[11px] text-slate-500">Dolu kadrolarda görev yapan çalışanlar.</p></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[1120px] border-collapse text-left"><thead><tr className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400"><th scope="col" className="px-5 py-3 font-semibold sm:px-6">Personel Adı ve Soyadı</th><th scope="col" className="px-4 py-3 font-semibold">Kadro Ünvanı</th><th scope="col" className="px-4 py-3 font-semibold">Birimi</th><th scope="col" className="px-4 py-3 font-semibold">Kadro/Fiili Görev</th><th scope="col" className="px-4 py-3 font-semibold">Atama Tarihi</th><th scope="col" className="px-4 py-3 font-semibold">Atama No</th><th scope="col" className="px-4 py-3 font-semibold">Ekstra Durum</th><th scope="col" className="px-4 py-3 font-semibold">Açıklama</th><th scope="col" className="px-4 py-3 font-semibold">Durum</th></tr></thead><tbody className="divide-y divide-slate-100">{slots.filter((slot) => slot.employee !== null).map((slot) => <tr key={slot.id} className="hover:bg-slate-50/70"><td className="px-5 py-3.5 sm:px-6"><div className="flex items-center gap-2"><span className={`flex size-7 items-center justify-center rounded-full text-[9px] font-semibold ${slot.avatarTone || "bg-teal-100 text-teal-700"}`}>{slot.initials}</span><span className="whitespace-nowrap text-[11px] font-medium text-slate-700">{slot.employee}</span></div></td><td className="px-4 py-3.5"><p className="text-[11px] font-semibold text-slate-800">{slot.title}</p><p className="mt-1 font-mono text-[9px] text-slate-400">{slot.id}</p></td><td className="px-4 py-3.5 text-[11px] text-slate-600">{slot.department}</td><td className="px-4 py-3.5 text-[11px] text-slate-600">{slot.assignmentDutyType || "—"}</td><td className="whitespace-nowrap px-4 py-3.5 text-[11px] text-slate-600">{slot.assignmentDate ? slot.assignmentDate.split("-").reverse().join(".") : "—"}</td><td className="px-4 py-3.5 font-mono text-[10px] text-slate-600">{slot.assignmentNumber || "—"}</td><td className="px-4 py-3.5 text-[11px] text-slate-600">{slot.extraStatus || "—"}</td><td className="max-w-[220px] px-4 py-3.5 text-[11px] text-slate-600"><span className="block truncate" title={slot.assignmentNotes || undefined}>{slot.assignmentNotes || "—"}</span></td><td className="px-4 py-3.5"><StatusBadge status={slot.status} /></td></tr>)}{slots.every((slot) => getFilledCount(slot) === 0) && <tr><td colSpan={9} className="px-6 py-12 text-center text-xs text-slate-500">Henüz personel ataması bulunmuyor.</td></tr>}</tbody></table></div>
                <div className="border-t border-slate-100 px-5 py-3.5 text-[10px] text-slate-500 sm:px-6">{totals.filled} dolu kadro sayısı</div>
              </article>
            </section>
          ) : activeSection === "blocked" ? (
            <section aria-labelledby="blocked-entry-title" className="grid grid-cols-1 items-start gap-5">
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
                <div className="flex items-start gap-3.5 border-b border-amber-100 bg-gradient-to-br from-amber-50/80 via-white to-white px-5 py-5 sm:px-6">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-white text-amber-700 shadow-sm"><ShieldCheck aria-hidden="true" className="size-5" /></div>
                  <div><h3 id="blocked-entry-title" className="text-[15px] font-semibold tracking-tight text-slate-900">Bloke Kadro Ekleme</h3><p className="mt-1 text-[11px] text-slate-500">Boş kadro sayısından bloke edilecek miktarı belirleyin.</p></div>
                </div>
                <form onSubmit={handleBlockSubmit} className="flex flex-col gap-5 p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <FormField label="Kadro"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><select required value={blockForm.slotId} onChange={(event) => setBlockForm((current) => ({ ...current, slotId: event.target.value, blockCount: "1" }))} className="w-full appearance-none bg-transparent text-[13px] text-slate-700 outline-none"><option value="">Kadro seçin</option>{slots.filter((slot) => getVacantCount(slot) > 0 && slot.status !== "Bloke").map((slot) => <option key={slot.id} value={slot.id}>{slot.title} · {slot.id}</option>)}</select><ChevronDown aria-hidden="true" className="ml-2 size-3.5 shrink-0 text-slate-400" /></FieldControl></FormField>
                    <FormField label="Boş Kadro Sayısı"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-100/80 px-3.5"><input readOnly aria-label="Seçilen kadronun boş kadro sayısı" value={selectedBlockSlot ? getVacantCount(selectedBlockSlot) : "—"} className="w-full bg-transparent text-[13px] font-semibold text-slate-600 outline-none" /></FieldControl></FormField>
                    <FormField label="Bloke Edilecek Kadro Sayısı"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><input required type="number" min={1} max={selectedBlockSlot ? getVacantCount(selectedBlockSlot) : undefined} disabled={!selectedBlockSlot} value={blockForm.blockCount} onChange={(event) => setBlockForm((current) => ({ ...current, blockCount: event.target.value }))} className="w-full bg-transparent text-[13px] text-slate-700 outline-none disabled:cursor-not-allowed disabled:text-slate-400" /></FieldControl></FormField>
                    <FormField label="İşlem Tarihi"><FieldControl className="h-11 min-w-0 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><input required type="date" value={blockForm.processDate} onChange={(event) => setBlockForm((current) => ({ ...current, processDate: event.target.value }))} className="w-full min-w-0 bg-transparent text-[13px] text-slate-700 outline-none" /></FieldControl></FormField>
                    <FormField label="Sebep"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><input required maxLength={120} value={blockForm.reason} onChange={(event) => setBlockForm((current) => ({ ...current, reason: event.target.value }))} placeholder="Bloke sebebini girin" className="w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400" /></FieldControl></FormField>
                    <FormField label="Açıklama"><textarea maxLength={500} rows={1} value={blockForm.description} onChange={(event) => setBlockForm((current) => ({ ...current, description: event.target.value }))} placeholder="İsteğe bağlı açıklama ekleyin" className="min-h-11 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" /></FormField>
                  </div>
                  {blockMessage && <p role="status" className="rounded-xl border border-teal-100 bg-teal-50 px-3.5 py-3 text-[11px] font-medium text-teal-800">{blockMessage}</p>}
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[10px] text-slate-500">Bloke edilen miktar seçilen kadronun boş sayısından düşülür.</p><button type="submit" disabled={!blockableSlots.length || !blockForm.slotId || !blockForm.reason.trim() || !Number.isInteger(Number(blockForm.blockCount)) || Number(blockForm.blockCount) < 1 || Number(blockForm.blockCount) > (selectedBlockSlot ? getVacantCount(selectedBlockSlot) : 0)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 text-[13px] font-semibold text-white shadow-sm shadow-amber-900/10 transition hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-600/20 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"><ShieldCheck aria-hidden="true" className="size-4" />Bloke kadro ekle</button></div>
                </form>
              </article>
              <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h3 className="text-[14px] font-semibold text-slate-900">Bloke kadrolar</h3><p className="mt-1 text-[11px] text-slate-500">İşlem geçmişi ve bloke edilen kadro miktarları.</p></div><span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800"><span className="size-1.5 rounded-full bg-amber-500" />{totals.blocked} bloke kadro</span></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[1120px] border-collapse text-left"><thead><tr className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400"><th scope="col" className="px-5 py-3 font-semibold sm:px-6">Kadro ID</th><th scope="col" className="px-4 py-3 font-semibold">Kadro Ünvanı</th><th scope="col" className="px-4 py-3 font-semibold">Birimi</th><th scope="col" className="px-4 py-3 font-semibold">Derece</th><th scope="col" className="px-4 py-3 font-semibold">Bloke Sayısı</th><th scope="col" className="px-4 py-3 font-semibold">İşlem Tarihi</th><th scope="col" className="px-4 py-3 font-semibold">Sebep</th><th scope="col" className="px-4 py-3 font-semibold">Açıklama</th></tr></thead><tbody className="divide-y divide-slate-100">{blockedRecords.map((record) => <tr key={record.id} className="transition-colors hover:bg-amber-50/30"><td className="whitespace-nowrap px-5 py-4 font-mono text-[10px] font-medium text-slate-500 sm:px-6">{record.slotId}</td><td className="px-4 py-4 text-[11px] font-semibold text-slate-800">{record.title}</td><td className="px-4 py-4 text-[11px] text-slate-600">{record.department}</td><td className="whitespace-nowrap px-4 py-4 text-[11px] text-slate-600">{record.degree}</td><td className="px-4 py-4 text-[11px] font-semibold text-amber-800">{record.count}</td><td className="whitespace-nowrap px-4 py-4 text-[11px] text-slate-600">{record.processDate ? record.processDate.split("-").reverse().join(".") : "—"}</td><td className="px-4 py-4 text-[11px] text-slate-600">{record.reason}</td><td className="max-w-[240px] px-4 py-4 text-[11px] text-slate-500">{record.description || "—"}</td></tr>)}
                    {!blockedRecords.length && <tr><td colSpan={8} className="px-6 py-12 text-center"><div className="mx-auto flex size-10 items-center justify-center rounded-full bg-amber-50 text-amber-600"><ShieldCheck aria-hidden="true" className="size-5" /></div><p className="mt-3 text-xs font-medium text-slate-700">Bloke kadro bulunmuyor</p><p className="mt-1 text-[11px] text-slate-400">Eklediğiniz bloke kayıtları burada listelenir.</p></td></tr>}
                  </tbody></table></div>
                <div className="border-t border-slate-100 px-5 py-3.5 text-[10px] text-slate-500 sm:px-6">Toplam {totals.blocked} kadro geçici olarak kullanıma kapalı.</div>
              </article>
            </section>
          ) : activeSection === "degree-change" ? (
            <section aria-labelledby="degree-change-title" className="grid grid-cols-1 items-start gap-5">
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
                <div className="flex items-start gap-3.5 border-b border-teal-100 bg-gradient-to-br from-teal-50/80 via-white to-white px-5 py-5 sm:px-6">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white text-teal-700 shadow-sm"><Settings2 aria-hidden="true" className="size-5" /></div>
                  <div><h3 id="degree-change-title" className="text-[15px] font-semibold tracking-tight text-slate-900">Kadro Derece Değişikliği</h3><p className="mt-1 text-[11px] text-slate-500">Personelin mevcut kadro derecesini yeni bir dereceyle güncelleyin.</p></div>
                </div>
                <form onSubmit={handleDegreeChangeSubmit} className="flex flex-col gap-5 p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <FormField label="Kadro"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><select required value={degreeChangeSlotId} onChange={(event) => { setDegreeChangeSlotId(event.target.value); setNewDegree(""); setDegreeChangeMessage("") }} className="w-full appearance-none bg-transparent text-[13px] text-slate-700 outline-none"><option value="">Kadro seçin</option>{degreeChangeSlots.map((slot) => <option key={slot.id} value={slot.id}>{slot.title} · {slot.id}</option>)}</select><ChevronDown aria-hidden="true" className="ml-2 size-3.5 shrink-0 text-slate-400" /></FieldControl></FormField>
                    <FormField label="Personel Adı ve Soyadı"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-100/80 px-3.5"><input readOnly aria-label="Seçilen kadrodaki personel adı ve soyadı" value={selectedDegreeChangeSlot?.employee ?? "Kadro seçilmedi"} className="w-full bg-transparent text-[13px] font-medium text-slate-600 outline-none" /></FieldControl></FormField>
                    <FormField label="Kadro Derecesi"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-100/80 px-3.5"><input readOnly aria-label="Seçilen kadronun mevcut derecesi" value={selectedDegreeChangeSlot?.degree ?? "—"} className="w-full bg-transparent text-[13px] font-medium text-slate-600 outline-none" /></FieldControl></FormField>
                    <FormField label="Yeni Kadro Derecesi"><FieldControl className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 hover:border-slate-300 focus-within:bg-white"><select required disabled={!selectedDegreeChangeSlot} value={newDegree} onChange={(event) => setNewDegree(event.target.value)} className="w-full appearance-none bg-transparent text-[13px] text-slate-700 outline-none disabled:cursor-not-allowed disabled:text-slate-400"><option value="">Yeni derece seçin</option>{degreeOptions.filter((degree) => degree !== selectedDegreeChangeSlot?.degree).map((degree) => <option key={degree} value={degree}>{degree}</option>)}</select><ChevronDown aria-hidden="true" className="ml-2 size-3.5 shrink-0 text-slate-400" /></FieldControl></FormField>
                  </div>
                  {degreeChangeMessage && <p role="status" className="rounded-xl border border-teal-100 bg-teal-50 px-3.5 py-3 text-[11px] font-medium text-teal-800">{degreeChangeMessage}</p>}
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[10px] text-slate-500">Personel bilgileri seçilen dolu kadrodan otomatik olarak getirilir.</p><button type="submit" disabled={!selectedDegreeChangeSlot || !newDegree || newDegree === selectedDegreeChangeSlot?.degree} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-[13px] font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"><Check aria-hidden="true" className="size-4" />Dereceyi güncelle</button></div>
                </form>
              </article>
            </section>
          ) : (
            <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
              <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><div className="flex items-start gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><FileBarChart aria-hidden="true" className="size-[18px]" /></div><div><h3 className="text-[14px] font-semibold text-slate-900">Kadro durumu</h3><p className="mt-1 text-[11px] text-slate-500">Tüm kadro slotlarının güncel dağılımı.</p></div></div></div>
                <div className="flex flex-col gap-5 p-5 sm:px-6">
                  {[{ label: "Dolu", value: totals.filled, color: "bg-slate-500" }, { label: "Boş", value: totals.vacant, color: "bg-teal-500" }, { label: "Bloke", value: totals.blocked, color: "bg-amber-500" }].map((item) => <div key={item.label}><div className="mb-2 flex items-center justify-between text-[11px]"><span className="font-medium text-slate-600">{item.label}</span><span className="font-semibold text-slate-800">{item.value} <span className="font-normal text-slate-400">/ {totals.total}</span></span></div><div role="progressbar" aria-label={`${item.label} kadro oranı`} aria-valuemin={0} aria-valuemax={totals.total} aria-valuenow={item.value} className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${totals.total ? (item.value / totals.total) * 100 : 0}%` }} /></div></div>)}
                </div>
                <div className="border-t border-slate-100 px-5 py-3.5 text-[10px] text-slate-500 sm:px-6">Kadro kullanım oranı: <span className="font-semibold text-slate-700">{totals.total ? Math.round((totals.filled / totals.total) * 100) : 0}%</span></div>
              </article>
              <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h3 className="text-[14px] font-semibold text-slate-900">Birime göre dağılım</h3><p className="mt-1 text-[11px] text-slate-500">Kadro sayılarının organizasyon birimlerine göre görünümü.</p></div>
                <div className="flex flex-col gap-4 p-5 sm:px-6">{departmentStats.map(([department, count]) => <div key={department}><div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="font-medium text-slate-600">{department}</span><span className="font-semibold text-slate-800">{count}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${totals.total ? (count / totals.total) * 100 : 0}%` }} /></div></div>)}</div>
                <div className="border-t border-slate-100 px-5 py-3.5 text-[10px] text-slate-500 sm:px-6">Rapor, kadro ekranındaki güncel verilerden oluşturulur.</div>
              </article>
            </section>
          )}
          <footer className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-slate-200/80 pt-4 text-[10px] text-slate-400 sm:flex-row sm:items-center"><p>© 2025 insightHR <span className="px-1">·</span> İnsan kaynakları yönetim platformu</p><p>Güvenli ve güncel organizasyon yönetimi <ShieldCheck aria-hidden="true" className="ml-1 inline size-3" /></p></footer>
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: SlotStatus }) {
  const appearance = {
    Boş: "border-teal-100 bg-teal-50 text-teal-800 before:bg-teal-500",
    Dolu: "border-slate-200 bg-slate-100 text-slate-600 before:bg-slate-400",
    Bloke: "border-amber-100 bg-amber-50 text-amber-800 before:bg-amber-500",
  }
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-semibold ${appearance[status]}`}><span className={`size-1.5 rounded-full ${status === "Boş" ? "bg-teal-500" : status === "Bloke" ? "bg-amber-500" : "bg-slate-400"}`} />{status.toLocaleUpperCase("tr-TR")}</span>
}
