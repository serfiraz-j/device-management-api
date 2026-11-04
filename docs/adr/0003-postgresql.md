# ADR-0003: PostgreSQL Veritabanı Seçimi

**Durum:** Accepted (Kabul edildi)

## Context (Bağlam)

IoT cihazlarının bilgilerinin kalıcı olarak saklanması gerekiyor.

Uygulamada cihaz adı, benzersiz seri numarası, durum, batarya seviyesi ve tarih bilgileri tutuluyor.

Değerlendirdiğimiz seçenekler:

- SQLite
- PostgreSQL

## Decision (Karar)

İlişkisel veritabanı olarak **PostgreSQL 18** kullanılmasına karar verildi.

## Rationale (Gerekçe)

- Gerçek bir istemci-sunucu veritabanıyla çalışma deneyimi kazanmak
- Eşzamanlı bağlantıları desteklemek
- UNIQUE, CHECK ve PRIMARY KEY gibi veri bütünlüğü kurallarını kullanmak
- Parametreli SQL ve transaction gibi ilişkisel veritabanı özellikleriyle çalışmak
- Docker Compose üzerinde ayrı veritabanı servisi oluşturabilmek

## Consequences (Sonuçlar)

### Olumlu

- Cihaz verilerinin bütünlüğünü veritabanı seviyesinde koruyabiliriz.
- Birden fazla bağlantıyla çalışabiliriz.
- PostgreSQL sorguları ve indeksleri üzerinde deneyim kazanırız.
- Docker volume kullanarak kalıcı veri saklayabiliriz.

### Olumsuz

- SQLite'a göre daha fazla kurulum ve yapılandırma gerektirir.
- Bağlantı bilgileri, kullanıcı izinleri ve servis sağlığı yönetilmelidir.
- Veritabanı yedekleme ve bakım sorumlulukları vardır.

## Uygulama Detayları

- Veritabanı adı: `device_management`
- Ana tablo: `devices`
- Bağlantı kütüphanesi: `pg`
- SQL şeması: `db/schema.sql`
- Container yönetimi: Docker Compose
- Kalıcı veri saklama: Docker named volume

## Status

**Accepted** — Projede PostgreSQL 18 kullanılmaktadır.