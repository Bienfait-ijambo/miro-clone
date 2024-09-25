import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    // http://127.0.0.1:8000/about
    // http://127.0.0.1:8000/app/login
    history: createWebHistory("/app"),
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../pages/auth/LoginPage.vue"),
        },
        {
            path: "/projects",
            name: "projects",
            component: () => import("../pages/admin/ProjectPage.vue"),
        },
        {
          path: "/project-boards",
          name: "project-board",
          component: () => import("../pages/admin/ProjectBoardPage.vue"),
      },
    ],
});

export default router;
