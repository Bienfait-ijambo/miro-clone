import './bootstrap';


import {createApp} from 'vue'
import App from './src/App.vue'
import router from './src/router/index';
import { createPinia } from 'pinia';


import RedoIcon from "./src/components/RedoIcon.vue";
import UndoIcon from "./src/components/UndoIcon.vue";

import StickyNoteIcon from "./src/components/StickyNoteIcon.vue";
import DocumentIcon from "./src/components/DocumentIcon.vue";
import PersonPlusIcon from "./src/components/PersonPlusIcon.vue";
import TrashIcon from "./src/components/TrashIcon.vue";
import ArrowTopIcon from "./src/components/ArrowTopIcon.vue";
import ArrowDownIcon from './src/components/ArrowDownIcon.vue';

createApp(App)
.use(router)
.use(createPinia())
.component('RedoIcon',RedoIcon)
.component('UndoIcon',UndoIcon)
.component('PersonPlusIcon',PersonPlusIcon)
.component('ArrowTopIcon',ArrowTopIcon)
.component('TrashIcon',TrashIcon)
.component('DocumentIcon',DocumentIcon)
.component('StickyNoteIcon',StickyNoteIcon)
.component('ArrowDownIcon',ArrowDownIcon)






.mount("#app")


