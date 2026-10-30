<script setup lang="ts">
import { mockLeads } from '@/mocks/leads'
import { computed } from 'vue'
import VLeadsTable from './VLeadsTable.vue'

const sum = computed(() => mockLeads.reduce((acc, val) => acc + val.price, 0))
</script>

<template>
  <div>
    {{ mockLeads.length }}
    {{ sum }}
  </div>
  <VLeadsTable :leads="mockLeads" />
</template>

<style scoped>
.main {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
