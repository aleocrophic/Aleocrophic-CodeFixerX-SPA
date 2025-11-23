import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  Code, Shield, Zap, Terminal, Cpu, Sparkles, 
  History, LogOut, User, Lock, Unlock, LayoutDashboard, 
  FileCode, Play, CheckCircle, Search, 
  Menu, X, ChevronRight, Command, LogIn, Info, 
  Server, Globe, Copyright, FileText, Eye, Maximize2, Minimize2, 
  Settings, Box, Activity, Languages, BookOpen, Key, Database, Layers, Clipboard, AlertTriangle, Heart, Briefcase, Laptop, Bug, Upload, Brain, MessageSquare, PlusCircle, RefreshCw, Send, ShoppingCart, Edit2, Trash2, PanelRight, ExternalLink
} from 'lucide-react';

// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBpXhfpTR7KGfW5ESH_Z-9Wc8QyJ9YHxv8",
  authDomain: "remchat-fd4ea.firebaseapp.com",
  projectId: "remchat-fd4ea",
  storageBucket: "remchat-fd4ea.firebasestorage.app",
  messagingSenderId: "369353956112",
  appId: "1:369353956112:web:7aff645b1724ec80bfa395",
  measurementId: "G-QTHRQNXJKF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- GLOBAL API KEY PLACEHOLDER ---
const defaultApiKey = ""; 

// --- 2. DATA & TRANSLATIONS ---

