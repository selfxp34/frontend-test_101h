import Vue from "vue";

//Main pages
import App from "./views/app.vue";
import store from "./store/store";

const app = new Vue({
    el: "#app",
    components: { App },
    store,
});
