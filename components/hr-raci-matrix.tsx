const raciLegend = [
  { code: "R", label: "Sorumlu", description: "İşi yürütür ve tamamlar.", className: "border-teal-200 bg-teal-50 text-teal-800" },
  { code: "A", label: "Hesap veren", description: "Son kararı verir; her iş için tek A bulunur.", className: "border-indigo-200 bg-indigo-50 text-indigo-800" },
  { code: "C", label: "Danışılan", description: "Uzman görüşü ve katkısı alınır.", className: "border-amber-200 bg-amber-50 text-amber-800" },
  { code: "I", label: "Bilgilendirilen", description: "Süreç ve sonuç hakkında bilgilendirilir.", className: "border-slate-200 bg-slate-100 text-slate-700" },
]

const roles = ["İK Sorumlusu", "İK Müdürü", "Admin"] as const

type RaciRole = (typeof roles)[number]
type RaciCode = "R" | "A" | "C" | "I" | "R/A"

type RaciActivity = {
  name: string
  group: string
  assignments: Record<RaciRole, RaciCode>
}

const activities: RaciActivity[] = [
  { name: "Yeni kadro talebi oluşturma", group: "Kadro işlemleri", assignments: { "İK Sorumlusu": "R", "İK Müdürü": "A", Admin: "C" } },
  { name: "Kadro kaydını güncelleme veya silme", group: "Kadro işlemleri", assignments: { "İK Sorumlusu": "R", "İK Müdürü": "A", Admin: "C" } },
  { name: "Personel atama talebi oluşturma", group: "Personel işlemleri", assignments: { "İK Sorumlusu": "R", "İK Müdürü": "A", Admin: "I" } },
  { name: "Boş kadroyu bloke etme talebi", group: "Kadro işlemleri", assignments: { "İK Sorumlusu": "R", "İK Müdürü": "A", Admin: "I" } },
  { name: "Kadro derece değişikliği talebi", group: "Kadro işlemleri", assignments: { "İK Sorumlusu": "R", "İK Müdürü": "A", Admin: "I" } },
  { name: "Talepleri inceleme ve karara bağlama", group: "Onay ve izleme", assignments: { "İK Sorumlusu": "I", "İK Müdürü": "R", Admin: "I" } },
  { name: "Kadro ve birim raporlarını takip etme", group: "Onay ve izleme", assignments: { "İK Sorumlusu": "C", "İK Müdürü": "R", Admin: "I" } },
  { name: "Birim, ünvan ve form seçeneklerini yönetme", group: "Sistem yönetimi", assignments: { "İK Sorumlusu": "I", "İK Müdürü": "C", Admin: "R/A" } },
]

const codeStyles: Record<RaciCode, string> = {
  R: "border-teal-200 bg-teal-50 text-teal-800",
  A: "border-indigo-200 bg-indigo-50 text-indigo-800",
  C: "border-amber-200 bg-amber-50 text-amber-800",
  I: "border-slate-200 bg-slate-100 text-slate-700",
  "R/A": "border-indigo-200 bg-indigo-50 text-indigo-800",
}

function AssignmentMark({ code }: { code: RaciCode }) {
  return (
    <span className={`inline-flex size-8 items-center justify-center rounded-lg border text-xs font-bold ${codeStyles[code]}`} aria-label={raciLegend.find((item) => item.code === code)?.label}>
      {code}
    </span>
  )
}

export default function HrRaciMatrix() {
  return (
    <section aria-labelledby="raci-matrix-title" className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { initials: "İS", title: "İK Sorumlusu", description: "İşlemleri ve talepleri başlatır." },
          { initials: "İM", title: "İK Müdürü", description: "Talepleri değerlendirir, onaylar ve izler." },
          { initials: "AD", title: "Admin", description: "Sistem tanımlarını ve seçenekleri yönetir." },
        ].map((role) => (
          <article key={role.title} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xs font-bold text-teal-800">{role.initials}</span>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-slate-900">{role.title}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{role.description}</p>
            </div>
          </article>
        ))}
      </div>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-teal-700">Görev ve sorumluluklar</p>
            <h2 id="raci-matrix-title" className="text-[15px] font-semibold tracking-tight text-slate-900">Süreç bazında rol dağılımı</h2>
            <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500">Mevcut kadro, atama, onay ve sistem yönetimi akışlarına göre hazırlanmış sorumluluk görünümü.</p>
          </div>
          <div aria-label="RACI açıklamaları" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:shrink-0">
            {raciLegend.map((item) => (
              <div key={item.code} className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-2" title={item.description}>
                <span className={`inline-flex size-6 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold ${item.className}`}>{item.code}</span>
                <span className="truncate text-[10px] font-medium text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">İK süreçleri için sorumlu, hesap veren, danışılan ve bilgilendirilen rol matrisi</caption>
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                <th scope="col" className="w-[42%] px-5 py-3.5 sm:px-6">Süreç / faaliyet</th>
                {roles.map((role) => <th key={role} scope="col" className="px-4 py-3.5 text-center normal-case tracking-normal text-slate-600">{role}</th>)}
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.name} className="border-t border-slate-100 transition-colors hover:bg-teal-50/30">
                  <th scope="row" className="px-5 py-3.5 sm:px-6">
                    <span className="block text-xs font-medium text-slate-800">{activity.name}</span>
                    <span className="mt-1 block text-[10px] font-normal text-slate-400">{activity.group}</span>
                  </th>
                  {roles.map((role) => (
                    <td key={role} className="px-4 py-3 text-center">
                      <AssignmentMark code={activity.assignments[role] as RaciCode} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-[10px] leading-relaxed text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Her faaliyet için tek bir hesap veren rol belirlenmiştir.</p>
          <p>Bu matris, uygulamadaki mevcut rol ve onay akışlarının özetidir.</p>
        </div>
      </article>
    </section>
  )
}
