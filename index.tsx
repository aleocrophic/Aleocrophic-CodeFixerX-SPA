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
  Settings, Box, Activity, Languages, BookOpen, Key, Database, Layers, Clipboard, AlertTriangle, Heart, Briefcase, Laptop, Bug, Upload
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

// --- 2. DATA & TRANSLATIONS ---

const LANGUAGES = {
  en: { label: 'English', flag: '🇺🇸', ui: { dashboard: 'Dashboard', portal: 'Portal', history: 'History', upgrade: 'Upgrade Apex', login: 'Login', analyze: 'Initiate Fix', input: 'Source Code', output: 'Output', processing: 'Processing...', settings: 'Settings', copy: 'Copy All' } },
  id: { label: 'Indonesia', flag: '🇮🇩', ui: { dashboard: 'Dasbor', portal: 'Portal', history: 'Riwayat', upgrade: 'Buka Apex', login: 'Masuk', analyze: 'Mulai Analisa', input: 'Kode Sumber', output: 'Hasil', processing: 'Memproses...', settings: 'Pengaturan', copy: 'Salin Semua' } },
  jp: { label: '日本語', flag: '🇯🇵', ui: { dashboard: 'ダッシュボード', portal: 'ポータル', history: '履歴', upgrade: 'Apexへ', login: 'ログイン', analyze: '分析開始', input: 'ソース', output: '出力', processing: '処理中...', settings: '設定', copy: 'コピー' } },
  ar: { label: 'العربية', flag: '🇸🇦', ui: { dashboard: 'لوحة القيادة', portal: 'بوابة', history: 'سجل', upgrade: 'ترقية أبيكس', login: 'دخول', analyze: 'بدء', input: 'شفرة', output: 'المخرجات', processing: 'معالجة...', settings: 'إعدادات', copy: 'نسخ' } },
  ru: { label: 'Русский', flag: '🇷🇺', ui: { dashboard: 'Панель', portal: 'Портал', history: 'История', upgrade: 'Обновить', login: 'Вход', analyze: 'Анализ', input: 'Код', output: 'Вывод', processing: 'Обработка...', settings: 'Настройки', copy: 'Копировать' } },
  de: { label: 'Deutsch', flag: '🇩🇪', ui: { dashboard: 'Dashboard', portal: 'Portal', history: 'Verlauf', upgrade: 'Upgrade', login: 'Anmelden', analyze: 'Starten', input: 'Quellcode', output: 'Ausgabe', processing: 'Verarbeitung...', settings: 'Einstellungen', copy: 'Kopieren' } },
  es: { label: 'Español', flag: '🇪🇸', ui: { dashboard: 'Tablero', portal: 'Portal', history: 'Historial', upgrade: 'Mejorar', login: 'Acceso', analyze: 'Analizar', input: 'Código', output: 'Salida', processing: 'Procesando...', settings: 'Ajustes', copy: 'Copiar' } },
};

const MODULES = [
  { id: 'debug', name: 'Omni Debugger', icon: <Code />, premium: false, desc: 'Fix syntax/logic errors.' },
  { id: 'dep', name: 'Dependency Scanner', icon: <Search />, premium: false, desc: 'Analyze libraries.' },
  { id: 'sec', name: 'Security Auditor', icon: <Shield />, premium: false, desc: 'Fix SQLi, XSS.' },
  { id: 'perf', name: 'Optimizer', icon: <Zap />, premium: false, desc: 'Boost speed.' },
  { id: 'explain', name: 'Code Explainer', icon: <FileCode />, premium: false, desc: 'Deep explanations.' },
  { id: 'pair', name: 'Pair Programmer', icon: <User />, premium: false, desc: 'Real-time collab.' },
  // APEX
  { id: 'legacy', name: 'Legacy Resurrection', icon: <History />, premium: true, desc: 'Modernize old stacks.' },
  { id: 'cicd', name: 'CI/CD Integrator', icon: <Cpu />, premium: true, desc: 'Pipeline automation.' },
  { id: 'custom', name: 'Custom Commander', icon: <Terminal />, premium: true, desc: 'Execute commands.' },
  { id: 'sim', name: 'Adv. Simulation', icon: <Play />, premium: true, desc: 'Sandbox run.' },
  { id: 'docs', name: 'Dynamic Docs', icon: <FileText />, premium: true, desc: 'Auto documentation.' },
  { id: 'exp', name: 'Experimental UI', icon: <Sparkles />, premium: true, desc: 'UI Auto-Design.' },
];

const APEX_MANIFESTO = "You are CodeFixerX Apex Edition. Infinite Context. Deep Scan Active.";
const LITE_MANIFESTO = "You are CodeFixerX Lite. Efficient Debugging.";

