import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  Code, Shield, Zap, Terminal, Cpu, Sparkles, 
  History, LogOut, User, Lock, Unlock, LayoutDashboard, 
  FileCode, Play, CheckCircle, Search, 
  Menu, X, ChevronRight, LogIn, 
  Server, Globe, FileText, Eye, Maximize2, Minimize2, 
  Settings, Languages, BookOpen, Key, Database, Clipboard, Heart, MessageSquare, Send, ShoppingCart, Edit2, PanelRight, ExternalLink,
  AlertTriangle, Layers, Box
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 2. CONSTANTS & DATA ---
const defaultApiKey = ""; 

// --- FINE-TUNED MODULES (SYSTEM PROMPTS) ---
const MODULES = [
  { 
    id: 'debug', name: 'Omni Debugger', icon: <Code />, premium: false, 
    desc: 'Deep logic & syntax repair.', 
    systemPrompt: "ROLE: Principal Software Engineer. TASK: Analyze code for syntax errors, logical fallacies, race conditions, and memory leaks. CONTEXT: Do not just fix the error; explain the root cause. If the code works but is fragile, refactor it using defensive programming patterns. OUTPUT: Return the corrected code with comprehensive comments explaining the fix." 
  },
  { 
    id: 'dep', name: 'Dependency Scanner', icon: <Search />, premium: false, 
    desc: 'Audit libs & vulnerabilities.', 
    systemPrompt: "ROLE: DevSecOps Specialist. TASK: Analyze imports/dependencies. Identify deprecated packages, known CVE vulnerabilities, and license conflicts. ACTION: Suggest modern, secure, and lightweight alternatives. If a library is overkill (e.g., Lodash for simple array logic), suggest native implementation." 
  },
  { 
    id: 'sec', name: 'Security Auditor', icon: <Shield />, premium: false, 
    desc: 'OWASP Top 10 Mitigation.', 
    systemPrompt: "ROLE: Cybersecurity Analyst (OWASP Expert). TASK: Deep scan for SQL Injection, XSS, CSRF, IDOR, and Hardcoded Secrets. ACTION: Refactor code to use Parameterized Queries, Input Sanitization, and Environment Variables. Explain the attack vector you are mitigating. STRICT: Assume all user input is malicious." 
  },
  { 
    id: 'perf', name: 'Optimizer', icon: <Zap />, premium: false, 
    desc: 'Big O & Memory reduction.', 
    systemPrompt: "ROLE: High-Performance Computing Engineer. TASK: Optimize for Time and Space Complexity. ACTION: Identify O(n^2) loops, unnecessary re-renders (React), or heavy database queries. Refactor using caching strategies (Memoization, Redis pattern), efficient algorithms, and vectorization where possible." 
  },
  { 
    id: 'explain', name: 'Code Explainer', icon: <FileCode />, premium: false, 
    desc: 'Pedagogical breakdown.', 
    systemPrompt: "ROLE: Senior Developer Mentor. TASK: Explain the code to a Junior Developer. ACTION: Break down complex logic into plain English. Explain *why* a specific pattern was used (e.g., Singleton, Factory). Use analogies. Do not simplify to the point of inaccuracy." 
  },
  { 
    id: 'pair', name: 'Pair Programmer', icon: <User />, premium: false, 
    desc: 'Real-time co-pilot.', 
    systemPrompt: "ROLE: Collaborative Senior Colleague. TASK: Suggest completions, improvements, or alternative approaches. TONE: Helpful, encouraging, but strict on best practices. If the user is stuck, ask guiding questions before providing the solution." 
  },
  // APEX MODULES
  { 
    id: 'legacy', name: 'Legacy Resurrection', icon: <History />, premium: true, 
    desc: 'Modernize ancient stacks.', 
    systemPrompt: "ROLE: Legacy Systems Architect. TASK: Modernize outdated code (COBOL, VB6, jQuery, PHP 5) to modern stacks (React, Node.js, Go, Rust). STRATEGY: Use the 'Strangler Fig' pattern logic. Preserve exact business logic while upgrading syntax, security, and performance. Add typing (TypeScript) where applicable." 
  },
  { 
    id: 'cicd', name: 'CI/CD Integrator', icon: <Cpu />, premium: true, 
    desc: 'Pipeline automation.', 
    systemPrompt: "ROLE: DevOps Engineer. TASK: Generate production-ready pipeline configs (GitHub Actions, GitLab CI, Jenkins, Docker). INCLUDE: Multi-stage builds, Automated Testing, Linting, SAST/DAST Security Scanning, and Deployment to Cloud (AWS/GCP/Azure). Ensure immutable infrastructure principles." 
  },
  { 
    id: 'custom', name: 'Custom Commander', icon: <Terminal />, premium: true, 
    desc: 'Execute arbitrary prompts.', 
    systemPrompt: "ROLE: Adaptive Polymath AI. TASK: Execute user instructions precisely. CAPABILITIES: Can generate unit tests (Jest/Vitest), write documentation, convert languages, or design system architecture. Follow the user's specific prompt constraints rigoriously." 
  },
  { 
    id: 'sim', name: 'Adv. Simulation', icon: <Play />, premium: true, 
    desc: 'Dry-run execution.', 
    systemPrompt: "ROLE: Runtime Environment Simulator. TASK: Mentally execute the code state-by-state. OUTPUT: Trace the values of variables at each step. Predict final output or runtime errors. USE CASE: Finding logical bugs that static analysis misses (e.g., infinite loops, off-by-one errors)." 
  },
  { 
    id: 'docs', name: 'Dynamic Docs', icon: <FileText />, premium: true, 
    desc: 'Auto-Swagger/JSDoc.', 
    systemPrompt: "ROLE: Technical Writer & API Designer. TASK: Generate industry-standard documentation. FORMAT: JSDoc for functions, OpenAPI/Swagger for REST APIs, or Markdown for READMEs. INCLUDE: Usage examples, edge cases, error codes, and complexity analysis." 
  },
  { 
    id: 'exp', name: 'UI Generator', icon: <Sparkles />, premium: true, 
    desc: 'React/Tailwind Designer.', 
    systemPrompt: "ROLE: UI/UX Frontend Lead. TASK: Generate a COMPLETE, SINGLE-FILE React component using Tailwind CSS and Lucide-React icons. STYLE: Modern, Glassmorphism, or Neobrutalism. REQUIREMENT: The code MUST be copy-paste runnable. Do not use external CSS files. Use `export default function App()`. Make it visually stunning and responsive." 
  },
];

