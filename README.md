# Vardar Eğitim Yönetim Sistemi

Öğretmenler için özel ders planlama ve takip sistemi. Angular ve Supabase kullanılarak geliştirilmiş modern bir web uygulaması.

## Özellikler

- 📚 Ders Planlama ve Takibi

  - Yeni ders planlaması
  - Ders durumu güncelleme (Planlandı, Tamamlandı, İptal Edildi)
  - Ders detayları görüntüleme ve düzenleme

- 👥 Öğrenci Yönetimi

  - Öğrenci ekleme ve düzenleme
  - Öğrenci bilgilerini görüntüleme
  - Veli iletişim bilgileri takibi

- 📊 Dashboard

  - Ders istatistikleri
  - Planlanan derslerin durumu
  - Filtreleme ve arama özellikleri

- 🔔 Bildirim Sistemi
  - Planlanan dersler için otomatik hatırlatmalar
  - Ders başlangıcından 30 dakika önce bildirim

## Teknolojiler

- Angular 17
- Angular Material UI
- Supabase (Backend ve Veritabanı)
- Firebase Cloud Messaging (Bildirimler için)
- TypeScript
- SCSS

## Kurulum

1. Repoyu klonlayın:

```bash
git clone https://github.com/kullaniciadi/vardar-egitim-app.git
cd vardar-egitim-app
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Environment dosyasını düzenleyin:

- `src/environments/environment.ts` dosyasını kendi Supabase ve Firebase bilgilerinizle güncelleyin.

4. Uygulamayı başlatın:

```bash
ng serve
```

5. Tarayıcınızda açın:

```
http://localhost:4200
```

## Kullanım

1. Giriş yapın veya yeni hesap oluşturun
2. Dashboard üzerinden dersleri görüntüleyin
3. "Yeni Ders Planla" butonu ile ders ekleyin
4. Öğrenciler sekmesinden öğrenci yönetimini yapın
5. Bildirimleri aktif edin ve ders hatırlatmalarını alın

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik: Açıklama'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## İletişim

- Proje Sahibi: [Ad Soyad]
- E-posta: [E-posta adresi]
- LinkedIn: [LinkedIn profil linki]

## Ekran Görüntüleri

![Dashboard](screenshots/dashboard.png)
![Ders Planlama](screenshots/lesson-planning.png)
![Öğrenci Yönetimi](screenshots/student-management.png)