const LANGUAGES: Record<string, any> = {
  en: { 
    label: 'English', flag: '🇺🇸', 
    ui: { 
      dashboard: 'Dashboard', chat: 'Free Chat', portalLabel: 'Portal System', history: 'History', upgrade: 'Upgrade Apex', login: 'Login', 
      analyze: 'Initiate Fix', input: 'Source Code', output: 'Output', processing: 'Processing...', settings: 'Settings', copy: 'Copy All', 
      model: 'AI Model', newChat: 'New Session', viewUI: 'View UI', hideUI: 'Hide UI', copyCode: 'Copy Code', copied: 'Copied',
      modules: 'Modules', system: 'System', tools: 'AI Tools', welcome: 'Welcome', guest: 'Guest Mode',
      authRequired: 'Auth Required', unlock: 'Unlock', enterKey: 'Enter License Key', orUpload: 'OR UPLOAD KEY', authenticate: 'AUTHENTICATE',
      purchase: 'Purchase', devOverride: 'Developer Override', access: 'ACCESS', customKey: 'Gemini API Key',
      chatPlaceholder: 'Type a message... (Shift+Enter for new line)', chatStart: 'Start chatting with CodeFixerX!', edit: 'Edit',
      privacy: 'Privacy Policy', terms: 'Terms of Service', about: 'About Us', infra: 'Infrastructure', guide: 'User Guide',
      roleUser: 'User', roleAI: 'CodeFixerX', buyKey: 'BUY KEY NOW', dontHaveKey: "DON'T HAVE A KEY?",
      originTitle: 'Origin of Aleocrophic', specialThanks: 'Special Thanks', coreInfra: 'Core Infrastructure',
      toggleHistory: 'Toggle History', sourceInput: 'SOURCE INPUT', getKey: 'Get API Key', saveEnter: 'Save & Enter',
      apiKeyDesc: 'Required. Your personal Gemini API Key. Stored locally.',
      portalContent: {
        aboutText: "CodeFixerX was born from a simple necessity: the modern development landscape is chaotic. With hundreds of languages, frameworks, and updates releasing weekly, developers are drowning in complexity. Aleocrophic Systems, founded by Rayhan Dzaky Al Mubarok under the NyxShade Interactive banner, aims to be the lighthouse in this storm. We bridge the gap between 'it works on my machine' and 'production-ready enterprise code' using state-of-the-art AI.",
        missionText: "Our mission is not to replace the developer, but to empower them. To give every coder, regardless of experience level, an 'Apex' level assistant that understands security, scalability, and clean architecture.",
        privacyText: "1. Data Collection: Aleocrophic Systems only collects minimal data required for authentication (via Google Firebase) and prompt processing.\n2. AI Processing: Your code snippets are sent ephemerally to Google Gemini APIs for processing. This data is not used to train public models in this instance, adhering to standard enterprise data hygiene.\n3. User Rights: You retain full ownership of any code you submit.",
        termsText: "1. Acceptance: By using CodeFixerX (Lite or Apex), you agree to these terms.\n2. Prohibited Use: You strictly agree NOT to use this AI to generate malware, ransomware, exploits, or any code intended to harm systems or violate laws.\n3. Liability: Aleocrophic Systems is not liable for any production outages.",
        guideLite: "Lite users have access to basic debugging and security scanning. Perfect for students and hobbyists starting their journey.",
        guideApex: "Apex users unlock the full potential: CI/CD pipelines, Legacy Code resurrection, and Experimental UI generation. Designed for professionals.",
        infraFrontend: "React 18 + Tailwind + Vite. Optimized for speed.",
        infraBackend: "Google Firebase (Auth & Firestore). Serverless and secure.",
        infraAI: "Google Gemini 1.5 Pro/Flash. 1M+ Token Context Window."
      }
    } 
  },
  id: { 
    label: 'Indonesia', flag: '🇮🇩', 
    ui: { 
      dashboard: 'Dasbor', chat: 'Obrolan Bebas', portalLabel: 'Portal Sistem', history: 'Riwayat', upgrade: 'Buka Apex', login: 'Masuk', 
      analyze: 'Mulai Analisa', input: 'Kode Sumber', output: 'Hasil', processing: 'Memproses...', settings: 'Pengaturan', copy: 'Salin Semua', 
      model: 'Model AI', newChat: 'Sesi Baru', viewUI: 'Lihat UI', hideUI: 'Tutup UI', copyCode: 'Salin Kode', copied: 'Disalin',
      modules: 'Modul', system: 'Sistem', tools: 'Alat AI', welcome: 'Selamat Datang', guest: 'Mode Tamu',
      authRequired: 'Butuh Login', unlock: 'Buka', enterKey: 'Masukkan Kunci Lisensi', orUpload: 'ATAU UPLOAD KUNCI', authenticate: 'AUTENTIKASI',
      purchase: 'Beli', devOverride: 'Akses Pengembang', access: 'AKSES', customKey: 'API Key Gemini',
      chatPlaceholder: 'Ketik pesan... (Shift+Enter baris baru)', chatStart: 'Mulai mengobrol dengan CodeFixerX!', edit: 'Ubah',
      privacy: 'Kebijakan Privasi', terms: 'Syarat Layanan', about: 'Tentang Kami', infra: 'Infrastruktur', guide: 'Panduan Pengguna',
      roleUser: 'Pengguna', roleAI: 'CodeFixerX', buyKey: 'BELI KUNCI SEKARANG', dontHaveKey: "BELUM PUNYA KUNCI?",
      originTitle: 'Asal Usul Aleocrophic', specialThanks: 'Terima Kasih Khusus', coreInfra: 'Infrastruktur Inti',
      toggleHistory: 'Buka Riwayat', sourceInput: 'SUMBER KODE', getKey: 'Dapatkan Key', saveEnter: 'Simpan & Masuk',
      apiKeyDesc: 'Wajib. API Key Gemini pribadi Anda. Disimpan secara lokal.',
      portalContent: {
        aboutText: "CodeFixerX lahir dari kebutuhan sederhana: lanskap pengembangan modern sangat kacau. Dengan ratusan bahasa dan kerangka kerja yang rilis setiap minggu, pengembang tenggelam dalam kompleksitas. Aleocrophic Systems, didirikan oleh Rayhan Dzaky Al Mubarok di bawah bendera NyxShade Interactive, bertujuan menjadi mercusuar dalam badai ini. Kami menjembatani kesenjangan antara 'kode coba-coba' dan 'kode standar perusahaan' menggunakan AI mutakhir.",
        missionText: "Misi kami bukan untuk menggantikan pengembang, tetapi untuk memberdayakan mereka. Memberikan setiap pemrogram, tanpa memandang level pengalaman, asisten level 'Apex' yang memahami keamanan, skalabilitas, dan arsitektur bersih.",
        privacyText: "1. Pengumpulan Data: Aleocrophic Systems hanya mengumpulkan data minimal untuk autentikasi (via Google Firebase) dan pemrosesan prompt.\n2. Pemrosesan AI: Kode Anda dikirim sementara ke API Google Gemini untuk diproses. Data ini tidak digunakan untuk melatih model publik.\n3. Hak Pengguna: Anda memegang kepemilikan penuh atas kode yang Anda kirim.",
        termsText: "1. Penerimaan: Dengan menggunakan CodeFixerX, Anda menyetujui ketentuan ini.\n2. Penggunaan Terlarang: Anda setuju untuk TIDAK menggunakan AI ini untuk membuat malware, ransomware, eksploitasi, atau kode berbahaya lainnya.\n3. Tanggung Jawab: Aleocrophic Systems tidak bertanggung jawab atas gangguan produksi.",
        guideLite: "Pengguna Lite memiliki akses ke debugging dasar dan pemindaian keamanan. Sempurna untuk pelajar dan hobiis.",
        guideApex: "Pengguna Apex membuka potensi penuh: Pipa CI/CD, Kebangkitan Kode Legacy, dan Generasi UI Eksperimental. Dirancang untuk profesional.",
        infraFrontend: "React 18 + Tailwind + Vite. Dioptimalkan untuk kecepatan.",
        infraBackend: "Google Firebase (Auth & Firestore). Serverless dan aman.",
        infraAI: "Google Gemini 1.5 Pro/Flash. Jendela Konteks 1M+ Token."
      }
    } 
  },
  jp: { 
    label: '日本語', flag: '🇯🇵', 
    ui: { 
      dashboard: 'ダッシュボード', chat: '自由チャット', portalLabel: 'システムポータル', history: '履歴', upgrade: 'Apexへ', login: 'ログイン', 
      analyze: '分析開始', input: 'ソース', output: '出力', processing: '処理中...', settings: '設定', copy: 'コピー', 
      model: 'AIモデル', newChat: '新規セッション', viewUI: 'UI表示', hideUI: 'UI非表示', copyCode: 'コードコピー', copied: 'コピー完了',
      modules: 'モジュール', system: 'システム', tools: 'AIツール', welcome: 'ようこそ', guest: 'ゲスト',
      authRequired: '認証が必要', unlock: '解除', enterKey: 'ライセンスキーを入力', orUpload: 'またはキーをアップロード', authenticate: '認証する',
      purchase: '購入', devOverride: '開発者オーバーライド', access: 'アクセス', customKey: 'Gemini APIキー',
      chatPlaceholder: 'メッセージを入力... (Shift+Enterで改行)', chatStart: 'CodeFixerXとチャットを開始！', edit: '編集',
      privacy: 'プライバシーポリシー', terms: '利用規約', about: '私たちについて', infra: 'インフラストラクチャ', guide: 'ユーザーマニュアル',
      roleUser: 'ユーザー', roleAI: 'CodeFixerX', buyKey: '今すぐキーを購入', dontHaveKey: "キーをお持ちでないですか？",
      originTitle: 'Aleocrophicの起源', specialThanks: '特別感謝', coreInfra: 'コアインフラストラクチャ',
      toggleHistory: '履歴の切り替え', sourceInput: 'ソース入力', getKey: 'キーを取得', saveEnter: '保存して入る',
      apiKeyDesc: '必須。個人のGemini APIキー。ローカルに保存されます。',
      portalContent: {
        aboutText: "CodeFixerXは、単純な必要性から生まれました。現代の開発環境は混沌としています。Aleocrophic Systemsは、NyxShade Interactiveの旗の下、Rayhan Dzaky Al Mubarokによって設立され、この嵐の中の灯台となることを目指しています。最先端のAIを使用して、「ローカルで動くコード」と「本番環境対応のエンタープライズコード」の間のギャップを埋めます。",
        missionText: "私たちの使命は、開発者に取って代わることではなく、力を与えることです。経験レベルに関係なく、すべてのプログラマーにセキュリティ、スケーラビリティ、クリーンアーキテクチャを理解する「Apex」レベルのアシスタントを提供します。",
        privacyText: "1. データ収集：認証（Firebase経由）およびプロンプト処理に必要な最小限のデータのみを収集します。\n2. AI処理：コードスニペットは処理のためにGoogle Gemini APIに一時的に送信されます。\n3. ユーザーの権利：送信したコードの完全な所有権は保持されます。",
        termsText: "1. 同意：CodeFixerXを使用することにより、これらの条件に同意したことになります。\n2. 禁止事項：マルウェア、ランサムウェア、エクスプロイト、または違法なコードの生成にこのAIを使用しないことに同意します。\n3. 責任：Aleocrophic Systemsは、本番環境の停止について責任を負いません。",
        guideLite: "Liteユーザーは基本的なデバッグとセキュリティスキャンにアクセスできます。学習者や趣味のプログラマーに最適です。",
        guideApex: "Apexユーザーは、CI/CDパイプライン、レガシーコードの復活、実験的なUI生成など、すべての可能性を解き放ちます。",
        infraFrontend: "React 18 + Tailwind + Vite。速度のために最適化。",
        infraBackend: "Google Firebase（認証＆Firestore）。サーバーレスで安全。",
        infraAI: "Google Gemini 1.5 Pro/Flash。100万トークン以上のコンテキスト。"
      }
    } 
  },
  // ... (Other languages structure maintained same as previous valid response)
  ar: { 
    label: 'العربية', flag: '🇸🇦', 
    ui: { 
      dashboard: 'لوحة القيادة', chat: 'دردشة حرة', portalLabel: 'بوابة النظام', history: 'سجل', upgrade: 'ترقية أبيكس', login: 'دخول', 
      analyze: 'بدء', input: 'شفرة', output: 'مخرجات', processing: 'معالجة...', settings: 'إعدادات', copy: 'نسخ', 
      model: 'نموذج AI', newChat: 'جلسة جديدة', viewUI: 'عرض UI', hideUI: 'إخفاء UI', copyCode: 'نسخ الرمز', copied: 'تم النسخ',
      modules: 'وحدات', system: 'نظام', tools: 'أدوات الذكاء الاصطناعي', welcome: 'أهلا بك', guest: 'زائر',
      authRequired: 'مطلوب المصادقة', unlock: 'فتح', enterKey: 'أدخل مفتاح الترخيص', orUpload: 'أو تحميل المفتاح', authenticate: 'توثيق',
      purchase: 'شراء', devOverride: 'تجاوز المطور', access: 'وصول', customKey: 'مفتاح Gemini API',
      chatPlaceholder: 'أكتب رسالة... (Shift+Enter للسطر الجديد)', chatStart: 'ابدأ الدردشة مع CodeFixerX!', edit: 'تعديل',
      privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', about: 'معلومات عنا', infra: 'بنية تحتية', guide: 'دليل المستخدم',
      roleUser: 'مستخدم', roleAI: 'CodeFixerX', buyKey: 'شراء المفتاح الآن', dontHaveKey: "ليس لديك مفتاح؟",
      originTitle: 'أصل Aleocrophic', specialThanks: 'شكر خاص', coreInfra: 'البنية التحتية الأساسية',
      toggleHistory: 'تبديل السجل', sourceInput: 'مدخلات المصدر', getKey: 'احصل على المفتاح', saveEnter: 'حفظ والدخول',
      apiKeyDesc: 'مطلوب. مفتاح Gemini API الخاص بك. مخزن محليا.',
      portalContent: {
        aboutText: "ولدت CodeFixerX من ضرورة بسيطة: مشهد التطوير الحديث فوضوي. تهدف Aleocrophic Systems، التي أسسها ريحان زكي المبارك تحت راية NyxShade Interactive، إلى أن تكون المنارة في هذه العاصفة. نحن نسد الفجوة بين الكود التجريبي والكود الجاهز للإنتاج باستخدام الذكاء الاصطناعي المتطور.",
        missionText: "مهمتنا ليست استبدال المطور، بل تمكينه. لمنح كل مبرمج، بغض النظر عن مستوى الخبرة، مساعدًا بمستوى 'Apex' يفهم الأمن وقابلية التوسع والهندسة النظيفة.",
        privacyText: "1. جمع البيانات: نجمع الحد الأدنى من البيانات للمصادقة.\n2. معالجة الذكاء الاصطناعي: يتم إرسال مقتطفات التعليمات البرمجية الخاصة بك بشكل مؤقت إلى واجهات برمجة تطبيقات Google Gemini.\n3. حقوق المستخدم: أنت تحتفظ بالملكية الكاملة لأي رمز ترسله.",
        termsText: "1. القبول: باستخدام هذا، فإنك توافق على الشروط.\n2. الاستخدام المحظور: لا يجوز لك إنشاء برامج ضارة أو فيروسات فدية.\n3. المسؤولية: نحن لسنا مسؤولين عن انقطاع الإنتاج.",
        guideLite: "يتمتع مستخدمو Lite بإمكانية الوصول إلى التصحيح الأساسي والمسح الأمني.",
        guideApex: "يفتح مستخدمو Apex الإمكانات الكاملة: خطوط أنابيب CI/CD، وإحياء الكود القديم، وتوليد واجهة المستخدم التجريبية.",
        infraFrontend: "React 18 + Tailwind + Vite.",
        infraBackend: "Google Firebase (Auth & Firestore).",
        infraAI: "Google Gemini 1.5 Pro/Flash."
      }
    } 
  },
  ru: { 
    label: 'Русский', flag: '🇷🇺', 
    ui: { 
      dashboard: 'Панель', chat: 'Чат', portalLabel: 'Портал системы', history: 'История', upgrade: 'Обновить', login: 'Вход', 
      analyze: 'Анализ', input: 'Код', output: 'Вывод', processing: 'Обработка...', settings: 'Настройки', copy: 'Копировать', 
      model: 'AI Модель', newChat: 'Новая сессия', viewUI: 'Показать UI', hideUI: 'Скрыть UI', copyCode: 'Копировать код', copied: 'Скопировано',
      modules: 'Модули', system: 'Система', tools: 'AI Инструменты', welcome: 'Добро пожаловать', guest: 'Гость',
      authRequired: 'Требуется вход', unlock: 'Открыть', enterKey: 'Введите ключ', orUpload: 'ИЛИ ЗАГРУЗИТЬ', authenticate: 'АУТЕНТИФИКАЦИЯ',
      purchase: 'Купить', devOverride: 'Режим разработчика', access: 'ДОСТУП', customKey: 'API ключ Gemini',
      chatPlaceholder: 'Введите сообщение... (Shift+Enter для новой строки)', chatStart: 'Начать чат с CodeFixerX!', edit: 'Изменить',
      privacy: 'Конфиденциальность', terms: 'Условия', about: 'О нас', infra: 'Инфраструктура', guide: 'Руководство',
      roleUser: 'Пользователь', roleAI: 'CodeFixerX', buyKey: 'КУПИТЬ КЛЮЧ', dontHaveKey: "НЕТ КЛЮЧА?",
      originTitle: 'Происхождение Aleocrophic', specialThanks: 'Особая благодарность', coreInfra: 'Базовая инфраструктура',
      toggleHistory: 'История', sourceInput: 'ИСХОДНЫЙ КОД', getKey: 'Получить ключ', saveEnter: 'Сохранить и войти',
      apiKeyDesc: 'Обязательно. Ваш личный ключ API Gemini. Хранится локально.',
      portalContent: {
        aboutText: "CodeFixerX родился из простой необходимости: современный ландшафт разработки хаотичен. Aleocrophic Systems, основанная Райханом Дзаки Аль Мубароком под знаменем NyxShade Interactive, стремится стать маяком в этом шторме. Мы устраняем разрыв между 'работает на моей машине' и 'готовым к производству корпоративным кодом' с помощью передового ИИ.",
        missionText: "Наша миссия — не заменить разработчика, а расширить его возможности. Предоставить каждому программисту, независимо от опыта, помощника уровня 'Apex', который понимает безопасность и масштабируемость.",
        privacyText: "1. Сбор данных: Мы собираем минимум данных для аутентификации.\n2. Обработка ИИ: Ваши фрагменты кода временно отправляются в API Google Gemini.\n3. Права пользователя: Вы сохраняете полное право собственности на свой код.",
        termsText: "1. Принятие: Используя это, вы соглашаетесь с условиями.\n2. Запрещенное использование: Не создавать вредоносное ПО.\n3. Ответственность: Мы не несем ответственности за сбои.",
        guideLite: "Пользователи Lite имеют доступ к базовой отладке.",
        guideApex: "Пользователи Apex получают полный потенциал: CI/CD, Legacy Code, UI Gen.",
        infraFrontend: "React 18 + Tailwind + Vite.",
        infraBackend: "Google Firebase.",
        infraAI: "Google Gemini 1.5 Pro/Flash."
      }
    } 
  },
  de: { 
    label: 'Deutsch', flag: '🇩🇪', 
    ui: { 
      dashboard: 'Dashboard', chat: 'Freier Chat', portalLabel: 'Systemportal', history: 'Verlauf', upgrade: 'Upgrade', login: 'Anmelden', 
      analyze: 'Starten', input: 'Quellcode', output: 'Ausgabe', processing: 'Verarbeitung...', settings: 'Einstellungen', copy: 'Kopieren', 
      model: 'KI-Modell', newChat: 'Neue Sitzung', viewUI: 'UI Anzeigen', hideUI: 'UI Ausblenden', copyCode: 'Code Kopieren', copied: 'Kopiert',
      modules: 'Module', system: 'System', tools: 'KI-Tools', welcome: 'Willkommen', guest: 'Gast',
      authRequired: 'Anmeldung erforderlich', unlock: 'Entsperren', enterKey: 'Lizenzschlüssel eingeben', orUpload: 'ODER SCHLÜSSEL HOCHLADEN', authenticate: 'AUTHENTIFIZIEREN',
      purchase: 'Kaufen', devOverride: 'Entwicklerzugriff', access: 'ZUGRIFF', customKey: 'Gemini API-Schlüssel',
      chatPlaceholder: 'Nachricht eingeben... (Umschalt+Eingabe für neue Zeile)', chatStart: 'Chat mit CodeFixerX starten!', edit: 'Bearbeiten',
      privacy: 'Datenschutz', terms: 'Nutzungsbedingungen', about: 'Über uns', infra: 'Infrastruktur', guide: 'Benutzerhandbuch',
      roleUser: 'Benutzer', roleAI: 'CodeFixerX', buyKey: 'SCHLÜSSEL KAUFEN', dontHaveKey: "KEINEN SCHLÜSSEL?",
      originTitle: 'Ursprung von Aleocrophic', specialThanks: 'Besonderer Dank', coreInfra: 'Kerninfrastruktur',
      toggleHistory: 'Verlauf umschalten', sourceInput: 'QUELLCODE', getKey: 'Schlüssel erhalten', saveEnter: 'Speichern & Eintreten',
      apiKeyDesc: 'Erforderlich. Ihr persönlicher Gemini API-Schlüssel. Lokal gespeichert.',
      portalContent: {
        aboutText: "CodeFixerX entstand aus einer einfachen Notwendigkeit: Die moderne Entwicklungslandschaft ist chaotisch. Aleocrophic Systems, gegründet von Rayhan Dzaky Al Mubarok unter dem Banner von NyxShade Interactive, will der Leuchtturm in diesem Sturm sein.",
        missionText: "Unsere Mission ist es nicht, den Entwickler zu ersetzen, sondern ihn zu befähigen. Jedem Programmierer einen Assistenten auf 'Apex'-Niveau zu geben.",
        privacyText: "1. Datenerfassung: Minimal für Auth.\n2. KI-Verarbeitung: Code temporär an Google Gemini API gesendet.\n3. Benutzerrechte: Sie besitzen Ihren Code.",
        termsText: "1. Akzeptanz: Zustimmung zu den Bedingungen.\n2. Verbotene Nutzung: Keine Malware erstellen.\n3. Haftung: Keine Haftung für Ausfälle.",
        guideLite: "Lite-Benutzer: Grundlegendes Debugging.",
        guideApex: "Apex-Benutzer: Volles Potenzial, CI/CD, Legacy Code, UI Gen.",
        infraFrontend: "React 18 + Tailwind + Vite.",
        infraBackend: "Google Firebase.",
        infraAI: "Google Gemini 1.5 Pro/Flash."
      }
    } 
  },
  es: { 
    label: 'Español', flag: '🇪🇸', 
    ui: { 
      dashboard: 'Tablero', chat: 'Chat Libre', portalLabel: 'Portal del Sistema', history: 'Historial', upgrade: 'Mejorar', login: 'Acceso', 
      analyze: 'Analizar', input: 'Código', output: 'Salida', processing: 'Procesando...', settings: 'Ajustes', copy: 'Copiar', 
      model: 'Modelo IA', newChat: 'Nueva Sesión', viewUI: 'Ver UI', hideUI: 'Ocultar UI', copyCode: 'Copiar Código', copied: 'Copiado',
      modules: 'Módulos', system: 'Sistema', tools: 'Herramientas IA', welcome: 'Bienvenido', guest: 'Invitado',
      authRequired: 'Autenticación requerida', unlock: 'Desbloquear', enterKey: 'Introducir clave', orUpload: 'O SUBIR CLAVE', authenticate: 'AUTENTICAR',
      purchase: 'Comprar', devOverride: 'Acceso Desarrollador', access: 'ACCESO', customKey: 'Clave API Gemini',
      chatPlaceholder: 'Escribe un mensaje... (Shift+Enter para nueva línea)', chatStart: '¡Empieza a chatear con CodeFixerX!', edit: 'Editar',
      privacy: 'Privacidad', terms: 'Términos', about: 'Sobre nosotros', infra: 'Infraestructura', guide: 'Manual de usuario',
      roleUser: 'Usuario', roleAI: 'CodeFixerX', buyKey: 'COMPRAR CLAVE', dontHaveKey: "¿NO TIENES CLAVE?",
      originTitle: 'Origen de Aleocrophic', specialThanks: 'Agradecimientos', coreInfra: 'Infraestructura Principal',
      toggleHistory: 'Historial', sourceInput: 'CÓDIGO FUENTE', getKey: 'Obtener clave', saveEnter: 'Guardar y Entrar',
      apiKeyDesc: 'Requerido. Tu clave API personal de Gemini. Almacenada localmente.',
      portalContent: {
        aboutText: "CodeFixerX nació de una necesidad simple: el panorama de desarrollo moderno es caótico. Aleocrophic Systems, fundada por Rayhan Dzaky Al Mubarok bajo la bandera de NyxShade Interactive, aspira a ser el faro en esta tormenta.",
        missionText: "Nuestra misión no es reemplazar al desarrollador, sino empoderarlo. Darle a cada programador un asistente de nivel 'Apex'.",
        privacyText: "1. Recopilación de datos: Mínimo para autenticación.\n2. Procesamiento de IA: Código enviado temporalmente a la API de Google Gemini.\n3. Derechos del usuario: Usted posee su código.",
        termsText: "1. Aceptación: Acepta los términos.\n2. Uso prohibido: No crear malware.\n3. Responsabilidad: Sin responsabilidad por interrupciones.",
        guideLite: "Usuarios Lite: Depuración básica.",
        guideApex: "Usuarios Apex: Potencial completo, CI/CD, Código Legacy, UI Gen.",
        infraFrontend: "React 18 + Tailwind + Vite.",
        infraBackend: "Google Firebase.",
        infraAI: "Google Gemini 1.5 Pro/Flash."
      }
    } 
  },
};

