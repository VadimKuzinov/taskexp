<template>
  <div class="project-selector">
    <label for="project-select" class="project-label">Project:</label>
    <select id="project-select" v-model="selectedProject" @change="emitSelectedProject" class="project-select">
      <option value="" disabled>Select a project</option>
      <option v-for="project in projects" :key="project.number" :value="project.title">
        {{ project.title }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { TaskExplorerService } from "../services/myApi.ts";

export default {
  emits: ['update:selectedProject'],
  setup(props, { emit }) {
    const service = new TaskExplorerService();
    const projects = ref([]);
    const selectedProject = ref("");

    const fetchProjects = async () => {
      try {
        const response = await service.api.getProjects();
        projects.value = response.projects || [];
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const emitSelectedProject = () => {
      emit('update:selectedProject', selectedProject.value);
    };

    onMounted(fetchProjects);

    return { projects, selectedProject, emitSelectedProject };
  },
};
</script>

<style scoped>
.project-selector {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
}

.project-label {
  font-size: 1.2rem; /* Увеличенный размер шрифта для метки */
  margin-bottom: 0.5rem; /* Отступ снизу для метки */
}

.project-select {
  font-size: 1.2rem; /* Увеличенный размер шрифта для select */
  padding: 0.5rem; /* Отступы внутри select */
  border: 1px solid #ccc; /* Параметры рамки */
  border-radius: 4px; /* Скругление углов */
  background-color: #f9f9f9; /* Цвет фона */
  transition: border-color 0.3s; /* Плавный переход для рамки */
}

.project-select:hover {
  border-color: #007bff; /* Цвет рамки при наведении */
  cursor: pointer; /* Курсор при наведении */
}
</style>
