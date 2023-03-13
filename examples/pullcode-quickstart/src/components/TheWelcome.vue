<script setup lang="ts">
import { petService } from "@/api/PetService";
import { bookService } from "@/test-api/BookService";
import { Pet, PetStatusEnum } from "@/api/types";
import {
  GetBookPageResp,
  Page,
  PostBookPageReq,
  PostBookPageResp,
} from "@/test-api/types";
import { ref } from "vue";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

const loading = ref(true);
const dataSource = ref([] as Pet[]);

petService
  .getPetFindByStatus({
    status: PetStatusEnum.AVAILABLE,
  })
  .then((resp: Pet[]) => {
    dataSource.value = resp;
    loading.value = false;
  });

bookService
  .getBookPage({
    name: "aaa",
    author: "bbbb",
    page: {
      pageNo: 2,
      size: 15,
      orders: [
        {
          col: "created_at",
          sort: "desc",
        },
        {
          col: "name",
          sort: "asc",
        },
      ],
    } as Page,
  })
  .then((resp: GetBookPageResp) => {
    console.log(resp);
  });

bookService
  .postBookPage({
    author: "ddd",
    name: "ccc",
  } as PostBookPageReq)
  .then((resp: PostBookPageResp) => {
    console.log(resp);
  });
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
          {{ record.category?.name }}
        </template>
      </template>
    </a-table>
  </div>
</template>
