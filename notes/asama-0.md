# Aşama 0 — API Temizliği

## 1. Refactoring nedir?

Refactoring, kodun dışarıdan çalışma şeklini değiştirmeden içini düzenlemek demek. Kullanıcı bir fark görmez ama kod daha okunur ve bakımı kolay hale gelir.

Bu aşamada yaptıklarım:

- GET, PUT ve DELETE controller'larında aynı ID kontrolü tekrar ediyordu. Bunu `validateIdParam` adında tek bir middleware'e taşıdım.
- Hata yanıtları her yerde ayrı ayrı yazılmıştı. Hepsini `sendError()` fonksiyonunda topladım.

Değişikliklerden sonra 26 API testini tekrar çalıştırdım. Hepsi geçti, yani bir şey bozulmadı.

## 2. router.param() ile ayrı middleware farkı

`router.param()`, belirli bir URL parametresi (örneğin `:id`) geldiğinde otomatik çalışır. Route tanımına bakınca görünmez.

Ayrı middleware ise route'a elle eklenir. Route'a bakınca hangi kontrolün hangi sırayla çalıştığı hemen anlaşılır.

Ben ayrı middleware'i seçtim. GET, PUT ve DELETE route'larına bakan biri ID kontrolünü direkt orada görüyor.

Kontrolden geçen sayısal ID'yi `res.locals.deviceId` ile controller'a aktarıyorum.

## 3. SIGTERM ve SIGINT nedir?

İkisi de uygulamaya "kapan" diyen sinyallerdir.

- **SIGINT:** Terminalde Ctrl+C'ye basınca gelir.
- **SIGTERM:** Uygulamayı normal yoldan kapatmak için gönderilir. Docker Compose container'ı durdururken bunu kullanır.

Uygulama bu iki sinyali `process.on()` ile dinliyor. Sinyal gelince `shutdown()` fonksiyonu çalışıyor.

## 4. Graceful shutdown neden önemli?

Graceful shutdown, uygulamayı aniden kesmek yerine açık olan her şeyi düzgünce kapatıp öyle sonlandırmak demek. Böylece yarım kalan istek ya da açık kalan veritabanı bağlantısı olmuyor.

`shutdown()` fonksiyonu sırayla şunları yapıyor:

1. `server.close()` ile HTTP sunucusunu kapatıyor. Sunucu yeni istek almayı bırakıyor, devam edenlerin bitmesini bekliyor.
2. `pool.end()` ile PostgreSQL bağlantı havuzunu kapatıyor.

Havuz kapatılmazsa açık bağlantılar uygulamanın kapanmasını geciktirebilir.

Test için Docker'da container'a SIGTERM gönderdim. HTTP sunucusunun ve PostgreSQL havuzunun kapandığını loglarda gördüm.