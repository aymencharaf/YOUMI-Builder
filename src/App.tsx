import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ProjectConfig, Asset } from './types';
import { INITIAL_ASSETS } from './constants/assets';
import { TEMPLATE_MAP, YOUMI_ARABIC_TEMPLATE } from './constants/templates';
import { useTranslation } from './utils/i18n';

// Components
import BrandLogo from './components/BrandLogo';
import LivePreview from './components/LivePreview';
import CodeViewer from './components/CodeViewer';
import AssetManager from './components/AssetManager';
import PackEditorDrawer from './components/PackEditorDrawer';
import PackEditorPanel from './components/PackEditorPanel';

// Lazy Loaded Editors & Panels
const SiteInfoEditor = lazy(() => import('./components/packs/SiteInfoEditor'));
const HeaderEditor = lazy(() => import('./components/packs/HeaderEditor'));
const MenuEditor = lazy(() => import('./components/packs/MenuEditor'));
const HeroEditor = lazy(() => import('./components/packs/HeroEditor'));
const CategoriesEditor = lazy(() => import('./components/packs/CategoriesEditor'));
const FooterEditor = lazy(() => import('./components/packs/FooterEditor'));
const ColorsEditor = lazy(() => import('./components/packs/ColorsEditor'));
const FontsEditor = lazy(() => import('./components/packs/FontsEditor'));
const ButtonsEditor = lazy(() => import('./components/packs/ButtonsEditor'));
const ExportView = lazy(() => import('./components/packs/ExportView'));
const AIBuilder = lazy(() => import('./components/AIBuilder'));
const TemplateLibrary = lazy(() => import('./components/TemplateLibrary'));
const LayoutArranger = lazy(() => import('./components/LayoutArranger'));
const PackMarketplace = lazy(() => import('./components/PackMarketplace'));
const PluginSystem = lazy(() => import('./components/PluginSystem'));
const SettingsPanel = lazy(() => import('./components/packs/SettingsPanel'));
const AdminPanel = lazy(() => import('./components/packs/AdminPanel'));
const DeveloperHub = lazy(() => import('./components/DeveloperHub'));
const YoumiHub = lazy(() => import('./components/YoumiHub'));
const YoumiAIHub = lazy(() => import('./components/YoumiAIHub'));
const SaasDashboard = lazy(() => import('./components/SaaSDashboard'));
const ExtensionMarketplace = lazy(() => import('./components/ExtensionMarketplace'));

import NewProjectModal from './components/NewProjectModal';
import AuthScreen from './components/AuthScreen';
import { authService, AuthUser } from './utils/authService';
import { Lock, User, Shield, LogOut, Power, Plus } from 'lucide-react';

// Icons
import {
  Globe,
  Layout,
  Menu as MenuIcon,
  Sliders,
  Grid,
  ListCollapse,
  Palette,
  Type,
  Square,
  Download,
  Hammer,
  Moon,
  Sun,
  RotateCcw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Laptop,
  Check,
  FolderOpen,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Save,
  HelpCircle,
  ExternalLink,
  Languages,
  Undo2,
  Redo2,
  Search,
  X,
  Columns,
  Settings,
  FileJson,
  FileCode
} from 'lucide-react';

