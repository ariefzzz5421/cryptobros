/* Lightweight UI-only localization. Research copy, project names and provider
   payloads are intentionally left in their sourced/original language. */

export const SUPPORTED_LOCALES = ['en', 'id', 'zh-CN', 'ja'];
const STORAGE_KEY = 'crypto-bros-language';
const COPY = {
  en: {
    'nav.open': 'Open navigation', 'nav.close': 'Close navigation', 'nav.routes': 'Explore Crypto Bros',
    'nav.primary': 'Primary navigation', 'nav.dismiss': 'Close navigation',
    'theme.light': 'Switch to light theme', 'theme.dark': 'Switch to dark theme',
    'language.label': 'Language', 'language.choose': 'Choose language', 'language.current': 'Current language: {language}',
    'route.market': 'Markets', 'route.research': 'Research', 'route.dashboard': 'Dashboard',
    'route.maps': 'Maps', 'route.sentiment': 'Sentiment', 'route.launchpads': 'Launchpads',
    'route.cases': 'Memecoin cases', 'route.airdrops': 'Airdrops', 'route.neobank': 'NeoBank',
    'route.breakouts': 'Breakouts', 'route.nft': 'NFT history', 'route.nft2026': 'NFT 2026',
    'common.loading': 'Loading', 'common.unavailable': 'Unavailable', 'common.error': 'Error',
    'common.notDisclosed': 'Not disclosed',
    'common.retry': 'Retry', 'common.search': 'Search', 'common.reset': 'Reset', 'common.sources': 'Sources',
    'common.updated': 'Updated', 'common.viewSource': 'View source', 'common.readResearch': 'Read research',
    'common.marketCap': 'Market cap', 'common.price': 'Price', 'common.volume': 'Volume',
    'common.24hVolume': '24h volume', 'common.24hChange': '24h change', 'common.rank': 'Rank',
    'common.chain': 'Chain', 'common.project': 'Project', 'common.description': 'Description',
    'airdrop.distributionValue': 'Value at distribution', 'airdrop.wallets': 'Wallets',
    'airdrop.readCase': 'Read case', 'airdrop.cases': 'Project cases',
    'table.country': 'Country', 'table.region': 'Region', 'table.customers': 'Customers',
    'table.basis': 'Basis', 'table.revenue': 'Revenue', 'table.model': 'Model', 'table.site': 'Site',
    'table.exchange': 'Exchange', 'table.trustScore': 'Trust score', 'table.share': 'Share',
    'table.jurisdiction': 'Jurisdiction', 'table.exchanges': 'Exchanges',
    'empty.noData': 'No data available', 'empty.noResults': 'No results found',
    'state.marketUnavailable': 'Market research unavailable for this token.',
    'home.hero': 'Know the move.', 'home.hero2': 'Read the history.',
    'home.marketDirection': 'Market direction, liquidity, and token research in one focused view.',
    'home.marketCap': 'Memecoin market cap', 'home.marketComposition': 'Market composition',
    'home.gainersLosers': 'Top gainers & losers', 'home.topGainers': 'Top gainers', 'home.topLosers': 'Top losers',
    'home.globalMap': 'Global crypto volume map', 'home.movers': 'View market movers',
    'home.tokenResearch': 'Read token research', 'home.memeVolume': 'Meme volume · 24h',
    'home.marketShare': 'Crypto market share', 'home.globalCap': 'Global market cap',
    'home.dominance': 'BTC dominance', 'home.coverage': 'Loading source coverage…',
    'route.airdropCases': 'Airdrop cases', 'route.topAirdrops': 'Top 30 airdrop events',
    'route.caseStudies': 'Sourced case studies', 'route.nftCollections': 'Collections, sorted by documented peak floor',
    'route.neobankTitle': 'NeoBank', 'route.neobankList': 'Open a neobank', 'route.neobankRank': 'Ranked by customer accounts',
    'route.launchpadTitle': 'Largest launchpads', 'route.launchpadCases': 'Top tokens launched here',
    'route.breakoutTitle': 'Memecoins above $100M', 'route.currentLeaderboard': '$100M+ leaderboard',
    'route.nftHistory': 'NFT history', 'route.nftLatest': 'What moved most recently',
    'label.loadingResearch': 'Loading research…', 'label.loadingMarkets': 'Loading markets…',
    'label.loadingCollections': 'Loading collections…', 'label.loadingMetrics': 'Loading metrics…',
    'label.loadingAirdrops': 'Loading airdrop research…', 'label.buildingTop30': 'Building top-30 board…',
    'label.readCase': 'Read case', 'label.projectCases': 'Project cases', 'label.openDistribution': 'Open a distribution',
    'label.valueAtDistribution': 'Value at distribution', 'label.recipientWallets': 'Recipient wallets',
    'label.currentFloor': 'Current floor', 'label.peakFloor': 'Peak floor', 'label.lifetimeVolume': 'Lifetime volume',
    'label.24hVolume': '24h volume', 'label.inclusionMethod': 'Inclusion method',
    'label.researchMethodology': 'Research methodology', 'label.fullTable': 'Full jurisdiction table',
    'label.reset': 'Reset', 'label.labels': 'Labels', 'label.autoRotate': 'Auto rotate',
    'label.unavailable': 'Unavailable', 'label.waitingForData': 'Waiting for data',
    'label.liveUnavailable': 'Live prices temporarily unavailable', 'label.marketLoading': 'Preparing market data…',
    'label.mapLoading': 'Loading map geometry…', 'label.globeLoading': 'Loading globe geometry…',
    'label.sources': 'Data sources', 'label.ranking': 'Ranking', 'label.profiles': 'Profiles',
    'label.method': 'Method', 'label.caseSet': 'Case set', 'label.latest': 'Latest',
    'label.updated': 'Updated', 'label.readMore': 'Read research', 'label.companySite': 'Company site',
    'label.openSentiment': 'Open Sentiment', 'label.viewSource': 'View source',
    'label.currentMarketCap': 'Current market cap', 'label.marketShare': 'Market share',
    'label.launchDate': 'Launch date', 'label.peakMarketCap': 'Peak market cap',
    'label.priceAth': 'Price ATH', 'label.launchToAth': 'Launch → ATH',
    'label.project': 'Project', 'label.contract': 'Contract', 'label.chain': 'Chain',
    'label.airdropIntro': 'Airdrop intelligence · historical distributions',
    'label.airdropLead': 'Compare historical distribution value and open sourced project dossiers.',
    'label.topLeaderboard': 'Top leaderboard', 'label.totalLaunchValue': 'Total launch-day value',
    'label.recipientWallets': 'Recipient wallets', 'label.largestLaunchCase': 'Largest launch-day case',
    'label.allTimeAirdrops': 'All-time leaderboard · research cutoff 21 Aug 2026',
    'label.peakAllocation': 'Peak value of distributed allocation',
    'label.peakMethod': 'Allocated tokens × token ATH. This is separate from launch-day distribution value below.',
    'label.filterAirdrops': 'Filter all-time airdrops', 'label.allYears': 'All years',
    'label.year': 'Year', 'label.peakValueAllocation': 'Peak value of allocation', 'label.basis': 'Basis',
    'label.nextAirdrop': 'Next: tokens distributed × sourced launch-day price.',
    'label.deepCaseRanking': 'Deep-case ranking', 'label.rankedValueDistribution': 'Ranked by value at distribution',
    'label.sourcedDistributionPrice': 'Tokens distributed × a sourced distribution-day price.',
    'label.openDistribution': 'Open a distribution', 'label.rankingMethodology': 'Ranking methodology',
    'label.airdropRisk': 'Peak allocation value is a historical comparison, not money every recipient could have realised. Distribution-day value is a separate measurement. Historical airdrops are not a guide to future returns.',
    'label.noEstimate': 'Unavailable values are not estimated.', 'label.companyAccounts': 'Reported customer accounts, newest sourced figure first.',
    'label.collectionSort': 'Collections, sorted by documented peak floor',
    'label.nftCollectionSummary': 'Current floor, documented peak and trading volume. Live values may be unavailable.',
    'label.searchThisSite': 'Search this site', 'label.searchResearch': 'Search research, tokens, pages…',
    'label.globalVolumeMap': 'Where is reported crypto volume concentrated?',
    'label.exchangeVolumeGlobe': 'Exchange volume globe', 'label.jurisdictionRanking': 'Jurisdiction ranking',
    'label.largeLaunchpads': 'Largest launchpads', 'label.qualify': 'What qualifies',
    'label.marketUniverse': 'Memecoins above $100M', 'label.currentLeaderboard': '$100M+ leaderboard',
    'label.openDossier': 'Open dossier', 'label.openResearch': 'Open research',
    'label.searchBrand': 'Search Crypto Bros', 'label.searchResults': 'Search results',
    'label.noMatchingPage': 'No matching page', 'label.openNamedResearch': 'Open {title} research',
    'label.rankedEvents': 'ranked historical airdrop events',
    'label.sourcedCases': 'with sourced distribution research', 'label.strictCaseSet': 'strict sourced case set only',
    'label.publishedCountSummary': 'across {matched} of {total} cases that published a count',
    'label.atDistribution': 'at distribution', 'label.airdropResearchReady': 'Airdrop research ready · top 30 + sourced deep cases',
    'label.publishedCount': 'cases that published a count', 'label.launchDayBasis': 'by value at distribution',
    'label.peakHistoricalTable': 'Historical table', 'label.reconstructed': 'Reconstructed',
    'label.projectResearch': 'Project research', 'label.openCase': 'Open case',
  },
  id: {
    'nav.open': 'Buka navigasi', 'nav.close': 'Tutup navigasi', 'nav.routes': 'Jelajahi Crypto Bros',
    'nav.primary': 'Navigasi utama', 'nav.dismiss': 'Tutup navigasi',
    'theme.light': 'Ganti ke tema terang', 'theme.dark': 'Ganti ke tema gelap',
    'language.label': 'Bahasa', 'language.choose': 'Pilih bahasa', 'language.current': 'Bahasa saat ini: {language}',
    'route.market': 'Pasar', 'route.research': 'Riset', 'route.dashboard': 'Dasbor',
    'route.maps': 'Peta', 'route.sentiment': 'Sentimen', 'route.launchpads': 'Launchpad',
    'route.cases': 'Kasus memecoin', 'route.airdrops': 'Airdrop', 'route.neobank': 'NeoBank',
    'route.breakouts': 'Token breakout', 'route.nft': 'Sejarah NFT', 'route.nft2026': 'NFT 2026',
    'common.loading': 'Memuat', 'common.unavailable': 'Tidak tersedia', 'common.error': 'Kesalahan',
    'common.notDisclosed': 'Tidak diungkapkan',
    'common.retry': 'Coba lagi', 'common.search': 'Cari', 'common.reset': 'Atur ulang', 'common.sources': 'Sumber',
    'common.updated': 'Diperbarui', 'common.viewSource': 'Lihat sumber', 'common.readResearch': 'Baca riset',
    'common.marketCap': 'Kapitalisasi pasar', 'common.price': 'Harga', 'common.volume': 'Volume',
    'common.24hVolume': 'Volume 24 jam', 'common.24hChange': 'Perubahan 24 jam', 'common.rank': 'Peringkat',
    'common.chain': 'Jaringan', 'common.project': 'Proyek', 'common.description': 'Deskripsi',
    'airdrop.distributionValue': 'Nilai saat distribusi', 'airdrop.wallets': 'Dompet',
    'airdrop.readCase': 'Baca kasus', 'airdrop.cases': 'Riset proyek',
    'table.country': 'Negara', 'table.region': 'Wilayah', 'table.customers': 'Pelanggan',
    'table.basis': 'Dasar data', 'table.revenue': 'Pendapatan', 'table.model': 'Model', 'table.site': 'Situs',
    'table.exchange': 'Bursa', 'table.trustScore': 'Skor kepercayaan', 'table.share': 'Porsi',
    'table.jurisdiction': 'Yurisdiksi', 'table.exchanges': 'Bursa',
    'empty.noData': 'Data tidak tersedia', 'empty.noResults': 'Hasil tidak ditemukan',
    'state.marketUnavailable': 'Riset pasar untuk token ini belum tersedia.',
    'home.hero': 'Pahami pergerakan.', 'home.hero2': 'Pelajari riwayatnya.',
    'home.marketDirection': 'Arah pasar, likuiditas, dan riset token dalam satu tampilan terfokus.',
    'home.marketCap': 'Kapitalisasi pasar memecoin', 'home.marketComposition': 'Komposisi pasar',
    'home.gainersLosers': 'Kenaikan & penurunan tertinggi', 'home.topGainers': 'Kenaikan tertinggi', 'home.topLosers': 'Penurunan terdalam',
    'home.globalMap': 'Peta volume kripto global', 'home.movers': 'Lihat pergerakan pasar',
    'home.tokenResearch': 'Baca riset token', 'home.memeVolume': 'Volume memecoin · 24 jam',
    'home.marketShare': 'Porsi pasar kripto', 'home.globalCap': 'Kapitalisasi pasar global',
    'home.dominance': 'Dominasi BTC', 'home.coverage': 'Memuat cakupan sumber…',
    'route.airdropCases': 'Kasus airdrop', 'route.topAirdrops': '30 peristiwa airdrop teratas',
    'route.caseStudies': 'Studi kasus bersumber', 'route.nftCollections': 'Koleksi menurut rekor floor terdokumentasi',
    'route.neobankTitle': 'NeoBank', 'route.neobankList': 'Lihat neobank', 'route.neobankRank': 'Diurutkan berdasarkan jumlah nasabah',
    'route.launchpadTitle': 'Launchpad terbesar', 'route.launchpadCases': 'Token teratas yang diluncurkan di sini',
    'route.breakoutTitle': 'Memecoin di atas $100 juta', 'route.currentLeaderboard': 'Peringkat $100 juta+',
    'route.nftHistory': 'Sejarah NFT', 'route.nftLatest': 'Pergerakan terbaru',
    'label.loadingResearch': 'Memuat riset…', 'label.loadingMarkets': 'Memuat pasar…',
    'label.loadingCollections': 'Memuat koleksi…', 'label.loadingMetrics': 'Memuat metrik…',
    'label.loadingAirdrops': 'Memuat riset airdrop…', 'label.buildingTop30': 'Menyusun 30 teratas…',
    'label.readCase': 'Baca kasus', 'label.projectCases': 'Riset proyek', 'label.openDistribution': 'Buka distribusi',
    'label.valueAtDistribution': 'Nilai saat distribusi', 'label.recipientWallets': 'Dompet penerima',
    'label.currentFloor': 'Floor saat ini', 'label.peakFloor': 'Floor tertinggi', 'label.lifetimeVolume': 'Volume sepanjang masa',
    'label.24hVolume': 'Volume 24 jam', 'label.inclusionMethod': 'Metode inklusi',
    'label.researchMethodology': 'Metodologi riset', 'label.fullTable': 'Tabel yurisdiksi lengkap',
    'label.reset': 'Atur ulang', 'label.labels': 'Label', 'label.autoRotate': 'Putar otomatis',
    'label.unavailable': 'Tidak tersedia', 'label.waitingForData': 'Menunggu data',
    'label.liveUnavailable': 'Harga langsung sementara tidak tersedia', 'label.marketLoading': 'Menyiapkan data pasar…',
    'label.mapLoading': 'Memuat geometri peta…', 'label.globeLoading': 'Memuat geometri globe…',
    'label.sources': 'Sumber data', 'label.ranking': 'Peringkat', 'label.profiles': 'Profil',
    'label.method': 'Metode', 'label.caseSet': 'Kumpulan kasus', 'label.latest': 'Terbaru',
    'label.updated': 'Diperbarui', 'label.readMore': 'Baca riset', 'label.companySite': 'Situs perusahaan',
    'label.openSentiment': 'Buka Sentimen', 'label.viewSource': 'Lihat sumber',
    'label.currentMarketCap': 'Kapitalisasi pasar saat ini', 'label.marketShare': 'Pangsa pasar',
    'label.launchDate': 'Tanggal peluncuran', 'label.peakMarketCap': 'Kapitalisasi pasar puncak',
    'label.priceAth': 'ATH harga', 'label.launchToAth': 'Peluncuran → ATH',
    'label.project': 'Proyek', 'label.contract': 'Kontrak', 'label.chain': 'Jaringan',
    'label.airdropIntro': 'Intelijen airdrop · distribusi historis',
    'label.airdropLead': 'Bandingkan nilai distribusi historis dan buka dossier proyek bersumber.',
    'label.topLeaderboard': 'Peringkat teratas', 'label.totalLaunchValue': 'Total nilai saat peluncuran',
    'label.recipientWallets': 'Dompet penerima', 'label.largestLaunchCase': 'Kasus terbesar saat peluncuran',
    'label.allTimeAirdrops': 'Peringkat sepanjang masa · batas riset 21 Agu 2026',
    'label.peakAllocation': 'Nilai puncak alokasi yang didistribusikan',
    'label.peakMethod': 'Token yang dialokasikan × ATH token. Ini terpisah dari nilai distribusi hari peluncuran di bawah.',
    'label.filterAirdrops': 'Filter airdrop sepanjang masa', 'label.allYears': 'Semua tahun',
    'label.year': 'Tahun', 'label.peakValueAllocation': 'Nilai puncak alokasi', 'label.basis': 'Dasar data',
    'label.nextAirdrop': 'Berikutnya: token yang didistribusikan × harga hari peluncuran bersumber.',
    'label.deepCaseRanking': 'Peringkat kasus lengkap', 'label.rankedValueDistribution': 'Diurutkan berdasarkan nilai distribusi',
    'label.sourcedDistributionPrice': 'Token yang didistribusikan × harga hari distribusi dengan sumber.',
    'label.openDistribution': 'Buka distribusi', 'label.rankingMethodology': 'Metodologi peringkat',
    'label.airdropRisk': 'Nilai puncak alokasi adalah perbandingan historis, bukan uang yang pasti diterima setiap penerima. Nilai pada hari distribusi adalah pengukuran terpisah. Airdrop historis bukan panduan hasil masa depan.',
    'label.noEstimate': 'Nilai yang tidak tersedia tidak diestimasi.', 'label.companyAccounts': 'Jumlah akun pelanggan yang dilaporkan, data bersumber terbaru di atas.',
    'label.collectionSort': 'Koleksi diurutkan berdasarkan floor puncak terdokumentasi',
    'label.nftCollectionSummary': 'Floor saat ini, puncak terdokumentasi, dan volume perdagangan. Nilai langsung mungkin tidak tersedia.',
    'label.searchThisSite': 'Cari di situs ini', 'label.searchResearch': 'Cari riset, token, halaman…',
    'label.globalVolumeMap': 'Di mana volume kripto yang dilaporkan terkonsentrasi?',
    'label.exchangeVolumeGlobe': 'Globe volume bursa', 'label.jurisdictionRanking': 'Peringkat yurisdiksi',
    'label.largeLaunchpads': 'Launchpad terbesar', 'label.qualify': 'Kriteria inklusi',
    'label.marketUniverse': 'Memecoin di atas $100 juta', 'label.currentLeaderboard': 'Peringkat $100 juta+',
    'label.openDossier': 'Buka dossier', 'label.openResearch': 'Buka riset',
    'label.searchBrand': 'Cari Crypto Bros', 'label.searchResults': 'Hasil pencarian',
    'label.noMatchingPage': 'Halaman tidak ditemukan', 'label.openNamedResearch': 'Buka riset {title}',
    'label.rankedEvents': 'peristiwa airdrop historis yang diperingkat',
    'label.sourcedCases': 'dengan riset distribusi bersumber', 'label.strictCaseSet': 'hanya kumpulan kasus dengan sumber ketat',
    'label.publishedCountSummary': 'tercatat pada {matched} dari {total} kasus yang mengumumkan jumlah',
    'label.atDistribution': 'saat distribusi', 'label.airdropResearchReady': 'Riset airdrop siap · 30 teratas + kasus bersumber',
    'label.publishedCount': 'kasus yang mengumumkan jumlahnya', 'label.launchDayBasis': 'berdasarkan nilai saat distribusi',
    'label.peakHistoricalTable': 'Tabel historis', 'label.reconstructed': 'Direkonstruksi',
    'label.projectResearch': 'Riset proyek', 'label.openCase': 'Buka kasus',
  },
  'zh-CN': {
    'nav.open': '打开导航', 'nav.close': '关闭导航', 'nav.routes': '探索 Crypto Bros',
    'nav.primary': '主导航', 'nav.dismiss': '关闭导航',
    'theme.light': '切换到浅色主题', 'theme.dark': '切换到深色主题',
    'language.label': '语言', 'language.choose': '选择语言', 'language.current': '当前语言：{language}',
    'route.market': '市场', 'route.research': '研究', 'route.dashboard': '仪表盘',
    'route.maps': '地图', 'route.sentiment': '情绪', 'route.launchpads': '发射平台',
    'route.cases': '迷因币案例', 'route.airdrops': '空投', 'route.neobank': '数字银行',
    'route.breakouts': '突破代币', 'route.nft': 'NFT 历史', 'route.nft2026': 'NFT 2026',
    'common.loading': '加载中', 'common.unavailable': '暂无数据', 'common.error': '错误',
    'common.notDisclosed': '未披露',
    'common.retry': '重试', 'common.search': '搜索', 'common.reset': '重置', 'common.sources': '来源',
    'common.updated': '更新时间', 'common.viewSource': '查看来源', 'common.readResearch': '阅读研究',
    'common.marketCap': '市值', 'common.price': '价格', 'common.volume': '成交量',
    'common.24hVolume': '24小时成交量', 'common.24hChange': '24小时变化', 'common.rank': '排名',
    'common.chain': '链', 'common.project': '项目', 'common.description': '描述',
    'airdrop.distributionValue': '发放时价值', 'airdrop.wallets': '钱包数',
    'airdrop.readCase': '查看案例', 'airdrop.cases': '项目研究',
    'table.country': '国家', 'table.region': '地区', 'table.customers': '客户数',
    'table.basis': '统计口径', 'table.revenue': '收入', 'table.model': '模式', 'table.site': '网站',
    'table.exchange': '交易所', 'table.trustScore': '信任评分', 'table.share': '占比',
    'table.jurisdiction': '注册地', 'table.exchanges': '交易所数量',
    'empty.noData': '暂无可用数据', 'empty.noResults': '未找到结果',
    'state.marketUnavailable': '该代币暂无市场研究数据。',
    'home.hero': '看清市场动向。', 'home.hero2': '读懂项目历史。',
    'home.marketDirection': '在一个清晰视图中查看市场方向、流动性与代币研究。',
    'home.marketCap': '迷因币总市值', 'home.marketComposition': '市场构成',
    'home.gainersLosers': '涨幅与跌幅榜', 'home.topGainers': '涨幅榜', 'home.topLosers': '跌幅榜',
    'home.globalMap': '全球加密货币成交量地图', 'home.movers': '查看市场异动',
    'home.tokenResearch': '阅读代币研究', 'home.memeVolume': '迷因币成交量 · 24小时',
    'home.marketShare': '加密市场份额', 'home.globalCap': '全球总市值',
    'home.dominance': 'BTC 市占率', 'home.coverage': '正在加载来源覆盖…',
    'route.airdropCases': '空投案例', 'route.topAirdrops': '空投事件前 30 名',
    'route.caseStudies': '有来源的案例研究', 'route.nftCollections': '按已记录的最高地板价排序',
    'route.neobankTitle': '数字银行', 'route.neobankList': '查看数字银行', 'route.neobankRank': '按客户账户数排序',
    'route.launchpadTitle': '主要发射平台', 'route.launchpadCases': '此平台发行的热门代币',
    'route.breakoutTitle': '市值超过 1 亿美元的迷因币', 'route.currentLeaderboard': '市值 1 亿美元以上排行榜',
    'route.nftHistory': 'NFT 历史', 'route.nftLatest': '近期动态',
    'label.loadingResearch': '正在加载研究…', 'label.loadingMarkets': '正在加载市场数据…',
    'label.loadingCollections': '正在加载藏品…', 'label.loadingMetrics': '正在加载指标…',
    'label.loadingAirdrops': '正在加载空投研究…', 'label.buildingTop30': '正在整理前 30 名…',
    'label.readCase': '阅读案例', 'label.projectCases': '项目研究', 'label.openDistribution': '查看分发记录',
    'label.valueAtDistribution': '分发时价值', 'label.recipientWallets': '接收钱包数',
    'label.currentFloor': '当前地板价', 'label.peakFloor': '最高地板价', 'label.lifetimeVolume': '累计交易量',
    'label.24hVolume': '24小时成交量', 'label.inclusionMethod': '纳入标准',
    'label.researchMethodology': '研究方法', 'label.fullTable': '完整司法辖区表格',
    'label.reset': '重置', 'label.labels': '标签', 'label.autoRotate': '自动旋转',
    'label.unavailable': '暂无数据', 'label.waitingForData': '等待数据',
    'label.liveUnavailable': '实时价格暂不可用', 'label.marketLoading': '正在准备市场数据…',
    'label.mapLoading': '正在加载地图数据…', 'label.globeLoading': '正在加载地球仪数据…',
    'label.sources': '数据来源', 'label.ranking': '排行榜', 'label.profiles': '资料',
    'label.method': '方法', 'label.caseSet': '案例集合', 'label.latest': '最新',
    'label.updated': '更新时间', 'label.readMore': '阅读研究', 'label.companySite': '公司网站',
    'label.openSentiment': '查看情绪', 'label.viewSource': '查看来源',
    'label.currentMarketCap': '当前市值', 'label.marketShare': '市场份额',
    'label.launchDate': '上线日期', 'label.peakMarketCap': '最高市值',
    'label.priceAth': '价格历史最高点', 'label.launchToAth': '上线 → 历史最高点',
    'label.project': '项目', 'label.contract': '合约', 'label.chain': '区块链',
    'label.airdropIntro': '空投情报 · 历史分发',
    'label.airdropLead': '比较历史分发价值，并查看有来源的项目档案。',
    'label.topLeaderboard': '排行榜', 'label.totalLaunchValue': '上线日总价值',
    'label.recipientWallets': '接收钱包数', 'label.largestLaunchCase': '上线日价值最高的案例',
    'label.allTimeAirdrops': '历史排行榜 · 研究截止 2026年8月21日',
    'label.peakAllocation': '已分配代币的最高价值',
    'label.peakMethod': '分配代币数量 × 代币历史最高价。此数据与下方上线日分发价值分开统计。',
    'label.filterAirdrops': '筛选历史空投', 'label.allYears': '所有年份',
    'label.year': '年份', 'label.peakValueAllocation': '分配价值峰值', 'label.basis': '计算依据',
    'label.nextAirdrop': '下一项：已分发代币 × 有来源的上线日价格。',
    'label.deepCaseRanking': '案例详情排行', 'label.rankedValueDistribution': '按分发时价值排序',
    'label.sourcedDistributionPrice': '已分发代币数量 × 有来源的分发日价格。',
    'label.openDistribution': '查看分发记录', 'label.rankingMethodology': '排名方法',
    'label.airdropRisk': '分配价值峰值仅用于历史比较，并不代表每位接收者都能实现该收益。分发日价值是另一项指标。历史空投不能作为未来回报的依据。',
    'label.noEstimate': '缺失数值不会进行估算。', 'label.companyAccounts': '按最新有来源的客户账户数排序。',
    'label.collectionSort': '藏品按有记录的最高地板价排序',
    'label.nftCollectionSummary': '当前地板价、记录峰值和交易量。实时数据可能不可用。',
    'label.searchThisSite': '搜索本站', 'label.searchResearch': '搜索研究、代币和页面…',
    'label.globalVolumeMap': '已报告的加密货币成交量集中在哪里？',
    'label.exchangeVolumeGlobe': '交易所成交量地球仪', 'label.jurisdictionRanking': '司法辖区排名',
    'label.largeLaunchpads': '主要发射平台', 'label.qualify': '纳入条件',
    'label.marketUniverse': '市值超过 1 亿美元的迷因币', 'label.currentLeaderboard': '市值 1 亿美元以上排行榜',
    'label.openDossier': '查看档案', 'label.openResearch': '查看研究',
    'label.searchBrand': '搜索 Crypto Bros', 'label.searchResults': '搜索结果',
    'label.noMatchingPage': '未找到相关页面', 'label.openNamedResearch': '查看 {title} 研究',
    'label.rankedEvents': '项历史空投事件已排名',
    'label.sourcedCases': '含有来源的分发研究', 'label.strictCaseSet': '仅统计严格核实的案例',
    'label.publishedCountSummary': '在已公布数量的 {total} 个案例中有 {matched} 个',
    'label.atDistribution': '在发放时', 'label.airdropResearchReady': '空投研究已就绪 · 前30名与有来源案例',
    'label.publishedCount': '个已公布数量的案例', 'label.launchDayBasis': '按分发时价值排序',
    'label.peakHistoricalTable': '历史数据表', 'label.reconstructed': '重建估算',
    'label.projectResearch': '项目研究', 'label.openCase': '查看案例',
  },
  ja: {
    'nav.open': 'ナビゲーションを開く', 'nav.close': 'ナビゲーションを閉じる', 'nav.routes': 'Crypto Bros を見る',
    'nav.primary': 'メインナビゲーション', 'nav.dismiss': 'ナビゲーションを閉じる',
    'theme.light': 'ライトテーマに切り替え', 'theme.dark': 'ダークテーマに切り替え',
    'language.label': '言語', 'language.choose': '言語を選択', 'language.current': '現在の言語: {language}',
    'route.market': 'マーケット', 'route.research': 'リサーチ', 'route.dashboard': 'ダッシュボード',
    'route.maps': 'マップ', 'route.sentiment': 'センチメント', 'route.launchpads': 'ローンチパッド',
    'route.cases': 'ミームコイン事例', 'route.airdrops': 'エアドロップ', 'route.neobank': 'ネオバンク',
    'route.breakouts': 'ブレイクアウト', 'route.nft': 'NFT の歴史', 'route.nft2026': 'NFT 2026',
    'common.loading': '読み込み中', 'common.unavailable': '利用不可', 'common.error': 'エラー',
    'common.notDisclosed': '非公開',
    'common.retry': '再試行', 'common.search': '検索', 'common.reset': 'リセット', 'common.sources': '出典',
    'common.updated': '更新', 'common.viewSource': '出典を見る', 'common.readResearch': 'リサーチを読む',
    'common.marketCap': '時価総額', 'common.price': '価格', 'common.volume': '取引量',
    'common.24hVolume': '24時間取引量', 'common.24hChange': '24時間変動', 'common.rank': '順位',
    'common.chain': 'チェーン', 'common.project': 'プロジェクト', 'common.description': '説明',
    'airdrop.distributionValue': '配布時の価値', 'airdrop.wallets': 'ウォレット数',
    'airdrop.readCase': '事例を読む', 'airdrop.cases': 'プロジェクト事例',
    'table.country': '国', 'table.region': '地域', 'table.customers': '顧客数',
    'table.basis': '算出基準', 'table.revenue': '収益', 'table.model': 'モデル', 'table.site': 'サイト',
    'table.exchange': '取引所', 'table.trustScore': '信頼スコア', 'table.share': 'シェア',
    'table.jurisdiction': '法域', 'table.exchanges': '取引所数',
    'empty.noData': '利用可能なデータがありません', 'empty.noResults': '結果が見つかりません',
    'state.marketUnavailable': 'このトークンの市場調査データはありません。',
    'home.hero': '市場の動きを把握。', 'home.hero2': '歴史を読む。',
    'home.marketDirection': '市場動向、流動性、トークン調査をひとつの画面で確認できます。',
    'home.marketCap': 'ミームコイン時価総額', 'home.marketComposition': '市場構成',
    'home.gainersLosers': '上昇・下落ランキング', 'home.topGainers': '上昇率上位', 'home.topLosers': '下落率上位',
    'home.globalMap': '暗号資産の世界取引量マップ', 'home.movers': '市場変動を見る',
    'home.tokenResearch': 'トークン調査を読む', 'home.memeVolume': 'ミーム取引量 · 24時間',
    'home.marketShare': '暗号資産市場シェア', 'home.globalCap': '世界の時価総額',
    'home.dominance': 'BTC ドミナンス', 'home.coverage': 'データソースを確認中…',
    'route.airdropCases': 'エアドロップ事例', 'route.topAirdrops': 'エアドロップ上位 30 件',
    'route.caseStudies': '出典付きケーススタディ', 'route.nftCollections': '記録された最高フロア価格順',
    'route.neobankTitle': 'ネオバンク', 'route.neobankList': 'ネオバンクを見る', 'route.neobankRank': '顧客口座数順',
    'route.launchpadTitle': '主要ローンチパッド', 'route.launchpadCases': 'このプラットフォーム発の上位トークン',
    'route.breakoutTitle': '時価総額 1 億ドル超のミームコイン', 'route.currentLeaderboard': '時価総額 1 億ドル以上のランキング',
    'route.nftHistory': 'NFT の歴史', 'route.nftLatest': '最近の動き',
    'label.loadingResearch': '調査データを読み込み中…', 'label.loadingMarkets': '市場データを読み込み中…',
    'label.loadingCollections': 'コレクションを読み込み中…', 'label.loadingMetrics': '指標を読み込み中…',
    'label.loadingAirdrops': 'エアドロップ調査を読み込み中…', 'label.buildingTop30': '上位 30 件を整理中…',
    'label.readCase': '事例を読む', 'label.projectCases': 'プロジェクト調査', 'label.openDistribution': '配布事例を見る',
    'label.valueAtDistribution': '配布時の価値', 'label.recipientWallets': '受取ウォレット数',
    'label.currentFloor': '現在のフロア価格', 'label.peakFloor': '最高フロア価格', 'label.lifetimeVolume': '累計取引量',
    'label.24hVolume': '24時間取引量', 'label.inclusionMethod': '掲載基準',
    'label.researchMethodology': '調査方法', 'label.fullTable': '法域の全データ',
    'label.reset': 'リセット', 'label.labels': 'ラベル', 'label.autoRotate': '自動回転',
    'label.unavailable': '利用不可', 'label.waitingForData': 'データ待ち',
    'label.liveUnavailable': 'リアルタイム価格を取得できません', 'label.marketLoading': '市場データを準備中…',
    'label.mapLoading': '地図データを読み込み中…', 'label.globeLoading': '地球儀データを読み込み中…',
    'label.sources': 'データソース', 'label.ranking': 'ランキング', 'label.profiles': 'プロフィール',
    'label.method': '方法', 'label.caseSet': '事例一覧', 'label.latest': '最新',
    'label.updated': '更新', 'label.readMore': '調査を読む', 'label.companySite': '企業サイト',
    'label.openSentiment': 'センチメントを見る', 'label.viewSource': '出典を見る',
    'label.currentMarketCap': '現在の時価総額', 'label.marketShare': '市場シェア',
    'label.launchDate': 'ローンチ日', 'label.peakMarketCap': '最高時価総額',
    'label.priceAth': '価格 ATH', 'label.launchToAth': 'ローンチ → ATH',
    'label.project': 'プロジェクト', 'label.contract': 'コントラクト', 'label.chain': 'チェーン',
    'label.airdropIntro': 'エアドロップ情報 · 過去の配布',
    'label.airdropLead': '過去の配布価値を比較し、出典付きのプロジェクト資料を確認します。',
    'label.topLeaderboard': '上位ランキング', 'label.totalLaunchValue': '配布日の合計価値',
    'label.recipientWallets': '受取ウォレット数', 'label.largestLaunchCase': '配布日の最大事例',
    'label.allTimeAirdrops': '全期間ランキング · 調査基準日 2026年8月21日',
    'label.peakAllocation': '配布割当の最高評価額',
    'label.peakMethod': '配布トークン数 × トークンの ATH。下記の配布日価値とは別の指標です。',
    'label.filterAirdrops': '全期間エアドロップを絞り込む', 'label.allYears': 'すべての年',
    'label.year': '年', 'label.peakValueAllocation': '配布割当の最高評価額', 'label.basis': '算出基準',
    'label.nextAirdrop': '次の比較: 配布トークン数 × 出典付きローンチ日の価格。',
    'label.deepCaseRanking': '詳細事例ランキング', 'label.rankedValueDistribution': '配布時価値順',
    'label.sourcedDistributionPrice': '配布トークン数 × 出典付き配布日の価格。',
    'label.openDistribution': '配布事例を見る', 'label.rankingMethodology': 'ランキング方法',
    'label.airdropRisk': '配布割当の最高評価額は過去の比較値であり、受取者全員が実現できた金額ではありません。配布日の価値は別の指標です。過去のエアドロップは将来のリターンを示すものではありません。',
    'label.noEstimate': '取得できない値は推定しません。', 'label.companyAccounts': '出典のある最新の顧客口座数順です。',
    'label.collectionSort': '記録された最高フロア価格順のコレクション',
    'label.nftCollectionSummary': '現在のフロア、記録された最高値、取引量。リアルタイム値がない場合があります。',
    'label.searchThisSite': 'サイト内を検索', 'label.searchResearch': '調査、トークン、ページを検索…',
    'label.globalVolumeMap': '報告された暗号資産取引量はどこに集中していますか？',
    'label.exchangeVolumeGlobe': '取引所取引量の地球儀', 'label.jurisdictionRanking': '法域ランキング',
    'label.largeLaunchpads': '主要ローンチパッド', 'label.qualify': '掲載条件',
    'label.marketUniverse': '時価総額 1 億ドル超のミームコイン', 'label.currentLeaderboard': '時価総額 1 億ドル以上のランキング',
    'label.openDossier': '資料を開く', 'label.openResearch': '調査を開く',
    'label.searchBrand': 'Crypto Bros を検索', 'label.searchResults': '検索結果',
    'label.noMatchingPage': '該当するページがありません', 'label.openNamedResearch': '{title} の調査を開く',
    'label.rankedEvents': '件の過去のエアドロップ事例をランキング',
    'label.sourcedCases': '出典付き配布調査あり', 'label.strictCaseSet': '出典を厳格に確認した事例のみ',
    'label.publishedCountSummary': '件数を公表した {total} 件中 {matched} 件',
    'label.atDistribution': '配布時', 'label.airdropResearchReady': 'エアドロップ調査の準備完了 · 上位30件と出典付き事例',
    'label.publishedCount': '件の公表済み件数', 'label.launchDayBasis': '配布時価値順',
    'label.peakHistoricalTable': '過去の一覧', 'label.reconstructed': '再構成値',
    'label.projectResearch': 'プロジェクト調査', 'label.openCase': '事例を開く',
  },
};

