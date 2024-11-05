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

      {
        path: "/token",
        name: "token",
        component: () => import("../pages/auth/TokenPage.vue"),
    },
    {
        path: "/callback",
        name: "callback",
        component: () => import("../pages/auth/CallbackPage.vue"),
    },
      {
        path: "/learn-yjs",
        name: "learn-yjs",
        component: () => import("../pages/admin/LearnYjs.vue"),
    },
  
    {
        path: "/add_joinees",
        name: "add_joinees",
        component: () => import("../pages/admin/addJoinee.vue"),
    },
    ],
});

export default router;
