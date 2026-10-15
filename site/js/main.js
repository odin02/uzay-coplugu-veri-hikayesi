// Global değişkenler
let myChart;
let interactiveChart;
let chartData = []; 

// Verileri Yükleme (site/data klasöründeki CSV'lerden)
Promise.all([
    new Promise(resolve => Papa.parse('data/ticari_vs_diger.csv', { download: true, header: true, dynamicTyping: true, complete: resolve }))
]).then(results => {
    chartData = results[0].data.filter(row => row.Launch_Year >= 2014 && row.Launch_Year <= 2023);
    initStickyChart();
    initInteractiveChart();
    initScrollama();
});

// 1. Sabit (Sticky) Grafik Kurulumu
function initStickyChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // Varsayılan: Sadece 2014-2019 arası (Adım 0)
    const initialData = chartData.filter(d => d.Launch_Year <= 2019);

    myChart = new Chart(ctx, {
        type: 'line', // Başlangıçta çizgi grafik
        data: {
            labels: initialData.map(d => d.Launch_Year),
            datasets: [{
                label: 'Toplam Fırlatılan Uydu (Adet)',
                data: initialData.map(d => d.Ticari + d.Diğer),
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true, // KURAL: Sıfırdan başlamayan y ekseni yasak
                    title: { display: true, text: 'Uydu Sayısı (Adet)', color: '#94a3b8' },
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    title: { display: true, text: 'Fırlatma Yılı', color: '#94a3b8' },
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            },
            plugins: {
                legend: { labels: { color: '#f8fafc' } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                // Türkçeye uygun binlik nokta ayracı
                                label += new Intl.NumberFormat('tr-TR').format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// 2. Scrollama Mantığı (6 Adımda Grafiğin Değişimi - Kural 6.1)
function initScrollama() {
    const scroller = scrollama();
    scroller.setup({
        step: '.step',
        offset: 0.6,
        debug: false
    }).onStepEnter(response => {
        // Metin kutusunu parlatma
        document.querySelectorAll('.step').forEach(el => el.classList.remove('is-active'));
        response.element.classList.add('is-active');

        const stepIndex = response.index;
        const allYears = chartData.map(d => d.Launch_Year);
        const totalSats = chartData.map(d => d.Ticari + d.Diğer);
        const commercial = chartData.map(d => d.Ticari);
        const others = chartData.map(d => d.Diğer);

        // KURAL: Sabit grafik anlamlı biçimde değişmeli
        if (stepIndex === 0) {
            // 2014-2019
            myChart.config.type = 'line';
            myChart.data.labels = allYears.slice(0, 6);
            myChart.data.datasets = [{
                label: 'Toplam Fırlatılan Uydu (Adet)',
                data: totalSats.slice(0, 6),
                borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.2)', fill: true, tension: 0.3
            }];
        } 
        else if (stepIndex === 1) {
            // 2014-2023 (Zaman Serisi Genişliyor)
            myChart.config.type = 'line';
            myChart.data.labels = allYears;
            myChart.data.datasets = [{
                label: 'Toplam Fırlatılan Uydu (Adet)',
                data: totalSats,
                borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.2)', fill: true, tension: 0.3
            }];
        }
        else if (stepIndex === 2) {
            // Grafik Türü Dönüşümü (Line -> Stacked Bar)
            myChart.config.type = 'bar';
            myChart.options.scales.x.stacked = true;
            myChart.options.scales.y.stacked = true;
            myChart.data.datasets = [
                { label: 'Ticari Uydular', data: commercial, backgroundColor: '#c084fc' }, // Mor
                { label: 'Diğer (Askeri/Sivil)', data: others, backgroundColor: '#475569' } // Gri
            ];
        }
        else if (stepIndex === 3) {
            // Ticari Vurgusu
            myChart.data.datasets[0].backgroundColor = '#c084fc'; // Parlak Mor
            myChart.data.datasets[1].backgroundColor = 'rgba(71, 85, 105, 0.2)'; // Soluk Gri
        }
        else if (stepIndex === 4) {
            // Diğer (Devlet) Vurgusu
            myChart.data.datasets[0].backgroundColor = 'rgba(192, 132, 252, 0.2)'; // Soluk Mor
            myChart.data.datasets[1].backgroundColor = '#94a3b8'; // Parlak Gri
        }
        else if (stepIndex === 5) {
            // 2022 Zirve Vurgusu (Sadece 2022 sütununu kırmızı yapma)
            const bgColorsCom = commercial.map((val, i) => allYears[i] === 2022 ? '#f87171' : 'rgba(192, 132, 252, 0.4)');
            const bgColorsOth = others.map((val, i) => allYears[i] === 2022 ? '#f87171' : 'rgba(71, 85, 105, 0.4)');
            myChart.data.datasets[0].backgroundColor = bgColorsCom;
            myChart.data.datasets[1].backgroundColor = bgColorsOth;
        }
        myChart.update();
    });
}

// 3. Etkileşimli (Keşif) Grafik - (Kural: Pasta grafik max 4 dilim olmalı, bizimki 2 dilim)
function initInteractiveChart() {
    const ctx = document.getElementById('interactiveChart').getContext('2d');
    
    interactiveChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ticari', 'Diğer'],
            datasets: [{
                data: [0, 0], // Başlangıçta boş, seçimle dolacak
                backgroundColor: ['#c084fc', '#475569'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#f8fafc' } } }
        }
    });

    // Menü değiştiğinde grafiği güncelleme
    document.getElementById('yearSelect').addEventListener('change', function(e) {
        updateInteractiveChart(parseInt(e.target.value));
    });
    // İlk açılışta 2022 yılını yükle
    updateInteractiveChart(2022);
}

function updateInteractiveChart(year) {
    const row = chartData.find(d => d.Launch_Year === year);
    if(row) {
        interactiveChart.data.datasets[0].data = [row.Ticari, row.Diğer];
        interactiveChart.update();
    }
}