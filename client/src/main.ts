import '@fontsource-variable/inter'
import './assets/main.css'
import './assets/reset.css'

import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
  license: import.meta.env.VITE_PRIME_LICENSE_KEY,
})

app.mount('#app')
