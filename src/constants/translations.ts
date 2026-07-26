export type Language = 'en' | 'ar';

export interface TranslationItem {
  en: string;
  ar: string;
  [key: string]: string; // Allows easy scaling to other languages like fr, es, etc.
}

export const TRANSLATIONS: Record<string, TranslationItem> = {
  // Titlebar & Main Info
  app_title: {
    en: "YOUMI Multi-Vendor Builder",
    ar: "لوحة بناء القوالب يومي"
  },
  app_subtitle: {
    en: "Advanced workspace co-pilot engineered to design, order, customize and export Algerian multi-vendor templates.",
    ar: "لوحة تحكم ذكية متطورة لتصميم وهندسة قوالب المتاجر الجزائرية المتعددة البائعين."
  },
  desktop_env: {
    en: "YOUMI Builder Desktop Environment v2.4",
    ar: "بيئة عمل ديسكتوب يومي بيلدر v2.4"
  },
  status: {
    en: "Status:",
    ar: "الحالة:"
  },
  status_online: {
    en: "CONTAINER ONLINE (Port: 3000)",
    ar: "الخادم متصل (منفذ: 3000)"
  },
  language_label: {
    en: "Language:",
    ar: "اللغة:"
  },
  preset_template: {
    en: "Preset Template:",
    ar: "قالب مسبق الصنع:"
  },

  // General Buttons & Actions
  undo: {
    en: "Undo",
    ar: "تراجع"
  },
  redo: {
    en: "Redo",
    ar: "إعادة"
  },
  save: {
    en: "Save",
    ar: "حفظ"
  },
  export_json: {
    en: "Export JSON",
    ar: "تصدير JSON"
  },
  import_json: {
    en: "Import JSON",
    ar: "استيراد JSON"
  },
  reset_defaults: {
    en: "Reset Defaults",
    ar: "إعادة ضبط"
  },
  media_assets: {
    en: "Media Assets",
    ar: "مكتبة الصور"
  },
  build_export_zip: {
    en: "Build & Export ZIP 👁️",
    ar: "توليد وتصدير الكود 👁️"
  },
  sidebar_header: {
    en: "YOUMI BUILDER PLATFORM",
    ar: "منصة يومي بيلدر"
  },
  sidebar_sub: {
    en: "Design Store via PACKS 🚀",
    ar: "بناء القالب بطريقة PACK 🚀"
  },

  // Notification Banners & Popups
  notif_undo: {
    en: "↩️ Undo complete",
    ar: "↩️ تم التراجع عن التعديل الأخير"
  },
  notif_redo: {
    en: "↪️ Redo complete",
    ar: "↪️ تم إعادة تطبيق التعديل"
  },
  notif_lang_en: {
    en: "Changed to English Localization",
    ar: "Changed to English Localization"
  },
  notif_lang_ar: {
    en: "تم تغيير لغة لوحة التحكم إلى العربية",
    ar: "تم تغيير لغة لوحة التحكم إلى العربية"
  },
  notif_template_applied: {
    en: "Prebuilt template applied successfully!",
    ar: "تم تطبيق القالب مسبق الصنع بنجاح!"
  },
  confirm_reset: {
    en: "Are you sure you want to reset current work to default template?",
    ar: "هل أنت متأكد من رغبتك في إعادة ضبط المشروع للقالب الافتراضي؟"
  },
  notif_reset_complete: {
    en: "Restored defaults",
    ar: "تمت إعادة الضبط الافتراضية"
  },
  notif_saved_success: {
    en: "💾 Project state saved to local storage!",
    ar: "💾 تم حفظ مشروعك بنجاح في المتصفح!"
  },
  notif_json_exported: {
    en: "📥 Config JSON exported successfully!",
    ar: "📥 تم تصدير ملف الإعدادات JSON بنجاح!"
  },
  notif_json_imported: {
    en: "📂 Project imported successfully from file!",
    ar: "📂 تم استيراد مشروعك بنجاح من الملف!"
  },
  err_invalid_json: {
    en: "Invalid file structure! Must be a YOUMI project.",
    ar: "ملف غير صالح! يجب أن يحتوي على بنية مشروع YOUMI."
  },
  err_parse_fail: {
    en: "Failed to parse JSON file! Ensure it is a valid JSON.",
    ar: "فشل قراءة الملف! يرجى التأكد من أنه ملف JSON صالح."
  },
  notif_section_order: {
    en: "↕️ Section order updated!",
    ar: "↕️ تم تغيير ترتيب الأقسام!"
  },
  notif_focused_section: {
    en: "Focused section: ",
    ar: "تم الانتقال لتعديل قسم: "
  },

  // Sidebar Packs & Descriptions
  pack_001_name: {
    en: "Site Info",
    ar: "معلومات الموقع"
  },
  pack_001_desc: {
    en: "Identity, logo and basic metadata for the store",
    ar: "الهوية، الشعار والبيانات الأساسية للمتجر"
  },
  pack_002_name: {
    en: "Header Navigation",
    ar: "الرأس (Header)"
  },
  pack_002_desc: {
    en: "Announcement bar, search config, and header styling",
    ar: "شريط الإعلانات، لوحة التحكم وتنسيق الهيدر"
  },
  pack_003_name: {
    en: "Links & Mega Menu",
    ar: "القائمة (Menu)"
  },
  pack_003_desc: {
    en: "Manage navigation links and badge triggers for visitors",
    ar: "إدارة روابط التنقل والbadges السريعة للزوار"
  },
  pack_004_name: {
    en: "Banner & Sliders",
    ar: "السلايدر (Hero)"
  },
  pack_004_desc: {
    en: "Promotional campaigns and main marketing banners",
    ar: "العروض الترويجية واللافتات التسويقية الرئيسية"
  },
  pack_005_name: {
    en: "Collections & Items",
    ar: "الأقسام والمنتجات"
  },
  pack_005_desc: {
    en: "Generate category grids and showcase beautiful products",
    ar: "توليد مجموعات الأقسام الدائرية وعرض المنتجات الفاخرة"
  },
  pack_006_name: {
    en: "Footer Layout",
    ar: "التذييل (Footer)"
  },
  pack_006_desc: {
    en: "Style communication channels, social media links, and copyright notes",
    ar: "تنسيق قنوات التواصل، السوشيال ميديا وحقوق الملكية"
  },
  pack_007_name: {
    en: "Theme Colors",
    ar: "الألوان"
  },
  pack_007_desc: {
    en: "Configure the brand palette and commercial visual identity",
    ar: "تنسيق باليتة الألوان المخصصة وهوية البراند التجارية"
  },
  pack_008_name: {
    en: "YOUMI Fonts & Typography",
    ar: "الخطوط"
  },
  pack_008_desc: {
    en: "Choose and link header and paragraph fonts from the global typography library",
    ar: "اختيار وتثبيت خطوط العناوين والفقرات من مكتبة الخطوط العالمية"
  },
  pack_009_name: {
    en: "Buttons Styling",
    ar: "الأزرار والمؤثرات"
  },
  pack_009_desc: {
    en: "Border radius, spacing padding, and beautiful hover animations",
    ar: "شكل الحواف، البادينج، وتأثيرات الهوفر اللطيفة"
  },
  pack_order_name: {
    en: "Layout Arranger",
    ar: "ترتيب الأقسام"
  },
  pack_order_desc: {
    en: "Interactive list to reorder main page sections easily",
    ar: "أداة لترتيب هيكلية أقسام الصفحة الرئيسية"
  },
  pack_templates_name: {
    en: "Preset Libraries",
    ar: "مكتبة القوالب"
  },
  pack_templates_desc: {
    en: "Load fully pre-designed template presets in one click",
    ar: "حمل قوالب وتنسيقات مصممة وجاهزة بنقرة زر واحدة"
  },
  pack_market_name: {
    en: "Modular Packs (+100)",
    ar: "سوق الحزم المتقدمة"
  },
  pack_market_desc: {
    en: "Expanded collection of modular packages for quick activation",
    ar: "قائمة الحزم البرمجية الموسعة المتكاملة للتفعيل الفوري"
  },
  pack_plugins_name: {
    en: "Apps & Pixels",
    ar: "الملحقات والبيكسل"
  },
  pack_plugins_desc: {
    en: "Integrate Facebook Pixels, WhatsApp floating buttons, or shipping tracking",
    ar: "ربط بيكسل فيسبوك، واتساب عائم، وأداة شحن يالدين"
  },
  pack_ai_name: {
    en: "YOUMI AI Assistant",
    ar: "منشئ الذكاء الاصطناعي"
  },
  pack_ai_desc: {
    en: "Generate customized marketplaces instantly via YOUMI AI models",
    ar: "توليد قوالب ومواصفات تجارية متكاملة عبر نماذج الذكاء الاصطناعي لـ يومي"
  },
  pack_export_name: {
    en: "Export & Build ZIP",
    ar: "تصدير القالب"
  },
  pack_export_desc: {
    en: "Compile full production code and download in a compressed ZIP archive",
    ar: "توليد الكود البرمجي الكامل وتحميله بصيغة ZIP مضغوطة"
  },

  // Column 3 Tabs
  col3_title: {
    en: "Integrated Workspace",
    ar: "مساحة العمل المتكاملة"
  },
  col3_packs: {
    en: "Packs",
    ar: "الحزم"
  },
  col3_layers: {
    en: "Layers",
    ar: "الأقسام"
  },
  col3_inspector: {
    en: "Inspector",
    ar: "المفتش"
  },

  // Inspector Fields & Titles
  insp_store_name: {
    en: "Store Name",
    ar: "اسم المتجر"
  },
  insp_description: {
    en: "Description",
    ar: "الوصف الأساسي"
  },
  insp_currency: {
    en: "Default Currency",
    ar: "العملة الافتراضية"
  },
  insp_phone: {
    en: "Phone Directory",
    ar: "هاتف التواصل"
  },
  insp_tax_rate: {
    en: "Tax Rate (%)",
    ar: "معدل الضريبة (%)"
  },
  insp_primary_color: {
    en: "Primary Accent Color",
    ar: "اللون الأساسي للبراند"
  },
  insp_secondary_color: {
    en: "Secondary Accent Color",
    ar: "اللون الثانوي"
  },
  insp_bg_color: {
    en: "Background Canvas Color",
    ar: "لون الخلفية العامة"
  },
  insp_heading_font: {
    en: "Heading Typography",
    ar: "خط العناوين"
  },
  insp_body_font: {
    en: "Body Copy Typography",
    ar: "خط الفقرات"
  },
  insp_button_radius: {
    en: "Button Edge Radius",
    ar: "حواف أزرار الشراء"
  },
  insp_flat_square: {
    en: "Flat Square",
    ar: "حادة ومربعة"
  },
  insp_rounded_md: {
    en: "Rounded Medium",
    ar: "منحنية (متوسط)"
  },
  insp_rounded_full: {
    en: "Rounded Pill",
    ar: "دائرية كاملة"
  },
  insp_quick_stats: {
    en: "Quick Statistics",
    ar: "إحصائيات القالب النشط"
  },
  insp_stat_included_packs: {
    en: "Included Modules:",
    ar: "الحزم النشطة حالياً:"
  },
  insp_stat_total_products: {
    en: "Total Catalog Items:",
    ar: "عدد منتجات الكتالوج:"
  },
  insp_stat_tax_rules: {
    en: "Active VAT Rate:",
    ar: "معدل القيمة المضافة:"
  },

  // Layers Section
  layer_order_prefix: {
    en: "Order:",
    ar: "الترتيب:"
  },
  layer_hide: {
    en: "Hide Section",
    ar: "إخفاء القسم"
  },
  layer_show: {
    en: "Show Section",
    ar: "إظهار القسم"
  },
  layer_move_up: {
    en: "Move Up",
    ar: "نقل للأعلى"
  },
  layer_move_down: {
    en: "Move Down",
    ar: "نقل للأسفل"
  },

  // Live Preview Top Bar
  preview_bar_title: {
    en: "Visual Simulation Canvas",
    ar: "شاشة المحاكاة التفاعلية الحية"
  },
  preview_desktop: {
    en: "Desktop",
    ar: "كمبيوتر"
  },
  preview_tablet: {
    en: "Tablet",
    ar: "تابلت"
  },
  preview_mobile: {
    en: "Mobile",
    ar: "جوال"
  },
  preview_zoom: {
    en: "Scale:",
    ar: "الزوم:"
  },
  preview_click_focus_msg: {
    en: "💡 Click on any component inside the simulator to focus its dedicated PACK configuration panel.",
    ar: "💡 اضغط على أي قسم داخل شاشة المحاكاة لتوجيه لوحة التعديل اليسرى له فورا."
  },

  // Asset Manager Modal
  asset_modal_title: {
    en: "Central Media & Icon Directory",
    ar: "مستودع الوسائط والأيقونات المركزي"
  },
  asset_modal_subtitle: {
    en: "Choose from ready-to-use template pictures, upload files, or search Lucide icons.",
    ar: "اختر من مكتبة الصور الجاهزة أو ابحث عن أيقونات للبراند والأقسام."
  },
  asset_tab_media: {
    en: "🖼️ Media Assets Library",
    ar: "🖼️ مكتبة الصور والوسائط (Media)"
  },
  asset_tab_icons: {
    en: "✨ Navigation Icons (Lucide)",
    ar: "✨ أيقونات لوحة التنقل (Lucide Icons)"
  },
  asset_search_placeholder: {
    en: "Search assets...",
    ar: "البحث في الملفات والوسائط..."
  },
  asset_icon_search_placeholder: {
    en: "Search icons... (e.g. Cpu, Shirt, ShoppingCart)",
    ar: "البحث في الأيقونات التجارية... (مثال: Cpu, Shirt)"
  },
  asset_found_icons: {
    en: "Found icons:",
    ar: "تم العثور على أيقونات:"
  },
  asset_no_files: {
    en: "No files found. Try adding some custom media anchors or select categories.",
    ar: "لا توجد ملفات. حاول إضافة روابط مخصصة أو اختر فئات تصفية أخرى."
  },
  asset_select_btn: {
    en: "Select URL",
    ar: "تحديد الرابط"
  },
  asset_delete_btn: {
    en: "Delete Custom Asset",
    ar: "حذف الملف المخصص"
  },
  asset_upload_local: {
    en: "Upload Local File",
    ar: "تحميل ملف محلي"
  },
  asset_upload_desc: {
    en: "Drag your product images or brand logos directly into the box to convert instantly.",
    ar: "اسحب صور منتجاتك أو شعارك هنا ليتم تحويلها لترميز دائم وحفظها فوراً."
  },
  asset_drag_drop: {
    en: "Drag & Drop Image",
    ar: "اسحب وأسقط الصورة هنا"
  },
  asset_drag_drop_active: {
    en: "Drop Image Here!",
    ar: "أفلت الصورة هنا الآن!"
  },
  asset_or_select: {
    en: "or select from computer",
    ar: "أو اختر ملفاً من حاسوبك"
  },
  asset_browse_btn: {
    en: "Browse Files",
    ar: "تصفح الملفات"
  },
  asset_inject_link: {
    en: "Inject Custom Link",
    ar: "إدخال رابط مباشر"
  },
  asset_inject_desc: {
    en: "Or insert direct picture URLs (e.g. Unsplash URL anchors) to use inside packs.",
    ar: "أو أدخل رابطاً مباشراً للصورة (مثل Unsplash) لاستخدامها في الحزم."
  },
  asset_field_title: {
    en: "Asset Title",
    ar: "عنوان الملف"
  },
  asset_field_url: {
    en: "Direct Image Web URL",
    ar: "الرابط المباشر للصورة"
  },
  asset_field_category: {
    en: "Component Category",
    ar: "فئة القسم المستخدم"
  },
  asset_cat_logo: {
    en: "Brand Logos",
    ar: "شعارات البراند"
  },
  asset_cat_hero: {
    en: "Hero Slides Banners",
    ar: "لافتات السلايدر الرئيسي"
  },
  asset_cat_category: {
    en: "Catalog Category",
    ar: "فئات وأقسام المتجر"
  },
  asset_cat_product: {
    en: "Showcase Products",
    ar: "منتجات الكتالوج"
  },
  asset_inject_btn: {
    en: "Inject Asset",
    ar: "إضافة للمستودع"
  },
  err_select_image: {
    en: "Please select image files only!",
    ar: "الرجاء اختيار صورة صالحة فقط!"
  },
  header_config_title: {
    en: "PACK-002: Header Configuration",
    ar: "PACK-002: إعدادات ترويسة الموقع"
  },
  header_config_desc: {
    en: "Customize search settings, layout orientations, notification banners, and checkout icons.",
    ar: "تخصيص خيارات البحث، وتخطيط الهيدر، وشريط الإعلانات وأيقونات سلة المشتريات."
  },
  header_layout_style: {
    en: "Layout Style",
    ar: "تنسيق الهيدر"
  },
  header_style_minimal: {
    en: "Minimalist",
    ar: "بسيط واقتصادي"
  },
  header_style_minimal_desc: {
    en: "Left logo, right icons",
    ar: "الشعار على اليسار، والأيقونات على اليمين"
  },
  header_style_centered: {
    en: "Centered",
    ar: "متوسط"
  },
  header_style_centered_desc: {
    en: "Centered logo, clean margins",
    ar: "الشعار في الوسط بهوامش مريحة"
  },
  header_style_full: {
    en: "Full Width",
    ar: "عرض كامل الشاشة"
  },
  header_style_full_desc: {
    en: "Edgeless spacing",
    ar: "مساحة ممتدة بدون حواف جانبية"
  },
  header_search_title: {
    en: "Global Marketplace Search",
    ar: "صندوق البحث العام"
  },
  header_search_desc: {
    en: "Include search input field in header",
    ar: "إضافة حقل البحث في أعلى الهيدر"
  },
  header_search_placeholder_label: {
    en: "Search Box Placeholder",
    ar: "النص المؤقت لصندوق البحث"
  },
  header_cart_icon_label: {
    en: "Checkout Cart Icon",
    ar: "شكل أيقونة المشتريات"
  },
  header_cart_bag: {
    en: "Shopping Bag",
    ar: "حقيبة تسوق"
  },
  header_cart_bag_desc: {
    en: "Common for boutique/fashion",
    ar: "شائعة للملابس ومحلات الموضة"
  },
  header_cart_cart: {
    en: "Shopping Cart",
    ar: "عربة تسوق"
  },
  header_cart_cart_desc: {
    en: "Great for tech/grocery outlets",
    ar: "رائعة للإلكترونيات والمواد الغذائية"
  },
  header_banner_title: {
    en: "Top Notification Banner",
    ar: "شريط الإعلانات الترويجي"
  },
  header_banner_desc: {
    en: "Promotional bar pinned to the top of the screen",
    ar: "شريط مخصص للعروض الترويجية في أعلى الصفحة"
  },
  header_banner_msg_label: {
    en: "Banner Announcement Message",
    ar: "نص الإعلان الترويجي"
  },
  header_banner_link_label: {
    en: "Banner Anchor Link / URL",
    ar: "رابط الإعلان الترويجي"
  },
  ai_builder_title: {
    en: "AI Store Co-Pilot Builder",
    ar: "المساعد الذكي لبناء المتاجر (AI Co-Pilot)"
  },
  ai_builder_desc: {
    en: "Describe your marketplace store in plain words, and our YOUMI AI model will generate elegant layouts, products, pricing, and styling.",
    ar: "اكتب مواصفات متجرك بالكامل (الألوان، نوع المنتجات، التفاصيل) ودع الذكاء الاصطناعي يولد لك التنسيق والمحتوى والأسعار والخطوط فورا."
  },
  ai_builder_placeholder: {
    en: "Describe your store in detail (e.g., Luxury perfumes with elegant dark black and gold colors, split navigation style)...",
    ar: "مثال: أريد متجر لبيع العطور الفاخرة باللون الأسود والذهبي، مع هيدر عريض وسلايدر فخم مخصص للمناسبات..."
  },
  ai_builder_generating: {
    en: "Generating Store Mockups...",
    ar: "جاري توليد متجرك الذكي..."
  },
  ai_builder_generate_btn: {
    en: "Generate with YOUMI AI",
    ar: "توليد المتجر بالذكاء الاصطناعي"
  },
  ai_builder_presets_title: {
    en: "💡 Quick generation samples:",
    ar: "💡 نماذج سريعة للتجربة والإنشاء:"
  },
  ai_builder_success_title: {
    en: "AI Generation Succeeded! 🎉",
    ar: "تم إنشاء متجرك بنجاح! 🎉"
  },
  ai_builder_success_desc: {
    en: "All layout colors, sections, specific custom fonts, local products, and pricing matrices are now updated.",
    ar: "قام الذكاء الاصطناعي بتخصيص كافة الأقسام، الألوان، الخطوط، وتوليد فئات ومنتجات تناسب اختيارك بالكامل."
  },
  ai_builder_fail_title: {
    en: "Generation Failed",
    ar: "فشل الاتصال بالخادم"
  },
  ai_preset_1_label: {
    en: "👗 Luxury women's fashion store in burgundy & gold",
    ar: "👗 متجر ملابس وأزياء نسائية فاخرة بلون عنابي مذهب"
  },
  ai_preset_1_text: {
    en: "I want a luxury Algerian women's clothing and fashion store with attractive burgundy and gold colors, containing modern dresses and designs.",
    ar: "أريد متجر ملابس وأزياء نسائية جزائرية فاخرة وراقية بلون عنابي وذهبي جذاب، يحتوي على فساتين وتصاميم عصرية"
  },
  ai_preset_2_label: {
    en: "💻 Smart phones and gaming accessories store",
    ar: "💻 متجر لبيع الهواتف الذكية ومستلزمات الجيمينج"
  },
  ai_preset_2_text: {
    en: "I want a tech store to sell smart phones, gaming PCs, and their accessories, in dark neon futuristic colors and modern fonts.",
    ar: "أريد متجر تقني لبيع الهواتف الذكية وحواسب الجيمينج وملحقاتها، بألوان داكنة نيون مستقبلية وخطوط عصرية"
  },
  ai_preset_3_label: {
    en: "🍯 Organic Algerian dates and raw honey store",
    ar: "🍯 متجر تمور جزائرية وعسل حر أصلي بلون أخضر عشبي"
  },
  ai_preset_3_text: {
    en: "I want a store selling Deglet Nour dates and raw Sidr honey with fresh local products, in colors inspired by green nature.",
    ar: "أريد متجر لبيع تمور دقلة نور وعسل السدر الحر الطبيعي مع منتجات بلدية طازجة، بألوان مستوحاة من الطبيعة الخضراء"
  },
  ai_preset_4_label: {
    en: "🧴 Elegant cosmetics and luxury perfume store",
    ar: "🧴 متجر مستحضرات تجميل وعطور راقية"
  },
  ai_preset_4_text: {
    en: "I want a cosmetics, skincare, and luxury perfume store with soft rose gold colors for a comfortable eye-catching design.",
    ar: "أريد متجر لمستحضرات تجميل وعناية بالبشرة وعطور فاخرة بلون وردي مذهب وناعم للغاية لتصميم مريح للعين"
  },
  code_copied: {
    en: "Copied!",
    ar: "تم النسخ!"
  },
  copy_code: {
    en: "Copy Code",
    ar: "نسخ الكود"
  },
  site_info_title: {
    en: "PACK-001: Site Identity Configuration",
    ar: "PACK-001: معلومات وهوية المتجر"
  },
  site_info_desc: {
    en: "Configure your shop branding, name, descriptive metadata, colors and default fonts.",
    ar: "ضبط وتحديث اسم وشعار ووصف المتجر، وتخصيص الألوان والخطوط."
  },
  site_name_label: {
    en: "Store Name",
    ar: "اسم المتجر"
  },
  site_name_placeholder: {
    en: "e.g., YOUMI",
    ar: "مثال: متجر يومي"
  },
  site_logo_label: {
    en: "Store Logo",
    ar: "شعار المتجر"
  },
  logo_custom_active: {
    en: "Custom logo is active",
    ar: "شعار مخصص نشط"
  },
  logo_not_selected: {
    en: "No logo selected yet",
    ar: "لم يتم اختيار شعار بعد"
  },
  change_logo_btn: {
    en: "Change Logo",
    ar: "تغيير الشعار"
  },
  site_desc_label: {
    en: "Store Description",
    ar: "وصف المتجر"
  },
  site_desc_placeholder: {
    en: "e.g., Premium Multi-Vendor Marketplace in Algeria",
    ar: "مثال: منصة رائدة للتسوق في الجزائر"
  },
  site_currency_label: {
    en: "Store Currency Symbol",
    ar: "عملة المتجر"
  },
  site_currency_placeholder: {
    en: "e.g., DZD, $, ر.س",
    ar: "مثال: د.ج, $, ر.س"
  },
  primary_colors_label: {
    en: "Brand Theme Colors",
    ar: "الألوان الأساسية للبراند"
  },
  main_color_label: {
    en: "Main Brand Accent",
    ar: "اللون الرئيسي"
  },
  secondary_color_label: {
    en: "Secondary Accent",
    ar: "اللون الثانوي"
  },
  base_font_label: {
    en: "Primary Site Typography",
    ar: "الخط الأساسي للموقع"
  },
  favicon_label: {
    en: "Store Icon (Favicon)",
    ar: "الأيقونة (Favicon)"
  },
  favicon_sub_label: {
    en: "Favicon Icon",
    ar: "أيقونة المفضلة"
  },
  favicon_desc: {
    en: "Favicon.ico (32x32)",
    ar: "أيقونة المفضلة (32x32)"
  },
  change_favicon_btn: {
    en: "Change Favicon",
    ar: "تغيير الأيقونة"
  },
  menu_config_title: {
    en: "PACK-003: Navigation Menu",
    ar: "PACK-003: قائمة الروابط والتنقل"
  },
  menu_config_desc: {
    en: "Configure links that appear in your main header menu. Highlight key categories or deals.",
    ar: "إدارة وتوجيه كافة الروابط المخصصة في ترويسة الموقع وإبراز العروض الخاصة."
  },
  menu_no_links: {
    en: "No navigation links added yet.",
    ar: "لم يتم إضافة أي روابط تنقل حتى الآن."
  },
  menu_add_link: {
    en: "Add Navigation Link",
    ar: "إضافة رابط تنقل جديد"
  },
  menu_field_label: {
    en: "Label",
    ar: "اسم الرابط"
  },
  menu_field_label_placeholder: {
    en: "e.g., Clearance Sale",
    ar: "مثال: تصفيات كبرى"
  },
  menu_field_url: {
    en: "Target URL / Anchor",
    ar: "الرابط الموجه / الوسم"
  },
  menu_field_badge: {
    en: "Highlight Badge (Optional)",
    ar: "شارة مميزة (اختياري)"
  },
  menu_field_badge_placeholder: {
    en: "e.g., 50% Off",
    ar: "مثال: خصم 50%"
  },
  menu_field_featured: {
    en: "Star / Feature link",
    ar: "تمييز الرابط بنجمة"
  },
  menu_add_btn: {
    en: "Add to Menu",
    ar: "إضافة للقائمة"
  },
  hero_config_title: {
    en: "PACK-004: Hero Slider",
    ar: "PACK-004: السلايدر والواجهة الرئيسية"
  },
  hero_config_desc: {
    en: "Build high-conversion interactive slideshows for the homepage hero stage.",
    ar: "إنشاء واجهة ترحيبية وسلايدر تفاعلي مخصص لعروض وتصفيات متجرك."
  },
  hero_add_slide: {
    en: "Add Slide",
    ar: "إضافة شريحة عرض"
  },
  hero_slide_num: {
    en: "Slide",
    ar: "الشريحة"
  },
  hero_slide_settings: {
    en: "Slide Settings",
    ar: "إعدادات الشريحة"
  },
  hero_remove_slide: {
    en: "Remove Slide",
    ar: "إزالة الشريحة"
  },
  hero_headline: {
    en: "Headline Title",
    ar: "العنوان الرئيسي"
  },
  hero_tagline: {
    en: "Tagline / Badge Text",
    ar: "الشارة / العنوان الفرعي"
  },
  hero_subheadline: {
    en: "Subheadline Description",
    ar: "الوصف التفصيلي"
  },
  hero_bg_image: {
    en: "Background Image URL",
    ar: "رابط صورة الخلفية"
  },
  hero_browse: {
    en: "Browse",
    ar: "تصفح"
  },
  hero_btn_label: {
    en: "Primary Button Label",
    ar: "نص زر الإجراء"
  },
  hero_btn_url: {
    en: "Primary Button URL",
    ar: "رابط زر الإجراء"
  },
  hero_auto_play: {
    en: "Auto-rotating Slideshow",
    ar: "التنقل التلقائي للشرائح"
  },
  hero_auto_play_desc: {
    en: "Automatically switch slides after designated interval",
    ar: "تحريك الشرائح بشكل تلقائي وفقاً للمدة المحددة"
  },
  hero_interval: {
    en: "Interval:",
    ar: "المدة الزمنية:"
  },
  footer_config_title: {
    en: "PACK-006: Footer Settings",
    ar: "PACK-006: إعدادات ذيل الصفحة (Footer)"
  },
  footer_config_desc: {
    en: "Build multi-column directory footers, copyrights, and social handle directories.",
    ar: "إدارة وتعديل أعمدة ذيل الصفحة، روابط دليل الموقع، الحقوق وقنوات التواصل الاجتماعي."
  },
  footer_add_column: {
    en: "Add Column",
    ar: "إضافة عمود جديد"
  },
  footer_copyright_label: {
    en: "Copyright Banner Text",
    ar: "نص حقوق الملكية والنشر"
  },
  footer_edit_cols_label: {
    en: "Edit Column Directories",
    ar: "تعديل أعمدة الروابط"
  },
  footer_col_default_title: {
    en: "Column",
    ar: "عمود"
  },
  footer_col_editor_title: {
    en: "Column Editor",
    ar: "محرر تفاصيل العمود"
  },
  footer_remove_col: {
    en: "Remove Column",
    ar: "حذف العمود"
  },
  footer_col_title_label: {
    en: "Column Title",
    ar: "عنوان العمود"
  },
  footer_col_links_label: {
    en: "Links",
    ar: "الروابط المضافة"
  },
  footer_add_link_to_col: {
    en: "Add Link to",
    ar: "إضافة رابط إلى"
  },
  footer_link_label_placeholder: {
    en: "Link Label (e.g. Help)",
    ar: "اسم الرابط (مثال: المساعدة)"
  },
  footer_link_url_placeholder: {
    en: "Anchor (#help)",
    ar: "الرابط الموجه"
  },
  footer_insert_link: {
    en: "Insert Link",
    ar: "إدراج الرابط"
  },
  footer_social_title: {
    en: "Social Media Handles",
    ar: "حسابات شبكات التواصل"
  },
  footer_social_desc: {
    en: "Show social handles directories in footer margin",
    ar: "إظهار أيقونات حسابات التواصل في أسفل الصفحة"
  },
  footer_fb_url: {
    en: "Facebook URL",
    ar: "رابط فيسبوك"
  },
  footer_ig_url: {
    en: "Instagram URL",
    ar: "رابط انستغرام"
  },
  footer_tw_url: {
    en: "Twitter URL",
    ar: "رابط تويتر"
  },
  footer_li_url: {
    en: "LinkedIn URL",
    ar: "رابط لينكد إن"
  },
  cat_config_title: {
    en: "PACK-005: Categories & Products",
    ar: "PACK-005: الفئات والمنتجات"
  },
  cat_config_desc: {
    en: "Customize the catalog layout. Manage search categories and seed marketplace products.",
    ar: "تخصيص الفئات المعروضة والكتالوج العام وإضافة المنتجات والأسعار وتنسيق الأقسام."
  },
  cat_sec_title: {
    en: "Catalog Section Title",
    ar: "عنوان قسم الكتالوج"
  },
  cat_sec_subtitle: {
    en: "Catalog Section Subtitle",
    ar: "العنوان الفرعي للكتالوج"
  },
  cat_tab_categories: {
    en: "Marketplace Categories",
    ar: "فئات المعروضات"
  },
  cat_tab_products: {
    en: "Showcase Products",
    ar: "المنتجات المضافة"
  },
  cat_active: {
    en: "Active",
    ar: "نشط"
  },
  cat_add_title: {
    en: "Add Category Pack",
    ar: "إضافة تصنيف جديد"
  },
  cat_field_name: {
    en: "Category Name",
    ar: "اسم التصنيف"
  },
  cat_field_icon: {
    en: "Vector Icon (Lucide)",
    ar: "أيقونة توضيحية (Lucide)"
  },
  cat_field_image: {
    en: "Thumbnail Image URL",
    ar: "رابط الصورة المصغرة"
  },
  cat_field_browse: {
    en: "Browse",
    ar: "تصفح"
  },
  cat_add_btn: {
    en: "Add Category",
    ar: "إضافة التصنيف"
  },
  prod_empty: {
    en: "No custom products loaded. Add one below!",
    ar: "لا توجد منتجات مخصصة بعد. قم بإضافة أول منتج بالأسفل!"
  },
  prod_add_title: {
    en: "Seed New Product Item",
    ar: "إدراج منتج جديد في المتجر"
  },
  prod_field_title: {
    en: "Product Title",
    ar: "اسم المنتج"
  },
  prod_field_price: {
    en: "Price ($)",
    ar: "السعر ($)"
  },
  prod_field_orig_price: {
    en: "Strikethrough Original Price",
    ar: "السعر قبل الخصم (اختياري)"
  },
  prod_field_category: {
    en: "Belongs to Category",
    ar: "الفئة التابع لها"
  },
  prod_choose_cat_placeholder: {
    en: "-- Choose Category --",
    ar: "-- اختر التصنيف --"
  },
  prod_field_featured_checkbox: {
    en: "Feature on homepage grid",
    ar: "تمييز المنتج وعرضه في الصفحة الرئيسية"
  },
  prod_field_image: {
    en: "Product Image URL",
    ar: "رابط صورة المنتج"
  },
  prod_add_btn: {
    en: "Seed Product",
    ar: "إضافة المنتج للمتجر"
  },
  prod_edit_btn: {
    en: "Edit Product",
    ar: "تعديل المنتج"
  },
  prod_save_btn: {
    en: "Save Changes",
    ar: "حفظ التغييرات"
  },
  prod_cancel_btn: {
    en: "Cancel",
    ar: "إلغاء"
  },
  btn_config_title: {
    en: "PACK-009: Action Buttons",
    ar: "PACK-009: تصميم أزرار الإجراء"
  },
  btn_config_desc: {
    en: "Customize physical styles, shadows, shapes, padding, and micro-interaction scales for primary buttons.",
    ar: "تعديل حواف الأزرار، الكثافة والمسافات، الظلال الفيزيائية، وحركات التفاعل السريعة."
  },
  btn_shape_label: {
    en: "Button Corner Shapes",
    ar: "شكل حواف الزر"
  },
  btn_padding_label: {
    en: "Density & Padding",
    ar: "الكثافة وهوامش التعبئة"
  },
  btn_shadow_label: {
    en: "Physical Depth Shadows",
    ar: "الظلال والعمق الفيزيائي"
  },
  btn_hover_label: {
    en: "Cursor Hover Animation",
    ar: "التأثير عند مرور مؤشر الفأرة"
  },
  btn_preview_title: {
    en: "Interactive Button Specimen",
    ar: "معاينة حية للزر المخصص"
  },
  btn_preview_btn: {
    en: "Add to Basket",
    ar: "إضافة إلى السلة"
  },
  shape_boxy: {
    en: "Boxy",
    ar: "مستطيل حاد"
  },
  shape_sharp: {
    en: "Sharp",
    ar: "حواف خفيفة"
  },
  shape_soft: {
    en: "Soft",
    ar: "ناعم"
  },
  shape_round: {
    en: "Round",
    ar: "دائري"
  },
  shape_pill: {
    en: "Pill",
    ar: "بيضاوي"
  },
  pad_compact: {
    en: "Compact",
    ar: "مدمج"
  },
  pad_compact_desc: {
    en: "Space-saving (px-4 py-1.5)",
    ar: "موفر للمساحة"
  },
  pad_normal: {
    en: "Normal",
    ar: "طبيعي"
  },
  pad_normal_desc: {
    en: "Standard (px-6 py-2.5)",
    ar: "افتراضي متناسق"
  },
  pad_spacious: {
    en: "Spacious",
    ar: "فسيح"
  },
  pad_spacious_desc: {
    en: "Luxury editorial (px-8 py-3.5)",
    ar: "فاخر وواسع"
  },
  sh_flat: {
    en: "Flat",
    ar: "مسطح"
  },
  sh_raised: {
    en: "Raised",
    ar: "مرتفع"
  },
  sh_floating: {
    en: "Floating",
    ar: "عائم"
  },
  sh_deep: {
    en: "Deep",
    ar: "عميق"
  },
  hover_none: {
    en: "None",
    ar: "بدون تأثير"
  },
  hover_scale: {
    en: "Scale Up",
    ar: "تكبير طفيف"
  },
  hover_fade: {
    en: "Mute Opacity",
    ar: "تخفيف الإضاءة"
  },
  color_config_title: {
    en: "PACK-007: Colors & Theme",
    ar: "PACK-007: الألوان والمظهر"
  },
  color_config_desc: {
    en: "Customize the color scheme of the marketplace. Select preset palettes or set individual hex codes.",
    ar: "تخصيص المظهر اللوني لمتجرك بالكامل. اختر لوحة ألوان جاهزة أو حدد درجات الألوان المخصصة."
  },
  color_preset_title: {
    en: "Quick Preset Palettes",
    ar: "لوحات ألوان جاهزة وسريعة"
  },
  color_preset_desc: {
    en: "Click to apply palette",
    ar: "انقر لتطبيق المظهر"
  },
  color_fine_tune_title: {
    en: "Fine-tune Brand Colors",
    ar: "تعديل درجات الألوان بالتفصيل"
  },
  color_primary: {
    en: "Primary Brand",
    ar: "اللون الرئيسي للبراند"
  },
  color_primary_desc: {
    en: "Hero blocks, links",
    ar: "الكتل الرئيسية، الروابط والأزرار"
  },
  color_secondary: {
    en: "Secondary Accent",
    ar: "اللون الثانوي"
  },
  color_secondary_desc: {
    en: "Subtitles, borders",
    ar: "العناوين الفرعية والحدود والتفاصيل"
  },
  color_accent: {
    en: "Action Accent",
    ar: "درجة لون التمييز والإجراء"
  },
  color_accent_desc: {
    en: "Add to cart, badges",
    ar: "أزرار الإضافة للسلة، الشارات الترويجية"
  },
  color_background: {
    en: "Canvas Background",
    ar: "الخلفية العامة للموقع"
  },
  color_background_desc: {
    en: "Body background",
    ar: "الخلفية الأساسية للصفحات"
  },
  color_text: {
    en: "Main Text",
    ar: "لون النصوص الأساسية"
  },
  color_text_desc: {
    en: "Paragraphs, typography",
    ar: "الفقرات، العناوين والكتابات"
  },
  color_header_bg: {
    en: "Header Background",
    ar: "خلفية الترويسة (Header)"
  },
  color_header_bg_desc: {
    en: "Header toolbar wrapper",
    ar: "شريط القائمة العلوي"
  },
  color_footer_bg: {
    en: "Footer Canvas",
    ar: "خلفية تذييل الموقع (Footer)"
  },
  color_footer_bg_desc: {
    en: "Directory links background",
    ar: "خلفية قسم الروابط وحقوق الملكية"
  },
  preset_carbon: {
    en: "Carbon Noir (Default)",
    ar: "أسود وقور (كلاسيكي)"
  },
  preset_cyber: {
    en: "Cyber Turquoise",
    ar: "سيبراني متوهج"
  },
  preset_forest: {
    en: "Forest Harvest",
    ar: "عشبي ريفي"
  },
  preset_berry: {
    en: "Berry Blush",
    ar: "فراولة وردي"
  },
  preset_slate: {
    en: "Slate Minimalist",
    ar: "رمادي رمادي هادئ"
  },
  font_config_title: {
    en: "PACK-008: Fonts & Typography",
    ar: "PACK-008: الخطوط والطباعة"
  },
  font_config_desc: {
    en: "Select typography pairings to convey the precise aesthetic of your multi-vendor marketplace.",
    ar: "اختيار ومطابقة الخطوط للتعبير عن الهوية والجمالية الفريدة لمتجرك."
  },
  font_heading_label: {
    en: "Display Heading Font",
    ar: "خط العناوين البارزة"
  },
  font_body_label: {
    en: "Body & Content Font",
    ar: "خط النصوص والفقرات"
  },
  font_size_label: {
    en: "Base Font Size",
    ar: "حجم الخط الأساسي"
  },
  font_preview_title: {
    en: "Dynamic Type Rendering Sandbox",
    ar: "معاينة حية لتنسيق النصوص"
  },
  font_preview_heading: {
    en: "Curated Vendor Products",
    ar: "منتجات متميزة من البائعين"
  },
  font_preview_body: {
    en: "Each independent shop sets up their storefront and manages logistics. Seeded products are synchronized instantly across dynamic collections.",
    ar: "كل بائع مستقل يقوم بضبط متجره وإدارة الخدمات اللوجستية والشحن. يتم مزامنة المنتجات المدرجة فوراً عبر التصنيفات الحية."
  },
  desc_swiss: {
    en: "Swiss / Universal",
    ar: "سويسري / عالمي متناسق"
  },
  desc_tech: {
    en: "Tech / Brutalist",
    ar: "تقني / مستقبلي حاد"
  },
  desc_elegant: {
    en: "Editorial / Elegant",
    ar: "كلاسيكي / أنيق وراقٍ"
  },
  desc_modern: {
    en: "Modern / Geometrical",
    ar: "عصري / هندسي مريح"
  },
  desc_friendly: {
    en: "Friendly / Active",
    ar: "ودود / تفاعلي نشط"
  },
  desc_max_legibility: {
    en: "Maximum legibility",
    ar: "أقصى درجات الوضوح وسهولة القراءة"
  },
  desc_muted_sans: {
    en: "Muted modern sans",
    ar: "عصري ناعم بدون حواف"
  },
  desc_clean_premium: {
    en: "Clean premium text",
    ar: "نصوص متميزة ونظيفة بالكامل"
  },
  desc_warm_serif: {
    en: "Literary warm serif",
    ar: "دافئ ومقروء للمقالات الطويلة"
  },
  size_compact: {
    en: "Compact",
    ar: "مدمج"
  },
  size_compact_desc: {
    en: "High density (13px)",
    ar: "كثافة عالية (13px)"
  },
  size_standard: {
    en: "Standard",
    ar: "افتراضي"
  },
  size_standard_desc: {
    en: "Balanced (14px)",
    ar: "متوازن (14px)"
  },
  size_spacious: {
    en: "Spacious",
    ar: "واسع"
  },
  size_spacious_desc: {
    en: "Legible (16px)",
    ar: "واضح ومريح (16px)"
  },
  exp_config_title: {
    en: "PACK-010: Export Project",
    ar: "PACK-010: تصدير المشروع"
  },
  exp_config_desc: {
    en: "Select custom packs, configure local properties, choose your target framework architecture, and generate a fully deployable project bundle.",
    ar: "تحديد الحزم البرمجية المخصصة، ضبط الاسم والخيارات، اختيار بنية إطار العمل المناسبة وتنزيل الكود البرمجي بالكامل."
  },
  exp_tab_react: {
    en: "React + Vite SPA",
    ar: "صفحة وحيدة React + Vite"
  },
  exp_tab_nextjs: {
    en: "Next.js App Router (SSR Ready)",
    ar: "خادم مجهز Next.js App Router"
  },
  exp_sec_project: {
    en: "Project Configuration",
    ar: "تكوين المشروع وضبط الخيارات"
  },
  exp_lbl_repo: {
    en: "Local Repository Name",
    ar: "اسم مجلد المشروع المحلي"
  },
  exp_sec_packs: {
    en: "Include Packs in Compilation",
    ar: "تضمين الحزم البرمجية في التصدير"
  },
  exp_sec_structure: {
    en: "React + Vite Package Structure",
    ar: "هيكل حزمة React + Vite"
  },
  exp_sec_structure_nextjs: {
    en: "Next.js App Router Package Structure",
    ar: "هيكل حزمة Next.js App Router"
  },
  exp_btn_generate: {
    en: "Generate and Download React + Vite ZIP",
    ar: "تجهيز وتحميل ملف ZIP لـ React + Vite"
  },
  exp_btn_generate_nextjs: {
    en: "Generate and Download Next.js ZIP",
    ar: "تجهيز وتحميل ملف ZIP لـ Next.js"
  },
  exp_btn_packaging: {
    en: "Packaging ZIP files...",
    ar: "جاري تجهيز وضغط حزمة ZIP البرمجية..."
  },
  exp_msg_success: {
    en: "Project compiled and exported successfully! Please extract and run `npm install` locally.",
    ar: "تم تجميع وتصدير المشروع بنجاح! يرجى فك الضغط وتشغيل `npm install` محلياً."
  },
  exp_sec_guidelines: {
    en: "Local Launch Guidelines",
    ar: "خطوات التشغيل المحلي للمشروع"
  },
  exp_guide_1: {
    en: "Extract the downloaded archive.",
    ar: "قم بفك ضغط ملف الأرشيف الذي تم تنزيله."
  },
  exp_guide_2: {
    en: "Open a terminal window inside the folder.",
    ar: "افتح نافذة سطر الأوامر (Terminal) داخل المجلد المذكور."
  },
  exp_guide_3: {
    en: "Run npm install to download all required dependencies.",
    ar: "قم بتشغيل الأمر npm install لتحميل وتثبيت جميع المكتبات والاعتماديات اللازمة."
  },
  exp_guide_4: {
    en: "Launch the local development server by running npm run dev.",
    ar: "ابدأ خادم التشغيل والتطوير المحلي من خلال كتابة الأمر npm run dev."
  },
  login_title: {
    en: "Sign In to YOUMI",
    ar: "تسجيل الدخول إلى يومي"
  },
  login_subtitle: {
    en: "Manage, customize, and export your modular store packs",
    ar: "ابدأ بتنسيق متجرك الإلكتروني وتحميل حزمك البرمجية المخصصة"
  },
  signup_title: {
    en: "Create an Account",
    ar: "إنشاء حساب جديد"
  },
  signup_subtitle: {
    en: "Join YOUMI to design and compile customized marketplaces",
    ar: "انضم إلى منصة يومي لتعديل وتصميم المتاجر الإلكترونية"
  },
  field_name: {
    en: "Full Name",
    ar: "الاسم الكامل"
  },
  field_email: {
    en: "Email Address",
    ar: "البريد الإلكتروني"
  },
  field_password: {
    en: "Password",
    ar: "كلمة المرور"
  },
  field_confirm_password: {
    en: "Confirm Password",
    ar: "تأكيد كلمة المرور"
  },
  auth_role_label: {
    en: "Workspace Role",
    ar: "صلاحية الاستخدام في المتجر"
  },
  auth_role_admin: {
    en: "Admin (Full Control)",
    ar: "مدير (تحكم كامل بجميع الحزم)"
  },
  auth_role_editor: {
    en: "Editor (Can edit styles & products)",
    ar: "محرر (تعديل تصاميم ومنتجات المتجر)"
  },
  auth_role_viewer: {
    en: "Viewer (Read Only)",
    ar: "مستعرض (عرض حي وقراءة فقط)"
  },
  auth_plan_label: {
    en: "Subscription Plan",
    ar: "باقة الاشتراك المطلوبة"
  },
  auth_plan_free: {
    en: "Free (Basic customization)",
    ar: "المجانية (تخصيص تصاميم أساسية)"
  },
  auth_plan_pro: {
    en: "Pro (Custom colors & custom assets)",
    ar: "المحترفين (تخصيص الألوان ورفع الصور والمميزات السحابية)"
  },
  auth_plan_enterprise: {
    en: "Enterprise (Workspace sync & team access)",
    ar: "الشركات (المزامنة السحابية والمميزات المتقدمة وفرق العمل)"
  },
  auth_remember_me: {
    en: "Remember Me",
    ar: "تذكر بيانات الدخول"
  },
  auth_forgot_password_link: {
    en: "Forgot Password?",
    ar: "هل نسيت كلمة المرور؟"
  },
  auth_forgot_password_title: {
    en: "Reset Password",
    ar: "استعادة كلمة المرور"
  },
  auth_forgot_password_subtitle: {
    en: "Enter your email and we'll send a password recovery message",
    ar: "أدخل بريدك الإلكتروني وسنقوم بإرسال رابط آمن لاستعادة حسابك"
  },
  auth_btn_reset_link: {
    en: "Send Reset Link",
    ar: "إرسال رابط الاستعادة"
  },
  auth_social_or: {
    en: "Or connect via Cloud SSO Providers",
    ar: "أو تسجيل دخول آمن عبر المزودين السحابيين"
  },
  auth_status_supabase_connected: {
    en: "Cloud database connected (Supabase Secure Vault Active)",
    ar: "قاعدة البيانات السحابية متصلة ومؤمنة (Supabase)"
  },
  auth_status_supabase_not_connected: {
    en: "Sandbox sandbox mode (Running local secure storage engine)",
    ar: "بيئة تجريبية معزولة ومحمية (تعمل عبر الذاكرة المحلية)"
  },
  auth_status_supabase_setup_tip: {
    en: "To persist cloud-wide, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to secrets.",
    ar: "للحفظ الدائم السحابي ومشاركة مشاريعك، أضف مفاتيح سوبابيز VITE_SUPABASE_URL في إعدادات المنصة."
  },
  auth_err_email_not_found: {
    en: "Email address not found",
    ar: "البريد الإلكتروني غير مسجل لدينا"
  },
  auth_success_reset_sent: {
    en: "Secure password reset email sent successfully!",
    ar: "تم إرسال رابط إعادة تعيين كلمة المرور لبريدك الإلكتروني!"
  },
  auth_password_reset_success: {
    en: "Password has been successfully updated!",
    ar: "تم تحديث كلمة المرور الخاصة بك بنجاح!"
  },
  auth_btn_update_pass: {
    en: "Update Password",
    ar: "تحديث كلمة المرور"
  },
  btn_login: {
    en: "Sign In",
    ar: "تسجيل الدخول"
  },
  btn_signup: {
    en: "Sign Up",
    ar: "إنشاء الحساب"
  },
  switch_to_signup: {
    en: "Don't have an account? Sign Up",
    ar: "ليس لديك حساب؟ سجل الآن"
  },
  switch_to_login: {
    en: "Already have an account? Sign In",
    ar: "لديك حساب بالفعل؟ سجل الدخول"
  },
  guest_login_tip: {
    en: "Or enter as a guest instantly:",
    ar: "أو الدخول المباشر كزائر:"
  },
  btn_guest_login: {
    en: "Enter as Guest",
    ar: "الدخول كزائر"
  },
  err_empty_fields: {
    en: "Please fill in all fields",
    ar: "يرجى ملء جميع الحقول المطلوبة"
  },
  err_password_mismatch: {
    en: "Passwords do not match",
    ar: "كلمتا المرور غير متطابقتين"
  },
  err_invalid_credentials: {
    en: "Invalid email or password",
    ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
  },
  err_email_taken: {
    en: "Email address is already registered",
    ar: "البريد الإلكتروني مسجل بالفعل"
  },
  success_signup: {
    en: "Account created successfully! Please sign in.",
    ar: "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول."
  },
  btn_logout: {
    en: "Sign Out",
    ar: "تسجيل الخروج"
  },
  notif_logged_in: {
    en: "Successfully signed in!",
    ar: "تم تسجيل الدخول بنجاح!"
  },
  notif_logged_out: {
    en: "Signed out successfully",
    ar: "تم تسجيل الخروج بنجاح"
  }
};
