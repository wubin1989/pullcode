<script setup lang="ts">
import { petService } from '@/api/PetService';
import { PetStatusEnum } from '@/api/types';

const pets = petService.getPetFindByStatus({
  status: PetStatusEnum.AVAILABLE,
})

</script>

<template>
  <div>
    {{ pets }}
  </div>
</template>