const LOCALE_TAGS = { en: 'en-US', id: 'id-ID', 'zh-CN': 'zh-CN', ja: 'ja-JP' };
const LANGUAGE_NAMES = { en: 'English', id: 'Bahasa Indonesia', 'zh-CN': '简体中文', ja: '日本語' };
let locale = readLocale();
let observer;

function readLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LOCALES.includes(saved) ? saved : 'en';
  } catch { return 'en'; }
}

export function getLocale() { return locale; }
export function localeTag() { return LOCALE_TAGS[locale] || LOCALE_TAGS.en; }
export function translate(key, targetLocale = locale, fallback = '') {
  return COPY[targetLocale]?.[key] || COPY.en[key] || fallback || key;
}
export function t(key, fallback = '') { return translate(key, locale, fallback); }

function reversePhrase(value) {
  const normalized = value.trim();
  for (const [key, english] of Object.entries(COPY.en)) {
    if (english === normalized) return key;
    for (const lang of SUPPORTED_LOCALES) if (COPY[lang]?.[key] === normalized) return key;
  }
  return null;
}

function shouldSkip(node) {
  const parent = node.parentElement;
  return !parent || parent.closest('script,style,code,pre,svg,[data-no-i18n],.research-summary,.evidence-source,.article-prose,.lore-copy,[data-source-content]');
}

