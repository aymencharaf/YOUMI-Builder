import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Star, Heart, Share2, AlertTriangle, Download, 
  RefreshCw, Upload, Check, X, Award, ChevronRight, MessageSquare, 
  Plus, FileText, Settings, UserCheck, CreditCard, DollarSign, 
  Users, Trash2, Edit, Eye, Copy, ArrowUpDown, CheckCircle2, 
  ShoppingCart, Lock, HelpCircle, Shield, Sparkles, Layout, Globe, 
  Palette, Type, Layers, Image as ImageIcon, Video, Terminal, ExternalLink
} from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import { Resource, DeveloperProfile, SalesReport, UserReport } from '../types/hub';
import { INITIAL_HUB_RESOURCES } from '../data/hubMockData';
import { authService } from '../utils/authService';
import ComingSoonModal from './ComingSoonModal';

export default function YoumiHub() {
  const { t, language, dir } = useTranslation();

  // --- CORE STATE ---
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(() => authService.getCurrentSession()?.user?.email || '');

  // Listen to session changes to sync email
  useEffect(() => {
    const unsubscribe = authService.onSessionChange((session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });
    return unsubscribe;
  }, []);

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('youmi_hub_resources');
    return saved ? JSON.parse(saved) : INITIAL_HUB_RESOURCES;
  });

  const [activeRoleTab, setActiveRoleTab] = useState<'shopper' | 'developer' | 'admin'>('shopper');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  const [compatibilityFilter, setCompatibilityFilter] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Shopper-related persistent states
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('youmi_hub_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [installed, setInstalled] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('youmi_hub_installed');
    return saved ? JSON.parse(saved) : {}; // resourceId -> installedVersion
  });
  const [ownedLicenses, setOwnedLicenses] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('youmi_hub_licenses');
    return saved ? JSON.parse(saved) : {}; // resourceId -> licenseKey
  });

  // Modal / Detail views
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutResource, setCheckoutResource] = useState<Resource | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportResourceId, setReportResourceId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

  // Developer Profile Status
  const [devProfile, setDevProfile] = useState<DeveloperProfile>(() => {
    const saved = localStorage.getItem('youmi_hub_dev_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Amine Dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
      bio: 'Fullstack developer specializing in e-commerce plugins and themes for Algerian merchants.',
      website: 'https://amine-codes.dz',
      isRegistered: true,
      verified: true,
      balance: 145,
      salesCount: 18
    };
  });

  // Developer Publishing Form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Resource['category']>('templates');
  const [newProductPrice, setNewProductPrice] = useState('0');
  const [newProductVersion, setNewProductVersion] = useState('1.0.0');
  const [newProductShortDesc, setNewProductShortDesc] = useState('');
  const [newProductDoc, setNewProductDoc] = useState('');
  const [newProductTags, setNewProductTags] = useState('');
  const [newProductGallery, setNewProductGallery] = useState('');

  // Developer registration form
  const [regName, setRegName] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regWebsite, setRegWebsite] = useState('');

  // Review Input Form
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Active resource detail sub-tabs
  const [detailSubTab, setDetailSubTab] = useState<'overview' | 'doc' | 'changelog' | 'reviews'>('overview');

  // Admin Reports list state
  const [userReports, setUserReports] = useState<UserReport[]>(() => {
    const saved = localStorage.getItem('youmi_hub_user_reports');
    return saved ? JSON.parse(saved) : [
      { id: 'rep-1', resourceId: 'hub-5', resourceName: 'Neon Cyberpunk UI Components Kit', reporter: 'User991', reason: 'Documentation is not clear for beginner users.', date: '2026-07-21' }
    ];
  });

  // Sales reports (simulated)
  const [salesReports, setSalesReports] = useState<SalesReport[]>(() => {
    return [
      { id: 'tx-1001', date: '2026-07-20', productName: 'Dahabia & CIB Payment Gateway Pro', buyer: 'Mounir Dz', price: 49, commission: 7.35, net: 41.65 },
      { id: 'tx-1002', date: '2026-07-21', productName: 'Yalidine Express Shipping Pack', buyer: 'Yacine Store', price: 29, commission: 4.35, net: 24.65 }
    ];
  });

  // Install Animation state
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState<number>(0);

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('youmi_hub_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('youmi_hub_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('youmi_hub_installed', JSON.stringify(installed));
  }, [installed]);

  useEffect(() => {
    localStorage.setItem('youmi_hub_licenses', JSON.stringify(ownedLicenses));
  }, [ownedLicenses]);

  useEffect(() => {
    localStorage.setItem('youmi_hub_dev_profile', JSON.stringify(devProfile));
  }, [devProfile]);

  useEffect(() => {
    localStorage.setItem('youmi_hub_user_reports', JSON.stringify(userReports));
  }, [userReports]);

  // CATEGORIES DEFINITION MATCHING MAIN SECTIONS REQUESTED
  const SECTIONS_CATEGORIES = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All Sections', icon: Globe },
    { id: 'templates', label: language === 'ar' ? 'قوالب جاهزة' : 'Templates', icon: Layout },
    { id: 'packs', label: language === 'ar' ? 'حزم متكاملة' : 'PACKs', icon: Layers },
    { id: 'themes', label: language === 'ar' ? 'مظاهر وألوان' : 'Themes', icon: Palette },
    { id: 'plugins', label: language === 'ar' ? 'ملحقات برمجية' : 'Plugins', icon: Settings },
    { id: 'components', label: language === 'ar' ? 'عناصر واجهة' : 'Components', icon: FileText },
    { id: 'sections', label: language === 'ar' ? 'أقسام متجر' : 'Sections', icon: ChevronRight },
    { id: 'blocks', label: language === 'ar' ? 'كتل تصميمية' : 'Blocks', icon: Plus },
    { id: 'ui-kits', label: language === 'ar' ? 'حقائب UI' : 'UI Kits', icon: Award },
    { id: 'icons', label: language === 'ar' ? 'أيقونات متجهة' : 'Icons', icon: UserCheck },
    { id: 'fonts', label: language === 'ar' ? 'خطوط تيبوغرافية' : 'Fonts', icon: Type },
    { id: 'images', label: language === 'ar' ? 'صور عالية الدقة' : 'Images', icon: ImageIcon },
    { id: 'videos', label: language === 'ar' ? 'فيديوهات تفاعلية' : 'Videos', icon: Video },
    { id: 'ai-assets', label: language === 'ar' ? 'أصول ذكاء اصطناعي' : 'AI Assets', icon: Sparkles }
  ];

  // SUB-COLLECTIONS FOR TABS
  const COLLECTIONS_FILTERS = [
    { id: 'featured', label: language === 'ar' ? '✨ مميز' : 'Featured' },
    { id: 'trending', label: language === 'ar' ? '🔥 الرائج' : 'Trending' },
    { id: 'best-sellers', label: language === 'ar' ? '🏆 الأكثر مبيعاً' : 'Best Sellers' },
    { id: 'new-releases', label: language === 'ar' ? '🆕 الأحدث' : 'New Releases' },
    { id: 'recently-updated', label: language === 'ar' ? '🔄 المحدث حديثاً' : 'Recently Updated' }
  ];
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  // Filter resources based on all search/filter configurations
  const filteredResources = resources.filter((item) => {
    if (item.status !== 'approved' && activeRoleTab === 'shopper') return false; // Shoppers only see approved items

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.titleAr && item.titleAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    const matchesPrice = priceFilter === 'all' ? true :
      priceFilter === 'free' ? item.price === 0 : item.price > 0;

    const matchesRating = item.rating >= minRatingFilter;

    const matchesCompatibility = compatibilityFilter === 'all' ? true : item.compatibility.includes(compatibilityFilter);

    const matchesTag = !selectedTag || item.tags.includes(selectedTag);

    // Collection overlays
    let matchesCollection = true;
    if (selectedCollection === 'featured') matchesCollection = !!item.isFeatured;
    else if (selectedCollection === 'trending') matchesCollection = !!item.isTrending;
    else if (selectedCollection === 'best-sellers') matchesCollection = !!item.isBestSeller;
    else if (selectedCollection === 'new-releases') matchesCollection = !!item.isNewRelease;
    else if (selectedCollection === 'recently-updated') matchesCollection = !!item.isRecentlyUpdated;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesCompatibility && matchesTag && matchesCollection;
  });

  // Extract all unique tags
  const allUniqueTags = Array.from(new Set(resources.flatMap(item => item.tags))).slice(0, 15);

  // --- FA VORITE TOGGLE ---
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter(item => item !== id) : [...prev, id];
      
      // Update resources list count
      setResources(resList => resList.map(r => {
        if (r.id === id) {
          return { ...r, favorites: r.favorites + (isFav ? -1 : 1) };
        }
        return r;
      }));
      return updated;
    });
  };

  // --- INSTALL AND UPDATE ACTIONS ---
  const handleOneClickInstall = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const resource = resources.find(r => r.id === id);
    if (!resource) return;

    if (resource.price > 0 && !ownedLicenses[id]) {
      // Must purchase first
      setCheckoutResource(resource);
      setIsCheckoutOpen(true);
      return;
    }

    setInstallingId(id);
    setInstallProgress(10);

    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setInstallingId(null);
          // Register as installed with active version
          setInstalled(prevInst => ({ ...prevInst, [id]: resource.version }));
          // Increment downloads count
          setResources(resList => resList.map(r => {
            if (r.id === id) return { ...r, downloads: r.downloads + 1 };
            return r;
          }));
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleOneClickUpdate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleOneClickInstall(id, e);
  };

  // --- CHECKOUT SIMULATION ---
  const handleCompletePurchase = (paymentMethod: string) => {
    if (!checkoutResource) return;
    const key = `YMH-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Add license
    setOwnedLicenses(prev => ({ ...prev, [checkoutResource.id]: key }));

    // If payment is Dahabia or Card, log transaction
    const newTx: SalesReport = {
      id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      productName: checkoutResource.name,
      buyer: 'You (Sandbox User)',
      price: checkoutResource.price,
      commission: parseFloat((checkoutResource.price * 0.15).toFixed(2)),
      net: parseFloat((checkoutResource.price * 0.85).toFixed(2))
    };

    setSalesReports(prev => [newTx, ...prev]);

    // Update resource download trigger
    setIsCheckoutOpen(false);
    setCheckoutResource(null);
    alert(language === 'ar' ? `🎉 تمت عملية الشراء بنجاح! كود الترخيص الخاص بك: ${key}` : `🎉 Purchase successful! Your License Key: ${key}`);
  };

  // --- REPORT SUBMISSION ---
  const handleSubmitReport = () => {
    if (!reportResourceId || !reportReason) return;
    const resource = resources.find(r => r.id === reportResourceId);
    if (!resource) return;

    const newReport: UserReport = {
      id: `rep-${Date.now()}`,
      resourceId: reportResourceId,
      resourceName: resource.name,
      reporter: 'Anonymous Shopper',
      reason: reportReason,
      date: new Date().toISOString().split('T')[0]
    };

    setUserReports(prev => [newReport, ...prev]);
    setResources(prevList => prevList.map(r => {
      if (r.id === reportResourceId) return { ...r, reportsCount: r.reportsCount + 1 };
      return r;
    }));

    setIsReportOpen(false);
    setReportResourceId(null);
    setReportReason('');
    alert(language === 'ar' ? '✔️ تم إرسال البلاغ بنجاح للإدارة للتحقق.' : '✔️ Report submitted successfully to administrators.');
  };

  // --- REVIEWS ENGINE ---
  const handleAddReview = () => {
    if (!selectedResource || !reviewComment.trim()) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      author: 'You (Local User)',
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    setResources(prevList => prevList.map(r => {
      if (r.id === selectedResource.id) {
        const updatedReviews = [newReview, ...r.reviews];
        const newAvg = parseFloat((updatedReviews.reduce((acc, curr) => acc + curr.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...r,
          reviews: updatedReviews,
          rating: newAvg
        };
      }
      return r;
    }));

    // Update local modal state representation
    setSelectedResource(prev => {
      if (!prev) return null;
      const updatedReviews = [newReview, ...prev.reviews];
      const newAvg = parseFloat((updatedReviews.reduce((acc, curr) => acc + curr.rating, 0) / updatedReviews.length).toFixed(1));
      return {
        ...prev,
        reviews: updatedReviews,
        rating: newAvg
      };
    });

    setReviewComment('');
    setReviewRating(5);
  };

  // --- DEVELOPER PUBLISHING ACTIONS ---
  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const priceNum = parseFloat(newProductPrice) || 0;

    const newProduct: Resource = {
      id: `hub-custom-${Date.now()}`,
      name: newProductName,
      category: newProductCategory,
      price: priceNum,
      rating: 5.0,
      downloads: 0,
      favorites: 0,
      author: {
        name: devProfile.name,
        avatar: devProfile.avatar,
        verified: devProfile.verified,
        badge: 'Pro'
      },
      version: newProductVersion,
      description: newProductShortDesc,
      documentation: newProductDoc || 'No specific documentation supplied.',
      changelog: [
        { version: newProductVersion, date: new Date().toISOString().split('T')[0], notes: ['Initial marketplace publication submission.'] }
      ],
      gallery: newProductGallery ? newProductGallery.split(',').map(s => s.trim()) : ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600'],
      tags: newProductTags ? newProductTags.split(',').map(t => t.trim()) : ['developer', 'published'],
      compatibility: 'v3.0.0+',
      status: 'pending',
      reviews: [],
      reportsCount: 0
    };

    setResources(prev => [newProduct, ...prev]);

    // Clear form
    setNewProductName('');
    setNewProductShortDesc('');
    setNewProductDoc('');
    setNewProductTags('');
    setNewProductGallery('');

    alert(language === 'ar' ? '🚀 تم إرسال منتجك للإدارة للمراجعة والموافقة عليه!' : '🚀 Your product has been submitted for admin verification and approval!');
  };

  // --- DEVELOPER REGISTRATION ---
  const handleRegisterDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    setDevProfile({
      name: regName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
      bio: regBio || 'Freelance YOUMI Developer.',
      website: regWebsite || '',
      isRegistered: true,
      verified: false,
      balance: 0,
      salesCount: 0
    });
  };

  // --- ADMIN APPROVE/REJECT ---
  const handleAdminApprove = (id: string) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) return { ...r, status: 'approved' };
      return r;
    }));
  };

  const handleAdminReject = (id: string, reason: string) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) return { ...r, status: 'rejected', rejectionReason: reason };
      return r;
    }));
  };

  // --- ADMIN DISMISS REPORT / BAN ---
  const handleAdminModerateReport = (reportId: string, action: 'dismiss' | 'ban', resourceId?: string) => {
    setUserReports(prev => prev.filter(r => r.id !== reportId));
    if (action === 'ban' && resourceId) {
      setResources(prev => prev.filter(r => r.id !== resourceId));
      alert('Product permanently removed from marketplace.');
    }
  };

  // --- COPY SHARE LINK ---
  const handleShareProduct = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://youmi-hub.com/resource/${id}`);
    alert(language === 'ar' ? '🔗 تم نسخ رابط المنتج لمشاركته!' : '🔗 Copied resource share link!');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-slate-800 dark:text-slate-200" dir={dir}>
      
      {/* 1. TOP DUAL HEADER WITH ROLE PANEL CONTROLLERS */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 dark:bg-teal-400 rounded-2xl flex items-center justify-center text-white">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-start">
            <h2 className="text-sm font-extrabold flex items-center gap-2">
              <span>{language === 'ar' ? 'مركز ملحقات YOUMI Hub' : 'YOUMI Hub Marketplace'}</span>
              <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">ENTERPRISE</span>
            </h2>
            <p className="text-[10.5px] text-slate-500 mt-0.5">
              {language === 'ar' ? 'المتجر الرسمي ومجتمع مطوري منصة يومي بيلدر لبناء وتطوير المواقع.' : 'Official community center & packages marketplace for YOUMI Builder.'}
            </p>
          </div>
        </div>

        {/* Dynamic Roles Switching Dashboard Bar */}
        <div className="flex bg-slate-200 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300/50 dark:border-slate-800/60">
          <button
            type="button"
            onClick={() => setActiveRoleTab('shopper')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${
              activeRoleTab === 'shopper' 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تصفح المتجر' : 'Explore Market'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoleTab('developer')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${
              activeRoleTab === 'developer' 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مركز المطورين' : 'Developer Center'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoleTab('admin')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${
              activeRoleTab === 'admin' 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'لوحة المشرف' : 'Admin Area'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN LAYOUT BY SELECTED ACTIVE ROLE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* --- SHOPPER VIEW (MARKETPLACE EXPERIENCE) --- */}
        {activeRoleTab === 'shopper' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Categories Rail */}
            <aside className="w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-4 overflow-y-auto shrink-0 flex flex-col justify-between hidden md:flex">
              <div className="space-y-4 text-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {language === 'ar' ? 'الأقسام والمكتبات' : 'Categories'}
                  </span>
                  <div className="mt-2 space-y-1">
                    {SECTIONS_CATEGORIES.map(cat => {
                      const CatIcon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                            selectedCategory === cat.id 
                              ? 'bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-extrabold' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <CatIcon className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tags Filter list */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                    {language === 'ar' ? 'الوسوم الشائعة' : 'Popular Tags'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedTag(null)}
                      className={`px-2 py-0.5 text-[10px] rounded-md transition cursor-pointer ${!selectedTag ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                    >
                      #all
                    </button>
                    {allUniqueTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`px-2 py-0.5 text-[10px] rounded-md transition cursor-pointer ${selectedTag === tag ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sandbox License status info card */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-900/60 dark:to-slate-900 p-3 rounded-2xl border border-teal-100 dark:border-slate-800">
                <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 block">💳 Sandbox Balance</span>
                <p className="text-xs font-black text-slate-800 dark:text-white mt-1">$1,500.00</p>
                <p className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-1">Unlimited sandbox credit simulation for premium checkout testing.</p>
              </div>
            </aside>

            {/* Core Marketplace Browser and Results area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
              
              {/* Internal Search & Collections Navigation Bar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                {/* Search query box */}
                <div className="relative w-full max-w-sm">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ar' ? 'بحث باسم المنتج، الوصف أو المطور...' : 'Search WordPress plugins, Figma kits...'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Collection Filter Horizontal line */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCollection('all')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                      selectedCollection === 'all' 
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' 
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    {language === 'ar' ? 'كل المنتجات' : 'All'}
                  </button>
                  {COLLECTIONS_FILTERS.map(col => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedCollection(col.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                        selectedCollection === col.id 
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>

                {/* Price type Filter and Compatibility selector */}
                <div className="flex items-center gap-2.5">
                  <select
                    value={priceFilter}
                    onChange={(e: any) => setPriceFilter(e.target.value)}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-xs text-slate-700 dark:text-slate-300 rounded-lg outline-none"
                  >
                    <option value="all">Any Price</option>
                    <option value="free">Free Only</option>
                    <option value="premium">Premium Only</option>
                  </select>

                  <select
                    value={compatibilityFilter}
                    onChange={(e: any) => setCompatibilityFilter(e.target.value)}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-xs text-slate-700 dark:text-slate-300 rounded-lg outline-none"
                  >
                    <option value="all">YOUMI v3.0 Compatible</option>
                    <option value="v2.8.0">v2.8 Compatible</option>
                  </select>
                </div>
              </div>

              {/* Dynamic cards grid list */}
              <div className="flex-1 overflow-y-auto p-5">
                {filteredResources.length === 0 ? (
                  <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Search className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ar' ? 'لم يتم العثور على أي حزم أو ملحقات' : 'No resources match your search'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Try resetting your tags filter, adjusting compatibility options, or exploring other main sections.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredResources.map((item) => {
                      const isLiked = favorites.includes(item.id);
                      const isInst = !!installed[item.id];
                      const isUpdatable = isInst && installed[item.id] !== item.version;
                      const hasLic = ownedLicenses[item.id] || item.price === 0;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedResource(item);
                            setDetailSubTab('overview');
                          }}
                          className="group bg-slate-50 dark:bg-slate-950/40 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-850 hover:border-teal-500/50 dark:hover:border-teal-400/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                        >
                          <div>
                            {/* Card Image Stage */}
                            <div className="aspect-video bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex items-center justify-center">
                              <img
                                src={item.gallery[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600'}
                                alt={item.name}
                                className="w-full h-full object-cover transition-all group-hover:scale-105 duration-500"
                                referrerPolicy="no-referrer"
                              />

                              {/* Badges Overlays */}
                              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                <span className="text-[9px] font-black text-white bg-slate-900/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  {item.category}
                                </span>
                                {item.isFeatured && (
                                  <span className="text-[8px] font-black text-white bg-amber-500 px-2 py-0.5 rounded-md uppercase">
                                    Featured
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={(e) => handleToggleFavorite(item.id, e)}
                                className="absolute top-3 right-3 p-1.5 bg-white/95 dark:bg-slate-900/95 rounded-xl text-slate-400 hover:text-red-500 shadow-sm transition hover:scale-110"
                              >
                                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
                              </button>
                            </div>

                            {/* Card Details Body */}
                            <div className="p-5 text-start">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                  <img src={item.author.avatar} alt={item.author.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex items-center gap-1 truncate">
                                  <span className="text-[10.5px] font-bold text-slate-500 truncate">{item.author.name}</span>
                                  {item.author.verified && <Check className="w-3 h-3 text-teal-500 bg-teal-500/10 rounded-full p-0.5" />}
                                </div>
                              </div>

                              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                                {language === 'ar' && item.titleAr ? item.titleAr : item.name}
                              </h4>

                              <p className="text-[10.5px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                {language === 'ar' && item.descriptionAr ? item.descriptionAr : item.description}
                              </p>

                              {/* Ratings & Downloads Counter stats strip */}
                              <div className="flex items-center gap-3 mt-3 text-slate-400 text-[10px]">
                                <div className="flex items-center gap-1 text-amber-500">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span className="font-bold text-slate-700 dark:text-slate-300">{item.rating}</span>
                                </div>
                                <span>•</span>
                                <span>{item.downloads} {t('download_count_lbl') || 'installs'}</span>
                                <span>•</span>
                                <span>{item.compatibility}</span>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Footer buttons panel */}
                          <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-3">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                              {item.price === 0 ? (
                                <span className="text-emerald-600 dark:text-emerald-400 uppercase font-extrabold text-[11px]">Free</span>
                              ) : (
                                `$${item.price}.00`
                              )}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {installingId === item.id ? (
                                <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-black rounded-xl flex items-center gap-2">
                                  <RefreshCw className="w-3 h-3 animate-spin text-teal-600" />
                                  <span>{installProgress}%</span>
                                </div>
                              ) : isInst ? (
                                <div className="flex items-center gap-1">
                                  <span className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span>Active ({installed[item.id]})</span>
                                  </span>
                                  {isUpdatable && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleOneClickUpdate(item.id, e)}
                                      className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-xl transition cursor-pointer"
                                      title="Update available"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ) : !hasLic ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsComingSoonOpen(true);
                                  }}
                                  className="px-3 py-1.5 bg-amber-550 hover:bg-amber-600 dark:bg-amber-650 dark:hover:bg-amber-600 text-white text-[10px] font-extrabold rounded-xl transition flex items-center gap-1 cursor-pointer shadow-sm shadow-amber-500/10"
                                >
                                  <span className="bg-white/20 text-white text-[8px] font-black uppercase px-1 py-0.5 rounded leading-none shrink-0 mr-1">Soon</span>
                                  <span>Notify Me</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => handleOneClickInstall(item.id, e)}
                                  className="px-3 py-1.5 bg-teal-600/10 hover:bg-teal-600 text-teal-600 hover:text-white text-[10px] font-extrabold rounded-xl transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Install Now</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </main>
          </div>
        )}

        {/* --- DEVELOPER CENTER DASHBOARD VIEW --- */}
        {activeRoleTab === 'developer' && (
          <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20 p-6 space-y-6">
            {!devProfile.isRegistered ? (
              /* Developer Registration Stage */
              <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-md">
                <div className="w-12 h-12 bg-teal-500/10 text-teal-500 rounded-2xl flex items-center justify-center mb-4">
                  <Edit className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-start">Register as a Hub Developer</h3>
                <p className="text-xs text-slate-400 text-start mt-1 mb-6">
                  Publish plugins, templates, and customized icons on YOUMI Hub. Reach thousands of merchants across the country and earn 85% commissions on your premium packages.
                </p>

                <form onSubmit={handleRegisterDeveloper} className="space-y-4 text-start">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase">Developer Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Amine Codes"
                      className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase">Brief Bio</label>
                    <textarea
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="Introduce your skills..."
                      className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs h-20 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase">Personal Website (Optional)</label>
                    <input
                      type="url"
                      value={regWebsite}
                      onChange={(e) => setRegWebsite(e.target.value)}
                      placeholder="https://yourwebsite.dz"
                      className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer mt-2"
                  >
                    Accept Terms & Register Profile
                  </button>
                </form>
              </div>
            ) : (
              /* Developer Dashboard Grid view */
              <div className="space-y-6 text-start max-w-6xl mx-auto w-full">
                
                {/* 1. Profile Status strip */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden">
                      <img src={devProfile.avatar} alt={devProfile.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">{devProfile.name}</h3>
                        <span className="text-[8px] bg-teal-500 text-white px-2 py-0.5 rounded-full font-mono font-bold uppercase">Verified Partner</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-1 max-w-md">{devProfile.bio}</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="text-center md:text-end">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Sales</span>
                      <strong className="text-sm font-black text-slate-900 dark:text-white">{devProfile.salesCount} purchases</strong>
                    </div>
                    <div className="text-center md:text-end border-l border-slate-200 dark:border-slate-800 pl-6">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Seller Balance</span>
                      <strong className="text-sm font-black text-teal-600 dark:text-teal-400">${devProfile.balance}.00 USD</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Graphical SVG Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Growth chart card */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6">
                    <h4 className="text-xs font-black uppercase text-slate-400 mb-4">Earnings Performance & Cleared Income (30 Days)</h4>
                    {/* SVG Chart */}
                    <div className="h-44 w-full bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl flex flex-col justify-between p-3 relative overflow-hidden">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>$500</span>
                        <span>$250</span>
                        <span>$0</span>
                      </div>
                      {/* Wave Line */}
                      <svg className="absolute inset-x-0 bottom-6 h-28 w-full" viewBox="0 0 400 100" fill="none">
                        <path d="M0 80 Q50 30 100 60 T200 40 T300 20 T400 30" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" />
                        <path d="M0 80 Q50 30 100 60 T200 40 T300 20 T400 30 L400 100 L0 100 Z" fill="url(#grad-teal)" opacity="0.1" />
                        <defs>
                          <linearGradient id="grad-teal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0d9488" />
                            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-2 shrink-0">
                        <span>July 05</span>
                        <span>July 10</span>
                        <span>July 15</span>
                        <span>July 20</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit product submission form section */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 mb-2">Payout Trigger Box</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Request payment clearance directly to your postal account (CCP), BaridiMob, or international bank account securely.
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <select className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none">
                        <option>BaridiMob (Algeria Post)</option>
                        <option>Dahabia CCP Transfer</option>
                        <option>International Wire Transfer</option>
                      </select>
                      <button
                        onClick={() => alert('Payout request received! Clearance will be validated in 24 hours.')}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer"
                      >
                        Request Payout ($145.00)
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Product Submissions & Sales lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Publish form */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6">
                    <h4 className="text-xs font-black uppercase text-slate-400 mb-4">Publish a New Hub Resource</h4>
                    
                    <form onSubmit={handlePublishProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Product Name</label>
                        <input
                          type="text"
                          required
                          value={newProductName}
                          onChange={(e) => setNewProductName(e.target.value)}
                          placeholder="e.g. Yalidine Express Tracking"
                          className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Resource Section Category</label>
                        <select
                          value={newProductCategory}
                          onChange={(e: any) => setNewProductCategory(e.target.value)}
                          className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        >
                          <option value="templates">Templates</option>
                          <option value="packs">PACKs</option>
                          <option value="themes">Themes</option>
                          <option value="plugins">Plugins</option>
                          <option value="components">Components</option>
                          <option value="sections">Sections</option>
                          <option value="blocks">Blocks</option>
                          <option value="ui-kits">UI Kits</option>
                          <option value="icons">Icons</option>
                          <option value="fonts">Fonts</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Price (USD) - 0 for Free</label>
                        <input
                          type="number"
                          required
                          value={newProductPrice}
                          onChange={(e) => setNewProductPrice(e.target.value)}
                          placeholder="49"
                          className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Initial Version</label>
                        <input
                          type="text"
                          required
                          value={newProductVersion}
                          onChange={(e) => setNewProductVersion(e.target.value)}
                          placeholder="1.0.0"
                          className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Short Description (1-2 sentences)</label>
                        <input
                          type="text"
                          required
                          value={newProductShortDesc}
                          onChange={(e) => setNewProductShortDesc(e.target.value)}
                          placeholder="Brief presentation summarizing the core features of the product."
                          className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Documentation Details (supports Markdown)</label>
                        <textarea
                          value={newProductDoc}
                          onChange={(e) => setNewProductDoc(e.target.value)}
                          placeholder="### Getting Started..."
                          className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs h-24 outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Comma-separated tags</label>
                        <input
                          type="text"
                          value={newProductTags}
                          onChange={(e) => setNewProductTags(e.target.value)}
                          placeholder="shipping, tracking, logistics"
                          className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Gallery Image URL</label>
                        <input
                          type="url"
                          value={newProductGallery}
                          onChange={(e) => setNewProductGallery(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full mt-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2 mt-2">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
                        >
                          Submit Product to Admin Review
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Customer Sales Reports box */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 mb-3">Live Sales Activity</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {salesReports.map(tx => (
                          <div key={tx.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
                            <div className="flex justify-between text-[11px] font-black">
                              <span className="truncate max-w-[120px]">{tx.productName}</span>
                              <span className="text-teal-600">+${tx.net}</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                              <span>Buyer: {tx.buyer}</span>
                              <span>{tx.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">All Customer Count</span>
                      <strong className="text-xs font-extrabold block mt-0.5">8 Active Buyers</strong>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* --- ADMINISTRATOR CONTROLLER BOARD VIEW --- */}
        {activeRoleTab === 'admin' && (
          <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20 p-6 space-y-6 text-start max-w-6xl mx-auto w-full">
            
            {/* Admin top stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Commission Split (15%)', val: `$${salesReports.reduce((acc, c) => acc + c.commission, 0).toFixed(2)}` },
                { title: 'Total Catalog Products', val: `${resources.length} units` },
                { title: 'Pending Approval', val: `${resources.filter(r => r.status === 'pending').length} items` },
                { title: 'Open Support Reports', val: `${userReports.length} cases` }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-5">
                  <span className="text-[9.5px] text-slate-400 uppercase font-black tracking-wider block">{stat.title}</span>
                  <strong className="text-sm font-black text-slate-900 dark:text-white mt-1.5 block">{stat.val}</strong>
                </div>
              ))}
            </div>

            {/* Approvals section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Approvals and reject queue */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6">
                <h4 className="text-xs font-black uppercase text-slate-400 mb-4">Pending Product Submissions Moderation Queue</h4>
                
                {resources.filter(r => r.status === 'pending').length === 0 ? (
                  <p className="text-xs text-slate-400 py-12 text-center">No submitted products are currently pending approval. All caught up!</p>
                ) : (
                  <div className="space-y-4">
                    {resources.filter(r => r.status === 'pending').map(item => (
                      <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-black text-slate-800 dark:text-white">{item.name}</strong>
                            <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono font-bold uppercase">{item.category}</span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 mt-1 max-w-md">{item.description}</p>
                          <div className="flex gap-4 mt-2 text-[10px] text-slate-400">
                            <span>Author: {item.author.name}</span>
                            <span>•</span>
                            <span>Requested Price: {item.price === 0 ? 'Free' : `$${item.price}`}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAdminApprove(item.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold rounded-xl transition cursor-pointer"
                          >
                            Approve Live
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Please enter rejection reason:');
                              if (reason) handleAdminReject(item.id, reason);
                            }}
                            className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white text-[10.5px] font-bold rounded-xl transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Flagged Moderation reports column */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 mb-3">Marketplace Abuse & Flag Reports</h4>
                  
                  {userReports.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No product reports reported by visitors. Good standing!</p>
                  ) : (
                    <div className="space-y-3">
                      {userReports.map(rep => (
                        <div key={rep.id} className="p-3 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-2xl">
                          <div className="flex justify-between text-[11px] font-bold text-red-800 dark:text-red-400">
                            <span className="truncate max-w-[150px]">{rep.resourceName}</span>
                            <span>{rep.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Reason: "{rep.reason}"</p>
                          <div className="flex gap-2 mt-2 justify-end">
                            <button
                              onClick={() => handleAdminModerateReport(rep.id, 'dismiss')}
                              className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => handleAdminModerateReport(rep.id, 'ban', rep.resourceId)}
                              className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded"
                            >
                              Remove Product
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* --- MODAL 1: HIGH-FIDELITY RESOURCE DETAIL VIEW (INTEGRATED LIVE PREVIEW, DOCS, CHROME) --- */}
      {selectedResource && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-[110] p-4 font-sans text-start">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-3xl border border-slate-200 dark:border-slate-850 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Title bar */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white bg-teal-600 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {selectedResource.category}
                </span>
                <span className="text-[10.5px] text-slate-400 font-mono">v{selectedResource.version}</span>
              </div>

              <button
                onClick={() => setSelectedResource(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-500 dark:text-slate-300 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Modal body columns split */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Left Column: Media slideshow Gallery & Documentation */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {language === 'ar' && selectedResource.titleAr ? selectedResource.titleAr : selectedResource.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-400">By {selectedResource.author.name}</span>
                    {selectedResource.author.verified && <Check className="w-3.5 h-3.5 text-teal-500 bg-teal-500/10 rounded-full p-0.5" />}
                  </div>
                </div>

                {/* Gallery Slide */}
                <div className="aspect-video bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden relative">
                  <img
                    src={selectedResource.gallery[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600'}
                    alt="Gallery"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Gallery Thumbnail picker list */}
                {selectedResource.gallery.length > 1 && (
                  <div className="flex gap-2">
                    {selectedResource.gallery.map((img, idx) => (
                      <div key={idx} className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-850 bg-slate-100 shrink-0">
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-tabs menu navigator for Doc, changelog, reviews */}
                <div className="border-b border-slate-200 dark:border-slate-800 flex gap-4">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'doc', label: 'Documentation' },
                    { id: 'changelog', label: 'Changelog' },
                    { id: 'reviews', label: `Reviews (${selectedResource.reviews.length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailSubTab(tab.id as any)}
                      className={`pb-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${detailSubTab === tab.id ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-400'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Details Subtab content container */}
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {detailSubTab === 'overview' && (
                    <p>{language === 'ar' && selectedResource.descriptionAr ? selectedResource.descriptionAr : selectedResource.description}</p>
                  )}

                  {detailSubTab === 'doc' && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 font-mono whitespace-pre-wrap">
                      {selectedResource.documentation}
                    </div>
                  )}

                  {detailSubTab === 'changelog' && (
                    <div className="space-y-4">
                      {selectedResource.changelog.map((log, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
                          <div className="flex justify-between text-[11px] font-black">
                            <span>Version {log.version}</span>
                            <span className="text-slate-400">{log.date}</span>
                          </div>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[10.5px]">
                            {log.notes.map((n, i) => <li key={i}>{n}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {detailSubTab === 'reviews' && (
                    <div className="space-y-4">
                      {/* Submit review sub-form */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 text-start space-y-3">
                        <span className="text-[10px] font-black uppercase text-slate-400">Leave a Review</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(stars => (
                            <button key={stars} onClick={() => setReviewRating(stars)}>
                              <Star className={`w-4 h-4 ${reviewRating >= stars ? 'text-amber-500 fill-amber-400' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="What did you think of this package?"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none border border-slate-200/50 dark:border-slate-800"
                        />
                        <button
                          onClick={handleAddReview}
                          className="px-3 py-1 bg-teal-600 text-white rounded text-[10.5px] font-bold"
                        >
                          Submit Review
                        </button>
                      </div>

                      {selectedResource.reviews.length === 0 ? (
                        <p className="text-[10px] text-slate-400 text-center py-4">No reviews submitted yet. Be the first!</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedResource.reviews.map(rev => (
                            <div key={rev.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                              <div className="flex justify-between text-[10.5px] font-bold">
                                <span>{rev.author}</span>
                                <span className="text-slate-400">{rev.date}</span>
                              </div>
                              <div className="flex gap-0.5 my-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${rev.rating > i ? 'text-amber-500 fill-amber-400' : 'text-slate-300'}`} />
                                ))}
                              </div>
                              <p className="text-[10px]">{rev.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Actions panel */}
              <aside className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-950/20 space-y-6 flex flex-col justify-between shrink-0">
                <div className="space-y-5 text-start">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Price</span>
                    <strong className="text-sm font-black block text-slate-900 dark:text-white mt-1">
                      {selectedResource.price === 0 ? 'Free Download' : `$${selectedResource.price}.00`}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Downloads</span>
                    <strong className="text-xs font-bold block mt-1">{selectedResource.downloads} installs</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Compatibility</span>
                    <strong className="text-xs font-bold block mt-1">{selectedResource.compatibility}</strong>
                  </div>

                  {/* Active Licenses code section */}
                  {ownedLicenses[selectedResource.id] && (
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 rounded-2xl">
                      <span className="text-[9.5px] font-black text-teal-600 dark:text-teal-400 block uppercase">Sandbox License Key</span>
                      <code className="text-[10px] font-mono block mt-1 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-100 dark:border-slate-800 select-all">{ownedLicenses[selectedResource.id]}</code>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {installingId === selectedResource.id ? (
                    <div className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-center text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Installing {installProgress}%</span>
                    </div>
                  ) : installed[selectedResource.id] ? (
                    <div className="space-y-1.5">
                      <div className="py-2 bg-slate-100 dark:bg-slate-800 text-center text-xs font-bold text-slate-500 dark:text-slate-300 rounded-xl flex items-center justify-center gap-1">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Installed ({installed[selectedResource.id]})</span>
                      </div>
                      {installed[selectedResource.id] !== selectedResource.version && (
                        <button
                          onClick={(e) => handleOneClickUpdate(selectedResource.id, e)}
                          className="w-full py-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>One-Click Update</span>
                        </button>
                      )}
                    </div>
                  ) : selectedResource.price > 0 && !ownedLicenses[selectedResource.id] ? (
                    <button
                      onClick={() => {
                        setIsComingSoonOpen(true);
                      }}
                      className="w-full py-2 bg-amber-550 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-amber-500/10"
                    >
                      <span className="bg-white/20 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none shrink-0 mr-1">Coming Soon</span>
                      <span>Notify Me</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleOneClickInstall(selectedResource.id, e)}
                      className="w-full py-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>One-Click Install</span>
                    </button>
                  )}

                  <div className="flex gap-1">
                    <button
                      onClick={(e) => handleShareProduct(selectedResource.id, e)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => {
                        setReportResourceId(selectedResource.id);
                        setIsReportOpen(true);
                      }}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-red-500 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </aside>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 2: COMING SOON LEAD CAPTURE --- */}
      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        language={language}
        showNotification={(msg) => alert(msg)}
        userEmail={userEmail}
      />

      {/* --- MODAL 3: REPORT SUBMISSION DIALOG --- */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[120] p-4 font-sans text-start">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-850 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-red-500">Report Resource Abuse</h3>
              <button onClick={() => setIsReportOpen(false)} className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              If this package has malware, infringes trademark, or fails to live up to description, submit a report for moderation.
            </p>

            <textarea
              required
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="State your reason for reporting..."
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl h-24 outline-none resize-none border border-slate-200/50 dark:border-slate-800"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setIsReportOpen(false)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="flex-1 py-2 bg-red-600 text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Submit Abuse Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
