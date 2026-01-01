<script setup>
import { h, resolveComponent } from "vue"

const UBadge = resolveComponent("UBadge")
const UButton = resolveComponent("UButton")
const UAvatar = resolveComponent("UAvatar")

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  sortField: {
    type: String,
    default: '',
  },
  sortDirection: {
    type: String,
    default: 'asc', // 'asc' or 'desc'
  },
  emptyMessage: {
    type: String,
    default: 'داده‌ای یافت نشد',
  },
  ui: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['sort-change', 'row-click'])

const sortedData = computed(() => {
  if (!props.sortField || !props.data.length) {
    return props.data
  }

  return [...props.data].sort((a, b) => {
    const aValue = getNestedValue(a, props.sortField)
    const bValue = getNestedValue(b, props.sortField)

    // Handle different types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return props.sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return props.sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })
})

// Get nested object value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Handle column sort
const handleSort = (column) => {
  if (!column.sortable) return

  const field = column.accessorKey || column.key
  let direction = 'asc'

  if (props.sortField === field) {
    direction = props.sortDirection === 'asc' ? 'desc' : 'asc'
  }

  emit('sort-change', { field, direction })
}

// Get sort icon
const getSortIcon = (column) => {
  const field = column.accessorKey || column.key

  if (props.sortField !== field) {
    return 'i-lucide-arrow-up-down'
  }

  return props.sortDirection === 'asc'
    ? 'i-lucide-arrow-up'
    : 'i-lucide-arrow-down'
}

// Render cell content
const renderCell = (column, row, rowIndex) => {
  if (column.cell) {
    // Custom cell renderer
    return column.cell({ row: { original: row, index: rowIndex }, getValue: () => getNestedValue(row, column.accessorKey) })
  }

  // Default cell renderer
  const value = getNestedValue(row, column.accessorKey)
  return h('span', { class: 'text-gray-100' }, value || '-')
}

// Default columns if none provided
const defaultColumns = [
  {
    accessorKey: "market_cap_rank",
    header: "#",
    sortable: true,
    cell: ({ row }) =>
      h(
        "span",
        { class: "text-green-400 font-semibold" },
        row.getValue("market_cap_rank")
      ),
    meta: {
      class: {
        th: "w-16",
        td: "w-16",
      },
    },
  },
  {
    accessorKey: "name",
    header: "نام دارایی",
    sortable: true,
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          src: row.original.image,
          alt: row.original.name,
          size: "md",
          class: "ring-2 ring-green-500/20",
        }),
        h("div", undefined, [
          h("p", { class: "font-semibold text-gray-100" }, row.original.name),
          h(
            "p",
            { class: "text-xs text-green-400 uppercase font-medium" },
            row.original.symbol
          ),
        ]),
      ])
    },
    meta: {
      class: {
        th: "min-w-[200px]",
        td: "min-w-[200px]",
      },
    },
  },
  {
    accessorKey: "current_price",
    header: "قیمت فعلی",
    sortable: true,
    cell: ({ row }) => {
      return h(
        "span",
        { class: "font-bold text-green-400" },
        `$${row.getValue("current_price").toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      )
    },
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
  {
    accessorKey: "price_change_percentage_24h",
    header: "تغییر 24h",
    sortable: true,
    cell: ({ row }) => {
      const change = row.getValue("price_change_percentage_24h")
      const color = change >= 0 ? 'success' : 'error'
      return h(UBadge, {
        color,
        variant: 'soft',
        size: 'sm',
        class: 'font-bold'
      }, `${change >= 0 ? '+' : ''}${change?.toFixed(2)}%`)
    },
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
]

const tableColumns = computed(() => props.columns.length > 0 ? props.columns : defaultColumns)
</script>

<template>
  <div class="rounded-xl overflow-hidden border border-green-500/20 bg-gray-900/50 backdrop-blur-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-green-500/10">
        <!-- Table Header -->
        <thead :class="ui.thead || 'bg-gradient-to-r from-gray-800/80 to-gray-800/50'">
          <tr>
            <th
              v-for="column in tableColumns"
              :key="column.accessorKey || column.key"
              scope="col"
              :class="[
                ui.th || 'px-4 py-4 text-sm font-bold text-green-400 uppercase tracking-wider whitespace-nowrap',
                column.meta?.class?.th,
                { 'cursor-pointer hover:bg-gray-700/50': column.sortable }
              ]"
              @click="handleSort(column)"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.header }}</span>
                <UIcon
                  v-if="column.sortable"
                  :name="getSortIcon(column)"
                  class="size-4 text-green-400"
                />
              </div>
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody :class="ui.tbody || 'divide-y divide-green-500/10'">
          <!-- Loading State -->
          <tr v-if="loading">
            <td
              :colspan="tableColumns.length"
              class="px-4 py-8 text-center"
            >
              <div class="flex items-center justify-center gap-3">
                <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-green-400" />
                <span class="text-gray-400">در حال بارگذاری...</span>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="!sortedData.length">
            <td
              :colspan="tableColumns.length"
              class="px-4 py-8 text-center"
            >
              <div class="flex flex-col items-center gap-3">
                <UIcon name="i-lucide-database" class="size-8 text-gray-500" />
                <span class="text-gray-400">{{ emptyMessage }}</span>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-else
            v-for="(row, index) in sortedData"
            :key="row.id || index"
            :class="ui.tr || 'hover:bg-green-500/5 transition-all duration-200 cursor-pointer'"
            @click="$emit('row-click', row)"
          >
            <td
              v-for="column in tableColumns"
              :key="column.accessorKey || column.key"
              :class="[
                ui.td || 'px-4 py-4 text-sm align-middle',
                column.meta?.class?.td
              ]"
            >
              <component :is="renderCell(column, row, index)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

