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
  LayoutDashboard,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react"

type SlotStatus = "Boş" | "Dolu" | "Bloke"
type Slot = {
  id: string
  title: string
  department: string
  degree: string
  budgetCode: string
  status: SlotStatus
  employee: string | null
  initials: string | null
  avatarTone: string
}

const initialSlots: Slot[] = [
  { id: "KDR-2025-001", title: "Kıdemli Ürün Tasarımcısı", department: "Ürün & Tasarım", degree: "5. Derece", budgetCode: "BR-2401", status: "Dolu", employee: "Deniz Yılmaz", initials: "DY", avatarTone: "bg-violet-100 text-violet-700" },
  { id: "KDR-2025-002", title: "İK İş Ortağı", department: "İnsan & Kültür", degree: "6. Derece", budgetCode: "BR-1102", status: "Boş", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-003", title: "Frontend Geliştirici", department: "Teknoloji", degree: "5. Derece", budgetCode: "BR-3204", status: "Dolu", employee: "Mert Aydın", initials: "MA", avatarTone: "bg-sky-100 text-sky-700" },
  { id: "KDR-2025-004", title: "Finans Uzmanı", department: "Finans", degree: "6. Derece", budgetCode: "BR-4101", status: "Boş", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-005", title: "İş Analisti", department: "Ürün & Tasarım", degree: "7. Derece", budgetCode: "BR-2403", status: "Bloke", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-006", title: "Backend Geliştirici", department: "Teknoloji", degree: "5. Derece", budgetCode: "BR-3206", status: "Dolu", employee: "Ece Kaya", initials: "EK", avatarTone: "bg-amber-100 text-amber-700" },
  { id: "KDR-2025-007", title: "Pazarlama Uzmanı", department: "Pazarlama", degree: "6. Derece", budgetCode: "BR-5102", status: "Boş", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-008", title: "Operasyon Yöneticisi", department: "Operasyon", degree: "4. Derece", budgetCode: "BR-6101", status: "Dolu", employee: "Can Demir", initials: "CD", avatarTone: "bg-rose-100 text-rose-700" },
  { id: "KDR-2025-009", title: "Veri Analisti", department: "Teknoloji", degree: "6. Derece", budgetCode: "BR-3208", status: "Boş", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-010", title: "İşe Alım Uzmanı", department: "İnsan & Kültür", degree: "6. Derece", budgetCode: "BR-1104", status: "Bloke", employee: null, initials: null, avatarTone: "" },
  { id: "KDR-2025-011", title: "Satış Yöneticisi", department: "Satış", degree: "4. Derece", budgetCode: "BR-7102", status: "Dolu", employee: "Selin Aras", initials: "SA", avatarTone: "bg-teal-100 text-teal-700" },
  { id: "KDR-2025-012", title: "İç İletişim Uzmanı", department: "İnsan & Kültür", degree: "7. Derece", budgetCode: "BR-1106", status: "Boş", employee: null, initials: null, avatarTone: "" },
]

const navigation = [
  { label: "Kadro Yönetimi", icon: BriefcaseBusiness, current: true },
  { label: "Personel Atama", icon: UsersRound, current: false },
  { label: "Raporlar", icon: FileBarChart, current: false },
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

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-[252px] shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 md:flex">
      <BrandMark />
      <div className="mx-5 mt-2 border-t border-slate-800" />
      <div className="px-5 pt-7">
        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-slate-500">ÇALIŞMA ALANI</p>
        <nav aria-label="Ana menü" className="flex flex-col gap-1">
          {navigation.map(({ label, icon: Icon, current }) => (
            <a
              key={label}
              href={current ? "#kadro-yonetimi" : `#${label.toLocaleLowerCase("tr-TR").replaceAll(" ", "-")}`}
              aria-current={current ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${current ? "bg-teal-500/12 text-teal-300 ring-1 ring-inset ring-teal-400/15" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"}`}
            >
              <Icon aria-hidden="true" className={`size-[17px] ${current ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`} strokeWidth={1.8} />
              {label}
              {current && <span className="ml-auto size-1.5 rounded-full bg-teal-400" />}
            </a>
          ))}
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

export default function HrDashboard() {
  const [slots, setSlots] = useState(initialSlots)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tümü")
  const [formMessage, setFormMessage] = useState("")
  const [form, setForm] = useState({ department: "", title: "", degree: "", budgetCode: "" })

  const totals = useMemo(() => ({
    total: slots.length,
    vacant: slots.filter((slot) => slot.status === "Boş").length,
    blocked: slots.filter((slot) => slot.status === "Bloke").length,
  }), [slots])

  const filteredSlots = useMemo(() => slots.filter((slot) => {
    const matchesQuery = `${slot.id} ${slot.title} ${slot.department} ${slot.employee ?? ""}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"))
    const matchesStatus = statusFilter === "Tümü" || slot.status === statusFilter
    return matchesQuery && matchesStatus
  }), [query, slots, statusFilter])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextId = `KDR-2025-${String(slots.length + 1).padStart(3, "0")}`
    setSlots((current) => [{
      id: nextId,
      title: form.title.trim(),
      department: form.department,
      degree: form.degree,
      budgetCode: form.budgetCode.trim().toLocaleUpperCase("tr-TR"),
      status: "Boş",
      employee: null,
      initials: null,
      avatarTone: "",
    }, ...current])
    setForm({ department: "", title: "", degree: "", budgetCode: "" })
    setFormMessage(`${nextId} numaralı kadro başarıyla oluşturuldu.`)
  }

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-slate-900 md:flex">
      <Sidebar />
      <main id="kadro-yonetimi" className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-teal-500 text-white md:hidden"><Building2 aria-hidden="true" className="size-[18px]" /></div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">İnsan & Kültür <span className="px-1 text-slate-300">/</span> Kadro yönetimi</p>
                <h1 className="mt-0.5 text-[14px] font-semibold text-slate-800">Organizasyon yapısı</h1>
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
            {navigation.map(({ label, icon: Icon, current }) => <a key={label} href={current ? "#kadro-yonetimi" : `#${label.toLocaleLowerCase("tr-TR").replaceAll(" ", "-")}`} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${current ? "bg-teal-50 text-teal-800" : "text-slate-500 hover:bg-slate-50"}`} aria-current={current ? "page" : undefined}><Icon aria-hidden="true" className="size-3.5" />{label}</a>)}
          </nav>
        </header>

        <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <section aria-labelledby="page-title" className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-800"><span className="size-1.5 rounded-full bg-teal-500" /> 2025 ORGANİZASYON PLANI</div>
              <h2 id="page-title" className="text-[26px] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[30px]">Kadro yönetimi</h2>
              <p className="mt-1.5 text-[13px] text-slate-500">Kurumunuzun kadro planını tek bir yerden yönetin.</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"><ArrowDownToLine aria-hidden="true" className="size-3.5" /> Dışa aktar</button>
              <a href="#yeni-kadro" className="inline-flex h-9 items-center gap-2 rounded-lg bg-teal-700 px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800"><Plus aria-hidden="true" className="size-3.5" /> Yeni kadro</a>
            </div>
          </section>

          <section aria-label="Kadro istatistikleri" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <StatCard label="Toplam kadro" value={totals.total} helper="Aktif organizasyon kadrosu" icon={UsersRound} tone="slate" trend="%8,2" />
            <StatCard label="Boş kadro" value={totals.vacant} helper="Atama bekleyen pozisyon" icon={BriefcaseBusiness} tone="teal" />
            <StatCard label="Bloke kadro" value={totals.blocked} helper="Geçici olarak kullanıma kapalı" icon={ShieldCheck} tone="amber" />
          </section>

          <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.55fr)]">
            <article id="yeni-kadro" className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Plus aria-hidden="true" className="size-[18px]" /></div>
                  <div><h3 className="text-[14px] font-semibold text-slate-900">Yeni kadro tanımlama</h3><p className="mt-1 text-[11px] text-slate-500">Organizasyonunuza yeni bir pozisyon ekleyin.</p></div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:px-6 sm:py-5">
                <FormField label="Departman">
                  <FieldControl><Building2 aria-hidden="true" className="mr-2 size-3.5 shrink-0 text-slate-400" /><select required value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="w-full appearance-none bg-transparent text-xs text-slate-700 outline-none"><option value="" disabled>Departman seçin</option>{["İnsan & Kültür", "Teknoloji", "Ürün & Tasarım", "Finans", "Pazarlama", "Operasyon", "Satış"].map((item) => <option key={item}>{item}</option>)}</select><ChevronDown aria-hidden="true" className="ml-2 size-3.5 shrink-0 text-slate-400" /></FieldControl>
                </FormField>
                <FormField label="Unvan"><FieldControl><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Örn. Kıdemli ürün uzmanı" className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" /></FieldControl></FormField>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Derece"><FieldControl><select required value={form.degree} onChange={(event) => setForm({ ...form, degree: event.target.value })} className="w-full appearance-none bg-transparent text-xs text-slate-700 outline-none"><option value="" disabled>Derece seçin</option>{["3. Derece", "4. Derece", "5. Derece", "6. Derece", "7. Derece", "8. Derece"].map((item) => <option key={item}>{item}</option>)}</select><ChevronDown aria-hidden="true" className="ml-2 size-3.5 shrink-0 text-slate-400" /></FieldControl></FormField>
                  <FormField label="Bütçe kodu"><FieldControl><input required value={form.budgetCode} onChange={(event) => setForm({ ...form, budgetCode: event.target.value })} placeholder="Örn. BR-2401" className="w-full bg-transparent text-xs uppercase text-slate-700 outline-none placeholder:normal-case placeholder:text-slate-400" /></FieldControl></FormField>
                </div>
                <div className="mt-1 border-t border-slate-100 pt-4">
                  {formMessage && <p role="status" className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-teal-700"><Check aria-hidden="true" className="size-3.5" />{formMessage}</p>}
                  <button type="submit" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"><Plus aria-hidden="true" className="size-3.5" /> Kadroyu oluştur</button>
                  <p className="mt-3 text-center text-[10px] text-slate-400">Oluşturulan kadro varsayılan olarak boş statüsünde açılır.</p>
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
                <table className="w-full min-w-[650px] border-collapse text-left">
                  <thead><tr className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400"><th scope="col" className="px-5 py-3 font-semibold sm:px-6">Kadro ID</th><th scope="col" className="px-4 py-3 font-semibold">Unvan</th><th scope="col" className="px-4 py-3 font-semibold">Durum</th><th scope="col" className="px-4 py-3 font-semibold">Atanmış personel</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSlots.map((slot) => <tr key={slot.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[10px] font-medium text-slate-500 sm:px-6">{slot.id}</td>
                      <td className="px-4 py-3.5"><p className="whitespace-nowrap text-[11px] font-semibold text-slate-800">{slot.title}</p><p className="mt-1 text-[10px] text-slate-400">{slot.department} <span className="px-0.5 text-slate-300">·</span> {slot.degree}</p></td>
                      <td className="px-4 py-3.5"><StatusBadge status={slot.status} /></td>
                      <td className="px-4 py-3.5">{slot.employee ? <div className="flex items-center gap-2"><span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${slot.avatarTone}`}>{slot.initials}</span><span className="whitespace-nowrap text-[11px] font-medium text-slate-700">{slot.employee}</span></div> : <span className="text-[11px] text-slate-400">—</span>}</td>
                    </tr>)}
                    {filteredSlots.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center"><div className="mx-auto flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Search aria-hidden="true" className="size-4" /></div><p className="mt-3 text-xs font-medium text-slate-700">Sonuç bulunamadı</p><p className="mt-1 text-[11px] text-slate-400">Arama veya filtre kriterlerinizi değiştirmeyi deneyin.</p></td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 sm:px-6">
                <p className="text-[10px] text-slate-500"><span className="font-semibold text-slate-700">{filteredSlots.length}</span> kadro listeleniyor</p>
                <span className="text-[10px] text-slate-400">Son güncelleme: bugün, 09:42</span>
              </div>
            </article>
          </section>
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