function translateTextNode(node) {
  if (!node?.isConnected || shouldSkip(node)) return;
  const original = node.textContent || '';
  const key = reversePhrase(original);
  if (!key) return;
  const leading = original.match(/^\s*/)?.[0] || '';
  const trailing = original.match(/\s*$/)?.[0] || '';
  const translated = `${leading}${t(key)}${trailing}`;
  if (translated !== original) node.textContent = translated;
}

function translateAttributes(root) {
  const nodes = [];
  if (root.nodeType === Node.ELEMENT_NODE) nodes.push(root);
  root.querySelectorAll?.('[aria-label],[title],[placeholder]')?.forEach((node) => nodes.push(node));
  for (const node of nodes) {
    if (node.closest?.('[data-no-i18n],.research-summary,.evidence-source,.article-prose,.lore-copy,[data-source-content]')) continue;
    for (const attribute of ['aria-label', 'title', 'placeholder']) {
      const value = node.getAttribute(attribute);
      const key = value && reversePhrase(value);
      if (key) node.setAttribute(attribute, t(key));
    }
  }
}

export function applyTranslations(root = document) {
  document.documentElement.lang = locale;
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walk.nextNode())) translateTextNode(node);
  translateAttributes(root);
  document.querySelectorAll('[data-language-option]').forEach((option) => {
    const active = option.dataset.languageOption === locale;
    option.setAttribute('aria-checked', String(active));
    option.classList.toggle('is-active', active);
  });
  const button = document.querySelector('[data-language-toggle]');
  if (button) {
    button.setAttribute('aria-label', `${t('language.label')}: ${LANGUAGE_NAMES[locale]}`);
    button.setAttribute('title', `${t('language.label')}: ${LANGUAGE_NAMES[locale]}`);
  }
}

