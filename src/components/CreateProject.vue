<template>
  <div class="project-creation">
    <h2>Create New Project</h2>
    <form @submit.prevent="createProject">
      <div class="form-group">
        <label for="project-title">Project Title:</label>
        <input
            type="text"
            id="project-title"
            v-model="project.title"
            required
            placeholder="Enter project title"
        />
      </div>
      <div class="form-group">
        <label for="project-number">Project Number:</label>
        <input
            type="text"
            id="project-number"
            v-model="project.number"
            placeholder="Enter project number (optional)"
        />
      </div>
      <button type="submit" class="btn-create">Create</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Project } from '../models/myApi'; // Предположим, что модель находится в этой папке
import {TaskExplorerService} from "../services/myApi";

export default defineComponent({
  setup() {
    const service = new TaskExplorerService();
    const project = ref<Project>({});
    const errorMessage = ref<string | null>(null);
    const successMessage = ref<string | null>(null);

    const createProject = async () => {
      try {
        await service.api.createProject({ project: project.value });
        successMessage.value = 'Project created successfully!';
        errorMessage.value = null;
        project.value = {}; // Сбросить форму после успешного создания
      } catch (error) {
        errorMessage.value = 'Failed to create project. Please try again.';
        successMessage.value = null;
      }
    };

    return {
      project,
      createProject,
      errorMessage,
      successMessage,
    };
  },
});
</script>

<style scoped>
.project-creation {
  max-width: 400px;
  margin: auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-create {
  width: 100%;
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-create:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  text-align: center;
}

.success-message {
  color: green;
  text-align: center;
}
</style>