// --- 3. UTILITY COMPONENTS ---

const highlightSyntax = (code) => {
  if (!code) return '';
  let html = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-emerald-400">$1</span>');
  html = html.replace(/(\/\/.*$)/gm, '<span class="text-slate-500 italic">$1</span>');
  const keywords = "\\b(const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await|try|catch|switch|case|new|this|typeof|interface|type|extends|implements|public|private|protected|static|readonly|constructor)\\b";
  html = html.replace(new RegExp(keywords, 'g'), '<span class="text-pink-400 font-semibold">$1</span>');
  html = html.replace(/(\w+)(?=\()/g, '<span class="text-cyan-400">$1</span>');
  html = html.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
  return html;
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
      {parts.map((part, idx) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n');
          const lang = lines[0].replace('```', '').trim() || 'text';
          const codeBody = lines.slice(1, -1).join('\n');
          return <CodeBlock key={idx} lang={lang} code={codeBody} />;
        } else {
          return (
            <div key={idx} dangerouslySetInnerHTML={{ __html: part
              .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-cyan-400 mt-6 mb-2 flex items-center gap-2"><span class="w-1 h-4 bg-cyan-500 rounded-full"></span>$1</h3>')
              .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-amber-400 mt-8 mb-4 border-b border-slate-800 pb-2">$1</h2>')
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
              .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs border border-slate-700">$1</code>')
              .replace(/- (.*$)/gim, '<li class="ml-4 list-disc text-slate-400">$1</li>')
              .replace(/\n/g, '<br />') 
            }} />
          );
        }
      })}
    </div>
  );
};

const CodeBlock = ({ lang, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950 my-4 shadow-lg group relative">
      <div className="flex justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 items-center">
        <span className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-2">
          <Terminal size={12}/> {lang}
        </span>
        <button 
          onClick={handleCopy} 
          className={`text-xs flex items-center gap-1 transition-all ${copied ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}
        >
          {copied ? <CheckCircle size={12}/> : <Clipboard size={12}/>} {copied ? 'Copied' : 'Copy'}
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

const WebPreview = ({ code, isFullScreen, onClose, onExpand, onShrink }) => {
  const iframeRef = useRef(null);
  useEffect(() => {
    if (iframeRef.current && code) {
      const doc = iframeRef.current.contentWindow.document;
      doc.open();
      
      // Clean Imports to prevent crashes in browser environment
      const cleanCode = code
        .replace(/^import\s+.*?;/gm, '')
        .replace(/^export\s+default/gm, '');

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
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
              body { background-color: #ffffff; color: #0f172a; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 0; padding: 0; }
              #root { min-height: 100vh; display: flex; flex-direction: column; }
              #error-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(254, 226, 226, 0.95); color: #b91c1c; padding: 20px; font-family: monospace; z-index: 9999; display: none; overflow: auto; }
              .loading { display: flex; justify-content: center; align-items: center; height: 100vh; color: #64748b; }
            </style>
          </head>
          <body>
            <div id="error-overlay"></div>
            <div id="root"><div class="loading">Rendering Preview...</div></div>
            
            <script>
              window.onerror = function(message, source, lineno, colno, error) {
                const overlay = document.getElementById('error-overlay');
                overlay.style.display = 'block';
                overlay.innerHTML = '<h2 style="margin-top:0">Preview Error</h2><pre>' + message + '\\n\\nLine: ' + lineno + '</pre>';
              };
            </script>

            <script type="text/babel">
              // Inject common React hooks to global scope for convenience
              const { useState, useEffect, useRef, useMemo, useCallback, useContext, createContext } = React;
              const { createRoot } = ReactDOM;

              try {
                // User Code Injection
                ${cleanCode}

                // Attempt to mount App
                const rootElement = document.getElementById('root');
                const root = createRoot(rootElement);
                
                if (typeof App !== 'undefined') {
                   root.render(<App />);
                } else {
                   // Try to render if simple JSX
                   // root.render(<div className="p-4 text-center text-gray-500">No 'App' component found. Please verify your code structure.</div>);
                }
              } catch (err) {
                console.error(err);
                const overlay = document.getElementById('error-overlay');
                overlay.style.display = 'block';
                overlay.innerHTML = '<h2 style="margin-top:0">Render Error</h2><pre>' + err.message + '</pre>';
              }
            </script>
          </body>
        </html>
      `);
      doc.close();
    }
  }, [code]);

  const containerClass = isFullScreen 
    ? "fixed inset-0 z-50 bg-slate-950/90 backdrop-blur p-6 flex flex-col" 
    : "w-full h-96 mt-4 border border-slate-700 rounded-xl overflow-hidden flex flex-col bg-white";

  return (
    <div className={containerClass}>
      <div className="bg-slate-100 border-b px-4 py-2 flex justify-between items-center shrink-0">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-2"><Globe size={12}/> LIVE PREVIEW</span>
        <div className="flex gap-2">
          {!isFullScreen ? <button onClick={onExpand}><Maximize2 size={16} className="text-slate-500 hover:text-cyan-600"/></button> : <button onClick={onShrink}><Minimize2 size={16} className="text-slate-500 hover:text-cyan-600"/></button>}
          {isFullScreen && <button onClick={onClose}><X size={16} className="text-red-500"/></button>}
        </div>
      </div>
      <iframe ref={iframeRef} className="flex-1 w-full bg-white" title="Preview" />
    </div>
  );
};

