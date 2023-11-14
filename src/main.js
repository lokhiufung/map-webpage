/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import VueGoogleMaps from '@fawmi/vue-google-maps'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

app.use(VueGoogleMaps, {
    load: {
        // key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
        key: googleMapsApiKey,
        libraries: 'places'
    }
})

registerPlugins(app)

app.mount('#app')
