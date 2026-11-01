# Device Management API Contract

## Genel Bilgiler

- Base URL: `http://localhost:3000`
- Veri formatı: JSON
- Başarı ve hata durumları HTTP status code ile belirtilir.
- API alan adları camelCase kullanır.
- Tarihler ISO 8601 UTC formatındadır.

## Device Model

```json
{
  "id": 1,
  "name": "Temperature Sensor",
  "serialNumber": "TEMP-001",
  "status": "ACTIVE",
  "battery": 85,
  "lastSeen": "2026-10-30T10:00:00.000Z",
  "createdAt": "2026-10-30T09:00:00.000Z",
  "updatedAt": "2026-10-30T09:00:00.000Z"
}
```

### Alan Kuralları

- `id`: Pozitif tam sayı, sistem tarafından oluşturulur.
- `name`: Zorunlu, 3–100 karakter.
- `serialNumber`: Zorunlu ve benzersiz. Yalnızca `A-Z`, `0-9` ve `-` karakterleri.
- `status`: `ACTIVE`, `INACTIVE`, `MAINTENANCE`, `DECOMMISSIONED`. Varsayılan `INACTIVE`.
- `battery`: 0–100 arası tam sayı veya `null`.
- `lastSeen`: Geçerli ISO 8601 tarih-saat veya `null`.
- `createdAt`: Otomatik oluşturulur ve değiştirilemez.
- `updatedAt`: Her güncellemede otomatik yenilenir.

## 1. GET /health

Sunucunun çalıştığını kontrol eder.

**Başarı — 200**

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-10-30T10:00:00.000Z"
}
```

## 2. GET /devices

Tüm cihazları listeler.

**Başarı — 200**

```json
[
  {
    "id": 1,
    "name": "Temperature Sensor",
    "serialNumber": "TEMP-001",
    "status": "ACTIVE",
    "battery": 85,
    "lastSeen": null,
    "createdAt": "2026-10-30T09:00:00.000Z",
    "updatedAt": "2026-10-30T09:00:00.000Z"
  }
]
```

Cihaz yoksa `200` ve `[]` döndürülür.

## 3. GET /devices/:id

ID ile tek bir cihaz getirir.

**Path parametresi:** `id` — pozitif tam sayı.

- `200`: Cihaz bulundu, Device Model döndürülür.
- `400`: ID geçersiz.
- `404`: Cihaz bulunamadı.

## 4. POST /devices

Yeni cihaz oluşturur.

**Request body örneği:**

```json
{
  "name": "Temperature Sensor",
  "serialNumber": "TEMP-001",
  "status": "ACTIVE",
  "battery": 85,
  "lastSeen": null
}
```

Yalnızca `name` ve `serialNumber` zorunludur. Eksik `status` için `INACTIVE`, eksik `battery` ve `lastSeen` için `null` kullanılır. Tanımlanmayan ek alanlar kabul edilen veriden çıkarılır.

- `201`: Oluşturulan tam cihaz kaydı döndürülür.
- `Location`: `/devices/{id}`.
- `400`: Eksik veya geçersiz veri.
- `409`: `serialNumber` başka bir cihazda kullanılıyor.

## 5. PUT /devices/:id

Mevcut cihazın değiştirilebilir alanlarını tamamen günceller.

**Request body:** `name`, `serialNumber`, `status`, `battery` ve `lastSeen` alanlarının tamamı gönderilir. `battery` ve `lastSeen` için `null` kullanılabilir.

`id`, `createdAt` ve `updatedAt` istemci tarafından değiştirilemez.

- `200`: Güncellenmiş tam cihaz kaydı.
- `400`: Geçersiz ID veya eksik/geçersiz veri.
- `404`: Cihaz bulunamadı.
- `409`: Seri numarası başka cihazla çakışıyor.

## 6. DELETE /devices/:id

Belirtilen cihazı siler.

- `204`: Cihaz silindi, response body boş.
- `400`: Geçersiz ID.
- `404`: Cihaz bulunamadı.

## Standart Hata Formatı

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Gönderilen veriler geçersiz",
    "statusCode": 400,
    "details": [
      {
        "field": "name",
        "message": "En az 3 karakter olmalı"
      }
    ]
  }
}
```

`details` yalnızca alan bazlı doğrulama hatalarında eklenir. Diğer hatalar aynı temel `error` yapısını kullanır.

Beklenmeyen sunucu hatalarında `500` döndürülür; SQL sorguları, dosya yolları ve stack trace istemciye gönderilmez.

## Tasarım Kararları

- Liste yanıtı doğrudan JSON array olacak.
- POST, `201 Created`, tam cihaz kaydı ve `Location` header döndürecek.
- DELETE başarılı olduğunda `204 No Content` döndürecek.
- Var olmayan kaynağa DELETE isteği `404` döndürecek.
- Geçersiz ID `400 Bad Request` döndürecek.
- Boş liste `200 OK` ve `[]` döndürecek.
- PUT tam güncelleme olarak uygulanacak; eksik alan `400` döndürecek.
- Bütün hatalar ortak JSON formatında olacak.
