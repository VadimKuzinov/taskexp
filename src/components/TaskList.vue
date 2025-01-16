<template>
  <div>
    <h2>Tasks</h2>
    <div v-if="tasks.length === 0" class="no-tasks">No tasks available for this project.</div>
    <div class="task-list">
      <div
          v-for="task in tasks"
          :key="task.number.number"
          class="task-card"
          @click="goToTaskDetail(task.number)"
      >
        <div class="task-header">
          <span class="task-number">{{ task.number.prefix }}-{{ task.number.number }}</span>
          <span class="task-status" :class="task.taskModel.status">{{ task.taskModel.status }}</span>
        </div>
        <h3 class="task-title">{{ task.taskModel.title }}</h3>
        <span class="task-assigned">Assigned to: {{ task.taskModel.assignedToLogin }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, watch} from 'vue';
import {TaskExplorerService} from "../services/myApi.ts";
//import router from "../router/index";
import {useRouter} from "vue-router";

export default {
  props: {
    selectedProject: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const service = new TaskExplorerService();
    const tasks = ref([]);

    const fetchTasks = async (newValue: string) => {
      try {
        const response = await service.api.getTasksByProject({projectTitle: newValue});
        tasks.value = response.tasks || [];
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    watch(() => props.selectedProject, (newValue) => {
      if (newValue) {
        fetchTasks(newValue);
      }
    });

    // Реализуем метод перехода на страницу деталей задачи
    const goToTaskDetail = (taskNumber) => {
      console.log(taskNumber);
      router.push({
        name: 'TaskDetail',
        params: {number: taskNumber.prefix + '-' + taskNumber.number.toString()}
      });
    };

    return {tasks, goToTaskDetail}; // Возвращаем метод
  },
};
</script>

<style scoped>
.task-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Добавляем промежутки между карточками */
}

.task-card {
  border: 1px solid #ccc;
  border-radius: 8px; /* Скругляем углы */
  padding: 15px; /* Увеличиваем отступы */
  cursor: pointer;
  width: calc(33% - 20px); /* Устанавливаем ширину карточки с учетом отступов */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Добавляем тень */
  transition: transform 0.2s; /* Плавный переход при наведении */
}

.task-card:hover {
  transform: scale(1.02); /* Увеличиваем карточку при наведении */
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-number {
  font-weight: bold;
}

.task-status {
  padding: 5px;
  border-radius: 5px;
  color: white;
}

.ToDo {
  background-color: lightgray;
}

.InProgress {
  background-color: yellow;
  color: black;
}

.InReview {
  background-color: blue;
}

.Testing {
  background-color: orange;
}

.DevelopmentDone {
  background-color: green;
}

.ReadyToDeploy {
  background-color: purple;
}

.Closed {
  background-color: red;
}

.task-title {
  margin: 10px 0; /* Отступы для заголовка задачи */
}

.task-assigned {
  font-size: 14px; /* Уменьшаем размер шрифта для информации об исполнителе */
}

.no-tasks {
  font-style: italic;
  color: gray;
}
</style>