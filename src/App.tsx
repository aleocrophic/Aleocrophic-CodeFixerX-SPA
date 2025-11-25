import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  Code, Shield, Zap, Terminal, Cpu, Sparkles, 
  History, LogOut, User, Lock, Unlock, LayoutDashboard, 
  FileCode, Play, CheckCircle, Search, 
  Menu, X, ChevronRight, Command, LogIn, Info, 
  Server, Globe, Copyright, FileText, Eye, Maximize2, Minimize2, 
  Settings, Box, Activity, Languages, BookOpen, Key, Database, Layers, Clipboard, AlertTriangle, Heart, Briefcase, Laptop, Bug, Upload, Brain, MessageSquare, PlusCircle, RefreshCw, Send, ShoppingCart, Edit2, Trash2, PanelRight, ExternalLink, Github, Wifi, WifiOff, Fingerprint, Sidebar, SidebarClose, SidebarOpen, LogIn as LoginIcon,
  PlayCircle, FileJson, Download, FilePlus, MonitorPlay, AlertOctagon, Crown, Laptop2, Grid, Zap as Lightning,
  Maximize, Minimize, EyeOff, Layout
} from 'lucide-react';

// --- 1. FIREBASE CONFIGURATION (SECURED BY RAYHAN) ---
// Config ini sudah dipatenkan. Jangan diubah kecuali Bos Rayhan minta! 🔒
const firebaseConfig = {
  apiKey: "AIzaSyBpXhfpTR7KGfW5ESH_Z-9Wc8QyJ9YHxv8",
  authDomain: "remchat-fd4ea.firebaseapp.com",
  projectId: "remchat-fd4ea",
  storageBucket: "remchat-fd4ea.firebasestorage.app",
  messagingSenderId: "369353956112",
  appId: "1:369353956112:web:7aff645b1724ec80bfa395",
  measurementId: "G-QTHRQNXJKF"
};

// App ID for Firestore Data Isolation (tetap pakai env jika ada, atau default)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'remchat-production';

let app, auth, db;
try {
    // Init dengan Config Resmi Bos Rayhan
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 FIREBASE CONNECTED: REMCHAT SYSTEM ONLINE");
} catch (e) {
    console.warn("⚠️ FIREBASE CONNECTION ISSUE (OFFLINE MODE ACTIVATED)", e);
}

// --- FIREBASE HELPERS ---
const getUserCollection = (userId, colName) => db ? collection(db, 'artifacts', appId, 'users', userId, colName) : null;
const getUserDoc = (userId, colName, docId) => db ? doc(db, 'artifacts', appId, 'users', userId, colName, docId) : null;

