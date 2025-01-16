<template>
  <div class="auth-container">
    <h2 v-if="isLoginMode">Login</h2>
    <h2 v-else>Register</h2>

    <form @submit.prevent="isLoginMode ? login() : register()">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" v-model="userDto.userName" required/>
      </div>
      <div class="form-group" v-if="!isLoginMode">
        <label for="firstName">First Name:</label>
        <input type="text" v-model="userDto.firstName"/>
      </div>
      <div class="form-group" v-if="!isLoginMode">
        <label for="lastName">Last Name:</label>
        <input type="text" v-model="userDto.lastName"/>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="userDto.password" required/>
      </div>
      <button type="submit">{{ isLoginMode ? 'Login' : 'Register' }}</button>
    </form>

    <p @click="toggleMode" class="toggle-mode">
      {{ isLoginMode ? "Don't have an account ? Register" : "Already have an account? Login"   }}
    </p>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {AuthService} from '../services/authService'; // Импортируйте ваш сервис авторизации
import {TaskExplorerService} from "../services/myApi";

export interface UserDto {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  password?: string | null;
}

export default {
  setup() {
    const service = new TaskExplorerService();
    const router = useRouter();
    const isLoginMode = ref(true);
    const userDto = ref<UserDto>({
      firstName: null,
      lastName: null,
      userName: null,
      password: null,
    });
    const errorMessage = ref('');

    const toggleMode = () => {
      isLoginMode.value = !isLoginMode.value;
      errorMessage.value = ''; // Сбрасываем сообщение об ошибке при переключении
    };

    const login = async () => {
      try {
        const response = await service.api.authenticate({
          userName: userDto.value.userName,
          password: userDto.value.password
        });
        localStorage.setItem('jwtToken', response.token); // Сохранение токена
        router.push('/home'); // Перенаправление на страницу с проектами
      } catch (error) {
        errorMessage.value = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    };

    const register = async () => {
      try {
        await service.api.register({
          user: {
            userName: userDto.value.userName,
            password: userDto.value.password,
            firstName: userDto.value.firstName,
            lastName: userDto.value.lastName
          }
        });
        errorMessage.value = 'Registration successful! You can now log in.';
        toggleMode(); // Переключаемся на режим логина
      } catch (error) {
        errorMessage.value = 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    };

    return {isLoginMode, userDto, toggleMode, login, register, errorMessage};
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.error-message {
  color: red;
}

.toggle-mode {
  cursor: pointer;
  color: blue;
}
</style>
