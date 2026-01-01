<script setup>
import { h, resolveComponent } from "vue";

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UAvatar = resolveComponent("UAvatar");

const props = defineProps({
  coins: {
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
    default: 'asc',
  },
});

const emit = defineEmits(['sort-change', 'row-click'])

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

const sortedData = computed(() => {
  if (!props.sortField || !props.coins.length) {
    return props.coins
  }

  return [...props.coins].sort((a, b) => {
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

const columns = [
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
      ]);
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
      );
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
      const change = row.getValue("price_change_percentage_24h");
      const color = change >= 0 ? "success" : "error";
      return h(
        UBadge,
        {
          color,
          variant: "soft",
          size: "sm",
          class: "font-bold",
        },
        `${change >= 0 ? "+" : ""}${change?.toFixed(2)}%`
      );
    },
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
  {
    id: "actions",
    header: "مشاهده جزییات",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "flex justify-center" },
        h(UButton, {
          icon: "i-lucide-eye",
          size: "sm",
          variant: "ghost",
          color: "primary",
          class:
            "text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all duration-200",
          onClick: () => {
            emit('row-click', row.original);
          },
        })
      );
    },
    meta: {
      class: {
        th: "text-center w-20",
        td: "text-center w-20",
      },
    },
  },
];
</script>

<template>
  <div class="rounded-xl overflow-hidden border border-green-500/20 bg-gray-900/50 backdrop-blur-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-green-500/10">
        <!-- Table Header -->
        <thead :class="'bg-gradient-to-r from-gray-800/80 to-gray-800/50 border-b-2 border-green-500/30'">
          <tr>
            <th
              v-for="column in columns"
              :key="column.accessorKey || column.id"
              scope="col"
              :class="[
                'px-4 py-4 text-sm font-bold text-green-400 uppercase tracking-wider whitespace-nowrap',
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
        <tbody :class="'divide-y divide-green-500/10'">
          <!-- Loading State -->
          <tr v-if="loading">
            <td
              :colspan="columns.length"
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
              :colspan="columns.length"
              class="px-4 py-8 text-center"
            >
              <div class="flex items-center justify-center gap-3">
                <UIcon name="i-lucide-database" class="size-6 text-gray-500" />
                <span class="text-gray-400">داده‌ای یافت نشد</span>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr v-else v-for="(row, index) in sortedData" :key="row.id || index" class="hover:bg-green-500/5 transition-all duration-200">
            <td
              v-for="column in columns"
              :key="column.accessorKey || column.id"
              :class="[
                'px-4 py-4 text-sm align-middle',
                column.meta?.class?.td
              ]"
            >
              <component
                v-if="typeof column.cell === 'function'"
                :is="column.cell({ row: { original: row, index, getValue: (key) => getNestedValue(row, key) } })"
              />
              <span v-else :class="'text-gray-100'">
                {{ getNestedValue(row, column.accessorKey) || '-' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.crypto-table {
  --ui-bg-elevated: #1f2937;
}

/* Custom scrollbar for table */
:deep(.crypto-table) {
  scrollbar-width: thin;
  scrollbar-color: #10b981 #1f2937;
}

:deep(.crypto-table)::-webkit-scrollbar {
  height: 8px;
}

:deep(.crypto-table)::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

:deep(.crypto-table)::-webkit-scrollbar-thumb {
  background: #10b981;
  border-radius: 4px;
}

:deep(.crypto-table)::-webkit-scrollbar-thumb:hover {
  background: #059669;
}
</style>
