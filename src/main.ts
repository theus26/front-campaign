import { createApp } from "vue";

import App from "@/App.vue";
import { registerPlugins } from "@core/utils/plugins";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
// Styles
import "@core/scss/template/index.scss";
import "@styles/styles.scss";
import vue3GoogleLogin from 'vue3-google-login'
// Create vue app
const app = createApp(App);

// Register plugins
registerPlugins(app);

app.use(vue3GoogleLogin, {
  clientId: '774667302150-9n4fvc3o9p37gte8f9jnesd43k3gvdah.apps.googleusercontent.com'
})

// Mount vue app
app.use(ToastPlugin, {
  position: "top-right",
  duration: 5000,
});
app.mount("#app");