// --- 4. MAIN APP ---
export default function AleocrophicComplete() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('language');
  const [langCode, setLangCode] = useState('en');
  const [isPremium, setIsPremium] = useState(false);
  const [currentModule, setCurrentModule] = useState(MODULES[0]);
  
  // Dev Mode State
  const [isDevMode, setIsDevMode] = useState(false);
  const [devPin, setDevPin] = useState('');

  const [inputCode, setInputCode] = useState('');
  const [outputResult, setOutputResult] = useState('');
  const [isInputMinimized, setIsInputMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  
  const [previewCode, setPreviewCode] = useState(null);
  const [showCompactPreview, setShowCompactPreview] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [premiumKey, setPremiumKey] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [notif, setNotif] = useState(null);
  const [portalTab, setPortalTab] = useState('guide'); // Default tab
  const [generatedApiKey, setGeneratedApiKey] = useState("GUEST");

  const t = (key) => LANGUAGES[langCode]?.ui[key] || LANGUAGES['en'].ui[key];
  const notify = (msg, type = 'info') => { setNotif({msg, type}); setTimeout(() => setNotif(null), 3000); };

  // Effects
  useEffect(() => {
    const savedLang = localStorage.getItem('cfx_lang');
    const savedKey = localStorage.getItem('cfx_api_key');
    if (savedLang && LANGUAGES[savedLang]) setLangCode(savedLang);
    if (savedKey) setCustomApiKey(savedKey);
    
    // Responsive Sidebar Init
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);

    const unsub = onAuthStateChanged(auth, async (u) => { 
      setUser(u); 
      if(u) { 
        setIsDevMode(false);
        setGeneratedApiKey(`CFX-${u.uid.substring(0,6).toUpperCase()}`);
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.language && LANGUAGES[data.language]) setLangCode(data.language);
            if (data.isPremium) setIsPremium(true);
          }
        } catch (e) {}
      } else {
        if (!isDevMode) {
          setIsPremium(false);
          setGeneratedApiKey("GUEST");
        }
      }
    });
    return () => {
      unsub();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!user) { setHistory([]); return; }
    const q = query(collection(db, 'history'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user]);

  // Handlers
  const handleLogin = async () => {
    try { 
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider); 
      notify("Identity Verified! 🌸", "success"); 
      setView('dashboard'); 
    } catch (e) { 
      console.error("Popup Error, falling back...", e);
      // Fallback if popup fails (e.g. restricted env)
      try {
        await signInAnonymously(auth);
        notify("Logged in Anonymously (Popup blocked)", "success");
        setView('dashboard');
      } catch(err) {
        notify("Login Failed Completely.", "error");
      }
    }
  };

  const handleDevUnlock = () => {
    if (devPin === "200924-RDZ-DVLP") {
      setIsDevMode(true);
      setGeneratedApiKey("RDZ-DEV-ROOT");
      notify("⚠️ DEVELOPER MODE ACTIVE", "success");
      setView('dashboard');
      setDevPin('');
    } else {
      notify("ACCESS DENIED 💀", "error");
    }
  };

  const handleUnlock = async () => {
    if (premiumKey === "CFX-APX-2025R242") { 
      setIsPremium(true); 
      notify("APEX UNLOCKED", "success"); 
      setView('dashboard');
      if(user) await setDoc(doc(db, 'users', user.uid), { isPremium: true }, { merge: true });
    } else notify("Invalid Key", "error");
  };

  const handleKeyFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPremiumKey(e.target.result.toString().trim());
        notify("Key Loaded from File!", "success");
      }
    };
    reader.readAsText(file);
  };

  const handleCopyOutput = () => {
    const textarea = document.createElement('textarea');
    textarea.value = outputResult;
    textarea.style.position = 'fixed'; // Avoid scrolling to bottom
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      notify(t('copy') + " Success!", "success");
    } catch (e) {
      notify("Copy failed", "error");
    }
    document.body.removeChild(textarea);
  };

  const handleAnalyze = async () => {
    if (!inputCode.trim()) return notify("Input Empty 😅", "warning");
    if (currentModule.premium && !isPremium) return notify("Locked! 🔒 Upgrade to Apex.", "error");

    setLoading(true);
    setOutputResult('');
    setPreviewCode(null);
    setShowCompactPreview(false);

    const apiKeyToUse = customApiKey || ""; 
    const baseManifesto = isPremium ? APEX_MANIFESTO : LITE_MANIFESTO;
    const lang = LANGUAGES[langCode];
    
    const systemInstruction = `
      ${baseManifesto}
      LANGUAGE: Reply strictly in ${lang.label} (${lang.flag}).
      MODULE: ${currentModule.name}
      USER TONE: Stylish, Expressive, minimal 3 emojis.
      OUTPUT: Markdown with explicit code blocks.
    `;

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKeyToUse}`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ contents: [{ parts: [{ text: inputCode }] }], systemInstruction: { parts: [{ text: systemInstruction }] } })
      });
      const data = await resp.json();
      
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error.";
      
      setOutputResult(text);
      setIsInputMinimized(true); // Animation Trigger

      const codeMatch = text.match(/```(html|react|jsx|javascript)([\s\S]*?)```/);
      if (codeMatch && codeMatch[2] && (text.includes('html') || text.includes('React'))) {
        setPreviewCode(codeMatch[2]);
        setShowCompactPreview(true);
      }

      if (user && !isDevMode) await addDoc(collection(db, 'history'), { userId: user.uid, codeSnippet: inputCode.substring(0,50), module: currentModule.name, response: text, createdAt: serverTimestamp() });

    } catch (e) { notify(`AI Error: ${e.message}`, "error"); } finally { setLoading(false); }
  };

  // Renderers
  if (view === 'language') return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80')] bg-cover opacity-10 animate-pulse"></div>
      <div className="z-10 max-w-5xl w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">Aleocrophic</h1>
        <p className="text-slate-400 text-sm tracking-[0.3em] uppercase mb-12">CodeFixerX: Ultimate Architecture</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(LANGUAGES).map(([code, data]) => (
            <button key={code} onClick={() => { setLangCode(code); setView('login'); }} className="p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-2xl transition-all group flex flex-col items-center">
              <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{data.flag}</span>
              <span className="text-slate-300 font-bold group-hover:text-white">{data.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (view === 'login') return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
       <button onClick={() => setView('language')} className="absolute top-6 left-6 text-slate-400 hover:text-white flex gap-2 z-20"><ChevronRight className="rotate-180"/> Back</button>
       <div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-slate-700 max-w-sm w-full text-center shadow-2xl relative">
         <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><Cpu size={40} className="text-cyan-400"/></div>
         <h2 className="text-2xl font-bold text-white mb-2">{t('login')}</h2>
         <p className="text-slate-400 text-xs mb-8">Access Cloud History & Settings</p>
         <button onClick={handleLogin} className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl flex justify-center gap-2 hover:bg-slate-200 transition mb-3"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G"/> Google Auth</button>
         <button onClick={() => setView('dashboard')} className="w-full py-3 bg-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition">Guest Access</button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden selection:bg-cyan-500/30">
      {notif && <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg border animate-bounce ${notif.type==='success'?'bg-emerald-500/20 border-emerald-500 text-emerald-300':'bg-red-500/20 border-red-500 text-red-300'}`}>{notif.msg}</div>}
      {showFullPreview && previewCode && <WebPreview code={previewCode} isFullScreen={true} onClose={() => setShowFullPreview(false)} onShrink={() => {setShowFullPreview(false); setShowCompactPreview(true);}} />}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:relative z-50 h-full bg-slate-900/95 backdrop-blur border-r border-slate-800 flex flex-col transition-all duration-300
        ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:translate-x-0 md:w-0 md:overflow-hidden'}
      `}>
         <div className="p-6 border-b border-slate-800 flex justify-between items-center min-w-[18rem]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${isPremium ? 'bg-amber-500 shadow-amber-500/20' : 'bg-cyan-600 shadow-cyan-500/20'}`}>{isPremium ? <Sparkles className="text-white"/> : <Code className="text-white"/>}</div>
              <div><h2 className="font-bold leading-none tracking-tight">CodeFixerX</h2><span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{isPremium ? 'Apex' : 'Lite'}</span></div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden"><X className="text-slate-400"/></button>
         </div>
         
         <div className="px-4 pt-4 flex gap-2 border-b border-slate-800 pb-4 min-w-[18rem]">
            <button onClick={() => setView('dashboard')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${view==='dashboard'?'bg-slate-800 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}>{t('dashboard')}</button>
            <button onClick={() => setView('settings')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${view==='settings'?'bg-slate-800 text-cyan-400':'text-slate-500 hover:text-slate-300'}`}><Settings size={12} className="inline mb-0.5"/> {t('settings')}</button>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar min-w-[18rem]">
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-2">Modules ({isPremium ? '12' : '6'})</div>
           {MODULES.map((m) => {
             const isLocked = m.premium && !isPremium;
             return (
               <button key={m.id} onClick={() => { if(!isLocked){setCurrentModule(m); setView('dashboard'); setSidebarOpen(false);} else notify("Apex Required 🔒", "error"); }} 
                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition text-left ${currentModule.id===m.id && view==='dashboard' ? (isPremium?'bg-amber-500/20 text-amber-300 border border-amber-500/20':'bg-cyan-500/20 text-cyan-300 border border-cyan-500/20') : 'text-slate-400 hover:bg-slate-800'} ${isLocked ? 'opacity-50 cursor-not-allowed':''}`}>
                 <div className={`${isLocked ? 'text-slate-600' : (m.premium ? 'text-amber-400' : 'text-cyan-400')}`}>{m.icon}</div>
                 <span className="flex-1 truncate text-xs font-medium">{m.name}</span>
                 {isLocked && <Lock size={12} className="text-slate-600"/>}
               </button>
             );
           })}
           <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2 mt-6">System</div>
           <button onClick={() => {setView('portal'); setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-400 hover:bg-slate-800 transition ${view==='portal'?'bg-indigo-500/20 text-indigo-300':''}`}><BookOpen size={16}/> {t('portal')}</button>
         </div>
         
         <div className="p-4 border-t border-slate-800 bg-slate-900 min-w-[18rem]">
            {!isPremium && <button onClick={() => (user || isDevMode) ? setView('premium') : setView('login')} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded-lg transition shadow-lg shadow-amber-500/20 mb-2 flex items-center justify-center gap-2"><Unlock size={12}/> {t('upgrade')}</button>}
            {user || isDevMode ? (
              <div className="flex items-center gap-3 px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isDevMode ? 'bg-red-900 border-red-500 text-red-200' : 'bg-cyan-900 border-cyan-700 text-cyan-200'}`}>
                  {isDevMode ? 'DEV' : user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-bold truncate">{isDevMode ? 'Developer' : user.displayName}</div>
                  <div className="text-[10px] text-slate-500">{isDevMode ? 'System Root' : 'Online'}</div>
                </div>
                <button onClick={() => { if(isDevMode){setIsDevMode(false);setIsPremium(false);setGeneratedApiKey("GUEST");setView('language');} else signOut(auth); }}><LogOut size={16} className="text-slate-500 hover:text-red-400"/></button>
              </div>
            ) : (
              <button onClick={() => setView('login')} className="w-full flex justify-center gap-2 bg-slate-800 py-3 rounded-xl text-sm font-bold hover:bg-slate-700 border border-slate-700"><LogIn size={16}/> {t('login')}</button>
            )}
         </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col w-full relative bg-slate-950">
         <header className="h-auto min-h-[64px] border-b border-slate-800 flex flex-col md:flex-row items-center justify-between px-6 py-2 bg-slate-950/90 backdrop-blur sticky top-0 z-40 shadow-md">
            <div className="flex items-center gap-4 w-full md:w-auto mb-2 md:mb-0">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors mr-2"><Menu/></button>
               <div className="flex items-center gap-2 text-slate-400 text-sm"><LayoutDashboard size={16}/> <ChevronRight size={14}/> <span className={isPremium ? "text-amber-400 font-bold" : "text-cyan-400 font-bold"}>{view === 'portal' ? t('portal') : view === 'premium' ? t('upgrade') : view === 'settings' ? t('settings') : currentModule.name}</span></div>
            </div>
            <div className="flex flex-wrap justify-end gap-4 text-[10px] md:text-xs font-mono w-full md:w-auto">
               <div className="flex items-center gap-2 text-slate-500"><span className={`w-2 h-2 rounded-full ${isPremium ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span> ACTIVE</div>
               <div className="text-slate-500">VER: {isPremium ? <span className="text-amber-500">vX.APEX</span> : <span className="text-cyan-500">vX.LITE</span>}</div>
               <div className="flex items-center gap-1 border border-slate-800 rounded px-2 py-0.5 bg-slate-900"><Key size={10} className={isDevMode ? "text-red-500" : "text-slate-500"}/><span className={isDevMode ? "text-red-400 font-bold" : "text-cyan-400"}>{generatedApiKey}</span></div>
            </div>
         </header>

         {view === 'dashboard' && (
            <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col lg:flex-row gap-6">
               <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                  {/* INPUT AREA (SMART MINIMIZE) */}
                  <div 
                     onClick={() => isInputMinimized && setIsInputMinimized(false)}
                     className={`bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${isInputMinimized ? 'h-16 cursor-pointer hover:border-cyan-500 hover:bg-slate-800' : 'flex-1 min-h-[250px]'}`}
                  >
                     <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><FileCode size={14}/> {t('input')} {isInputMinimized && <span className="text-cyan-500 text-[10px] animate-pulse">◀ Click to Expand</span>}</span>
                        {!isInputMinimized && <button onClick={(e) => {e.stopPropagation(); setIsInputMinimized(true);}} className="text-xs text-slate-500 hover:text-white flex items-center gap-1"><Minimize2 size={14}/> Minimize</button>}
                     </div>
                     <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)} className={`flex-1 bg-slate-900 p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none custom-scrollbar ${isInputMinimized ? 'hidden' : 'block'}`} placeholder={`// Paste code here...`} spellCheck="false"/>
                  </div>

                  {!isInputMinimized && (
                    <button onClick={handleAnalyze} disabled={loading} className={`py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3 ${loading ? 'bg-slate-800 text-slate-500' : isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white'}`}>
                       {loading ? t('processing') : <><Zap className={loading?"":"animate-pulse"}/> {t('analyze')}</>}
                    </button>
                  )}

                  {(outputResult || loading) && (
                    <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden min-h-[400px] relative animate-fadeIn">
                       {loading && <div className="absolute inset-0 z-10 bg-slate-950/80 flex flex-col items-center justify-center"><div className="w-1/2 h-1 bg-slate-800 rounded-full overflow-hidden mb-4"><div className="h-full bg-cyan-500 animate-progress"></div></div><div className="text-cyan-400 text-xs font-mono animate-pulse">{t('processing')}</div></div>}
                       <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center shrink-0">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Terminal size={14}/> {t('output')}</span>
                          <div className="flex gap-2">
                            {previewCode && <button onClick={() => setShowCompactPreview(!showCompactPreview)} className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition ${showCompactPreview ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}><Eye size={12}/> {t('viewUI')}</button>}
                            <button onClick={handleCopyOutput} className="text-xs flex items-center gap-1 text-slate-400 hover:text-white"><CheckCircle size={12}/> {t('copy')}</button>
                          </div>
                       </div>
                       <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950">
                          <MarkdownRenderer content={outputResult} />
                          {showCompactPreview && previewCode && <WebPreview code={previewCode} isFullScreen={false} onExpand={() => setShowFullPreview(true)} onClose={() => setShowCompactPreview(false)} />}
                       </div>
                    </div>
                  )}
               </div>
               
               <div className="w-full lg:w-64 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shrink-0 h-48 lg:h-full shadow-lg">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between"><span className="text-xs font-bold text-slate-400 flex items-center gap-2"><History size={14}/> {t('history')}</span></div>
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

         {view === 'settings' && (
           <div className="flex-1 overflow-y-auto p-6 md:p-12">
             <div className="max-w-2xl mx-auto">
               <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Settings/> {t('settings')}</h2>
               <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-cyan-400"/> Language</h3>
                 <div className="flex flex-wrap gap-3">
                   {Object.entries(LANGUAGES).map(([code, data]) => (
                     <button key={code} onClick={() => {setLangCode(code); localStorage.setItem('cfx_lang', code);}} className={`px-4 py-2 rounded-xl border text-sm flex items-center gap-2 ${langCode===code ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                       <span>{data.flag}</span> {data.label}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Key size={18} className="text-amber-400"/> Custom API Key</h3>
                 <p className="text-xs text-slate-400 mb-4">BYOK (Bring Your Own Key) to bypass global rate limits. Stored locally.</p>
                 <div className="flex gap-2">
                   <input type="password" value={customApiKey} onChange={(e)=>setCustomApiKey(e.target.value)} placeholder="AIzaSy..." className="flex-1 bg-slate-950 border border-slate-700 text-white p-3 rounded-xl text-sm font-mono focus:border-cyan-500 outline-none"/>
                   <button onClick={() => {localStorage.setItem('cfx_api_key', customApiKey); notify("Key Saved!", "success");}} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-bold text-sm">SAVE</button>
                 </div>
               </div>
               {/* DEV MODE TOGGLE */}
               <div className="mt-12 border-t border-slate-800 pt-6">
                  <h4 className="text-xs text-slate-600 font-mono mb-2 uppercase tracking-widest flex items-center gap-2"><Bug size={12}/> Developer Override</h4>
                  <div className="flex gap-2 max-w-xs">
                    <input type="password" value={devPin} onChange={(e)=>setDevPin(e.target.value)} placeholder="Enter PIN..." className="flex-1 bg-slate-950 border border-slate-800 text-slate-300 p-2 rounded-xl text-xs focus:border-red-500 outline-none transition-colors"/>
                    <button onClick={handleDevUnlock} className="bg-slate-800 hover:bg-red-900 hover:text-red-200 text-slate-400 px-4 rounded-xl text-xs font-bold transition-colors">ACCESS</button>
                  </div>
               </div>
             </div>
           </div>
         )}

         {view === 'portal' && (
            <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-20 custom-scrollbar bg-slate-950">
               <div className="max-w-4xl mx-auto animate-fadeIn">
                  <div className="flex gap-4 border-b border-slate-800 mb-8 pb-1 sticky top-0 bg-slate-950/95 z-20 pt-4">
                     {[{id:'guide',label:'Guide'},{id:'infra',label:'Infrastructure'},{id:'about',label:'About Us'},{id:'legal',label:'Legal Docs'}].map(t => (
                       <button key={t.id} onClick={() => setPortalTab(t.id)} className={`px-4 py-2 text-sm font-bold transition ${portalTab===t.id ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-white'}`}>{t.label}</button>
                     ))}
                  </div>
                  
                  {portalTab === 'about' && (
                     <div className="space-y-6">
                        <section>
                          <h2 className="text-3xl font-bold text-white mb-4">Origin of Aleocrophic</h2>
                          <p className="text-slate-400 leading-relaxed mb-4">CodeFixerX was born from a simple necessity: the modern development landscape is chaotic. With hundreds of languages, frameworks, and updates releasing weekly, developers are drowning in complexity. Aleocrophic Systems, founded by <strong>Rayhan Dzaky Al Mubarok</strong> under the <strong>NyxShade Interactive</strong> banner, aims to be the lighthouse in this storm. We bridge the gap between "it works on my machine" and "production-ready enterprise code" using state-of-the-art AI.</p>
                          <p className="text-slate-400 leading-relaxed">Our mission is not to replace the developer, but to empower them. To give every coder, regardless of experience level, an "Apex" level assistant that understands security, scalability, and clean architecture.</p>
                        </section>
                        <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mt-8">
                           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Heart className="text-red-500" size={20}/> Special Thanks</h3>
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
                                  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8rY5XbTjGXe6z_pUj7VqN2M0L8O6K9P1Q2S3T4U5V6W7X8Y9Z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2/s1600/download%20(5).jpeg" alt="Takanashi Hoshino" className="w-full h-full object-cover" onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/150/pink/white?text=TH"}} />
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

                  {portalTab === 'legal' && (
                    <div className="space-y-8">
                       <section>
                         <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Shield size={24} className="text-emerald-500"/> Privacy Policy</h2>
                         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 text-sm text-slate-400">
                            <p><strong>1. Data Collection:</strong> Aleocrophic Systems only collects minimal data required for authentication (via Google Firebase) and prompt processing. We do not store your source code permanently on our servers beyond the history log visible to you.</p>
                            <p><strong>2. AI Processing:</strong> Your code snippets are sent ephemerally to Google Gemini APIs for processing. This data is not used to train public models in this instance, adhering to standard enterprise data hygiene.</p>
                            <p><strong>3. User Rights:</strong> You retain full ownership of any code you submit and any code generated by the AI. You may delete your history at any time via the database.</p>
                         </div>
                       </section>
                       <section>
                         <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><FileText size={24} className="text-amber-500"/> Terms of Service</h2>
                         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 text-sm text-slate-400">
                            <p><strong>1. Acceptance:</strong> By using CodeFixerX (Lite or Apex), you agree to these terms. This tool is provided "as is" without warranties of any kind.</p>
                            <p><strong>2. Prohibited Use:</strong> You strictly agree NOT to use this AI to generate malware, ransomware, exploits, or any code intended to harm systems or violate laws. Violation results in immediate ban.</p>
                            <p><strong>3. Liability:</strong> Aleocrophic Systems is not liable for any production outages, data loss, or security breaches caused by code generated by this tool. The developer is responsible for final review and testing.</p>
                         </div>
                       </section>
                    </div>
                  )}
                  
                  {/* ... (Guide and Infra sections similar to previous but more detailed if needed) ... */}
                  {portalTab === 'guide' && (
                     <div className="space-y-8">
                        <section>
                          <h2 className="text-2xl font-bold text-white mb-4">📘 User Manual</h2>
                          <p className="text-slate-400 mb-6">Welcome to CodeFixerX! Here is how to maximize your development workflow depending on your access level.</p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                               <h3 className="text-cyan-400 font-bold text-lg mb-3 flex items-center gap-2"><Code size={18}/> For Lite Users</h3>
                               <ul className="text-sm text-slate-400 space-y-2">
                                 <li>1. Select <strong>Omni Debugger</strong> for quick syntax fixes.</li>
                                 <li>2. Use <strong>Security Auditor</strong> to scan for basic SQLi/XSS flaws.</li>
                                 <li>3. Paste code snippets (max 500 lines) for best results.</li>
                                 <li>4. Output will be concise and ready to copy.</li>
                               </ul>
                             </div>
                             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                               <h3 className="text-amber-400 font-bold text-lg mb-3 flex items-center gap-2"><Sparkles size={18}/> For Apex Users</h3>
                               <ul className="text-sm text-slate-400 space-y-2">
                                 <li>1. Unlock <strong>CI/CD Integrator</strong> to generate pipeline YAMLs.</li>
                                 <li>2. Use <strong>Legacy Resurrection</strong> to modernize old COBOL/PHP code.</li>
                                 <li>3. Activate <strong>Web UI Gen</strong> to create full React components.</li>
                                 <li>4. Enjoy Infinite Context processing.</li>
                               </ul>
                             </div>
                          </div>
                        </section>
                        <section>
                           <h3 className="text-white font-bold mb-3">💡 Pro Tips</h3>
                           <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 text-sm text-slate-400">
                             <p>• Use the "Custom Commander" module (Apex) for specific requests like "Refactor this to SOLID principles".</p>
                             <p className="mt-2">• You can enter your own Gemini API Key in Settings if you hit rate limits.</p>
                           </div>
                        </section>
                     </div>
                  )}
                  {portalTab === 'infra' && (
                    <section className="space-y-8">
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Server size={24}/> Core Infrastructure</h2>
                      <p className="text-slate-400">Aleocrophic CodeFixerX is built on a modern, serverless architecture designed for speed, security, and scalability.</p>
                      
                      <div className="grid gap-6 md:grid-cols-3">
                         <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                           <Globe className="text-cyan-500 mb-4" size={32}/>
                           <h3 className="text-white font-bold mb-2">Frontend Layer</h3>
                           <p className="text-slate-400 text-sm">Built with <strong>React 18</strong> and <strong>TypeScript</strong> for type-safe logic. Styled with <strong>Tailwind CSS</strong> for rapid UI development. Bundled via <strong>Vite</strong> for lightning-fast load times.</p>
                         </div>
                         <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                           <Database className="text-amber-500 mb-4" size={32}/>
                           <h3 className="text-white font-bold mb-2">Backend Services</h3>
                           <p className="text-slate-400 text-sm">Powered by <strong>Google Firebase</strong>. Authentication handles secure user sessions. Cloud Firestore provides real-time NoSQL storage for history logs and user settings.</p>
                         </div>
                         <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                           <Cpu className="text-emerald-500 mb-4" size={32}/>
                           <h3 className="text-white font-bold mb-2">AI Engine</h3>
                           <p className="text-slate-400 text-sm">Direct integration with <strong>Google Gemini 1.5 Pro/Flash Models</strong> via REST API. Supports multi-modal input and massive context windows for deep code analysis.</p>
                         </div>
                      </div>
                    </section>
                  )}
               </div>
            </div>
         )}
         
         {view === 'premium' && (
           <div className="flex-1 flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 to-slate-950"></div><div className="z-10 bg-slate-900/90 backdrop-blur p-8 rounded-3xl border border-amber-500/30 max-w-md w-full text-center shadow-2xl"><Unlock size={40} className="text-amber-500 mx-auto mb-4"/><h2 className="text-2xl font-bold text-white mb-2">Unlock Apex</h2><p className="text-slate-400 text-sm mb-6">Enter license key (CFX-APX...)</p><input type="text" value={premiumKey} onChange={(e)=>setPremiumKey(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-center text-white p-3 rounded-xl mb-4 font-mono focus:border-amber-500 outline-none" placeholder="XXXX-XXXX-XXXX"/>
           <div className="flex items-center gap-2 mb-4"><div className="h-px bg-slate-800 flex-1"></div><span className="text-xs text-slate-500">OR UPLOAD KEY</span><div className="h-px bg-slate-800 flex-1"></div></div><label className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-3 rounded-xl cursor-pointer transition mb-4 border border-dashed border-slate-600"><Upload size={14}/> Upload key.txt<input type="file" accept=".txt" className="hidden" onChange={handleKeyFileUpload}/></label>
           <button onClick={() => {if(premiumKey==="CFX-APX-2025R242"){setIsPremium(true);notify("UNLOCKED!","success");setView('dashboard');}else notify("Invalid","error");}} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold rounded-xl">AUTHENTICATE</button><div className="mt-4 text-xs text-slate-500">Purchase: <a href="https://lynk.id/zetago-aurum/yjzz3v78oq13" target="_blank" className="text-amber-500 hover:underline">lynk.id/zetago-aurum</a></div></div></div>
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