const MODULES = [
  // --- LITE & APEX (Indices 0-5) ---
  { 
    id: 'debug', 
    name: 'Omni Debugger', 
    icon: <Code />, 
    premium: false, 
    desc: 'Fix syntax/logic errors.',
    systemPrompt: "You are the Omni Code Debugger. Analyze the provided code for syntax errors, logical flaws, memory leaks, and runtime issues. Return the fixed code with comments explaining the corrections. Focus on correctness and stability."
  },
  { 
    id: 'dep', 
    name: 'Dependency Scanner', 
    icon: <Search />, 
    premium: false, 
    desc: 'Analyze libs & vulnerabilities.',
    systemPrompt: "You are the Dependency Scanner. Analyze the imports and dependencies in the code. Identify deprecated packages, security risks, or heavy libraries that could be optimized. Suggest lighter or more secure alternatives."
  },
  { 
    id: 'sec', 
    name: 'Security Auditor', 
    icon: <Shield />, 
    premium: false, 
    desc: 'Fix SQLi, XSS, RCE.',
    systemPrompt: "You are the Cybersecurity Auditor. Conduct a deep security scan on the code. Look for SQL Injection, XSS, CSRF, RCE, weak cryptography, and hardcoded secrets. Provide a secure refactored version and explain the vulnerabilities found."
  },
  { 
    id: 'perf', 
    name: 'Optimizer', 
    icon: <Zap />, 
    premium: false, 
    desc: 'Boost speed & scalability.',
    systemPrompt: "You are the Performance Optimizer. Refactor the code to improve execution speed, reduce memory usage, and enhance scalability. Look for O(n^2) loops, redundant computations, and unoptimized queries. Provide the optimized code."
  },
  { 
    id: 'explain', 
    name: 'Code Explainer', 
    icon: <FileCode />, 
    premium: false, 
    desc: 'Deep explanations.',
    systemPrompt: "You are the Interactive Code Explainer. Break down the provided code into simple, digestible parts. Explain the logic flow, variable purposes, and algorithmic approach. Use analogies where appropriate. Do not just rewrite the code, explain *why* it works."
  },
  { 
    id: 'pair', 
    name: 'Pair Programmer', 
    icon: <User />, 
    premium: false, 
    desc: 'Real-time collab.',
    systemPrompt: "You are an AI Pair Programmer. Act as a senior developer colleague. Suggest completions, refactorings, or alternative approaches to the user's current code snippet. Maintain a collaborative and helpful tone."
  },
  
  // --- APEX EXCLUSIVE (Indices 6-11) ---
  { 
    id: 'legacy', 
    name: 'Legacy Resurrection', 
    icon: <History />, 
    premium: true, 
    desc: 'Modernize old stacks.',
    systemPrompt: "You are the Legacy Code Resurrection Engine. Your task is to modernize outdated code (e.g., COBOL, old PHP, jQuery, VB6) into modern standards (e.g., React, Go, Rust, Python 3.10+). Preserve business logic but upgrade the syntax, libraries, and security practices."
  },
  { 
    id: 'cicd', 
    name: 'CI/CD Integrator', 
    icon: <Cpu />, 
    premium: true, 
    desc: 'Pipeline automation.',
    systemPrompt: "You are the CI/CD Integrator. Generate robust pipeline configurations (GitHub Actions YAML, GitLab CI, Jenkinsfile, Dockerfile) for the provided code. Ensure automated testing, linting, security scanning, and deployment steps are included."
  },
  { 
    id: 'custom', 
    name: 'Custom Commander', 
    icon: <Terminal />, 
    premium: true, 
    desc: 'Execute commands.',
    systemPrompt: "You are the Custom Command Executor. Follow the specific instructions provided by the user regarding the code. You are versatile and adaptable. If the user asks for a specific refactor pattern (e.g., SOLID, DRY, KISS), apply it rigorously."
  },
  { 
    id: 'sim', 
    name: 'Adv. Simulation', 
    icon: <Play />, 
    premium: true, 
    desc: 'Sandbox run.',
    systemPrompt: "You are the Advanced Simulation Environment. Simulate the execution of the provided code. Predict the output for various edge cases. If it's UI code, describe the visual result. If it's logic, trace the variable states. Find logic bugs that static analysis might miss."
  },
  { 
    id: 'docs', 
    name: 'Dynamic Docs', 
    icon: <FileText />, 
    premium: true, 
    desc: 'Auto documentation.',
    systemPrompt: "You are the Dynamic Documentation Generator. Create comprehensive documentation for the code, including JSDoc/Docstrings, API endpoint definitions (Swagger/OpenAPI), and usage examples. Make it professional and ready for a README.md."
  },
  { 
    id: 'exp', 
    name: 'Experimental UI', 
    icon: <Sparkles />, 
    premium: true, 
    desc: 'UI Auto-Design.',
    systemPrompt: "You are the Experimental UI Generator. Generate stunning, modern, and responsive web interfaces using React, Tailwind CSS, and Lucide React icons. IMPORTANT: Provide the FULL code in a single file. Ensure it is visually impressive (Glassmorphism, Neobrutalism, or Minimalist)."
  },
];