// --- 2. DATA & TRANSLATIONS --- 
const LANGUAGES = { 
  en: { 
    label: 'English', flag: '🇺🇸', 
    modules: {
      debug: { name: 'Omni Debugger', desc: 'Fix syntax & logic errors.' },
      dep: { name: 'Dependency Scanner', desc: 'Analyze libs & security.' },
      sec: { name: 'Security Auditor', desc: 'Fix SQLi, XSS, RCE.' },
      perf: { name: 'Optimizer', desc: 'Boost speed & scalability.' },
      explain: { name: 'Code Explainer', desc: 'Deep logic breakdown.' },
      pair: { name: 'Pair Programmer', desc: 'Real-time collaboration.' },
      legacy: { name: 'Legacy Resurrection', desc: 'Modernize old stacks.' },
      cicd: { name: 'CI/CD Integrator', desc: 'Pipeline automation.' },
      custom: { name: 'Custom Commander', desc: 'Execute custom tasks.' },
      sim: { name: 'Adv. Simulation', desc: 'Sandbox execution.' },
      docs: { name: 'Dynamic Docs', desc: 'Docs, Review, Structure.' },
      exp: { name: 'Experimental UI', desc: 'AI Auto-Design UI.' }
    },
    ui: { 
      dashboard: 'Dashboard', chat: 'Free Chat', runner: 'JSX/TSX Runner', portalLabel: 'Portal System', history: 'History', upgrade: 'Upgrade Apex', login: 'Login', 
      analyze: 'Initiate Fix', input: 'Source Code', output: 'Output', processing: 'Processing...', settings: 'Settings', copy: 'Copy All', 
      model: 'AI Model', newChat: 'New Session', viewUI: 'View UI', hideUI: 'Hide UI', copyCode: 'Copy Code', copied: 'Copied', 
      modules: 'Modules', system: 'System', tools: 'AI Tools', welcome: 'Welcome', guest: 'Guest Mode', 
      authRequired: 'Auth Required', unlock: 'Unlock', enterKey: 'Enter License Key', orUpload: 'OR UPLOAD KEY', authenticate: 'AUTHENTICATE', 
      purchase: 'Purchase', devOverride: 'Developer Override', access: 'ACCESS', customKey: 'Gemini API Key', 
      chatPlaceholder: 'Type a message...', chatStart: 'Start chatting with CodeFixerX!', edit: 'Edit', 
      privacy: 'Privacy Policy', terms: 'Terms of Service', about: 'About Us', infra: 'Infrastructure', guide: 'User Guide', 
      roleUser: 'User', roleAI: 'CodeFixerX', buyKey: 'BUY APEX KEY', dontHaveKey: "DON'T HAVE A KEY?", 
      originTitle: 'Origin of Aleocrophic', specialThanks: 'Special Thanks', coreInfra: 'Core Infrastructure', 
      toggleHistory: 'Toggle History', sourceInput: 'SOURCE INPUT', getKey: 'Get API Key', saveEnter: 'Save & Enter', 
      apiKeyDesc: 'REQUIRED. Your personal Gemini API Key. Stored strictly locally on your device.', 
      enterApiFirst: 'System Locked. API Key Required.', 
      apiGateMsg: 'To prevent API abuse and flagging, a personal Gemini API Key is now mandatory to access the system.', 
      validateKey: 'VALIDATE & ENTER', 
      expanding: 'Enhancing Prompt (Apex AI)...',
      runnerTitle: 'Live JSX/TSX Viewer',
      runnerDesc: 'Run React components instantly in memory. No server required.',
      portalContent: { 
        aboutText: "CodeFixerX was born from a simple necessity: the modern development landscape is chaotic. Aleocrophic Systems, founded by Rayhan Dzaky Al Mubarok (NyxShade Interactive), aims to be the lighthouse in this storm.", 
        missionText: "Our mission is not to replace the developer, but to empower them with an 'Apex' level assistant.", 
        privacyText: "1. Auth Data: Stored securely via Google Firebase.\n2. Code Data: Sent ephemerally to Gemini API for processing. We do not store your code for training.", 
        termsText: "By using CodeFixerX, you agree strictly NOT to generate malware, ransomware, or any malicious code. Violators will be banned.", 
        guideLite: "Lite users have access to basic debugging and security scanning. Perfect for students and hobbyists.", 
        guideApex: "Apex users unlock CI/CD, Legacy Resurrection, UI Gen, and Auto-Expander.", 
        infraFrontend: "React 18 + Tailwind + Vite. Optimized for speed.", 
        infraBackend: "Google Firebase (Auth & Firestore). Serverless architecture.", 
        infraAI: "Google Gemini 2.5 Flash. High-Speed Reasoning Engine." 
      } 
    }  
  }, 
  id: { 
    label: 'Indonesia', flag: '🇮🇩', 
    modules: {
      debug: { name: 'Omni Debugger', desc: 'Perbaiki error & logika.' },
      dep: { name: 'Dependency Scanner', desc: 'Analisa library & keamanan.' },
      sec: { name: 'Security Auditor', desc: 'Cegah SQLi, XSS, RCE.' },
      perf: { name: 'Optimizer', desc: 'Tingkatkan kecepatan.' },
      explain: { name: 'Code Explainer', desc: 'Penjelasan mendalam.' },
      pair: { name: 'Pair Programmer', desc: 'Kolaborasi real-time.' },
      legacy: { name: 'Legacy Resurrection', desc: 'Modernisasi kode jadul.' },
      cicd: { name: 'CI/CD Integrator', desc: 'Otomatisasi pipeline.' },
      custom: { name: 'Custom Commander', desc: 'Perintah kustom.' },
      sim: { name: 'Adv. Simulation', desc: 'Eksekusi sandbox.' },
      docs: { name: 'Dynamic Docs', desc: 'Dokumentasi, Review, Struktur.' },
      exp: { name: 'Experimental UI', desc: 'Desain UI Otomatis.' }
    },
    ui: { 
      dashboard: 'Dasbor', chat: 'Obrolan Bebas', runner: 'JSX/TSX Runner', portalLabel: 'Portal Sistem', history: 'Riwayat', upgrade: 'Buka Apex', login: 'Masuk', 
      analyze: 'Mulai Analisa', input: 'Kode Sumber', output: 'Hasil', processing: 'Memproses...', settings: 'Pengaturan', copy: 'Salin Semua', 
      model: 'Model AI', newChat: 'Sesi Baru', viewUI: 'Lihat UI', hideUI: 'Tutup UI', copyCode: 'Salin Kode', copied: 'Disalin', 
      modules: 'Modul', system: 'Sistem', tools: 'Alat AI', welcome: 'Selamat Datang', guest: 'Mode Tamu', 
      authRequired: 'Butuh Login', unlock: 'Buka', enterKey: 'Masukkan Kunci Lisensi', orUpload: 'ATAU UPLOAD KUNCI', authenticate: 'AUTENTIKASI', 
      purchase: 'Beli', devOverride: 'Akses Pengembang', access: 'AKSES', customKey: 'API Key Gemini', 
      chatPlaceholder: 'Ketik pesan...', chatStart: 'Mulai mengobrol dengan CodeFixerX!', edit: 'Ubah', 
      privacy: 'Kebijakan Privasi', terms: 'Syarat Layanan', about: 'Tentang Kami', infra: 'Infrastruktur', guide: 'Panduan Pengguna', 
      roleUser: 'Pengguna', roleAI: 'CodeFixerX', buyKey: 'BELI KUNCI APEX', dontHaveKey: "BELUM PUNYA KUNCI?", 
      originTitle: 'Asal Usul Aleocrophic', specialThanks: 'Terima Kasih Khusus', coreInfra: 'Infrastruktur Inti', 
      toggleHistory: 'Buka Riwayat', sourceInput: 'SUMBER KODE', getKey: 'Dapatkan Key', saveEnter: 'Simpan & Masuk', 
      apiKeyDesc: 'WAJIB. API Key Gemini pribadi Anda. Disimpan secara lokal di perangkat ini.', 
      enterApiFirst: 'Sistem Terkunci. Butuh API Key.', 
      apiGateMsg: 'Untuk mencegah penyalahgunaan API, Kunci API Gemini pribadi sekarang wajib.', 
      validateKey: 'VALIDASI & MASUK', 
      expanding: 'Meningkatkan Prompt (Apex AI)...',
      runnerTitle: 'Live JSX/TSX Viewer',
      runnerDesc: 'Jalankan komponen React secara instan di memori. Tanpa server.',
      portalContent: { 
        aboutText: "CodeFixerX lahir dari kekacauan lanskap pengembangan modern. Aleocrophic Systems (NyxShade Interactive) bertujuan menjadi mercusuar dalam badai ini.", 
        missionText: "Misi kami memberdayakan pengembang dengan asisten level 'Apex'.", 
        privacyText: "1. Data Auth: Disimpan aman via Google Firebase.\n2. Kode: Diproses sementara via Gemini API. Kami tidak menyimpan kode Anda.", 
        termsText: "Dengan menggunakan CodeFixerX, Anda setuju untuk TIDAK membuat malware atau kode berbahaya. Pelanggar akan di-banned.", 
        guideLite: "Lite: Debugging dasar & pemindaian keamanan.", 
        guideApex: "Apex: CI/CD, Legacy Resurrection, UI Gen, Auto-Expander.", 
        infraFrontend: "React 18 + Tailwind + Vite.", 
        infraBackend: "Firebase (Auth & Firestore).", 
        infraAI: "Gemini 2.5 Flash." 
      } 
    }  
  },
  jp: { 
    label: '日本語', flag: '🇯🇵', 
    modules: {
      debug: { name: 'Omni Debugger', desc: 'バグ修正。' },
      dep: { name: 'Dependency Scanner', desc: '依存関係スキャン。' },
      sec: { name: 'Security Auditor', desc: 'セキュリティ監査。' },
      perf: { name: 'Optimizer', desc: '最適化。' },
      explain: { name: 'Code Explainer', desc: 'コード解説。' },
      pair: { name: 'Pair Programmer', desc: 'ペアプログラミング。' },
      legacy: { name: 'Legacy Resurrection', desc: 'レガシーコード復活。' },
      cicd: { name: 'CI/CD Integrator', desc: 'CI/CD統合。' },
      custom: { name: 'Custom Commander', desc: 'カスタムコマンド。' },
      sim: { name: 'Adv. Simulation', desc: '高度シミュレーション。' },
      docs: { name: 'Dynamic Docs', desc: '動的ドキュメント。' },
      exp: { name: 'Experimental UI', desc: '実験的UI生成。' }
    },
    ui: { 
      dashboard: 'ダッシュボード', chat: 'チャット', runner: 'JSX/TSXランナー', portalLabel: 'ポータル', history: '履歴', upgrade: 'Apexへ', login: 'ログイン', 
      analyze: '分析開始', input: 'ソース', output: '出力', processing: '処理中...', settings: '設定', copy: 'コピー', 
      model: 'AIモデル', newChat: '新規セッション', viewUI: 'UI表示', hideUI: 'UI非表示', copyCode: 'コードコピー', copied: 'コピー済', 
      modules: 'モジュール', system: 'システム', tools: 'AIツール', welcome: 'ようこそ', guest: 'ゲスト', 
      authRequired: '認証が必要', unlock: '解除', enterKey: 'ライセンスキー', orUpload: 'またはアップロード', authenticate: '認証', 
      purchase: '購入', devOverride: '開発者モード', access: 'アクセス', customKey: 'Gemini APIキー', 
      chatPlaceholder: 'メッセージを入力...', chatStart: 'チャットを開始！', edit: '編集', 
      privacy: 'プライバシー', terms: '利用規約', about: '概要', infra: 'インフラ', guide: 'ガイド', 
      roleUser: 'ユーザー', roleAI: 'CodeFixerX', buyKey: 'APEXキーを購入', dontHaveKey: 'キーがない？', 
      originTitle: '起源', specialThanks: '感謝', coreInfra: 'コアインフラ', 
      toggleHistory: '履歴切替', sourceInput: '入力', getKey: 'キー取得', saveEnter: '保存して入る', 
      apiKeyDesc: '必須。個人のGemini APIキー。ローカル保存。', 
      enterApiFirst: 'ロック中。APIキーが必要。', 
      apiGateMsg: 'API乱用防止のため、個人キーが必須です。', 
      validateKey: '検証して入る', 
      expanding: 'プロンプト拡張中...',
      runnerTitle: 'JSX/TSX ビューワー',
      runnerDesc: 'Reactコンポーネントを即座に実行。',
      portalContent: { 
        aboutText: "CodeFixerXは現代開発の混乱から生まれました。Aleocrophic Systems (NyxShade Interactive) はその灯台を目指します。", 
        missionText: "開発者をApexレベルのアシスタントで強化することが使命です。", 
        privacyText: "データ収集：最小限の認証データのみ。", 
        termsText: "マルウェア生成への使用は禁止されています。", 
        guideLite: "Lite: 基本デバッグとセキュリティ。", 
        guideApex: "Apex: CI/CD, レガシー復活, UI生成, 自動拡張。", 
        infraFrontend: "React 18 + Tailwind + Vite.", 
        infraBackend: "Firebase (Auth & Firestore).", 
        infraAI: "Gemini 2.5 Flash." 
      } 
    }  
  },
  ar: { label: 'العربية', flag: '🇸🇦', modules: { debug: { name: 'Omni Debugger', desc: 'تصحيح الأخطاء' }, dep: { name: 'Dependency Scanner', desc: 'فحص المكتبات' }, sec: { name: 'Security Auditor', desc: 'تدقيق أمني' }, perf: { name: 'Optimizer', desc: 'تحسين الأداء' }, explain: { name: 'Code Explainer', desc: 'شرح الكود' }, pair: { name: 'Pair Programmer', desc: 'مساعد مبرمج' }, legacy: { name: 'Legacy Resurrection', desc: 'تحديث الكود' }, cicd: { name: 'CI/CD Integrator', desc: 'أتمتة النشر' }, custom: { name: 'Custom Commander', desc: 'أوامر مخصصة' }, sim: { name: 'Adv. Simulation', desc: 'محاكاة' }, docs: { name: 'Dynamic Docs', desc: 'توثيق' }, exp: { name: 'Experimental UI', desc: 'واجهة مستخدم' } }, ui: { dashboard: 'لوحة القيادة', chat: 'دردشة حرة', runner: 'مشغل JSX/TSX', portalLabel: 'البوابة', history: 'السجل', upgrade: 'ترقية Apex', login: 'دخول', analyze: 'بدء التحليل', input: 'الكود المصدري', output: 'المخرجات', processing: 'جار المعالجة...', settings: 'الإعدادات', copy: 'نسخ الكل', model: 'نموذج AI', newChat: 'جلسة جديدة', viewUI: 'عرض واجهة', hideUI: 'إخفاء', copyCode: 'نسخ الكود', copied: 'تم النسخ', modules: 'وحدات', system: 'نظام', tools: 'أدوات AI', welcome: 'مرحبًا', guest: 'وضع الضيف', authRequired: 'مصادقة مطلوبة', unlock: 'فتح القفل', enterKey: 'مفتاح الترخيص', orUpload: 'أو رفع ملف', authenticate: 'توثيق', purchase: 'شراء', devOverride: 'تجاوز المطور', access: 'دخول', customKey: 'مفتاح Gemini API', chatPlaceholder: 'اكتب رسالة...', chatStart: 'ابدأ الدردشة!', edit: 'تعديل', privacy: 'الخصوصية', terms: 'الشروط', about: 'عنا', infra: 'البنية التحتية', guide: 'دليل المستخدم', roleUser: 'مستخدم', roleAI: 'CodeFixerX', buyKey: 'شراء مفتاح APEX', dontHaveKey: 'لا تملك مفتاحًا؟', originTitle: 'الأصل', specialThanks: 'شكر خاص', coreInfra: 'البنية الأساسية', toggleHistory: 'تاريخ التبديل', sourceInput: 'مصدر الإدخال', getKey: 'احصل على المفتاح', saveEnter: 'حفظ ودخول', apiKeyDesc: 'مطلوب. مفتاح Gemini API الخاص بك.', enterApiFirst: 'النظام مقفل. مطلوب مفتاح API.', apiGateMsg: 'لمنع إساءة الاستخدام، مفتاح API إلزامي.', validateKey: 'تحقق ودخول', expanding: 'توسيع الموجه...', runnerTitle: 'عارض JSX المباشر', runnerDesc: 'تشغيل مكونات React فورًا.', portalContent: { aboutText: "CodeFixerX: الحل لفوضى التطوير الحديث.", missionText: "تمكين المطورين بمساعد Apex.", privacyText: "بيانات المصادقة فقط.", termsText: "ممنوع البرمجيات الخبيثة.", guideLite: "Lite: تصحيح أساسي.", guideApex: "Apex: CI/CD، توسيع تلقائي.", infraFrontend: "React 18.", infraBackend: "Firebase.", infraAI: "Gemini 2.5." } } },
  ru: { label: 'Русский', flag: '🇷🇺', modules: { debug: { name: 'Omni Debugger', desc: 'Исправление ошибок' }, dep: { name: 'Dependency Scanner', desc: 'Сканер зависимостей' }, sec: { name: 'Security Auditor', desc: 'Аудит безопасности' }, perf: { name: 'Optimizer', desc: 'Оптимизация' }, explain: { name: 'Code Explainer', desc: 'Объяснение кода' }, pair: { name: 'Pair Programmer', desc: 'Парное программирование' }, legacy: { name: 'Legacy Resurrection', desc: 'Обновление легаси' }, cicd: { name: 'CI/CD Integrator', desc: 'CI/CD Пайплайн' }, custom: { name: 'Custom Commander', desc: 'Кастомные команды' }, sim: { name: 'Adv. Simulation', desc: 'Симуляция' }, docs: { name: 'Dynamic Docs', desc: 'Документация' }, exp: { name: 'Experimental UI', desc: 'Генерация UI' } }, ui: { dashboard: 'Дашборд', chat: 'Чат', runner: 'JSX/TSX Раннер', portalLabel: 'Портал', history: 'История', upgrade: 'Apex', login: 'Вход', analyze: 'Анализ', input: 'Исходный код', output: 'Вывод', processing: 'Обработка...', settings: 'Настройки', copy: 'Копировать', model: 'AI Модель', newChat: 'Новая сессия', viewUI: 'Показать UI', hideUI: 'Скрыть UI', copyCode: 'Копировать код', copied: 'Скопировано', modules: 'Модули', system: 'Система', tools: 'AI Инструменты', welcome: 'Добро пожаловать', guest: 'Гость', authRequired: 'Нужна авторизация', unlock: 'Разблокировать', enterKey: 'Введите ключ', orUpload: 'Или загрузите', authenticate: 'АУТЕНТИФИКАЦИЯ', purchase: 'Купить', devOverride: 'Режим разраба', access: 'ДОСТУП', customKey: 'Gemini API Ключ', chatPlaceholder: 'Введите сообщение...', chatStart: 'Начать чат!', edit: 'Ред.', privacy: 'Приватность', terms: 'Условия', about: 'О нас', infra: 'Инфраструктура', guide: 'Гайд', roleUser: 'Юзер', roleAI: 'CodeFixerX', buyKey: 'КУПИТЬ APEX КЛЮЧ', dontHaveKey: 'НЕТ КЛЮЧА?', originTitle: 'Происхождение', specialThanks: 'Благодарности', coreInfra: 'Ядро', toggleHistory: 'История', sourceInput: 'ВВОД', getKey: 'Получить ключ', saveEnter: 'Сохранить и войти', apiKeyDesc: 'ОБЯЗАТЕЛЬНО. Ваш личный Gemini API Key.', enterApiFirst: 'Система заблокирована. Нужен API Key.', apiGateMsg: 'Для доступа требуется личный ключ API.', validateKey: 'ПРОВЕРИТЬ И ВОЙТИ', expanding: 'Расширение промпта...', runnerTitle: 'Live JSX Viewer', runnerDesc: 'Запуск React компонентов в памяти.', portalContent: { aboutText: "CodeFixerX создан для порядка в хаосе разработки.", missionText: "Дать каждому разработчику помощника уровня Apex.", privacyText: "Только данные авторизации.", termsText: "Никакого вредоносного ПО.", guideLite: "Lite: Дебаг.", guideApex: "Apex: CI/CD, Авто-расширение.", infraFrontend: "React 18.", infraBackend: "Firebase.", infraAI: "Gemini 2.5." } } },
  de: { label: 'Deutsch', flag: '🇩🇪', modules: { debug: { name: 'Omni Debugger', desc: 'Fehlerbehebung' }, dep: { name: 'Dependency Scanner', desc: 'Abhängigkeits-Check' }, sec: { name: 'Security Auditor', desc: 'Sicherheitsaudit' }, perf: { name: 'Optimizer', desc: 'Optimierung' }, explain: { name: 'Code Explainer', desc: 'Code-Erklärung' }, pair: { name: 'Pair Programmer', desc: 'Pair Programming' }, legacy: { name: 'Legacy Resurrection', desc: 'Legacy-Modernisierung' }, cicd: { name: 'CI/CD Integrator', desc: 'CI/CD Pipeline' }, custom: { name: 'Custom Commander', desc: 'Benutzerdefiniert' }, sim: { name: 'Adv. Simulation', desc: 'Simulation' }, docs: { name: 'Dynamic Docs', desc: 'Dokumentation' }, exp: { name: 'Experimental UI', desc: 'UI-Generierung' } }, ui: { dashboard: 'Dashboard', chat: 'Freier Chat', runner: 'JSX/TSX Runner', portalLabel: 'Portal', history: 'Verlauf', upgrade: 'Apex Upgrade', login: 'Anmelden', analyze: 'Analysieren', input: 'Quellcode', output: 'Ausgabe', processing: 'Verarbeitung...', settings: 'Einstellungen', copy: 'Kopieren', model: 'KI-Modell', newChat: 'Neue Sitzung', viewUI: 'UI Anz.', hideUI: 'UI Aus', copyCode: 'Code Kopieren', copied: 'Kopiert', modules: 'Module', system: 'System', tools: 'KI-Tools', welcome: 'Willkommen', guest: 'Gastmodus', authRequired: 'Auth erforderlich', unlock: 'Freischalten', enterKey: 'Lizenzschlüssel', orUpload: 'ODER UPLOAD', authenticate: 'AUTHENTIFIZIEREN', purchase: 'Kaufen', devOverride: 'Entwickler', access: 'ZUGRIFF', customKey: 'Gemini API Key', chatPlaceholder: 'Nachricht tippen...', chatStart: 'Chat starten!', edit: 'Bearbeiten', privacy: 'Datenschutz', terms: 'AGB', about: 'Über uns', infra: 'Infrastruktur', guide: 'Anleitung', roleUser: 'Nutzer', roleAI: 'CodeFixerX', buyKey: 'APEX KEY KAUFEN', dontHaveKey: 'KEIN SCHLÜSSEL?', originTitle: 'Ursprung', specialThanks: 'Dank', coreInfra: 'Kern-Infra', toggleHistory: 'Verlauf', sourceInput: 'EINGABE', getKey: 'Key holen', saveEnter: 'Speichern & Eintreten', apiKeyDesc: 'ERFORDERLICH. Ihr persönlicher Gemini API Key.', enterApiFirst: 'System gesperrt. API Key nötig.', apiGateMsg: 'Ein persönlicher API-Schlüssel ist jetzt zwingend erforderlich.', validateKey: 'PRÜFEN & EINTRETEN', expanding: 'Prompt erweitern...', runnerTitle: 'Live JSX Viewer', runnerDesc: 'React-Komponenten sofort ausführen.', portalContent: { aboutText: "CodeFixerX bringt Ordnung ins Entwicklungschaos.", missionText: "Entwickler mit Apex-Assistenten stärken.", privacyText: "Nur Auth-Daten.", termsText: "Keine Malware.", guideLite: "Lite: Debugging.", guideApex: "Apex: CI/CD, Auto-Expander.", infraFrontend: "React 18.", infraBackend: "Firebase.", infraAI: "Gemini 2.5." } } },
  es: { label: 'Español', flag: '🇪🇸', modules: { debug: { name: 'Omni Debugger', desc: 'Corrección de errores' }, dep: { name: 'Dependency Scanner', desc: 'Escaneo de dependencias' }, sec: { name: 'Security Auditor', desc: 'Auditoría de seguridad' }, perf: { name: 'Optimizer', desc: 'Optimización' }, explain: { name: 'Code Explainer', desc: 'Explicación de código' }, pair: { name: 'Pair Programmer', desc: 'Programación en pareja' }, legacy: { name: 'Legacy Resurrection', desc: 'Modernización Legacy' }, cicd: { name: 'CI/CD Integrator', desc: 'Integración CI/CD' }, custom: { name: 'Custom Commander', desc: 'Comandos personalizados' }, sim: { name: 'Adv. Simulation', desc: 'Simulación' }, docs: { name: 'Dynamic Docs', desc: 'Documentación' }, exp: { name: 'Experimental UI', desc: 'Generación UI' } }, ui: { dashboard: 'Tablero', chat: 'Chat Libre', runner: 'Ejecutor JSX/TSX', portalLabel: 'Portal', history: 'Historial', upgrade: 'Mejorar Apex', login: 'Entrar', analyze: 'Analizar', input: 'Código Fuente', output: 'Salida', processing: 'Procesando...', settings: 'Ajustes', copy: 'Copiar', model: 'Modelo IA', newChat: 'Nueva Sesión', viewUI: 'Ver UI', hideUI: 'Ocultar UI', copyCode: 'Copiar Código', copied: 'Copiado', modules: 'Módulos', system: 'Sistema', tools: 'Herramientas IA', welcome: 'Bienvenido', guest: 'Modo Invitado', authRequired: 'Autenticación req.', unlock: 'Desbloquear', enterKey: 'Clave de Licencia', orUpload: 'O SUBIR CLAVE', authenticate: 'AUTENTICAR', purchase: 'Comprar', devOverride: 'Acceso Dev', access: 'ACCESO', customKey: 'Clave API Gemini', chatPlaceholder: 'Escribe un mensaje...', chatStart: '¡Empieza a chatear!', edit: 'Editar', privacy: 'Privacidad', terms: 'Términos', about: 'Nosotros', infra: 'Infraestructura', guide: 'Guía', roleUser: 'Usuario', roleAI: 'CodeFixerX', buyKey: 'COMPRAR CLAVE APEX', dontHaveKey: '¿SIN CLAVE?', originTitle: 'Origen', specialThanks: 'Gracias', coreInfra: 'Infraestructura', toggleHistory: 'Historial', sourceInput: 'ENTRADA', getKey: 'Obtener Clave', saveEnter: 'Guardar y Entrar', apiKeyDesc: 'REQUERIDO. Tu clave personal de Gemini API.', enterApiFirst: 'Sistema Bloqueado. Se requiere clave API.', apiGateMsg: 'Se requiere una clave API personal para acceder.', validateKey: 'VALIDAR Y ENTRAR', expanding: 'Expandiendo Prompt...', runnerTitle: 'Visor JSX en Vivo', runnerDesc: 'Ejecuta componentes React al instante.', portalContent: { aboutText: "CodeFixerX nació para ordenar el caos del desarrollo.", missionText: "Empoderar desarrolladores con asistente Apex.", privacyText: "Solo datos de auth.", termsText: "No malware.", guideLite: "Lite: Depuración.", guideApex: "Apex: CI/CD, Auto-Expansor.", infraFrontend: "React 18.", infraBackend: "Firebase.", infraAI: "Gemini 2.5." } } }
}; 

