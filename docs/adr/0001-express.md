# ADR-0001: Express Framework Seçimi

**Durum:** Accepted (Kabul edildi)

## Context (Bağlam)

Device Management REST API projesinde HTTP isteklerini karşılayacak, endpoint'leri yönetecek ve middleware kullanımını destekleyecek bir backend framework'üne ihtiyacımız vardı.

Değerlendirdiğimiz seçenekler:

- Express
- Fastify

## Decision (Karar)

Backend framework'ü olarak **Express 5** kullanılmasına karar verildi.

## Rationale (Gerekçe)

- Geniş dokümantasyon ve ekosistem sunması
- Öğrenilmesi ve kullanılması kolay olması
- Middleware mimarisinin esnek olması
- Küçük ve orta ölçekli REST API geliştirmeye uygun olması
- Express 5'in asenkron Controller hatalarını merkezi hata yönetimine aktarabilmesi

## Consequences (Sonuçlar)

### Olumlu

- REST endpoint'lerini hızlı geliştirebiliriz.
- Validation, logging ve hata yönetimini middleware olarak ayırabiliriz.
- Katmanlı mimarimizi kolayca uygulayabiliriz.

### Olumsuz

- Girdi doğrulaması gibi özellikleri ayrıca yapılandırmamız gerekir.
- Yüksek performans gerektiren bazı senaryolarda Fastify gibi alternatifler avantaj sağlayabilir.

## Status

**Accepted** — Projede Express 5 kullanılmaktadır.