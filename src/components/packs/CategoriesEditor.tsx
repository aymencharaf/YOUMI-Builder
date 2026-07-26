import React, { useState } from 'react';
import { CategoriesConfig, CategoryItem, ProductItem, Asset } from '../../types';
import { Grid, Plus, Trash2, ImageIcon, Folder, ShoppingCart, Star, Edit2, Check, X } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface CategoriesEditorProps {
  config: CategoriesConfig;
  onChange: (updates: Partial<CategoriesConfig>) => void;
  assets: Asset[];
  openAssetManager: (category: 'logo' | 'hero' | 'product' | 'category', onSelect: (url: string) => void) => void;
}

export default function CategoriesEditor({ config, onChange, openAssetManager }: CategoriesEditorProps) {
  const { t, dir } = useTranslation();
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories');

  // Category Operations
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Folder');
  const [newCatImage, setNewCatImage] = useState('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop');

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newItem: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      imageUrl: newCatImage,
      itemCount: 0,
      isActive: true,
      icon: newCatIcon,
    };
    onChange({ categories: [...config.categories, newItem] });
    setNewCatName('');
  };

  const deleteCategory = (id: string) => {
    onChange({ categories: config.categories.filter((c) => c.id !== id) });
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    onChange({
      categories: config.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  // Product Operations
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('49.99');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdCat, setNewProdCat] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop');
  const [newProdFeatured, setNewProdFeatured] = useState(true);

  const addProduct = () => {
    if (!newProdName.trim()) return;
    const priceNum = parseFloat(newProdPrice) || 0;
    const origPriceNum = newProdOrigPrice.trim() ? parseFloat(newProdOrigPrice) : undefined;
    const newItem: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      price: priceNum,
      originalPrice: origPriceNum,
      category: newProdCat || (config.categories[0]?.name || 'Uncategorized'),
      imageUrl: newProdImage,
      rating: 4.8,
      isFeatured: newProdFeatured,
      isNew: true,
    };
    onChange({ products: [...config.products, newItem] });
    setNewProdName('');
    setNewProdPrice('49.99');
    setNewProdOrigPrice('');
    setNewProdFeatured(true);
  };

  const deleteProduct = (id: string) => {
    onChange({ products: config.products.filter((p) => p.id !== id) });
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    onChange({
      products: config.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  // Editing Product State
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdOrigPrice, setEditProdOrigPrice] = useState('');
  const [editProdCat, setEditProdCat] = useState('');
  const [editProdImage, setEditProdImage] = useState('');

  const startEditingProduct = (p: ProductItem) => {
    setEditingProdId(p.id);
    setEditProdName(p.name);
    setEditProdPrice(p.price.toString());
    setEditProdOrigPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setEditProdCat(p.category);
    setEditProdImage(p.imageUrl);
  };

  const saveProductEdit = () => {
    if (!editingProdId) return;
    const priceNum = parseFloat(editProdPrice) || 0;
    const origPriceNum = editProdOrigPrice.trim() ? parseFloat(editProdOrigPrice) : undefined;
    
    onChange({
      products: config.products.map((p) =>
        p.id === editingProdId
          ? {
              ...p,
              name: editProdName.trim(),
              price: priceNum,
              originalPrice: origPriceNum,
              category: editProdCat,
              imageUrl: editProdImage,
            }
          : p
      ),
    });
    setEditingProdId(null);
  };

  const cancelProductEdit = () => {
    setEditingProdId(null);
  };

  return (
    <div className="space-y-6 text-start" dir={dir}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Grid className="w-5 h-5 text-indigo-500" />
          {t('cat_config_title')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('cat_config_desc')}
        </p>
      </div>

      {/* Section Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('cat_sec_title')}
          </label>
          <input
            type="text"
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
            value={config.sectionTitle}
            onChange={(e) => onChange({ sectionTitle: e.target.value })}
            placeholder="e.g. Shop Curated Collections"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('cat_sec_subtitle')}
          </label>
          <input
            type="text"
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
            value={config.sectionSubtitle}
            onChange={(e) => onChange({ sectionSubtitle: e.target.value })}
            placeholder="e.g. Direct products from certified organic farms"
          />
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition ${
            activeTab === 'categories'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>{t('cat_tab_categories')} ({config.categories.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition ${
            activeTab === 'products'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{t('cat_tab_products')} ({config.products.length})</span>
        </button>
      </div>

      {/* Categories Panel */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {/* List Categories */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {config.categories.map((cat) => (
              <div
                key={cat.id}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-between gap-3 shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-8 h-8 rounded object-cover bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">{cat.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Icon: {cat.icon} • Items Count: {cat.itemCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-slate-400 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-indigo-600 w-3 h-3"
                      checked={cat.isActive}
                      onChange={(e) => updateCategory(cat.id, { isActive: e.target.checked })}
                    />
                    <span>{t('cat_active')}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Category Form */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {t('cat_add_title')}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500">{t('cat_field_name')}</label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none text-start"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Leather Apparel"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500">{t('cat_field_icon')}</label>
                <select
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                >
                  <option value="Shirt">Shirt</option>
                  <option value="Watch">Watch</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Cpu">Cpu</option>
                  <option value="Footprints">Footprints</option>
                  <option value="Home">Home</option>
                  <option value="Cherry">Cherry</option>
                  <option value="Music">Music</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Folder">Folder</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-medium text-slate-500">{t('cat_field_image')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none text-start"
                    value={newCatImage}
                    onChange={(e) => setNewCatImage(e.target.value)}
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => openAssetManager('category', (url) => setNewCatImage(url))}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1 transition cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{t('cat_field_browse')}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={addCategory}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('cat_add_btn')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Panel */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* List Products */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {config.products.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 text-xs">
                {t('prod_empty')}
              </div>
            ) : (
              config.products.map((p) => (
                editingProdId === p.id ? (
                  <div key={p.id} className="p-3 bg-indigo-50/20 dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-900/50 rounded-xl space-y-2.5 w-full">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">{t('prod_field_title')}</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none"
                          value={editProdName}
                          onChange={(e) => setEditProdName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">{t('prod_field_price')}</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none"
                          value={editProdPrice}
                          onChange={(e) => setEditProdPrice(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">{t('prod_field_orig_price')}</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none"
                          value={editProdOrigPrice}
                          onChange={(e) => setEditProdOrigPrice(e.target.value)}
                          placeholder="Optional"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">{t('prod_field_category')}</label>
                        <select
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none"
                          value={editProdCat}
                          onChange={(e) => setEditProdCat(e.target.value)}
                        >
                          {config.categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-500 block mb-0.5">{t('prod_field_image')}</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            className="flex-1 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] text-slate-900 dark:text-white focus:outline-none truncate"
                            value={editProdImage}
                            onChange={(e) => setEditProdImage(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => openAssetManager('product', (url) => setEditProdImage(url))}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer animate-none"
                          >
                            <ImageIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={cancelProductEdit}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <X className="w-3 h-3 text-red-500" />
                        <span>{t('prod_cancel_btn')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={saveProductEdit}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Check className="w-3 h-3 text-white" />
                        <span>{t('prod_save_btn')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={p.id}
                    className="p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-between gap-3 shadow-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-8 h-8 rounded object-cover bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate max-w-[150px]">{p.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {p.category} • <span className="font-semibold text-slate-700 dark:text-slate-300">{p.price}</span>
                          {p.originalPrice && <span className="line-through text-red-400 ml-1">{p.originalPrice}</span>}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditingProduct(p)}
                        title={t('prod_edit_btn')}
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateProduct(p.id, { isFeatured: !p.isFeatured })}
                        title="Toggle Feature on Homepage"
                        className={`p-1 rounded cursor-pointer ${
                          p.isFeatured ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(p.id)}
                        className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              ))
            )}
          </div>

          {/* Add Product Form */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {t('prod_add_title')}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-medium text-slate-500">{t('prod_field_title')}</label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none text-start"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Ergonomic Office Pad"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500">{t('prod_field_price')}</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none text-start"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  placeholder="29.99"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500">{t('prod_field_orig_price')}</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none text-start"
                  value={newProdOrigPrice}
                  onChange={(e) => setNewProdOrigPrice(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500">{t('prod_field_category')}</label>
                <select
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none"
                  value={newProdCat}
                  onChange={(e) => setNewProdCat(e.target.value)}
                >
                  <option value="">{t('prod_choose_cat_placeholder')}</option>
                  {config.categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 flex items-end pb-2 px-1">
                <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-indigo-600 w-3.5 h-3.5"
                    checked={newProdFeatured}
                    onChange={(e) => setNewProdFeatured(e.target.checked)}
                  />
                  <span>{t('prod_field_featured_checkbox')}</span>
                </label>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-medium text-slate-500">{t('prod_field_image')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none text-start"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => openAssetManager('product', (url) => setNewProdImage(url))}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1 transition cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{t('cat_field_browse')}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={addProduct}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('prod_add_btn')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
