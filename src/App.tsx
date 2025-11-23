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
  Settings, Box, Activity, Languages, BookOpen, Key, Database, Layers, Clipboard, AlertTriangle, Heart, Briefcase, Laptop, Bug, Upload, Brain, MessageSquare, PlusCircle, RefreshCw, Send, ShoppingCart, Edit2, Trash2, PanelRight, ExternalLink, Github, Wifi, WifiOff, Fingerprint, Sidebar, SidebarClose, SidebarOpen 
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
 
// --- 🚫 SECURITY UPDATE: NO DEFAULT API KEY --- 
const defaultApiKey = ""; 
 
// --- 2. DATA & TRANSLATIONS (FULL COMPLETE 7 LANGUAGES) --- 
 
const LANGUAGES = { 
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
      apiKeyDesc: 'REQUIRED. Your personal Gemini API Key. Stored strictly locally on your device.', 
      enterApiFirst: 'System Locked. API Key Required.', 
      apiGateMsg: 'To prevent API abuse and flagging, a personal Gemini API Key is now mandatory to access the system.', 
      validateKey: 'VALIDATE & ENTER', 
      portalContent: { 
        aboutText: "CodeFixerX was born from a simple necessity: the modern development landscape is chaotic. With hundreds of languages, frameworks, and updates releasing weekly, developers are drowning in complexity. Aleocrophic Systems, founded by Rayhan Dzaky Al Mubarok under the NyxShade Interactive banner, aims to be the lighthouse in this storm. We bridge the gap between 'it works on my machine' and 'production-ready enterprise code' using state-of-the-art AI.", 
        missionText: "Our mission is not to replace the developer, but to empower them. To give every coder, regardless of experience level, an 'Apex' level assistant that understands security, scalability, and clean architecture.", 
        privacyText: "1. Data Collection: Aleocrophic Systems only collects minimal data required for authentication (via Google Firebase) and prompt processing.\n\n2. AI Processing: Your code snippets are sent ephemerally to Google Gemini APIs for processing. This data is not used to train public models in this instance, adhering to standard enterprise data hygiene.\n\n3. User Rights: You retain full ownership of any code you submit.", 
        termsText: "1. Acceptance: By using CodeFixerX (Lite or Apex), you agree to these terms.\n\n2. Prohibited Use: You strictly agree NOT to use this AI to generate malware, ransomware, exploits, or any code intended to harm systems or violate laws.\n\n3. Liability: Aleocrophic Systems is not liable for any production outages.", 
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
      apiKeyDesc: 'WAJIB. API Key Gemini pribadi Anda. Disimpan secara lokal di perangkat ini.', 
      enterApiFirst: 'Sistem Terkunci. Butuh API Key.', 
      apiGateMsg: 'Untuk mencegah penyalahgunaan API dan flagging, Kunci API Gemini pribadi sekarang wajib untuk mengakses sistem.', 
      validateKey: 'VALIDASI & MASUK', 
      portalContent: { 
        aboutText: "CodeFixerX lahir dari kebutuhan sederhana: lanskap pengembangan modern sangat kacau. Dengan ratusan bahasa dan kerangka kerja yang rilis setiap minggu, pengembang tenggelam dalam kompleksitas. Aleocrophic Systems, didirikan oleh Rayhan Dzaky Al Mubarok di bawah bendera NyxShade Interactive, bertujuan menjadi mercusuar dalam badai ini. Kami menjembatani kesenjangan antara 'kode coba-coba' dan 'kode standar perusahaan' menggunakan AI mutakhir.", 
        missionText: "Misi kami bukan untuk menggantikan pengembang, tetapi untuk memberdayakan mereka. Memberikan setiap pemrogram, tanpa memandang level pengalaman, asisten level 'Apex' yang memahami keamanan, skalabilitas, dan arsitektur bersih.", 
        privacyText: "1. Pengumpulan Data: Aleocrophic Systems hanya mengumpulkan data minimal untuk autentikasi (via Google Firebase) dan pemrosesan prompt.\n\n2. Pemrosesan AI: Kode Anda dikirim sementara ke API Google Gemini untuk diproses. Data ini tidak digunakan untuk melatih model publik.\n\n3. Hak Pengguna: Anda memegang kepemilikan penuh atas kode yang Anda kirim.", 
        termsText: "1. Penerimaan: Dengan menggunakan CodeFixerX, Anda menyetujui ketentuan ini.\n\n2. Penggunaan Terlarang: Anda setuju untuk TIDAK menggunakan AI ini untuk membuat malware, ransomware, eksploitasi, atau kode berbahaya lainnya.\n\n3. Tanggung Jawab: Aleocrophic Systems tidak bertanggung jawab atas gangguan produksi.", 
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
      enterApiFirst: 'システムロック中。APIキーが必要です。', 
      apiGateMsg: 'APIの悪用やフラグ付けを防ぐため、システムへのアクセスには個人のGemini APIキーが必須となりました。', 
      validateKey: '検証して入る', 
      portalContent: { 
        aboutText: "CodeFixerXは、単純な必要性から生まれました。現代の開発環境は混沌としています。Aleocrophic Systemsは、NyxShade Interactiveの旗の下、Rayhan Dzaky Al Mubarokによって設立され、この嵐の中の灯台となることを目指しています。最先端のAIを使用して、「ローカルで動くコード」と「本番環境対応のエンタープライズコード」の間のギャップを埋めます。", 
        missionText: "私たちの使命は、開発者に取って代わることではなく、力を与えることです。経験レベルに関係なく、すべてのプログラマーにセキュリティ、スケーラビリティ、クリーンアーキテクチャを理解する「Apex」レベルのアシスタントを提供します。", 
        privacyText: "1. データ収集：認証（Firebase経由）およびプロンプト処理に必要な最小限のデータのみを収集します。\n\n2. AI処理：コードスニペットは処理のためにGoogle Gemini APIに一時的に送信されます。\n\n3. ユーザーの権利：送信したコードの完全な所有権は保持されます。", 
        termsText: "1. 同意：CodeFixerXを使用することにより、これらの条件に同意したことになります。\n\n2. 禁止事項：マルウェア、ランサムウェア、エクスプロイト、または違法なコードの生成にこのAIを使用しないことに同意します。\n\n3. 責任：Aleocrophic Systemsは、本番環境の停止について責任を負いません。", 
        guideLite: "Liteユーザーは基本的なデバッグとセキュリティスキャンにアクセスできます。学習者や趣味のプログラマーに最適です。", 
        guideApex: "Apexユーザーは、CI/CDパイプライン、レガシーコードの復活、実験的なUI生成など、すべての可能性を解き放ちます。", 
        infraFrontend: "React 18 + Tailwind + Vite。速度のために最適化。", 
        infraBackend: "Google Firebase（認証＆Firestore）。サーバーレスで安全。", 
        infraAI: "Google Gemini 1.5 Pro/Flash。100万トークン以上のコンテキスト。" 
      } 
    }  
  }, 
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
      enterApiFirst: 'النظام مقفل. مطلوب مفتاح API.', 
      apiGateMsg: 'لمنع إساءة استخدام واجهة برمجة التطبيقات والإبلاغ عنها، أصبح مفتاح Gemini API الشخصي إلزاميًا الآن للوصول إلى النظام.', 
      validateKey: 'التحقق والدخول', 
      portalContent: { 
        aboutText: "ولدت CodeFixerX من ضرورة بسيطة: مشهد التطوير الحديث فوضوي. تهدف Aleocrophic Systems، التي أسسها ريحان زكي المبارك تحت راية NyxShade Interactive، إلى أن تكون المنارة في هذه العاصفة. نحن نسد الفجوة بين الكود التجريبي والكود الجاهز للإنتاج باستخدام الذكاء الاصطناعي المتطور.", 
        missionText: "مهمتنا ليست استبدال المطور، بل تمكينه. لمنح كل مبرمج، بغض النظر عن مستوى الخبرة، مساعدًا بمستوى 'Apex' يفهم الأمن وقابلية التوسع والهندسة النظيفة.", 
        privacyText: "1. جمع البيانات: نجمع الحد الأدنى من البيانات للمصادقة.\n\n2. معالجة الذكاء الاصطناعي: يتم إرسال مقتطفات التعليمات البرمجية الخاصة بك بشكل مؤقت إلى واجهات برمجة تطبيقات Google Gemini.\n\n3. حقوق المستخدم: أنت تحتفظ بالملكية الكاملة لأي رمز ترسله.", 
        termsText: "1. القبول: باستخدام هذا، فإنك توافق على الشروط.\n\n2. الاستخدام المحظور: لا يجوز لك إنشاء برامج ضارة أو فيروسات فدية.\n\n3. المسؤولية: نحن لسنا مسؤولين عن انقطاع الإنتاج.", 
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
      enterApiFirst: 'Система заблокирована. Требуется API-ключ.', 
      apiGateMsg: 'Чтобы предотвратить злоупотребление API и блокировку, для доступа к системе теперь требуется личный ключ API Gemini.', 
      validateKey: 'ПРОВЕРИТЬ И ВОЙТИ', 
      portalContent: { 
        aboutText: "CodeFixerX родился из простой необходимости: современный ландшафт разработки хаотичен. Aleocrophic Systems, основанная Райханом Дзаки Аль Мубароком под знаменем NyxShade Interactive, стремится стать маяком в этом шторме. Мы устраняем разрыв между 'работает на моей машине' и 'готовым к производству корпоративным кодом' с помощью передового ИИ.", 
        missionText: "Наша миссия — не заменить разработчика, а расширить его возможности. Предоставить каждому программисту, независимо от опыта, помощника уровня 'Apex', который понимает безопасность и масштабируемость.", 
        privacyText: "1. Сбор данных: Мы собираем минимум данных для аутентификации.\n\n2. Обработка ИИ: Ваши фрагменты кода временно отправляются в API Google Gemini.\n\n3. Права пользователя: Вы сохраняете полное право собственности на свой код.", 
        termsText: "1. Принятие: Используя это, вы соглашаетесь с условиями.\n\n2. Запрещенное использование: Не создавать вредоносное ПО.\n\n3. Ответственность: Мы не несем ответственности за сбои.", 
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
      enterApiFirst: 'System gesperrt. API-Schlüssel erforderlich.', 
      apiGateMsg: 'Um API-Missbrauch und Sperrungen zu verhindern, ist jetzt ein persönlicher Gemini API-Schlüssel erforderlich, um auf das System zuzugreifen.', 
      validateKey: 'VALIDIEREN & EINTRETEN', 
      portalContent: { 
        aboutText: "CodeFixerX entstand aus einer einfachen Notwendigkeit: Die moderne Entwicklungslandschaft ist chaotisch. Aleocrophic Systems, gegründet von Rayhan Dzaky Al Mubarok unter dem Banner von NyxShade Interactive, will der Leuchtturm in diesem Sturm sein.", 
        missionText: "Unsere Mission ist es nicht, den Entwickler zu ersetzen, sondern ihn zu befähigen. Jedem Programmierer einen Assistenten auf 'Apex'-Niveau zu geben.", 
        privacyText: "1. Datenerfassung: Minimal für Auth.\n\n2. KI-Verarbeitung: Code temporär an Google Gemini API gesendet.\n\n3. Benutzerrechte: Sie besitzen Ihren Code.", 
        termsText: "1. Akzeptanz: Zustimmung zu den Bedingungen.\n\n2. Verbotene Nutzung: Keine Malware erstellen.\n\n3. Haftung: Keine Haftung für Ausfälle.", 
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
      enterApiFirst: 'Sistema Bloqueado. Clave API Requerida.', 
      apiGateMsg: 'Para evitar el abuso de la API y las banderas, ahora es obligatorio una clave de API personal de Gemini para acceder al sistema.', 
      validateKey: 'VALIDAR Y ENTRAR', 
      portalContent: { 
        aboutText: "CodeFixerX nació de una necesidad simple: el panorama de desarrollo moderno es caótico. Aleocrophic Systems, fundada por Rayhan Dzaky Al Mubarok bajo la bandera de NyxShade Interactive, aspira a ser el faro en esta tormenta.", 
        missionText: "Nuestra misión no es reemplazar al desarrollador, sino empoderarlo. Darle a cada programador un asistente de nivel 'Apex'.", 
        privacyText: "1. Recopilación de datos: Mínimo para autenticación.\n\n2. Procesamiento de IA: Código enviado temporalmente a la API de Google Gemini.\n\n3. Derechos del usuario: Usted posee su código.", 
        termsText: "1. Aceptación: Acepta los términos.\n\n2. Uso prohibido: No crear malware.\n\n3. Responsabilidad: Sin responsabilidad por interrupciones.", 
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
  { id: 'debug', name: 'Omni Debugger', icon: <Code />, premium: false, desc: 'Fix syntax/logic errors.', systemPrompt: "You are the Omni Code Debugger. Analyze the provided code for syntax errors, logical flaws, memory leaks, and runtime issues. Return the fixed code with comments explaining the corrections. Focus on correctness and stability." }, 
  { id: 'dep', name: 'Dependency Scanner', icon: <Search />, premium: false, desc: 'Analyze libs & vulnerabilities.', systemPrompt: "You are the Dependency Scanner. Analyze the imports and dependencies in the code. Identify deprecated packages, security risks, or heavy libraries that could be optimized. Suggest lighter or more secure alternatives." }, 
  { id: 'sec', name: 'Security Auditor', icon: <Shield />, premium: false, desc: 'Fix SQLi, XSS, RCE.', systemPrompt: "You are the Cybersecurity Auditor. Conduct a deep security scan on the code. Look for SQL Injection, XSS, CSRF, RCE, weak cryptography, and hardcoded secrets. Provide a secure refactored version and explain the vulnerabilities found." }, 
  { id: 'perf', name: 'Optimizer', icon: <Zap />, premium: false, desc: 'Boost speed & scalability.', systemPrompt: "You are the Performance Optimizer. Refactor the code to improve execution speed, reduce memory usage, and enhance scalability. Look for O(n^2) loops, redundant computations, and unoptimized queries. Provide the optimized code." }, 
  { id: 'explain', name: 'Code Explainer', icon: <FileCode />, premium: false, desc: 'Deep explanations.', systemPrompt: "You are the Interactive Code Explainer. Break down the provided code into simple, digestible parts. Explain the logic flow, variable purposes, and algorithmic approach. Use analogies where appropriate. Do not just rewrite the code, explain *why* it works." }, 
  { id: 'pair', name: 'Pair Programmer', icon: <User />, premium: false, desc: 'Real-time collab.', systemPrompt: "You are an AI Pair Programmer. Act as a senior developer colleague. Suggest completions, refactorings, or alternative approaches to the user's current code snippet. Maintain a collaborative and helpful tone." }, 
   
  // --- APEX EXCLUSIVE (Indices 6-11) --- 
  { id: 'legacy', name: 'Legacy Resurrection', icon: <History />, premium: true, desc: 'Modernize old stacks.', systemPrompt: "You are the Legacy Code Resurrection Engine. Your task is to modernize outdated code (e.g., COBOL, old PHP, jQuery, VB6) into modern standards (e.g., React, Go, Rust, Python 3.10+). Preserve business logic but upgrade the syntax, libraries, and security practices." }, 
  { id: 'cicd', name: 'CI/CD Integrator', icon: <Cpu />, premium: true, desc: 'Pipeline automation.', systemPrompt: "You are the CI/CD Integrator. Generate robust pipeline configurations (GitHub Actions YAML, GitLab CI, Jenkinsfile, Dockerfile) for the provided code. Ensure automated testing, linting, security scanning, and deployment steps are included." }, 
  { id: 'custom', name: 'Custom Commander', icon: <Terminal />, premium: true, desc: 'Execute commands.', systemPrompt: "You are the Custom Command Executor. Follow the specific instructions provided by the user regarding the code. You are versatile and adaptable. If the user asks for a specific refactor pattern (e.g., SOLID, DRY, KISS), apply it rigorously." }, 
  { id: 'sim', name: 'Adv. Simulation', icon: <Play />, premium: true, desc: 'Sandbox run.', systemPrompt: "You are the Advanced Simulation Environment. Simulate the execution of the provided code. Predict the output for various edge cases. If it's UI code, describe the visual result. If it's logic, trace the variable states. Find logic bugs that static analysis might miss." }, 
  { id: 'docs', name: 'Dynamic Docs', icon: <FileText />, premium: true, desc: 'Auto documentation.', systemPrompt: "You are the Dynamic Documentation Generator. Create comprehensive documentation for the code, including JSDoc/Docstrings, API endpoint definitions (Swagger/OpenAPI), and usage examples. Make it professional and ready for a README.md." }, 
  { id: 'exp', name: 'Experimental UI', icon: <Sparkles />, premium: true, desc: 'UI Auto-Design.', systemPrompt: "You are the Experimental UI Generator. Generate stunning, modern, and responsive web interfaces using React, Tailwind CSS, and Lucide React icons. IMPORTANT: Provide the FULL code in a single file. Ensure it is visually impressive (Glassmorphism, Neobrutalism, or Minimalist)." }, 
]; 
 
const AI_MODELS = [ 
  { id: 'gemini-2.5-flash-preview-09-2025', name: 'Gemini 2.5 Flash', desc: 'Latest' }, 
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Reasoning' }, 
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Speed' }, 
]; 
 
const APEX_MANIFESTO = "You are CodeFixerX Apex Edition. Infinite Context. Deep Scan Active."; 
const LITE_MANIFESTO = "You are CodeFixerX Lite. Efficient Debugging."; 
 
// --- 3. UTILITY COMPONENTS --- 
 
// FIX: Robust Syntax Highlighter (Safe Tokenization Method) 
const highlightSyntax = (code) => { 
  if (!code) return ''; 
   
  // 1. Escape HTML entities first to prevent XSS and interference 
  let safeCode = code 
    .replace(/&/g, "&amp;") 
    .replace(/</g, "&lt;") 
    .replace(/>/g, "&gt;"); 
 
  // Store placeholders 
  const placeholders = []; 
  const addPlaceholder = (content, type) => { 
    placeholders.push({ content, type }); 
    return `%%%PH_${placeholders.length - 1}%%%`; 
  }; 
 
  // 2. Tokenize Strings & Comments FIRST (Protection Layer) 
  safeCode = safeCode 
    .replace(/(".*?"|'.*?'|`.*?`)/g, match => addPlaceholder(match, 'string')) // Strings 
    .replace(/(\/\/.*$)/gm, match => addPlaceholder(match, 'comment'))          // Single line comments 
    .replace(/(\/\*[\s\S]*?\*\/)/g, match => addPlaceholder(match, 'comment')); // Multi line comments 
 
  // 3. Highlight Keywords (Now safe from strings/comments) 
  // Removed aggressive number regex that matched Tailwind classes like '400' 
  const keywords = "\\b(const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await|try|catch|switch|case|new|this|typeof|interface|type|extends|implements|public|private|protected|static|readonly|constructor|def|print|class|self|init)\\b"; 
   
  safeCode = safeCode 
    .replace(new RegExp(keywords, 'g'), match => addPlaceholder(match, 'keyword')); 
   
  // 4. Highlight Function Calls 
  safeCode = safeCode.replace(/(\w+)(?=\()/g, match => addPlaceholder(match, 'function')); 
 
  // 5. Restore Placeholders with HTML Spans 
  // We do this at the end so regex never runs on HTML tags 
  return safeCode.replace(/%%%PH_(\d+)%%%/g, (_, index) => { 
    const item = placeholders[parseInt(index)]; 
    if (item.type === 'string') return `<span class="text-emerald-400">${item.content}</span>`; 
    if (item.type === 'comment') return `<span class="text-slate-500 italic">${item.content}</span>`; 
    if (item.type === 'keyword') return `<span class="text-pink-400 font-semibold">${item.content}</span>`; 
    if (item.type === 'function') return `<span class="text-cyan-400">${item.content}</span>`; 
    return item.content; 
  }); 
}; 
 
// Updated Markdown Renderer 
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
 
const CodeBlock = ({ lang, code, copyLabel, copiedLabel }) => { 
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
  const [user, setUser] = useState(null); 
  const [view, setView] = useState('apikey_gate'); 
  const [langCode, setLangCode] = useState('en'); 
  const [isPremium, setIsPremium] = useState(false); 
  const [currentModule, setCurrentModule] = useState(MODULES[0]); 
  const [aiModel, setAiModel] = useState(AI_MODELS[0].id); 
  const [apiStatus, setApiStatus] = useState('idle'); 
   
  const [isAuthChecking, setIsAuthChecking] = useState(true); 
  const [isDevMode, setIsDevMode] = useState(false); 
  const [devPin, setDevPin] = useState(''); 
 
  const [inputCode, setInputCode] = useState(''); 
  const [outputResult, setOutputResult] = useState(''); 
  const [isInputMinimized, setIsInputMinimized] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [history, setHistory] = useState([]); 
   
  // CHAT STATE 
  const [chatMessages, setChatMessages] = useState([]); 
  const [chatInput, setChatInput] = useState(''); 
  const [chatLoading, setChatLoading] = useState(false); 
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false); 
  const chatInputRef = useRef(null); 
 
  const [sidebarOpen, setSidebarOpen] = useState(false);  
  const [premiumKey, setPremiumKey] = useState(''); 
  const [customApiKey, setCustomApiKey] = useState(''); 
  const [gateApiKey, setGateApiKey] = useState(''); 
  const [loginApiKey, setLoginApiKey] = useState('');  
  const [notif, setNotif] = useState(null); 
  const [portalTab, setPortalTab] = useState('about');  
  const [generatedApiKey, setGeneratedApiKey] = useState("GUEST"); 
  const [hoshinoImgError, setHoshinoImgError] = useState(false); 
 
  // NEW: History Sidebar Toggle State 
  const [historySidebarOpen, setHistorySidebarOpen] = useState(true); 
 
  // SAFE TRANSLATION HELPERS 
  const getLangObj = () => LANGUAGES[langCode] || LANGUAGES['en']; 
   
  const tText = (key) => { 
     const lang = getLangObj(); 
     return lang.ui[key] || key; 
  }; 
 
  const tData = (key) => { 
    const lang = getLangObj(); 
    return lang.ui?.portalContent?.[key] || key; 
  } 
   
  const notify = (msg, type = 'info') => { setNotif({msg, type}); setTimeout(() => setNotif(null), 3000); }; 
 
  useEffect(() => { 
    const savedLang = localStorage.getItem('cfx_lang'); 
    const savedKey = localStorage.getItem('cfx_api_key'); 
    const savedModel = localStorage.getItem('cfx_ai_model'); 
    const savedPremium = localStorage.getItem('cfx_is_premium');  
 
    if (savedLang && LANGUAGES[savedLang]) setLangCode(savedLang); 
     
    if (savedKey && savedKey.trim().length > 10) { 
        setCustomApiKey(savedKey); 
    } else { 
        setView('apikey_gate'); 
    } 
 
    if (savedModel) setAiModel(savedModel); 
    if (savedPremium === 'true') setIsPremium(true); 
     
    // Default close history on mobile 
    const handleResize = () => { 
         if (window.innerWidth < 1024) { 
             setSidebarOpen(false); 
             setHistorySidebarOpen(false); 
         } else { 
             setSidebarOpen(true); 
             setHistorySidebarOpen(true); 
         } 
    }; 
    handleResize(); window.addEventListener('resize', handleResize); 
 
    const unsub = onAuthStateChanged(auth, async (u) => {  
      setUser(u);  
      const currentKey = localStorage.getItem('cfx_api_key'); 
      if (!currentKey || currentKey.trim() === "") { 
          setView('apikey_gate'); 
          setIsAuthChecking(false); 
          return; 
      } 
 
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
            if (data.isPremium) { 
                setIsPremium(true); 
                localStorage.setItem('cfx_is_premium', 'true'); 
            } 
            if (data.aiModel) setAiModel(data.aiModel); 
          } 
        } catch (e) {} 
      } else { 
        if (!isDevMode) {  
            if(localStorage.getItem('cfx_is_premium') !== 'true') { 
               setIsPremium(false); 
            } 
            setGeneratedApiKey("GUEST");  
             if(view === 'dashboard') setView('language'); 
        } 
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
      fetched.sort((a, b) => { 
        const timeA = a.createdAt?.seconds || 0; 
        const timeB = b.createdAt?.seconds || 0; 
        return timeB - timeA; 
      }); 
      setHistory(fetched); 
    }, (error) => { 
        console.error("Firestore History Error:", error); 
    }); 
    return () => unsub(); 
  }, [user, view]);  
 
  const handleGateSubmit = () => { 
      if (!gateApiKey.trim() || gateApiKey.length < 10) { 
          notify("Invalid API Key Format", "error"); 
          return; 
      } 
      localStorage.setItem('cfx_api_key', gateApiKey.trim()); 
      setCustomApiKey(gateApiKey.trim()); 
      notify("Security Check Passed! 🛡️", "success"); 
      setView('language'); 
  }; 
 
  const handleLogin = async () => { 
    try {  
      const provider = new GoogleAuthProvider(); 
      await signInWithPopup(auth, provider);  
      notify("Identity Verified! 🌸", "success");  
    } catch (e) {  
      console.error("Popup Auth Error:", e); 
      if (e.code === 'auth/unauthorized-domain' || e.code === 'auth/popup-blocked') { 
         notify(`Domain Blocked. Fallback to Anonymous.`, "warning"); 
         try { await signInAnonymously(auth); notify("Logged in Anonymously.", "success"); }  
         catch (anonErr) { notify("Critical Auth Failure.", "error"); } 
      } else { notify("Login Failed: " + e.message, "error"); } 
    } 
  }; 
 
  const handleGuestAccess = () => { 
      setView('dashboard'); 
  } 
 
  const changeAiModel = async (modelId) => { 
    setAiModel(modelId); localStorage.setItem('cfx_ai_model', modelId); 
    if(user) { try { await setDoc(doc(db, 'users', user.uid), { aiModel: modelId }, { merge: true }); } catch(e) {} } 
    notify(`Neural Engine Switched: ${AI_MODELS.find(m => m.id === modelId)?.name}`, 'success'); 
  } 
 
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
 
  const handleKeyFileUpload = (e) => { 
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
    const apiKeyToUse = customApiKey; 
    if (!apiKeyToUse) { 
        notify("CRITICAL: API Key Missing. Security Protocol Engaged.", "error"); 
        setView('apikey_gate'); 
        return; 
    } 
 
    if (!inputCode.trim()) return notify("Input Empty 😅", "warning"); 
    if (currentModule.premium && !isPremium) return notify("Locked! 🔒 Upgrade to Apex.", "error"); 
 
    setLoading(true); setApiStatus('loading'); setOutputResult(''); setIsInputMinimized(false); 
 
    const baseManifesto = isPremium ? APEX_MANIFESTO : LITE_MANIFESTO; 
    const lang = getLangObj(); 
    const systemInstruction = `${baseManifesto} LANGUAGE: Reply strictly in ${lang.label} (${lang.flag}). MODULE: ${currentModule.name}. ${currentModule.systemPrompt}. USER TONE: Stylish, Expressive, minimal 3 emojis. OUTPUT: Markdown with explicit code blocks. NO PREVIEW/IFRAME CODE.`; 
 
    try { 
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKeyToUse}`, { 
        method: 'POST', headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ contents: [{ parts: [{ text: inputCode }] }], systemInstruction: { parts: [{ text: systemInstruction }] } }) 
      }); 
       
      if (resp.status === 403) { 
          setApiStatus('error'); 
          throw new Error("API KEY INVALID OR EXPIRED"); 
      } 
 
      const data = await resp.json(); 
      if (data.error) throw new Error(data.error.message); 
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error."; 
      setOutputResult(text); setIsInputMinimized(true); setApiStatus('success'); 
 
      if (user && !isDevMode) await addDoc(collection(db, 'history'), {  
        userId: user.uid,  
        codeSnippet: inputCode.substring(0,50),  
        module: currentModule.name,  
        response: text,  
        type: 'code', 
        createdAt: serverTimestamp()  
      }); 
 
    } catch (e) {  
        notify(`AI Error: ${e.message}`, "error");  
        setApiStatus('error'); 
        if (e.message.includes("API KEY")) setView('apikey_gate'); 
    } finally { setLoading(false); } 
  }; 
 
  const handleChatSend = async () => { 
    const apiKeyToUse = customApiKey; 
    if (!apiKeyToUse) { 
        notify("CRITICAL: API Key Missing.", "error"); 
        setView('apikey_gate'); 
        return; 
    } 
 
    if(!chatInput.trim()) return; 
    const newMessage = { role: 'user', text: chatInput }; 
    setChatMessages([...chatMessages, newMessage]); 
    setChatInput(''); 
    setChatLoading(true); setApiStatus('loading'); 
    
    if(chatInputRef.current) { 
        chatInputRef.current.style.height = 'auto'; 
    } 
 
    const lang = getLangObj(); 
 
    try { 
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKeyToUse}`, { 
        method: 'POST', headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ contents: [{ parts: [{ text: chatInput }] }], systemInstruction: { parts: [{ text: `You are CodeFixerX. Reply in ${lang.label} (${lang.flag}). Be stylish, expressive, and helpful. Use emojis.` }] } }) 
      }); 
       
      if (resp.status === 403) { 
          setApiStatus('error'); 
          throw new Error("API KEY INVALID"); 
      } 
 
      const data = await resp.json(); 
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error."; 
      setChatMessages(prev => [...prev, { role: 'ai', text: text }]); setApiStatus('success'); 
       
      if (user && !isDevMode) await addDoc(collection(db, 'history'), {  
        userId: user.uid,  
        codeSnippet: chatInput.substring(0,50),  
        module: 'Free Chat',  
        response: text,  
        type: 'chat',  
        createdAt: serverTimestamp()  
      }); 
 
    } catch(e) {  
        notify("Chat Error: " + e.message, "error");  
        setApiStatus('error'); 
        if (e.message.includes("API KEY")) setView('apikey_gate'); 
    } finally { setChatLoading(false); } 
  }; 
 
  const copyChat = (text) => { 
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
    setApiStatus('idle'); 
  } 
 
  const handleChatInputKeyDown = (e) => { 
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleChatSend(); 
    } 
  }; 
 
  if (isAuthChecking) return (<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4"><div className="relative mb-8"><div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full animate-pulse"></div><Cpu size={64} className="text-cyan-400 relative z-10 animate-bounce"/></div><h2 className="text-2xl font-bold text-white mb-2 tracking-wider">INITIALIZING NEURAL LINK</h2></div>); 
 
  if (view === 'apikey_gate') return ( 
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"> 
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80')] bg-cover opacity-10 blur-sm"></div> 
       <div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-red-500/50 max-w-md w-full text-center shadow-2xl relative animate-fadeIn"> 
         <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-red-500/50 animate-pulse"><Shield size={40} className="text-red-500"/></div> 
         <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">SECURITY GATE</h2> 
         <p className="text-slate-400 text-sm mb-6">{tText('apiGateMsg') || 'Mandatory API Key Required to prevent flagging.'}</p> 
         <div className="mb-6 text-left relative"> 
            <label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-1 block flex items-center gap-1"><Key size={10}/> {tText('customKey')}</label> 
            <div className="flex gap-2"> 
                <input type="password" value={gateApiKey} onChange={(e) => setGateApiKey(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 text-white text-sm p-3 rounded-xl outline-none focus:border-red-500 transition-colors" placeholder="AIzaSy..."/> 
            </div> 
            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1"><Lock size={10}/> Stored strictly locally on your device (localStorage).</p> 
         </div> 
         <button onClick={handleGateSubmit} className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl flex justify-center gap-2 transition shadow-lg shadow-red-900/50"> 
            <Fingerprint size={20}/> {tText('validateKey') || 'VALIDATE & ENTER'} 
         </button> 
         <div className="mt-4 text-center"> 
             <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-cyan-500 hover:text-cyan-400 font-bold flex items-center justify-center gap-1 hover:underline"><ExternalLink size={10}/> Get Free Gemini API Key</a> 
         </div> 
       </div> 
    </div> 
  ); 
 
  if (view === 'language') return (<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80')] bg-cover opacity-10 animate-pulse"></div><div className="z-10 max-w-5xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl text-center"><h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">CodeFixerX</h1><p className="text-slate-400 text-sm tracking-[0.3em] uppercase mb-12">Aleocrophic Systems</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Object.entries(LANGUAGES).map(([code, data]) => (<button key={code} onClick={() => { setLangCode(code); setView('login'); }} className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-2xl transition-all group flex flex-col items-center"><span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{data.flag}</span><span className="text-slate-300 font-bold group-hover:text-white">{data.label}</span></button>))}</div></div></div>); 
 
  if (view === 'login') return ( 
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"> 
       <button onClick={() => setView('language')} className="absolute top-6 left-6 text-slate-400 hover:text-white flex gap-2 z-20"><ChevronRight className="rotate-180"/> Back</button> 
       <div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-slate-700 max-w-sm w-full text-center shadow-2xl relative"> 
         <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><Cpu size={40} className="text-cyan-400"/></div> 
         <h2 className="text-2xl font-bold text-white mb-2">{tText('login')}</h2> 
         <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg mb-4 text-xs text-emerald-300 flex items-center gap-2"><CheckCircle size={14}/> API Key Secured & Ready.</div> 
         <button onClick={handleLogin} className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl flex justify-center gap-2 hover:bg-slate-200 transition mb-3"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G"/> Google Auth</button> 
         <button onClick={handleGuestAccess} className="w-full py-3 bg-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition">{tText('saveEnter')}</button> 
       </div> 
    </div> 
  ); 
 
  return ( 
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30"> 
      {notif && <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg border animate-bounce ${notif.type==='success'?'bg-emerald-500/20 border-emerald-500 text-emerald-300':'bg-red-500/20 border-red-500 text-red-300'}`}>{notif.msg}</div>} 
 
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={()=>setSidebarOpen(false)}></div>} 
 
      <aside className={` 
          fixed inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur border-r border-slate-800 flex flex-col transition-all duration-300 w-72 
          ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
          md:relative md:translate-x-0 md:shadow-none 
        `}> 
         <div className="p-6 border-b border-slate-800 flex justify-between items-center"> 
            <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${isPremium ? 'bg-amber-500' : 'bg-cyan-600'}`}>{isPremium ? <Sparkles className="text-white"/> : <Code className="text-white"/>}</div><div><h2 className="font-bold leading-none tracking-tight">CodeFixerX</h2><span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{isPremium ? 'Apex' : 'Lite'}</span></div></div> 
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"><X/></button> 
         </div> 
         <div className="px-4 pt-4 flex gap-2 border-b border-slate-800 pb-4"><button onClick={() => setView('dashboard')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${view==='dashboard'?'bg-slate-800 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}>{tText('dashboard')}</button><button onClick={() => setView('settings')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${view==='settings'?'bg-slate-800 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}><Settings size={12} className="inline mb-0.5"/> {tText('settings')}</button></div> 
         <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar"> 
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-2">{tText('modules')}</div> 
           {MODULES.map((m) => { 
             const isLocked = m.premium && !isPremium; 
             return (<button key={m.id} onClick={() => { if(!isLocked){setCurrentModule(m); setView('dashboard'); if(window.innerWidth < 768) setSidebarOpen(false);} else notify("Locked 🔒 Upgrade!", "error"); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition text-left ${currentModule.id===m.id && view==='dashboard' ? (isPremium?'bg-amber-500/20 text-amber-300 border border-amber-500/20':'bg-cyan-500/20 text-cyan-300 border border-cyan-500/20') : 'text-slate-400 hover:bg-slate-800'} ${isLocked ? 'opacity-50 cursor-not-allowed':''}`}><div className={`${isLocked ? 'text-slate-600' : (m.premium ? 'text-amber-400' : 'text-cyan-400')}`}>{m.icon}</div><span className="flex-1 truncate text-xs font-medium">{m.name}</span>{isLocked && <Lock size={12} className="text-slate-600"/>}</button>); 
           })} 
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-6">{tText('tools')}</div> 
           <button onClick={() => {setView('chat'); if(window.innerWidth < 768) setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${view==='chat' ? (isPremium ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:bg-slate-800') : 'text-slate-400 hover:bg-slate-800'}`}><MessageSquare size={16} className={isPremium?"text-purple-400":""}/> {tText('chat')} (Apex) {!isPremium && <Lock size={12}/>}</button> 
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-6">{tText('system')}</div> 
           <button onClick={() => {setView('portal'); if(window.innerWidth < 768) setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-400 hover:bg-slate-800 transition ${view==='portal'?'bg-indigo-500/20 text-indigo-300':''}`}><BookOpen size={16}/> {tText('portalLabel')}</button> 
         </div> 
         <div className="p-4 border-t border-slate-800 bg-slate-900"> 
            {!isPremium && <button onClick={() => (user || isDevMode) ? setView('premium') : setView('login')} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded-lg transition shadow-lg shadow-amber-500/20 mb-2 flex items-center justify-center gap-2"><Unlock size={12}/> {tText('upgrade')}</button>} 
            {user || isDevMode ? (<div className="flex items-center gap-3 px-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isDevMode ? 'bg-red-900 border-red-500 text-red-200' : 'bg-cyan-900 border-cyan-700 text-cyan-200'}`}>{isDevMode ? 'DEV' : user.email[0].toUpperCase()}</div><div className="flex-1 overflow-hidden"><div className="text-xs font-bold truncate">{isDevMode ? 'Developer' : user.displayName}</div><div className="text-[10px] text-slate-500">{isDevMode ? 'System Root' : 'Online'}</div></div><button onClick={() => signOut(auth)}><LogOut size={16} className="text-slate-500 hover:text-red-400"/></button></div>) : (<button onClick={() => setView('login')} className="w-full flex justify-center gap-2 bg-slate-800 py-3 rounded-xl text-sm font-bold hover:bg-slate-700 border border-slate-700"><LogIn size={16}/> {tText('login')}</button>)} 
         </div> 
      </aside> 
 
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950"> 
         
         <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/90 backdrop-blur sticky top-0 z-30 shadow-md shrink-0"> 
            <div className="flex items-center gap-4"> 
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-400 hover:text-white transition-colors mr-2 p-2 bg-slate-800/50 rounded-lg"><Menu/></button> 
               <div className="flex items-center gap-2 text-slate-400 text-sm overflow-hidden whitespace-nowrap"><LayoutDashboard size={16} className="shrink-0"/> <ChevronRight size={14} className="shrink-0"/> <span className={`truncate ${isPremium ? "text-amber-400 font-bold" : "text-cyan-400 font-bold"}`}>{view === 'portal' ? tText('portalLabel') : view === 'premium' ? tText('upgrade') : view === 'settings' ? tText('settings') : view === 'chat' ? tText('chat') : currentModule.name}</span></div> 
            </div> 
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono"> 
               <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800"> 
                  {apiStatus === 'loading' ? <RefreshCw size={12} className="animate-spin text-cyan-500"/> : apiStatus === 'error' ? <WifiOff size={12} className="text-red-500"/> : <Wifi size={12} className="text-emerald-500"/>} 
                  <span className={`hidden sm:inline font-bold ${apiStatus==='error'?'text-red-400':apiStatus==='loading'?'text-cyan-400':'text-emerald-400'}`}>{apiStatus === 'loading' ? 'SYNC...' : apiStatus === 'error' ? 'OFFLINE' : 'ONLINE'}</span> 
               </div> 
 
               <div className="hidden md:flex items-center gap-2 text-slate-500"><span className={`w-2 h-2 rounded-full ${isPremium ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span> ACTIVE</div> 
               {view !== 'settings' && view !== 'premium' && <button onClick={handleNewSession} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1.5 rounded text-cyan-400 transition cursor-pointer"><RefreshCw size={12}/> <span className="hidden sm:inline">{tText('newChat')}</span></button>} 
               {/* NEW: Toggle History Button (NOW WORKS ON CHAT & DASHBOARD) */} 
               {(view === 'dashboard' || view === 'chat') && ( 
                 <button  
                   onClick={() => view === 'dashboard' ? setHistorySidebarOpen(!historySidebarOpen) : setChatHistoryOpen(!chatHistoryOpen)}  
                   className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1.5 rounded text-slate-400 hover:text-white transition cursor-pointer"  
                   title="Toggle History Sidebar" 
                 > 
                   <Sidebar size={14}/> <span className="hidden sm:inline">HISTORY</span> 
                 </button> 
               )} 
            </div> 
         </header> 
 
         <main className="flex-1 overflow-y-auto custom-scrollbar relative"> 
            
            {view === 'dashboard' && ( 
                <div className="p-4 flex flex-col lg:flex-row gap-6 min-h-full"> 
                   <div className="flex-1 flex flex-col gap-4"> 
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
                    
                   {/* HISTORY SIDEBAR (TOGGLEABLE) */} 
                   {historySidebarOpen && ( 
                    <div className="fixed inset-0 lg:static lg:inset-auto z-50 flex justify-end lg:block"> 
                        <div className="absolute inset-0 bg-black/60 lg:hidden backdrop-blur-sm" onClick={() => setHistorySidebarOpen(false)}></div> 
                        <div className="w-72 lg:w-64 bg-slate-900 rounded-l-2xl lg:rounded-2xl border-l lg:border border-slate-800 flex flex-col overflow-hidden shrink-0 h-full shadow-2xl lg:shadow-lg relative z-10 animate-fadeInRight"> 
                          <div className="p-4 border-b border-slate-800 flex items-center justify-between"> 
                              <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><History size={14}/> {tText('history')}</span> 
                              <button onClick={() => setHistorySidebarOpen(false)} className="lg:hidden text-slate-400"><X size={14}/></button> 
                          </div> 
                          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar"> 
                            {!user && !isDevMode ? <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs p-4 text-center"><Lock size={20} className="mb-2"/><p>Guest Mode.</p></div> : history.length === 0 ? <div className="text-center text-slate-600 text-xs mt-4">No logs yet.</div> :  
                              history.map(h => ( 
                                <div key={h.id} onClick={() => {setInputCode(h.codeSnippet); setOutputResult(h.response); setIsInputMinimized(true); if(window.innerWidth < 1024) setHistorySidebarOpen(false); }} className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 hover:bg-slate-800 cursor-pointer transition group"> 
                                  <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-cyan-500 uppercase truncate">{h.module}</span></div> 
                                  <div className="text-xs text-slate-400 truncate font-mono">{h.codeSnippet}</div> 
                                </div> 
                              )) 
                            } 
                          </div> 
                        </div> 
                    </div> 
                   )} 
                </div> 
            )} 
 
            {/* VIEW: CHAT */} 
            {view === 'chat' && ( 
               isPremium ? ( 
                 <div className="p-4 flex flex-col lg:flex-row gap-6 h-full"> 
                   <div className="flex-1 flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden shadow-xl"> 
                     <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-4"> 
                       {chatMessages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-600"><MessageSquare size={48} className="mb-4 opacity-20"/><p>{tText('chatStart')}</p></div>} 
                       {chatMessages.map((msg, idx) => ( 
                         <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}> 
                           <div className={`max-w-[90%] md:max-w-[85%] p-4 rounded-2xl relative ${msg.role === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}> 
                             <MarkdownRenderer content={msg.text} copyLabel={tText('copy')} copiedLabel={tText('copied')} /> 
                             <div className={`absolute -bottom-6 ${msg.role === 'user' ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition flex gap-2`}> 
                               <button onClick={() => copyChat(msg.text)} className="p-1 bg-slate-800 rounded border border-slate-700 text-slate-400 hover:text-white" title={tText('copy')}><Clipboard size={12}/></button> 
                             </div> 
                           </div> 
                         </div> 
                       ))} 
                       {chatLoading && <div className="flex justify-start"><div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700"><div className="flex gap-1"><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div></div></div></div>} 
                     </div> 
                     <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2 items-end"> 
                       <textarea  
                         ref={chatInputRef} 
                         value={chatInput}  
                         onChange={(e)=> { 
                            setChatInput(e.target.value); 
                            e.target.style.height = 'auto'; 
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`; 
                         }}  
                         onKeyDown={handleChatInputKeyDown}  
                         placeholder={tText('chatPlaceholder')}  
                         rows={1} 
                         className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-cyan-500 outline-none resize-none overflow-y-auto min-h-[50px] custom-scrollbar" 
                       /> 
                       <button onClick={handleChatSend} className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl mb-0.5"><Send size={20}/></button> 
                     </div> 
                   </div> 
                    
                   {/* CHAT HISTORY SIDEBAR */} 
                   {chatHistoryOpen && ( 
                    <div className="fixed inset-0 lg:static lg:inset-auto z-50 flex justify-end lg:block"> 
                       <div className="absolute inset-0 bg-black/60 lg:hidden backdrop-blur-sm" onClick={() => setChatHistoryOpen(false)}></div> 
                       <div className="w-72 lg:w-64 bg-slate-900 rounded-l-2xl lg:rounded-2xl border-l lg:border border-slate-800 flex flex-col overflow-hidden shrink-0 h-full shadow-2xl lg:shadow-lg relative z-10 animate-fadeInRight"> 
                            <div className="p-4 border-b border-slate-800 flex items-center justify-between"> 
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><History size={14}/> {tText('history')}</span> 
                                <button onClick={() => setChatHistoryOpen(false)} className="lg:hidden text-slate-400"><X size={14}/></button> 
                            </div> 
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar"> 
                              {!user && !isDevMode ? <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs p-4 text-center"><Lock size={20} className="mb-2"/><p>Guest Mode.</p></div> : history.filter(h => h.type === 'chat').length === 0 ? <div className="text-center text-slate-600 text-xs mt-4">No chats.</div> :  
                                history.filter(h => h.type === 'chat').map(h => ( 
                                  <div key={h.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 hover:bg-slate-800 cursor-pointer transition group" 
                                      onClick={() => { 
                                          setChatMessages([ 
                                              { role: 'user', text: h.codeSnippet }, 
                                              { role: 'ai', text: h.response } 
                                          ]); 
                                          notify("Chat Session Loaded", "success"); 
                                          if(window.innerWidth < 768) setChatHistoryOpen(false); 
                                      }}> 
                                    <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-purple-400 uppercase truncate">CHAT</span><span className="text-[10px] text-slate-600">{h.createdAt ? new Date(h.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now'}</span></div> 
                                    <div className="text-xs text-slate-400 truncate font-mono">{h.codeSnippet}</div> 
                                  </div> 
                                )) 
                              } 
                            </div> 
                       </div> 
                    </div> 
                   )} 
                 </div> 
               ) : ( 
                 <div className="flex items-center justify-center h-full p-6"><div className="max-w-md w-full bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-slate-700 text-center shadow-2xl"><Lock size={40} className="text-slate-500 mx-auto mb-4"/><h2 className="text-2xl font-bold text-white mb-2">Premium Feature</h2><p className="text-slate-400 text-sm mb-6">Free Chat is available for Apex users only.</p><button onClick={() => (user||isDevMode) ? setView('premium') : setView('login')} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold rounded-xl">UNLOCK APEX</button></div></div> 
               ) 
            )} 
 
            {/* VIEW: SETTINGS */} 
            {view === 'settings' && ( 
               <div className="p-6 md:p-12 max-w-4xl mx-auto"> 
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Settings/> {tText('settings')}</h2> 
                   <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6"> 
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Brain size={18} className="text-purple-400"/> {tText('model')}</h3> 
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{AI_MODELS.map((model)=>(<button key={model.id} onClick={()=>changeAiModel(model.id)} className={`p-4 rounded-xl border text-left transition-all ${aiModel===model.id?'bg-purple-500/20 border-purple-500':'bg-slate-950 border-slate-700 hover:border-slate-500'}`}><div className={`font-bold text-sm mb-1 ${aiModel===model.id?'text-purple-300':'text-slate-300'}`}>{model.name}</div><div className="text-xs text-slate-500">{model.desc}</div></button>))}</div> 
                   </div> 
                   <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-cyan-400"/> Language</h3><div className="flex flex-wrap gap-3">{Object.entries(LANGUAGES).map(([code, data])=>(<button key={code} onClick={()=>{setLangCode(code);localStorage.setItem('cfx_lang',code);}} className={`px-4 py-2 rounded-xl border text-sm flex items-center gap-2 ${langCode===code?'bg-cyan-500/20 border-cyan-500 text-cyan-300':'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}`}><span>{data.flag}</span> {data.label}</button>))}</div></div> 
                   <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Key size={18} className="text-amber-400"/> {tText('customKey')}</h3><p className="text-xs text-slate-400 mb-4">{tText('apiKeyDesc')}</p><div className="flex gap-2"><input type="password" value={customApiKey} onChange={(e)=>setCustomApiKey(e.target.value)} placeholder="AIzaSy..." className="flex-1 bg-slate-950 border border-slate-700 text-white p-3 rounded-xl text-sm font-mono focus:border-cyan-500 outline-none"/><button onClick={handleSaveCustomKey} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-bold text-sm">SAVE</button></div></div> 
                   <div className="mt-12 border-t border-slate-800 pt-6"><h4 className="text-xs text-slate-600 font-mono mb-2 uppercase tracking-widest flex items-center gap-2"><Bug size={12}/> {tText('devOverride')}</h4><div className="flex gap-2 max-w-xs"><input type="password" value={devPin} onChange={(e)=>setDevPin(e.target.value)} placeholder="Enter PIN..." className="flex-1 bg-slate-950 border border-slate-800 text-slate-300 p-2 rounded-xl text-xs focus:border-red-500 outline-none transition-colors"/><button onClick={handleDevUnlock} className="bg-slate-800 hover:bg-red-900 hover:text-red-200 text-slate-400 px-4 rounded-xl text-xs font-bold transition-colors">{tText('access')}</button></div></div> 
               </div> 
            )} 
 
            {/* VIEW: PORTAL */} 
            {view === 'portal' && ( 
                <div className="p-4 md:p-12 pb-20 max-w-5xl mx-auto animate-fadeIn"> 
                    {/* Portal Navigation */} 
                    <div className="flex overflow-x-auto gap-4 border-b border-slate-800 mb-8 pb-1 sticky top-0 bg-slate-950/95 z-20 pt-4 scrollbar-hide"> 
                        {[{id:'about',label:'About Us'},{id:'legal',label:'Legal Docs'},{id:'guide',label:'Guide'},{id:'infra',label:'Infrastructure'}].map(t => ( 
                          <button key={t.id} onClick={() => setPortalTab(t.id)} className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition ${portalTab===t.id ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-white'}`}>{t.label}</button> 
                        ))} 
                    </div> 
                    
                    {/* Content Implementation */} 
                    {portalTab === 'about' && ( 
                        <div className="space-y-6"> 
                          <section> 
                            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3"><Globe className="text-cyan-500"/> {tText('originTitle')}</h2> 
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800"> 
                                <p className="text-slate-300 leading-relaxed mb-4 text-justify">{tData('aboutText')}</p> 
                                <p className="text-slate-300 leading-relaxed text-justify italic border-l-4 border-amber-500 pl-4 py-2 bg-slate-900">{tData('missionText')}</p> 
                            </div> 
                            
                            {/* Github Card */} 
                            <div className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-cyan-500/50 transition"> 
                                <div className="flex items-center gap-3"> 
                                   <div className="bg-slate-800 p-2 rounded-full border border-slate-700"><Github className="text-white" size={24}/></div> 
                                   <div> 
                                      <h4 className="text-white font-bold text-sm">Open Source Repository</h4> 
                                      <p className="text-xs text-slate-500">Aleocrophic-CodeFixerX-SPA</p> 
                                   </div> 
                                </div> 
                                <a href="https://github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA" target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-600 transition flex items-center gap-2 group"> 
                                   View on GitHub <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform"/> 
                                </a> 
                            </div> 
                          </section> 
 
                          <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mt-8"> 
                             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Heart className="text-pink-500 fill-pink-500 animate-pulse" size={20}/> {tText('specialThanks')}</h3> 
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> 
                                {/* Founder Card */} 
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-cyan-500/30 transition"> 
                                  <div className="w-12 h-12 bg-cyan-900 rounded-full flex items-center justify-center font-bold text-cyan-400 border border-cyan-700">RD</div> 
                                  <div> 
                                    <div className="text-white font-bold text-sm">Rayhan Dzaky</div> 
                                    <div className="text-[10px] text-slate-500">Founder & Lead Architect</div> 
                                  </div> 
                                </div> 
                                {/* Waifu Card (Hoshino) - FIXED FALLBACK */} 
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-pink-500/30 transition"> 
                                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-pink-900 border border-pink-500 relative group"> 
                                    {hoshinoImgError ? ( 
                                        <div className="w-full h-full bg-pink-950 flex items-center justify-center text-pink-300 font-bold text-xs">TH</div> 
                                    ) : ( 
                                        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8rY5XbTjGXe6z_pUj7VqN2M0L8O6K9P1Q2S3T4U5V6W7X8Y9Z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2/s1600/download%20(5).jpeg"  
                                            alt="TH"  
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"  
                                            onError={() => setHoshinoImgError(true)} 
                                        /> 
                                    )} 
                                  </div> 
                                  <div> 
                                    <div className="text-white font-bold text-sm">Takanashi Hoshino</div> 
                                    <div className="text-[10px] text-slate-500">Spiritual Support (BA)</div> 
                                  </div> 
                                </div> 
                                {/* Brand Card */} 
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-amber-500/30 transition"> 
                                  <div className="w-12 h-12 bg-amber-900/50 rounded-full flex items-center justify-center font-bold text-amber-400 border border-amber-700">AL</div> 
                                  <div> 
                                    <div className="text-white font-bold text-sm">Aleocrophic</div> 
                                    <div className="text-[10px] text-slate-500">NyxShade Interactive</div> 
                                  </div> 
                                </div> 
                             </div> 
                          </section> 
                        </div> 
                    )} 
 
                    {portalTab === 'legal' && ( 
                      <div className="space-y-8 grid grid-cols-1 md:grid-cols-2 gap-6"> 
                         <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-full"> 
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Shield size={20} className="text-emerald-500"/> {tText('privacy')}</h2> 
                            <div className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed font-mono bg-slate-950 p-4 rounded-lg border border-slate-800 h-96 overflow-y-auto custom-scrollbar"> 
                                {tData('privacyText')} 
                            </div> 
                         </section> 
                         <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-full"> 
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText size={20} className="text-amber-500"/> {tText('terms')}</h2> 
                            <div className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed font-mono bg-slate-950 p-4 rounded-lg border border-slate-800 h-96 overflow-y-auto custom-scrollbar"> 
                                {tData('termsText')} 
                            </div> 
                         </section> 
                      </div> 
                    )} 
 
                    {portalTab === 'guide' && ( 
                      <div className="space-y-8"> 
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">📘 {tText('guide')}</h2> 
                        <div className="grid md:grid-cols-2 gap-6"> 
                          {/* Lite Guide */} 
                          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition relative overflow-hidden group"> 
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><Code size={100}/></div> 
                              <h3 className="text-cyan-400 font-bold text-xl mb-3 flex items-center gap-2"><Code size={20}/> Lite Users</h3> 
                              <p className="text-sm text-slate-400 leading-relaxed">{tData('guideLite')}</p> 
                              <div className="mt-4 flex gap-2"> 
                                  <span className="text-[10px] bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">Debugging</span> 
                                  <span className="text-[10px] bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">Basic Scan</span> 
                              </div> 
                          </div> 
                          {/* Apex Guide */} 
                          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition relative overflow-hidden group"> 
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><Sparkles size={100} className="text-amber-500"/></div> 
                              <h3 className="text-amber-400 font-bold text-xl mb-3 flex items-center gap-2"><Sparkles size={20}/> Apex Users</h3> 
                              <p className="text-sm text-slate-400 leading-relaxed">{tData('guideApex')}</p> 
                              <div className="mt-4 flex gap-2 flex-wrap"> 
                                  <span className="text-[10px] bg-amber-900/30 text-amber-300 px-2 py-1 rounded border border-amber-500/30">CI/CD</span> 
                                  <span className="text-[10px] bg-amber-900/30 text-amber-300 px-2 py-1 rounded border border-amber-500/30">Legacy Code</span> 
                                  <span className="text-[10px] bg-amber-900/30 text-amber-300 px-2 py-1 rounded border border-amber-500/30">UI Gen</span> 
                              </div> 
                          </div> 
                        </div> 
                      </div> 
                    )} 
 
                    {portalTab === 'infra' && ( 
                       <section className="space-y-8"> 
                          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Server size={24}/> {tText('coreInfra')}</h2> 
                          <div className="grid gap-6 grid-cols-1 md:grid-cols-3"> 
                             <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:scale-105 transition-transform duration-300"> 
                                <Globe className="text-cyan-500 mb-4 h-10 w-10"/> 
                                <h3 className="text-white font-bold mb-2 text-lg">Frontend</h3> 
                                <p className="text-slate-400 text-sm leading-relaxed">{tData('infraFrontend')}</p> 
                             </div> 
                             <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:scale-105 transition-transform duration-300"> 
                                <Database className="text-amber-500 mb-4 h-10 w-10"/> 
                                <h3 className="text-white font-bold mb-2 text-lg">Backend</h3> 
                                <p className="text-slate-400 text-sm leading-relaxed">{tData('infraBackend')}</p> 
                             </div> 
                             <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:scale-105 transition-transform duration-300"> 
                                <Cpu className="text-emerald-500 mb-4 h-10 w-10"/> 
                                <h3 className="text-white font-bold mb-2 text-lg">AI Engine</h3> 
                                <p className="text-slate-400 text-sm leading-relaxed">{tData('infraAI')}</p> 
                             </div> 
                          </div> 
                       </section> 
                    )} 
                </div> 
            )} 
 
            {/* VIEW: PREMIUM */} 
            {view === 'premium' && ( 
               <div className="flex items-center justify-center min-h-full p-4 relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 to-slate-950"></div><div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-amber-500/30 max-w-md w-full text-center shadow-2xl"><Unlock size={40} className="text-amber-500 mx-auto mb-4"/><h2 className="text-2xl font-bold text-white mb-2">{tText('unlock')} Apex Edition</h2><p className="text-slate-400 text-sm mb-6">{tText('enterKey')}</p><input type="text" value={premiumKey} onChange={(e)=>setPremiumKey(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-center text-white p-3 rounded-xl mb-4 font-mono focus:border-amber-500 outline-none" placeholder="XXXX-XXXX-XXXX"/><div className="flex items-center gap-2 mb-4"><div className="h-px bg-slate-800 flex-1"></div><span className="text-xs text-slate-500">{tText('orUpload')}</span><div className="h-px bg-slate-800 flex-1"></div></div><label className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-3 rounded-xl cursor-pointer transition mb-4 border border-dashed border-slate-600"><Upload size={14}/> Upload key.txt<input type="file" accept=".txt" className="hidden" onChange={handleKeyFileUpload}/></label><button onClick={() => {const cleanKey = premiumKey.trim().toUpperCase(); if(cleanKey==="CFX-APX-2025R242"){setIsPremium(true);notify("UNLOCKED!","success");setView('dashboard');}else notify("Invalid","error");}} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold rounded-xl">{tText('authenticate')}</button> 
              <div className="flex items-center gap-3 mt-4"> 
                  <div className="h-px bg-slate-800 flex-1"></div> 
                  <span className="text-xs text-slate-500">{tText('dontHaveKey')}</span> 
                  <div className="h-px bg-slate-800 flex-1"></div> 
              </div> 
              <a href="https://lynk.id/zetago-aurum/yjzz3v78oq13" target="_blank" rel="noreferrer" className="w-full py-3 mt-3 bg-slate-800 hover:bg-slate-700 border border-amber-500/50 text-amber-400 font-bold rounded-xl flex items-center justify-center gap-2 transition group"><ShoppingCart size={16} className="group-hover:scale-110 transition-transform"/> {tText('buyKey')}</a> 
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