export default function App() {
  const { language, setLanguage, t, dir } = useTranslation();

  const [userSession, setUserSession] = useState<AuthUser | null>(() => {
    return authService.getCurrentSession()?.user || null;
  });

  const [currentPortalView, setCurrentPortalView] = useState<'builder' | 'adminPortal'>('builder');

  useEffect(() => {
    const unsubscribe = authService.onSessionChange((session) => {
      setUserSession(session?.user || null);
    });
    return unsubscribe;
  }, []);

  const handleLoginSuccess = (user: AuthUser, startInAdminPortal = false) => {
    setUserSession(user);
    if (startInAdminPortal || user.role === 'Admin') {
      setCurrentPortalView('adminPortal');
    } else {
      setCurrentPortalView('builder');
    }
    showNotification(t('notif_logged_in'));
  };

  const handleLogout = async () => {
    await authService.signOut();
    setUserSession(null);
    showNotification(t('notif_logged_out'));
  };
  
  // Load configuration from local storage if exists, otherwise fallback to our beautiful Arabic template
  const [config, setConfigInternal] = useState<ProjectConfig>(() => {
    const saved = localStorage.getItem('youmi_project_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return YOUMI_ARABIC_TEMPLATE;
      }
    }
    return YOUMI_ARABIC_TEMPLATE;
  });

  const [history, setHistory] = useState<ProjectConfig[]>([]);
  const [redoStack, setRedoStack] = useState<ProjectConfig[]>([]);

  // Wrapper for setConfig that automatically records history states
  const setConfig = (newConfig: ProjectConfig | ((prev: ProjectConfig) => ProjectConfig)) => {
    if (userSession?.role === 'Viewer') {
      showNotification(language === 'ar' ? '🚫 وضع المستعرض: لا يمكن تعديل تصميم المتجر!' : '🚫 Viewer Mode: Read-only access!');
      return;
    }
    setConfigInternal((prev) => {
      const resolved = typeof newConfig === 'function' ? newConfig(prev) : newConfig;
      if (JSON.stringify(prev) !== JSON.stringify(resolved)) {
        setHistory((h) => [...h.slice(-49), prev]);
        setRedoStack([]);
      }
      return resolved;
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setRedoStack((r) => [...r, config]);
    setHistory(newHistory);
    setConfigInternal(previous);
    showNotification(t('notif_undo'));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);
    setHistory((h) => [...h, config]);
    setRedoStack(newRedo);
    setConfigInternal(next);
    showNotification(t('notif_redo'));
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string>('marketplace');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);

  const handleSelectProjectType = (type: any, newConfig: ProjectConfig, projectName: string) => {
    setSelectedTemplate(type);
    setConfig(newConfig);
    showNotification(language === 'ar' ? `✨ تم إنشاء مشروع جديد (${projectName}) بنجاح!` : `✨ New project (${projectName}) initialized!`);
  };
  const [activePackId, setActivePackId] = useState<string>('saasDashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is lg/xl threshold
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [backupConfig, setBackupConfig] = useState<ProjectConfig | null>(null);
  const [column3Tab, setColumn3Tab] = useState<'packs' | 'layers' | 'inspector'>('packs');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [includedPacks, setIncludedPacks] = useState<string[]>([
    'siteInfo',
    'header',
    'menu',
    'hero',
    'categories',
    'footer',
    'colors',
    'fonts',
    'buttons',
  ]);

  // UI notifications
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Asset Manager Modal Control States
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [assetFilterCategory, setAssetFilterCategory] = useState<'logo' | 'hero' | 'product' | 'category' | undefined>(undefined);
  const [assetSelectCallback, setAssetSelectCallback] = useState<((url: string) => void) | null>(null);

  // Auto-save project config when it changes
  useEffect(() => {
    localStorage.setItem('youmi_project_config', JSON.stringify(config));
  }, [config]);

  // Dark / Light Theme logic of YOUMI builder
  useEffect(() => {
    const root = window.document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // Keyboard Shortcuts (Undo, Redo, Save, Export, Import)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (modifier && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (modifier && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveProject();
      } else if (modifier && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleExportConfig();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, history, redoStack, language]);

  // Load selected template layout presets
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateKey = e.target.value;
    setSelectedTemplate(templateKey);
    if (TEMPLATE_MAP[templateKey]) {
      setConfig(TEMPLATE_MAP[templateKey]);
      showNotification(t('notif_template_applied'));
    }
  };

  // Reset to current selected template default state
  const handleReset = () => {
    const confirmMsg = t('confirm_reset');
    if (window.confirm(confirmMsg)) {
      if (TEMPLATE_MAP[selectedTemplate]) {
        setConfig(TEMPLATE_MAP[selectedTemplate]);
        showNotification(t('notif_reset_complete'));
      }
    }
  };

  const handleSaveProject = () => {
    localStorage.setItem('youmi_project_config', JSON.stringify(config));
    showNotification(t('notif_saved_success'));
  };

  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `youmi-project-config-${config.siteInfo.siteName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification(t('notif_json_exported'));
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (files && files.length > 0) {
      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.siteInfo && parsed.header) {
            setConfig(parsed);
            localStorage.setItem('youmi_project_config', JSON.stringify(parsed));
            showNotification(t('notif_json_imported'));
          } else {
            alert(t('err_invalid_json'));
          }
        } catch (error) {
          alert(t('err_parse_fail'));
        }
      };
    }
  };

  const showNotification = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => {
      setSaveNotification(null);
    }, 4000);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const order = config.sectionOrder || ['header', 'menu', 'hero', 'categories', 'footer'];
    const newOrder = [...order];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      const temp = newOrder[index];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = temp;
      setConfig((prev) => ({ ...prev, sectionOrder: newOrder }));
      showNotification(language === 'ar' ? '↕️ تم تغيير ترتيب الأقسام!' : '↕️ Section order updated!');
    }
  };

  // Manage individual pack updates
  const updateSiteInfo = (updates: Partial<ProjectConfig['siteInfo']>) => {
    setConfig((prev) => ({ ...prev, siteInfo: { ...prev.siteInfo, ...updates } }));
  };

  const updateHeader = (updates: Partial<ProjectConfig['header']>) => {
    setConfig((prev) => ({ ...prev, header: { ...prev.header, ...updates } }));
  };

  const updateMenu = (updates: Partial<ProjectConfig['menu']>) => {
    setConfig((prev) => ({ ...prev, menu: { ...prev.menu, ...updates } }));
  };

  const updateHero = (updates: Partial<ProjectConfig['hero']>) => {
    setConfig((prev) => ({ ...prev, hero: { ...prev.hero, ...updates } }));
  };

  const updateCategories = (updates: Partial<ProjectConfig['categories']>) => {
    setConfig((prev) => ({ ...prev, categories: { ...prev.categories, ...updates } }));
  };

  const updateFooter = (updates: Partial<ProjectConfig['footer']>) => {
    setConfig((prev) => ({ ...prev, footer: { ...prev.footer, ...updates } }));
  };

  const updateColors = (updates: Partial<ProjectConfig['colors']>) => {
    setConfig((prev) => ({ ...prev, colors: { ...prev.colors, ...updates } }));
  };

  const updateFonts = (updates: Partial<ProjectConfig['fonts']>) => {
    setConfig((prev) => ({ ...prev, fonts: { ...prev.fonts, ...updates } }));
  };

  const updateButtons = (updates: Partial<ProjectConfig['buttons']>) => {
    setConfig((prev) => ({ ...prev, buttons: { ...prev.buttons, ...updates } }));
  };

  // Manage Asset Manager Callbacks
  const triggerOpenAssetManager = (
    category: 'logo' | 'hero' | 'product' | 'category',
    onSelect: (url: string) => void
  ) => {
    setAssetFilterCategory(category);
    setAssetSelectCallback(() => onSelect);
    setIsAssetOpen(true);
  };

  const handleAddAsset = (newAsset: Omit<Asset, 'id'>) => {
    const assetWithId: Asset = {
      ...newAsset,
      id: `custom-${Date.now()}`,
    };
    setAssets((prev) => [assetWithId, ...prev]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((item) => item.id !== id));
  };

  // Toggle dynamic pack selection for compiling output bundle
  const togglePackSelection = (packId: string) => {
    setIncludedPacks((prev) =>
      prev.includes(packId) ? prev.filter((id) => id !== packId) : [...prev, packId]
    );
  };

  const PACKS = [
    { id: 'saasDashboard', code: '📊 CONTROL CENTER', name: language === 'ar' ? 'لوحة القيادة والمشاريع' : 'SaaS Control Panel', icon: Layout, desc: language === 'ar' ? 'متابعة المشاريع، التخزين السحابي، واشتراكات Bybit Pay' : 'Usage statistics, credits, cloud projects, subscription, and payments' },
    { id: 'siteInfo', code: 'PACK-001', name: t('pack_001_name'), icon: Globe, desc: t('pack_001_desc') },
    { id: 'header', code: 'PACK-002', name: t('pack_002_name'), icon: Layout, desc: t('pack_002_desc') },
    { id: 'menu', code: 'PACK-003', name: t('pack_003_name'), icon: MenuIcon, desc: t('pack_003_desc') },
    { id: 'hero', code: 'PACK-004', name: t('pack_004_name'), icon: Sliders, desc: t('pack_004_desc') },
    { id: 'categories', code: 'PACK-005', name: t('pack_005_name'), icon: Grid, desc: t('pack_005_desc') },
    { id: 'footer', code: 'PACK-006', name: t('pack_006_name'), icon: ListCollapse, desc: t('pack_006_desc') },
    { id: 'colors', code: 'PACK-007', name: t('pack_007_name'), icon: Palette, desc: t('pack_007_desc') },
    { id: 'fonts', code: 'PACK-008', name: t('pack_008_name'), icon: Type, desc: t('pack_008_desc') },
    { id: 'buttons', code: 'PACK-009', name: t('pack_009_name'), icon: Square, desc: t('pack_009_desc') },
    { id: 'layoutArranger', code: '↔️ DRAG', name: t('pack_order_name'), icon: ArrowRightLeft, desc: t('pack_order_desc') },
    { id: 'templates', code: '🎨 LIBRARY', name: t('pack_templates_name'), icon: Layers, desc: t('pack_templates_desc') },
    { id: 'packMarketplace', code: '🧩 +100 PACKS', name: t('pack_market_name'), icon: Grid, desc: t('pack_market_desc') },
    { id: 'plugins', code: '🔌 PLUGINS', name: t('pack_plugins_name'), icon: Square, desc: t('pack_plugins_desc') },
    { id: 'aiBuilder', code: '🤖 AI CO-PILOT', name: t('pack_ai_name'), icon: Sparkles, desc: t('pack_ai_desc') },
    { id: 'youmiHub', code: '👑 HUB', name: language === 'ar' ? 'منصة YOUMI Hub' : 'YOUMI Hub', icon: Globe, desc: language === 'ar' ? 'المتجر الرسمي ومجتمع المطورين للحزم والمكونات والقوالب' : 'Official community center & packages marketplace' },
    { id: 'youmiAIHub', code: '🧠 YOUMI-AI', name: language === 'ar' ? 'منصة YOUMI AI Hub' : 'YOUMI AI Hub', icon: Sparkles, desc: language === 'ar' ? 'منصة الذكاء الاصطناعي والأتمتة الرسمية للوكلاء والمخططات' : 'Official Artificial Intelligence Marketplace & Automation Platform' },
    { id: 'developerHub', code: '🔌 WP-DEV', name: language === 'ar' ? 'منصة المطورين المفتوحة' : 'Open Developer Hub', icon: Hammer, desc: language === 'ar' ? 'بناء حزم، إضافات، قوالب مخصصة، تشغيل الـ CLI والمحاكاة الأمنية' : 'Code & publish packs, plugins, themes, CLI, and SDK Sandbox' },
    { id: 'export', code: 'PACK-010', name: t('pack_export_name'), icon: Download, desc: t('pack_export_desc') },
    { id: 'profile', code: '⚙️ SETTINGS', name: language === 'ar' ? 'الإعدادات والملف الشخصي' : 'Settings & Profile', icon: User, desc: language === 'ar' ? 'إدارة اللغة والمظهر وكلمة المرور وحفظ المشاريع سحابياً' : 'Manage settings, theme, language, and cloud sync' },
  ];

  if (userSession?.role === 'Admin') {
    PACKS.push({
      id: 'adminControl',
      code: '👑 ADMIN',
      name: language === 'ar' ? 'لوحة تحكم المسؤول' : 'Admin Control',
      icon: Shield,
      desc: language === 'ar' ? 'التحكم الكامل في العضوية وإعدادات المنصة' : 'Full platform control and membership management'
    });
  }

  const handlePackClick = (packId: string) => {
    if (packId === 'saasDashboard') {
      setActivePackId('saasDashboard');
      setIsDrawerOpen(false);
      showNotification(language === 'ar' ? '📊 تم فتح لوحة القيادة والمشاريع' : '📊 Opened SaaS Control Panel');
      return;
    }
    if (packId === 'youmiAIHub') {
      setActivePackId('youmiAIHub');
      setIsDrawerOpen(false);
      showNotification(language === 'ar' ? '🧠 تم فتح منصة YOUMI AI Hub' : '🧠 Opened YOUMI AI Hub');
      return;
    }
    if (packId === 'youmiHub') {
      setActivePackId('youmiHub');
      setIsDrawerOpen(false);
      showNotification(language === 'ar' ? '👑 تم فتح منصة YOUMI Hub' : '👑 Opened YOUMI Hub Marketplace');
      return;
    }
    if (packId === 'developerHub') {
      setActivePackId('developerHub');
      setIsDrawerOpen(false);
      showNotification(language === 'ar' ? '🛠️ تم فتح منصة المطورين المفتوحة' : '🛠️ Opened Open Developer Hub');
      return;
    }
    if (activePackId === packId && isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      if (!isDrawerOpen) {
        setBackupConfig(JSON.parse(JSON.stringify(config)));
      }
      setActivePackId(packId);
      setIsDrawerOpen(true);
      
      const matchedPack = PACKS.find(p => p.id === packId);
      if (matchedPack) {
        showNotification(language === 'ar' ? `⚙️ تم فتح ${matchedPack.name}` : `⚙️ Opened ${matchedPack.name}`);
      }
    }
  };

  // Active Editor Form Switcher
  const renderActivePackEditor = () => {
    switch (activePackId) {
      case 'profile':
        return (
          <SettingsPanel
            user={userSession!}
            language={language}
            setLanguage={setLanguage}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            currentConfig={config}
            onApplyConfig={setConfig}
            showNotification={showNotification}
          />
        );
      case 'adminControl':
        return (
          <AdminPanel
            user={userSession!}
            language={language}
            showNotification={showNotification}
          />
        );
      case 'siteInfo':
        return (
          <SiteInfoEditor
            config={config.siteInfo}
            onChange={updateSiteInfo}
            colorsConfig={config.colors}
            onColorsChange={updateColors}
            fontsConfig={config.fonts}
            onFontsChange={updateFonts}
            assets={assets}
            openAssetManager={triggerOpenAssetManager}
          />
        );
      case 'header':
        return <HeaderEditor config={config.header} onChange={updateHeader} />;
      case 'menu':
        return <MenuEditor config={config.menu} onChange={updateMenu} />;
      case 'hero':
        return (
          <HeroEditor
            config={config.hero}
            onChange={updateHero}
            assets={assets}
            openAssetManager={triggerOpenAssetManager}
          />
        );
      case 'categories':
        return (
          <CategoriesEditor
            config={config.categories}
            onChange={updateCategories}
            assets={assets}
            openAssetManager={triggerOpenAssetManager}
          />
        );
      case 'footer':
        return <FooterEditor config={config.footer} onChange={updateFooter} />;
      case 'colors':
        return <ColorsEditor config={config.colors} onChange={updateColors} />;
      case 'fonts':
        return <FontsEditor config={config.fonts} onChange={updateFonts} />;
      case 'buttons':
        return (
          <ButtonsEditor
            config={config.buttons}
            onChange={updateButtons}
            brandPrimaryColor={config.colors.primary}
          />
        );
      case 'layoutArranger':
        return (
          <LayoutArranger
            sectionOrder={config.sectionOrder || ['header', 'menu', 'hero', 'categories', 'footer']}
            onChange={(newOrder) => setConfig((prev) => ({ ...prev, sectionOrder: newOrder }))}
            language={language}
          />
        );
      case 'templates':
        return <TemplateLibrary currentConfig={config} onApplyConfig={setConfig} language={language} />;
      case 'packMarketplace':
        return (
          <PackMarketplace
            includedPacks={includedPacks}
            onTogglePack={togglePackSelection}
            language={language}
          />
        );
      case 'plugins':
        return (
          <PluginSystem
            plugins={config.plugins || []}
            onChange={(newPlugins) => setConfig((prev) => ({ ...prev, plugins: newPlugins }))}
            language={language}
          />
        );
      case 'aiBuilder':
        return <AIBuilder onApplyConfig={setConfig} language={language} />;
      case 'export':
        const packNames: Record<string, string> = {};
        PACKS.forEach((p) => {
          packNames[p.id] = p.name;
        });
        return (
          <ExportView
            config={config}
            includedPacks={includedPacks}
            togglePackSelection={togglePackSelection}
            packNames={packNames}
          />
        );
      default:
        return null;
    }
  };

  // --- VS CODE INTERFACE STATE ---
  const [openTabs, setOpenTabs] = useState<string[]>(['saasDashboard']);
  const [sidebarTab, setSidebarTab] = useState<'explorer' | 'search' | 'git' | 'ai' | 'marketplace' | 'deploy' | 'settings'>('explorer');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useState<boolean>(false);
  const [bottomPanelTab, setBottomPanelTab] = useState<'terminal' | 'ai' | 'console' | 'logs' | 'deploy' | 'history'>('terminal');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [splitPreview, setSplitPreview] = useState<boolean>(true);
  const [simulatedTerminalInput, setSimulatedTerminalInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'youmi-builder@2.4.2-stable dev',
    '[vite] hot module replacement disabled by platform.',
    '[server] Express listening on port 3000 (0.0.0.0)...',
    '[database] loaded local storage profile: ' + (config?.siteInfo?.siteName || 'Amine Store'),
    'youmi-cli ready. Type "help" to see available commands.',
    ''
  ]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[11:01:00] Initialized YOUMI compiler.',
    '[11:01:02] Connected to local storage session.'
  ]);

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'store-config': true,
    'sections': true,
    'views': true,
  });

  const [isGlobalPropsOpen, setIsGlobalPropsOpen] = useState<boolean>(true);
  const [isBlockLayersOpen, setIsBlockLayersOpen] = useState<boolean>(true);
  const [isActivePacksOpen, setIsActivePacksOpen] = useState<boolean>(true);
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState<boolean>(false);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const addConsoleLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, `[${time}] ${message}`]);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = simulatedTerminalInput.trim();
    if (!cmd) return;
    
    setTerminalLogs(prev => [...prev, `youmi-user@local-builder:~$ ${cmd}`]);
    const lowerCmd = cmd.toLowerCase();
    
    setTimeout(() => {
      if (lowerCmd === 'help') {
        setTerminalLogs(prev => [...prev, 
          'Available commands:',
          '  help               Show this help manual',
          '  npm run build      Compile current configurations into distribution build',
          '  git status         Display unsaved configurations status',
          '  youmi deploy       Simulate cloud deployment of the current template',
          '  clear              Clear terminal history logs',
          ''
        ]);
      } else if (lowerCmd === 'npm run build' || lowerCmd === 'npm run build-all') {
        setTerminalLogs(prev => [...prev,
          'INFO: Running "npm run build" in workspace root...',
          'vite v6.2.3 building for production...',
          '✓ 425 modules transformed.',
          'rendering chunks...',
          'dist/index.html                     3.42 kB │ info: gzip: 1.21 kB',
          'dist/assets/index-D7yB8p9x.css     182.41 kB │ info: gzip: 24.50 kB',
          'dist/assets/index-G3k8w0Pq.js      512.90 kB │ info: gzip: 114.20 kB',
          '✓ built in 1.48s',
          'SUCCESS: Compilation completed. Bundled assets ready for export!',
          ''
        ]);
        showNotification(language === 'ar' ? '🚀 تم بناء وتجميع القالب بنجاح!' : '🚀 Production build compiled successfully!');
      } else if (lowerCmd === 'git status') {
        setTerminalLogs(prev => [...prev,
          'On branch main',
          'Your branch is up to date with "origin/main".',
          '',
          'Changes not staged for commit:',
          '  (use "git add <file>..." to update what will be committed)',
          '  (use "git restore <file>..." to discard changes in working directory)',
          '        modified:   store-config/siteInfo.json',
          '        modified:   store-config/colors.json',
          '',
          'no changes added to commit (use "git add" and/or "git commit -a")',
          ''
        ]);
      } else if (lowerCmd === 'youmi deploy') {
        setTerminalLogs(prev => [...prev,
          'Deploying to live environment...',
          'Connecting to server container...',
          'Uploading store configuration manifest template.json...',
          'Syncing 9 packs and resources...',
          'Deployment successful!',
          'URL: https://ais-dev-a5uowo3b5rt6vpxnyxdl6q-242651518221.europe-west2.run.app',
          ''
        ]);
        showNotification(language === 'ar' ? '☁️ تم نشر المتجر على السحابة بنجاح!' : '☁️ Store successfully deployed to the cloud!');
      } else if (lowerCmd === 'clear') {
        setTerminalLogs([]);
      } else {
        setTerminalLogs(prev => [...prev,
          `sh: command not found: ${cmd}`,
          'Type "help" to see available commands.',
          ''
        ]);
      }
    }, 100);
    
    setSimulatedTerminalInput('');
  };

  // Helper to open a file in tabs
  const openFile = (fileId: string) => {
    if (!openTabs.includes(fileId)) {
      setOpenTabs(prev => [...prev, fileId]);
    }
    setActivePackId(fileId);
    // Auto expand sidebar or show appropriate panel
    if (fileId !== 'saasDashboard' && fileId !== 'youmiHub' && fileId !== 'youmiAIHub' && fileId !== 'developerHub') {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
    addConsoleLog(`Opened file: ${getFileDisplayName(fileId)}`);
  };

  const closeFile = (fileId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updatedTabs = openTabs.filter(t => t !== fileId);
    setOpenTabs(updatedTabs);
    if (activePackId === fileId) {
      if (updatedTabs.length > 0) {
        const nextActive = updatedTabs[updatedTabs.length - 1];
        setActivePackId(nextActive);
        if (nextActive !== 'saasDashboard' && nextActive !== 'youmiHub' && nextActive !== 'youmiAIHub' && nextActive !== 'developerHub') {
          setIsDrawerOpen(true);
        } else {
          setIsDrawerOpen(false);
        }
      } else {
        setActivePackId('saasDashboard');
        setIsDrawerOpen(false);
      }
    }
    addConsoleLog(`Closed file: ${getFileDisplayName(fileId)}`);
  };

  const getFileIcon = (fileId: string) => {
    switch (fileId) {
      case 'saasDashboard':
        return <Layout className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'siteInfo':
      case 'colors':
      case 'fonts':
      case 'buttons':
      case 'profile':
        return <FileJson className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'header':
      case 'menu':
      case 'hero':
      case 'categories':
      case 'footer':
        return <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'templates':
        return <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      case 'packMarketplace':
      case 'plugins':
        return <Grid className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'extensionMarketplace':
        return <Grid className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'aiBuilder':
      case 'youmiAIHub':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'developerHub':
        return <Hammer className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'youmiHub':
        return <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />;
      case 'export':
        return <Download className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      default:
        return <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  const getFileDisplayName = (fileId: string) => {
    switch (fileId) {
      case 'saasDashboard': return 'Dashboard.tsx';
      case 'siteInfo': return 'siteInfo.json';
      case 'colors': return 'colors.json';
      case 'fonts': return 'fonts.json';
      case 'buttons': return 'buttons.json';
      case 'header': return 'Header.tsx';
      case 'menu': return 'MegaMenu.tsx';
      case 'hero': return 'HeroSlider.tsx';
      case 'categories': return 'CategoriesGrid.tsx';
      case 'footer': return 'Footer.tsx';
      case 'templates': return 'Templates.tsx';
      case 'packMarketplace': return 'Marketplace.tsx';
      case 'extensionMarketplace': return 'Extensions.tsx';
      case 'plugins': return 'Plugins.tsx';
      case 'aiBuilder': return 'AIBuilder.tsx';
      case 'developerHub': return 'DevHub.tsx';
      case 'youmiHub': return 'YoumiHub.tsx';
      case 'youmiAIHub': return 'AIHub.tsx';
      case 'export': return 'ExportZip.tsx';
      case 'profile': return 'Settings.json';
      default: return 'file.json';
    }
  };

  const filesStructure = [
    {
      name: 'store-config',
      files: [
        { id: 'siteInfo', name: 'siteInfo.json', label: language === 'ar' ? 'معلومات المتجر' : 'Store Information' },
        { id: 'colors', name: 'colors.json', label: language === 'ar' ? 'الألوان والهوية' : 'Colors & Theme' },
        { id: 'fonts', name: 'fonts.json', label: language === 'ar' ? 'الخطوط والطباعة' : 'Typography Fonts' },
        { id: 'buttons', name: 'buttons.json', label: language === 'ar' ? 'أنماط الأزرار' : 'Button Styles' },
        { id: 'profile', name: 'Settings.json', label: language === 'ar' ? 'خيارات النظام' : 'Global Settings' },
      ]
    },
    {
      name: 'sections',
      files: [
        { id: 'header', name: 'Header.tsx', label: language === 'ar' ? 'ترويسة الموقع' : 'Header Block' },
        { id: 'menu', name: 'MegaMenu.tsx', label: language === 'ar' ? 'القائمة المنسدلة' : 'Mega Menu' },
        { id: 'hero', name: 'HeroSlider.tsx', label: language === 'ar' ? 'الواجهة والمتحرك' : 'Hero Image Slider' },
        { id: 'categories', name: 'CategoriesGrid.tsx', label: language === 'ar' ? 'شبكة التصنيفات' : 'Categories Grid' },
        { id: 'footer', name: 'Footer.tsx', label: language === 'ar' ? 'تذييل الموقع' : 'Footer Block' },
      ]
    },
    {
      name: 'views',
      files: [
        { id: 'saasDashboard', name: 'Dashboard.tsx', label: language === 'ar' ? 'لوحة القيادة والمشاريع' : 'SaaS Control Center' },
        { id: 'templates', name: 'Templates.tsx', label: language === 'ar' ? 'مكتبة القوالب' : 'Templates Library' },
        { id: 'packMarketplace', name: 'Marketplace.tsx', label: language === 'ar' ? 'متجر الحزم المتقدمة' : 'Packs Marketplace' },
        { id: 'extensionMarketplace', name: 'Extensions.tsx', label: language === 'ar' ? 'سوق الملحقات البرمجية' : 'VS Code Extension Marketplace' },
        { id: 'plugins', name: 'Plugins.tsx', label: language === 'ar' ? 'نظام الإضافات' : 'Plugin Installer' },
        { id: 'aiBuilder', name: 'AIBuilder.tsx', label: language === 'ar' ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant Co-Pilot' },
        { id: 'developerHub', name: 'DevHub.tsx', label: language === 'ar' ? 'محاكي المطورين' : 'Open Developer Sandbox' },
        { id: 'youmiHub', name: 'YoumiHub.tsx', label: language === 'ar' ? 'منصة YOUMI Hub' : 'YOUMI Community Hub' },
        { id: 'youmiAIHub', name: 'AIHub.tsx', label: language === 'ar' ? 'منصة الذكاء والوكلاء' : 'AI Marketplace Hub' },
        { id: 'export', name: 'ExportZip.tsx', label: language === 'ar' ? 'النشر وتصدير الملفات' : 'Build & Deploy ZIP' },
      ]
    }
  ];

  const getMenuItems = (menu: string) => {
    switch (menu) {
      case 'File':
        return [
          { label: language === 'ar' ? '✨ مشروع جديد (جميع الأنواع)' : '✨ New Project (All Types)', action: () => setIsNewProjectModalOpen(true) },
          { label: language === 'ar' ? 'ملف جديد (إضافة قسم)' : 'New File (Add Section)', action: () => openFile('layoutArranger') },
          { label: language === 'ar' ? 'حفظ المتجر' : 'Save Config', action: handleSaveProject, shortcut: 'Ctrl+S' },
          { label: language === 'ar' ? 'تصدير بصيغة JSON' : 'Export JSON', action: handleExportConfig },
          { label: language === 'ar' ? 'تصدير وتحميل ZIP' : 'Export & Build ZIP', action: () => openFile('export') },
          { type: 'separator' },
          { label: language === 'ar' ? 'إغلاق المحرر النشط' : 'Close Active Editor', action: () => { if (activePackId) closeFile(activePackId); } },
          { label: language === 'ar' ? 'تسجيل الخروج' : 'Log Out', action: handleLogout }
        ];
      case 'Edit':
        return [
          { label: language === 'ar' ? 'تراجع' : 'Undo', action: handleUndo, shortcut: 'Ctrl+Z' },
          { label: language === 'ar' ? 'إعادة' : 'Redo', action: handleRedo, shortcut: 'Ctrl+Y' },
          { type: 'separator' },
          { label: language === 'ar' ? 'قص القسم' : 'Cut Section', action: () => showNotification(language === 'ar' ? '✂️ قص القسم المحدد' : '✂️ Selected section cut to builder clipboard.') },
          { label: language === 'ar' ? 'نسخ القسم' : 'Copy Section', action: () => showNotification(language === 'ar' ? '📋 نسخ القسم المحدد' : '📋 Selected section copied to builder clipboard.') },
          { label: language === 'ar' ? 'لصق القسم' : 'Paste Section', action: () => showNotification(language === 'ar' ? '📥 لصق القسم' : '📥 Section pasted from clipboard.') }
        ];
      case 'Selection':
        return [
          { label: language === 'ar' ? 'تحديد كافة الأقسام' : 'Select All Sections', action: () => showNotification(language === 'ar' ? '✓ تم تحديد كل أقسام الموقع' : '✓ Selected all sections in active order.') },
          { label: language === 'ar' ? 'توسيع التحديد' : 'Expand Selection', action: () => showNotification(language === 'ar' ? '⤢ توسيع التحديد' : '⤢ Expanded active section layout cursor.') },
          { label: language === 'ar' ? 'تقليص التحديد' : 'Shrink Selection', action: () => showNotification(language === 'ar' ? '⤡ تقليص التحديد' : '⤡ Shrunk active section layout cursor.') }
        ];
      case 'View':
        return [
          { label: language === 'ar' ? 'المستكشف (Explorer)' : 'Explorer', action: () => { setSidebarTab('explorer'); setIsSidebarCollapsed(false); } },
          { label: language === 'ar' ? 'إدارة التعديلات (Source Control)' : 'Source Control', action: () => { setSidebarTab('git'); setIsSidebarCollapsed(false); } },
          { label: language === 'ar' ? 'سوق الملحقات (Marketplace)' : 'Extension Marketplace', action: () => { setSidebarTab('marketplace'); setIsSidebarCollapsed(false); openFile('extensionMarketplace'); } },
          { label: language === 'ar' ? 'دردشة الذكاء الاصطناعي (AI Co-pilot)' : 'AI Co-pilot Chat', action: () => { setSidebarTab('ai'); setIsSidebarCollapsed(false); } },
          { type: 'separator' },
          { label: language === 'ar' ? 'تبديل الشريط الجانبي' : 'Toggle Sidebar', action: () => setIsSidebarCollapsed(!isSidebarCollapsed) },
          { label: language === 'ar' ? 'تبديل لوحة التحكم السفلية' : 'Toggle Bottom Panel', action: () => setIsBottomPanelCollapsed(!isBottomPanelCollapsed) },
          { label: language === 'ar' ? 'تبديل لوحة الخصائص' : 'Toggle Properties Panel', action: () => setIsPropertiesCollapsed(!isPropertiesCollapsed) }
        ];
      case 'Go':
        return [
          { label: language === 'ar' ? 'الذهاب إلى الملف' : 'Go to File', action: () => { setSidebarTab('explorer'); setIsSidebarCollapsed(false); } },
          { label: language === 'ar' ? 'الذهاب إلى القسم النشط' : 'Go to Active Section', action: () => { if (activePackId) openFile(activePackId); } },
          { type: 'separator' },
          { label: language === 'ar' ? 'القسم التالي' : 'Next Section', action: () => showNotification(language === 'ar' ? 'الذهاب للقسم التالي' : 'Navigating to next section block') },
          { label: language === 'ar' ? 'القسم السابق' : 'Previous Section', action: () => showNotification(language === 'ar' ? 'الذهاب للقسم السابق' : 'Navigating to previous section block') }
        ];
      case 'Run':
        return [
          { label: language === 'ar' ? 'بناء وتحويل المشروع' : 'Compile & Build Project', action: () => openFile('export') },
          { label: language === 'ar' ? 'تشغيل المعاينة المباشرة' : 'Start Live Preview', action: () => { setSplitPreview(true); showNotification(language === 'ar' ? 'تم تشغيل المعاينة المباشرة' : 'Live simulator synchronization active.'); } },
          { type: 'separator' },
          { label: language === 'ar' ? 'تشغيل منقح الأخطاء' : 'Start Debugging', action: () => showNotification(language === 'ar' ? 'بدء تشغيل منقح الأخطاء الافتراضي' : 'Simulating debugger start on Port 3000') }
        ];
      case 'Terminal':
        return [
          { label: language === 'ar' ? 'منفذ أوامر جديد' : 'New Terminal', action: () => { setIsBottomPanelCollapsed(false); setBottomPanelTab('terminal'); } },
          { label: language === 'ar' ? 'تشغيل مهمة البناء الكلي' : 'Run Build Task', action: () => { setIsBottomPanelCollapsed(false); setBottomPanelTab('terminal'); setTerminalLogs(prev => [...prev, 'youmi-cli: running build tasks...', '[1/3] Bundling modular packs...', '[2/3] Generating responsive assets...', '[3/3] Build completed successfully in 452ms.', '']); } },
          { type: 'separator' },
          { label: language === 'ar' ? 'مسح لوحة الأوامر' : 'Clear Terminal', action: () => setTerminalLogs(['youmi-builder terminal history cleared.', '']) }
        ];
      case 'Help':
        return [
          { label: language === 'ar' ? 'عن يومي بيلدر' : 'About YOUMI Builder', action: () => showNotification('YOUMI Builder v2.4.2 IDE • Built for Algerian & Moroccan E-commerce.') },
          { label: language === 'ar' ? 'مرجع اختصارات الكيبورد' : 'Keyboard Shortcuts Reference', action: () => showNotification('Shortcuts: Ctrl+S (Save), Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+E (Export JSON)') },
          { type: 'separator' },
          { label: language === 'ar' ? 'التحقق من التحديثات' : 'Check for Updates...', action: () => { showNotification(language === 'ar' ? '🔄 يتم التحقق من التحديثات...' : '🔄 Checking for updates...'); setTimeout(() => showNotification(language === 'ar' ? '✓ نظام يومي بيلدر محدث لأحدث إصدار!' : '✓ YOUMI Builder is already at the latest version!'), 1500); } }
        ];
      default:
        return [];
    }
  };

  if (!userSession) {
    return (
      <AuthScreen 
        onLoginSuccess={handleLoginSuccess} 
        language={language} 
        setLanguage={setLanguage} 
      />
    );
  }

  // STANDALONE ISOLATED ADMIN PORTAL PAGE
  if (currentPortalView === 'adminPortal') {
    if (userSession.role !== 'Admin') {
      return (
        <div className="h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4" dir={dir}>
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black">{language === 'ar' ? 'عفواً، الدخول مقتصر على مسؤولي المنصة' : 'Access Denied: Admin Privileges Required'}</h2>
          <p className="text-xs text-slate-400 max-w-md">
            {language === 'ar' 
              ? 'حسابك الحالي ليس لديه صلاحية الوصول للوحة التحكم العامة للمنصة. يرجى تسجيل الدخول بحساب مسؤول.'
              : 'Your current session does not possess administrator rights. Please switch to an admin account.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPortalView('builder')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {language === 'ar' ? 'العودة لمحرر المتاجر' : 'Return to Store Builder'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col select-none text-xs overflow-y-auto" dir={dir}>
        {/* Isolated Admin Portal Top Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-50 backdrop-blur-md bg-slate-900/90">
          <div className="flex items-center gap-3">
            <BrandLogo size={32} showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm text-white tracking-wide">{language === 'ar' ? 'بوابة إدارة المنصة الرسمية' : 'YOUMI Platform Admin Portal'}</h1>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[9px] font-black uppercase">
                  {language === 'ar' ? 'منفصلة' : 'Isolated Page'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                {language === 'ar' ? 'لوحة تحكم كاملة ومستقلة لمشرفي النظام وإدارة الأعضاء' : 'Standalone Management & System Operations Console'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live System Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-400">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span>{language === 'ar' ? 'خادم المنصة: نشط' : 'Server Status: Operational'}</span>
            </div>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 border border-slate-700"
            >
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Return to Builder IDE Button */}
            <button
              onClick={() => setCurrentPortalView('builder')}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-teal-600/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الانتقال لمحرر المتاجر IDE' : 'Switch to Store Builder'}</span>
            </button>

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-black text-xs uppercase">
                {userSession.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-start">
                <span className="font-extrabold text-xs block text-slate-200 leading-none">{userSession.name}</span>
                <span className="text-[9px] text-rose-400 font-black block leading-none mt-0.5">{language === 'ar' ? 'مدير المنصة' : 'Platform Administrator'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
                title={language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
              >
                <Power className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Body with full size Admin Panel */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-sm">
            <Suspense fallback={<div className="p-12 text-center text-slate-400">جاري تحميل لوحة التحكم...</div>}>
              <AdminPanel user={userSession} language={language} showNotification={showNotification} />
            </Suspense>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col select-none text-[13px] text-[#CCCCCC] bg-[#1E1E1E]" 
      style={{ fontFamily: '"Segoe UI", "Inter", "JetBrains Sans", system-ui, sans-serif' }}
      dir={dir}
    >
      {/* 1. TITLE BAR */}
      <div className="h-[35px] bg-[#2D2D30] border-b border-[#3C3C3C] flex items-center justify-between px-3 select-none shrink-0 z-50">
        <div className="flex items-center gap-3">
          {/* macOS Traffic Lights */}
          <div className="flex gap-1.5 mr-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] block hover:opacity-80 cursor-pointer" onClick={handleLogout} title="Log Out" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] block hover:opacity-80 cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] block hover:opacity-80 cursor-pointer" />
          </div>
          
          {/* App Brand */}
          <div className="flex items-center gap-1.5 font-semibold text-white mr-4">
            <span className="text-[#007ACC] font-black">Y</span>
            <span className="text-[12px] tracking-wide text-slate-300 font-bold uppercase">YOUMI Builder</span>
          </div>

          {/* Menus */}
          <div className="hidden md:flex items-center gap-1.5 text-[12px] text-[#CCCCCC]">
            {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map((menu) => {
              const items = getMenuItems(menu);
              const isOpen = activeMenu === menu;
              return (
                <div key={menu} className="relative">
                  <button 
                    id={`menu-btn-${menu}`}
                    className={`hover:bg-[#3C3C3C] px-2.5 py-1 rounded transition cursor-pointer select-none ${isOpen ? 'bg-[#3C3C3C] text-white font-medium' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(isOpen ? null : menu);
                    }}
                    onMouseEnter={() => {
                      if (activeMenu !== null) {
                        setActiveMenu(menu);
                      }
                    }}
                  >
                    {language === 'ar' ? (
                      menu === 'File' ? 'ملف' :
                      menu === 'Edit' ? 'تعديل' :
                      menu === 'Selection' ? 'تحديد' :
                      menu === 'View' ? 'عرض' :
                      menu === 'Go' ? 'انتقال' :
                      menu === 'Run' ? 'تشغيل' :
                      menu === 'Terminal' ? 'ترمينال' :
                      menu === 'Help' ? 'مساعدة' : menu
                    ) : menu}
                  </button>
                  {isOpen && (
                    <>
                      {/* Invisible backdrop to dismiss the dropdown */}
                      <div 
                        className="fixed inset-0 z-40 bg-transparent cursor-default" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(null);
                        }}
                      />
                      <div className={`absolute ${dir === 'rtl' ? 'right-0' : 'left-0'} mt-1 w-56 bg-[#252526] border border-[#454545] rounded shadow-2xl py-1 z-50 animate-fade-in`}>
                        {items.map((item, idx) => {
                          if (item.type === 'separator') {
                            return <div key={idx} className="h-px bg-[#454545] my-1" />;
                          }
                          return (
                            <button
                              key={idx}
                              className={`w-full text-left ${dir === 'rtl' ? 'text-right' : 'text-left'} px-3 py-1.5 hover:bg-[#007ACC] hover:text-white flex items-center justify-between transition cursor-pointer text-xs`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(null);
                                item.action?.();
                              }}
                            >
                              <span className="truncate">{item.label}</span>
                              {item.shortcut && (
                                <span className="text-[10px] text-[#858585] group-hover:text-sky-100 pl-3 font-mono">
                                  {item.shortcut}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Title JSON */}
        <div className="hidden sm:block text-[11px] font-mono text-[#9D9D9D] max-w-sm truncate text-center">
          {config?.siteInfo?.siteName || 'Amine Store'} - youmi-project-config.json - YOUMI Builder
        </div>

        {/* Global Toolbar Controllers */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Save Status Notification */}
          {saveNotification && (
            <div className="px-2 py-0.5 bg-[#252526] border border-[#3C3C3C] text-emerald-400 rounded text-[11px] font-bold animate-fade-in-down flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-ping" />
              <span>{saveNotification}</span>
            </div>
          )}

          {/* New Project Button */}
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-[11px] font-extrabold flex items-center gap-1.5 transition shadow cursor-pointer border border-teal-400/40"
            title={language === 'ar' ? 'إنشاء مشروع جديد بجميع الأنواع الـ 15' : 'Create New Project'}
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ar' ? 'مشروع جديد' : 'New Project'}</span>
          </button>

          {/* Project Type Selector dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#9D9D9D] font-bold uppercase tracking-widest">{language === 'ar' ? 'نوع المشروع' : 'Project Type'}</span>
            <select
              value={config?.siteInfo?.projectType || selectedTemplate}
              onChange={(e) => {
                const typeKey = e.target.value;
                setSelectedTemplate(typeKey);
                if (TEMPLATE_MAP[typeKey]) {
                  const newTpl = TEMPLATE_MAP[typeKey];
                  setConfig({
                    ...newTpl,
                    siteInfo: {
                      ...newTpl.siteInfo,
                      projectType: typeKey as any
                    }
                  });
                  showNotification(language === 'ar' ? `تم تبديل نوع المشروع إلى: ${typeKey}` : `Project type switched to: ${typeKey}`);
                }
              }}
              className="px-2 py-0.5 text-[11px] bg-[#1E1E1E] border border-[#3C3C3C] rounded text-teal-400 font-extrabold focus:outline-none cursor-pointer transition-colors"
            >
              <optgroup label={language === 'ar' ? 'التجارة والمتاجر' : 'Commerce'}>
                <option value="marketplace">🛒 Marketplace (سوق متعدد البائعين)</option>
              </optgroup>
              <optgroup label={language === 'ar' ? 'الأعمال والمؤسسات' : 'Business & Corporate'}>
                <option value="landing">🚀 Landing Page (صفحة هبوط)</option>
                <option value="company">🏢 Company Website (موقع شركة)</option>
                <option value="portfolio">🎨 Portfolio (معرض أعمال)</option>
                <option value="blog">📰 Blog (مدونة ومجلة)</option>
              </optgroup>
              <optgroup label={language === 'ar' ? 'الخدمات والحجوزات' : 'Services & Booking'}>
                <option value="restaurant">🍲 Restaurant (مطعم ومنيو)</option>
                <option value="clinic">🩺 Medical Clinic (عيادة طبية)</option>
                <option value="school">🎓 School & Academy (مدرسة وأكاديمية)</option>
                <option value="hotel">🏨 Hotel & Resort (فندق وحجوزات)</option>
                <option value="realestate">🏡 Real Estate (وكالة عقارات)</option>
                <option value="booking">📅 Booking (منصة حجوزات)</option>
              </optgroup>
              <optgroup label={language === 'ar' ? 'البرمجيات والإدارة' : 'Software & Management'}>
                <option value="saas">⚡ SaaS Dashboard (تطبيق سحابي)</option>
                <option value="cms">📑 CMS (إدارة محتوى)</option>
                <option value="erp">⚙️ ERP System (تخطيط موارد)</option>
                <option value="crm">📈 CRM System (علاقات العملاء)</option>
              </optgroup>
            </select>
          </div>

          {/* Admin Portal Gateway Button */}
          {userSession?.role === 'Admin' && (
            <button
              onClick={() => setCurrentPortalView('adminPortal')}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-extrabold flex items-center gap-1.5 transition shadow cursor-pointer border border-rose-400/40"
              title={language === 'ar' ? 'الانتقال لصفحة مسؤول المنصة المستقلة' : 'Switch to Isolated Admin Portal'}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'صفحة المسؤول (Admin Portal)' : 'Admin Portal'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN LAYOUT: ACTIVITY BAR + SIDEBAR (EXPLORER) + CENTRAL WORKSPACE + PROPERTIES PANEL */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* A. ACTIVITY BAR */}
        <div className="w-[48px] bg-[#181818] border-r border-[#3C3C3C] flex flex-col justify-between items-center py-2 shrink-0 select-none z-30">
          <div className="flex flex-col gap-3 w-full">
            {[
              { id: 'explorer', icon: FolderOpen, label: 'Explorer' },
              { id: 'search', icon: Search, label: 'Search' },
              { id: 'git', icon: RotateCcw, label: 'Source Control' },
              { id: 'ai', icon: Sparkles, label: 'AI Assistant' },
              { id: 'marketplace', icon: Grid, label: 'Extensions & Packs' },
              { id: 'deploy', icon: Download, label: 'Publish & Deploy' },
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = sidebarTab === item.id && !isSidebarCollapsed;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (sidebarTab === item.id && !isSidebarCollapsed) {
                      setIsSidebarCollapsed(true);
                    } else {
                      setSidebarTab(item.id as any);
                      setIsSidebarCollapsed(false);
                    }
                  }}
                  className={`w-full py-2 flex items-center justify-center relative transition-all group cursor-pointer ${
                    isActive ? 'text-white border-l-2 border-[#007ACC]' : 'text-[#858585] hover:text-white'
                  }`}
                  title={item.label}
                >
                  <IconComponent className="w-5 h-5" />
                  {/* Tooltip */}
                  <span className="absolute left-[54px] bg-[#252526] border border-[#3C3C3C] text-white text-[11px] px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Activity Bar Fixed Bottom Buttons */}
          <div className="flex flex-col gap-2 w-full items-center">
            {/* Account Profile button */}
            <button 
              onClick={() => {
                setSidebarTab('settings');
                setIsSidebarCollapsed(false);
              }}
              className="w-8 h-8 rounded-full bg-[#007ACC] text-white flex items-center justify-center text-[11px] font-black uppercase hover:opacity-90 cursor-pointer relative group"
              title={`${userSession.name} (${userSession.role})`}
            >
              {userSession.name.charAt(0)}
              <span className="absolute left-[54px] bg-[#252526] border border-[#3C3C3C] text-white text-[11px] px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                Account: {userSession.name} ({userSession.role})
              </span>
            </button>

            {/* Settings gear */}
            <button 
              onClick={() => openFile('profile')}
              className="w-full py-2 flex items-center justify-center text-[#858585] hover:text-white transition cursor-pointer relative group"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
              <span className="absolute left-[54px] bg-[#252526] border border-[#3C3C3C] text-white text-[11px] px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                System settings
              </span>
            </button>
          </div>
        </div>

        {/* B. SIDEBAR (EXPLORER / ACTIVE PANE) */}
        {!isSidebarCollapsed && (
          <div className="w-[260px] bg-[#252526] border-r border-[#3C3C3C] flex flex-col shrink-0 select-none min-h-0 text-[#CCCCCC]">
            {/* Sidebar header */}
            <div className="px-3 py-2 border-b border-[#3C3C3C] flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-[#9D9D9D]">
              <span>
                {sidebarTab === 'explorer' && 'Explorer: workspace'}
                {sidebarTab === 'search' && 'Search files'}
                {sidebarTab === 'git' && 'Source Control (Git)'}
                {sidebarTab === 'ai' && 'AI Co-pilot'}
                {sidebarTab === 'marketplace' && 'Marketplace Packs'}
                {sidebarTab === 'deploy' && 'Deploy & Publish'}
                {sidebarTab === 'settings' && 'User Preferences'}
              </span>
              <button 
                onClick={() => setIsSidebarCollapsed(true)} 
                className="hover:bg-[#3C3C3C] p-0.5 rounded text-[#858585] hover:text-white cursor-pointer"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar content container */}
            <div className="flex-1 overflow-y-auto text-[13px]">
              
              {/* TAB 1: EXPLORER VIEW */}
              {sidebarTab === 'explorer' && (
                <div className="py-2">
                  {/* Collapsible Section: Open Editors */}
                  <div className="mb-2">
                    <div className="px-3 py-1 flex items-center gap-1.5 font-bold uppercase text-[10px] text-[#9D9D9D] hover:bg-[#2D2D30] cursor-pointer">
                      <ChevronDown className="w-3 h-3" />
                      <span>Open Editors</span>
                    </div>
                    <div className="pl-6 space-y-1 mt-1">
                      {openTabs.map((tabId) => (
                        <div 
                          key={tabId} 
                          onClick={() => setActivePackId(tabId)}
                          className={`flex items-center justify-between group px-2 py-1 rounded cursor-pointer ${
                            activePackId === tabId ? 'bg-[#37373D] text-white' : 'hover:bg-[#2D2D30]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {getFileIcon(tabId)}
                            <span className="text-[12px]">{getFileDisplayName(tabId)}</span>
                          </div>
                          <button 
                            onClick={(e) => closeFile(tabId, e)}
                            className="opacity-0 group-hover:opacity-100 hover:bg-[#4C4C4C] p-0.5 rounded text-[#CCCCCC]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {openTabs.length === 0 && (
                        <div className="text-[11px] text-[#858585] italic py-1">No editors open.</div>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Section: Workspace Files Tree */}
                  <div>
                    <div className="px-3 py-1 flex items-center gap-1.5 font-bold uppercase text-[10px] text-[#9D9D9D] hover:bg-[#2D2D30] cursor-pointer">
                      <ChevronDown className="w-3 h-3" />
                      <span>Workspace (YOUMI-BUILDER)</span>
                    </div>
                    
                    {/* Search inside Explorer */}
                    <div className="px-3 py-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Filter files..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#1E1E1E] border border-[#3C3C3C] text-white px-2 py-1 text-xs rounded focus:outline-none focus:border-[#007ACC]"
                        />
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Folders Tree */}
                    <div className="pl-3 mt-1">
                      {filesStructure.map((folder) => {
                        const isExpanded = expandedFolders[folder.name];
                        const filteredFiles = folder.files.filter(f => 
                          f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.label.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                        if (filteredFiles.length === 0 && searchQuery) return null;

                        return (
                          <div key={folder.name} className="mb-2">
                            {/* Folder row */}
                            <div 
                              onClick={() => toggleFolder(folder.name)}
                              className="flex items-center gap-1.5 py-1 px-2 hover:bg-[#2D2D30] cursor-pointer text-[#CCCCCC] font-semibold"
                            >
                              {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-[#9D9D9D]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#9D9D9D]" />}
                              <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                              <span className="text-[12px]">{folder.name}</span>
                            </div>

                            {/* Folder files */}
                            {isExpanded && (
                              <div className="pl-6 space-y-0.5 mt-1">
                                {filteredFiles.map((file) => {
                                  const isOpen = openTabs.includes(file.id);
                                  const isActive = activePackId === file.id;
                                  return (
                                    <div
                                      key={file.id}
                                      onClick={() => openFile(file.id)}
                                      className={`flex items-center justify-between group px-2 py-1 rounded cursor-pointer ${
                                        isActive ? 'bg-[#37373D] text-white font-semibold' : 'hover:bg-[#2D2D30] text-[#CCCCCC]'
                                      }`}
                                      title={file.label}
                                    >
                                      <div className="flex items-center gap-2 overflow-hidden">
                                        {getFileIcon(file.id)}
                                        <span className="text-[12px] truncate">{file.name}</span>
                                      </div>
                                      <span className="text-[10px] text-[#858585] opacity-0 group-hover:opacity-100 select-none">
                                        {isOpen ? 'opened' : 'edit'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SEARCH PANEL */}
              {sidebarTab === 'search' && (
                <div className="p-3 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#9D9D9D] block">Search string</label>
                    <input
                      type="text"
                      placeholder="Search across project..."
                      className="w-full bg-[#1E1E1E] border border-[#3C3C3C] text-white px-2 py-1 text-xs rounded focus:outline-none focus:border-[#007ACC]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="text-[11px] text-[#9D9D9D]">
                    Search matches in: <strong className="text-[#007ACC]">youmi-builder</strong> config schemas.
                  </div>
                  {searchQuery && (
                    <div className="space-y-1">
                      <div className="text-xs text-[#007ACC] font-bold">Results:</div>
                      {filesStructure.flatMap(f => f.files).filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(file => (
                        <div 
                          key={file.id} 
                          onClick={() => openFile(file.id)}
                          className="p-1.5 hover:bg-[#2D2D30] rounded cursor-pointer text-xs flex items-center gap-1.5 border border-[#3C3C3C]"
                        >
                          {getFileIcon(file.id)}
                          <div>
                            <div className="font-bold text-white">{file.name}</div>
                            <div className="text-[10px] text-slate-400">{file.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SOURCE CONTROL (GIT / HISTORY) */}
              {sidebarTab === 'git' && (
                <div className="p-3 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#9D9D9D] border-b border-[#3C3C3C] pb-2">
                    <span>Active commits / undo stack</span>
                    <span className="bg-[#37373D] text-white px-1.5 rounded text-[10px]">{history.length} states</span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleSaveProject}
                      className="w-full py-1.5 bg-[#007ACC] hover:bg-[#0062a3] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Commit Changes (Save)</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleUndo}
                        disabled={history.length === 0}
                        className="py-1 bg-[#3C3C3C] hover:bg-[#4C4C4C] disabled:opacity-40 text-white text-xs font-bold rounded transition-colors cursor-pointer"
                      >
                        Undo (Z)
                      </button>
                      <button
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                        className="py-1 bg-[#3C3C3C] hover:bg-[#4C4C4C] disabled:opacity-40 text-white text-xs font-bold rounded transition-colors cursor-pointer"
                      >
                        Redo (Y)
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-[10px] uppercase font-bold text-[#9D9D9D] mb-2">History logs (Commits):</div>
                    <div className="space-y-1.5 max-h-[250px] overflow-y-auto pl-1">
                      {history.map((hState, index) => (
                        <div key={index} className="text-[11px] border-l-2 border-amber-500 pl-2 py-1 hover:bg-[#2D2D30] rounded-r">
                          <span className="text-[#007ACC] font-mono">commit_{index}</span>
                          <span className="block text-[#9D9D9D] text-[10px]">Site: {hState.siteInfo.siteName}</span>
                        </div>
                      ))}
                      {history.length === 0 && (
                        <div className="text-[11px] text-[#858585] italic">No local commits recorded. Edit files to seed history.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: AI CO-PILOT CHAT */}
              {sidebarTab === 'ai' && (
                <div className="p-3 flex flex-col h-[calc(100vh-140px)] min-h-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-bold text-xs">AI CO-PILOT CHAT</span>
                  </div>
                  <div className="flex-1 overflow-y-auto bg-[#1E1E1E] border border-[#3C3C3C] rounded p-2 text-xs font-mono mb-2 space-y-2">
                    <div className="text-purple-400">[Gemini 3.5 Assistant]:</div>
                    <div className="text-[#CCCCCC]">
                      {language === 'ar' 
                        ? 'أهلاً بك! أنا مساعدك الذكي المدمج في بيئة المطورين VS Code. كيف تريد تعديل المتجر؟ يمكنك سؤالي عن الألوان، الخطوط، أو تفعيل أقسام معينة.'
                        : 'Welcome! I am your smart AI co-pilot. I can modify colors, rearrange sections, change fonts or rewrite elements directly inside VS Code. How can I assist you today?'}
                    </div>
                    <div className="pt-2 border-t border-[#3C3C3C] flex flex-col gap-1.5">
                      <button 
                        onClick={() => openFile('aiBuilder')}
                        className="w-full text-left p-1 bg-[#252526] hover:bg-[#2D2D30] rounded text-[10px] text-teal-400 border border-[#3C3C3C]"
                      >
                        → Open Full AI Builder Sandbox
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MARKETPLACE / EXTENSIONS */}
              {sidebarTab === 'marketplace' && (
                <div className="p-3 space-y-3">
                  <button
                    onClick={() => openFile('extensionMarketplace')}
                    className="w-full py-2 bg-[#007ACC] hover:bg-sky-600 text-white font-bold rounded text-center cursor-pointer transition flex items-center justify-center gap-1.5 shadow-sm text-xs"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Open VS Code Marketplace</span>
                  </button>

                  <div className="text-xs text-[#9D9D9D] font-bold border-b border-[#3C3C3C] pb-1.5 pt-1">
                    INSTALLED EXTENSIONS
                  </div>
                  <div className="space-y-2">
                    {PACKS.slice(0, 10).map((pack) => {
                      const isInstalled = includedPacks.includes(pack.id);
                      return (
                        <div key={pack.id} className="p-2 bg-[#1E1E1E] border border-[#3C3C3C] rounded flex items-start gap-2 text-xs hover:border-[#007ACC] transition">
                          <div className="p-1 bg-[#2D2D30] rounded text-teal-400 shrink-0">
                            {React.createElement(pack.icon, { className: 'w-4 h-4' })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-white truncate flex items-center justify-between">
                              <span>{pack.name}</span>
                              <span className="text-[8px] font-mono opacity-50">{pack.code}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">{pack.desc}</div>
                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800">
                              <span className="text-[9px] text-[#007ACC] font-bold">YOUMI Inc.</span>
                              <button 
                                onClick={() => togglePackSelection(pack.id)}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  isInstalled ? 'bg-emerald-800 text-white' : 'bg-[#007ACC] text-white hover:bg-sky-600'
                                }`}
                              >
                                {isInstalled ? 'Disable' : 'Enable'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: DEPLOY & PUBLISH */}
              {sidebarTab === 'deploy' && (
                <div className="p-3 space-y-3 text-xs">
                  <div className="font-bold uppercase text-[10px] text-[#9D9D9D] border-b border-[#3C3C3C] pb-2">Deploy Workspace</div>
                  <button
                    onClick={() => openFile('export')}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded text-center cursor-pointer transition"
                  >
                    🚀 Compile Workspace
                  </button>
                  <button
                    onClick={handleExportConfig}
                    className="w-full py-2 bg-[#3C3C3C] hover:bg-[#4C4C4C] text-white font-bold rounded text-center cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON config</span>
                  </button>
                  <div className="pt-2">
                    <label className="w-full py-2 bg-[#3C3C3C] hover:bg-[#4C4C4C] text-white font-bold rounded text-center cursor-pointer transition flex items-center justify-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Upload JSON config</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportConfig}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 7: SETTINGS & ACCOUNT */}
              {sidebarTab === 'settings' && (
                <div className="p-3 space-y-3">
                  <div className="text-xs text-[#9D9D9D] font-bold border-b border-[#3C3C3C] pb-1.5">
                    USER SESSION PROFILE
                  </div>
                  <div className="p-3 bg-[#1E1E1E] border border-[#3C3C3C] rounded space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#007ACC] text-white flex items-center justify-center text-[10px] font-black uppercase">
                        {userSession.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{userSession.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{userSession.email}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                      <div>Role: <strong className="text-teal-400 font-mono">{userSession.role}</strong></div>
                      <div>Plan: <strong className="text-amber-500 font-mono">{userSession.subscription || 'Developer'}</strong></div>
                      <div>Session: <span className="text-emerald-400 font-bold">Active</span></div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full mt-2 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-[11px] font-bold transition cursor-pointer"
                    >
                      {t('btn_logout')}
                    </button>
                  </div>

                  {/* Quick Translation Toggle */}
                  <div className="pt-2">
                    <div className="text-[10px] uppercase font-bold text-[#9D9D9D] mb-1.5">IDE LANGUAGE</div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextLang = language === 'ar' ? 'en' : 'ar';
                        setLanguage(nextLang);
                        showNotification(nextLang === 'ar' ? t('notif_lang_ar') : t('notif_lang_en'));
                      }}
                      className="w-full py-1.5 bg-[#3C3C3C] hover:bg-[#4C4C4C] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Languages className="w-3.5 h-3.5 text-teal-400" />
                      <span>{language === 'ar' ? 'English' : 'العربية'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* C. CENTRAL WORKSPACE AREA (VS CODE TABS + EDITORS) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1E1E1E]">
          
          {/* TABS HEADER */}
          <div className="h-[35px] bg-[#2D2D30] border-b border-[#3C3C3C] flex items-center justify-between select-none shrink-0 z-10 overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="flex items-center h-full">
              {openTabs.map((tabId) => {
                const isActive = activePackId === tabId;
                return (
                  <div
                    key={tabId}
                    onClick={() => {
                      setActivePackId(tabId);
                      if (tabId !== 'saasDashboard' && tabId !== 'youmiHub' && tabId !== 'youmiAIHub' && tabId !== 'developerHub') {
                        setIsDrawerOpen(true);
                      } else {
                        setIsDrawerOpen(false);
                      }
                    }}
                    className={`h-full px-3.5 flex items-center gap-2 border-r border-[#3C3C3C] text-[12px] cursor-pointer transition relative group ${
                      isActive 
                        ? 'bg-[#1E1E1E] text-white font-semibold border-t-2 border-[#007ACC]' 
                        : 'bg-[#2D2D30] text-[#9D9D9D] hover:bg-[#333333] hover:text-white'
                    }`}
                  >
                    {getFileIcon(tabId)}
                    <span>{getFileDisplayName(tabId)}</span>
                    <button
                      onClick={(e) => closeFile(tabId, e)}
                      className="opacity-40 hover:opacity-100 hover:bg-[#4C4C4C] p-0.5 rounded transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              {openTabs.length === 0 && (
                <div className="px-4 text-xs italic text-[#858585] self-center">Workspace empty. Click a file in the tree to edit.</div>
              )}
            </div>

            {/* Split Preview Controller */}
            <div className="px-3 flex items-center gap-2">
              {activePackId !== 'saasDashboard' && activePackId !== 'youmiHub' && activePackId !== 'youmiAIHub' && activePackId !== 'developerHub' && (
                <button
                  onClick={() => setSplitPreview(!splitPreview)}
                  className={`p-1 rounded hover:bg-[#3C3C3C] cursor-pointer transition ${
                    splitPreview ? 'text-[#007ACC]' : 'text-slate-400 hover:text-white'
                  }`}
                  title={splitPreview ? 'Close Live Storefront Preview' : 'Split Editor to Right (Show Live Preview)'}
                >
                  <Columns className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsPropertiesCollapsed(!isPropertiesCollapsed)}
                className={`p-1 rounded hover:bg-[#3C3C3C] cursor-pointer transition ${
                  !isPropertiesCollapsed ? 'text-[#007ACC]' : 'text-slate-400 hover:text-white'
                }`}
                title={isPropertiesCollapsed ? (language === 'ar' ? 'عرض لوحة الخصائص' : 'Show Properties Inspector') : (language === 'ar' ? 'إخفاء لوحة الخصائص' : 'Collapse Properties Inspector')}
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* EDITOR VIEWPORTS CONTAINER (SPLIT OR FULL SCREEN) */}
          <div className="flex-1 flex min-h-0 relative">
            
            {/* LEFT COLUMN: ACTIVE EDITOR PANEL OR DASHBOARD VIEW */}
            <div className={`flex-1 h-full flex flex-col overflow-y-auto ${
              splitPreview && activePackId !== 'saasDashboard' && activePackId !== 'youmiHub' && activePackId !== 'youmiAIHub' && activePackId !== 'developerHub'
                ? 'w-1/2 border-r border-[#3C3C3C]'
                : 'w-full'
            }`}>
              
              <Suspense fallback={
                <div className="p-8 text-center flex flex-col items-center justify-center space-y-3 h-full">
                  <div className="w-8 h-8 border-4 border-[#007ACC] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-slate-400">Loading editor viewport...</p>
                </div>
              }>
                {activePackId === 'saasDashboard' ? (
                  <SaasDashboard
                    user={userSession?.user || { id: 'local_user', name: 'Amine Store', email: 'amine@youmi.com', role: 'User', subscription: 'Pro', createdAt: new Date().toISOString() }}
                    language={language}
                    currentConfig={config}
                    onApplyConfig={setConfig}
                    showNotification={showNotification}
                  />
                ) : activePackId === 'developerHub' ? (
                  <DeveloperHub
                    language={language}
                    currentConfig={config}
                    onApplyConfig={setConfig}
                    showNotification={showNotification}
                  />
                ) : activePackId === 'youmiHub' ? (
                  <YoumiHub />
                ) : activePackId === 'youmiAIHub' ? (
                  <YoumiAIHub />
                ) : activePackId === 'extensionMarketplace' ? (
                  <ExtensionMarketplace
                    language={language}
                    showNotification={showNotification}
                  />
                ) : (
                  // General block property editors wrapped beautifully as VS Code Settings Forms
                  <div className="p-5 space-y-6 text-start flex flex-col h-full bg-[#1E1E1E] text-[#CCCCCC]">
                    
                    {/* Header bar describing active file and save controllers */}
                    <div className="border-b border-[#3C3C3C] pb-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-[#007ACC] uppercase tracking-wider">
                          ACTIVE EDITING CONTEXT: {activePackId.toUpperCase()}
                        </div>
                        <h2 className="text-base font-bold text-white mt-0.5">
                          {getFileDisplayName(activePackId)} (Properties)
                        </h2>
                      </div>
                      
                      {/* Controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const defaultSec = YOUMI_ARABIC_TEMPLATE[activePackId as keyof ProjectConfig];
                            if (defaultSec) {
                              setConfig((prev) => ({
                                ...prev,
                                [activePackId]: JSON.parse(JSON.stringify(defaultSec))
                              }));
                              showNotification(language === 'ar' ? '🔁 تمت إعادة تعيين القسم بنجاح' : '🔁 Section reset successfully');
                            }
                          }}
                          className="px-2.5 py-1 hover:bg-rose-955/20 text-rose-400 rounded text-xs font-bold transition flex items-center gap-1 border border-transparent hover:border-rose-900/40 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                        <button
                          onClick={handleSaveProject}
                          className="px-3 py-1 bg-[#007ACC] hover:bg-sky-600 text-white rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save file</span>
                        </button>
                      </div>
                    </div>

                    {/* Main Forms scrollable */}
                    <div className="flex-1 overflow-y-auto pr-1">
                      {renderActivePackEditor()}
                    </div>
                  </div>
                )}
              </Suspense>

            </div>

            {/* RIGHT COLUMN: LIVE STOREFRONT PREVIEW (Only if split preview active and not dashboard) */}
            {splitPreview && activePackId !== 'saasDashboard' && activePackId !== 'youmiHub' && activePackId !== 'youmiAIHub' && activePackId !== 'developerHub' && (
              <div className="w-1/2 h-full flex flex-col bg-white">
                {/* Simulated browser header */}
                <div className="h-[35px] bg-[#2D2D30] border-b border-[#3C3C3C] flex items-center justify-between px-3 select-none shrink-0 text-[#CCCCCC]">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3C3C3C]" />
                    <span className="text-[11px] font-bold tracking-wide uppercase text-slate-400">Live Preview</span>
                  </div>
                  
                  {/* Address bar */}
                  <div className="flex-1 mx-4 max-w-md">
                    <div className="w-full bg-[#1E1E1E] border border-[#3C3C3C] text-[#CCCCCC] px-3 py-0.5 text-[11px] rounded flex items-center gap-2 select-text font-mono truncate">
                      <span className="text-emerald-500">✔</span>
                      <span>https://youmi-preview.local:3000/live-store</span>
                    </div>
                  </div>

                  <div className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded shrink-0 font-bold">
                    Connected
                  </div>
                </div>

                {/* Main preview frame */}
                <div className="flex-1 overflow-y-auto">
                  <LivePreview 
                    config={config} 
                    includedPacks={includedPacks} 
                    onSectionClick={(sectionId) => {
                      openFile(sectionId);
                    }}
                    language={language}
                  />
                </div>
              </div>
            )}

          </div>

          {/* D. BOTTOM PANEL (Terminal / AI Console / Logs / History) */}
          {!isBottomPanelCollapsed && (
            <div className="h-[220px] bg-[#1E1E1E] border-t border-[#3C3C3C] flex flex-col shrink-0 min-h-0 select-none text-[#CCCCCC]">
              
              {/* Header panel tabs */}
              <div className="h-[30px] bg-[#2D2D30] border-b border-[#3C3C3C] flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center h-full gap-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">Panel:</span>
                  {[
                    { id: 'terminal', label: 'Terminal' },
                    { id: 'ai', label: 'AI Assistant' },
                    { id: 'console', label: 'Console' },
                    { id: 'logs', label: 'Output Logs' },
                    { id: 'deploy', label: 'Deploy tasks' },
                    { id: 'history', label: 'Build History' },
                  ].map((tab) => {
                    const isActive = bottomPanelTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setBottomPanelTab(tab.id as any)}
                        className={`h-full px-2 text-[11px] font-semibold transition cursor-pointer relative ${
                          isActive 
                            ? 'text-[#007ACC] border-b-2 border-[#007ACC] font-bold' 
                            : 'text-[#858585] hover:text-[#CCCCCC]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsBottomPanelCollapsed(true)} 
                    className="hover:bg-[#3C3C3C] p-0.5 rounded text-[#858585] hover:text-white cursor-pointer"
                    title="Minimize Panel"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Panel body contents */}
              <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] bg-[#1E1E1E] text-[#CCCCCC]">
                
                {/* 1. TERMINAL VIEW */}
                {bottomPanelTab === 'terminal' && (
                  <div className="h-full flex flex-col justify-between">
                    <div className="space-y-1 overflow-y-auto flex-1 text-left select-text">
                      {terminalLogs.map((log, idx) => (
                        <div key={idx} className={log.startsWith('SUCCESS:') ? 'text-emerald-400' : log.startsWith('INFO:') ? 'text-blue-400' : log.startsWith('sh: command') ? 'text-rose-400 font-bold' : ''}>
                          {log}
                        </div>
                      ))}
                    </div>
                    {/* Command bar input */}
                    <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 mt-2 pt-2 border-t border-[#3C3C3C] select-text">
                      <span className="text-[#007ACC] font-bold shrink-0">youmi-user@local-builder:~$</span>
                      <input
                        type="text"
                        placeholder="Type 'help', 'npm run build', 'git status' or 'youmi deploy'..."
                        value={simulatedTerminalInput}
                        onChange={(e) => setSimulatedTerminalInput(e.target.value)}
                        className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 text-xs font-mono"
                      />
                    </form>
                  </div>
                )}

                {/* 2. AI ASSISTANT PANEL */}
                {bottomPanelTab === 'ai' && (
                  <div className="space-y-3 flex flex-col h-full justify-between">
                    <div className="text-left space-y-1 flex-1 overflow-y-auto">
                      <div className="text-purple-400 font-bold">🧠 YOUMI-AI Agent:</div>
                      <div className="text-slate-300">
                        Ask me anything to instantly rewrite your configuration or translate the platform language!
                      </div>
                      <div className="text-[#9D9D9D] italic mt-2">Active model: Gemini-3.5-Flash (Ready)</div>
                    </div>
                    <div className="flex gap-2 border-t border-[#3C3C3C] pt-2">
                      <button 
                        onClick={() => openFile('aiBuilder')}
                        className="px-3 py-1 bg-[#007ACC] text-white rounded text-xs hover:bg-[#0062a3]"
                      >
                        Launch AI Builder Interface
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. CONSOLE LOGS */}
                {bottomPanelTab === 'console' && (
                  <div className="space-y-1 text-left overflow-y-auto h-full max-h-[150px] select-text">
                    {consoleLogs.map((log, index) => (
                      <div key={index} className="text-[#CCCCCC]">{log}</div>
                    ))}
                  </div>
                )}

                {/* 4. OUTPUT LOGS */}
                {bottomPanelTab === 'logs' && (
                  <div className="space-y-1 text-left select-text">
                    <div className="text-[#9D9D9D]">[system] listening for file events in workspace...</div>
                    <div className="text-emerald-400">[watcher] local storage auto-save engine initiated.</div>
                    <div className="text-[#9D9D9D]">[sync] store config loaded successfully in 45ms.</div>
                  </div>
                )}

                {/* 5. DEPLOY TASKS */}
                {bottomPanelTab === 'deploy' && (
                  <div className="text-left space-y-2">
                    <div className="font-bold text-white">Active Deployment Configurations:</div>
                    <div className="text-slate-400">Packs included for build: {includedPacks.length} packs enabled.</div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleExportConfig}
                        className="px-2.5 py-1 bg-[#3C3C3C] text-white hover:bg-[#4C4C4C] rounded text-[11px]"
                      >
                        Download template.json
                      </button>
                      <button 
                        onClick={() => openFile('export')}
                        className="px-2.5 py-1 bg-teal-700 text-white hover:bg-teal-600 rounded text-[11px]"
                      >
                        Export Zip Archive
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. BUILD HISTORY */}
                {bottomPanelTab === 'history' && (
                  <div className="text-left text-xs space-y-1 max-h-[140px] overflow-y-auto">
                    {history.map((hist, idx) => (
                      <div key={idx} className="flex gap-2 items-center text-[#CCCCCC]">
                        <span className="text-[#007ACC] font-bold">STATE_{idx}:</span>
                        <span>SiteName "{hist.siteInfo.siteName}", currency: "{hist.siteInfo.currency}", primary: "{hist.colors.primary}"</span>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <div className="text-[#858585] italic">No local commits recorded. Edit configuration to save states.</div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* E. PROPERTIES PANEL (Right VS Code Sidebar Panel) */}
        {isPropertiesCollapsed ? (
          <div 
            onClick={() => setIsPropertiesCollapsed(false)}
            className="w-[35px] bg-[#252526] border-l border-[#3C3C3C] flex flex-col items-center py-3 cursor-pointer hover:bg-[#2D2D30] text-[#9D9D9D] hover:text-white shrink-0 select-none z-20 group relative"
            title={language === 'ar' ? 'توسيع لوحة الخصائص' : 'Expand Properties Panel'}
          >
            <button className="p-1 mb-4 hover:bg-[#3C3C3C] rounded">
              {dir === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <div 
              className="font-bold text-[10px] uppercase tracking-wider whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {language === 'ar' ? 'لوحة الخصائص' : 'Properties Inspector'}
            </div>
          </div>
        ) : (
          <div className="w-[280px] bg-[#252526] border-l border-[#3C3C3C] flex flex-col shrink-0 select-none text-left z-20 overflow-y-auto text-[#CCCCCC] text-[12px]">
            
            {/* Header Panel */}
            <div className="px-3 py-2 border-b border-[#3C3C3C] text-[11px] font-bold tracking-wider uppercase text-[#9D9D9D] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#007ACC] rounded-xs inline-block" />
                <span>{language === 'ar' ? 'لوحة الخصائص' : 'Properties Inspector'}</span>
              </div>
              <button 
                onClick={() => setIsPropertiesCollapsed(true)}
                className="hover:bg-[#3C3C3C] p-1 rounded text-[#858585] hover:text-white cursor-pointer"
                title={language === 'ar' ? 'طي لوحة الخصائص' : 'Collapse Panel'}
              >
                {dir === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Accordion List */}
            <div className="flex-1 divide-y divide-[#3C3C3C]">
              
              {/* Accordion 1: Global Properties */}
              <div className="border-b border-[#3C3C3C]">
                <div 
                  onClick={() => setIsGlobalPropsOpen(!isGlobalPropsOpen)}
                  className="p-3 font-bold uppercase text-[10px] text-[#9D9D9D] hover:bg-[#2D2D30] flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5">
                    {isGlobalPropsOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#858585]" /> : (dir === 'rtl' ? <ChevronLeft className="w-3.5 h-3.5 text-[#858585]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#858585]" />)}
                    <span>{language === 'ar' ? 'الخصائص العامة' : 'GLOBAL PROPERTIES'}</span>
                  </div>
                  <span className="text-[9px] text-[#007ACC] font-mono">store-config</span>
                </div>
                
                {isGlobalPropsOpen && (
                  <div className="px-3 pb-4 pt-1 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">{t('insp_store_name')}</label>
                      <input
                        type="text"
                        className="w-full px-2.5 py-1 bg-[#1E1E1E] border border-[#3C3C3C] rounded text-xs text-white focus:outline-none focus:border-[#007ACC]"
                        value={config.siteInfo.siteName}
                        onChange={(e) => updateSiteInfo({ siteName: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">Primary Color</label>
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            className="w-6 h-6 rounded border border-[#3C3C3C] cursor-pointer bg-transparent shrink-0"
                            value={config.colors.primary}
                            onChange={(e) => setConfig(prev => ({ ...prev, colors: { ...prev.colors, primary: e.target.value } }))}
                          />
                          <span className="text-[10px] font-mono text-[#9D9D9D]">{config.colors.primary}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">Secondary Color</label>
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            className="w-6 h-6 rounded border border-[#3C3C3C] cursor-pointer bg-transparent shrink-0"
                            value={config.colors.secondary}
                            onChange={(e) => setConfig(prev => ({ ...prev, colors: { ...prev.colors, secondary: e.target.value } }))}
                          />
                          <span className="text-[10px] font-mono text-[#9D9D9D]">{config.colors.secondary}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">{t('insp_currency')}</label>
                      <select
                        className="w-full px-2 py-1 bg-[#1E1E1E] border border-[#3C3C3C] rounded text-xs text-white focus:outline-none cursor-pointer font-extrabold"
                        value={config.siteInfo.currency}
                        onChange={(e) => updateSiteInfo({ currency: e.target.value })}
                      >
                        <option value="SAR">SAR (ريال سعودي)</option>
                        <option value="AED">AED (درهم إماراتي)</option>
                        <option value="KWD">KWD (دينار كويتي)</option>
                        <option value="EGP">EGP (جنيه مصري)</option>
                        <option value="USD">USD (دولار أمريكي)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">{t('insp_phone')}</label>
                      <input
                        type="text"
                        className="w-full px-2.5 py-1 bg-[#1E1E1E] border border-[#3C3C3C] rounded text-xs text-white focus:outline-none focus:border-[#007ACC] font-mono"
                        value={config.siteInfo.contactPhone}
                        onChange={(e) => updateSiteInfo({ contactPhone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Header Announcement</label>
                      <input
                        type="text"
                        className="w-full px-2.5 py-1 bg-[#1E1E1E] border border-[#3C3C3C] rounded text-xs text-white focus:outline-none focus:border-[#007ACC]"
                        value={config.header.notificationText}
                        onChange={(e) => updateHeader({ notificationText: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Block Layers */}
              <div className="border-b border-[#3C3C3C]">
                <div 
                  onClick={() => setIsBlockLayersOpen(!isBlockLayersOpen)}
                  className="p-3 font-bold uppercase text-[10px] text-[#9D9D9D] hover:bg-[#2D2D30] flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5">
                    {isBlockLayersOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#858585]" /> : (dir === 'rtl' ? <ChevronLeft className="w-3.5 h-3.5 text-[#858585]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#858585]" />)}
                    <span>{language === 'ar' ? 'ترتيب وتفعيل الأقسام' : 'BLOCK LAYERS (ORDER)'}</span>
                  </div>
                  <span className="text-[9px] text-[#007ACC] font-mono">sections</span>
                </div>
                
                {isBlockLayersOpen && (
                  <div className="px-3 pb-4 pt-1 space-y-1.5">
                    {(config.sectionOrder || ['header', 'menu', 'hero', 'categories', 'footer']).map((secId, idx) => {
                      const isVisible = includedPacks.includes(secId);
                      const nameMap: Record<string, string> = {
                        header: t('pack_002_name'),
                        menu: t('pack_003_name'),
                        hero: t('pack_004_name'),
                        categories: t('pack_005_name'),
                        footer: t('pack_006_name'),
                      };
                      return (
                        <div
                          key={secId}
                          className={`flex items-center justify-between p-1.5 border rounded text-xs transition ${
                            activePackId === secId 
                              ? 'border-[#007ACC] bg-[#37373D]' 
                              : 'border-[#3C3C3C] bg-[#1E1E1E]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <span className="text-[#9D9D9D] font-mono text-[9px]">#{idx + 1}</span>
                            <button
                              onClick={() => openFile(secId)}
                              className={`font-bold hover:underline text-left truncate cursor-pointer ${
                                activePackId === secId ? 'text-[#007ACC]' : 'text-[#CCCCCC]'
                              }`}
                            >
                              {nameMap[secId] || secId}
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => moveSection(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 hover:bg-[#3C3C3C] rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSection(idx, 'down')}
                              disabled={idx === (config.sectionOrder || ['header', 'menu', 'hero', 'categories', 'footer']).length - 1}
                              className="p-1 hover:bg-[#3C3C3C] rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => togglePackSelection(secId)}
                              className={`p-1 rounded cursor-pointer transition ${
                                isVisible ? 'text-emerald-400 hover:bg-emerald-950/20' : 'text-slate-500 hover:bg-[#3C3C3C]'
                              }`}
                            >
                              {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 3: Active Packs Checklist */}
              <div className="border-b border-[#3C3C3C]">
                <div 
                  onClick={() => setIsActivePacksOpen(!isActivePacksOpen)}
                  className="p-3 font-bold uppercase text-[10px] text-[#9D9D9D] hover:bg-[#2D2D30] flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5">
                    {isActivePacksOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#858585]" /> : (dir === 'rtl' ? <ChevronLeft className="w-3.5 h-3.5 text-[#858585]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#858585]" />)}
                    <span>{language === 'ar' ? 'حزم التجميع النشطة' : 'ACTIVE COMPILE PACKS'}</span>
                  </div>
                  <span className="text-[9px] text-[#007ACC] font-mono">build</span>
                </div>
                
                {isActivePacksOpen && (
                  <div className="px-3 pb-4 pt-1 space-y-1.5 max-h-[180px] overflow-y-auto pl-0.5">
                    {PACKS.slice(0, 9).map((p) => {
                      const isChecked = includedPacks.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => togglePackSelection(p.id)}
                          className={`flex items-center justify-between p-1.5 rounded border transition cursor-pointer text-xs ${
                            isChecked
                              ? 'bg-[#37373D] border-[#007ACC]'
                              : 'border-transparent text-slate-500 hover:bg-[#1E1E1E]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 transition ${
                                isChecked ? 'text-emerald-400 fill-emerald-955/20' : 'text-slate-600'
                              }`}
                            />
                            <span className="font-bold text-[#CCCCCC] truncate">{p.code} - {p.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Quick Actions compile */}
            <div className="p-3 border-t border-[#3C3C3C] bg-[#1E1E1E]">
              <button
                type="button"
                onClick={() => {
                  openFile('export');
                  showNotification(t('notif_focused_section') + t('pack_export_name'));
                }}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Compile Active Packs 🚀</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 3. ASSET LIBRARY DIALOG (MODAL OVERLAY) */}
      {isAssetOpen && (
        <AssetManager
          assets={assets}
          onAddAsset={handleAddAsset}
          onDeleteAsset={handleDeleteAsset}
          onSelect={(url) => {
            if (assetSelectCallback) {
              assetSelectCallback(url);
            }
          }}
          onClose={() => {
            setIsAssetOpen(false);
            setAssetSelectCallback(null);
            setAssetFilterCategory(undefined);
          }}
          filterCategory={assetFilterCategory}
        />
      )}

      {/* 4. STATUS BAR (Exactly like VS Code) */}
      <div className="h-[22px] bg-[#007ACC] text-white flex items-center justify-between px-3 shrink-0 text-[11px] select-none z-50">
        <div className="flex items-center gap-3">
          {/* Git Branch */}
          <div className="flex items-center gap-1 font-mono hover:bg-sky-600 px-1 py-0.5 rounded cursor-pointer transition">
            <span className="font-bold">⌥</span>
            <span>main*</span>
          </div>

          <span className="opacity-40">|</span>

          {/* Synchronize status */}
          <div className="flex items-center gap-1 text-slate-100 hover:bg-sky-600 px-1 py-0.5 rounded cursor-pointer transition">
            <span>☁</span>
            <span>Sync active (local)</span>
          </div>

          <span className="opacity-40">|</span>

          {/* Port */}
          <div className="flex items-center gap-1 text-slate-100 hover:bg-sky-600 px-1 py-0.5 rounded cursor-pointer transition">
            <span>Port: 3000</span>
          </div>

          <span className="opacity-40">|</span>

          {/* Errors/Warnings */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5">🅇 0</span>
            <span className="flex items-center gap-0.5">⚠️ 0</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Message */}
          <div className="hidden sm:block text-[10px] text-sky-100 font-mono truncate max-w-sm">
            {saveNotification ? `✓ ${saveNotification}` : 'Vite dev server is listening...'}
          </div>

          <span className="opacity-40">|</span>

          {/* Theme switcher */}
          <button
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            className="text-slate-100 hover:text-white hover:bg-sky-600 px-1 py-0.5 rounded cursor-pointer transition font-mono flex items-center gap-1"
          >
            {themeMode === 'light' ? 'Theme: Light' : 'Theme: Dark'}
          </button>

          <span className="opacity-40">|</span>

          {/* Language Switcher */}
          <button
            onClick={() => {
              const nextLang = language === 'ar' ? 'en' : 'ar';
              setLanguage(nextLang);
              showNotification(nextLang === 'ar' ? t('notif_lang_ar') : t('notif_lang_en'));
            }}
            className="text-slate-100 hover:text-white hover:bg-sky-600 px-1 py-0.5 rounded cursor-pointer transition font-mono"
          >
            {language === 'ar' ? 'العربية / AR' : 'English / EN'}
          </button>

          <span className="opacity-40">|</span>

          {/* Connection state */}
          <div className="flex items-center gap-1 text-emerald-300">
            <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full inline-block" />
            <span className="text-[10px]">Online</span>
          </div>
        </div>
      </div>

      {/* New Project Creation Modal with 15 Project Types */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSelectProjectType={handleSelectProjectType}
        language={language}
      />

    </div>
  );
}
