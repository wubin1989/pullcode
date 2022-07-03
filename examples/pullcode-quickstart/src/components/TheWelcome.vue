<script setup lang="ts">
import { petService } from '@/api/PetService';
import { Pet, PetStatusEnum } from '@/api/types';
import { ref } from 'vue';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

let loading = ref(true);
let dataSource = ref([] as Pet[]);

petService.getPetFindByStatus({
  status: PetStatusEnum.AVAILABLE,
}).then((resp: Pet[]) => {
  dataSource.value = resp
  loading.value = false
})

</script>

<template>
  <div>
    <a-table :dataSource="dataSource" :columns="columns" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'tags'">
          <span>
            <a-tag v-for="tag in record.tags" :key="tag.id">
              {{ tag.name.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'category'">
          {{ record.category.name }}
        </template>
      </template>
    </a-table>
  </div>
</template>