const AI_MODELS = [
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Beta)', desc: 'Next-Gen Speed' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Deep Reasoning' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'High Efficiency' },
];

// --- EXTENDED TRANSLATIONS ---
const LANGUAGES: Record<string, any> = {
  en: { 
    label: 'English', flag: '🇺🇸', 
    ui: { 
      dashboard: 'Dashboard', chat: 'Apex Chat', portalLabel: 'Nexus Portal', history: 'Archives', upgrade: 'Upgrade Apex', login: 'Identify', 
      analyze: 'Execute Protocol', input: 'Source Input', output: 'System Output', processing: 'Neural Processing...', settings: 'Config', copy: 'Copy Buffer', 
      model: 'Neural Engine', newChat: 'Reset Cycle', viewUI: 'Visualize UI', hideUI: 'Code View', copyCode: 'Copy Code', copied: 'Copied',
      modules: 'Core Modules', system: 'System', tools: 'Utilities', welcome: 'Welcome', guest: 'Guest Entity',
      authRequired: 'Identity Verification Required', unlock: 'Unlock', enterKey: 'Input License Key', orUpload: 'OR UPLOAD KEYFILE', authenticate: 'AUTHENTICATE',
      purchase: 'Acquire License', devOverride: 'Root Override', access: 'GRANT ACCESS', customKey: 'Gemini API Key',
      chatPlaceholder: 'Input query to neural network...', chatStart: 'Link established with CodeFixerX Core.', edit: 'Refactor',
      privacy: 'Data Protocol', terms: 'Terms of Engagement', about: 'Manifesto', infra: 'Infrastructure', guide: 'Field Manual',
      roleUser: 'Operator', roleAI: 'CodeFixerX', buyKey: 'ACQUIRE ACCESS', dontHaveKey: "NO LICENSE FOUND?",
      originTitle: 'The Aleocrophic Directive', specialThanks: 'Core Contributors', coreInfra: 'System Architecture',
      portal: {
        aboutText: "CodeFixerX is not merely a tool; it is an architectural intervention. In an era defined by entropy—where JavaScript frameworks multiply faster than they can be mastered—Aleocrophic Systems establishes order. Founded by Rayhan Dzaky Al Mubarok under the NyxShade Interactive conglomerate, we provide the 'Apex' standard: a development assistant that enforces security, scalability, and rigorous type safety by default.",
        missionText: "We reject 'spaghetti code'. Our mission is to democratize Senior Engineering capabilities. Whether you are refactoring a monolithic legacy codebase or bootstrapping a startup, CodeFixerX acts as your Principal Engineer, conducting real-time audits on logic, security, and performance complexity.",
        privacyText: "1. **Ephemeral Processing**: CodeFixerX operates on a stateless protocol. Your code snippets are transmitted to Google Gemini APIs strictly for inference and are not retained for model training by Aleocrophic Systems.\n2. **Local Storage**: API Keys and user preferences are stored locally in your browser's `localStorage`. We do not store your secrets on our servers.\n3. **Identity**: Authentication via Google Firebase is used solely for session management and usage quotas.",
        termsText: "1. **License Usage**: The Apex license is non-transferable. Sharing keys will result in an immediate blacklist.\n2. **Liability**: While CodeFixerX strives for 100% accuracy, code generation involves probabilistic models. The Operator is responsible for the final validation of code before deployment to production environments.\n3. **Ethical Use**: Generation of malware, ransomware, or polymorphic attack scripts is strictly prohibited and triggers automated reporting.",
        guideLite: "Lite Clearance allows access to the 'Omni Debugger' and 'Security Auditor'. Ideal for quick fixes and students learning the basics of secure coding.",
        guideApex: "Apex Clearance unlocks the full suite: 'Legacy Resurrection' for enterprise migrations, 'CI/CD Integrator' for DevOps, and the 'UI Generator' for rapid prototyping. Includes unlimited tokens and priority processing.",
        infraFrontend: "React 18, Vite, TailwindCSS, Framer Motion. Hosted on Edge Networks.",
        infraBackend: "Google Firebase (Auth, Firestore), Cloud Functions. Serverless Architecture.",
        infraAI: "Google Gemini 1.5 Pro & Flash. Multimodal capabilities with 1M+ token context window."
      }
    } 
  },
  id: { 
    label: 'Indonesia', flag: '🇮🇩', 
    ui: { 
      dashboard: 'Dasbor', chat: 'Obrolan Apex', portalLabel: 'Portal Nexus', history: 'Arsip', upgrade: 'Akses Apex', login: 'Identifikasi', 
      analyze: 'Eksekusi Protokol', input: 'Kode Sumber', output: 'Output Sistem', processing: 'Memproses...', settings: 'Konfigurasi', copy: 'Salin Semua', 
      model: 'Mesin Neural', newChat: 'Sesi Baru', viewUI: 'Visualisasi UI', hideUI: 'Tutup Visual', copyCode: 'Salin Kode', copied: 'Tersalin',
      modules: 'Modul Inti', system: 'Sistem', tools: 'Utilitas', welcome: 'Selamat Datang', guest: 'Mode Tamu',
      authRequired: 'Verifikasi Identitas', unlock: 'Buka Akses', enterKey: 'Masukkan Kunci Lisensi', orUpload: 'UNGGAH FILE KUNCI', authenticate: 'AUTENTIKASI',
      purchase: 'Beli Akses', devOverride: 'Akses Root', access: 'AKSES', customKey: 'API Key Gemini',
      chatPlaceholder: 'Ketik perintah ke jaringan neural...', chatStart: 'Koneksi stabil dengan CodeFixerX Core.', edit: 'Ubah',
      privacy: 'Protokol Data', terms: 'Ketentuan Layanan', about: 'Manifesto', infra: 'Infrastruktur', guide: 'Manual Operator',
      roleUser: 'Operator', roleAI: 'CodeFixerX', buyKey: 'BELI AKSES SEKARANG', dontHaveKey: "TIDAK PUNYA KUNCI?",
      originTitle: 'Direktif Aleocrophic', specialThanks: 'Kontributor Inti', coreInfra: 'Arsitektur Sistem',
      portal: {
        aboutText: "CodeFixerX bukan sekadar alat; ini adalah intervensi arsitektural. Di era entropi digital—di mana kerangka kerja JavaScript berkembang lebih cepat daripada yang bisa dikuasai—Aleocrophic Systems menciptakan keteraturan. Didirikan oleh Rayhan Dzaky Al Mubarok di bawah konglomerat NyxShade Interactive, kami menyediakan standar 'Apex': asisten pengembangan yang menegakkan keamanan, skalabilitas, dan keamanan tipe secara default.",
        missionText: "Kami menolak 'kode spaghetti'. Misi kami adalah mendemokratisasi kemampuan Senior Engineer. Baik Anda melakukan refactoring basis kode warisan monolitik atau memulai startup, CodeFixerX bertindak sebagai Principal Engineer Anda, melakukan audit waktu nyata pada logika, keamanan, dan kompleksitas kinerja.",
        privacyText: "1. **Pemrosesan Ephemeral**: CodeFixerX beroperasi pada protokol tanpa status (stateless). Kode Anda dikirim ke API Google Gemini hanya untuk inferensi dan tidak disimpan untuk pelatihan model.\n2. **Penyimpanan Lokal**: Kunci API dan preferensi disimpan secara lokal di browser Anda. Kami tidak menyimpan rahasia Anda di server kami.\n3. **Identitas**: Autentikasi via Google Firebase digunakan hanya untuk manajemen sesi.",
        termsText: "1. **Penggunaan Lisensi**: Lisensi Apex tidak dapat dipindahtangankan. Membagikan kunci akan mengakibatkan pemblokiran permanen.\n2. **Tanggung Jawab**: Operator bertanggung jawab penuh atas validasi akhir kode sebelum penerapan ke lingkungan produksi.\n3. **Penggunaan Etis**: Pembuatan malware, ransomware, atau skrip serangan dilarang keras.",
        guideLite: "Akses Lite memberikan akses ke 'Omni Debugger' dan 'Security Auditor'. Ideal untuk perbaikan cepat.",
        guideApex: "Akses Apex membuka suite lengkap: 'Legacy Resurrection' untuk migrasi perusahaan, 'CI/CD Integrator' untuk DevOps, dan 'UI Generator'.",
        infraFrontend: "React 18, Vite, TailwindCSS. Hosting pada Jaringan Edge.",
        infraBackend: "Google Firebase (Auth, Firestore). Arsitektur Serverless.",
        infraAI: "Google Gemini 1.5 Pro & Flash. Kemampuan Multimodal 1 Juta Token."
      }
    } 
  }
};