// --- 3. UTILITY COMPONENTS --- 
const highlightSyntax = (code) => { 
  if (!code) return ''; 
  let safeCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); 
  const placeholders = []; 
  const addPlaceholder = (content, type) => { placeholders.push({ content, type }); return `%%%PH_${placeholders.length - 1}%%%`; }; 
  safeCode = safeCode.replace(/(".*?"|'.*?'|`.*?`)/g, match => addPlaceholder(match, 'string'))
    .replace(/(\/\/.*$)/gm, match => addPlaceholder(match, 'comment'))
    .replace(/(\/\*[\s\S]*?\*\/)/g, match => addPlaceholder(match, 'comment')); 
  const keywords = "\\b(const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await|try|catch|switch|case|new|this|typeof|interface|type|extends|implements|public|private|protected|static|readonly|constructor|def|print|class|self|init|useEffect|useState|useRef|React|useReducer|ErrorInfo|ReactNode)\\b"; 
  safeCode = safeCode.replace(new RegExp(keywords, 'g'), match => addPlaceholder(match, 'keyword')); 
  safeCode = safeCode.replace(/(\w+)(?=\()/g, match => addPlaceholder(match, 'function')); 
  return safeCode.replace(/%%%PH_(\d+)%%%/g, (_, index) => { 
    const item = placeholders[parseInt(index)]; 
    if (item.type === 'string') return `<span class="text-emerald-400">${item.content}</span>`; 
    if (item.type === 'comment') return `<span class="text-slate-500 italic">${item.content}</span>`; 
    if (item.type === 'keyword') return `<span class="text-pink-400 font-semibold">${item.content}</span>`; 
    if (item.type === 'function') return `<span class="text-cyan-400">${item.content}</span>`; 
    return item.content; 
  }); 
}; 

