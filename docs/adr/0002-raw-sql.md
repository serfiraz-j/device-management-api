# ADR-0002: Raw SQL ve pg Kullanımı

**Durum:** Accepted (Kabul edildi)

## Context (Bağlam)

Uygulamanın PostgreSQL veritabanıyla iletişim kurması gerekiyor.

Değerlendirdiğimiz seçenekler:

- Prisma gibi ORM kullanmak
- `pg` kütüphanesiyle doğrudan SQL yazmak

## Decision (Karar)

PostgreSQL işlemleri için **pg kütüphanesi ve parametreli raw SQL** kullanılmasına karar verildi.

Bütün SQL sorguları Repository katmanında tutulacaktır.

## Rationale (Gerekçe)

- SQL sorgularının nasıl çalıştığını doğrudan öğrenebilmek
- Küçük CRUD uygulamasında ek ORM katmanından kaçınmak
- Çalıştırılan SQL üzerinde açık kontrol sahibi olmak
- Parametreli sorgularla SQL injection riskini azaltmak

## Consequences (Sonuçlar)

### Olumlu

- SQL sorguları açıkça görülebilir.
- Veritabanı işlemlerini anlamak ve incelemek kolaylaşır.
- Ek ORM bağımlılığına ihtiyaç duyulmaz.
- PostgreSQL'in RETURNING gibi özellikleri doğrudan kullanılabilir.

### Olumsuz

- SQL sorgularını ve veri dönüşümlerini elle yazmamız gerekir.
- Veritabanı şema değişikliklerini kendimiz yönetmeliyiz.
- Karmaşık ilişkilerde ORM kullanımına göre daha fazla kod gerekebilir.

## Güvenlik Kuralları

- Kullanıcı verileri SQL metnine doğrudan eklenmez.
- Değerler `$1`, `$2` gibi parametrelerle gönderilir.
- SQL sorguları yalnızca Repository katmanında bulunur.

## Status

**Accepted** — Projede pg ve parametreli SQL sorguları kullanılmaktadır.