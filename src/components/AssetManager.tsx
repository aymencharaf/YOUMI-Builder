import React, { useState, useEffect, useRef } from 'react';
import { Asset } from '../types';
import { 
  Search, Plus, X, Image as ImageIcon, Check, Trash2, Smile, UploadCloud, 
  Folder, FolderOpen, Heart, Grid, List, Star, Filter, Edit, RotateCw, 
  FlipHorizontal, FlipVertical, Crop, Download, Layers, Sparkles, RefreshCw, 
  Clock, Tag, HelpCircle, Eye, Info, Play, FileJson, CheckCircle2, Sliders, Scissors
} from 'lucide-react';
import * as Lucide from 'lucide-react';
import { useTranslation } from '../utils/i18n';

// --- MOCK BULK ASSET GENERATOR & BUILT-IN LIBRARIES DATA ---
const UNSPLASH_PRESETS = [
  { id: 'uns-1', name: 'Elegant Silk Dress', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop', category: 'product', tags: ['fashion', 'dress', 'luxury'], provider: 'Unsplash' },
  { id: 'uns-2', name: 'Golden Hour Sunglasses', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop', category: 'product', tags: ['sunglasses', 'accessory', 'summer'], provider: 'Unsplash' },
  { id: 'uns-3', name: 'Smart Fitness Tracker', url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop', category: 'product', tags: ['tech', 'wearable', 'smartwatch'], provider: 'Unsplash' },
  { id: 'uns-4', name: 'Premium Coffee Maker', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop', category: 'product', tags: ['kitchen', 'coffee', 'black'], provider: 'Unsplash' },
  { id: 'uns-5', name: 'Modern Desk Setup', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop', category: 'hero', tags: ['tech', 'workspace', 'home'], provider: 'Unsplash' },
  { id: 'uns-6', name: 'Healthy Fruit Smoothie', url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop', category: 'product', tags: ['food', 'organic', 'smoothie'], provider: 'Pexels' },
  { id: 'uns-7', name: 'Luminous Glow Serum', url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop', category: 'logo', tags: ['cosmetics', 'serum', 'skincare'], provider: 'Pexels' },
  { id: 'uns-8', name: 'Fresh Avocado Toast', url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop', category: 'product', tags: ['food', 'organic', 'breakfast'], provider: 'Pixabay' },
  { id: 'uns-9', name: 'Luxury Leather Handbag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop', category: 'product', tags: ['bag', 'fashion', 'leather'], provider: 'Pixabay' },
  { id: 'uns-10', name: 'Nordic Lounge Chair', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop', category: 'category', tags: ['furniture', 'chair', 'scandinavian'], provider: 'Openverse' }
];

// Curated vector paths of 6 modern, responsive SVGs resembling unDraw illustrations
const UNDRAW_TEMPLATES = [
  {
    id: 'undraw-shopping',
    name: 'Online Shopping Vector',
    svgCode: `<svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="350" fill="#f8fafc" rx="16"/>
      <!-- Background Circles -->
      <circle cx="250" cy="175" r="120" fill="ACCENT_COLOR" fill-opacity="0.08"/>
      <circle cx="400" cy="100" r="50" fill="ACCENT_COLOR" fill-opacity="0.04"/>
      <!-- Shopping Cart Outline -->
      <path d="M120 240 L160 240 L190 120 L340 120 L370 200 L180 200" stroke="ACCENT_COLOR" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="210" cy="270" r="18" fill="ACCENT_COLOR" />
      <circle cx="310" cy="270" r="18" fill="ACCENT_COLOR" />
      <!-- Floating Boxes -->
      <rect x="210" y="70" width="50" height="40" rx="6" fill="ACCENT_COLOR" fill-opacity="0.8"/>
      <rect x="280" y="50" width="60" height="50" rx="8" fill="ACCENT_COLOR"/>
      <path d="M295 75 L310 90 L325 75" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <circle cx="160" cy="80" r="25" fill="#f43f5e" />
      <path d="M152 80 L168 80 M160 72 L160 88" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'undraw-analysis',
    name: 'Dashboard Analytics',
    svgCode: `<svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="350" fill="#f8fafc" rx="16"/>
      <circle cx="380" cy="220" r="100" fill="ACCENT_COLOR" fill-opacity="0.06"/>
      <!-- Grid lines -->
      <line x1="80" y1="260" x2="420" y2="260" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>
      <!-- Bar charts -->
      <rect x="100" y="160" width="30" height="100" rx="6" fill="ACCENT_COLOR" fill-opacity="0.4"/>
      <rect x="150" y="100" width="30" height="160" rx="6" fill="ACCENT_COLOR"/>
      <rect x="200" y="180" width="30" height="80" rx="6" fill="ACCENT_COLOR" fill-opacity="0.3"/>
      <rect x="250" y="70" width="30" height="190" rx="6" fill="ACCENT_COLOR"/>
      <!-- Line overlay -->
      <path d="M115 150 L165 90 L215 170 L265 60 L315 110" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="265" cy="60" r="8" fill="#f59e0b"/>
      <!-- Decorative circle -->
      <circle cx="360" cy="130" r="25" fill="ACCENT_COLOR" fill-opacity="0.2"/>
    </svg>`
  },
  {
    id: 'undraw-delivery',
    name: 'Swift Delivery Truck',
    svgCode: `<svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="350" fill="#f8fafc" rx="16"/>
      <circle cx="200" cy="150" r="90" fill="ACCENT_COLOR" fill-opacity="0.08"/>
      <!-- Truck Body -->
      <rect x="120" y="130" width="180" height="100" rx="12" fill="ACCENT_COLOR"/>
      <path d="M300 150 L350 150 L370 190 L370 230 L300 230 Z" fill="ACCENT_COLOR" fill-opacity="0.8"/>
      <rect x="315" y="160" width="35" height="30" rx="4" fill="#ffffff"/>
      <!-- Wheels -->
      <circle cx="170" cy="245" r="24" fill="#334155" />
      <circle cx="170" cy="245" r="10" fill="#f1f5f9" />
      <circle cx="310" cy="245" r="24" fill="#334155" />
      <circle cx="310" cy="245" r="10" fill="#f1f5f9" />
      <!-- Speed Motion Lines -->
      <line x1="60" y1="150" x2="100" y2="150" stroke="ACCENT_COLOR" stroke-width="4" stroke-linecap="round"/>
      <line x1="45" y1="180" x2="90" y2="180" stroke="ACCENT_COLOR" stroke-width="4" stroke-linecap="round"/>
      <line x1="65" y1="210" x2="100" y2="210" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'undraw-innovative',
    name: 'Innovative Team Ideas',
    svgCode: `<svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="350" fill="#f8fafc" rx="16"/>
      <path d="M250 80 C200 80 180 120 180 160 C180 200 210 220 220 240 L280 240 C290 220 320 200 320 160 C320 120 300 80 250 80 Z" fill="ACCENT_COLOR" fill-opacity="0.1" stroke="ACCENT_COLOR" stroke-width="5"/>
      <rect x="225" y="250" width="50" height="15" rx="3" fill="ACCENT_COLOR"/>
      <rect x="232" y="270" width="36" height="10" rx="2" fill="#94a3b8"/>
      <!-- Glow rays -->
      <line x1="250" y1="40" x2="250" y2="60" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
      <line x1="160" y1="90" x2="180" y2="105" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
      <line x1="340" y1="90" x2="320" y2="105" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
      <circle cx="250" cy="160" r="30" fill="ACCENT_COLOR"/>
      <path d="M240 160 L248 168 L262 154" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  }
];

// Popular Icons definitions from Lucide/Hero/Tabler simulation
const EXTRA_POPULAR_ICONS = [
  { name: 'Home', category: 'General' }, { name: 'Search', category: 'General' },
  { name: 'Settings', category: 'General' }, { name: 'User', category: 'General' },
  { name: 'ShoppingBag', category: 'E-commerce' }, { name: 'ShoppingCart', category: 'E-commerce' },
  { name: 'CreditCard', category: 'E-commerce' }, { name: 'Truck', category: 'E-commerce' },
  { name: 'Percent', category: 'E-commerce' }, { name: 'Tag', category: 'E-commerce' },
  { name: 'Activity', category: 'Health' }, { name: 'Heart', category: 'Health' },
  { name: 'Award', category: 'Marketing' }, { name: 'Star', category: 'Marketing' },
  { name: 'Globe', category: 'Business' }, { name: 'Shield', category: 'Business' },
  { name: 'Sparkles', category: 'Creative' }, { name: 'Palette', category: 'Creative' },
  { name: 'Flame', category: 'Social' }, { name: 'MessageSquare', category: 'Social' },
  { name: 'Trash2', category: 'System' }, { name: 'X', category: 'System' },
  { name: 'Check', category: 'System' }, { name: 'RefreshCw', category: 'System' }
];

// Rich custom mocked media file representations
const DEFAULT_MEDIA_FILES = [
  { id: 'm-1', name: 'Premium Logo Dark.svg', url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=200', type: 'svg', size: '12 KB', width: 250, height: 80, tags: ['logo', 'brand'], folder: 'Brand Identity', isFavorite: true, date: '2026-07-15' },
  { id: 'm-2', name: 'Autumn Banner.webp', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200', type: 'webp', size: '240 KB', width: 1920, height: 1080, tags: ['banner', 'fashion', 'hero'], folder: 'Marketing Campaigns', isFavorite: false, date: '2026-07-18' },
  { id: 'm-3', name: 'Headphones Mockup.png', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400', type: 'png', size: '520 KB', width: 800, height: 800, tags: ['product', 'gadget'], folder: 'Products', isFavorite: true, date: '2026-07-20' },
  { id: 'm-4', name: 'Interactive Demo.mp4', url: 'https://assets.mixkit.co/videos/preview/mixkit-women-selecting-items-from-clothing-rack-33234-large.mp4', type: 'mp4', size: '4.8 MB', width: 1280, height: 720, tags: ['video', 'ecommerce', 'promo'], folder: 'Marketing Campaigns', isFavorite: false, date: '2026-07-19' },
  { id: 'm-5', name: 'Happy Loading Loop.json', url: 'https://assets4.lottiefiles.com/packages/lf20_mr6shfka.json', type: 'json', size: '85 KB', width: 400, height: 400, tags: ['animation', 'lottie', 'interactive'], folder: 'Brand Identity', isFavorite: false, date: '2026-07-14' }
];

interface AssetManagerProps {
  assets: Asset[];
  onAddAsset: (asset: Omit<Asset, 'id'>) => void;
  onDeleteAsset: (id: string) => void;
  onSelect: (url: string) => void;
  onClose: () => void;
  filterCategory?: 'logo' | 'hero' | 'product' | 'category';
}

export default function AssetManager({
  assets: initialAssetsFromProps,
  onAddAsset,
  onDeleteAsset,
  onSelect,
  onClose,
  filterCategory,
}: AssetManagerProps) {
  const { t, dir, language } = useTranslation();

  // --- CORE STATE ---
  const [activeTab, setActiveTab] = useState<'all' | 'uploads' | 'unsplash' | 'undraw' | 'icons' | 'recently'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFolder, setActiveFolder] = useState<string>('All Folders');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(filterCategory || 'all');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // --- EXTENDED PERSISTENT LOCAL STORAGE STATES ---
  const [mediaItems, setMediaItems] = useState(() => {
    const saved = localStorage.getItem('youmi_media_library_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    // Combine INITIAL_ASSETS with customized properties
    const transformed = initialAssetsFromProps.map((as, idx) => {
      const isHero = as.category === 'hero';
      const isLogo = as.category === 'logo';
      return {
        id: as.id || `prop-${idx}`,
        name: as.name || `${as.category.toUpperCase()} Asset`,
        url: as.url,
        type: as.url.endsWith('.svg') ? 'svg' : isHero ? 'webp' : 'jpeg',
        size: isHero ? '185 KB' : '92 KB',
        width: isHero ? 1920 : isLogo ? 300 : 800,
        height: isHero ? 600 : isLogo ? 100 : 800,
        tags: [as.category, 'curated', 'preset'],
        folder: isLogo ? 'Brand Identity' : isHero ? 'Marketing Campaigns' : 'Products',
        isFavorite: idx % 3 === 0,
        date: '2026-07-20'
      };
    });
    return [...DEFAULT_MEDIA_FILES, ...transformed];
  });

  const [folders, setFolders] = useState<string[]>(() => {
    const saved = localStorage.getItem('youmi_media_folders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return ['Marketing Campaigns', 'Brand Identity', 'Products', 'Seasonal Promos'];
  });

  const [recentlyUsed, setRecentlyUsed] = useState<any[]>(() => {
    const saved = localStorage.getItem('youmi_recently_used_media');
    return saved ? JSON.parse(saved) : [];
  });

  // Save states
  useEffect(() => {
    localStorage.setItem('youmi_media_library_items', JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem('youmi_media_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('youmi_recently_used_media', JSON.stringify(recentlyUsed));
  }, [recentlyUsed]);

  // --- MULTIPLE UPLOADS PROGRESS TRACKING ---
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgressList, setUploadProgressList] = useState<{ name: string; pct: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- IMAGE EDITOR STATE ---
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [cropRatio, setCropRatio] = useState<'free' | '1:1' | '16:9' | '4:3'>('free');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [editorFilter, setEditorFilter] = useState<string>('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [aiRemovingBackground, setAiRemovingBackground] = useState(false);
  const [bgRemovedSuccess, setBgRemovedSuccess] = useState(false);
  const [editorWebpCompressing, setEditorWebpCompressing] = useState(false);

  // --- THIRD PARTY SEARCH STATES ---
  const [unDrawColor, setUnDrawColor] = useState('#0d9488');
  const [unsplashSearch, setUnsplashSearch] = useState('');
  const [unsplashList, setUnsplashList] = useState(UNSPLASH_PRESETS);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const [iconFamily, setIconFamily] = useState<'all' | 'lucide' | 'heroicons' | 'tabler'>('all');

  // --- OTHER INTERACTION STATES ---
  const [newFolderNameInput, setNewFolderNameInput] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [visibleItemsCount, setVisibleItemsCount] = useState(12);

  const selectedAsset = mediaItems.find((m: any) => m.id === selectedAssetId) || mediaItems[0];

  // --- FUNCTIONS FOR UPLOAD ---
  const processMultipleFiles = async (files: FileList) => {
    const list = Array.from(files);
    const updatedProgress = list.map(f => ({ name: f.name, pct: 10 }));
    setUploadProgressList(updatedProgress);

    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      // Simulate visual progression
      let pPct = 10;
      const interval = setInterval(() => {
        pPct += 30;
        if (pPct >= 100) {
          clearInterval(interval);
        }
        setUploadProgressList(prev => prev.map((item, idx) => idx === i ? { ...item, pct: Math.min(pPct, 100) } : item));
      }, 150);

      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = (e) => {
          clearInterval(interval);
          const base64Url = e.target?.result as string;
          const format = file.name.split('.').pop() || 'png';
          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
          const sizeText = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${Math.round(file.size / 1024)} KB`;

          const newMedia = {
            id: 'm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
            name: file.name,
            url: base64Url,
            type: format.toLowerCase(),
            size: sizeText,
            width: 800,
            height: 600,
            tags: [format, 'uploaded'],
            folder: activeFolder === 'All Folders' ? 'Products' : activeFolder,
            isFavorite: false,
            date: new Date().toISOString().split('T')[0]
          };

          setMediaItems((prev: any) => [newMedia, ...prev]);
          // Sync with original applet assets callback
          onAddAsset({
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: base64Url,
            category: 'product'
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setTimeout(() => {
      setUploadProgressList([]);
    }, 1500);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processMultipleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processMultipleFiles(e.target.files);
    }
  };

  // --- ORGANIZING ACTIONS ---
  const createFolder = () => {
    if (!newFolderNameInput.trim()) return;
    if (folders.includes(newFolderNameInput.trim())) return;
    setFolders(prev => [...prev, newFolderNameInput.trim()]);
    setActiveFolder(newFolderNameInput.trim());
    setNewFolderNameInput('');
    setShowNewFolderModal(false);
  };

  const moveAssetToFolder = (assetId: string, folderName: string) => {
    setMediaItems((prev: any) => prev.map((item: any) => 
      item.id === assetId ? { ...item, folder: folderName } : item
    ));
  };

  const toggleFavorite = (assetId: string) => {
    setMediaItems((prev: any) => prev.map((item: any) => 
      item.id === assetId ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const deleteAssetLocal = (id: string) => {
    setMediaItems((prev: any) => prev.filter((item: any) => item.id !== id));
    onDeleteAsset(id);
    if (selectedAssetId === id) {
      setSelectedAssetId(null);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredItems = mediaItems.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = activeFolder === 'All Folders' || item.folder === activeFolder;
    const matchesCategory = activeCategoryFilter === 'all' || 
      (activeCategoryFilter === 'logo' && item.tags.includes('logo')) ||
      (activeCategoryFilter === 'hero' && item.tags.includes('hero') || item.tags.includes('banner')) ||
      (activeCategoryFilter === 'product' && item.tags.includes('product')) ||
      (activeCategoryFilter === 'category' && item.tags.includes('category'));

    const matchesFavorite = !favoritesOnly || item.isFavorite;
    const matchesTag = !tagFilter || item.tags.includes(tagFilter);

    return matchesSearch && matchesFolder && matchesCategory && matchesFavorite && matchesTag;
  });

  // Curated all tags list for side filter
  const allUniqueTags = Array.from(
    new Set(mediaItems.flatMap((item: any) => item.tags))
  ).slice(0, 12);

  // --- IMAGE SELECT & PERSISTENCE ---
  const handleSelectAndClose = (url: string, name: string) => {
    // Add to recently used
    const item = { url, name, date: new Date().toLocaleTimeString() };
    setRecentlyUsed(prev => {
      const filtered = prev.filter(p => p.url !== url);
      return [item, ...filtered].slice(0, 12);
    });
    onSelect(url);
  };

  // --- IMAGE EDITOR ACTIONS ---
  const openEditor = (asset: any) => {
    setEditingAssetId(asset.id);
    // Reset sliders
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setEditorFilter('none');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setBgRemovedSuccess(false);
  };

  const applyBackgroundRemovalMock = () => {
    setAiRemovingBackground(true);
    setTimeout(() => {
      setAiRemovingBackground(false);
      setBgRemovedSuccess(true);
    }, 2000);
  };

  const applyWebpCompressionMock = () => {
    setEditorWebpCompressing(true);
    setTimeout(() => {
      setEditorWebpCompressing(false);
      // Simulate compressed format
      setMediaItems((prev: any) => prev.map((item: any) => {
        if (item.id === editingAssetId) {
          return {
            ...item,
            type: 'webp',
            size: '56 KB',
            tags: [...item.tags.filter((t: string) => t !== 'png' && t !== 'jpeg'), 'webp', 'compressed']
          };
        }
        return item;
      }));
    }, 1500);
  };

  const saveEditedImage = () => {
    // In a fully production client app, we construct the canvas and apply filters and draw.
    // Let's create a gorgeous high-fidelity representation by appending properties and updating!
    setMediaItems((prev: any) => prev.map((item: any) => {
      if (item.id === editingAssetId) {
        // Appending edits parameters so we can render visually with CSS filters in preview
        return {
          ...item,
          editorMeta: {
            filter: editorFilter,
            brightness,
            contrast,
            saturation,
            blur,
            flipH,
            flipV,
            rotation
          }
        };
      }
      return item;
    }));
    setEditingAssetId(null);
  };

  // --- SEARCH FOR BUILT IN LIBRARIES ---
  const handleUnsplashSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsplashSearch.trim()) return;
    // Simulate beautiful CDN ready image queries
    const categories = ['fashion', 'shoes', 'tech', 'marketing', 'banner', 'grocery', 'organic', 'home'];
    const matchedCategory = categories.find(c => unsplashSearch.toLowerCase().includes(c)) || 'product';

    const simulatedList = [
      {
        id: 'uns-sim-1',
        name: `High-Res ${unsplashSearch} Mockup`,
        url: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop&sig=${Math.random()}`,
        category: matchedCategory,
        tags: [unsplashSearch, 'curated', 'unsplash'],
        provider: 'Unsplash'
      },
      {
        id: 'uns-sim-2',
        name: `Minimalist ${unsplashSearch} Banner`,
        url: `https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop&sig=${Math.random()}`,
        category: 'hero',
        tags: [unsplashSearch, 'commercial', 'pexels'],
        provider: 'Pexels'
      },
      {
        id: 'uns-sim-3',
        name: `${unsplashSearch} Lifestyle Shot`,
        url: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop&sig=${Math.random()}`,
        category: 'product',
        tags: [unsplashSearch, 'lifestyle', 'pixabay'],
        provider: 'Pixabay'
      },
      {
        id: 'uns-sim-4',
        name: `${unsplashSearch} Organic Pattern`,
        url: `https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=600&auto=format&fit=crop&sig=${Math.random()}`,
        category: 'category',
        tags: [unsplashSearch, 'creative', 'openverse'],
        provider: 'Openverse'
      }
    ];
    setUnsplashList(simulatedList as any);
  };

  // Helper to dynamically color unDraw SVG templates
  const getColouredSvgUrl = (svgCode: string, color: string) => {
    const colored = svgCode.replace(/ACCENT_COLOR/g, color);
    return `data:image/svg+xml;utf8,${encodeURIComponent(colored)}`;
  };

  // --- ICON SEARCH ---
  const filteredIconsList = EXTRA_POPULAR_ICONS.filter((ic) => {
    const matchesTerm = ic.name.toLowerCase().includes(iconSearchTerm.toLowerCase());
    return matchesTerm;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-3 md:p-6 select-none font-sans" dir={dir}>
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* TOP HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600/10 dark:bg-teal-400/10 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400">
              <ImageIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'مكتبة الوسائط الاحترافية' : 'Professional Media Suite'}</span>
                <span className="text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-full font-mono font-bold tracking-tight">YOUMI v3.0</span>
              </h3>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                {language === 'ar' ? 'قم بإدارة وتعديل وتصفح آلاف الصور والأيقونات بدقة متناهية' : 'Curate, edit, colorize and deploy gorgeous media assets seamlessly'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY AREA */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* COLUMN 1: LEFT NAVIGATION RAIL */}
          <div className="w-56 shrink-0 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Tabs */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block">
                  {language === 'ar' ? 'المكتبات المدمجة' : 'Asset Libraries'}
                </span>
                
                {[
                  { id: 'all', label: language === 'ar' ? 'كل الوسائط' : 'All Media', icon: ImageIcon },
                  { id: 'uploads', label: language === 'ar' ? 'رفع محلي' : 'Local Uploads', icon: UploadCloud },
                  { id: 'unsplash', label: 'Unsplash & Pexels', icon: Sparkles },
                  { id: 'undraw', label: 'unDraw Vectors', icon: Layers },
                  { id: 'icons', label: language === 'ar' ? 'مستكشف الأيقونات' : 'Vector Icons', icon: Smile },
                  { id: 'recently', label: language === 'ar' ? 'المستخدمة مؤخراً' : 'Recently Used', icon: Clock }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Folders Management section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {language === 'ar' ? 'المجلدات' : 'Folders'}
                  </span>
                  <button 
                    onClick={() => setShowNewFolderModal(true)} 
                    className="p-1 text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => setActiveFolder('All Folders')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg transition-all text-start ${
                      activeFolder === 'All Folders'
                        ? 'bg-slate-200 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span className="truncate">{language === 'ar' ? 'كل المجلدات' : 'All Folders'}</span>
                  </button>

                  {folders.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFolder(f)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg transition-all text-start ${
                        activeFolder === f
                          ? 'bg-slate-200 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 text-amber-500" />
                      <span className="truncate">{f}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Tags Quick Filter */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block">
                  {language === 'ar' ? 'فلترة حسب الوسم' : 'Filter by Tag'}
                </span>
                <div className="flex flex-wrap gap-1 px-2">
                  <button
                    onClick={() => setTagFilter(null)}
                    className={`px-2 py-0.5 text-[9.5px] font-bold rounded-md transition cursor-pointer ${!tagFilter ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                  >
                    All Tags
                  </button>
                  {allUniqueTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setTagFilter(tag)}
                      className={`px-2 py-0.5 text-[9.5px] font-bold rounded-md transition cursor-pointer ${tagFilter === tag ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/60 p-3 rounded-2xl border border-teal-100/50 dark:border-slate-700/50">
              <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 block">💡 Tip</span>
              <p className="text-[9.5px] text-slate-505 dark:text-slate-400 mt-1 leading-relaxed">
                {language === 'ar' ? 'يمكنك سحب الصور وإفلاتها مباشرة فوق النموذج لتطبيقها تلقائياً!' : 'Drag elements directly into preview grids to instantly update sections!'}
              </p>
            </div>
          </div>

          {/* COLUMN 2: MIDDLE BROWSER / COMPONENT CONTAINER */}
          <div className="flex-1 flex flex-col bg-slate-50/20 dark:bg-slate-950/20 overflow-hidden">
            
            {/* SUB-HEADER FILTERS BAR */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Search input */}
                <div className="relative w-64">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'ar' ? 'بحث باسم الملف أو الكلمة الدلالية...' : 'Search name or tag...'}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Categories Bar */}
                <div className="flex bg-slate-100 dark:bg-slate-850 p-1 rounded-xl">
                  {[
                    { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
                    { id: 'logo', label: language === 'ar' ? 'شعار' : 'Logo' },
                    { id: 'hero', label: language === 'ar' ? 'غلاف' : 'Hero' },
                    { id: 'product', label: language === 'ar' ? 'منتجات' : 'Products' },
                    { id: 'category', label: language === 'ar' ? 'أقسام' : 'Category' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeCategoryFilter === cat.id
                          ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorites Checkbox */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={favoritesOnly}
                    onChange={(e) => setFavoritesOnly(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                  />
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                  <span>{language === 'ar' ? 'المفضلة فقط' : 'Favorites only'}</span>
                </label>
              </div>
            </div>

            {/* MAIN CONTENT AREA BY TAB */}
            <div className="flex-1 overflow-y-auto p-5 relative">
              
              {/* TAB 1: ALL MEDIA & SEARCH BROWSER */}
              {activeTab === 'all' && (
                <div className="space-y-6">
                  {/* Folders banner info if folder selected */}
                  {activeFolder !== 'All Folders' && (
                    <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 p-3 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-amber-500" />
                        <div>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-white">{activeFolder}</span>
                          <span className="text-[10px] text-slate-400 block">{filteredItems.length} items organized in this folder</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveFolder('All Folders')}
                        className="text-xs text-teal-600 font-bold hover:underline"
                      >
                        Back to All Folders
                      </button>
                    </div>
                  )}

                  {/* Grid / List View Loader */}
                  {filteredItems.length === 0 ? (
                    <div className="py-24 text-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {language === 'ar' ? 'لم يتم العثور على ملفات' : 'No media items found'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        {language === 'ar' ? 'جرب البحث بكلمة أخرى أو ارفع ملفات جديدة من جهازك.' : 'Try adjusting your search query, selecting another category or folder.'}
                      </p>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredItems.slice(0, visibleItemsCount).map((item: any) => {
                        const isFav = item.isFavorite;
                        const isVideo = item.type === 'mp4';
                        const isJson = item.type === 'json';
                        return (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', item.url);
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => setSelectedAssetId(item.id)}
                            className={`group relative bg-white dark:bg-slate-900 border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                              selectedAssetId === item.id 
                                ? 'border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/10' 
                                : 'border-slate-100 dark:border-slate-800/80'
                            }`}
                          >
                            {/* Graphic preview */}
                            <div className="aspect-video bg-slate-50 dark:bg-slate-950 overflow-hidden relative flex items-center justify-center">
                              {isVideo ? (
                                <video src={item.url} muted loop autoPlay className="w-full h-full object-cover" />
                              ) : isJson ? (
                                <div className="p-3 text-center flex flex-col items-center">
                                  <FileJson className="w-8 h-8 text-indigo-500 animate-bounce" />
                                  <span className="text-[10px] text-slate-400 font-mono mt-1">Lottie Animation</span>
                                </div>
                              ) : (
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-all group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                  style={item.editorMeta ? {
                                    filter: `${item.editorMeta.filter !== 'none' ? `url(#filter-${item.editorMeta.filter})` : ''} brightness(${item.editorMeta.brightness}%) contrast(${item.editorMeta.contrast}%) saturate(${item.editorMeta.saturation}%) blur(${item.editorMeta.blur}px)`,
                                    transform: `rotate(${item.editorMeta.rotation}deg) scaleX(${item.editorMeta.flipH ? -1 : 1}) scaleY(${item.editorMeta.flipV ? -1 : 1})`
                                  } : undefined}
                                />
                              )}

                              {/* Badges Overlay */}
                              <div className="absolute top-2 left-2 flex gap-1.5">
                                <span className="text-[8px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-md uppercase tracking-tight">
                                  {item.type}
                                </span>
                                {item.folder && (
                                  <span className="text-[8px] font-bold text-white bg-amber-600/80 px-2 py-0.5 rounded-md truncate max-w-[80px]">
                                    {item.folder}
                                  </span>
                                )}
                              </div>

                              {/* Hover controls shortcut */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(item.id);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-xl opacity-0 group-hover:opacity-100 transition shadow-xs hover:scale-110"
                              >
                                <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
                              </button>
                            </div>

                            {/* Info body */}
                            <div className="p-3">
                              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate">
                                {item.name}
                              </span>
                              
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {item.width && item.height ? `${item.width}x${item.height}` : 'Vector'} • {item.size}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectAndClose(item.url, item.name);
                                  }}
                                  className="px-2 py-0.5 bg-teal-50 hover:bg-teal-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-600 dark:text-teal-400 text-[10px] font-extrabold rounded-md transition"
                                >
                                  {t('asset_select_btn')}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* LIST VIEW TABLE */
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold text-[10px] uppercase">
                            <th className="px-4 py-3">Preview</th>
                            <th className="px-4 py-3">File Name</th>
                            <th className="px-4 py-3">Folder</th>
                            <th className="px-4 py-3">Size & Resolution</th>
                            <th className="px-4 py-3">Format</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredItems.slice(0, visibleItemsCount).map((item: any) => (
                            <tr
                              key={item.id}
                              onClick={() => setSelectedAssetId(item.id)}
                              className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition ${selectedAssetId === item.id ? 'bg-teal-50/20 dark:bg-slate-800/80' : ''}`}
                            >
                              <td className="px-4 py-2.5">
                                <div className="w-12 h-8 bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center">
                                  {item.type === 'mp4' ? (
                                    <video src={item.url} muted className="w-full h-full object-cover" />
                                  ) : (
                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">
                                <span className="block truncate max-w-[200px]">{item.name}</span>
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded text-[10px] font-bold">
                                  {item.folder || 'Root'}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-slate-500 font-mono text-[10.5px]">
                                {item.width ? `${item.width} x ${item.height}` : 'Vector'} ({item.size})
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                  {item.type}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                                  <button
                                    onClick={() => toggleFavorite(item.id)}
                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500"
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => handleSelectAndClose(item.url, item.name)}
                                    className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10.5px] rounded-md transition"
                                  >
                                    Select
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Infinite Scroll Load More Simulation */}
                  {filteredItems.length > visibleItemsCount && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => setVisibleItemsCount(prev => prev + 12)}
                        className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition shadow-xs cursor-pointer flex items-center gap-1.5 mx-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'عرض المزيد من الصور' : 'Load More Media'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MANUAL DRAG & DROP MULTI-FILE UPLOAD ZONE */}
              {activeTab === 'uploads' && (
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xs">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                      <UploadCloud className="w-5 h-5 text-teal-600 animate-bounce" />
                      <span>{language === 'ar' ? 'منصة الرفع المتعدد الاحترافية' : 'Universal Batch File Uploader'}</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto leading-normal">
                      Drag and drop multiple images, SVGs, MP4 videos, or Lottie JSON files. Files are automatically compressed and structured.
                    </p>

                    {/* Draggable container box */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`mt-6 border-3 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition duration-200 cursor-pointer ${
                        isDragging
                          ? 'border-teal-500 bg-teal-50/20 dark:bg-teal-950/20 text-teal-600'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-teal-400 text-slate-500'
                      }`}
                    >
                      <UploadCloud className="w-12 h-12 text-teal-500 mb-3" />
                      <span className="text-xs font-bold block text-slate-800 dark:text-white mb-1">
                        {isDragging ? 'Drop your files here!' : 'Drag & Drop Multiple Files'}
                      </span>
                      <span className="text-[10.5px] text-slate-400 mb-4">or browse files from your local storage</span>
                      
                      <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer">
                        {t('asset_browse_btn')}
                      </button>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/mp4,application/json"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400 font-mono">
                      <span>✓ SVG Support</span>
                      <span>• WEBP / AVIF Ready</span>
                      <span>• MP4 Video preview</span>
                      <span>• JSON Lottie Player</span>
                    </div>
                  </div>

                  {/* Active Batch Upload Progress indicators */}
                  {uploadProgressList.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                      <h5 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                        <span>Bulk Upload Progress ({uploadProgressList.length} files)</span>
                      </h5>
                      <div className="space-y-2">
                        {uploadProgressList.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{item.name}</span>
                              <span className="font-mono text-teal-600 font-bold">{item.pct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-500 transition-all duration-150" style={{ width: `${item.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INTEGRATED COMMERCIAL UN-SPLASH & PEXELS */}
              {activeTab === 'unsplash' && (
                <div className="space-y-5">
                  {/* Search tool block */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={handleUnsplashSearch} className="flex-1 max-w-lg flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                          <Sparkles className="w-4 h-4 text-teal-600" />
                        </span>
                        <input
                          type="text"
                          required
                          value={unsplashSearch}
                          onChange={(e) => setUnsplashSearch(e.target.value)}
                          placeholder="Search professional stock photos..."
                          className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                      >
                        Search
                      </button>
                    </form>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Popular:</span>
                      {['Fashion Model', 'SaaS Tech', 'Minimalist Chair', 'Grocery Product', 'Skincare Serum'].map(kw => (
                        <button
                          key={kw}
                          onClick={() => {
                            setUnsplashSearch(kw);
                            // Auto trigger search mock
                            const event = { preventDefault: () => {} };
                            setUnsplashSearch(kw);
                          }}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 text-[10px] rounded-lg text-slate-500 hover:text-teal-600 transition"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curated list */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {unsplashList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          // Inject into local mediaItems and select
                          const isNew = !mediaItems.some((m: any) => m.url === item.url);
                          if (isNew) {
                            const enriched = {
                              id: 'uns-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
                              name: item.name,
                              url: item.url,
                              type: 'webp',
                              size: '145 KB',
                              width: 1200,
                              height: 800,
                              tags: [...item.tags, item.provider.toLowerCase()],
                              folder: 'Products',
                              isFavorite: false,
                              date: '2026-07-20'
                            };
                            setMediaItems((prev: any) => [enriched, ...prev]);
                            onAddAsset({ name: item.name, url: item.url, category: item.category as any });
                          }
                          handleSelectAndClose(item.url, item.name);
                        }}
                        className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-teal-500 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <span className="absolute bottom-2 right-2 bg-black/70 text-[8.5px] font-bold text-white px-2 py-0.5 rounded-md">
                            {item.provider}
                          </span>
                        </div>
                        <div className="p-3">
                          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate">{item.name}</span>
                          <span className="text-[9.5px] text-slate-400 block mt-0.5">Free high-quality commercial license</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: UNDRAW VECTORS & GRAPHICS CUSTOM COLORIZER */}
              {activeTab === 'undraw' && (
                <div className="space-y-6">
                  {/* Color picker bar */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-teal-600 animate-spin" />
                        <span>unDraw Dynamic Color Theme</span>
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Select your brand color and watch vector illustrations automatically synchronize in real-time.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-505">Brand Accent Color:</span>
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200/50">
                        <input
                          type="color"
                          value={unDrawColor}
                          onChange={(e) => setUnDrawColor(e.target.value)}
                          className="w-7 h-7 rounded-lg border-none cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-teal-600 select-all">{unDrawColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Illustrations List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {UNDRAW_TEMPLATES.map((item) => {
                      const finalSvgUrl = getColouredSvgUrl(item.svgCode, unDrawColor);
                      return (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 flex flex-col gap-4 shadow-xs"
                        >
                          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden p-4 flex items-center justify-center">
                            <div 
                              className="w-full h-48 flex items-center justify-center"
                              dangerouslySetInnerHTML={{ __html: item.svgCode.replace(/ACCENT_COLOR/g, unDrawColor) }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-extrabold text-slate-800 dark:text-white">{item.name}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Custom brand SVG graphic</span>
                            </div>

                            <button
                              onClick={() => {
                                // Add SVG to library
                                const enriched = {
                                  id: item.id + '-' + Date.now(),
                                  name: item.name + '.svg',
                                  url: finalSvgUrl,
                                  type: 'svg',
                                  size: '15 KB',
                                  width: 500,
                                  height: 350,
                                  tags: ['svg', 'vector', 'illustration', 'brand'],
                                  folder: 'Brand Identity',
                                  isFavorite: true,
                                  date: '2026-07-20'
                                };
                                setMediaItems((prev: any) => [enriched, ...prev]);
                                onAddAsset({ name: item.name, url: finalSvgUrl, category: 'logo' });
                                handleSelectAndClose(finalSvgUrl, item.name);
                              }}
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
                            >
                              Add & Select SVG
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: VECTOR ICONS DIRECTORY */}
              {activeTab === 'icons' && (
                <div className="flex-1 flex flex-col overflow-hidden space-y-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-72">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={iconSearchTerm}
                        onChange={(e) => setIconSearchTerm(e.target.value)}
                        placeholder="Search Lucide, Hero, Tabler icons..."
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      {[
                        { id: 'all', label: 'All Families' },
                        { id: 'lucide', label: 'Lucide' },
                        { id: 'heroicons', label: 'Heroicons' },
                        { id: 'tabler', label: 'Tabler' }
                      ].map((fam) => (
                        <button
                          key={fam.id}
                          onClick={() => setIconFamily(fam.id as any)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            iconFamily === fam.id
                              ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                              : 'text-slate-505 hover:text-slate-800'
                          }`}
                        >
                          {fam.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                    {filteredIconsList.map((ic) => {
                      // Attempt rendering dynamically via Lucide
                      const IconComponent = (Lucide as any)[ic.name];
                      return (
                        <button
                          key={ic.name}
                          onClick={() => {
                            // Select icon string for original app builder compatibility
                            onSelect(ic.name);
                            onClose();
                          }}
                          className="p-4 bg-white hover:bg-teal-50/50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center gap-2 transition group cursor-pointer"
                        >
                          <div className="group-hover:scale-110 transition duration-200">
                            {IconComponent ? (
                              <IconComponent className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                            ) : (
                              <Smile className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <span className="text-[9.5px] font-mono text-slate-550 dark:text-slate-400 block truncate max-w-full">
                            {ic.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: RECENTLY USED PREVIEWS */}
              {activeTab === 'recently' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase">
                    Recently Used Assets
                  </h4>
                  {recentlyUsed.length === 0 ? (
                    <div className="py-20 text-center">
                      <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-bounce" />
                      <p className="text-xs text-slate-400">No recently used items recorded yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                      {recentlyUsed.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectAndClose(item.url, item.name)}
                          className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:border-teal-500 transition duration-150"
                        >
                          <div className="aspect-video bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
                            {item.url.endsWith('.mp4') ? (
                              <video src={item.url} muted className="w-full h-full object-cover" />
                            ) : (
                              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="p-3">
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate">{item.name}</span>
                            <span className="text-[9px] text-slate-400 block mt-1">Used: {item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* COLUMN 3: RIGHT PROPERTIES DETAIL PANEL */}
          {selectedAsset && (
            <div className="w-80 shrink-0 border-l border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 overflow-y-auto space-y-6 text-start flex flex-col justify-between">
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-teal-600" />
                    <span>Asset Details</span>
                  </h4>
                  <button
                    onClick={() => toggleFavorite(selectedAsset.id)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-amber-500 transition"
                  >
                    <Heart className={`w-4 h-4 ${selectedAsset.isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
                  </button>
                </div>

                {/* Big detailed preview */}
                <div className="aspect-video bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                  {selectedAsset.type === 'mp4' ? (
                    <video src={selectedAsset.url} controls loop className="w-full h-full object-contain" />
                  ) : selectedAsset.type === 'json' ? (
                    <FileJson className="w-12 h-12 text-indigo-500" />
                  ) : (
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.name}
                      className="w-full h-full object-contain"
                      style={selectedAsset.editorMeta ? {
                        filter: `${selectedAsset.editorMeta.filter !== 'none' ? `url(#filter-${selectedAsset.editorMeta.filter})` : ''} brightness(${selectedAsset.editorMeta.brightness}%) contrast(${selectedAsset.editorMeta.contrast}%) saturate(${selectedAsset.editorMeta.saturation}%) blur(${selectedAsset.editorMeta.blur}px)`,
                        transform: `rotate(${selectedAsset.editorMeta.rotation}deg) scaleX(${selectedAsset.editorMeta.flipH ? -1 : 1}) scaleY(${selectedAsset.editorMeta.flipV ? -1 : 1})`
                      } : undefined}
                    />
                  )}
                </div>

                {/* Meta Fields */}
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">File Name</span>
                    <input
                      type="text"
                      value={selectedAsset.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setMediaItems((prev: any) => prev.map((item: any) => 
                          item.id === selectedAsset.id ? { ...item, name: newName } : item
                        ));
                      }}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-bold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-medium">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Size</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px] block">{selectedAsset.size}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Format</span>
                      <span className="text-slate-800 dark:text-slate-200 uppercase font-mono text-[11px] block">{selectedAsset.type}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-medium">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Dimensions</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px] block">
                        {selectedAsset.width && selectedAsset.height ? `${selectedAsset.width} × ${selectedAsset.height}` : 'Vector'}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Added</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px] block">{selectedAsset.date || 'Today'}</span>
                    </div>
                  </div>

                  {/* Folder Switcher */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Organize in Folder</span>
                    <select
                      value={selectedAsset.folder || ''}
                      onChange={(e) => moveAssetToFolder(selectedAsset.id, e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white"
                    >
                      <option value="">None (Root)</option>
                      {folders.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  {/* Editable Tags section */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Tags (comma separated)</span>
                    <input
                      type="text"
                      value={selectedAsset.tags?.join(', ') || ''}
                      onChange={(e) => {
                        const tagsList = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        setMediaItems((prev: any) => prev.map((item: any) => 
                          item.id === selectedAsset.id ? { ...item, tags: tagsList } : item
                        ));
                      }}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white font-medium"
                      placeholder="e.g. summer, promotion, shoes"
                    />
                  </div>
                </div>
              </div>

              {/* SELECT & EDIT ACTIONS BOTTOM */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {selectedAsset.type !== 'mp4' && selectedAsset.type !== 'json' && (
                  <button
                    type="button"
                    onClick={() => openEditor(selectedAsset)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-teal-600" />
                    <span>{language === 'ar' ? 'تعديل الصورة بالكامل' : 'Edit Image (Filters, Crop)'}</span>
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAndClose(selectedAsset.url, selectedAsset.name)}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-teal-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'ar' ? 'اختيار وتأكيد' : 'Select Asset'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteAssetLocal(selectedAsset.id)}
                    className="p-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 rounded-xl transition cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* NEW FOLDER POPUP OVERLAY */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-100 dark:border-slate-800 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-500" />
              <span>{language === 'ar' ? 'إنشاء مجلد جديد' : 'Create New Folder'}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">Organize your products, banners, and logos by folder names.</p>
            
            <input
              type="text"
              required
              value={newFolderNameInput}
              onChange={(e) => setNewFolderNameInput(e.target.value)}
              placeholder="Folder Name (e.g. Summer Sale)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white mt-4 outline-none focus:ring-2 focus:ring-teal-500"
            />

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATEFUL FULLY-FEATURED INLINE IMAGE EDITOR MODAL */}
      {editingAssetId && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-[120] p-4 select-none animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            
            {/* EDITOR HEAD */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-teal-600" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'محرر الصور الاحترافي' : 'Professional Image Studio'}
                  </h4>
                  <p className="text-[10px] text-slate-400">Crop, rotate, filter, and apply AI enhancements instantly</p>
                </div>
              </div>
              <button onClick={() => setEditingAssetId(null)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* EDITOR CONTENT */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel: Adjustments controls */}
              <div className="w-72 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-5 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-400">
                
                {/* 1. Crop Ratio Preset */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Crop Aspect Ratio</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'free', label: 'Freeform', icon: Crop },
                      { id: '1:1', label: '1:1 Square', icon: Crop },
                      { id: '16:9', label: '16:9 Cover', icon: Crop },
                      { id: '4:3', label: '4:3 Card', icon: Crop }
                    ].map(ratio => (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => setCropRatio(ratio.id as any)}
                        className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 font-bold ${cropRatio === ratio.id ? 'border-teal-500 bg-teal-50/10 text-teal-600' : 'border-slate-200 dark:border-slate-800'}`}
                      >
                        <ratio.icon className="w-3.5 h-3.5" />
                        <span className="text-[9.5px]">{ratio.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Rotations & Flips */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Transformations</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRotation(prev => (prev + 90) % 360)}
                      className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-slate-50"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Rotate 90°</span>
                    </button>
                    <button
                      onClick={() => setFlipH(prev => !prev)}
                      className={`p-2 bg-white dark:bg-slate-800 border rounded-xl hover:bg-slate-50 ${flipH ? 'border-teal-500 text-teal-600 bg-teal-50/10' : 'border-slate-200 dark:border-slate-700'}`}
                      title="Flip Horizontal"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setFlipV(prev => !prev)}
                      className={`p-2 bg-white dark:bg-slate-800 border rounded-xl hover:bg-slate-50 ${flipV ? 'border-teal-500 text-teal-600 bg-teal-50/10' : 'border-slate-200 dark:border-slate-700'}`}
                      title="Flip Vertical"
                    >
                      <FlipVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. Predefined Color Filters */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Creative Filters</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'none', label: 'Normal' },
                      { id: 'grayscale', label: 'Grayscale' },
                      { id: 'sepia', label: 'Retro Sepia' },
                      { id: 'vintage', label: 'Vintage Warm' },
                      { id: 'dramatic', label: 'Dramatic Contrast' },
                      { id: 'cool', label: 'Cool Blue' },
                      { id: 'invert', label: 'Invert Color' }
                    ].map(filter => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setEditorFilter(filter.id)}
                        className={`py-1.5 px-2 rounded-xl text-left border font-semibold text-[10.5px] ${editorFilter === filter.id ? 'border-teal-500 bg-teal-50/10 text-teal-600' : 'border-slate-200 dark:border-slate-800'}`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Manual Slide Adjustments */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Manual Tuning</span>
                  
                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-[10px]">
                      <span>Brightness</span>
                      <span className="font-mono text-teal-600">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-[10px]">
                      <span>Contrast</span>
                      <span className="font-mono text-teal-600">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-[10px]">
                      <span>Saturation</span>
                      <span className="font-mono text-teal-600">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  {/* Blur */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-[10px]">
                      <span>Blur Radius</span>
                      <span className="font-mono text-teal-600">{blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full accent-teal-600"
                    />
                  </div>
                </div>

                {/* 5. AI Background Removal Trigger */}
                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">AI Studio Extras</span>
                  {bgRemovedSuccess ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span className="font-bold">Subject Isolated Successfully!</span>
                    </div>
                  ) : (
                    <button
                      onClick={applyBackgroundRemovalMock}
                      disabled={aiRemovingBackground}
                      className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {aiRemovingBackground ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>AI scanning lasers...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Remove Background (AI)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>

              {/* Middle preview canvas workspace */}
              <div className="flex-1 bg-slate-150/40 dark:bg-slate-950 p-8 flex items-center justify-center relative overflow-hidden">
                {/* Simulated Laser scanner animation for AI remover */}
                {aiRemovingBackground && (
                  <div className="absolute inset-x-0 h-1 bg-teal-400 shadow-md shadow-teal-400/50 animate-bounce top-0 bottom-0 z-10" />
                )}

                {/* CSS Filters based real-time styling frame */}
                <div 
                  className={`max-w-full max-h-[50vh] rounded-2xl overflow-hidden shadow-2xl relative ${bgRemovedSuccess ? 'bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAf2AENWD4z2AAAAAElFTkSuQmCC)] bg-repeat' : ''}`}
                >
                  {/* SVG filter declarations for advanced color presets */}
                  <svg className="hidden">
                    <defs>
                      <filter id="filter-grayscale"><feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"/></filter>
                      <filter id="filter-sepia"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0  0.35 0.68 0.17 0 0  0.27 0.53 0.13 0 0  0 0 0 1 0"/></filter>
                      <filter id="filter-vintage"><feColorMatrix type="matrix" values="0.94 0 0 0 0  0 0.82 0 0 0  0 0 0.70 0 0  0 0 0 1 0"/></filter>
                      <filter id="filter-dramatic"><feColorMatrix type="matrix" values="1.2 0 0 0 -0.1  0 1.2 0 0 -0.1  0 0 1.2 0 -0.1  0 0 0 1 0"/></filter>
                      <filter id="filter-cool"><feColorMatrix type="matrix" values="0.8 0 0 0 0  0 0.9 0 0 0  0 0 1.3 0 0  0 0 0 1 0"/></filter>
                      <filter id="filter-invert"><feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"/></filter>
                    </defs>
                  </svg>

                  <img
                    src={mediaItems.find((m: any) => m.id === editingAssetId)?.url}
                    alt="Editing"
                    className="object-contain max-h-[50vh] transition-all"
                    style={{
                      filter: `${editorFilter !== 'none' ? `url(#filter-${editorFilter})` : ''} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
                      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                      opacity: bgRemovedSuccess ? 0.9 : 1
                    }}
                  />
                </div>

                {bgRemovedSuccess && (
                  <div className="absolute bottom-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Checkerboard Transparent Isolated PNG</span>
                  </div>
                )}
              </div>
            </div>

            {/* EDITOR FOOTER */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex justify-between items-center">
              <button
                onClick={applyWebpCompressionMock}
                disabled={editorWebpCompressing}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                {editorWebpCompressing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Convert to WEBP (-75% compression)</span>
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingAssetId(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedImage}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
                >
                  Apply & Save Edits 🚀
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
