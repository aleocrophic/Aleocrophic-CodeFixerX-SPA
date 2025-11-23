# 🔧 Aleocrophic CodeFixerX

<div align="center">
  <img src="/logo.svg" alt="Aleocrophic Logo" width="120" height="120"/>
  
  **Ultimate AI-Powered Code Analysis & Debugging Platform**
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0+-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0+-orange.svg)](https://vitejs.dev/)
  
  *[Empowering developers with AI-driven code analysis, debugging, and optimization tools]*
</div>

---

## 🌟 Overview

**Aleocrophic CodeFixerX** is a sophisticated **Single Page Application (SPA)** built as a **single-file React application** that leverages cutting-edge AI technology to provide comprehensive code analysis, debugging, and optimization services. All components, hooks, and logic are contained within one main `index.tsx` file for maximum simplicity and portability.

### 🎯 Key Features

- **🤖 AI-Powered Analysis**: Advanced code debugging and optimization using Google Gemini AI
- **🔍 Multi-Module System**: 12 specialized modules for different development tasks
- **🌍 International Support**: 8 languages with full UI translation
- **🔐 Secure Authentication**: Google Firebase integration with guest access
- **📱 Responsive Design**: Mobile-first approach with beautiful dark theme
- **⚡ Real-time Processing**: Instant code analysis with live preview capabilities
- **📚 History Tracking**: Cloud-based history for authenticated users
- **🎨 Modern UI/UX**: Sleek interface built with shadcn/ui components
- **📦 Single File Architecture**: Entire application in one `index.tsx` file for easy deployment and modification

---

## 🚀 Technology Stack

### Core Framework
- **⚛️ React 19** - Modern React library with latest features
- **📘 TypeScript 5** - Type-safe development
- **⚡ Vite 5** - Fast build tool and development server
- **🎨 Tailwind CSS 4** - Utility-first styling

### UI & Components
- **🧩 shadcn/ui** - Premium component library
- **🎯 Lucide React** - Comprehensive icon set
- **🌈 Framer Motion** - Smooth animations
- **🎨 Next Themes** - Dark/light mode support

### External Services
- **🔥 Firebase** - Authentication & Firestore database
- **🤖 Google Gemini API** - AI-powered code analysis

### Development Tools
- **📦 Z.ai SDK** - AI integration
- **🔧 ESLint** - Code quality assurance
- **📝 React Hook Form** - Form management
- **✅ Zod** - Schema validation

---

## 📋 Modules Overview

### 🆓 Lite Modules (Free)
| Module | Icon | Description |
|--------|------|-------------|
| **Omni Debugger** | 🐛 | Fix syntax and logic errors instantly |
| **Dependency Scanner** | 🔍 | Analyze library dependencies |
| **Security Auditor** | 🛡️ | Detect SQLi, XSS vulnerabilities |
| **Optimizer** | ⚡ | Boost code performance |
| **Code Explainer** | 📄 | Deep code explanations |
| **Pair Programmer** | 👥 | Real-time collaboration features |

### 👑 Apex Modules (Premium)
| Module | Icon | Description |
|--------|------|-------------|
| **Legacy Resurrection** | 🕰️ | Modernize old codebases |
| **CI/CD Integrator** | 🔄 | Pipeline automation |
| **Custom Commander** | ⌨️ | Execute custom commands |
| **Advanced Simulation** | ▶️ | Sandbox code execution |
| **Dynamic Docs** | 📚 | Auto-documentation |
| **Experimental UI** | ✨ | AI-powered UI design |

---

## 🌍 Supported Languages

| Language | Code | Flag | Status |
|----------|------|------|--------|
| English | `en` | 🇺🇸 | ✅ Full Support |
| Indonesia | `id` | 🇮🇩 | ✅ Full Support |
| 日本語 | `jp` | 🇯🇵 | ✅ Full Support |
| العربية | `ar` | 🇸🇦 | ✅ Full Support |
| Русский | `ru` | 🇷🇺 | ✅ Full Support |
| Deutsch | `de` | 🇩🇪 | ✅ Full Support |
| Español | `es` | 🇪🇸 | ✅ Full Support |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API Key (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA.git
cd Aleocrophic-CodeFixerX-SPA

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Variables

```env
# Firebase Configuration (replace with your config)
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Google Gemini API (optional - for custom API key)
VITE_GEMINI_API_KEY="your-gemini-api-key"
```

---

## 📁 Project Structure

```
aleocrophic-codefixerx-spa/
├── src/
│   └── index.tsx             # Single file application (all components & logic)
├── public/                   # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
└── package.json            # Dependencies and scripts
```

---

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google Provider)
3. Create Firestore Database
4. Copy configuration to environment variables

### Custom API Key Setup
Users can bring their own Gemini API key:
1. Go to Settings → Custom API Key
2. Enter your Gemini API key
3. Save to bypass rate limits

### 🎯 Single File Architecture Benefits

This application is designed as a **single-file React application** with several advantages:

- **🚀 Easy Deployment**: Simply copy and paste the `index.tsx` file to any React environment
- **📦 Zero Dependencies**: All UI components are self-contained within the file
- **🔧 Easy Customization**: Modify everything in one place without navigating multiple files
- **⚡ Fast Loading**: No complex module bundling or routing overhead
- **📱 Portable**: Can be easily integrated into existing projects or hosted on static hosting services
- **🛡️ Self-Contained**: All styles, components, and logic are included in the single file

---

## 🎯 Usage Guide

### Getting Started
1. **Select Language**: Choose your preferred language on the welcome screen
2. **Authentication**: Sign in with Google or continue as guest
3. **Choose Module**: Select from available modules based on your tier
4. **Input Code**: Paste your code in the input area
5. **Analyze**: Click "Initiate Fix" to start AI analysis
6. **Review Results**: View suggestions, fixes, and explanations

### Features Overview

#### 🔍 Code Analysis
- **Syntax Highlighting**: Beautiful code display with syntax highlighting
- **Error Detection**: AI-powered error identification and fixes
- **Performance Optimization**: Suggestions for code improvement
- **Security Scanning**: Vulnerability detection and patches

#### 📱 User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Easy-on-the-eyes dark interface
- **Sidebar Navigation**: Quick access to modules and settings
- **Live Preview**: Real-time code preview for web applications

#### 📚 History & Management
- **Cloud History**: Save analysis history (authenticated users)
- **Local Storage**: Settings and preferences saved locally
- **Export Results**: Copy analysis results with one click

---

## 🔐 Authentication Tiers

### 👤 Guest Mode
- ✅ Access to all Lite modules
- ✅ Local history storage
- ❌ No cloud synchronization
- ❌ No Apex features

### 🔐 Authenticated Users
- ✅ All Lite features
- ✅ Cloud history synchronization
- ✅ Settings backup
- ❌ No Apex features (without key)

### 👑 Apex Users
- ✅ All features unlocked
- ✅ Infinite context processing
- ✅ Premium modules access
- ✅ Priority processing

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint

# Other
npm run type-check   # TypeScript type checking
```

### Code Quality
- **ESLint**: Configured with React and TypeScript rules
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (optional)
- **Husky**: Git hooks (optional)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request on [GitHub](https://github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA)

### Development Guidelines
- Follow TypeScript best practices
- Use semantic HTML elements
- Ensure mobile responsiveness
- Write meaningful commit messages
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Core Team
- **Rayhan Dzaky Al Mubarok** - Founder & Lead Architect
- **Aleocrophic** - Development Studio

### Special Thanks
- **Takanashi Hoshino** - Spiritual Support (Blue Archive)
- **Aleocrophic Brand** - Identity & Design System
- **Firebase Team** - Authentication & Database services
- **Google AI Team** - Gemini API integration

### Technologies
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [Firebase](https://firebase.google.com/) - Backend services
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Google Gemini](https://ai.google.dev/) - AI integration

---

## 📞 Support & Contact

### 🌐 Official Links
- **Website**: [aleocrophic.com](https://aleocrophic.com)
- **Documentation**: [docs.aleocrophic.com](https://docs.aleocrophic.com)
- **Support**: [support.aleocrophic.com](https://support.aleocrophic.com)
- **GitHub Repository**: [github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA](https://github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA/tree/main)

### 💬 Community
- **Discord**: [Join our Discord](https://discord.gg/aleocrophic)
- **Twitter**: [@aleocrophic](https://twitter.com/aleocrophic)
- **GitHub**: [Issues & Discussions](https://github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA)

### 📧 Business Inquiries
- **Email**: business@aleocrophic.com
- **Sales**: sales@aleocrophic.com

---

## 🗺️ Roadmap

### Version 2.0 (Upcoming)
- 🔄 **Real-time Collaboration**: Multi-user code analysis
- 🧪 **Testing Integration**: Automated test generation
- 📊 **Advanced Analytics**: Code quality metrics
- 🔌 **Plugin System**: Custom module development
- 🌐 **More Languages**: Additional language support

### Version 3.0 (Future)
- 🤖 **Custom AI Models**: Train your own analysis models
- 🏢 **Enterprise Features**: Team management, SSO
- 📱 **Mobile Apps**: Native iOS and Android applications
- ☁️ **Cloud Deployment**: One-click deployment options
- 🎓 **Learning Platform**: Integrated coding tutorials

---

<div align="center">
  
  **Built with ❤️ by the Aleocrophic Team**
  
  *Empowering developers worldwide with AI-driven tools*
  
  [![Star](https://img.shields.io/github/stars/aleocrophic/Aleocrophic-CodeFixerX-SPA.svg?style=social&label=Star)](https://github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA)
  [![Fork](https://img.shields.io/github/forks/aleocrophic/Aleocrophic-CodeFixerX-SPA.svg?style=social&label=Fork)](https://github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA/fork)
  [![Watch](https://img.shields.io/github/watchers/aleocrophic/Aleocrophic-CodeFixerX-SPA.svg?style=social&label=Watch)](https://github.com/aleocrophic/Aleocrophic-CodeFixerX-SPA)
  
</div>
