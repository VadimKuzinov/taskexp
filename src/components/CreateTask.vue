<template>
  <div class="create-task-container">
    <h2>Create Task</h2>
    <form @submit.prevent="createTask">
      <div class="form-group">
        <label for="taskTitle">Title:</label>
        <input type="text" v-model="task.title" required class="input-field" />
      </div>
      <div class="form-group">
        <label for="taskDescription">Description:</label>
        <textarea v-model="task.description" class="textarea-field"></textarea>
      </div>
      <div class="form-group">
        <label for="taskDueDate">Due Date:</label>
        <input type="datetime-local" v-model="task.dueDate" class="input-field" />
      </div>
      <div class="form-group">
        <label for="projectTitle">Project ID:</label>
        <input type="text" v-model="projectId" readonly required class="input-field" />
      </div>
      <div class="form-group">
        <label for="sprintId">Sprint ID:</label>
        <input type="number" v-model="task.sprintId" class="input-field" />
      </div>
      <div class="form-group">
        <label for="assignedToLogin">Assigned To:</label>
        <select v-model="task.assignedToLogin" class="input-field">
          <option value="" disabled>Select a user</option>
          <option v-for="user in users" :key="user.userName" :value="user.userName">
            {{ user.firstName }} {{ user.lastName }} ({{ user.userName }})
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="reporterLogin">Reporter:</label>
        <select v-model="task.reporterLogin" class="input-field">
          <option value="" disabled>Select a user</option>
          <option v-for="user in users" :key="user.userName" :value="user.userName">
            {{ user.firstName }} {{ user.lastName }} ({{ user.userName }})
          </option>
        </select>
      </div>
      <button type="submit" class="submit-button">Create Task</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {TaskExplorerService} from '../services/myApi'; // Импортируйте ваш сервис для работы с задачами
import {TaskModel, UserDto} from '../models/myApi'; // Импортируйте вашу модель задачи

export default {
  setup() {
    const service = new TaskExplorerService();
    const route = useRoute();
    const router = useRouter();
    const users = ref<UserDto[]>([])
    const task = ref<TaskModel>({
      title: null,
      description: null,
      dueDate: null,
      projectId: null,
      sprintId: null,
      assignedToLogin: null,
      reporterLogin: null,
      projectTitle: null,
    });
    const errorMessage = ref('');

    const projectId = ref("");

    onMounted(() => {
      fetchAllUsers();
      // Получаем projectId из query параметров маршрута
      projectId.value = route.query['projectTitle']?.toString() || "UNKNOWN PROJECT";
    });

    const createTask = async () => {
      try {
        if (task.value['dueDate'].length < 17) {
          task.value['dueDate'] += ':00.0000000Z';
        }
        task.value['projectTitle'] = projectId.value;
        await service.api.createTask({ taskModel: task.value });
        // После успешного создания задачи перенаправляем на страницу задач или другую страницу
        router.push('/home'); // Замените '/tasks' на нужный маршрут
      } catch (error) {
        errorMessage.value = 'Failed to create task. Please try again.';
        console.error('Task creation error:', error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        users.value = await service.api.getAllUsers(); // Заполняем массив пользователей
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    return { task, createTask, errorMessage, projectId, users };
  },
};
</script>

<style scoped>
.create-task-container {
  max-width: 600px; /* Максимальная ширина контейнера */
  margin: 0 auto; /* Центрируем контейнер */
  padding: 20px; /* Внутренние отступы */
  border: 1px solid #ccc; /* Рамка вокруг контейнера */
  border-radius: 8px; /* Закругленные углы */
  background-color: #f9f9f9; /* Цвет фона */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Тень для контейнера */
}

h2 {
  text-align: center; /* Выравнивание заголовка по центру */
  color: #333; /* Цвет заголовка */
}

.form-group {
  margin-bottom: 15px; /* Отступы между полями формы */
}

.label {
  display: block; /* Блоковый элемент для меток */
  margin-bottom: 5px; /* Отступ снизу метки */
}

.input-field,
.textarea-field {
  width: 100%; /* Полная ширина поля */
  padding: 10px; /* Внутренние отступы */
  border: 1px solid #ccc; /* Рамка вокруг полей ввода */
  border-radius: 4px; /* Закругленные углы */
  font-size: 14px; /* Размер шрифта */
}

.textarea-field {
  height: 100px; /* Высота текстового поля */
}

.submit-button {
  width: 100%; /* Полная ширина кнопки */
  padding: 10px; /* Внутренние отступы кнопки */
  background-color: #007bff; /* Цвет фона кнопки */
  color: white; /* Цвет текста кнопки */
  border: none; /* Убираем рамку у кнопки */
  border-radius: 4px; /* Закругленные углы кнопки */
  font-size: 16px; /* Размер шрифта кнопки */
  cursor: pointer; /* Курсор при наведении на кнопку */
}

.submit-button:hover {
  background-color: #0056b3; /* Цвет фона кнопки при наведении */
}

.error-message {
  color: red; /* Цвет сообщения об ошибке */
  text-align: center; /* Выравнивание сообщения об ошибке по центру */
}
</style>
