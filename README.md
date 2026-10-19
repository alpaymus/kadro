# Kadro Yönetimi

Kurumların kadro planlama ve personel atama süreçlerini; talepler, yönetici onayları, raporlar ve yetki sorumluluklarıyla birlikte incelemek için hazırlanmış Türkçe bir web uygulaması ve etkileşimli prototip.

> **Mevcut kapsam:** Uygulama şu anda örnek verilerle çalışan bir prototiptir. Kimlik doğrulama, kurumsal SSO, kalıcı veritabanı ve sunucu taraflı yetkilendirme henüz uygulamaya dahil değildir. Kurum SSO’su ve hesap yaşam döngüsü, iş analizi gereksinimi olarak tanımlanmıştır; protokol ve IdP seçimi açık karardır. Rol seçici, yalnızca demoda farklı ekranları göstermeye yarar; erişim denetimi sağlamaz.

## Özellikler

- İK Sorumlusu, İK Müdürü ve Admin rolleri için farklı çalışma alanları
- Kadro kayıtlarını, boş/dolu/bloke durumlarını ve organizasyon özetlerini görüntüleme
- Kadro oluşturma, güncelleme, silme, personel atama, bloke etme ve derece değişikliği talepleri
- İK Müdürü için talep onaylama/reddetme ve karar geçmişi
- Birim ve form seçenekleri için demo sistem yönetimi
- Süreç bazlı RACI yetki matrisi
- Kadro raporlarını CSV olarak dışa aktarma
- Türkçe iş analizi belgesi, süreç/UML diyagramları ve 19 kullanım senaryosu diyagramı
- GitHub Actions ile GitHub Pages’e statik dağıtım

## Teknoloji yığını

- Next.js 16 (App Router)
- React 19 ve TypeScript
- Tailwind CSS 4
- pnpm

## Gereksinimler

- Node.js 22
- pnpm 12

## Yerel geliştirme

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Geliştirme sunucusunu açtıktan sonra [http://localhost:3000](http://localhost:3000) adresine gidin.

Üretim derlemesi ve yerel üretim sunucusu:

```bash
pnpm build
pnpm start
```

## Demo kullanımı ve veri kapsamı

Üst menüdeki **Rol değiştir** alanından İK Sorumlusu, İK Müdürü veya Admin görünümüne geçebilirsiniz. Talepler, onay kararları ve form değişiklikleri React istemci durumunda tutulur; sayfayı yenilemek prototipteki değişiklikleri sıfırlar. Veriler örnektir ve gerçek kişi ya da kurum kayıtları olarak kullanılmamalıdır.

Rol bazlı arayüz, gerçek kimlik doğrulama veya güvenlik sınırı değildir. Üretim kullanımı öncesinde kurumsal SSO entegrasyonu, IdP’den alınan kimlik/rol eşlemesi, sunucu taraflı izin kontrolleri, kalıcı veri katmanı ve denetim kayıtları tasarlanıp uygulanmalıdır.

## Proje yapısı

```text
app/
  api/is-analizi/route.ts   İş analizi Word dosyası indirme rotası
  globals.css               Genel stiller ve tasarım tokenları
  layout.tsx                Türkçe uygulama çerçevesi ve metadata
  page.tsx                  Ana sayfa
components/
  hr-dashboard.tsx          Demo dashboard ve kadro/atama akışları
  hr-approvals.tsx          Onay kuyruğu ve karar geçmişi
  hr-raci-matrix.tsx        RACI sorumluluk matrisi
  hr-types.ts               Demo veri tipleri ve örnek kullanıcılar
public/
  Is_Analizi_Kadro_Personel_Atama.docx
  is-surec-akis-diyagrami.svg
  kullanim-senaryosu-use-case-diyagrami.svg
  uml-diyagramlari/         Beş UML diyagramı
  use-case-diyagramlari/    UC-01–UC-19 SVG diyagramları ve galeri
  use-case-diyagramlari.zip Tüm kullanım senaryosu SVG'leri
```

## İş analizi ve diyagramlar

- [İş analizi belgesi](public/Is_Analizi_Kadro_Personel_Atama.docx)
- [İş süreci akış diyagramı](public/is-surec-akis-diyagrami.svg)
- [Kullanım senaryosu genel diyagramı](public/kullanim-senaryosu-use-case-diyagrami.svg)
- [UML diyagramları](public/uml-diyagramlari/)
- [Kullanım senaryoları galerisi](public/use-case-diyagramlari/index.html)
- [Kullanım senaryosu SVG arşivi](public/use-case-diyagramlari.zip)

İş analizinde UC-01 kurumsal SSO ile giriş olarak tanımlanmıştır. Seçilecek IdP, OIDC/SAML protokolü, kimlik claim eşlemesi, MFA ve oturum/çıkış kuralları ayrıca karara bağlanmalıdır.

## GitHub Pages dağıtımı

`.github/workflows/deploy-pages.yml`, `main` dalına yapılan push veya GitHub Actions üzerinden elle çalıştırma ile statik siteyi derleyip GitHub Pages’e gönderir. Derleme sırasında `GITHUB_PAGES=true` ayarlanır; Next.js bu durumda `/kadro` base path’iyle statik çıktı üretir.

GitHub deposunun **Settings → Pages → Build and deployment** bölümünde kaynağın **GitHub Actions** olarak ayarlandığından emin olun.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `pnpm dev` | Geliştirme sunucusunu başlatır. |
| `pnpm build` | Üretim derlemesi alır. |
| `pnpm start` | Üretim sunucusunu başlatır. |
