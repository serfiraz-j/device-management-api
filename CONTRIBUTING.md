# Contributing Guide

Device Management REST API projesine katkıda bulunmak için bu rehberdeki geliştirme standartlarını takip edin.

## 1. Geliştirme Ortamı

Gereksinimler:

- Git
- Node.js 22
- npm
- Docker ve Docker Compose

Repository'yi klonlayın:

```bash
git clone https://github.com/serfiraz-j/device-management-api.git
cd device-management-api
```

Ortam değişkenlerini hazırlayın:

```bash
cp .env.example .env
```

`.env` dosyasındaki veritabanı bilgilerini kendi geliştirme ortamınıza göre yapılandırın.

Docker servislerini başlatın:

```bash
docker compose up -d --build
```

Container durumlarını kontrol edin:

```bash
docker compose ps
```

## 2. Branch Stratejisi

Doğrudan `main` branch'ine kod göndermeyin.

Her değişiklik için ayrı bir feature veya fix branch'i oluşturun.

Branch isimlendirme kuralları:

| Önek | Kullanım |
|---|---|
| `feature/` | Yeni özellik |
| `fix/` | Hata düzeltmesi |
| `docs/` | Dokümantasyon |
| `test/` | Test geliştirme |
| `refactor/` | Davranışı değiştirmeyen kod düzenlemesi |

Örnekler:

- `feature/device-filtering`
- `fix/invalid-device-id`
- `docs/api-examples`
- `test/delete-device`

Yeni branch oluşturma:

```bash
git switch main
git pull origin main
git switch -c feature/device-filtering
```

## 3. Katmanlı Mimari Kuralları

Proje aşağıdaki katmanları kullanır:

```text
Routes
   |
   v
Controllers
   |
   v
Services
   |
   v
Repositories
   |
   v
PostgreSQL
```

Her katmanın sorumluluğu:

**Routes**
- HTTP endpoint'lerini tanımlar.
- İlgili middleware ve Controller fonksiyonlarını bağlar.

**Controllers**
- HTTP istek ve yanıtlarını yönetir.
- HTTP durum kodlarını belirler.
- SQL sorgusu içermez.

**Services**
- İş mantığını yönetir.
- DTO dönüşümlerini gerçekleştirir.
- HTTP yanıt nesnelerini doğrudan yönetmez.

**Repositories**
- PostgreSQL sorgularını çalıştırır.
- Parametreli SQL kullanır.
- HTTP durum kodlarına karar vermez.

**Middleware**
- Veri doğrulama, logging ve hata yönetimi gibi ortak işlemleri yürütür.

Mevcut mimariyi değiştiren öneriler için yeni bir ADR hazırlanmalıdır.

## 4. Kodlama Standartları

- Projenin mevcut CommonJS modül yapısını kullanın.
- Anlaşılır fonksiyon ve değişken isimleri tercih edin.
- Asenkron işlemlerde `async/await` kullanın.
- Kod tekrarından kaçının.
- Giriş verilerini Zod ile doğrulayın.
- Veritabanı sorgularında parametre kullanın.
- Hassas bilgileri loglara veya Git'e eklemeyin.

İsimlendirme örnekleri:

```javascript
// Fonksiyon ve değişken: camelCase
const deviceId = 10;
async function getDeviceById(id) {}

// Sabit değer: UPPER_SNAKE_CASE
const MAX_DEVICE_NAME_LENGTH = 100;
```

Kod biçimlendirme için Prettier, statik analiz için ESLint kullanılır.

## 5. Commit Mesajları

Commit mesajlarında aşağıdaki biçimi tercih edin:

```text
type: short description
```

Kullanılan türler:

| Tür | Açıklama |
|---|---|
| `feat` | Yeni özellik |
| `fix` | Hata düzeltmesi |
| `docs` | Dokümantasyon |
| `test` | Test ekleme veya düzeltme |
| `refactor` | Davranışı değiştirmeyen kod düzenlemesi |
| `build` | Build veya Docker yapılandırması |
| `chore` | Bakım işlemleri |

Örnekler:

```text
feat: add device filtering
fix: validate device id
docs: update API examples
test: cover delete endpoint
build: configure Docker healthchecks
```

Commit mesajları kısa ve yapılan değişikliği açıklayıcı olmalıdır.

## 6. Test Kuralları

Yeni özellik veya hata düzeltmesi eklerken ilgili testleri de güncelleyin.

Mevcut otomatik test sistemi Node.js Test Runner'dır.

Testler çalışan API'ye HTTP istekleri gönderir ve veritabanı kayıtlarını değiştirebilir.

**Testleri yalnızca geliştirme veya ayrı test veritabanında çalıştırın. Üretim veritabanında çalıştırmayın.**

```bash
npm test
```

Yeni testlerde:

- Başarılı istekleri kontrol edin.
- Geçersiz verileri test edin.
- Hata kodlarını doğrulayın.
- Oluşturulan test kayıtlarını mümkün olduğunca temizleyin.
- Testlerin birbirinden bağımsız çalışmasına dikkat edin.

## 7. Kod Kalitesi Kontrolleri

Pull Request açmadan önce aşağıdaki komutları çalıştırın.

ESLint:

```bash
npm run lint
```

Prettier kontrolü:

```bash
npm run format:check
```

Gerekirse kodu biçimlendirin:

```bash
npm run format
```

Ardından kontrolleri tekrar çalıştırın.

## 8. Pull Request Süreci

1. Güncel `main` branch'inden yeni branch oluşturun.
2. Değişiklikleri küçük ve anlaşılır commit'lerle geliştirin.
3. Gerekli testleri ekleyin veya güncelleyin.
4. Kod kalitesi kontrollerini çalıştırın.
5. Branch'i GitHub'a gönderin.
6. `main` branch'ine Pull Request açın.
7. Yapılan değişikliği ve test sonuçlarını PR açıklamasında belirtin.
8. İnceleme ve gerekli düzeltmeler tamamlandıktan sonra PR'ı merge edin.

Pull Request açıklaması şu bilgileri içermelidir:

**Summary**
- Ne değişti?
- Neden değişti?

**Testing**
- Hangi testler çalıştırıldı?
- Sonuçları ne oldu?

**Checklist**
- [ ] Kod kalitesi kontrol edildi
- [ ] İlgili testler çalıştırıldı
- [ ] Dokümantasyon gerekiyorsa güncellendi
- [ ] Gizli bilgiler commit edilmedi

## 9. Güvenlik

- `.env` dosyalarını Git'e göndermeyin.
- Şifreleri ve API anahtarlarını kaynak koda yazmayın.
- Kullanıcı girdilerini doğrudan SQL metnine eklemeyin.
- Hassas verileri loglarda paylaşmayın.
- Güvenlik açıklarını herkese açık Issue içerisinde ayrıntılarıyla yayımlamadan önce repository sahibine özel olarak bildirin.

## 10. Dokümantasyon

API davranışı değişirse `README.md` ve `docs/api-contract.md` dosyalarını güncelleyin.

Önemli bir mimari karar değişirse `docs/adr/` altında yeni bir karar kaydı oluşturun.

Eski ADR dosyalarını geçmişi kaybettirecek şekilde silmek yerine yeni kararla ilişkilendirin.