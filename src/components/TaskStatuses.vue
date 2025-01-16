<template>
  <div>
    <h2>Task Statuses</h2>
    <ul>
      <li v-for="(status, index) in statuses" :key="index">
        {{ status }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiService from '~/src/services/api-service.ts';

export default {
  setup() {
    const statuses = ref([]);

    const fetchStatuses = async () => {
      try {
        const result = await apiService.getTaskStatuses();
        statuses.value = Object.values(result.data); // Assuming result.Status is an enum-like object
      } catch (error) {
        console.error('Error fetching statuses:', error);
        // Handle error as needed
      }
    };

    onMounted(fetchStatuses);

    return { statuses };
  },
};
</script>

<style scoped>
/* Add any styles for your component here */
</style>
