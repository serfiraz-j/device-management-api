# Device Management REST API

Node.js, Express ve PostgreSQL kullanılarak geliştirilmiş, IoT cihazlarını yönetmek için hazırlanmış REST API projesidir.

## Özellikler

- Cihaz oluşturma, listeleme, görüntüleme, güncelleme ve silme (CRUD)
- Zod ile giriş verilerinin doğrulanması
- PostgreSQL ile kalıcı veri saklama
- Parametreli SQL sorguları
- Katmanlı backend mimarisi
- Pino ile yapılandırılmış logging
- Her HTTP isteği için benzersiz `X-Request-Id`
- Merkezi hata yönetimi
- Docker ve Docker Compose desteği
- Node.js Test Runner ile otomatik API testleri
- Ortak middleware ile cihaz ID doğrulama
- Tutarlı JSON hata yanıtları için sendError yardımcı fonksiyonu
- SIGTERM ve SIGINT sinyallerinde graceful shutdown

## Kullanılan Teknolojiler

| Teknoloji | Kullanım amacı |
|---|---|
| Node.js 22 | JavaScript çalışma ortamı |
| Express 5 | REST API geliştirme |
| PostgreSQL 18 | İlişkisel veritabanı |
| pg | PostgreSQL bağlantısı ve SQL sorguları |
| Zod 4 | Veri doğrulama |
| Pino / pino-http | Logging |
| Docker / Docker Compose | Container yönetimi |
| ESLint / Prettier | Kod kalitesi ve biçimlendirme |
| Node.js Test Runner | Otomatik testler |

## Proje Mimarisi

Uygulama katmanlı mimari kullanır.

```text
HTTP Request
    |
    v
Routes
    |
    v
Validation Middleware
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

**Katmanların görevleri:**

- **Routes:** HTTP isteklerini doğru Controller fonksiyonuna yönlendirir.
- **Middleware:** Gelen verileri doğrular, log oluşturur ve hataları yönetir.
- **Controllers:** HTTP isteklerini ve yanıtlarını yönetir.
- **Services:** İş mantığını ve DTO dönüşümlerini yönetir.
- **Repositories:** PostgreSQL sorgularını çalıştırır.
- **Config:** Ortam değişkenlerini merkezi olarak yönetir.

SQL sorguları yalnızca Repository katmanında bulunur.

## Architecture Decision Records

Projede alınan önemli mimari kararlar:

- [ADR-0001: Express Seçimi](docs/adr/0001-express.md)
- [ADR-0002: Raw SQL Kullanımı](docs/adr/0002-raw-sql.md)
- [ADR-0003: PostgreSQL Seçimi](docs/adr/0003-postgresql.md)

Kısa karar özeti için [DECISION.md](DECISION.md) dosyasına bakabilirsiniz.

## Proje Klasör Yapısı

```text
device-management-api/
├── db/
│   └── schema.sql
├── docs/
│   └── api-contract.md
├── src/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   │   └── sendError.js
│   ├── validators/
│   ├── app.js
│   └── index.js
├── tests/
│   ├── post-devices.test.js
│   └── put-delete-devices.test.js
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── compose.yaml
├── DECISION.md
├── package.json
└── README.md
```

## Kurulum

### Gereksinimler

- Git
- Docker Engine / Docker Desktop
- Docker Compose

### 1. Repository'yi klonla

```bash
git clone https://github.com/serfiraz-j/device-management-api.git
cd device-management-api
```

### 2. Ortam değişkenlerini ayarla

Örnek ortam değişkenleri dosyasını kopyala:

```bash
cp .env.example .env
```

`.env` dosyasında aşağıdaki değişkenleri yapılandır:

```dotenv
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=device_management
DB_USER=device_app
DB_PASSWORD=guclu_bir_yerel_sifre
```

`DB_PASSWORD` değerini kendi geliştirme ortamın için belirle.

**Güvenlik:** `.env` dosyası gizli bilgiler içerir ve Git repository'sine gönderilmemelidir.

Docker Compose, API container'ı için `DB_HOST=db` değerini otomatik olarak yapılandırır.

### 3. Docker Compose ile başlat

```bash
docker compose up -d --build
```

Container durumlarını kontrol et:

```bash
docker compose ps
```

API ve PostgreSQL servisleri `healthy` durumuna geldiğinde uygulama kullanıma hazırdır.

### 4. API'yi test et

```bash
curl -i http://127.0.0.1:3000/health
```

Beklenen HTTP durum kodu: `200 OK`.

Cihazları listelemek için:

```bash
curl -i http://127.0.0.1:3000/devices
```

### 5. Servisleri durdur

```bash
docker compose down
```

Bu komut container'ları kaldırır ancak PostgreSQL'in kalıcı volume'ünü korur.

**Uyarı:** `docker compose down -v`, veritabanı volume'ünü de silebilir.

## API Endpoint'leri

| HTTP | Endpoint | Açıklama | Başarı kodu |
|---|---|---|---|
| GET | `/health` | Sunucu durumunu kontrol eder | 200 |
| GET | `/devices` | Tüm cihazları listeler | 200 |
| GET | `/devices/:id` | Belirtilen cihazı getirir | 200 |
| POST | `/devices` | Yeni cihaz oluşturur | 201 |
| PUT | `/devices/:id` | Mevcut cihazı tamamen günceller | 200 |
| DELETE | `/devices/:id` | Cihazı siler | 204 |

API'nin daha ayrıntılı sözleşmesi `docs/api-contract.md` dosyasında bulunur.

### POST /devices örneği

```bash
curl -i -X POST http://127.0.0.1:3000/devices \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sicaklik Sensoru",
    "serialNumber": "TEMP-001",
    "status": "ACTIVE",
    "battery": 85,
    "lastSeen": null
  }'
