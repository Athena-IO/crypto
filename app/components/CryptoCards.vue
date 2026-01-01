<script setup>
const props = defineProps({
  coins: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
  >
    <!-- Loading Skeletons -->
    <template v-if="loading">
      <div
        v-for="i in 12"
        :key="`skeleton-${i}`"
        class="rounded-xl border border-green-500/20 bg-gray-900/50 backdrop-blur-sm p-5"
      >
        <div class="animate-pulse space-y-4">
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-gray-800 h-12 w-12" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-800 rounded w-3/4" />
              <div class="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-800 rounded w-1/2" />
            <div class="h-3 bg-gray-800 rounded w-2/3" />
            <div class="h-3 bg-gray-800 rounded w-1/3" />
          </div>
        </div>
      </div>
    </template>

    <!-- Crypto Cards -->
    <NuxtLink
      v-for="coin in coins"
      :key="coin.id"
      :to="`/coins/${coin.id}`"
      class="group rounded-xl border border-green-500/20 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/50 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 overflow-hidden"
    >
      <div class="p-5">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="coin.image"
              :alt="coin.name"
              size="lg"
              class="ring-2 ring-green-500/20 group-hover:ring-green-500/40 transition-all"
            />
            <div>
              <h3
                class="font-bold text-lg text-gray-100 group-hover:text-green-400 transition-colors"
              >
                {{ coin.name }}
              </h3>
              <p class="text-sm text-green-400 uppercase font-medium">
                {{ coin.symbol }}
              </p>
            </div>
          </div>
          <UBadge
            variant="soft"
            color="primary"
            class="bg-green-500/10 text-green-400 border border-green-500/20"
          >
            #{{ coin.market_cap_rank }}
          </UBadge>
        </div>

        <!-- Stats -->
        <div class="space-y-3 border-t border-green-500/10 pt-4">
          <!-- قیمت فعلی -->
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">قیمت فعلی</span>
            <span class="text-lg font-bold text-green-400">
              ${{
                coin.current_price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
          </div>

          <!-- تغییرات ۲۴ ساعت -->
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">تغییرات ۲۴ ساعت</span>
            <UBadge
              :color="
                coin.price_change_percentage_24h >= 0 ? 'success' : 'error'
              "
              variant="soft"
              class="font-bold"
            >
              {{ coin.price_change_percentage_24h >= 0 ? "▲" : "▼" }}
              {{ Math.abs(coin.price_change_percentage_24h).toFixed(2) }}%
            </UBadge>
          </div>

          <!-- ارزش بازار -->
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">ارزش بازار</span>
            <span class="text-sm font-semibold text-gray-300">
              ${{ (coin.market_cap / 1000000000).toFixed(2) }}B
            </span>
          </div>

          <!-- حجم معاملات -->
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">حجم (۲۴ساعت)</span>
            <span class="text-sm font-medium text-gray-400">
              ${{ (coin.total_volume / 1000000).toFixed(2) }}M
            </span>
          </div>
        </div>
      </div>

      <!-- Footer Button -->
      <div class="px-5 pb-5">
        <div
          class="w-full text-center py-2.5 rounded-lg bg-green-500/10 text-green-400 font-medium text-sm border border-green-500/20 group-hover:bg-green-500 group-hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <UIcon name="i-lucide-eye" class="size-4" />
          <span>مشاهده جزئیات</span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
