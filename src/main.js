import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router/index.js";
import Notifications from '@kyvg/vue3-notification'

createApp(App)
    .use(router)
    .use(Notifications)
    .mount('#app');

