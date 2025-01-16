// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import TaskDetail from '@/components/TaskDetail.vue';
import Projects from "@/components/Projects.vue";
import Auth from "@/components/Auth.vue";
import CreateTask from "@/components/CreateTask.vue";
import CreateProject from "@/components/CreateProject.vue";
import AdminPanel from "@/components/AdminPanel.vue"; // Your task detail component

const routes = [
    { path: '/home', component: Projects },
    { path: '/task/create', component: CreateTask, name: 'CreateTask' },
    { path: '/project/create', component: CreateProject, name: 'CreateProject' },
    { path: '/login', alias: '/', component: Auth },
    { path: '/task/:number', name: 'TaskDetail', component: TaskDetail }, // Dynamic route for task detail
    { path: '/admin', name: 'Admin', component: AdminPanel }, // Dynamic route for task detail
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.afterEach(() => {
    const savedColor = localStorage.getItem('backgroundColor');
    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
    }
});
export default router;