const MarkdownRenderer = ({ content, copyLabel, copiedLabel }) => { 
  if (!content) return null; 
  const parts = content.split(/(```[\s\S]*?```)/g); 
  return ( 
    <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans"> 
      {parts.map((part, idx) => { 
        if (part.startsWith('```')) { 
          const lines = part.split('\n'); 
          const lang = lines[0].replace('```', '').trim() || 'text'; 
          const codeBody = lines.slice(1, -1).join('\n'); 
          return <CodeBlock key={idx} lang={lang} code={codeBody} copyLabel={copyLabel} copiedLabel={copiedLabel} />; 
        } else { 
          let html = part.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-cyan-400 mt-6 mb-2 flex items-center gap-2"><span class="w-1 h-4 bg-cyan-500 rounded-full"></span>$1</h3>').replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-amber-400 mt-8 mb-4 border-b border-slate-800 pb-2">$1</h2>').replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-8 mb-4 border-b-2 border-slate-700 pb-2">$1</h1>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-slate-400 italic">$1</em>').replace(/`(.*?)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs border border-slate-700">$1</code>').replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-400 mb-1 pl-1">$1</li>').replace(/\n/g, '<br />'); 
          return <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />; 
        } 
      })} 
    </div> 
  ); 
}; 

const CodeBlock = ({ lang, code, copyLabel, copiedLabel }) => { 
  const [copied, setCopied] = useState(false); 
  const handleCopy = () => { 
    const textarea = document.createElement('textarea'); textarea.value = code; document.body.appendChild(textarea); textarea.select(); 
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) {} 
    document.body.removeChild(textarea); 
  }; 
  return ( 
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950 my-4 shadow-lg group relative"> 
      <div className="flex justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 items-center"> 
        <span className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-2"><Terminal size={12}/> {lang}</span> 
        <button onClick={handleCopy} className={`text-xs flex items-center gap-1 transition-all ${copied ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}> {copied ? <CheckCircle size={12}/> : <Clipboard size={12}/>} {copied ? copiedLabel : copyLabel} </button> 
      </div> 
      <div className="relative"> 
        <pre className="p-4 overflow-x-auto font-mono text-xs md:text-sm text-slate-200 selection:bg-cyan-500/30"> <code dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }} /> </pre> 
      </div> 
    </div> 
  ); 
} 

// --- 4. DYNAMIC MODULE GENERATOR (FINE-TUNED & SPECIFIC) ---
const getModules = (langCode) => {
  const L = LANGUAGES[langCode] || LANGUAGES.en;
  const M = L.modules || LANGUAGES.en.modules;
  return [ 
    { id: 'debug', name: M.debug.name, icon: <Code />, premium: false, desc: M.debug.desc, systemPrompt: "I am CodeFixerX Modul Omni Debugger. Role: Elite Code Debugger. Task: Analyze code for flaws, race conditions, and logic errors. Output: Corrected code with detailed comments. Explain the 'Why' behind the fix." }, 
    { id: 'dep', name: M.dep.name, icon: <Search />, premium: false, desc: M.dep.desc, systemPrompt: "I am CodeFixerX Modul Dependency Scanner. Role: Security Analyst. Task: Scan imports for deprecated/insecure libs. Suggest modern alternatives (e.g., axios over request). Explain security implications." }, 
    { id: 'sec', name: M.sec.name, icon: <Shield />, premium: false, desc: M.sec.desc, systemPrompt: "I am CodeFixerX Modul Security Auditor. Role: Cybersecurity Expert. Task: Audit code for OWASP Top 10 vulnerabilities (XSS, SQLi, CSRF). Refactor into secure code immediately. Explain the vulnerability and the fix." }, 
    { id: 'perf', name: M.perf.name, icon: <Zap />, premium: false, desc: M.perf.desc, systemPrompt: "I am CodeFixerX Modul Optimizer. Role: Performance Engineer. Task: Optimize Big-O complexity, reduce re-renders (React), and minimize memory usage. Provide highly optimized refactored code with benchmarks." }, 
    { id: 'explain', name: M.explain.name, icon: <FileCode />, premium: false, desc: M.explain.desc, systemPrompt: "I am CodeFixerX Modul Code Explainer. Role: Senior Tech Lead. Task: Explain the code logic simply but technically. Use analogies. Break down complex algorithms into steps. Teach the user like a mentor." }, 
    { id: 'pair', name: M.pair.name, icon: <User />, premium: false, desc: M.pair.desc, systemPrompt: "I am CodeFixerX Modul Pair Programmer. Role: AI Pair Programmer. Task: Complete the user's code snippet, suggest improvements, or write the next logical function. Be helpful, collaborative, and educational." }, 
    // APEX
    { id: 'legacy', name: M.legacy.name, icon: <History />, premium: true, desc: M.legacy.desc, systemPrompt: "I am CodeFixerX Modul Legacy Resurrection. Role: Legacy Specialist. Task: Convert outdated code (jQuery, PHP 5, COBOL) into modern, clean, typed code (React, Node.js, TypeScript, Go). Preserve business logic." }, 
    { id: 'cicd', name: M.cicd.name, icon: <Cpu />, premium: true, desc: M.cicd.desc, systemPrompt: "I am CodeFixerX Modul CI/CD Integrator. Role: DevOps Architect. Task: Generate production-ready CI/CD pipelines (GitHub Actions, Docker). Include linting and testing steps." }, 
    { id: 'custom', name: M.custom.name, icon: <Terminal />, premium: true, desc: M.custom.desc, systemPrompt: "I am CodeFixerX Modul Custom Commander. Role: Polyglot Expert. Task: Execute any custom coding instruction with precision." }, 
    { id: 'sim', name: M.sim.name, icon: <Play />, premium: true, desc: M.sim.desc, systemPrompt: "I am CodeFixerX Modul Advanced Simulation. Role: Virtual Runtime. Task: Trace execution flow variables step-by-step. Predict outputs and edge cases." }, 
    { id: 'docs', name: M.docs.name, icon: <FileText />, premium: true, desc: M.docs.desc, systemPrompt: "I am CodeFixerX Modul Dynamic Docs. Role: Senior Technical Writer. Task: Generate professional documentation (README.md, JSDoc) for the provided code. Include installation and usage steps." }, 
    { id: 'exp', name: M.exp.name, icon: <Sparkles />, premium: true, desc: M.exp.desc, systemPrompt: "I am CodeFixerX Modul Experimental UI. Role: UI/UX Architect. Task: Generate stunning, responsive React components using Tailwind CSS and Lucide Icons. Focus on aesthetics. Output full single file code." }, 
  ];
};

const AI_MODELS = [ { id: 'gemini-2.5-flash-preview-09-2025', name: 'Gemini 2.5 Flash (Apex)', desc: 'Next-Gen High Performance' } ]; 

// --- 5. MAIN APP --- 
export default function App() {  
  // STATE
  const [user, setUser] = useState(null); 
  const [view, setView] = useState('loading'); 
  const [langCode, setLangCode] = useState('en'); 
  const [isPremium, setIsPremium] = useState(false); 
  const [aiModel, setAiModel] = useState(AI_MODELS[0].id); 
  const [apiStatus, setApiStatus] = useState('idle'); 
  const [isDevMode, setIsDevMode] = useState(false); 
  const [devPin, setDevPin] = useState(''); 
  const [currentModuleId, setCurrentModuleId] = useState('debug');

  // Runner State
  const [isRunnerFullScreen, setIsRunnerFullScreen] = useState(false);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false); 

  // I/O State
  const [inputCode, setInputCode] = useState(''); 
  const [outputResult, setOutputResult] = useState(''); 
  const [isInputMinimized, setIsInputMinimized] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [expanding, setExpanding] = useState(false); 

  // History & Chat
  const [history, setHistory] = useState([]); 
  const [chatMessages, setChatMessages] = useState([]); 
  const [chatInput, setChatInput] = useState(''); 
  const [chatLoading, setChatLoading] = useState(false); 
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false); 
  const chatInputRef = useRef(null); 
  const [historySidebarOpen, setHistorySidebarOpen] = useState(true); 

  // UI Helpers
  const [sidebarOpen, setSidebarOpen] = useState(false);  
  const [premiumKey, setPremiumKey] = useState(''); 
  const [customApiKey, setCustomApiKey] = useState(''); 
  const [gateApiKey, setGateApiKey] = useState(''); 
  const [notif, setNotif] = useState(null); 
  const [portalTab, setPortalTab] = useState('about');  
  const [generatedApiKey, setGeneratedApiKey] = useState("GUEST"); 
  const [hoshinoImgError, setHoshinoImgError] = useState(false); 

  // JSX Runner - New Professional SaaS Template
  const DEFAULT_TEMPLATE = `function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      <nav className="flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
          <span className="font-bold text-xl tracking-tight">NovaUI</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition">Features</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
          <a href="#" className="hover:text-white transition">Docs</a>
        </div>
        <button className="px-5 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition">Get Started</button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-purple-400 animate-pulse">
            v2.0 is now live ✨
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-600 bg-clip-text text-transparent pb-2">
            Build the future,<br />one component at a time.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The ultimate development platform for modern teams. Ship faster with our pre-built components and powerful CLI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition transform hover:-translate-y-1">
              Start Building
            </button>
            <button className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 rounded-xl font-bold transition">
              View Components
            </button>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Lightning Fast", desc: "Zero-runtime overhead with compiled styles.", icon: "⚡" },
            { title: "Type Safe", desc: "Built with TypeScript for rock-solid reliability.", icon: "🛡️" },
            { title: "Accessible", desc: "WAI-ARIA compliant components out of the box.", icon: "♿" }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition group cursor-default">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

render(<LandingPage />);`;

  const [runnerCode, setRunnerCode] = useState(DEFAULT_TEMPLATE);
  const [runnerPreview, setRunnerPreview] = useState('');
  const runnerEditorRef = useRef(null); 

  // Helpers
  const getLangObj = () => LANGUAGES[langCode] || LANGUAGES.en; 
  const tText = (key) => { 
    const lang = getLangObj(); 
    if (lang.ui && typeof lang.ui[key] === 'string') return lang.ui[key];
    return LANGUAGES.en.ui[key] || key; 
  }; 
  const tData = (key) => { const lang = getLangObj(); return lang.ui?.portalContent?.[key] || key; } 
  const notify = (msg, type = 'info') => { setNotif({msg, type}); setTimeout(() => setNotif(null), 3000); }; 
  const currentModules = getModules(langCode);
  const currentModule = currentModules.find(m => m.id === currentModuleId) || currentModules[0];

  // --- 6. STRICT INIT & FLOW LOGIC ---
  useEffect(() => { 
    // 1. LOAD LOCAL SETTINGS
    const savedLang = localStorage.getItem('cfx_lang'); 
    const savedKey = localStorage.getItem('cfx_api_key'); 
    const savedModel = localStorage.getItem('cfx_ai_model'); 
    const savedPremium = localStorage.getItem('cfx_is_premium');  

    if (savedLang && LANGUAGES[savedLang]) setLangCode(savedLang); 
    if (savedKey && savedKey.trim().length > 10) setCustomApiKey(savedKey); 
    if (savedModel) setAiModel(savedModel); 
    if (savedPremium === 'true') setIsPremium(true); 

    // 2. LOAD HISTORY (AdBlock Backup)
    try {
        const localHist = localStorage.getItem('cfx_history_backup');
        if (localHist) setHistory(JSON.parse(localHist));
    } catch(e) {}

    // 3. INIT AUTH (OFFLINE FAILSAFE)
    // If Auth object is missing (AdBlock/Network Error), skip auth flow.
    if (!auth) {
        console.warn("AUTH SERVICE MISSING. SKIPPING INIT.");
        return;
    }

    const initAuth = async () => {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            try { await signInWithCustomToken(auth, __initial_auth_token); } catch(e) {}
        }
    };
    initAuth();

    // 4. PERFECT FLOW LISTENER
    const unsub = onAuthStateChanged(auth, async (u) => {  
      setUser(u);  
      const hasLang = localStorage.getItem('cfx_lang');
      const hasKey = localStorage.getItem('cfx_api_key');
      if (isDevMode) { setView('dashboard'); return; }
      // --- STRICT FLOW ENFORCEMENT (V6.0) ---
      if (!hasLang) { setView('language'); return; }
      if (!hasKey) { setView('apikey_gate'); return; }
      if (u) {
        if (u.isAnonymous) { setIsPremium(false); setGeneratedApiKey("GUEST"); } 
        else {
            setGeneratedApiKey(`CFX-${u.uid.substring(0,6).toUpperCase()}`);
             if (db) { try { const docSnap = await getDoc(getUserDoc(u.uid, 'account', 'profile')); if (docSnap.exists() && docSnap.data().isPremium) { setIsPremium(true); localStorage.setItem('cfx_is_premium', 'true'); } } catch (e) {} }
        }
        setView('dashboard');
      } else {
        setView('login');
      }
    }); 
    const handleResize = () => { if (window.innerWidth < 1024) { setSidebarOpen(false); setHistorySidebarOpen(false); } else { setSidebarOpen(true); setHistorySidebarOpen(true); } }; 
    handleResize(); window.addEventListener('resize', handleResize); 
    return () => { unsub(); window.removeEventListener('resize', handleResize); }; 
  }, [isDevMode]); 

  // --- OFFLINE MODE FALLBACK (V9.0) ---
  useEffect(() => {
      // If Firebase failed to init (auth is null), we manually trigger the flow check based on localStorage
      // to prevent "Blank Screen" stuck on loading.
      if (!auth) {
          const hasLang = localStorage.getItem('cfx_lang');
          const hasKey = localStorage.getItem('cfx_api_key');
          if (!hasLang) setView('language');
          else if (!hasKey) setView('apikey_gate');
          else setView('dashboard'); // Force Guest Mode
      }
  }, []);

  // --- RESTORED FUNCTIONS ---
  const handleNewSession = () => {
      if (view === 'runner') {
         setRunnerCode(DEFAULT_TEMPLATE);
         setRunnerPreview('');
         notify("Reset to Template", "success");
      } else {
         setChatMessages([]);
         setInputCode('');
         setOutputResult('');
         setIsInputMinimized(false);
         notify(tText('newChat'), "success");
      }
  };
  const handleCopyOutput = () => { navigator.clipboard.writeText(outputResult).then(() => notify(tText('copy') + " Success!", "success")).catch(() => notify("Copy failed", "error")); };
  const handleDevUnlock = () => { if (devPin === "200924-RDZ-DVLP") { setIsDevMode(true); setGeneratedApiKey("RDZ-DEV-ROOT"); notify("⚠️ DEVELOPER MODE ACTIVE", "success"); setView('dashboard'); setDevPin(''); } else { notify("ACCESS DENIED 💀", "error"); } }; 
  const handleUnlock = async () => { 
    if ((!user || user.isAnonymous) && !isDevMode) { notify("Guest Access Denied! Redirecting...", "error"); setView('login'); return; } 
    const cleanKey = premiumKey.trim(); 
    if (cleanKey === "CFX-APX-2025R242") { setIsPremium(true); localStorage.setItem('cfx_is_premium', 'true'); notify("APEX UNLOCKED 🔥", "success"); setView('dashboard'); if (user && db) { try { await setDoc(getUserDoc(user.uid, 'account', 'profile'), { isPremium: true }, { merge: true }); } catch(e) {} } } else notify("Invalid Key", "error"); 
  }; 
  const handleEditorScroll = (e) => { if (runnerEditorRef.current) { runnerEditorRef.current.scrollTop = e.target.scrollTop; runnerEditorRef.current.scrollLeft = e.target.scrollLeft; } };
  const saveToHistory = async (entry) => {
      const newEntry = { ...entry, id: 'local_' + Date.now(), createdAt: { seconds: Math.floor(Date.now() / 1000) } };
      try { const currentLocal = JSON.parse(localStorage.getItem('cfx_history_backup') || '[]'); const updatedLocal = [newEntry, ...currentLocal].slice(0, 50); localStorage.setItem('cfx_history_backup', JSON.stringify(updatedLocal)); setHistory(prev => [newEntry, ...prev]); } catch (e) {}
      if (user && !isDevMode && db) { try { await addDoc(getUserCollection(user.uid, 'history'), { ...entry, createdAt: serverTimestamp() }); } catch (e) {} }
  };
  useEffect(() => { if (!user || !db) return; try { const colRef = getUserCollection(user.uid, 'history'); if (!colRef) return; const unsub = onSnapshot(colRef, (snap) => { const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() })); fetched.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)); setHistory(fetched); localStorage.setItem('cfx_history_backup', JSON.stringify(fetched.slice(0, 50))); }, (error) => {}); return () => unsub(); } catch (e) {} }, [user]);

  // --- ACTIONS ---
  const handleGateSubmit = () => { if (!gateApiKey.trim() || gateApiKey.length < 10) return notify("Invalid API Key", "error"); localStorage.setItem('cfx_api_key', gateApiKey.trim()); setCustomApiKey(gateApiKey.trim()); notify("Key Secured! 🛡️", "success"); setView('login'); }; 
  const handleLogin = async () => { try { await signInWithPopup(auth, new GoogleAuthProvider()); notify("Identity Verified! 🌸", "success"); } catch (e) { if (e.code === 'auth/popup-blocked') { notify("Popup blocked? Trying Anon...", "warning"); await signInAnonymously(auth); } else notify("Login Failed", "error"); } }; 
  const handleGuestAccess = async () => { try { await signInAnonymously(auth); setIsPremium(false); notify("Guest Mode Active", "info"); } catch (e) {} }; 
  const handleLoginBack = () => { const hasKey = localStorage.getItem('cfx_api_key'); if (hasKey) { setView('dashboard'); } else { setView('apikey_gate'); } };

  // --- APEX PROMPT EXPANDER (NEURO-ENHANCE) ---
  const handlePromptExpansion = async (rawInput, apiKey) => {
    try {
        const expanderPrompt = `
            ROLE: Elite Software Architect & Prompt Engineer.
            TASK: Upgrade this user input into a highly detailed, professional technical prompt.
            INPUT: "${rawInput}"
            INSTRUCTIONS:
            1. Identify the core task (e.g., "make landing page").
            2. Add modern requirements: React 18, Tailwind CSS, Responsive Design, Accessibility (WCAG), Error Handling.
            3. If user implies a full app, structure it for a Single File Component (SPA).
            OUTPUT: Just the enhanced prompt text.
        `;
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ contents: [{ parts: [{ text: expanderPrompt }] }] }) });
        const data = await resp.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || rawInput;
    } catch (e) { return rawInput; }
  };

  const handleAnalyze = async () => { 
    if (!customApiKey) { setView('apikey_gate'); return; } 
    if (!inputCode.trim()) return notify("Input Empty 😅", "warning"); 
    if (currentModule.premium && !isPremium) return notify("Locked! 🔒 Upgrade to Apex.", "error"); 

    setLoading(true); setApiStatus('loading'); setOutputResult(''); setIsInputMinimized(false); 
    try { 
      let finalPrompt = inputCode;
      if (isPremium) { 
          setExpanding(true);
          const expanded = await handlePromptExpansion(inputCode, customApiKey);
          finalPrompt = expanded;
          setExpanding(false);
      }
      // SMART DEFAULT FORMATS
      const defaultFormat = isPremium ? "TypeScript (TSX)" : "JavaScript (JSX)";
      const sysPrompt = `${isPremium ? "Role: Principal Architect (Apex)" : "Role: Junior Dev (Lite)"}. 
      Language: ${getLangObj().label}. Task: ${currentModule.systemPrompt}
      FORMAT RULES:
      1. DEFAULT OUTPUT: ${defaultFormat}.
      2. IF USER SAYS "HTML", OUTPUT RAW HTML FILE.
      3. IF USER SAYS "SPA/FULLSTACK", OUTPUT ONE COMPLETE FILE (Components + Styles).
      4. EXPLAIN THE CODE IN DETAIL: Use analogies, break down logic steps, explain 'why'.
      5. NO PREAMBLE. JUST CODE AND COMMENTS.`;

      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${customApiKey}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ contents: [{ parts: [{ text: finalPrompt }] }], systemInstruction: { parts: [{ text: sysPrompt }] } }) }); 
      const data = await resp.json();
      if(data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No Output.";
      setOutputResult(text); setIsInputMinimized(true); setApiStatus('success'); 
      await saveToHistory({ userId: user?.uid || 'guest', codeSnippet: inputCode.substring(0,50), module: currentModule.name, response: text, type: 'code' });
    } catch (e) { notify(e.message, "error"); setApiStatus('error'); if (e.message.includes("API KEY")) setView('apikey_gate'); } 
    finally { setLoading(false); setExpanding(false); } 
  }; 

  // --- JSX RUNNER EXECUTION (OMNI-COMPILER V8.0) ---
  const handleRunnerExecute = () => {
    // 1. SUPER REGEX: Strip Imports (Multiline Support)
    let processedCode = runnerCode
        .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '') // Remove all imports
        .replace(/type\s+\w+\s+=[\s\S]*?;/g, '') // Remove types
        .replace(/interface\s+\w+\s+\{[\s\S]*?\}/g, '') // Remove interfaces
        .replace(/export\s+default\s+|export\s+/g, ''); // Remove exports

    // 2. INJECT BOILERPLATE & POLYFILLS
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>body{background:#000;color:#fff}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}</style></head><body><div id="root"></div>
    <script type="text/babel" data-presets="react,typescript">
    // -- POLYFILLS --
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    // Destructure common hooks
    const { useState, useEffect, useRef, useMemo, useCallback, useReducer, createContext, useContext, Suspense, lazy } = React;
    
    // GLOBALIZE LUCIDE ICONS (CRITICAL FIX FOR COMPLEX IMPORTS)
    if (window.lucide && window.lucide.icons) {
        Object.assign(window, window.lucide.icons);
    }

    // Error Boundary
    class ErrorBoundary extends React.Component {
        constructor(props){super(props);this.state={hasError:false,error:null}}
        static getDerivedStateFromError(error){return{hasError:true,error}}
        render(){
            if(this.state.hasError) return (
                <div className="p-4 text-red-400 bg-red-900/20 border-l-4 border-red-500 rounded font-mono text-sm">
                    <strong className="block text-lg mb-2">💥 Runtime Error</strong>
                    {this.state.error.toString()}
                </div>
            );
            return this.props.children;
        }
    }

    // Render Helper
    const render = (Component) => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(ErrorBoundary, null, React.createElement(Component)));
    }

    // -- USER CODE --
    try {
        ${processedCode}
    } catch(e) {
        document.body.innerHTML = '<div class="p-4 text-red-500 font-mono"><h3>Syntax/Compile Error:</h3>' + e.message + '</div>';
    }
    </script></body></html>`;
    setRunnerPreview(html);
    notify("Compiling... ⚛️", "success");
  };

  const handleChatSend = async () => { 
    if (!customApiKey) { setView('apikey_gate'); return; } 
    if(!chatInput.trim()) return; 
    const newUserMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newUserMsg]); 
    const currentInput = chatInput;
    setChatInput(''); setChatLoading(true); setApiStatus('loading'); 
    try { 
      // SAME SMART DEFAULT LOGIC FOR CHAT
      const defaultFormat = isPremium ? "TypeScript (TSX)" : "JavaScript (JSX)";
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${customApiKey}`, { 
        method: 'POST', headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ contents: [{ parts: [{ text: currentInput }] }], systemInstruction: { parts: [{ text: `You are CodeFixerX. Reply in ${getLangObj().label}. DEFAULT: ${defaultFormat}. IF USER ASKS HTML -> HTML. Be stylish.` }] } }) 
      }); 
      if (resp.status === 403) throw new Error("API KEY INVALID"); 
      const data = await resp.json(); 
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error."; 
      setChatMessages(prev => [...prev, { role: 'ai', text: text }]); setApiStatus('success'); 
      await saveToHistory({ userId: user?.uid || 'guest', codeSnippet: currentInput.substring(0,50), module: 'Free Chat', response: text, type: 'chat' });
    } catch(e) { notify("Chat Error: " + e.message, "error"); setApiStatus('error'); } 
    finally { setChatLoading(false); } 
  }; 

  // --- VIEWS ---
  if (view === 'loading') return (<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div><h2 className="text-white font-bold tracking-widest animate-pulse">SYSTEM BOOT...</h2></div>);
  if (view === 'language') return (<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80')] bg-cover opacity-10 animate-pulse"></div><div className="z-10 max-w-5xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl text-center"><h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">CodeFixerX</h1><p className="text-slate-400 text-sm tracking-[0.3em] uppercase mb-12">Select Language / Pilih Bahasa</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Object.entries(LANGUAGES).map(([code, data]) => (<button key={code} onClick={() => { setLangCode(code); localStorage.setItem('cfx_lang', code); setView('apikey_gate'); }} className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-2xl transition-all group flex flex-col items-center"><span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{data.flag}</span><span className="text-slate-300 font-bold group-hover:text-white">{data.label}</span></button>))}</div></div></div>); 
  if (view === 'apikey_gate') return ( <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80')] bg-cover opacity-10 blur-sm"></div><div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-red-500/50 max-w-md w-full text-center shadow-2xl relative animate-fadeIn"><div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-red-500/50 animate-pulse"><Shield size={40} className="text-red-500"/></div><h2 className="text-2xl font-bold text-white mb-2 tracking-wider">SECURITY GATE</h2><p className="text-slate-400 text-sm mb-6">{tText('apiGateMsg')}</p><div className="mb-6 text-left relative"><label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-1 block flex items-center gap-1"><Key size={10}/> {tText('customKey')}</label><div className="flex gap-2"><input type="password" value={gateApiKey} onChange={(e) => setGateApiKey(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 text-white text-sm p-3 rounded-xl outline-none focus:border-red-500 transition-colors" placeholder="AIzaSy..."/></div></div><button onClick={handleGateSubmit} className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl flex justify-center gap-2 transition shadow-lg shadow-red-900/50"><Fingerprint size={20}/> {tText('validateKey')}</button><div className="mt-4 text-center"><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-cyan-500 hover:text-cyan-400 font-bold flex items-center justify-center gap-1 hover:underline"><ExternalLink size={10}/> Get Free Gemini API Key</a></div></div></div> ); 
  if (view === 'login') return ( <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"><button onClick={handleLoginBack} className="absolute top-6 left-6 text-slate-400 hover:text-white flex gap-2 z-20"><ChevronRight className="rotate-180"/> Back</button><div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-slate-700 max-w-sm w-full text-center shadow-2xl relative"><div className="w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><Cpu size={40} className="text-indigo-400"/></div><h2 className="text-2xl font-bold text-white mb-2">{tText('login')}</h2><div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg mb-4 text-xs text-emerald-300 flex items-center gap-2"><CheckCircle size={14}/> API Key Secured.</div><button onClick={handleLogin} className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl flex justify-center gap-2 hover:bg-slate-200 transition mb-3"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G"/> Google Auth</button><button onClick={handleGuestAccess} className="w-full py-3 bg-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition">{tText('saveEnter')}</button></div></div> ); 

  return ( 
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30"> 
      {notif && <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg border animate-bounce ${notif.type==='success'?'bg-emerald-500/20 border-emerald-500 text-emerald-300':'bg-red-500/20 border-red-500 text-red-300'}`}>{notif.msg}</div>} 
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={()=>setSidebarOpen(false)}></div>} 
      <aside className={`fixed inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur border-r border-slate-800 flex flex-col transition-all duration-300 w-72 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:relative md:translate-x-0 md:shadow-none`}> 
         <div className="p-6 border-b border-slate-800 flex justify-between items-center"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${isPremium ? 'bg-amber-500' : 'bg-indigo-600'}`}>{isPremium ? <Sparkles className="text-white"/> : <Code className="text-white"/>}</div><div><h2 className="font-bold leading-none tracking-tight">CodeFixerX</h2><span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{isPremium ? 'Apex' : 'Lite'}</span></div></div><button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"><X/></button></div> 
         <div className="px-4 pt-4 flex gap-2 border-b border-slate-800 pb-4"><button onClick={() => setView('dashboard')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${view==='dashboard'?'bg-slate-800 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}>{tText('dashboard')}</button><button onClick={() => setView('settings')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${view==='settings'?'bg-slate-800 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}><Settings size={12} className="inline mb-0.5"/> {tText('settings')}</button></div> 
         <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar"> 
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-2">{tText('modules')}</div> 
           {currentModules.map((m) => { const isLocked = m.premium && !isPremium; return (<button key={m.id} onClick={() => { if(!isLocked){setCurrentModuleId(m.id); setView('dashboard'); if(window.innerWidth < 768) setSidebarOpen(false);} else notify("Locked 🔒 Upgrade!", "error"); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition text-left ${currentModuleId===m.id && view==='dashboard' ? (isPremium?'bg-amber-500/20 text-amber-300 border border-amber-500/20':'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20') : 'text-slate-400 hover:bg-slate-800'} ${isLocked ? 'opacity-50 cursor-not-allowed':''}`}><div className={`${isLocked ? 'text-slate-600' : (m.premium ? 'text-amber-400' : 'text-cyan-400')}`}>{m.icon}</div><span className="flex-1 truncate text-xs font-medium">{m.name}</span>{isLocked && <Lock size={12} className="text-slate-600"/>}</button>); })} 
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-6">{tText('tools')}</div> 
           <button onClick={() => {setView('chat'); if(window.innerWidth < 768) setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${view==='chat' ? (isPremium ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:bg-slate-800') : 'text-slate-400 hover:bg-slate-800'}`}><MessageSquare size={16} className={isPremium?"text-purple-400":""}/> {tText('chat')} (Apex) {!isPremium && <Lock size={12}/>}</button> 
           <button onClick={() => { if(isPremium) {setView('runner'); if(window.innerWidth < 768) setSidebarOpen(false);} else notify("Locked 🔒 Upgrade!", "error");}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${view==='runner' ? (isPremium ? 'bg-pink-500/20 text-pink-300 border border-pink-500/20' : 'text-slate-400 hover:bg-slate-800') : 'text-slate-400 hover:bg-slate-800'}`}><Laptop2 size={16} className={isPremium?"text-pink-400":""}/> {tText('runner')} (Apex) {!isPremium && <Lock size={12}/>}</button> 
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-6">{tText('system')}</div> 
           <button onClick={() => {setView('portal'); if(window.innerWidth < 768) setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-400 hover:bg-slate-800 transition ${view==='portal'?'bg-indigo-500/20 text-indigo-300':''}`}><BookOpen size={16}/> {tText('portalLabel')}</button> 
         </div> 
         <div className="p-4 border-t border-slate-800 bg-slate-900"> 
           {!isPremium && (<><a href="https://lynk.id/zetago-aurum/yjzz3v78oq13" target="_blank" rel="noreferrer" className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 mb-2"><ShoppingCart size={12}/> {tText('buyKey')}</a><button onClick={() => { if ((user && !user.isAnonymous) || isDevMode) { setView('premium'); } else { notify("Guest Cannot Upgrade 🔒", "error"); setView('login'); } }} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded-lg transition shadow-lg shadow-amber-500/20 mb-2 flex items-center justify-center gap-2"><Unlock size={12}/> {tText('upgrade')}</button></>)} 
           {user || isDevMode ? (<div className="flex items-center gap-3 px-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isDevMode ? 'bg-red-900 border-red-500 text-red-200' : 'bg-indigo-900 border-indigo-700 text-indigo-200'}`}>{isDevMode ? 'DEV' : (user.email ? user.email[0].toUpperCase() : 'G')}</div><div className="flex-1 overflow-hidden"><div className="text-xs font-bold truncate">{isDevMode ? 'Developer' : (user.displayName || 'Guest User')}</div><div className="text-[10px] text-slate-500">{isDevMode ? 'System Root' : 'Online'}</div></div><button onClick={() => signOut(auth)}><LogOut size={16} className="text-slate-500 hover:text-red-400"/></button></div>) : (<button onClick={() => setView('login')} className="w-full flex justify-center gap-2 bg-slate-800 py-3 rounded-xl text-sm font-bold hover:bg-slate-700 border border-slate-700"><LogIn size={16}/> {tText('login')}</button>)} 
         </div> 
      </aside> 

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950"> 
         <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/90 backdrop-blur sticky top-0 z-30 shadow-md shrink-0"> 
            <div className="flex items-center gap-4"><button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-400 hover:text-white transition-colors mr-2 p-2 bg-slate-800/50 rounded-lg"><Menu/></button><div className="flex items-center gap-2 text-slate-400 text-sm overflow-hidden whitespace-nowrap"><LayoutDashboard size={16} className="shrink-0"/> <ChevronRight size={14} className="shrink-0"/> <span className={`truncate ${isPremium ? "text-amber-400 font-bold" : "text-indigo-400 font-bold"}`}>{view === 'portal' ? tText('portalLabel') : view === 'premium' ? tText('upgrade') : view === 'settings' ? tText('settings') : view === 'chat' ? tText('chat') : view === 'runner' ? tText('runner') : currentModule.name}</span></div></div> 
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono"> 
               <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800">{apiStatus === 'loading' ? <RefreshCw size={12} className="animate-spin text-indigo-500"/> : apiStatus === 'error' ? <WifiOff size={12} className="text-red-500"/> : <Wifi size={12} className="text-emerald-500"/>}<span className={`hidden sm:inline font-bold ${apiStatus==='error'?'text-red-400':apiStatus==='loading'?'text-indigo-400':'text-emerald-400'}`}>{apiStatus === 'loading' ? 'SYNC...' : apiStatus === 'error' ? 'OFFLINE' : 'ONLINE'}</span></div> 
               <div className="hidden md:flex items-center gap-2 text-slate-500"><span className={`w-2 h-2 rounded-full ${isPremium ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span> ACTIVE</div> 
               {view !== 'settings' && view !== 'premium' && <button onClick={handleNewSession} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1.5 rounded text-indigo-400 transition cursor-pointer"><RefreshCw size={12}/> <span className="hidden sm:inline">{tText('newChat')}</span></button>} 
               {(view === 'dashboard' || view === 'chat') && (<button onClick={() => view === 'dashboard' ? setHistorySidebarOpen(!historySidebarOpen) : setChatHistoryOpen(!chatHistoryOpen)} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1.5 rounded text-slate-400 hover:text-white transition cursor-pointer" title="Toggle History Sidebar"><Sidebar size={14}/> <span className="hidden sm:inline">HISTORY</span></button>)} 
            </div> 
         </header> 

         <main className="flex-1 overflow-y-auto custom-scrollbar relative"> 
            
            {view === 'dashboard' && ( 
                <div className="p-4 flex flex-col lg:flex-row gap-6 min-h-full"> 
                   <div className="flex-1 flex flex-col gap-4"> 
                      <div onClick={() => isInputMinimized && setIsInputMinimized(false)} className={`bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${isInputMinimized ? 'h-16 cursor-pointer hover:border-indigo-500 hover:bg-slate-800' : 'flex-1 min-h-[250px]'}`}> 
                          <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center"><span className="text-xs font-bold text-slate-400 flex items-center gap-2"><FileCode size={14}/> {tText('input')} {isInputMinimized && <span className="text-indigo-500 text-[10px] animate-pulse">◀ Click to Expand</span>}</span>{!isInputMinimized && <button onClick={(e) => {e.stopPropagation(); setIsInputMinimized(true);}} className="text-xs text-slate-500 hover:text-white flex items-center gap-1"><Minimize2 size={14}/> Minimize</button>}</div> 
                          <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)} className={`flex-1 bg-slate-900 p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none custom-scrollbar ${isInputMinimized ? 'hidden' : 'block'}`} placeholder={`// Enter your code or instructions...`} spellCheck="false"/> 
                      </div> 
                      {!isInputMinimized && (<button onClick={handleAnalyze} disabled={loading || expanding} className={`py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3 ${loading || expanding ? 'bg-slate-800 text-slate-500' : isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white'}`}>{(loading || expanding) ? (expanding ? tText('expanding') : tText('processing')) : <><Zap className={loading?"":"animate-pulse"}/> {tText('analyze')}</>}</button>)} 
                      {(outputResult || loading || expanding) && ( 
                        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden min-h-[400px] relative animate-fadeIn"> 
                           {(loading || expanding) && <div className="absolute inset-0 z-10 bg-slate-950/80 flex flex-col items-center justify-center"><div className="w-1/2 h-1 bg-slate-800 rounded-full overflow-hidden mb-4"><div className="h-full bg-indigo-500 animate-progress"></div></div><div className="text-indigo-400 text-xs font-mono animate-pulse">{expanding ? 'Enhancing Prompt with AI...' : tText('processing')}</div></div>} 
                           <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center shrink-0"><span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Terminal size={14}/> {tText('output')}</span><div className="flex gap-2"><button onClick={handleCopyOutput} className="text-xs flex items-center gap-1 text-slate-400 hover:text-white"><CheckCircle size={12}/> {tText('copy')}</button></div></div> 
                           <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950"><MarkdownRenderer content={outputResult} copyLabel={tText('copyCode')} copiedLabel={tText('copied')} /></div> 
                        </div> 
                      )} 
                   </div> 
                   {historySidebarOpen && ( <div className="fixed inset-0 lg:static lg:inset-auto z-50 flex justify-end lg:block"><div className="absolute inset-0 bg-black/60 lg:hidden backdrop-blur-sm" onClick={() => setHistorySidebarOpen(false)}></div><div className="w-72 lg:w-64 bg-slate-900 rounded-l-2xl lg:rounded-2xl border-l lg:border border-slate-800 flex flex-col overflow-hidden shrink-0 h-full shadow-2xl lg:shadow-lg relative z-10 animate-fadeInRight"><div className="p-4 border-b border-slate-800 flex items-center justify-between"><span className="text-xs font-bold text-slate-400 flex items-center gap-2"><History size={14}/> {tText('history')}</span><button onClick={() => setHistorySidebarOpen(false)} className="lg:hidden text-slate-400"><X size={14}/></button></div><div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">{!user && !isDevMode ? <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs p-4 text-center"><Lock size={20} className="mb-2"/><p>Guest Mode.</p></div> : history.length === 0 ? <div className="text-center text-slate-600 text-xs mt-4">No logs yet.</div> : history.map((h, i) => ( <div key={i} onClick={() => {setInputCode(h.codeSnippet); setOutputResult(h.response); setIsInputMinimized(true); if(window.innerWidth < 1024) setHistorySidebarOpen(false); }} className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 hover:bg-slate-800 cursor-pointer transition group"><div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-indigo-500 uppercase truncate">{h.module}</span></div><div className="text-xs text-slate-400 truncate font-mono">{h.codeSnippet}</div></div> ))} </div></div></div> )} 
                </div> 
            )} 

            {view === 'chat' && ( 
               isPremium ? ( 
                 <div className="p-4 flex flex-col lg:flex-row gap-6 h-full"> 
                   <div className="flex-1 flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden shadow-xl"> 
                     <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-4"> 
                       {chatMessages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-600"><MessageSquare size={48} className="mb-4 opacity-20"/><p>{tText('chatStart')}</p></div>} 
                       {chatMessages.map((msg, idx) => ( <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}><div className={`max-w-[90%] md:max-w-[85%] p-4 rounded-2xl relative ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}><MarkdownRenderer content={msg.text} copyLabel={tText('copy')} copiedLabel={tText('copied')} /></div></div> ))} 
                       {chatLoading && <div className="flex justify-start"><div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700"><div className="flex gap-1"><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div></div></div></div>} 
                     </div> 
                     <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2 items-end"><textarea ref={chatInputRef} value={chatInput} onChange={(e)=> { setChatInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`; }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend(); } }} placeholder={tText('chatPlaceholder')} rows={1} className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none resize-none overflow-y-auto min-h-[50px] custom-scrollbar"/><button onClick={handleChatSend} className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl mb-0.5"><Send size={20}/></button></div> 
                   </div> 
                   {chatHistoryOpen && ( <div className="fixed inset-0 lg:static lg:inset-auto z-50 flex justify-end lg:block"><div className="absolute inset-0 bg-black/60 lg:hidden backdrop-blur-sm" onClick={() => setChatHistoryOpen(false)}></div><div className="w-72 lg:w-64 bg-slate-900 rounded-l-2xl lg:rounded-2xl border-l lg:border border-slate-800 flex flex-col overflow-hidden shrink-0 h-full shadow-2xl lg:shadow-lg relative z-10 animate-fadeInRight"><div className="p-4 border-b border-slate-800 flex items-center justify-between"><span className="text-xs font-bold text-slate-400 flex items-center gap-2"><History size={14}/> {tText('history')}</span><button onClick={() => setChatHistoryOpen(false)} className="lg:hidden text-slate-400"><X size={14}/></button></div><div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">{!user && !isDevMode ? <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs p-4 text-center"><Lock size={20} className="mb-2"/><p>Guest Mode.</p></div> : history.filter(h => h.type === 'chat').length === 0 ? <div className="text-center text-slate-600 text-xs mt-4">No chats.</div> : history.filter(h => h.type === 'chat').map((h, i) => ( <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 hover:bg-slate-800 cursor-pointer transition group" onClick={() => { setChatMessages([ { role: 'user', text: h.codeSnippet }, { role: 'ai', text: h.response } ]); notify("Chat Session Loaded", "success"); if(window.innerWidth < 768) setChatHistoryOpen(false); }}><div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-purple-400 uppercase truncate">CHAT</span></div><div className="text-xs text-slate-400 truncate font-mono">{h.codeSnippet}</div></div> ))} </div></div></div> )} 
                 </div> 
               ) : ( <div className="flex items-center justify-center h-full p-6"><div className="max-w-md w-full bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-slate-700 text-center shadow-2xl"><Lock size={40} className="text-slate-500 mx-auto mb-4"/><h2 className="text-2xl font-bold text-white mb-2">Premium Feature</h2><p className="text-slate-400 text-sm mb-6">Free Chat is available for Apex users only.</p><button onClick={() => { if ((user && !user.isAnonymous) || isDevMode) { setView('premium'); } else { notify("Eits! Login Google dulu bosku! 🔒", "error"); setView('login'); } }} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold rounded-xl">UNLOCK APEX</button></div></div> ) 
            )} 

            {view === 'runner' && (
                isPremium ? (
                  <div className={`${isRunnerFullScreen ? 'fixed inset-0 z-[100]' : 'h-full'} flex flex-col md:flex-row overflow-hidden bg-slate-950 transition-all duration-300`}>
                     {/* EDITOR PANE */}
                     <div className={`${isEditorCollapsed ? 'w-0 hidden' : (isPreviewCollapsed ? 'w-full' : 'min-w-[50%] flex-1')} flex flex-col border-r border-slate-800 h-1/2 md:h-full relative transition-all duration-300 group`}>
                        <div className="flex items-center justify-between bg-slate-900 p-2 border-b border-slate-800 shrink-0 z-10 relative">
                           <div className="flex items-center gap-2 px-2 text-xs font-bold text-pink-400"><Code size={14}/> JSX / TSX EDITOR</div>
                           <div className="flex items-center gap-2">
                                <button onClick={() => setIsRunnerFullScreen(!isRunnerFullScreen)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition" title="Full Screen">
                                    {isRunnerFullScreen ? <Minimize size={14}/> : <Maximize size={14}/>}
                                </button>
                                <button onClick={() => { setIsPreviewCollapsed(!isPreviewCollapsed); if(!isPreviewCollapsed) setIsEditorCollapsed(false); }} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition" title="Toggle Preview">
                                    {isPreviewCollapsed ? <Layout size={14}/> : <EyeOff size={14}/>}
                                </button>
                                <button onClick={handleRunnerExecute} className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-lg shadow-pink-900/20"><PlayCircle size={14}/> RUN LIVE</button>
                           </div>
                        </div>
                        <div className="flex-1 relative overflow-hidden bg-slate-950">
                            {/* HIGHLIGHTER LAYER (UNDERLAY) - Visible Text */}
                            <pre 
                                ref={runnerEditorRef} 
                                className="absolute inset-0 p-4 font-mono text-sm leading-relaxed pointer-events-none z-0 m-0 whitespace-pre overflow-hidden text-slate-300" 
                                aria-hidden="true"
                            >
                                <code dangerouslySetInnerHTML={{ __html: highlightSyntax(runnerCode) }} />
                            </pre>
                            
                            {/* INPUT LAYER (OVERLAY) - Transparent Text, Visible Caret */}
                            <textarea 
                                value={runnerCode} 
                                onScroll={handleEditorScroll} 
                                onChange={(e) => setRunnerCode(e.target.value)} 
                                className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-relaxed bg-transparent text-transparent caret-white resize-none outline-none z-10 whitespace-pre overflow-auto custom-scrollbar" 
                                spellCheck="false" 
                                autoCapitalize="off"
                                autoComplete="off"
                                autoCorrect="off"
                                placeholder="// Write React Component..."
                            />
                        </div>
                     </div>
                     {/* PREVIEW PANE */}
                     <div className={`${isPreviewCollapsed ? 'w-0 hidden' : 'flex-1'} bg-white relative flex flex-col h-1/2 md:h-full transition-all duration-300`}>
                        <div className="bg-slate-900 border-b border-slate-800 p-2 flex items-center justify-between shrink-0">
                           <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Eye size={14}/> PREVIEW</span>
                           <div className="flex items-center gap-2">
                                <button onClick={() => { setIsEditorCollapsed(!isEditorCollapsed); if(!isEditorCollapsed) setIsPreviewCollapsed(false); }} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition" title={isEditorCollapsed ? "Show Editor" : "Full Screen Preview"}>
                                    {isEditorCollapsed ? <Layout size={14}/> : <Maximize size={14}/>}
                                </button>
                           </div>
                        </div>
                        <iframe srcDoc={runnerPreview} className="flex-1 w-full h-full border-none" title="runner-preview" sandbox="allow-scripts allow-modals allow-same-origin" />
                     </div>
                  </div>
                ) : ( <div className="flex items-center justify-center h-full p-6"><div className="max-w-md w-full bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-slate-700 text-center shadow-2xl"><MonitorPlay size={40} className="text-slate-500 mx-auto mb-4"/><h2 className="text-2xl font-bold text-white mb-2">JSX Runner Locked</h2><p className="text-slate-400 text-sm mb-6">Live React preview is an Apex feature.</p><button onClick={() => { if ((user && !user.isAnonymous) || isDevMode) { setView('premium'); } else { notify("Login First!", "error"); setView('login'); } }} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold rounded-xl">UNLOCK APEX</button></div></div> )
            )}

            {view === 'settings' && ( 
               <div className="p-6 md:p-12 max-w-4xl mx-auto"> 
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Settings/> {tText('settings')}</h2> 
                   <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6"> 
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Brain size={18} className="text-purple-400"/> {tText('model')}</h3> 
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{AI_MODELS.map((model)=>(<button key={model.id} onClick={()=>changeAiModel(model.id)} className={`p-4 rounded-xl border text-left transition-all ${aiModel===model.id?'bg-purple-500/20 border-purple-500':'bg-slate-950 border-slate-700 hover:border-slate-500'}`}><div className={`font-bold text-sm mb-1 ${aiModel===model.id?'text-purple-300':'text-slate-300'}`}>{model.name}</div><div className="text-xs text-slate-500">{model.desc}</div></button>))}</div> 
                   </div> 
                   <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-cyan-400"/> Language</h3><div className="flex flex-wrap gap-3">{Object.entries(LANGUAGES).map(([code, data])=>(<button key={code} onClick={()=>{setLangCode(code);localStorage.setItem('cfx_lang',code);}} className={`px-4 py-2 rounded-xl border text-sm flex items-center gap-2 ${langCode===code?'bg-cyan-500/20 border-cyan-500 text-cyan-300':'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}`}><span>{data.flag}</span> {data.label}</button>))}</div></div> 
                   <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Key size={18} className="text-amber-400"/> {tText('customKey')}</h3><p className="text-xs text-slate-400 mb-4">{tText('apiKeyDesc')}</p><div className="flex gap-2"><input type="password" value={customApiKey} onChange={(e)=>setCustomApiKey(e.target.value)} placeholder="AIzaSy..." className="flex-1 bg-slate-950 border border-slate-700 text-white p-3 rounded-xl text-sm font-mono focus:border-cyan-500 outline-none"/><button onClick={() => { localStorage.setItem('cfx_api_key', customApiKey); notify("Saved!", "success"); }} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-bold text-sm">SAVE</button></div></div> 
                   <div className="mt-12 border-t border-slate-800 pt-6"><h4 className="text-xs text-slate-600 font-mono mb-2 uppercase tracking-widest flex items-center gap-2"><Bug size={12}/> {tText('devOverride')}</h4><div className="flex gap-2 max-w-xs"><input type="password" value={devPin} onChange={(e)=>setDevPin(e.target.value)} placeholder="Enter PIN..." className="flex-1 bg-slate-950 border border-slate-800 text-slate-300 p-2 rounded-xl text-xs focus:border-red-500 outline-none transition-colors"/><button onClick={handleDevUnlock} className="bg-slate-800 hover:bg-red-900 hover:text-red-200 text-slate-400 px-4 rounded-xl text-xs font-bold transition-colors">{tText('access')}</button></div></div> 
               </div> 
            )} 

            {view === 'portal' && ( 
                <div className="p-4 md:p-12 pb-20 max-w-5xl mx-auto animate-fadeIn"> 
                   <div className="flex overflow-x-auto gap-4 border-b border-slate-800 mb-8 pb-1 sticky top-0 bg-slate-950/95 z-20 pt-4 scrollbar-hide"> 
                       {[{id:'about',label:'About Us'},{id:'legal',label:'Legal Docs'},{id:'guide',label:'Guide'},{id:'infra',label:'Infrastructure'}].map(t => ( <button key={t.id} onClick={() => setPortalTab(t.id)} className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition ${portalTab===t.id ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-white'}`}>{t.label}</button> ))} 
                   </div> 
                   {portalTab === 'about' && ( 
                       <div className="space-y-6"> 
                         <section><h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3"><Globe className="text-cyan-500"/> {tText('originTitle')}</h2><div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800"><p className="text-slate-300 leading-relaxed mb-4 text-justify">{tData('aboutText')}</p><p className="text-slate-300 leading-relaxed text-justify italic border-l-4 border-amber-500 pl-4 py-2 bg-slate-900">{tData('missionText')}</p></div><div className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-cyan-500/50 transition"><div className="flex items-center gap-3"><div className="bg-slate-800 p-2 rounded-full border border-slate-700"><Github className="text-white" size={24}/></div><div><h4 className="text-white font-bold text-sm">Open Source Repository</h4><p className="text-xs text-slate-500">Aleocrophic-CodeFixerX-SPA</p></div></div><a href="https://github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA" target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-600 transition flex items-center gap-2 group">View on GitHub <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform"/></a></div></section> 
                         <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mt-8"><h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Heart className="text-pink-500 fill-pink-500 animate-pulse" size={20}/> {tText('specialThanks')}</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-cyan-500/30 transition"><div className="w-12 h-12 bg-cyan-900 rounded-full flex items-center justify-center font-bold text-cyan-400 border border-cyan-700">RD</div><div><div className="text-white font-bold text-sm">Rayhan Dzaky Al Mubarok</div><div className="text-[10px] text-slate-500">Founder & Lead Architect</div></div></div><div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-green-500/30 transition"><div className="w-12 h-12 bg-green-900/20 rounded-full flex items-center justify-center font-bold text-green-400 border border-green-700">G</div><div><div className="text-white font-bold text-sm">Google</div><div className="text-[10px] text-slate-500">Gemini & Firebase Provider</div></div></div><div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-pink-500/30 transition"><div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-pink-900 border border-pink-500 relative group">{hoshinoImgError ? (<div className="w-full h-full bg-pink-950 flex items-center justify-center text-pink-300 font-bold text-xs">TH</div>) : (<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8rY5XbTjGXe6z_pUj7VqN2M0L8O6K9P1Q2S3T4U5V6W7X8Y9Z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2/s1600/download%20(5).jpeg" alt="TH" className="w-full h-full object-cover group-hover:scale-110 transition-transform" onError={() => setHoshinoImgError(true)}/>)}</div><div><div className="text-white font-bold text-sm">Takanashi Hoshino</div><div className="text-[10px] text-slate-500">Spiritual Support (BA)</div></div></div><div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-amber-500/30 transition"><div className="w-12 h-12 bg-amber-900/50 rounded-full flex items-center justify-center font-bold text-amber-400 border border-amber-700">AL</div><div><div className="text-white font-bold text-sm">Aleocrophic</div><div className="text-[10px] text-slate-500">NyxShade Interactive</div></div></div></div></section> 
                       </div> 
                   )} 
                   {portalTab === 'legal' && ( <div className="space-y-8 grid grid-cols-1 md:grid-cols-2 gap-6"><section className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-full"><h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Shield size={20} className="text-emerald-500"/> {tText('privacy')}</h2><div className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed font-mono bg-slate-950 p-4 rounded-lg border border-slate-800 h-96 overflow-y-auto custom-scrollbar">{tData('privacyText')}</div></section><section className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-full"><h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText size={20} className="text-amber-500"/> {tText('terms')}</h2><div className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed font-mono bg-slate-950 p-4 rounded-lg border border-slate-800 h-96 overflow-y-auto custom-scrollbar">{tData('termsText')}</div></section></div> )} 
                   {portalTab === 'guide' && ( <div className="space-y-8"><h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">📘 {tText('guide')}</h2><div className="grid md:grid-cols-2 gap-6"><div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><Code size={100}/></div><h3 className="text-cyan-400 font-bold text-xl mb-3 flex items-center gap-2"><Code size={20}/> Lite Users</h3><p className="text-sm text-slate-400 leading-relaxed">{tData('guideLite')}</p></div><div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><Sparkles size={100} className="text-amber-500"/></div><h3 className="text-amber-400 font-bold text-xl mb-3 flex items-center gap-2"><Sparkles size={20}/> Apex Users</h3><p className="text-sm text-slate-400 leading-relaxed">{tData('guideApex')}</p></div></div></div> )} 
                   {portalTab === 'infra' && ( <section className="space-y-8"><h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Server size={24}/> {tText('coreInfra')}</h2><div className="grid gap-6 grid-cols-1 md:grid-cols-3"><div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:scale-105 transition-transform duration-300"><Globe className="text-cyan-500 mb-4 h-10 w-10"/><h3 className="text-white font-bold mb-2 text-lg">Frontend</h3><p className="text-slate-400 text-sm leading-relaxed">{tData('infraFrontend')}</p></div><div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:scale-105 transition-transform duration-300"><Database className="text-amber-500 mb-4 h-10 w-10"/><h3 className="text-white font-bold mb-2 text-lg">Backend</h3><p className="text-slate-400 text-sm leading-relaxed">{tData('infraBackend')}</p></div><div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:scale-105 transition-transform duration-300"><Cpu className="text-emerald-500 mb-4 h-10 w-10"/><h3 className="text-white font-bold mb-2 text-lg">AI Engine</h3><p className="text-slate-400 text-sm leading-relaxed">{tData('infraAI')}</p></div></div></section> )} 
                </div> 
            )} 

            {view === 'premium' && ( 
               <div className="flex items-center justify-center min-h-full p-4 relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 to-slate-950"></div><div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-amber-500/30 max-w-md w-full text-center shadow-2xl"><Unlock size={40} className="text-amber-500 mx-auto mb-4"/><h2 className="text-2xl font-bold text-white mb-2">{tText('unlock')} Apex Edition</h2> 
               {((user && user.isAnonymous && !isDevMode) || (!user && !isDevMode)) ? ( 
                   <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl mb-6 text-sm text-red-200 flex flex-col items-center gap-4 animate-pulse">
                       <div className="bg-red-900/50 p-3 rounded-full border border-red-500"><AlertOctagon size={32} className="text-red-500"/></div>
                       <div className="text-center">
                           <h3 className="text-red-400 font-bold text-lg mb-1">REDIRECTING...</h3>
                           <p className="text-xs text-red-300">Guest Access Denied.</p>
                       </div>
                   </div> 
                ) : ( <><p className="text-slate-400 text-sm mb-6">{tText('enterKey')}</p><input type="text" value={premiumKey} onChange={(e)=>setPremiumKey(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-center text-white p-3 rounded-xl mb-4 font-mono focus:border-amber-500 outline-none" placeholder="XXXX-XXXX-XXXX"/><div className="flex items-center gap-2 mb-4"><div className="h-px bg-slate-800 flex-1"></div><span className="text-xs text-slate-500">{tText('orUpload')}</span><div className="h-px bg-slate-800 flex-1"></div></div><label className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-3 rounded-xl cursor-pointer transition mb-4 border border-dashed border-slate-600"><Upload size={14}/> Upload key.txt<input type="file" accept=".txt" className="hidden" onChange={(e)=>{ const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { if (ev.target?.result) { setPremiumKey(ev.target.result.toString().trim()); notify("Key Loaded!", "success"); } }; reader.readAsText(file); }}/></label><button onClick={handleUnlock} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold rounded-xl">{tText('authenticate')}</button></> )} 
               {(!isDevMode && user && !user.isAnonymous) && ( <><div className="flex items-center gap-3 mt-4"><div className="h-px bg-slate-800 flex-1"></div><span className="text-xs text-slate-500">{tText('dontHaveKey')}</span><div className="h-px bg-slate-800 flex-1"></div></div><a href="https://lynk.id/zetago-aurum/yjzz3v78oq13" target="_blank" rel="noreferrer" className="w-full py-3 mt-3 bg-slate-800 hover:bg-slate-700 border border-amber-500/50 text-amber-400 font-bold rounded-xl flex items-center justify-center gap-2 transition group"><ShoppingCart size={16} className="group-hover:scale-110 transition-transform"/> {tText('buyKey')}</a></> )} 
               </div></div> 
            )} 
         </main> 
      </div> 

      <style>{` 
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #020617; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; } 
        .animate-progress { animation: progress 2s ease-in-out infinite; } @keyframes progress { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } } 
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } 
        .animate-fadeInRight { animation: fadeInRight 0.3s ease-out forwards; } @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } } 
        .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } 
      `}</style> 
    </div> 
  ); 
}
