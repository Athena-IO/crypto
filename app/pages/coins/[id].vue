<script setup>
/**
 * Coin Detail Page - Using Composition API
 * صفحه جزئیات کوین - استفاده از Composition API
 */

const route = useRoute()
const coinId = route.params.id

// State
const coin = ref(null)
const loading = ref(false)
const error = ref(null)

// Composables
const { toastError, toastSuccess } = useAppToast()

/**
 * Fetch coin details
 * دریافت جزئیات کوین
 */
const fetchCoinDetails = async () => {
  loading.value = true
  error.value = null

  try {
    coin.value = await $fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        params: {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
        },
      }
    )
  } catch (e) {
    error.value = e
    const errorMessage = getErrorMessage(e)
    toastError({
      title: 'خطا در دریافت اطلاعات کوین',
      description: errorMessage,
    })
    console.error('Error fetching coin details:', e)
  } finally {
    loading.value = false
  }
}

const retry = async () => {
  await fetchCoinDetails()
  if (!error.value && process.client) {
    toastSuccess({
      title: 'موفقیت',
      description: 'اطلاعات با موفقیت بارگذاری شد',
    })
  }
}

onMounted(() => {
  fetchCoinDetails()
})
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-green-900/20"
  >
    <div class="container mx-auto p-6 max-w-5xl">
      <!-- Back Button -->
      <UButton
        icon="i-lucide-arrow-right"
        to="/"
        color="neutral"
        variant="ghost"
        class="mb-6 text-gray-400 hover:text-green-400 hover:bg-gray-800/50 transition-all"
      >
        بازگشت به بازار
      </UButton>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="rounded-xl border border-green-500/20 bg-gray-900/50 backdrop-blur-sm py-20"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="relative">
            <div
              class="absolute inset-0 blur-xl bg-green-500/20 rounded-full"
            ></div>
            <UIcon
              name="i-lucide-loader-circle"
              class="size-16 animate-spin text-green-400 relative"
            />
          </div>
          <p class="text-xl font-bold text-gray-100">
            در حال بارگذاری اطلاعات...
          </p>
          <p class="text-sm text-gray-400">لطفاً چند لحظه صبر کنید</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="rounded-xl border border-red-500/20 bg-gray-900/50 backdrop-blur-sm"
      >
        <div class="flex flex-col items-center justify-center gap-4 py-12">
          <div class="p-4 rounded-full bg-red-500/10 border border-red-500/20">
            <UIcon name="i-lucide-alert-circle" class="size-16 text-red-400" />
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-red-400 mb-2">خطا در بارگذاری</p>
            <p class="text-gray-400">{{ getErrorMessage(error) }}</p>
          </div>
          <div class="flex gap-3 mt-4">
            <UButton
              icon="i-lucide-refresh-cw"
              color="primary"
              @click="retry"
              class="bg-green-500 text-gray-900 hover:bg-green-400"
            >
              تلاش مجدد
            </UButton>
            <UButton
              icon="i-lucide-arrow-right"
              to="/"
              color="neutral"
              variant="outline"
              class="border-green-500/20 text-green-400 hover:bg-green-500/10"
            >
              بازگشت
            </UButton>
          </div>
        </div>
      </div>

      <!-- Coin Details -->
      <div v-else-if="coin">
        <div
          class="rounded-xl border border-green-500/20 bg-gray-900/50 backdrop-blur-sm overflow-hidden"
        >
          <!-- Header -->
          <div
            class="bg-gradient-to-r from-gray-800/80 to-gray-800/50 border-b border-green-500/20 p-6"
          >
            <div class="flex items-center gap-4 flex-wrap">
              <div class="relative">
                <div
                  class="absolute inset-0 blur-md bg-green-500/20 rounded-full"
                ></div>
                <UAvatar
                  :src="coin.image.large"
                  :alt="coin.name"
                  size="xl"
                  class="ring-2 ring-green-500/40 relative"
                />
              </div>
              <div class="flex-1">
                <h1
                  class="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1"
                >
                  {{ coin.name }}
                </h1>
                <p
                  class="text-green-400 uppercase text-sm font-semibold tracking-wider"
                >
                  {{ coin.symbol }}
                </p>
              </div>
              <UBadge
                variant="soft"
                size="lg"
                class="bg-green-500/10 text-green-400 border border-green-500/30 font-bold"
              >
                رتبه #{{ coin.market_cap_rank }}
              </UBadge>
            </div>
          </div>

          <div class="p-6 space-y-8">
            <!-- قیمت و تغییرات -->
            <div>
              <h2
                class="text-xl font-bold text-green-400 mb-4 flex items-center gap-2"
              >
                <UIcon name="i-lucide-trending-up" class="size-5" />
                قیمت و تغییرات
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  class="p-5 rounded-lg bg-gray-800/50 border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-lucide-dollar-sign"
                      class="size-4 text-green-400"
                    />
                    <p class="text-sm text-gray-400 font-medium">قیمت فعلی</p>
                  </div>
                  <p class="text-3xl font-bold text-green-400">
                    ${{
                      coin.market_data.current_price.usd.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                        }
                      )
                    }}
                  </p>
                </div>

                <div
                  class="p-5 rounded-lg bg-gray-800/50 border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-lucide-activity"
                      class="size-4 text-green-400"
                    />
                    <p class="text-sm text-gray-400 font-medium">
                      تغییرات ۲۴ ساعت
                    </p>
                  </div>
                  <UBadge
                    :color="
                      coin.market_data.price_change_percentage_24h >= 0
                        ? 'success'
                        : 'error'
                    "
                    variant="soft"
                    size="lg"
                    class="text-lg font-bold"
                  >
                    {{
                      coin.market_data.price_change_percentage_24h >= 0
                        ? "▲"
                        : "▼"
                    }}
                    {{
                      Math.abs(
                        coin.market_data.price_change_percentage_24h
                      ).toFixed(2)
                    }}%
                  </UBadge>
                </div>

                <div
                  class="p-5 rounded-lg bg-gray-800/50 border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-lucide-arrow-down"
                      class="size-4 text-red-400"
                    />
                    <p class="text-sm text-gray-400 font-medium">
                      کمترین قیمت ۲۴ ساعت
                    </p>
                  </div>
                  <p class="text-xl font-bold text-gray-200">
                    ${{
                      coin.market_data.low_24h.usd.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })
                    }}
                  </p>
                </div>

                <div
                  class="p-5 rounded-lg bg-gray-800/50 border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-lucide-arrow-up"
                      class="size-4 text-green-400"
                    />
                    <p class="text-sm text-gray-400 font-medium">
                      بیشترین قیمت ۲۴ ساعت
                    </p>
                  </div>
                  <p class="text-xl font-bold text-gray-200">
                    ${{
                      coin.market_data.high_24h.usd.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- اطلاعات بازار -->
            <div>
              <h2
                class="text-xl font-bold text-green-400 mb-4 flex items-center gap-2"
              >
                <UIcon name="i-lucide-bar-chart-3" class="size-5" />
                اطلاعات بازار
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  class="p-5 rounded-lg bg-gray-800/50 border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-lucide-landmark"
                      class="size-4 text-green-400"
                    />
                    <p class="text-sm text-gray-400 font-medium">ارزش بازار</p>
                  </div>
                  <p class="text-xl font-bold text-gray-200">
                    ${{
                      (coin.market_data.market_cap.usd / 1000000000).toFixed(2)
                    }}B
                  </p>
                </div>

                <div
                  class="p-5 rounded-lg bg-gray-800/50 border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-lucide-bar-chart-2"
                      class="size-4 text-green-400"
                    />
                    <p class="text-sm text-gray-400 font-medium">
                      حجم معاملات ۲۴ ساعت
                    </p>
                  </div>
                  <p class="text-xl font-bold text-gray-200">
                    ${{
                      (coin.market_data.total_volume.usd / 1000000).toFixed(2)
                    }}M
                  </p>
                </div>

                <div
                  class="p-5 rounded-lg bg-gray-800/50 border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-lucide-coins"
                      class="size-4 text-green-400"
                    />
                    <p class="text-sm text-gray-400 font-medium">
                      عرضه در گردش
                    </p>
                  </div>
                  <p class="text-xl font-bold text-gray-200">
                    {{
                      coin.market_data.circulating_supply.toLocaleString(
                        "en-US",
                        { maximumFractionDigits: 0 }
                      )
                    }}
                  </p>
                </div>

                <div
                  class="p-5 rounded-lg bg-gray-800/50 border border-green-500/20 hover:border-green-500/40 transition-all"
                  v-if="coin.market_data.total_supply"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-lucide-database"
                      class="size-4 text-green-400"
                    />
                    <p class="text-sm text-gray-400 font-medium">کل عرضه</p>
                  </div>
                  <p class="text-xl font-bold text-gray-200">
                    {{
                      coin.market_data.total_supply.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- درباره -->
            <div
              v-if="coin.description && coin.description.en"
              class="p-5 rounded-lg bg-gray-800/50 border border-green-500/20"
            >
              <h2
                class="text-xl font-bold text-green-400 mb-3 flex items-center gap-2"
              >
                <UIcon name="i-lucide-info" class="size-5" />
                About {{ coin.name }}:
              </h2>
              <div
                v-html="
                  coin.description.en.split('. ').slice(0, 3).join('. ') + '.'
                "
                class="text-gray-300 leading-relaxed prose prose-invert max-w-none"
              />
            </div>

            <!-- لینک‌ها -->
            <div v-if="coin.links" class="flex flex-wrap gap-4">
              <UButton
                v-if="coin.links.homepage && coin.links.homepage[0]"
                :to="coin.links.homepage[0]"
                target="_blank"
                external
                size="lg"
                class="bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 font-bold hover:from-green-400 hover:to-emerald-400 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 border-0 px-6 py-3"
              >
                <template #leading>
                  <UIcon name="i-lucide-globe" class="size-5" />
                </template>
                وب‌سایت
              </UButton>
              <UButton
                v-if="
                  coin.links.blockchain_site && coin.links.blockchain_site[0]
                "
                :to="coin.links.blockchain_site[0]"
                target="_blank"
                external
                size="lg"
                class="bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-bold hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 border-0 px-6 py-3"
              >
                <template #leading>
                  <UIcon name="i-lucide-external-link" class="size-5" />
                </template>
                اکسپلورر
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
