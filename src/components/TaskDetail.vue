<template>
  <div class="task-detail">
    <div class="task-header">
      <h3 class="task-title">{{ taskDetails?.taskModel.title }} <span class="task-code">({{ taskNumber }})</span></h3>
    </div>
    <div v-if="taskDetails" class="task-info">
      <div class="info-row">
        <span class="key">Project:</span>
        <span class="value">{{ taskDetails.taskModel.projectTitle }}</span>
      </div>
      <div class="info-row" @click="editField('description')">
        <strong class="key">Description:</strong>
        <div class="value description">
          <span v-if="!isEditing.description">{{ taskDetails.taskModel.description }}</span>
          <input v-else v-model="updatedTaskModel.description" type="text" @blur="updateTask('description')"/>
        </div>
      </div>
      <div class="info-row">
        <strong class="key">Due Date:</strong>
        <span class="value" @click="editField('dueDate')">
          <span v-if="!isEditing.dueDate">{{ formatDate(taskDetails.taskModel.dueDate) }}</span>
          <input v-else v-model="updatedTaskModel.dueDate" type="date" @blur="updateTask('dueDate')"/>
        </span>
      </div>
      <div class="info-row">
        <span class="key">Creator:</span>
        <span class="value">{{ taskDetails.taskModel.creatorLogin }}</span>
      </div>
      <div class="info-row">
        <strong class="key">Assigned To:</strong>
        <span class="value">
          <span v-if="!isEditing.assignedToLogin">{{ taskDetails.taskModel.assignedToLogin }}</span>
          <select v-else v-model="updatedTaskModel.assignedToLogin" @change="updateTask('assignedToLogin')">
            <option value="" disabled>{{ taskDetails.taskModel.assignedToLogin }}</option>
            <option v-for="user in users" :key="user.userName" :value="user.userName">{{ user.firstName }} {{ user.lastName }} ({{ user.userName }})</option>
          </select>
        </span>
        <button @click="editField('assignedToLogin')" v-if="!isEditing.status">Edit</button>
      </div>
      <div class="info-row">
        <strong class="key">Reporter:</strong>
        <span class="value">
          <span v-if="!isEditing.reporterLogin">{{ taskDetails.taskModel.reporterLogin }}</span>
          <select v-else v-model="updatedTaskModel.reporterLogin" @change="updateTask('reporterLogin')">
            <option value="" disabled>{{ taskDetails.taskModel.reporterLogin }}</option>
            <option v-for="user in users" :key="user.userName" :value="user.userName">{{ user.firstName }} {{ user.lastName }} ({{ user.userName }})</option>
          </select>
        </span>
        <button @click="editField('reporterLogin')" v-if="!isEditing.status">Edit</button>
      </div>
      <div class="info-row">
        <strong class="key">Status:</strong>
        <span class="value">
          <span v-if="!isEditing.status">{{ taskDetails.taskModel.status }}</span>
          <select v-else v-model="updatedTaskModel.status" @change="updateTask('status')">
            <option value="" disabled>{{ taskDetails.taskModel.status }}</option>
            <option v-for="status in availableStatuses" :key="status" :value="status">{{ status }}</option>
          </select>
        </span>
        <button @click="editField('status')" v-if="!isEditing.status">Edit</button>
      </div>
      <button @click="removeTask()">REMOVE</button>
    </div>
    <div v-else>
      <p>Loading task details...</p>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {TaskExplorerService} from "../services/myApi";
import {useNotification} from "@kyvg/vue3-notification";
import {UserDto} from "~/src/models/myApi";

export default {
  setup() {
    const {notify} = useNotification();
    const route = useRoute();
    const router = useRouter();
    const taskNumber = ref(route.params.number);
    const taskDetails = ref(null);
    const service = new TaskExplorerService();
    const availableStatuses = ref([]);
    const users = ref<UserDto[]>([]);

    // Состояние для отслеживания редактируемых полей
    const isEditing = ref({
      description: false,
      dueDate: false,
      creatorLogin: false,
      assignedToLogin: false,
      reporterLogin: false,
      status: false,
    });

    // Обновленная модель задачи
    const updatedTaskModel = ref({...taskDetails.value?.taskModel});

    onMounted(async () => {
      try {
        let [prefix, number] = taskNumber.value.toString().split('-');
        const response = await service.api.getTaskByNumber({number: {prefix: prefix, number: +number}});
        taskDetails.value = response.task;
        updatedTaskModel.value = {...response.task.taskModel}; // Инициализируем обновленную модель
      } catch (error) {
        console.error('Error fetching task details:', error);
      }

      await fetchTaskStatuses();
      await fetchAllUsers();
    });

    const fetchTaskStatuses = async () => {
      try {
        const response = await service.api.getAvailableStatuses({status: taskDetails.value.taskModel['status']});
        availableStatuses.value = response.statuses || [];
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        users.value = await service.api.getAllUsers(); // Заполняем массив пользователей
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const formatDate = (dateString) => {
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Метод для обработки клика по полю
    const editField = (field) => {
      isEditing.value[field] = true;
    };

    // Метод для обновления задачи
    const updateTask = async (field) => {
      isEditing.value[field] = false;
      if (field === 'status') {
        notify({
          title: "New status of task of " + taskNumber.value.toString() + " is: " + updatedTaskModel.value['status'].toString() + "\n" + new Date().toUTCString(),
          closeOnClick: true,
          duration: -1
        });
      }

      try {
        let [prefix, number] = taskNumber.value.toString().split('-');
        if (updatedTaskModel.value['dueDate'].length < 11) {
          updatedTaskModel.value['dueDate'] += 'T00:00:00.0000000Z';
        }
        await service.api.updateTask({task: updatedTaskModel.value, number: {prefix: prefix, number: +number}});
        // Обновляем локальные данные после успешного обновления
        taskDetails.value.taskModel[field] = updatedTaskModel.value[field];
        await fetchTaskStatuses();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };

    const removeTask = async () => {
      let [prefix, number] = taskNumber.value.toString().split('-');
      await service.api.deleteTask({number: {prefix: prefix, number: +number}});
      router.push('/home');
      notify({
        title: "Task " + taskNumber.value.toString() + " is REMOVED" + "\n" + new Date().toUTCString(),
        closeOnClick: true,
        duration: -1
      });
    };

    return {
      taskNumber,
      taskDetails,
      formatDate,
      editField,
      updateTask,
      updatedTaskModel,
      isEditing,
      availableStatuses,
      removeTask,
      users
    };
  },
};
</script>

<style scoped>
.task-detail {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.task-header {
  display: flex;
  align-items: center;
}

.task-title {
  font-size: 1.5em; /* Увеличиваем размер шрифта для названия */
}

.task-code {
  font-size: 1em; /* Размер шрифта для кода задачи */
  color: #666;
  margin-left: 10px; /* Отступ между названием и кодом */
}

.task-info {
  margin-top: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between; /* Распределяем ключи и значения по краям */
  margin-bottom: 0.5rem; /* Отступ между строками */
}

.key {
  font-weight: bold;
  width: 150px; /* Фиксированная ширина для ключей */
}

.value {
  width: calc(100% - 150px); /* Значения занимают оставшееся пространство */
}

.description {
  border: 1px solid #ccc; /* Рамка для описания */
  padding: 0.5rem; /* Отступ внутри рамки */
  margin-top: 0.5rem; /* Отступ сверху для описания */
}
</style>