function languageIcon() {
  return '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path></svg>';
}

function mountLanguageMenu() {
  const actions = document.querySelector('.head-actions');
  if (!actions || actions.querySelector('[data-language-toggle]')) return;
  const wrap = document.createElement('div');
  wrap.className = 'language-switcher';
  const button = document.createElement('button');
  button.className = 'language-toggle';
  button.type = 'button';
  button.dataset.languageToggle = '';
  button.setAttribute('aria-haspopup', 'menu');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = languageIcon();
  const menu = document.createElement('div');
  menu.className = 'language-menu';
  menu.id = 'languageMenu';
  menu.setAttribute('role', 'menu');
  menu.hidden = true;
  for (const code of SUPPORTED_LOCALES) {
    const option = document.createElement('button');
    option.className = 'language-option';
    option.type = 'button';
    option.dataset.languageOption = code;
    option.setAttribute('role', 'menuitemradio');
    option.setAttribute('aria-checked', 'false');
    option.textContent = LANGUAGE_NAMES[code];
    menu.append(option);
  }
  button.setAttribute('aria-controls', menu.id);
  wrap.append(button, menu);
  const theme = actions.querySelector('[data-theme-toggle]');
  if (theme) theme.after(wrap);
  else actions.prepend(wrap);

  const close = (restoreFocus = false) => {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus({ preventScroll: true });
  };
  button.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector(`[data-language-option="${locale}"]`)?.focus({ preventScroll: true });
  });
  menu.addEventListener('click', (event) => {
    const option = event.target.closest('[data-language-option]');
    if (!option) return;
    setLocale(option.dataset.languageOption);
    close(true);
  });
  menu.addEventListener('keydown', (event) => {
    const options = [...menu.querySelectorAll('[data-language-option]')];
    const current = Math.max(0, options.indexOf(document.activeElement));
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
        : (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[next]?.focus();
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (!wrap.contains(event.target)) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) close(true);
  });
}

export function setLocale(next) {
  if (!SUPPORTED_LOCALES.includes(next)) return locale;
  locale = next;
  try { localStorage.setItem(STORAGE_KEY, locale); } catch { /* storage may be disabled */ }
  applyTranslations(document);
  window.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }));
  return locale;
}

export function initI18n() {
  mountLanguageMenu();
  applyTranslations(document);
  if (!observer && 'MutationObserver' in window) {
    observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const added of record.addedNodes || []) {
          if (added.nodeType === Node.TEXT_NODE) translateTextNode(added);
          else if (added.nodeType === Node.ELEMENT_NODE) {
            const walker = document.createTreeWalker(added, NodeFilter.SHOW_TEXT);
            let text;
            while ((text = walker.nextNode())) translateTextNode(text);
            translateAttributes(added);
          }
        }
      }
    });
    observer.observe(document.body, { subtree: true, childList: true });
  }
}
