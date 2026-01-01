<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 20,
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [20, 50, 100, 250],
  },
  showItemsSelector: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['page-change', 'items-per-page-change'])

const getPageNumbers = () => {
  const current = props.currentPage
  const total = props.totalPages
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current <= 3) {
      // Near the start
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      // Near the end
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // In the middle
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && !props.loading) {
    emit('page-change', page)
  }
}

const changeItemsPerPage = (value) => {
  emit('items-per-page-change', value)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 items-center justify-center">
    <!-- Items Per Page Selector -->
    <div v-if="showItemsSelector" class="flex items-center gap-2">
      <span class="text-sm text-gray-400">تعداد در هر صفحه:</span>
      <select
        :value="itemsPerPage"
        @change="changeItemsPerPage(parseInt($event.target.value))"
        class="px-3 py-2 rounded-lg bg-gray-800/50 border border-green-500/20 text-gray-100 focus:border-green-500/40 focus:outline-none backdrop-blur-sm"
      >
        <option
          v-for="option in itemsPerPageOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>

    <!-- Page Navigation -->
    <div
      class="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-green-500/20"
    >
      <!-- First Page -->
      <UButton
        :disabled="currentPage === 1 || loading"
        icon="i-lucide-chevrons-right"
        variant="ghost"
        size="sm"
        @click="changePage(1)"
        :class="
          currentPage === 1 || loading
            ? 'opacity-50 cursor-not-allowed text-gray-500'
            : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
        "
      />

      <!-- Previous Page -->
      <UButton
        :disabled="currentPage === 1 || loading"
        icon="i-lucide-chevron-right"
        variant="ghost"
        size="sm"
        @click="changePage(currentPage - 1)"
        :class="
          currentPage === 1 || loading
            ? 'opacity-50 cursor-not-allowed text-gray-500'
            : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
        "
      />

      <!-- Page Numbers -->
      <div class="flex items-center gap-1 px-2">
        <template v-for="p in getPageNumbers()" :key="p">
          <UButton
            v-if="p !== '...'"
            :variant="p === currentPage ? 'solid' : 'ghost'"
            :color="p === currentPage ? 'primary' : 'neutral'"
            size="sm"
            @click="changePage(p)"
            :class="
              p === currentPage
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
        :disabled="currentPage >= totalPages || loading"
        icon="i-lucide-chevron-left"
        variant="ghost"
        size="sm"
        @click="changePage(currentPage + 1)"
        :class="
          currentPage >= totalPages || loading
            ? 'opacity-50 cursor-not-allowed text-gray-500'
            : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
        "
      />

      <!-- Last Page -->
      <UButton
        :disabled="currentPage >= totalPages || loading"
        icon="i-lucide-chevrons-left"
        variant="ghost"
        size="sm"
        @click="changePage(totalPages)"
        :class="
          currentPage >= totalPages || loading
            ? 'opacity-50 cursor-not-allowed text-gray-500'
            : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
        "
      />
    </div>

    <!-- Page Info -->
    <div class="text-sm text-gray-400">
      صفحه
      <span class="font-bold text-green-400">{{ currentPage }}</span>
      از
      <span class="font-bold text-green-400">{{ totalPages }}</span>
    </div>
  </div>
</template>

