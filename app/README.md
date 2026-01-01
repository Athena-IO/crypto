# Crypto Market App

پروژه بازار ارزهای دیجیتال با Vue 3, Nuxt 3, Pinia و Composition API

## 🚀 ویژگی‌ها

- **Composition API** - استفاده از جدیدترین روش Vue 3
- **Pinia Store** - مدیریت state متمرکز
- **صفحه‌بندی هوشمند** - با URL state
- **جستجو و فیلتر** - لحظه‌ای و سریع
- **کامپوننت‌های قابل استفاده مجدد** - UI تمیز و مدرن
- **SSR Compatible** - بهینه برای SEO

## 🛠️ تکنولوژی‌ها

- **Vue 3** - Composition API
- **Nuxt 3** - Full-stack framework
- **Pinia** - State management
- **Tailwind CSS** - Styling
- **Nuxt UI** - Component library

## 📁 ساختار پروژه

```
app/
├── stores/market.js           # 🏪 مدیریت state
├── composables/
│   ├── useMarket.js           # 🔗 رابط store
│   └── useToast.js            # 🍞 نمایش toast
├── components/
│   ├── CryptoTable.vue        # 📊 جدول
│   ├── CryptoCards.vue        # 🃏 کارت‌ها
│   ├── Pagination.vue         # 📄 صفحه‌بندی
│   └── SortableTable.vue      # 🔀 جدول قابل مرتب‌سازی
└── pages/
    ├── index.vue              # 📈 صفحه اصلی
    └── coins/[id].vue         # 🪙 جزئیات کوین
```