// --- 3. COMPONENT HELPERS ---

const highlightSyntax = (code) => {
  if (!code) return '';
  let html = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Strings
  html = html.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-emerald-400">$1</span>');
  // Comments
  html = html.replace(/(\/\/.*$)/gm, '<span class="text-slate-500 italic">$1</span>');
  // Keywords
  const keywords = "\\b(const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await|try|catch|switch|case|new|this|typeof|interface|type|extends|implements|public|private|protected|static|readonly|constructor|void|any|string|number|boolean)\\b";
  html = html.replace(new RegExp(keywords, 'g'), '<span class="text-pink-400 font-semibold">$1</span>');
  // Function Calls
  html = html.replace(/(\w+)(?=\()/g, '<span class="text-cyan-400">$1</span>');
  // Numbers
  html = html.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
  return html;
};

const WebPreview = ({ code, isFullScreen, onClose, onExpand, onShrink }) => {
  const iframeRef = useRef(null);
  
  useEffect(() => {
    if (iframeRef.current && code) {
      const doc = iframeRef.current.contentWindow?.document;
      if(doc) {
          doc.open();
          // Clean imports for browser execution
          const cleanCode = code
            .replace(/^import\s+.*?;/gm, '')
            .replace(/export\s+default\s+function\s+(\w+)/, 'function $1') // Remove export default
            .replace(/export\s+default\s+(\w+);/, '') // Remove bottom export
            .replace(/import\s+{.*?}\s+from\s+['"].*?['"];/gm, '');

          doc.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <script src="https://unpkg.com/lucide@latest"></script>
                <script src="https://unpkg.com/lucide-react@latest"></script>
                <style>
                  body { background-color: #0f172a; color: #e2e8f0; font-family: sans-serif; margin: 0; height: 100vh; display: flex; flex-direction: column; }
                  #root { width: 100%; height: 100%; overflow: auto; }
                  ::-webkit-scrollbar { width: 8px; }
                  ::-webkit-scrollbar-track { background: #0f172a; }
                  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div id="root"></div>
                <script type="text/babel">
                    const { useState, useEffect, useRef, useMemo, useCallback } = React;
                    const { createRoot } = ReactDOM;
                    
                    // Mock Lucide Icons if needed or use the global object
                    const Icons = window.lucide ? window.lucide.icons : {};
                    
                    try {
                        ${cleanCode}
                        
                        const root = createRoot(document.getElementById('root'));
                        // Attempt to find the component named 'App'
                        if (typeof App !== 'undefined') {
                            root.render(<App />);
                        } else {
                            document.getElementById('root').innerHTML = '<div style="padding:20px;color:red">Error: Component must be named "App"</div>';
                        }
                    } catch (err) {
                        document.getElementById('root').innerHTML = '<div style="padding:20px;color:red"><pre>' + err.message + '</pre></div>';
                    }
                </script>
            </body>
            </html>
          `);
          doc.close();
      }
    }
  }, [code]);

  const containerClass = isFullScreen 
    ? "fixed inset-0 z-[60] bg-slate-950 flex flex-col animate-fadeIn" 
    : "w-full h-96 mt-4 border border-slate-700 rounded-xl overflow-hidden flex flex-col bg-slate-900 shadow-2xl";

  return (
    <div className={containerClass}>
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-between items-center shrink-0">
        <span className="text-xs font-bold text-cyan-400 flex items-center gap-2"><Globe size={12}/> LIVE RENDER</span>
        <div className="flex gap-2">
          {!isFullScreen 
            ? <button onClick={onExpand} title="Maximize"><Maximize2 size={16} className="text-slate-500 hover:text-cyan-400"/></button> 
            : <button onClick={onShrink} title="Minimize"><Minimize2 size={16} className="text-slate-500 hover:text-cyan-400"/></button>}
          {isFullScreen && <button onClick={onClose}><X size={16} className="text-red-500 hover:text-red-400"/></button>}
        </div>
      </div>
      <iframe ref={iframeRef} className="flex-1 w-full bg-slate-950" title="Preview" frameBorder="0" />
    </div>
  );
};

const CodeBlock = ({ lang, code, t }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950 my-4 shadow-lg group relative">
      <div className="flex justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 items-center">
        <span className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-2"><Terminal size={12}/> {lang}</span>
        <button onClick={handleCopy} className={`text-xs flex items-center gap-1 transition-all ${copied ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}>
          {copied ? <CheckCircle size={12}/> : <Clipboard size={12}/>} {copied ? (t?.copied || 'Copied') : (t?.copyCode || 'Copy Code')}
        </button>
      </div>
      <div className="relative">
        <pre className="p-4 overflow-x-auto font-mono text-xs md:text-sm text-slate-200 selection:bg-cyan-500/30">
            <code dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }} />
        </pre>
      </div>
    </div>
  );
};

const MarkdownRenderer = ({ content, t }) => {
  if (!content) return null;
  // Split by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return (
    <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
      {parts.map((part, idx) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n');
          const lang = lines[0].replace('```', '').trim() || 'text';
          const codeBody = lines.slice(1, -1).join('\n');
          return <CodeBlock key={idx} lang={lang} code={codeBody} t={t} />;
        } else {
          // Safe HTML rendering for markdown-like syntax
          let html = part
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-cyan-400 mt-6 mb-2 flex items-center gap-2"><span class="w-1 h-4 bg-cyan-500 rounded-full"></span>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-amber-400 mt-8 mb-4 border-b border-slate-800 pb-2">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-8 mb-4 border-b-2 border-slate-700 pb-2">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="text-slate-400 italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs border border-slate-700">$1</code>')
            .replace(/^- (.*$)/gim, '<div class="flex gap-2 ml-2 mb-1"><span class="text-slate-500">•</span><span>$1</span></div>')
            .replace(/\n/g, '<br />');
            
          return <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
        }
      })}
    </div>
  );
};

// --- 4. MAIN APPLICATION ---

export default function App() { 
  const [user, setUser] = useState(null);
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
  const [history, setHistory] = useState([]);
  
  // PREVIEW STATE (FIXED)
  const [previewCode, setPreviewCode] = useState(null);
  const [showCompactPreview, setShowCompactPreview] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  // CHAT STATE
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [premiumKey, setPremiumKey] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [loginApiKey, setLoginApiKey] = useState(''); 
  const [notif, setNotif] = useState(null);
  const [portalTab, setPortalTab] = useState('about'); 

  // --- HELPERS ---
  const getLangObj = () => LANGUAGES[langCode] || LANGUAGES['en'];
  const tText = (key) => { const lang = getLangObj(); return lang.ui[key] || key; };
  const notify = (msg, type = 'info') => { setNotif({msg, type}); setTimeout(() => setNotif(null), 3000); };

  // --- INITIALIZATION EFFECTS ---
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
        setView('dashboard');
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.isPremium) setIsPremium(true);
            if (data.aiModel) setAiModel(data.aiModel);
          }
        } catch (e) {}
      } else {
        if (!isDevMode) { setIsPremium(false); if(view === 'dashboard') setView('language'); }
      }
      setIsAuthChecking(false);
    });
    return () => { unsub(); window.removeEventListener('resize', handleResize); };
  }, []);

  // HISTORY LISTENER
  useEffect(() => {
    if (!user) { setHistory([]); return; }
    let q = query(collection(db, 'history'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      fetched.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setHistory(fetched);
    });
    return () => unsub();
  }, [user]); 

  // --- HANDLERS ---

  const handleLogin = async () => {
    try { 
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider); 
      notify("Identity Verified", "success"); 
    } catch (e) { 
       notify("Login Failed: " + e.message, "error"); 
    }
  };

  const handleGuestAccess = () => {
      if (loginApiKey.trim()) {
          setCustomApiKey(loginApiKey.trim());
          localStorage.setItem('cfx_api_key', loginApiKey.trim());
          notify("API Key Stored", "success");
      }
      setView('dashboard');
  };

  const handleAnalyze = async () => {
    const apiKeyToUse = customApiKey || defaultApiKey; 
    if (!apiKeyToUse) {
        notify("API Key Missing. Set in Settings.", "error");
        setView('settings');
        return;
    }
    if (!inputCode.trim()) return notify("Input Required", "warning");
    if (currentModule.premium && !isPremium) return notify("Access Denied. Upgrade to Apex.", "error");

    setLoading(true); setOutputResult(''); setPreviewCode(null); setShowCompactPreview(false); setIsInputMinimized(false);

    const lang = getLangObj();
    // Constructing a robust prompt
    const systemInstruction = `
      YOU ARE CODEFIXERX. ${isPremium ? 'APEX EDITION' : 'LITE EDITION'}.
      LANGUAGE: Reply strictly in ${lang.label}. 
      MODULE: ${currentModule.name}.
      PROMPT: ${currentModule.systemPrompt}
      OUTPUT FORMAT: Markdown.
      IMPORTANT: If generating React UI code, wrap it in \`\`\`jsx and ensure it is a single file export named 'App'.
    `;

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKeyToUse}`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ contents: [{ parts: [{ text: inputCode }] }], systemInstruction: { parts: [{ text: systemInstruction }] } })
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Processing Error.";
      setOutputResult(text);
      setIsInputMinimized(true);

      // Auto-detect code for preview
      const codeMatch = text.match(/```(jsx|tsx|html|javascript)\n([\s\S]*?)```/);
      if (codeMatch && (codeMatch[1] === 'jsx' || codeMatch[1] === 'tsx' || text.includes('export default function App'))) {
          setPreviewCode(codeMatch[2]);
          setShowCompactPreview(true); // Auto show if valid UI code found
      }

      if (user && !isDevMode) await addDoc(collection(db, 'history'), { 
        userId: user.uid, codeSnippet: inputCode.substring(0,50), module: currentModule.name, response: text, type: 'code', createdAt: serverTimestamp() 
      });

    } catch (e) { notify(`Error: ${e.message}`, "error"); } finally { setLoading(false); }
  };

  const handleChatSend = async () => {
    const apiKeyToUse = customApiKey || defaultApiKey;
    if(!apiKeyToUse || !chatInput.trim()) return;

    const newMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput(''); setChatLoading(true);

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKeyToUse}`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ contents: [{ parts: [{ text: chatInput }] }], systemInstruction: { parts: [{ text: "You are CodeFixerX Apex Chat. Be concise, technical, and brilliant." }] } })
      });
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error.";
      setChatMessages(prev => [...prev, { role: 'ai', text }]);
      
      if (user && !isDevMode) await addDoc(collection(db, 'history'), { 
        userId: user.uid, codeSnippet: chatInput.substring(0,50), module: 'Chat', response: text, type: 'chat', createdAt: serverTimestamp() 
      });
    } catch(e) { notify("Network Failure", "error"); } finally { setChatLoading(false); }
  };

  // --- RENDER ---
  if (isAuthChecking) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Cpu className="animate-spin text-cyan-500 mr-3"/> <span className="text-slate-300 font-mono">INITIALIZING NEURAL LINK...</span></div>;

  if (view === 'language') return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80')] bg-cover opacity-10 animate-pulse"></div>
      <div className="z-10 max-w-5xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-12 shadow-2xl text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">CodeFixerX</h1>
        <p className="text-slate-400 text-sm tracking-[0.3em] uppercase mb-12">Aleocrophic Systems v2.5</p>
        <div className="grid grid-cols-2 gap-4 justify-center max-w-lg mx-auto">
          {Object.entries(LANGUAGES).map(([code, data]) => (
            <button key={code} onClick={() => { setLangCode(code); setView('login'); }} className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-2xl transition-all group flex flex-col items-center">
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{data.flag}</span>
              <span className="text-slate-300 font-bold group-hover:text-white">{data.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (view === 'login') return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative">
       <button onClick={() => setView('language')} className="absolute top-6 left-6 text-slate-400 hover:text-white flex gap-2 z-20"><ChevronRight className="rotate-180"/> Back</button>
       <div className="z-10 bg-slate-900 p-8 rounded-3xl border border-slate-700 max-w-sm w-full text-center shadow-2xl relative">
         <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30"><Cpu size={40} className="text-cyan-400"/></div>
         <h2 className="text-2xl font-bold text-white mb-2">{tText('login')}</h2>
         <div className="mb-6 text-left">
           <label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-1 block">{tText('customKey')} (Optional)</label>
           <div className="flex gap-2">
             <input type="password" value={loginApiKey} onChange={(e) => setLoginApiKey(e.target.value)} className="flex-1 bg-slate-800 border border-slate-600 text-white text-xs p-2 rounded-lg outline-none focus:border-cyan-500" placeholder="sk-..."/>
             <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="bg-slate-800 border border-slate-600 text-cyan-400 hover:text-white p-2 rounded-lg" title="Get Key"><ExternalLink size={14}/></a>
           </div>
         </div>
         <button onClick={handleLogin} className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl flex justify-center gap-2 hover:bg-slate-200 transition mb-3">Google Sign In</button>
         <button onClick={handleGuestAccess} className="w-full py-3 bg-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition border border-slate-700">Guest Access</button>
       </div>
    </div>
  );

  // --- DASHBOARD LAYOUT ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden">
      {notif && <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg border animate-bounce ${notif.type==='success'?'bg-emerald-900/80 border-emerald-500 text-emerald-300':'bg-red-900/80 border-red-500 text-red-300'}`}>{notif.msg}</div>}
      
      {/* FULL SCREEN PREVIEW OVERLAY */}
      {showFullPreview && previewCode && (
        <WebPreview 
          code={previewCode} 
          isFullScreen={true} 
          onClose={() => setShowFullPreview(false)} 
          onShrink={() => { setShowFullPreview(false); setShowCompactPreview(true); }} 
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-slate-900/95 backdrop-blur border-r border-slate-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'}`}>
         <div className="p-6 border-b border-slate-800 flex justify-between items-center min-w-[18rem]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${isPremium ? 'bg-amber-500' : 'bg-cyan-600'}`}>
                {isPremium ? <Sparkles className="text-white"/> : <Code className="text-white"/>}
              </div>
              <div><h2 className="font-bold leading-none tracking-tight text-white">CodeFixerX</h2><span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{isPremium ? 'Apex Edition' : 'Lite Edition'}</span></div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400"><X/></button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-1 min-w-[18rem]">
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-2">{tText('modules')}</div>
           {MODULES.map((m) => {
             const isLocked = m.premium && !isPremium;
             return (
               <button key={m.id} onClick={() => { if(!isLocked){setCurrentModule(m); setView('dashboard'); setSidebarOpen(false);} else notify("Upgrade Required", "error"); }} 
                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition text-left ${currentModule.id===m.id && view==='dashboard' ? (isPremium?'bg-amber-500/20 text-amber-300 border border-amber-500/30':'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30') : 'text-slate-400 hover:bg-slate-800'} ${isLocked ? 'opacity-50 cursor-not-allowed':''}`}>
                 <div className={`${isLocked ? 'text-slate-600' : (m.premium ? 'text-amber-400' : 'text-cyan-400')}`}>{m.icon}</div>
                 <span className="flex-1 truncate text-xs font-medium">{m.name}</span>
                 {isLocked && <Lock size={12} className="text-slate-600"/>}
               </button>
             );
           })}
           
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-6">{tText('tools')}</div>
           <button onClick={() => {setView('chat'); setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${view==='chat' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
             <MessageSquare size={16} className="text-purple-400"/> {tText('chat')} {isPremium ? <span className="text-[10px] bg-purple-900 px-1 rounded">PRO</span> : <Lock size={12}/>}
           </button>
           
           <button onClick={() => {setView('portal'); setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${view==='portal' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
             <BookOpen size={16} className="text-indigo-400"/> {tText('portalLabel')}
           </button>
           
           <button onClick={() => {setView('settings'); setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${view==='settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
             <Settings size={16} className="text-slate-400"/> {tText('settings')}
           </button>
         </div>

         <div className="p-4 border-t border-slate-800 bg-slate-900 min-w-[18rem]">
            {!isPremium && <button onClick={() => setView('premium')} className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-amber-900/20 mb-3 flex items-center justify-center gap-2"><Unlock size={12}/> {tText('upgrade')}</button>}
            {user ? (
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-500 text-cyan-200 flex items-center justify-center font-bold text-xs">{user.email[0].toUpperCase()}</div>
                    <div className="flex-1 overflow-hidden"><div className="text-xs font-bold truncate text-white">{user.displayName || 'User'}</div><div className="text-[10px] text-slate-500">Connected</div></div>
                    <button onClick={() => signOut(auth)}><LogOut size={16} className="text-slate-500 hover:text-red-400"/></button>
                </div>
            ) : (
                <button onClick={() => setView('login')} className="w-full flex justify-center gap-2 bg-slate-800 py-2 rounded-lg text-xs font-bold border border-slate-700 hover:text-white transition"><LogIn size={14}/> {tText('login')}</button>
            )}
         </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col w-full relative bg-slate-950 h-screen overflow-hidden">
         <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur sticky top-0 z-30">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-lg transition"><Menu size={18}/></button>
               <div className="flex items-center gap-2 text-sm">
                   <LayoutDashboard size={16} className="text-slate-500"/> 
                   <ChevronRight size={14} className="text-slate-600"/> 
                   <span className={isPremium ? "text-amber-400 font-bold" : "text-cyan-400 font-bold"}>
                       {view === 'dashboard' ? currentModule.name : view.toUpperCase()}
                   </span>
               </div>
            </div>
            <div className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-[10px] font-bold border ${isPremium ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'}`}>
                    {isPremium ? 'APEX ACTIVE' : 'LITE ACTIVE'}
                </div>
            </div>
         </header>

         {/* DASHBOARD VIEW */}
         {view === 'dashboard' && (
            <div className="flex-1 p-4 overflow-hidden flex flex-col lg:flex-row gap-4">
               <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                  {/* CODE INPUT */}
                  <div onClick={() => isInputMinimized && setIsInputMinimized(false)} className={`bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-xl transition-all duration-300 ${isInputMinimized ? 'h-14 cursor-pointer hover:border-cyan-500' : 'flex-1 min-h-[30%]'}`}>
                     <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><FileCode size={14}/> {tText('input')}</span>
                        {!isInputMinimized && <button onClick={(e) => {e.stopPropagation(); setIsInputMinimized(true);}} className="text-xs text-slate-500 hover:text-white"><Minimize2 size={14}/></button>}
                     </div>
                     <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)} className={`flex-1 bg-slate-950 p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none ${isInputMinimized ? 'hidden' : 'block'}`} placeholder="// Paste source code here..." spellCheck="false"/>
                  </div>

                  {!isInputMinimized && (
                    <button onClick={handleAnalyze} disabled={loading} className={`py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}>
                       {loading ? <span className="animate-pulse">{tText('processing')}</span> : <><Zap size={18}/> {tText('analyze')}</>}
                    </button>
                  )}

                  {/* OUTPUT AREA */}
                  {(outputResult || loading) && (
                    <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden relative min-h-[40%]">
                       {loading && <div className="absolute inset-0 z-10 bg-slate-950/80 flex flex-col items-center justify-center"><div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mb-4"><div className="h-full bg-cyan-500 w-full animate-[ping_1s_ease-in-out_infinite]"></div></div></div>}
                       <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center shrink-0">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Terminal size={14}/> {tText('output')}</span>
                          <div className="flex gap-2">
                             {previewCode && <button onClick={() => setShowCompactPreview(!showCompactPreview)} className={`text-xs px-2 py-1 rounded border transition ${showCompactPreview ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-slate-700 text-slate-400'}`}>{showCompactPreview ? 'Hide UI' : 'Show UI'}</button>}
                             <button onClick={() => {navigator.clipboard.writeText(outputResult); notify("Copied output!");}} className="text-xs text-slate-400 hover:text-white"><Clipboard size={14}/></button>
                          </div>
                       </div>
                       <div className="flex-1 overflow-y-auto p-6 bg-slate-950 custom-scrollbar">
                          <MarkdownRenderer content={outputResult} t={getLangObj().ui} />
                          {showCompactPreview && previewCode && (
                             <WebPreview 
                               code={previewCode} 
                               isFullScreen={false} 
                               onExpand={() => setShowFullPreview(true)} 
                               onClose={() => setShowCompactPreview(false)} 
                             />
                          )}
                       </div>
                    </div>
                  )}
               </div>
            </div>
         )}
         
         {/* PORTAL VIEW */}
         {view === 'portal' && (
             <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
                 <div className="max-w-4xl mx-auto">
                    <div className="flex border-b border-slate-800 mb-8 gap-6">
                        {['about', 'infra', 'legal'].map(tab => (
                            <button key={tab} onClick={() => setPortalTab(tab)} className={`pb-2 text-sm font-bold uppercase tracking-wider transition ${portalTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>{tab}</button>
                        ))}
                    </div>
                    
                    {portalTab === 'about' && (
                        <div className="space-y-8 animate-fadeIn">
                            <section>
                                <h1 className="text-4xl font-bold text-white mb-4">{tText('originTitle')}</h1>
                                <p className="text-slate-400 leading-relaxed text-lg">{getLangObj().ui.portal.aboutText}</p>
                            </section>
                            <section className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                                    <Heart className="text-pink-500 mb-4" size={32}/>
                                    <h3 className="text-xl font-bold text-white mb-2">Mission</h3>
                                    <p className="text-slate-400 text-sm">{getLangObj().ui.portal.missionText}</p>
                                </div>
                                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                                    <Shield className="text-emerald-500 mb-4" size={32}/>
                                    <h3 className="text-xl font-bold text-white mb-2">Security First</h3>
                                    <p className="text-slate-400 text-sm">We don't just patch bugs; we architect defenses. Every line of code generated assumes a hostile environment.</p>
                                </div>
                            </section>
                        </div>
                    )}

                    {portalTab === 'infra' && (
                        <div className="grid gap-6 md:grid-cols-3 animate-fadeIn">
                            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                                <Globe className="text-cyan-500 mb-4" size={32}/>
                                <h3 className="font-bold text-white mb-2">Frontend</h3>
                                <p className="text-slate-400 text-sm">{getLangObj().ui.portal.infraFrontend}</p>
                            </div>
                            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                                <Database className="text-amber-500 mb-4" size={32}/>
                                <h3 className="font-bold text-white mb-2">Backend</h3>
                                <p className="text-slate-400 text-sm">{getLangObj().ui.portal.infraBackend}</p>
                            </div>
                            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                                <Cpu className="text-purple-500 mb-4" size={32}/>
                                <h3 className="font-bold text-white mb-2">Artificial Intelligence</h3>
                                <p className="text-slate-400 text-sm">{getLangObj().ui.portal.infraAI}</p>
                            </div>
                        </div>
                    )}
                    
                     {portalTab === 'legal' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Shield size={18}/> Privacy Protocol</h3>
                                <div className="text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">{getLangObj().ui.portal.privacyText}</div>
                            </div>
                             <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileText size={18}/> Terms of Service</h3>
                                <div className="text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">{getLangObj().ui.portal.termsText}</div>
                            </div>
                        </div>
                    )}
                 </div>
             </div>
         )}

         {/* CHAT VIEW (APEX) */}
         {view === 'chat' && (
             isPremium ? (
                 <div className="flex-1 flex flex-col h-full bg-slate-950">
                     <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                         {chatMessages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50"><MessageSquare size={64} className="mb-4"/><p>Encrypted Channel Established.</p></div>}
                         {chatMessages.map((m, i) => (
                             <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                                 <div className={`max-w-[80%] p-4 rounded-2xl ${m.role==='user'?'bg-cyan-700 text-white rounded-br-none':'bg-slate-800 border border-slate-700 text-slate-300 rounded-bl-none'}`}>
                                     <MarkdownRenderer content={m.text} t={getLangObj().ui}/>
                                 </div>
                             </div>
                         ))}
                         {chatLoading && <div className="flex justify-start"><div className="bg-slate-800 p-3 rounded-2xl border border-slate-700"><div className="flex gap-1"><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div></div></div></div>}
                     </div>
                     <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                         <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleChatSend()} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" placeholder={tText('chatPlaceholder')}/>
                         <button onClick={handleChatSend} className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl"><Send size={20}/></button>
                     </div>
                 </div>
             ) : (
                 <div className="flex-1 flex items-center justify-center">
                     <div className="text-center max-w-md p-8 bg-slate-900 rounded-3xl border border-slate-800">
                         <Lock size={48} className="mx-auto text-slate-600 mb-4"/>
                         <h2 className="text-2xl font-bold text-white mb-2">Apex Feature</h2>
                         <p className="text-slate-400 mb-6">Chat Mode requires Apex clearance.</p>
                         <button onClick={()=>setView('premium')} className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl">UPGRADE</button>
                     </div>
                 </div>
             )
         )}

         {/* SETTINGS VIEW */}
         {view === 'settings' && (
             <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
                 <div className="max-w-2xl mx-auto space-y-6">
                     <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Settings/> Configuration</h2>
                     
                     {/* MODEL SELECT */}
                     <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h3 className="font-bold text-white mb-4 flex items-center gap-2"><BrainIcon className="text-purple-400"/> Neural Model</h3>
                         <div className="grid gap-3">
                             {AI_MODELS.map(m => (
                                 <button key={m.id} onClick={() => {setAiModel(m.id); localStorage.setItem('cfx_ai_model', m.id);}} className={`text-left p-4 rounded-xl border transition ${aiModel === m.id ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                     <div className="font-bold">{m.name}</div>
                                     <div className="text-xs opacity-70">{m.desc}</div>
                                 </button>
                             ))}
                         </div>
                     </div>

                     {/* API KEY */}
                     <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Key className="text-amber-400"/> API Credentials</h3>
                         <p className="text-xs text-slate-500 mb-3">Your Gemini API key is stored locally on your device.</p>
                         <div className="flex gap-2">
                             <input type="password" value={customApiKey} onChange={e=>setCustomApiKey(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white" placeholder="AIzaSy..."/>
                             <button onClick={() => {localStorage.setItem('cfx_api_key', customApiKey); notify("Key Saved", "success");}} className="bg-cyan-600 text-white px-4 rounded-xl font-bold">Save</button>
                         </div>
                     </div>
                 </div>
             </div>
         )}

         {/* PREMIUM VIEW */}
         {view === 'premium' && (
             <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                 <div className="absolute inset-0 bg-amber-900/10 pointer-events-none"></div>
                 <div className="z-10 bg-slate-900 p-10 rounded-3xl border border-amber-500/30 max-w-lg w-full text-center shadow-2xl">
                     <Sparkles size={48} className="mx-auto text-amber-500 mb-6 animate-pulse"/>
                     <h2 className="text-3xl font-bold text-white mb-2">Apex Access</h2>
                     <p className="text-slate-400 mb-8">Unlock CI/CD pipelines, Legacy Modernization, and Unlimited Tokens.</p>
                     
                     <div className="mb-6">
                         <input type="text" value={premiumKey} onChange={e=>setPremiumKey(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-center text-white p-4 rounded-xl font-mono text-lg tracking-widest focus:border-amber-500 outline-none" placeholder="XXXX-XXXX-APEX"/>
                     </div>
                     
                     <button onClick={() => {
                         if(premiumKey.trim() === 'CFX-APX-2025R242'){ setIsPremium(true); notify("ACCESS GRANTED", "success"); setView('dashboard'); }
                         else { notify("Invalid License Key", "error"); }
                     }} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-xl mb-4 hover:scale-105 transition-transform">
                         ACTIVATE LICENSE
                     </button>
                     
                     <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                        <a href="#" className="hover:text-amber-400 border-b border-dashed border-slate-600">Enterprise Contact</a>
                        <span>•</span>
                        <a href="https://lynk.id/zetago-aurum/yjzz3v78oq13" target="_blank" rel="noreferrer" className="hover:text-amber-400 border-b border-dashed border-slate-600">Purchase Key</a>
                     </div>
                 </div>
             </div>
         )}

      </main>
    </div>
  );
}

// --- ICONS HELPER FOR SETTINGS ---
function BrainIcon({className}) { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.284"/><path d="M17.97 14.716A4 4 0 0 1 18 18"/></svg>; }
