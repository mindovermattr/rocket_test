import '@fontsource-variable/inter'
import './assets/main.css'
import './assets/reset.css'

import Aura from '@primeuix/themes/aura'
import { VueQueryPlugin } from '@tanstack/vue-query'
import 'primeicons/primeicons.css'
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

app.use(VueQueryPlugin)

app.mount('#app')
