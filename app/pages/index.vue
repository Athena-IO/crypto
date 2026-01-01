<script setup>
const route = useRoute()
const router = useRouter()

const {
  coins,
  loading,
  initialLoading,
  error,
  errorMessage,
  filteredCoins,
  paginationInfo,
  totalPages,
  hasCoins,
  hasError,
  searchQuery,
  viewMode,
  fetchMarket,
  clearSearch,
} = useMarket()

const page = computed(() => {
  const pageParam = parseInt(route.query.page) || 1
  return Math.max(1, pageParam)
})

const itemsPerPage = computed(() => {
  const perPageParam = parseInt(route.query.per_page) || 20
  return Math.max(10, Math.min(250, perPageParam))
})

onMounted(() => {
  fetchMarket(page.value, itemsPerPage.value)
})

watch([page, itemsPerPage], () => {
  fetchMarket(page.value, itemsPerPage.value)
})

const goToPage = (newPage) => {
  router.push({
    query: {
      ...route.query,
      page: newPage,
    },
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changePerPage = (newPerPage) => {
  router.push({
    query: {
      ...route.query,
      per_page: newPerPage,
      page: 1,
    },
  })
}

// Get page numbers to display in pagination
const getPageNumbers = () => {
  const current = page.value;
  const total = totalPages.value;
  const pages = [];

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (current <= 3) {
      // Near the start
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 2) {
      // Near the end
      pages.push('...');
      for (let i = total - 3; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-green-900/20"
  >
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center gap-3 mb-4">
          <div
            class="p-3 rounded-xl bg-green-500/10 border border-green-500/20"
          >
            <UIcon name="i-lucide-trending-up" class="size-8 text-green-400" />
          </div>
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
          >
            بازار ارزهای دیجیتال
          </h1>
        </div>
        <p class="text-gray-400 text-lg">
          پیگیری لحظه‌ای قیمت و اطلاعات بازار کریپتو
        </p>
      </div>

      <!-- Search and View Toggle -->
      <div
        class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center"
      >
        <!-- Search Input -->
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="جستجو بر اساس نام یا سمبل..."
            size="lg"
            :loading="false"
            :ui="{
              base: 'bg-gray-800/50 border-green-500/20 focus:border-green-500/40 text-gray-100 placeholder-gray-500',
              icon: { leading: 'text-green-400' },
            }"
            class="backdrop-blur-sm"
          />
        </div>

        <!-- View Toggle Buttons -->
        <div
          class="flex gap-2 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-green-500/20"
        >
          <UButton
            :variant="viewMode === 'table' ? 'solid' : 'ghost'"
            :color="viewMode === 'table' ? 'primary' : 'neutral'"
            icon="i-lucide-table"
            size="lg"
            @click="viewMode = 'table'"
            :class="
              viewMode === 'table'
                ? 'bg-green-500 text-gray-900'
                : 'text-gray-400 hover:text-gray-100'
            "
          >
            جدول
          </UButton>
          <UButton
            :variant="viewMode === 'cards' ? 'solid' : 'ghost'"
            :color="viewMode === 'cards' ? 'primary' : 'neutral'"
            icon="i-lucide-layout-grid"
            size="lg"
            @click="viewMode = 'cards'"
            :class="
              viewMode === 'cards'
                ? 'bg-green-500 text-gray-900'
                : 'text-gray-400 hover:text-gray-100'
            "
          >
            کارت
          </UButton>
        </div>
      </div>

      <!-- Initial Loading State -->
      <div
        v-if="initialLoading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="relative">
          <div
            class="absolute inset-0 blur-xl bg-green-500/20 rounded-full"
          ></div>
          <UIcon
            name="i-lucide-loader-circle"
            class="size-16 animate-spin text-green-400 relative"
          />
        </div>
        <p class="text-gray-300 mt-6 text-lg font-medium">در حال بارگذاری...</p>
        <p class="text-gray-500 text-sm mt-2">لطفاً چند لحظه صبر کنید</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="hasError && !hasCoins"
        class="rounded-xl border border-red-500/20 bg-gray-900/50 backdrop-blur-sm py-20"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div
            class="p-4 rounded-full bg-red-500/10 border border-red-500/20"
          >
            <UIcon name="i-lucide-alert-circle" class="size-16 text-red-400" />
          </div>
          <p class="text-xl font-bold text-red-400">خطا در بارگذاری</p>
          <p class="text-gray-400 text-center max-w-md">{{ errorMessage }}</p>
          <UButton
            color="primary"
            variant="solid"
            icon="i-lucide-refresh-cw"
            @click="fetchMarket(page, itemsPerPage)"
            class="mt-4 bg-green-500 text-gray-900 hover:bg-green-400"
          >
            تلاش مجدد
          </UButton>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-else-if="!loading && !hasError && filteredCoins.length === 0"
        class="rounded-xl border border-green-500/20 bg-gray-900/50 backdrop-blur-sm py-20"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div
            class="p-4 rounded-full bg-gray-800/50 border border-green-500/20"
          >
            <UIcon name="i-lucide-search-x" class="size-16 text-gray-500" />
          </div>
          <p class="text-xl font-bold text-gray-300">نتیجه‌ای یافت نشد</p>
          <p class="text-gray-500 text-sm">لطفاً عبارت دیگری را جستجو کنید</p>
          <UButton
            v-if="searchQuery"
            color="primary"
            variant="soft"
            icon="i-lucide-x"
            @click="clearSearch()"
            class="mt-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-gray-900"
          >
            پاک کردن جستجو
          </UButton>
        </div>
      </div>

      <!-- Table View -->
      <CryptoTable
        v-else-if="viewMode === 'table'"
        :coins="filteredCoins"
        :loading="loading"
      />

      <!-- Card View -->
      <CryptoCards v-else :coins="filteredCoins" :loading="loading" />

      <!-- Results Count and Pagination -->
      <div v-if="!loading && filteredCoins.length > 0" class="mt-6 space-y-4">
        <!-- Results Count -->
        <div class="text-center">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-green-500/20 backdrop-blur-sm"
          >
            <UIcon name="i-lucide-database" class="size-4 text-green-400" />
            <span class="text-sm text-gray-400">
              <template v-if="searchQuery">
                نمایش
                <span class="font-bold text-green-400">{{ filteredCoins.length }}</span>
                نتیجه از
                <span class="font-bold text-green-400">{{ coins.length }}</span>
                دارایی در این صفحه
              </template>
              <template v-else>
                نمایش
                <span class="font-bold text-green-400">{{ paginationInfo.start }}</span>
                تا
                <span class="font-bold text-green-400">{{ paginationInfo.end }}</span>
                از
                <span class="font-bold text-green-400">{{ coins.length }}</span>
                دارایی
              </template>
            </span>
          </div>
        </div>

        <!-- Pagination Controls (only show when not searching) -->
        <div
          v-if="!searchQuery"
          class="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <!-- Items Per Page Selector -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">تعداد در هر صفحه:</span>
            <select
              :value="itemsPerPage"
              @change="changePerPage(parseInt($event.target.value))"
              class="px-3 py-2 rounded-lg bg-gray-800/50 border border-green-500/20 text-gray-100 focus:border-green-500/40 focus:outline-none backdrop-blur-sm"
            >
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="250">250</option>
            </select>
          </div>

          <!-- Page Navigation -->
          <div
            class="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-green-500/20"
          >
            <!-- First Page -->
            <UButton
              :disabled="page === 1 || loading"
              icon="i-lucide-chevrons-right"
              variant="ghost"
              size="sm"
              @click="goToPage(1)"
              :class="
                page === 1 || loading
                  ? 'opacity-50 cursor-not-allowed text-gray-500'
                  : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
              "
            />

            <!-- Previous Page -->
            <UButton
              :disabled="page === 1 || loading"
              icon="i-lucide-chevron-right"
              variant="ghost"
              size="sm"
              @click="goToPage(page - 1)"
              :class="
                page === 1 || loading
                  ? 'opacity-50 cursor-not-allowed text-gray-500'
                  : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
              "
            />

            <!-- Page Numbers -->
            <div class="flex items-center gap-1 px-2">
              <template v-for="p in getPageNumbers()" :key="p">
                <UButton
                  v-if="p !== '...'"
                  :variant="p === page ? 'solid' : 'ghost'"
                  :color="p === page ? 'primary' : 'neutral'"
                  size="sm"
                  @click="goToPage(p)"
                  :class="
                    p === page
                      ? 'bg-green-500 text-gray-900 min-w-[2.5rem]'
                      : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10 min-w-[2.5rem]'
                  "
                >
                  {{ p }}
                </UButton>
                <span v-else class="px-2 text-gray-500">...</span>
              </template>
            </div>

            <!-- Next Page -->
            <UButton
              :disabled="page >= totalPages || loading"
              icon="i-lucide-chevron-left"
              variant="ghost"
              size="sm"
              @click="goToPage(page + 1)"
              :class="
                page >= totalPages || loading
                  ? 'opacity-50 cursor-not-allowed text-gray-500'
                  : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
              "
            />

            <!-- Last Page -->
            <UButton
              :disabled="page >= totalPages || loading"
              icon="i-lucide-chevrons-left"
              variant="ghost"
              size="sm"
              @click="goToPage(totalPages)"
              :class="
                page >= totalPages || loading
                  ? 'opacity-50 cursor-not-allowed text-gray-500'
                  : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
              "
            />
          </div>

          <!-- Page Info -->
          <div class="text-sm text-gray-400">
            صفحه
            <span class="font-bold text-green-400">{{ page }}</span>
            از
            <span class="font-bold text-green-400">{{ totalPages }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
