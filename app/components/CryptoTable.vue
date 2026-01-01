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
});

const columns = [
  {
    accessorKey: "market_cap_rank",
    header: "#",
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
            navigateTo(`/coins/${row.original.id}`);
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
  <div
    class="rounded-xl overflow-hidden border border-green-500/20 bg-gray-900/50 backdrop-blur-sm"
  >
    <UTable
      :data="coins"
      :columns="columns"
      :loading="loading"
      :loading-state="{
        icon: 'i-lucide-loader-circle',
        label: 'در حال بارگذاری...',
      }"
      :empty-state="{ icon: 'i-lucide-database', label: 'داده‌ای یافت نشد' }"
      :ui="{
        base: 'min-w-full table-fixed',
        thead:
          'bg-gradient-to-r from-gray-800/80 to-gray-800/50 border-b-2 border-green-500/30',
        tbody: 'divide-y divide-green-500/10',
        tr: 'hover:bg-green-500/5 transition-all duration-200',
        th: 'px-4 py-4 text-sm font-bold text-green-400 uppercase tracking-wider whitespace-nowrap',
        td: 'px-4 py-4 text-sm align-middle',
        loadingState: {
          icon: 'animate-spin text-green-400',
          label: 'text-gray-400',
        },
        emptyState: {
          icon: 'text-gray-500',
          label: 'text-gray-400',
        },
      }"
    />
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
