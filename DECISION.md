# Technical Decisions — Device Management API

## 1. Backend Framework: Express

| Alternatif | Avantaj | Dezavantaj |
|---|---|---|
| Express | Basit, esnek, yaygın | Mimariyi kendimiz kurmalıyız |
| Fastify | Performanslı, şema desteği | Farklı plugin yapısını öğrenmek gerekir |

**Karar:** Express kullanacağız.

**Gerekçe:** HTTP ve katmanlı backend mimarisini temel seviyede öğrenmek istiyoruz.

**Ödün:** Fastify'ın performans avantajlarından yararlanmıyoruz.

**Ne zaman tekrar değerlendiririz?** Performans testlerinde framework kaynaklı darboğaz oluşursa.

## 2. Programlama Dili: JavaScript

| Alternatif | Avantaj | Dezavantaj |
|---|---|---|
| JavaScript | Hızlı başlangıç, ek derleme adımı yok | Statik tip kontrolü yok |
| TypeScript | Statik tip kontrolü, güçlü editör desteği | Ek yapılandırma ve öğrenme gerekiyor |

**Karar:** JavaScript.

**Gerekçe:** Projeyi hızlı geliştirmek ve backend temellerine odaklanmak.

**Ödün:** Derleme sırasında tip hatalarını yakalama avantajından vazgeçiyoruz.

**Ne zaman tekrar değerlendiririz?** Proje büyür ve tip kaynaklı hatalar bakım maliyetini artırırsa.

## 3. Veri Erişimi: Raw SQL

| Alternatif | Avantaj | Dezavantaj |
|---|---|---|
| Raw SQL | SQL üzerinde tam kontrol | Sorguları elle yazmak gerekir |
| ORM (Prisma) | Veri erişimini kolaylaştırır | Ek soyutlama ve öğrenme yükü |

**Karar:** Raw SQL (`pg (node-postgres)`).

**Gerekçe:** SQL'i doğrudan kullanmayı öğrenmek.

**Ödün:** ORM'nin otomatik veri eşleme kolaylıklarını kullanmıyoruz.

**Ne zaman tekrar değerlendiririz?** Sorgu ve model sayısı arttığında bakım zorlaşırsa.

## 4. Validation: Zod

| Alternatif | Avantaj | Dezavantaj |
|---|---|---|
| Zod | Anlaşılır şema tanımları | Ek bağımlılık |
| Joi | Olgun doğrulama özellikleri | Ek bağımlılık ve farklı API |

**Karar:** Zod.

**Gerekçe:** Request doğrulamasını merkezi ve anlaşılır biçimde yapmak.

**Ödün:** Alternatif kütüphanelerin bazı özelliklerini tercih etmiyoruz.

**Ne zaman tekrar değerlendiririz?** Validation ihtiyaçlarımız Zod ile karşılanamazsa.

## 5. ID Stratejisi: Auto-increment Integer

| Alternatif | Avantaj | Dezavantaj |
|---|---|---|
| Auto-increment | Basit, küçük ve hızlı | Dağıtık sistemlerde koordinasyon gerektirir |
| UUID | Bağımsız kimlik üretilebilir | Daha uzun ve karmaşık |

**Karar:** Auto-increment integer.

**Gerekçe:** Tek veritabanlı küçük bir sistem geliştiriyoruz.

**Ödün:** Dağıtık sistemlerde bağımsız ID üretme kolaylığından vazgeçiyoruz.

**Ne zaman tekrar değerlendiririz?** Birden fazla bağımsız sistemin kayıt üretmesi gerekirse.

## 6. Veritabanı: PostgreSQL

| Alternatif | Avantaj | Dezavantaj |
|---|---|---|
| PostgreSQL | Güçlü veri bütünlüğü, eşzamanlı işlemler, gelişmiş SQL özellikleri | Ayrı sunucu ve yapılandırma gerektirir |
| SQLite | Kurulumu kolay, tek dosyada çalışır | Yoğun eşzamanlı yazma işlemlerinde sınırlamalar |

**Karar:** PostgreSQL.

**Gerekçe:** Gerçek backend projelerinde kullanılan istemci-sunucu veritabanı mimarisini öğrenmek ve ölçeklenebilir bir altyapı oluşturmak.

**Ödün:** SQLite'ın basit kurulum avantajından vazgeçiyoruz.

**Ne zaman tekrar değerlendiririz?** Proje çok küçük, tek kullanıcılı ve sunucusuz çalışması gereken bir uygulamaya dönüşürse.