import "./bootstrap";

import { createApp } from "vue";
import App from "./src/App.vue";
import router from "./src/router/index";
import { createPinia } from "pinia";

const importIcons = import.meta.glob("./src/components/icons/**/*.vue");

function registerIcons(app: any) {
    for (const filePath of Object.keys(importIcons)) {
        const fileArray = filePath.split("/");
        const fileName = fileArray.pop();
        const realFileName = fileName?.replace(".vue", "");

        importIcons[filePath]()
            .then(function (data) {
                app.component(realFileName, (data as any).default);
            })
            .catch((error) => console.log(error));
    }
}

const app = createApp(App);
app.use(router);
app.use(createPinia());

registerIcons(app);
app.mount("#app");
