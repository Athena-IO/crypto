export const useMarket = () => {
  const marketStore = useMarketStore()

  return {
    coins: computed(() => marketStore.coins),
    loading: computed(() => marketStore.loading),
    initialLoading: computed(() => marketStore.initialLoading),
    error: computed(() => marketStore.error),
    errorMessage: computed(() => marketStore.errorMessage),

    currentPage: computed(() => marketStore.currentPage),
    perPage: computed(() => marketStore.perPage),
    totalPages: computed(() => marketStore.totalPages),

    searchQuery: computed({
      get: () => marketStore.searchQuery,
      set: (value) => marketStore.setSearchQuery(value),
    }),
    viewMode: computed({
      get: () => marketStore.viewMode,
      set: (value) => marketStore.setViewMode(value),
    }),

    filteredCoins: computed(() => marketStore.filteredCoins),
    paginationInfo: computed(() => marketStore.paginationInfo),
    hasCoins: computed(() => marketStore.hasCoins),
    hasError: computed(() => marketStore.hasError),

    fetchMarket: marketStore.fetchMarket,
    clearSearch: () => marketStore.clearSearch(),
    reset: () => marketStore.reset(),
  }
}
