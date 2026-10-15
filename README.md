# Uzayın Yeni Sahipleri: Yörüngeyi Şirketlere mi Kaptırdık?

Bu proje, Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği programı "Kullanıcı Arayüzü Tasarımı" dersi kapsamında hazırlanmış interaktif bir veri hikâyesi (scrollytelling) çalışmasıdır. Proje, Dünya yörüngesindeki ticari uydu artışını ve uzay çöplüğü tehlikesini incelemektedir.

**Canlı Site Bağlantısı:** [(https://uzay-coplugu-veri-hikayesi-site.vercel.app/)]

## Veri Kaynağı ve Lisans
* **Kaynak:** Union of Concerned Scientists (UCS) Satellite Database (Mayıs 2023 sürümü).
* **Lisans:** Ticari olmayan eğitim ve araştırma amaçlı kullanıma açık açık veri seti.

## Kullanılan Teknolojiler ve Kütüphaneler
* **Veri Analizi:** Python (Pandas, NumPy), Jupyter Notebook
* **Görselleştirme:** Chart.js
* **Scrollytelling Altyapısı:** Scrollama.js, Intersection Observer API
* **Tasarım & Arayüz:** HTML5, CSS3, Tailwind CSS
* **Veri Okuma:** PapaParse.js

## Kullanılan Kod Kaynakları
* [Scrollama.js](https://github.com/russellsamora/scrollama) temel kaydırma mekanizması belgeleri referans alınmıştır.
* Chart.js dokümantasyonundan grafik yapılandırma örnekleri kullanılmıştır.
* HTML ve CSS (Tailwind) yapısında sıfırdan özel tasarım uygulanmıştır.

## Yapay Zekâ Kullanım Beyanı
Bu projede kod yazımı (özellikle HTML/CSS şablon iskeleti), hata ayıklama (Lighthouse mobil performans optimizasyonları) ve tasarım düzenlemeleri süreçlerinde üretken yapay zekâ araçlarından destek alınmıştır. Analiz kurgusu, veri temizleme kararları, bulguların çıkarılması ve hikâye metinleri tamamen özgündür.

## Projeyi Yerelde Çalıştırma Adımları
Web tarayıcılarının CORS (Çapraz Kaynak) güvenlik politikaları nedeniyle, grafiklerin `data/` klasöründeki CSV dosyalarını okuyabilmesi için proje HTML dosyasına doğrudan çift tıklanarak çalıştırılamaz.
1. Projeyi bilgisayarınıza indirin veya klonlayın.
2. VS Code veya Cursor editörü ile proje klasörünü açın.
3. `Live Server` eklentisini (Ritwick Dey) kurun.
4. `site/index.html` dosyasına sağ tıklayıp "Open with Live Server" seçeneğine tıklayın.
