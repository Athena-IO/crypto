import { defineStore } from 'pinia'

function getErrorMessage(error) {
  if (error?.statusCode === 429) return 'درخواست‌های زیادی ارسال شده است. لطفاً چند لحظه صبر کنید.'
  if (error?.statusCode === 404) return 'منبع مورد نظر یافت نشد.'
  if (error?.statusCode >= 500) return 'خطای سرور. لطفاً بعداً تلاش کنید.'
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return 'خطا در اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید.'
  }
  return error?.message || 'خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.'
}

export const useMarketStore = defineStore('market', {
  state: () => ({
    coins: [],
    loading: false,
    initialLoading: false,
    error: null,
    errorMessage: null,
    currentPage: 1,
    perPage: 20,
    totalPages: 1,
    searchQuery: '',
    viewMode: 'table',
  }),

  getters: {
    filteredCoins: (state) => {
      if (!state.searchQuery) return state.coins

      const query = state.searchQuery.toLowerCase()
      return state.coins.filter(
        (coin) =>
          coin.name?.toLowerCase().includes(query) ||
          coin.symbol?.toLowerCase().includes(query)
      )
    },

    paginationInfo: (state) => {
      const start = (state.currentPage - 1) * state.perPage + 1
      const end = Math.min(
        state.currentPage * state.perPage,
        state.coins.length + (state.currentPage - 1) * state.perPage
      )
      return { start, end }
    },

    hasCoins: (state) => state.coins.length > 0,
    hasError: (state) => !!state.error,
  },

  actions: {
    async fetchMarket(page = 1, itemsPerPage = 20) {
      this.loading = true
      this.initialLoading = this.coins.length === 0
      this.error = null
      this.errorMessage = null
      this.currentPage = page
      this.perPage = itemsPerPage

      try {
        const data = await $fetch(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: itemsPerPage,
              page: page,
              sparkline: false,
            },
          }
        )

        this.coins = data || []

        if (data.length < itemsPerPage) {
          this.totalPages = page
        } else {
          this.totalPages = Math.max(page + 1, this.totalPages)
        }
      } catch (e) {
        this.error = e
        this.errorMessage = getErrorMessage(e)
        console.error('Error fetching market data:', e)
        throw e
      } finally {
        this.loading = false
        this.initialLoading = false
      }
    },


    setSearchQuery(query) {
      this.searchQuery = query
    },

    clearSearch() {
      this.searchQuery = ''
    },

    setViewMode(mode) {
      if (mode === 'table' || mode === 'cards') {
        this.viewMode = mode
      }
    },

    reset() {
      this.coins = []
      this.loading = false
      this.initialLoading = false
      this.error = null
      this.errorMessage = null
      this.currentPage = 1
      this.perPage = 20
      this.totalPages = 1
      this.searchQuery = ''
      this.viewMode = 'table'
    },
  },
})

