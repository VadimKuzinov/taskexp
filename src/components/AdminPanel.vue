<template>
  <div class="background-selector">
    <h2>Select Background Color</h2>
    <div class="color-options">
      <div
          v-for="color in colors"
          :key="color"
          :style="{ backgroundColor: color }"
          class="color-option"
          @click="changeBackground(color)"
      ></div>
    </div>

    <h2>Registered Users</h2>
    <ul class="user-list">
      <li v-for="user in users" :key="user.userName" class="user-item">
        {{ user.firstName }} {{ user.lastName }} ({{ user.userName }}) {{ user.password }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent, ref, onMounted } from 'vue';
import { TaskExplorerService } from "../services/myApi";

export default defineComponent({
  setup() {
    const router = useRouter();
    const service = new TaskExplorerService();
    const colors = ['#ffffff', '#f0f0f0', '#ffcccc', '#ccffcc', '#ccccff', '#ffccff'];
    const users = ref<UserDto[]>([]); // Создаем реактивный массив для пользователей

    const fetchCurrentUser = async () => {
      try {
        const user = await service.api.getCurrentUser();
        if (user) {
          if (user.userName !== "admin") {
            router.push('home');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login'); // Перенаправляем на страницу логина при ошибке
      }
    };

    const fetchAllUsers = async () => {
      try {
        const allUsers = await service.api.getAllUsers();
        users.value = allUsers; // Заполняем массив пользователей
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const changeBackground = (color: string) => {
      document.body.style.backgroundColor = color;
      localStorage.setItem('backgroundColor', color); // Сохранение выбранного цвета в Local Storage
    };

    // Установка фона при загрузке компонента
    const setInitialBackground = () => {
      const savedColor = localStorage.getItem('backgroundColor');
      if (savedColor) {
        document.body.style.backgroundColor = savedColor;
      }
    };

    onMounted(() => {
      fetchCurrentUser();
      setInitialBackground(); // Установка фона при инициализации компонента
      fetchAllUsers(); // Получаем всех пользователей
    });

    return {
      colors,
      changeBackground,
      users,
    };
  },
});
</script>

<style scoped>
.background-selector {
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

.color-options {
  display: flex;
  justify-content: space-around;
}

.color-option {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
}

.color-option:hover {
  border: 2px solid #333; /* Подсветка при наведении */
}

.user-list {
  list-style-type: none; /* Убираем маркеры списка */
  padding: 0; /* Убираем отступы */
}

.user-item {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc; /* Разделение между пользователями */
}

.user-item:last-child {
  border-bottom: none; /* Убираем нижнюю границу у последнего элемента */
}
</style>