const AI_MODELS = [
  { id: 'gemini-2.5-flash-preview-09-2025', name: 'Gemini 2.5 Flash (Latest)', desc: 'Fastest & Most Capable' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Complex Reasoning' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'High Speed' },
  { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', desc: 'Legacy Stable' },
];

const APEX_MANIFESTO = "You are CodeFixerX Apex Edition. Infinite Context. Deep Scan Active.";
const LITE_MANIFESTO = "You are CodeFixerX Lite. Efficient Debugging.";

// --- 3. UTILITY COMPONENTS ---

// FIX: Robust Syntax Highlighter (Prevents double-escaping and self-destruction)
const highlightSyntax = (code: string) => {
  if (!code) return '';
  
  // 1. Escape HTML entities first to prevent XSS and interference
  let safeCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Use placeholders for strings and comments to avoid matching keywords inside them
  const placeholders: string[] = [];
  const addPlaceholder = (match: string) => {
    placeholders.push(match);
    return `%%%PH${placeholders.length - 1}%%%`;
  };

  // Replace strings and comments with placeholders
  safeCode = safeCode
    .replace(/(".*?"|'.*?'|`.*?`)/g, addPlaceholder) // Strings
    .replace(/(\/\/.*$)/gm, addPlaceholder);          // Comments

  // 3. Highlight Keywords and Numbers
  const keywords = "\\b(const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await|try|catch|switch|case|new|this|typeof|interface|type|extends|implements|public|private|protected|static|readonly|constructor)\\b";
  
  safeCode = safeCode
    .replace(new RegExp(keywords, 'g'), '<span class="text-pink-400 font-semibold">$1</span>')
    .replace(/(\w+)(?=\()/g, '<span class="text-cyan-400">$1</span>') // Function calls
    .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>'); // Numbers

  // 4. Restore placeholders with colors
  safeCode = safeCode.replace(/%%%PH(\d+)%%%/g, (_, index) => {
    const content = placeholders[parseInt(index)];
    if (content.startsWith('//')) {
      return `<span class="text-slate-500 italic">${content}</span>`;
    } else {
      return `<span class="text-emerald-400">${content}</span>`;
    }
  });

  return safeCode;
};

// Updated Markdown Renderer
const MarkdownRenderer = ({ content, copyLabel, copiedLabel }: { content: string, copyLabel: string, copiedLabel: string }) => {
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
          let html = part
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-cyan-400 mt-6 mb-2 flex items-center gap-2"><span class="w-1 h-4 bg-cyan-500 rounded-full"></span>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-amber-400 mt-8 mb-4 border-b border-slate-800 pb-2">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-8 mb-4 border-b-2 border-slate-700 pb-2">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="text-slate-400 italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs border border-slate-700">$1</code>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-400 mb-1 pl-1">$1</li>')
            .replace(/\n/g, '<br />');

          return <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
        }
      })}
    </div>
  );
};