```

Başarılı olduğunda `201 Created` döndürülür. Oluşturulan cihazın adresi `Location` header'ında belirtilir.

### PUT /devices/:id örneği

```bash
curl -i -X PUT http://127.0.0.1:3000/devices/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Guncellenmis Sicaklik Sensoru",
    "serialNumber": "TEMP-001",
    "status": "MAINTENANCE",
    "battery": 40,
    "lastSeen": null
  }'
```

PUT işlemi tam güncellemedir. Bütün değiştirilebilir alanlar gönderilmelidir.

### DELETE /devices/:id örneği

```bash
curl -i -X DELETE http://127.0.0.1:3000/devices/1
```

Başarılı silme işlemi `204 No Content` döndürür ve yanıt gövdesi boş olur.

## Veri Doğrulama Kuralları

| Alan | Kural |
|---|---|
| id | Pozitif tam sayı, PostgreSQL tarafından oluşturulur |
| name | 3–100 karakter |
| serialNumber | Benzersiz, yalnızca A-Z, 0-9 ve tire |
| status | ACTIVE, INACTIVE, MAINTENANCE, DECOMMISSIONED |
| battery | 0–100 arasında tam sayı veya null |
| lastSeen | ISO 8601 tarih-saat veya null |
| createdAt | Otomatik oluşturulur |
| updatedAt | Oluşturma ve güncelleme zamanını gösterir |

POST işleminde `status` gönderilmezse `INACTIVE` kullanılır.

PUT işleminde bütün değiştirilebilir alanlar zorunludur. `battery` ve `lastSeen` alanları `null` olabilir.

## Hata Yönetimi

API, standart JSON hata yanıtları kullanır.

Örnek:

```json
{
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "Cihaz bulunamadı",
    "statusCode": 404
  }
}
```

| HTTP kodu | Açıklama |
|---|---|
| 400 | Geçersiz ID, JSON veya doğrulama hatası |
| 404 | Cihaz veya endpoint bulunamadı |
| 409 | Seri numarası zaten kullanılıyor |
| 500 | Beklenmeyen sunucu hatası |

## Otomatik Testler

Proje, Node.js'in yerleşik test sistemini kullanır.

- POST ve veri doğrulama: 18 test
- PUT ve DELETE: 8 test
- Toplam: 26 test

Testler çalışan bir API sunucusuna HTTP istekleri gönderir ve PostgreSQL'deki verileri değiştirebilir.

**Testleri yalnızca geliştirme veya ayrı test veritabanında çalıştırın.**

API çalışırken:

```bash
npm install
npm test
```

WSL ortamında bağlantı adresi IPv4/IPv6 yapılandırmasına göre farklılık gösterebilir. Test dosyalarının URL ayarları, kullanılan API adresiyle uyumlu olmalıdır.

## Kod Kalitesi

ESLint kontrolü:

```bash
npm run lint
```

Prettier ile biçimlendirme:

```bash
npm run format
```

Biçimlendirme kontrolü:

```bash
npm run format:check
```

## Docker Komutları

| Komut | Açıklama |
|---|---|
| `docker compose up -d --build` | Servisleri oluşturur ve başlatır |
| `docker compose ps` | Container durumlarını gösterir |
| `docker compose logs api` | API loglarını gösterir |
| `docker compose logs db` | PostgreSQL loglarını gösterir |
| `docker compose stop` | Servisleri durdurur |
| `docker compose down` | Container'ları kaldırır, volume'ü korur |

## Graceful Shutdown

API, SIGTERM ve SIGINT sinyallerini dinler.

Kapanış sırasında:

1. HTTP sunucusu yeni bağlantı kabul etmeyi durdurur.
2. Devam eden HTTP isteklerinin tamamlanması beklenir.
3. PostgreSQL bağlantı havuzu `pool.end()` ile kapatılır.
4. Kapanış aşamaları Pino ile loglanır.

Kapanışı test etmek için:

```bash
docker compose stop api
docker compose logs --tail=30 api
```

API'yi yeniden başlatmak için:

```bash
docker compose start api
```

## Güvenlik Yaklaşımı

- Parametreli SQL sorguları kullanılır.
- Giriş verileri Zod ile doğrulanır.
- API container'ı root olmayan kullanıcıyla çalışır.
- PostgreSQL portu doğrudan host'a açılmaz.
- Ortam değişkenleri kaynak koda yazılmaz.
- Hassas HTTP header'ları loglarda gizlenir.
- Beklenmeyen hataların teknik detayları API yanıtında paylaşılmaz.

## Lisans

Projenin lisans bilgisi `package.json` dosyasında belirtilmiştir.

## Contributing

Projeye katkıda bulunmak için
[CONTRIBUTING.md](CONTRIBUTING.md)
dosyasındaki geliştirme standartlarını takip edin.