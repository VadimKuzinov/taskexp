<template>
  <div class="projects-container">
    <div class="user-info" v-if="currentUser">
      <div class="user-details">
        <span class="full-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
        <span class="username">(@{{ currentUser.userName }})</span>
      </div>
      <button class="logout-button" @click="logout">QUIT</button>
    </div>

    <ProjectSelector @update:selectedProject="onProjectSelected" />

    <div class="task-header">
      <router-link :to="{ name: 'CreateProject' }">
        <button class="create-task-button">+</button>
      </router-link>
    </div>

    <TaskList :selectedProject="selectedProject" />

    <div class="task-header">
      <router-link v-if="selectedProject" :to="{ name: 'CreateTask', query: { projectTitle: selectedProject } }">
        <button class="create-task-button">+</button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProjectSelector from './ProjectSelector.vue';
import TaskList from './TaskList.vue';
import { TaskExplorerService } from "../services/myApi";

export default {
  components: {
    ProjectSelector,
    TaskList,
  },
  setup() {
    const service = new TaskExplorerService();
    const selectedProject = ref("");
    const currentUser = ref(null);
    const router = useRouter();

    const onProjectSelected = (project) => {
      selectedProject.value = project;
    };

    const fetchCurrentUser = async () => {
      try {
        const user = await service.api.getCurrentUser();
        if (user && user.firstName) {
          currentUser.value = user; // Успешно получили пользователя
        } else {
          // Если пользователь не авторизован
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login'); // Перенаправляем на страницу логина при ошибке
      }
    };

    const logout = () => {
      localStorage.removeItem('jwtToken'); // Удаляем токен из localStorage
      router.push('/login'); // Перенаправляем на страницу логина
    };

    onMounted(() => {
      const savedColor = localStorage.getItem('backgroundColor');
      if (savedColor) {
        document.body.style.backgroundColor = savedColor;
      }
      fetchCurrentUser(); // Получаем текущего пользователя при монтировании компонента
    });

    return { selectedProject, onProjectSelected, currentUser, logout };
  },
};
</script>

<style scoped>
.projects-container {
  position: relative; /* Для позиционирования дочерних элементов */
}

.user-info {
  width: 50%; /* Ширина рамки 50% */
  background-color: #f8f9fa; /* Цвет фона */
  border: 1px solid #dee2e6; /* Рамка */
  border-radius: 5px; /* Закругление углов */
  padding: 10px; /* Внутренние отступы */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Тень для эффекта */
  margin-bottom: 10px; /* Отступ снизу для отделения от селектора проектов */
  display: flex; /* Используем flexbox для размещения элементов */
  justify-content: space-between; /* Распределяем элементы по краям */
  align-items: center; /* Центрируем элементы по вертикали */
}

.user-details {
  display: flex;
  flex-direction: column; /* Размещаем имя и логин в колонку */
}

.full-name {
  font-weight: bold; /* Жирный шрифт для имени */
}

.username {
  margin-top: 5px; /* Отступ между именем и юзернеймом */
}

.logout-button {
  margin-left: auto; /* Прижимаем кнопку к правому краю */
  padding: 5px 10px; /* Внутренние отступы */
  background-color: #dc3545; /* Красный цвет фона */
  color: white; /* Белый цвет текста */
  border: none; /* Без рамки */
  border-radius: 5px; /* Закругление углов */
  cursor: pointer; /* Курсор в виде указателя */
  transition: background-color 0.3s; /* Плавный переход цвета фона */
}

.logout-button:hover {
  background-color: #c82333; /* Темнее при наведении */
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
}

h2 {
  margin: 0;
}

.create-task-button {
  width: 40px;
  height: 40px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.create-task-button:hover {
  background-color: #0056b3;
}
</style>