const CodeBlock = ({ lang, code, copyLabel, copiedLabel }: { lang: string, code: string, copyLabel: string, copiedLabel: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error("Copy failed", err); }
    document.body.removeChild(textarea);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950 my-4 shadow-lg group relative">
      <div className="flex justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 items-center">
        <span className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-2"><Terminal size={12}/> {lang}</span>
        <button onClick={handleCopy} className={`text-xs flex items-center gap-1 transition-all ${copied ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}>
          {copied ? <CheckCircle size={12}/> : <Clipboard size={12}/>} {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <div className="relative">
        <pre className="p-4 overflow-x-auto font-mono text-xs md:text-sm text-slate-200 selection:bg-cyan-500/30">
            <code dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }} />
        </pre>
      </div>
    </div>
  );
}

// --- 4. MAIN APP ---
export default function App() { 
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState('language');
  const [langCode, setLangCode] = useState('en');
  const [isPremium, setIsPremium] = useState(false);
  const [currentModule, setCurrentModule] = useState(MODULES[0]);
  const [aiModel, setAiModel] = useState(AI_MODELS[0].id);
  
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);
  const [devPin, setDevPin] = useState('');

  const [inputCode, setInputCode] = useState('');
  const [outputResult, setOutputResult] = useState('');
  const [isInputMinimized, setIsInputMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  
  // CHAT STATE
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [premiumKey, setPremiumKey] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [loginApiKey, setLoginApiKey] = useState(''); 
  const [notif, setNotif] = useState<{msg: string, type: string} | null>(null);
  const [portalTab, setPortalTab] = useState('about'); 
  const [generatedApiKey, setGeneratedApiKey] = useState("GUEST");

  // SAFE TRANSLATION HELPERS
  const getLangObj = () => LANGUAGES[langCode] || LANGUAGES['en'];
  
  // Safe string getter
  const tText = (key: string) => {
     const lang = getLangObj();
     return lang.ui[key] || key;
  };

  // Safe object getter (for portal content)
  const tData = (key: string) => {
    const lang = getLangObj();
    // Access nested portalContent safely
    return lang.ui?.portalContent?.[key] || key;
  }
  
  const notify = (msg: string, type = 'info') => { setNotif({msg, type}); setTimeout(() => setNotif(null), 3000); };

  // Effects
  useEffect(() => {
    const savedLang = localStorage.getItem('cfx_lang');
    const savedKey = localStorage.getItem('cfx_api_key');
    const savedModel = localStorage.getItem('cfx_ai_model');
    if (savedLang && LANGUAGES[savedLang]) setLangCode(savedLang);
    if (savedKey) setCustomApiKey(savedKey);
    if (savedModel) setAiModel(savedModel);
    
    const handleResize = () => { if (window.innerWidth < 768) setSidebarOpen(false); else setSidebarOpen(true); };
    handleResize(); window.addEventListener('resize', handleResize);

    const unsub = onAuthStateChanged(auth, async (u) => { 
      setUser(u); 
      if(u) { 
        setIsDevMode(false);
        setGeneratedApiKey(`CFX-${u.uid.substring(0,6).toUpperCase()}`);
        setView('dashboard');
        
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.language && LANGUAGES[data.language]) setLangCode(data.language);
            if (data.isPremium) setIsPremium(true);
            if (data.aiModel) setAiModel(data.aiModel);
          }
        } catch (e) {}
      } else {
        if (!isDevMode) { setIsPremium(false); setGeneratedApiKey("GUEST"); if(view === 'dashboard') setView('language'); }
      }
      setIsAuthChecking(false);
    });
    return () => { unsub(); window.removeEventListener('resize', handleResize); };
  }, []);

  // HISTORY SYNC
  useEffect(() => {
    if (!user) { setHistory([]); return; }
    let q = query(collection(db, 'history'), where('userId', '==', user.uid)); 
    
    const unsub = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Client-side Sorting (Newest First)
      fetched.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setHistory(fetched);
    }, (error) => {
        console.error("Firestore History Error:", error); // Log error silently
    });
    return () => unsub();
  }, [user, view]); 

  // HANDLERS

  const handleLogin = async () => {
    try { 
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider); 
      notify("Identity Verified! 🌸", "success"); 
    } catch (e: any) { 
      console.error("Popup Auth Error:", e);
      if (e.code === 'auth/unauthorized-domain' || e.code === 'auth/popup-blocked') {
         notify(`Domain Blocked. Fallback to Anonymous.`, "warning");
         try { await signInAnonymously(auth); notify("Logged in Anonymously.", "success"); } 
         catch (anonErr) { notify("Critical Auth Failure.", "error"); }
      } else { notify("Login Failed: " + e.message, "error"); }
    }
  };

  const handleGuestAccess = () => {
      if (loginApiKey.trim()) {
          setCustomApiKey(loginApiKey.trim());
          localStorage.setItem('cfx_api_key', loginApiKey.trim());
          notify("API Key Saved!", "success");
      }
      setView('dashboard');
  }

  const changeAiModel = async (modelId: string) => {
    setAiModel(modelId); localStorage.setItem('cfx_ai_model', modelId);
    if(user) { try { await setDoc(doc(db, 'users', user.uid), { aiModel: modelId }, { merge: true }); } catch(e) {} }
    notify(`Neural Engine Switched: ${AI_MODELS.find(m => m.id === modelId)?.name}`, 'success');
  }

  // DEFINED: New Session Handler
  const handleNewSession = () => {
    if (view === 'chat') {
      setChatMessages([]);
      notify(tText('newChat'), "success");
    } else {
      setInputCode('');
      setOutputResult('');
      setIsInputMinimized(false);
      notify(tText('newChat'), "success");
    }
  };

  const handleUnlock = async () => {
    const cleanKey = premiumKey.trim();
    if (cleanKey === "CFX-APX-2025R242") { 
      setIsPremium(true); notify("APEX UNLOCKED", "success"); setView('dashboard');
      if(user) await setDoc(doc(db, 'users', user.uid), { isPremium: true }, { merge: true });
    } else notify("Invalid Key", "error");
  };

  const handleDevUnlock = () => {
    if (devPin === "200924-RDZ-DVLP") { setIsDevMode(true); setGeneratedApiKey("RDZ-DEV-ROOT"); notify("⚠️ DEVELOPER MODE ACTIVE", "success"); setView('dashboard'); setDevPin(''); } 
    else { notify("ACCESS DENIED 💀", "error"); }
  };

  const handleKeyFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { if (e.target?.result) { setPremiumKey(e.target.result.toString().trim()); notify("Key Loaded!", "success"); } };
    reader.readAsText(file);
  };

  const handleCopyOutput = () => {
    const textarea = document.createElement('textarea');
    textarea.value = outputResult;
    textarea.style.position = 'fixed'; textarea.style.left = '-9999px';
    document.body.appendChild(textarea); textarea.select();
    try { document.execCommand('copy'); notify(tText('copy') + " Success!", "success"); } catch (e) { notify("Copy failed", "error"); }
    document.body.removeChild(textarea);
  };

  const handleAnalyze = async () => {
    // SECURITY: Require User API Key
    const apiKeyToUse = customApiKey || defaultApiKey; 
    if (!apiKeyToUse) {
        notify("⚠️ API Key Missing! Please set it in Settings or Login.", "error");
        setView('settings');
        return;
    }

    if (!inputCode.trim()) return notify("Input Empty 😅", "warning");
    if (currentModule.premium && !isPremium) return notify("Locked! 🔒 Upgrade to Apex.", "error");

    setLoading(true); setOutputResult(''); setIsInputMinimized(false);

    const baseManifesto = isPremium ? APEX_MANIFESTO : LITE_MANIFESTO;
    const lang = getLangObj();
    const systemInstruction = `${baseManifesto} LANGUAGE: Reply strictly in ${lang.label} (${lang.flag}). MODULE: ${currentModule.name}. ${currentModule.systemPrompt}. USER TONE: Stylish, Expressive, minimal 3 emojis. OUTPUT: Markdown with explicit code blocks. NO PREVIEW/IFRAME CODE.`;

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKeyToUse}`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ contents: [{ parts: [{ text: inputCode }] }], systemInstruction: { parts: [{ text: systemInstruction }] } })
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error.";
      setOutputResult(text); setIsInputMinimized(true);

      if (user && !isDevMode) await addDoc(collection(db, 'history'), { 
        userId: user.uid, 
        codeSnippet: inputCode.substring(0,50), 
        module: currentModule.name, 
        response: text, 
        type: 'code',
        createdAt: serverTimestamp() 
      });

    } catch (e: any) { notify(`AI Error: ${e.message}`, "error"); } finally { setLoading(false); }
  };

  const handleChatSend = async () => {
    const apiKeyToUse = customApiKey || defaultApiKey;
    if (!apiKeyToUse) {
        notify("⚠️ API Key Missing! Please set it in Settings.", "error");
        setView('settings');
        return;
    }

    if(!chatInput.trim()) return;
    const newMessage = { role: 'user' as const, text: chatInput };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
    setChatLoading(true);

    const lang = getLangObj();

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKeyToUse}`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ contents: [{ parts: [{ text: chatInput }] }], systemInstruction: { parts: [{ text: `You are CodeFixerX. Reply in ${lang.label} (${lang.flag}). Be stylish, expressive, and helpful. Use emojis.` }] } })
      });
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error.";
      setChatMessages(prev => [...prev, { role: 'ai', text: text }]);
      
      if (user && !isDevMode) await addDoc(collection(db, 'history'), { 
        userId: user.uid, 
        codeSnippet: chatInput.substring(0,50), 
        module: 'Free Chat', 
        response: text, 
        type: 'chat', 
        createdAt: serverTimestamp() 
      });

    } catch(e) { notify("Chat Error", "error"); } finally { setChatLoading(false); }
  };

  // FIX: Shift+Enter Handler
  const handleChatInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  const copyChat = (text: string) => {
    navigator.clipboard.writeText(text);
    notify(tText('copied'), "success");
  }

  const handleSaveCustomKey = () => {
    if (!customApiKey.trim()) {
      notify("Invalid Key!", "error");
      return;
    }
    localStorage.setItem('cfx_api_key', customApiKey);
    notify("Custom Key Saved & Ready!", "success");
  }

  // --- RENDER AUTH LOADING ---
  if (isAuthChecking) return (<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4"><div className="relative mb-8"><div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full animate-pulse"></div><Cpu size={64} className="text-cyan-400 relative z-10 animate-bounce"/></div><h2 className="text-2xl font-bold text-white mb-2 tracking-wider">INITIALIZING NEURAL LINK</h2></div>);

  // --- LOGIN VIEW ---
  if (view === 'language') return (<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80')] bg-cover opacity-10 animate-pulse"></div><div className="z-10 max-w-5xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl text-center"><h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">CodeFixerX</h1><p className="text-slate-400 text-sm tracking-[0.3em] uppercase mb-12">Aleocrophic Systems</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Object.entries(LANGUAGES).map(([code, data]) => (<button key={code} onClick={() => { setLangCode(code); setView('login'); }} className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-2xl transition-all group flex flex-col items-center"><span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{data.flag}</span><span className="text-slate-300 font-bold group-hover:text-white">{data.label}</span></button>))}</div></div></div>);
  if (view === 'login') return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
       <button onClick={() => setView('language')} className="absolute top-6 left-6 text-slate-400 hover:text-white flex gap-2 z-20"><ChevronRight className="rotate-180"/> Back</button>
       <div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-slate-700 max-w-sm w-full text-center shadow-2xl relative">
         <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><Cpu size={40} className="text-cyan-400"/></div>
         <h2 className="text-2xl font-bold text-white mb-2">{tText('login')}</h2>
         <div className="mb-4 text-left"><label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-1 block">{tText('customKey')}</label><div className="flex gap-2"><input type="password" value={loginApiKey} onChange={(e) => setLoginApiKey(e.target.value)} className="flex-1 bg-slate-800 border border-slate-600 text-white text-xs p-2 rounded-lg outline-none focus:border-cyan-500" placeholder="Paste Key Here..."/><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="bg-slate-800 border border-slate-600 text-cyan-400 hover:text-white p-2 rounded-lg" title={tText('getKey')}><ExternalLink size={14}/></a></div></div>
         <button onClick={handleLogin} className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl flex justify-center gap-2 hover:bg-slate-200 transition mb-3"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G"/> Google Auth</button>
         <button onClick={handleGuestAccess} className="w-full py-3 bg-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition">{tText('saveEnter')}</button>
       </div>
    </div>
  );

  // --- MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden selection:bg-cyan-500/30">
      {notif && <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg border animate-bounce ${notif.type==='success'?'bg-emerald-500/20 border-emerald-500 text-emerald-300':'bg-red-500/20 border-red-500 text-red-300'}`}>{notif.msg}</div>}

      {/* SIDEBAR */}
      <aside className={`
          fixed inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur border-r border-slate-800 flex flex-col transition-transform duration-300 
          ${sidebarOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'}
        `}>
         <div className="p-6 border-b border-slate-800 flex justify-between items-center min-w-[18rem]">
            <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${isPremium ? 'bg-amber-500' : 'bg-cyan-600'}`}>{isPremium ? <Sparkles className="text-white"/> : <Code className="text-white"/>}</div><div><h2 className="font-bold leading-none tracking-tight">CodeFixerX</h2><span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{isPremium ? 'Apex' : 'Lite'}</span></div></div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"><X/></button>
         </div>
         <div className="px-4 pt-4 flex gap-2 border-b border-slate-800 pb-4 min-w-[18rem]"><button onClick={() => setView('dashboard')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${view==='dashboard'?'bg-slate-800 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}>{tText('dashboard')}</button><button onClick={() => setView('settings')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${view==='settings'?'bg-slate-800 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}><Settings size={12} className="inline mb-0.5"/> {tText('settings')}</button></div>
         <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar min-w-[18rem]">
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-2">{tText('modules')}</div>
           {MODULES.map((m) => {
             const isLocked = m.premium && !isPremium;
             return (<button key={m.id} onClick={() => { if(!isLocked){setCurrentModule(m); setView('dashboard'); setSidebarOpen(false);} else notify("Locked 🔒 Upgrade!", "error"); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition text-left ${currentModule.id===m.id && view==='dashboard' ? (isPremium?'bg-amber-500/20 text-amber-300 border border-amber-500/20':'bg-cyan-500/20 text-cyan-300 border border-cyan-500/20') : 'text-slate-400 hover:bg-slate-800'} ${isLocked ? 'opacity-50 cursor-not-allowed':''}`}><div className={`${isLocked ? 'text-slate-600' : (m.premium ? 'text-amber-400' : 'text-cyan-400')}`}>{m.icon}</div><span className="flex-1 truncate text-xs font-medium">{m.name}</span>{isLocked && <Lock size={12} className="text-slate-600"/>}</button>);
           })}
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-6">{tText('tools')}</div>
           <button onClick={() => {setView('chat'); setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${view==='chat' ? (isPremium ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:bg-slate-800') : 'text-slate-400 hover:bg-slate-800'}`}><MessageSquare size={16} className={isPremium?"text-purple-400":""}/> {tText('chat')} (Apex) {!isPremium && <Lock size={12}/>}</button>
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-6">{tText('system')}</div>
           <button onClick={() => {setView('portal'); setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-400 hover:bg-slate-800 transition ${view==='portal'?'bg-indigo-500/20 text-indigo-300':''}`}><BookOpen size={16}/> {tText('portalLabel')}</button>
         </div>
         <div className="p-4 border-t border-slate-800 bg-slate-900 min-w-[18rem]">
            {!isPremium && <button onClick={() => (user || isDevMode) ? setView('premium') : setView('login')} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded-lg transition shadow-lg shadow-amber-500/20 mb-2 flex items-center justify-center gap-2"><Unlock size={12}/> {tText('upgrade')}</button>}
            {user || isDevMode ? (<div className="flex items-center gap-3 px-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isDevMode ? 'bg-red-900 border-red-500 text-red-200' : 'bg-cyan-900 border-cyan-700 text-cyan-200'}`}>{isDevMode ? 'DEV' : user.email[0].toUpperCase()}</div><div className="flex-1 overflow-hidden"><div className="text-xs font-bold truncate">{isDevMode ? 'Developer' : user.displayName}</div><div className="text-[10px] text-slate-500">{isDevMode ? 'System Root' : 'Online'}</div></div><button onClick={() => signOut(auth)}><LogOut size={16} className="text-slate-500 hover:text-red-400"/></button></div>) : (<button onClick={() => setView('login')} className="w-full flex justify-center gap-2 bg-slate-800 py-3 rounded-xl text-sm font-bold hover:bg-slate-700 border border-slate-700"><LogIn size={16}/> {tText('login')}</button>)}
         </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col w-full relative bg-slate-950">
         <header className="h-auto min-h-[64px] border-b border-slate-800 flex flex-col md:flex-row items-center justify-between px-6 py-2 bg-slate-950/90 backdrop-blur sticky top-0 z-40 shadow-md">
            <div className="flex items-center gap-4 w-full md:w-auto mb-2 md:mb-0">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors mr-2 p-2 bg-slate-800/50 rounded-lg"><Menu/></button>
               <div className="flex items-center gap-2 text-slate-400 text-sm"><LayoutDashboard size={16}/> <ChevronRight size={14}/> <span className={isPremium ? "text-amber-400 font-bold" : "text-cyan-400 font-bold"}>{view === 'portal' ? tText('portalLabel') : view === 'premium' ? tText('upgrade') : view === 'settings' ? tText('settings') : view === 'chat' ? tText('chat') : currentModule.name}</span></div>
            </div>
            <div className="flex flex-wrap justify-end gap-4 text-[10px] md:text-xs font-mono w-full md:w-auto">
               <div className="flex items-center gap-2 text-slate-500"><span className={`w-2 h-2 rounded-full ${isPremium ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span> ACTIVE</div>
               <div className="text-slate-500">VER: {isPremium ? <span className="text-amber-500">vX.APEX</span> : <span className="text-cyan-500">vX.LITE</span>}</div>
               {view !== 'settings' && view !== 'premium' && <button onClick={handleNewSession} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded text-cyan-400 transition cursor-pointer"><RefreshCw size={12}/> {tText('newChat')}</button>}
               {customApiKey && <div className="flex items-center gap-1 border border-slate-800 rounded px-2 py-0.5 bg-slate-900"><Key size={10} className="text-amber-500"/><span className="text-slate-400">CUSTOM KEY</span></div>}
            </div>
         </header>

         {view === 'dashboard' && (
            <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col lg:flex-row gap-6">
               <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                  {/* INPUT AREA */}
                  <div 
                     onClick={() => isInputMinimized && setIsInputMinimized(false)}
                     className={`bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${isInputMinimized ? 'h-16 cursor-pointer hover:border-cyan-500 hover:bg-slate-800' : 'flex-1 min-h-[250px]'}`}
                  >
                     <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><FileCode size={14}/> {tText('input')} {isInputMinimized && <span className="text-cyan-500 text-[10px] animate-pulse">◀ Click to Expand</span>}</span>
                        {!isInputMinimized && <button onClick={(e) => {e.stopPropagation(); setIsInputMinimized(true);}} className="text-xs text-slate-500 hover:text-white flex items-center gap-1"><Minimize2 size={14}/> Minimize</button>}
                     </div>
                     <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)} className={`flex-1 bg-slate-900 p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none custom-scrollbar ${isInputMinimized ? 'hidden' : 'block'}`} placeholder={`// Paste code here...`} spellCheck="false"/>
                  </div>

                  {!isInputMinimized && (
                    <button onClick={handleAnalyze} disabled={loading} className={`py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3 ${loading ? 'bg-slate-800 text-slate-500' : isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white'}`}>
                       {loading ? tText('processing') : <><Zap className={loading?"":"animate-pulse"}/> {tText('analyze')}</>}
                    </button>
                  )}

                  {(outputResult || loading) && (
                    <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden min-h-[400px] relative animate-fadeIn">
                       {loading && <div className="absolute inset-0 z-10 bg-slate-950/80 flex flex-col items-center justify-center"><div className="w-1/2 h-1 bg-slate-800 rounded-full overflow-hidden mb-4"><div className="h-full bg-cyan-500 animate-progress"></div></div><div className="text-cyan-400 text-xs font-mono animate-pulse">{tText('processing')}</div></div>}
                       <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center shrink-0">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Terminal size={14}/> {tText('output')}</span>
                          <div className="flex gap-2">
                            <button onClick={handleCopyOutput} className="text-xs flex items-center gap-1 text-slate-400 hover:text-white"><CheckCircle size={12}/> {tText('copy')}</button>
                          </div>
                       </div>
                       <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950">
                          <MarkdownRenderer content={outputResult} copyLabel={tText('copyCode')} copiedLabel={tText('copied')} />
                       </div>
                    </div>
                  )}
               </div>
               
               <div className="w-full lg:w-64 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shrink-0 h-48 lg:h-full shadow-lg">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between"><span className="text-xs font-bold text-slate-400 flex items-center gap-2"><History size={14}/> {tText('history')}</span></div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {!user && !isDevMode ? <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs p-4 text-center"><Lock size={20} className="mb-2"/><p>Guest Mode.</p></div> : history.length === 0 ? <div className="text-center text-slate-600 text-xs mt-4">No logs yet.</div> : 
                      history.map(h => (
                        <div key={h.id} onClick={() => {setInputCode(h.codeSnippet); setOutputResult(h.response); setIsInputMinimized(true);}} className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 hover:bg-slate-800 cursor-pointer transition group">
                          <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-cyan-500 uppercase truncate">{h.module}</span></div>
                          <div className="text-xs text-slate-400 truncate font-mono">{h.codeSnippet}</div>
                        </div>
                      ))
                    }
                  </div>
               </div>
            </div>
         )}

         {/* CHAT VIEW */}
         {view === 'chat' && (
           isPremium ? (
             <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col lg:flex-row gap-6">
               <div className="flex-1 flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden shadow-xl">
                 <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                   {chatMessages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-600"><MessageSquare size={48} className="mb-4 opacity-20"/><p>{tText('chatStart')}</p></div>}
                   {chatMessages.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                       <div className={`max-w-[85%] p-4 rounded-2xl relative ${msg.role === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
                         <MarkdownRenderer content={msg.text} copyLabel={tText('copy')} copiedLabel={tText('copied')} />
                         <div className={`absolute -bottom-6 ${msg.role === 'user' ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition flex gap-2`}>
                           <button onClick={() => copyChat(msg.text)} className="p-1 bg-slate-800 rounded border border-slate-700 text-slate-400 hover:text-white" title={tText('copy')}><Clipboard size={12}/></button>
                         </div>
                       </div>
                     </div>
                   ))}
                   {chatLoading && <div className="flex justify-start"><div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700"><div className="flex gap-1"><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div></div></div></div>}
                 </div>
                 <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                   <textarea 
                     value={chatInput} 
                     onChange={(e)=>setChatInput(e.target.value)} 
                     onKeyDown={handleChatInputKeyDown} 
                     placeholder={tText('chatPlaceholder')} 
                     className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-cyan-500 outline-none resize-none h-[50px] max-h-32"
                   />
                   <button onClick={handleChatSend} className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl self-end"><Send size={20}/></button>
                 </div>
               </div>
               
               {/* CHAT HISTORY SIDEBAR */}
               {chatHistoryOpen && (
                <div className="w-full lg:w-64 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shrink-0 h-48 lg:h-full shadow-lg absolute lg:relative right-0 z-20">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><History size={14}/> {tText('history')} (Chat)</span>
                        <button onClick={() => setChatHistoryOpen(false)} className="lg:hidden text-slate-400"><X size={14}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                      {!user && !isDevMode ? <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs p-4 text-center"><Lock size={20} className="mb-2"/><p>Guest Mode.</p></div> : history.filter(h => h.type === 'chat').length === 0 ? <div className="text-center text-slate-600 text-xs mt-4">No chats.</div> : 
                        history.filter(h => h.type === 'chat').map(h => (
                          <div key={h.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 hover:bg-slate-800 cursor-pointer transition group"
                               onClick={() => {
                                   // FIX: LOAD CHAT SESSION
                                   setChatMessages([
                                       { role: 'user', text: h.codeSnippet }, // Input was stored in codeSnippet
                                       { role: 'ai', text: h.response }       // Response was stored in response
                                   ]);
                                   notify("Chat Session Loaded", "success");
                               }}>
                            <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-purple-400 uppercase truncate">CHAT</span><span className="text-[10px] text-slate-600">{h.createdAt ? new Date(h.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now'}</span></div>
                            <div className="text-xs text-slate-400 truncate font-mono">{h.codeSnippet}</div>
                          </div>
                        ))
                      }
                    </div>
                </div>
               )}
               <button onClick={() => setChatHistoryOpen(!chatHistoryOpen)} className="absolute right-6 top-24 lg:hidden z-30 bg-slate-800 p-2 rounded-full border border-slate-700 text-slate-400 shadow-lg"><PanelRight size={20}/></button>
             </div>
           ) : (
             <div className="flex-1 flex items-center justify-center bg-slate-950 p-6"><div className="max-w-md w-full bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-slate-700 text-center shadow-2xl"><Lock size={40} className="text-slate-500 mx-auto mb-4"/><h2 className="text-2xl font-bold text-white mb-2">Premium Feature</h2><p className="text-slate-400 text-sm mb-6">Free Chat is available for Apex users only.</p><button onClick={() => (user||isDevMode) ? setView('premium') : setView('login')} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold rounded-xl">UNLOCK APEX</button></div></div>
           )
         )}

         {/* SETTINGS VIEW */}
         {view === 'settings' && (
           <div className="flex-1 overflow-y-auto p-6 md:p-12">
             <div className="max-w-2xl mx-auto">
               <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Settings/> {tText('settings')}</h2>
               <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Brain size={18} className="text-purple-400"/> {tText('model')}</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{AI_MODELS.map((model)=>(<button key={model.id} onClick={()=>changeAiModel(model.id)} className={`p-4 rounded-xl border text-left transition-all ${aiModel===model.id?'bg-purple-500/20 border-purple-500':'bg-slate-950 border-slate-700 hover:border-slate-500'}`}><div className={`font-bold text-sm mb-1 ${aiModel===model.id?'text-purple-300':'text-slate-300'}`}>{model.name}</div><div className="text-xs text-slate-500">{model.desc}</div></button>))}</div>
               </div>
               {/* ... Language & API Key sections ... */}
               <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-cyan-400"/> Language</h3><div className="flex flex-wrap gap-3">{Object.entries(LANGUAGES).map(([code, data])=>(<button key={code} onClick={()=>{setLangCode(code);localStorage.setItem('cfx_lang',code);}} className={`px-4 py-2 rounded-xl border text-sm flex items-center gap-2 ${langCode===code?'bg-cyan-500/20 border-cyan-500 text-cyan-300':'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}`}><span>{data.flag}</span> {data.label}</button>))}</div></div>
               <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Key size={18} className="text-amber-400"/> {tText('customKey')}</h3><p className="text-xs text-slate-400 mb-4">{tText('apiKeyDesc')}</p><div className="flex gap-2"><input type="password" value={customApiKey} onChange={(e)=>setCustomApiKey(e.target.value)} placeholder="AIzaSy..." className="flex-1 bg-slate-950 border border-slate-700 text-white p-3 rounded-xl text-sm font-mono focus:border-cyan-500 outline-none"/><button onClick={handleSaveCustomKey} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-bold text-sm">SAVE</button></div></div>
               <div className="mt-12 border-t border-slate-800 pt-6"><h4 className="text-xs text-slate-600 font-mono mb-2 uppercase tracking-widest flex items-center gap-2"><Bug size={12}/> {tText('devOverride')}</h4><div className="flex gap-2 max-w-xs"><input type="password" value={devPin} onChange={(e)=>setDevPin(e.target.value)} placeholder="Enter PIN..." className="flex-1 bg-slate-950 border border-slate-800 text-slate-300 p-2 rounded-xl text-xs focus:border-red-500 outline-none transition-colors"/><button onClick={handleDevUnlock} className="bg-slate-800 hover:bg-red-900 hover:text-red-200 text-slate-400 px-4 rounded-xl text-xs font-bold transition-colors">{tText('access')}</button></div></div>
             </div>
           </div>
         )}

         {view === 'portal' && (
            <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-20 custom-scrollbar bg-slate-950">
               <div className="max-w-4xl mx-auto animate-fadeIn">
                  <div className="flex gap-4 border-b border-slate-800 mb-8 pb-1 sticky top-0 bg-slate-950/95 z-20 pt-4">
                     {[{id:'guide',label:'Guide'},{id:'infra',label:'Infra'},{id:'about',label:'About Us'},{id:'legal',label:'Legal Docs'}].map(t => (
                       <button key={t.id} onClick={() => setPortalTab(t.id)} className={`px-4 py-2 text-sm font-bold transition ${portalTab===t.id ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-white'}`}>{t.label}</button>
                     ))}
                  </div>
                  
                  {portalTab === 'about' && (
                     <div className="space-y-6">
                        <section>
                          <h2 className="text-3xl font-bold text-white mb-4">{tText('originTitle')}</h2>
                          <p className="text-slate-400 leading-relaxed mb-4">{tData('portalContent').aboutText}</p>
                        </section>
                        <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mt-8">
                           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Heart className="text-red-500" size={20}/> {tText('specialThanks')}</h3>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4">
                                <div className="w-12 h-12 bg-cyan-900 rounded-full flex items-center justify-center font-bold text-cyan-400">RD</div>
                                <div>
                                  <div className="text-white font-bold">Rayhan Dzaky Al Mubarok</div>
                                  <div className="text-xs text-slate-500">Founder & Lead Architect</div>
                                </div>
                              </div>
                              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-pink-900 border border-pink-500">
                                  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8rY5XbTjGXe6z_pUj7VqN2M0L8O6K9P1Q2S3T4U5V6W7X8Y9Z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2/s1600/download%20(5).jpeg" alt="TH" className="w-full h-full object-cover" onError={(e) => {e.currentTarget.onerror = null; e.currentTarget.src="https://via.placeholder.com/150/pink/white?text=TH"}} />
                                </div>
                                <div>
                                  <div className="text-white font-bold">Takanashi Hoshino</div>
                                  <div className="text-xs text-slate-500">Spiritual Support (Blue Archive)</div>
                                </div>
                              </div>
                              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-900 rounded-full flex items-center justify-center font-bold text-amber-400">AL</div>
                                <div>
                                  <div className="text-white font-bold">Aleocrophic Brand</div>
                                  <div className="text-xs text-slate-500">Identity & Design System</div>
                                </div>
                              </div>
                           </div>
                        </section>
                     </div>
                  )}
                  {/* ... Other tabs ... */}
                  {portalTab === 'legal' && <div className="space-y-8"><section><h2 className="text-2xl font-bold text-white mb-4"><Shield size={24} className="text-emerald-500"/> {tText('privacy')}</h2><div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 text-sm text-slate-400 whitespace-pre-wrap">{tData('portalContent').privacyText}</div></section><section><h2 className="text-2xl font-bold text-white mb-4"><FileText size={24} className="text-amber-500"/> {tText('terms')}</h2><div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 text-sm text-slate-400 whitespace-pre-wrap">{tData('portalContent').termsText}</div></section></div>}
                  {portalTab === 'guide' && <div className="space-y-8"><section><h2 className="text-2xl font-bold text-white mb-4">📘 {tText('guide')}</h2><div className="grid md:grid-cols-2 gap-6"><div className="bg-slate-900 p-6 rounded-xl border border-slate-800"><h3 className="text-cyan-400 font-bold text-lg mb-3 flex items-center gap-2"><Code size={18}/> Lite Users</h3><p className="text-sm text-slate-400">{tData('portalContent').guideLite}</p></div><div className="bg-slate-900 p-6 rounded-xl border border-slate-800"><h3 className="text-amber-400 font-bold text-lg mb-3 flex items-center gap-2"><Sparkles size={18}/> Apex Users</h3><p className="text-sm text-slate-400">{tData('portalContent').guideApex}</p></div></div></section></div>}
                  {portalTab === 'infra' && <section className="space-y-8"><h2 className="text-2xl font-bold text-white mb-4"><Server size={24}/> {tText('coreInfra')}</h2><div className="grid gap-6 md:grid-cols-3"><div className="p-6 bg-slate-900 rounded-2xl border border-slate-800"><Globe className="text-cyan-500 mb-4"/><h3 className="text-white font-bold mb-2">Frontend</h3><p className="text-slate-400 text-sm">{tData('portalContent').infraFrontend}</p></div><div className="p-6 bg-slate-900 rounded-2xl border border-slate-800"><Database className="text-amber-500 mb-4"/><h3 className="text-white font-bold mb-2">Backend</h3><p className="text-slate-400 text-sm">{tData('portalContent').infraBackend}</p></div><div className="p-6 bg-slate-900 rounded-2xl border border-slate-800"><Cpu className="text-emerald-500 mb-4"/><h3 className="text-white font-bold mb-2">AI</h3><p className="text-slate-400 text-sm">{tData('portalContent').infraAI}</p></div></div></section>}
               </div>
            </div>
         )}

         {view === 'premium' && (
           <div className="flex-1 flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 to-slate-950"></div><div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-amber-500/30 max-w-md w-full text-center shadow-2xl"><Unlock size={40} className="text-amber-500 mx-auto mb-4"/><h2 className="text-2xl font-bold text-white mb-2">{tText('unlock')} Apex Edition</h2><p className="text-slate-400 text-sm mb-6">{tText('enterKey')}</p><input type="text" value={premiumKey} onChange={(e)=>setPremiumKey(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-center text-white p-3 rounded-xl mb-4 font-mono focus:border-amber-500 outline-none" placeholder="XXXX-XXXX-XXXX"/><div className="flex items-center gap-2 mb-4"><div className="h-px bg-slate-800 flex-1"></div><span className="text-xs text-slate-500">{tText('orUpload')}</span><div className="h-px bg-slate-800 flex-1"></div></div><label className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-3 rounded-xl cursor-pointer transition mb-4 border border-dashed border-slate-600"><Upload size={14}/> Upload key.txt<input type="file" accept=".txt" className="hidden" onChange={handleKeyFileUpload}/></label><button onClick={() => {const cleanKey = premiumKey.trim().toUpperCase(); if(cleanKey==="CFX-APX-2025R242"){setIsPremium(true);notify("UNLOCKED!","success");setView('dashboard');}else notify("Invalid","error");}} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold rounded-xl">{tText('authenticate')}</button>

          <div className="flex items-center gap-3 mt-4">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-xs text-slate-500">{tText('dontHaveKey')}</span>
              <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <a 
            href="https://lynk.id/zetago-aurum/yjzz3v78oq13"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 mt-3 bg-slate-800 hover:bg-slate-700 border border-amber-500/50 text-amber-400 font-bold rounded-xl flex items-center justify-center gap-2 transition group"
          >
            <ShoppingCart size={16} className="group-hover:scale-110 transition-transform"/> {tText('buyKey')}
          </a>

           </div></div>
         )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #020617; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .animate-progress { animation: progress 2s ease-in-out infinite; } @keyframes progress { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
